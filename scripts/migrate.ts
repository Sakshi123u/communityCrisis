/**
 * Database Migration Script
 * Imports initial data into Supabase PostgreSQL tables
 */

import {
  initialIncidents,
  initialDepartments,
  sampleUsers,
  sampleKnowledgeBase,
  sampleAuditLogs,
} from "../src/data/mockData";
import {
  getSupabase,
  mapIncidentToRow,
  mapDepartmentToRow,
  mapUserProfileToRow,
  ensureStorageBucket,
  processMediaAttachments,
} from "../src/db/supabaseService";
import fs from "fs";
import path from "path";

async function runMigration() {
  console.log("==================================================");
  console.log("[Migration] Starting Supabase Data Migration...");
  console.log("==================================================");

  const supabase = getSupabase();
  await ensureStorageBucket();

  // Load existing store if available
  let sourceIncidents = initialIncidents;
  let sourceDepartments = initialDepartments;
  let sourceUsers = sampleUsers;
  let sourceKnowledge = sampleKnowledgeBase;
  let sourceAuditLogs = sampleAuditLogs;

  const storePath = path.join(process.cwd(), "data", "db_store.json");
  if (fs.existsSync(storePath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(storePath, "utf-8"));
      if (raw.incidents?.length) sourceIncidents = raw.incidents;
      if (raw.departments?.length) sourceDepartments = raw.departments;
      if (raw.users?.length) sourceUsers = raw.users;
      if (raw.knowledge?.length) sourceKnowledge = raw.knowledge;
      if (raw.auditLogs?.length) sourceAuditLogs = raw.auditLogs;
      console.log(`[Migration] Loaded ${sourceIncidents.length} incidents from data/db_store.json`);
    } catch (e: any) {
      console.warn(`[Migration] Notice reading db_store.json: ${e.message}`);
    }
  }

  // 1. Migrate Departments
  console.log(`[Migration] Migrating ${sourceDepartments.length} departments...`);
  for (const dept of sourceDepartments) {
    const row = mapDepartmentToRow(dept);
    const { error } = await supabase.from("departments").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn(`[Migration] Department ${dept.name} notice: ${error.message}`);
    }
  }

  // 2. Migrate User Profiles
  console.log(`[Migration] Migrating ${sourceUsers.length} user profiles...`);
  for (const user of sourceUsers) {
    const row = mapUserProfileToRow(user);
    const { error } = await supabase.from("user_profiles").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn(`[Migration] User ${user.email} notice: ${error.message}`);
    }
  }

  // 3. Migrate Knowledge Documents
  console.log(`[Migration] Migrating ${sourceKnowledge.length} knowledge documents...`);
  for (const doc of sourceKnowledge) {
    const { error } = await supabase.from("knowledge_documents").upsert(
      {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        content: doc.content,
        summary: doc.summary,
        source: doc.source,
        updated_at: doc.updatedAt,
      },
      { onConflict: "id" }
    );
    if (error) {
      console.warn(`[Migration] Knowledge doc ${doc.title} notice: ${error.message}`);
    }
  }

  // 4. Migrate Incidents & Media
  console.log(`[Migration] Migrating ${sourceIncidents.length} incidents & processing media...`);
  for (const inc of sourceIncidents) {
    // Process any base64 media into Supabase Storage
    const processedMedia = await processMediaAttachments(inc.media || [], inc.id);
    const incToSave = { ...inc, media: processedMedia };
    const row = mapIncidentToRow(incToSave);

    const { error } = await supabase.from("incidents").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn(`[Migration] Incident ${inc.id} notice: ${error.message}`);
    } else {
      // Create initial status history entry
      await supabase.from("incident_status_history").insert({
        incident_id: inc.id,
        old_status: null,
        new_status: inc.status,
        changed_by: inc.citizenId || "system",
        changed_by_name: inc.citizenName || "System Seed",
        changed_by_role: "CITIZEN",
        reason: "Initial migration record",
        created_at: inc.createdAt,
      });
    }
  }

  // 5. Migrate Audit Logs
  console.log(`[Migration] Migrating ${sourceAuditLogs.length} audit logs...`);
  for (const log of sourceAuditLogs) {
    const { error } = await supabase.from("audit_logs").insert({
      id: log.id,
      actor_id: log.actorId,
      actor_name: log.actorName,
      actor_role: log.actorRole,
      action: log.action,
      target_id: log.targetId,
      details: log.details,
      timestamp: log.timestamp,
    });
    if (error && !error.message.includes("duplicate key")) {
      console.warn(`[Migration] Audit log notice: ${error.message}`);
    }
  }

  console.log("==================================================");
  console.log("[Migration] Supabase Data Migration Completed!");
  console.log("==================================================");
}

runMigration().catch((err) => {
  console.error("[Migration Error]", err);
});
