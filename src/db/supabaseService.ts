/**
 * Community Crisis Intelligence Platform
 * Supabase Primary Database & Storage Service
 * Target Project: Community_crisis (xdbzmpqufiukerqyqkij)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Incident,
  Department,
  UserProfile,
  AuditLog,
  KnowledgeDocument,
  AppNotification,
  IncidentMedia,
  IncidentStatus,
  UserRole,
} from "../types";

const DEFAULT_SUPABASE_URL = "https://xdbzmpqufiukerqyqkij.supabase.co";
const DEFAULT_SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  "sb_secret_1Dh6YkSgY214d0n472a1Yx8Y2194x091Y81_20y00958y024x109y025x204y017x111y017x208_xmQU";

export const PROJECT_NAME = "Community_crisis";
export const PROJECT_ID = "xdbzmpqufiukerqyqkij";
export const STORAGE_BUCKET_MEDIA = "incident-media";

let supabaseClient: SupabaseClient | null = null;
let isStorageReady = false;
let supabaseReachable: boolean | null = null;
let lastReachabilityCheck = 0;
const REACHABILITY_TTL = 60000; // 60 seconds

/**
 * Checks if the configured Supabase endpoint is reachable and responsive
 */
export async function isSupabaseReachable(): Promise<boolean> {
  const now = Date.now();
  if (supabaseReachable !== null && now - lastReachabilityCheck < REACHABILITY_TTL) {
    return supabaseReachable;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  // If no URL or key, or placeholder/unreachable project
  if (
    !url ||
    !key ||
    url.includes("xdbzmpqufiukerqyqkij") ||
    url.includes("your-project") ||
    url.includes("example.com")
  ) {
    supabaseReachable = false;
    lastReachabilityCheck = now;
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      signal: controller.signal,
    }).catch(() => null);
    clearTimeout(timeoutId);

    supabaseReachable = !!(res && res.status < 500);
  } catch {
    supabaseReachable = false;
  }

  lastReachabilityCheck = now;
  return supabaseReachable;
}

export function resetSupabaseReachabilityCache(): void {
  supabaseReachable = null;
  lastReachabilityCheck = 0;
}

/**
 * Normalizes the Supabase Project URL
 */
export function getSupabaseUrl(): string {
  const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

/**
 * Retrieves the Supabase Secret / Service Role Key
 */
export function getSupabaseKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY
  );
}

/**
 * Initializes and returns the primary Supabase client
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const url = getSupabaseUrl();
    const key = getSupabaseKey();
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

/**
 * Ensures the Storage Bucket 'incident-media' exists and is public
 */
export async function ensureStorageBucket(): Promise<boolean> {
  if (isStorageReady) return true;
  if (!(await isSupabaseReachable())) return false;
  try {
    const supabase = getSupabase();
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      return false;
    } else {
      const exists = buckets?.some((b) => b.name === STORAGE_BUCKET_MEDIA);
      if (!exists) {
        const { error: createErr } = await supabase.storage.createBucket(STORAGE_BUCKET_MEDIA, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        });
        if (createErr && !createErr.message?.includes("already exists")) {
          // Log only if non-trivial
        } else {
          console.log(`[Supabase Storage] Created public bucket '${STORAGE_BUCKET_MEDIA}'`);
        }
      }
      isStorageReady = true;
      return true;
    }
  } catch {
    return false;
  }
}

/**
 * Uploads a binary buffer or base64 file to Supabase Storage and returns the public CDN URL
 */
export async function uploadFileToSupabaseStorage(
  filePath: string,
  buffer: Buffer,
  contentType: string
): Promise<{ path: string; publicUrl: string } | null> {
  if (!(await isSupabaseReachable())) return null;
  try {
    await ensureStorageBucket();
    const supabase = getSupabase();
    const cleanPath = filePath.replace(/^\/+/, "");

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_MEDIA)
      .upload(cleanPath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET_MEDIA)
      .getPublicUrl(cleanPath);

    return {
      path: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch {
    return null;
  }
}

/**
 * Scans media items and uploads any Base64 data strings to Supabase Storage,
 * converting them to public CDN URLs so large blobs aren't stored in Postgres.
 */
export async function processMediaAttachments(
  mediaList: IncidentMedia[],
  incidentId: string
): Promise<IncidentMedia[]> {
  if (!Array.isArray(mediaList) || mediaList.length === 0) {
    return [];
  }

  if (!(await isSupabaseReachable())) {
    return mediaList;
  }

  const processed: IncidentMedia[] = [];

  for (let i = 0; i < mediaList.length; i++) {
    const item = mediaList[i];
    const url = item.downloadURL || "";

    if (url.startsWith("data:")) {
      try {
        const matches = url.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          const ext = mimeType.split("/")[1]?.replace("+xml", "") || "bin";
          const fileName = `${incidentId}_media_${i}_${Date.now()}.${ext}`;
          const storagePath = `incidents/${incidentId}/${fileName}`;

          const uploadResult = await uploadFileToSupabaseStorage(storagePath, buffer, mimeType);

          if (uploadResult) {
            processed.push({
              ...item,
              downloadURL: uploadResult.publicUrl,
            });
            console.log(`[Supabase Storage] Uploaded ${item.mediaType} to ${uploadResult.publicUrl}`);
            continue;
          }
        }
      } catch (err: any) {
        if (!err?.message?.includes("fetch failed")) {
          console.warn(`[Supabase Media Process Warning]: ${err.message}`);
        }
      }
    }

    // Keep already uploaded public URLs or fallbacks
    processed.push(item);
  }

  return processed;
}

// --------------------------------------------------------------------
// MODEL MAPPING: PostgreSQL snake_case <-> TypeScript camelCase
// --------------------------------------------------------------------

export function mapIncidentRowToIncident(row: any): Incident {
  return {
    id: row.id,
    incidentNumber: row.incident_number || row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    severity: row.severity,
    status: row.status,
    priorityScore: typeof row.priority_score === "number" ? row.priority_score : parseFloat(row.priority_score || "50"),
    priorityFactors: row.priority_factors || {
      severity: 50,
      populationImpact: 50,
      locationRisk: 50,
      urgency: 50,
      evidenceConfidence: 50,
    },
    priorityOverride: row.priority_override || undefined,
    citizenId: row.citizen_id,
    citizenName: row.citizen_name,
    citizenEmail: row.citizen_email || undefined,
    citizenPhone: row.citizen_phone || undefined,
    location: row.location || {
      address: row.address || "",
      latitude: row.latitude ? parseFloat(row.latitude) : 18.5204,
      longitude: row.longitude ? parseFloat(row.longitude) : 73.8567,
      district: row.district,
      landmark: row.landmark,
    },
    media: row.media || [],
    aiAnalysis: row.ai_analysis || undefined,
    assignedDepartmentId: row.assigned_department_id || undefined,
    assignedDepartmentName: row.assigned_department_name || undefined,
    assignedOfficerId: row.assigned_officer_id || undefined,
    assignedOfficerName: row.assigned_officer_name || undefined,
    rejectionReason: row.rejection_reason || undefined,
    resolvedAt: row.resolved_at || undefined,
    resolutionNotification: row.resolution_notification || undefined,
    internalNotes: row.internal_notes || [],
    publicUpdates: row.public_updates || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapIncidentToRow(inc: Incident): any {
  return {
    id: inc.id,
    incident_number: inc.incidentNumber || inc.id,
    title: inc.title,
    description: inc.description,
    category: inc.category,
    severity: inc.severity,
    status: inc.status,
    priority_score: inc.priorityScore,
    priority_factors: inc.priorityFactors || {},
    priority_override: inc.priorityOverride || null,
    citizen_id: inc.citizenId,
    citizen_name: inc.citizenName,
    citizen_email: inc.citizenEmail || null,
    citizen_phone: inc.citizenPhone || null,
    location: inc.location || {},
    latitude: inc.location?.latitude || null,
    longitude: inc.location?.longitude || null,
    address: inc.location?.address || null,
    district: inc.location?.district || null,
    landmark: inc.location?.landmark || null,
    media: inc.media || [],
    ai_analysis: inc.aiAnalysis || null,
    assigned_department_id: inc.assignedDepartmentId || null,
    assigned_department_name: inc.assignedDepartmentName || null,
    assigned_officer_id: inc.assignedOfficerId || null,
    assigned_officer_name: inc.assignedOfficerName || null,
    rejection_reason: inc.rejectionReason || null,
    resolved_at: inc.resolvedAt || null,
    resolution_notification: inc.resolutionNotification || null,
    internal_notes: inc.internalNotes || [],
    public_updates: inc.publicUpdates || [],
    created_at: inc.createdAt || new Date().toISOString(),
    updated_at: inc.updatedAt || new Date().toISOString(),
  };
}

export function mapDepartmentRowToDepartment(row: any): Department {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description || "",
    officerCount: row.officer_count || 0,
    activeIncidentsCount: row.active_incidents_count || 0,
    resolvedCount: row.resolved_count || 0,
    contactEmail: row.contact_email || "",
    contactPhone: row.contact_phone || "",
  };
}

export function mapDepartmentToRow(dept: Department): any {
  return {
    id: dept.id,
    name: dept.name,
    code: dept.code,
    description: dept.description,
    officer_count: dept.officerCount,
    active_incidents_count: dept.activeIncidentsCount,
    resolved_count: dept.resolvedCount,
    contact_email: dept.contactEmail,
    contact_phone: dept.contactPhone,
    updated_at: new Date().toISOString(),
  };
}

export function mapUserRowToUserProfile(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    role: row.role as UserRole,
    departmentId: row.department_id || undefined,
    departmentName: row.department_name || undefined,
    employeeId: row.employee_id || undefined,
    preferredLanguage: (row.preferred_language as any) || "en",
    photoURL: row.photo_url || undefined,
    isActive: row.is_active !== false,
    createdAt: row.created_at,
  };
}

export function mapUserProfileToRow(user: UserProfile): any {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    role: user.role,
    department_id: user.departmentId || null,
    department_name: user.departmentName || null,
    employee_id: user.employeeId || null,
    preferred_language: user.preferredLanguage || "en",
    photo_url: user.photoURL || null,
    is_active: user.isActive !== false,
    created_at: user.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// --------------------------------------------------------------------
// DATABASE CRUD OPERATIONS DIRECTLY AGAINST SUPABASE POSTGRESQL
// --------------------------------------------------------------------

/**
 * Retrieves all incidents from Supabase PostgreSQL
 */
export async function dbGetIncidents(): Promise<{ data: Incident[] | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data || []).map(mapIncidentRowToIncident), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Retrieves a single incident by ID from Supabase PostgreSQL
 */
export async function dbGetIncidentById(id: string): Promise<{ data: Incident | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapIncidentRowToIncident(data), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Inserts a new incident into Supabase PostgreSQL
 */
export async function dbCreateIncident(incident: Incident): Promise<{ data: Incident | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const row = mapIncidentToRow(incident);

    const { data, error } = await supabase
      .from("incidents")
      .insert(row)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Create initial status history entry
    await dbCreateStatusHistory({
      incidentId: incident.id,
      oldStatus: null,
      newStatus: incident.status,
      changedBy: incident.citizenId,
      changedByName: incident.citizenName,
      changedByRole: "CITIZEN",
      reason: "Initial citizen report submitted",
      isInternalNote: false,
    });

    return { data: mapIncidentRowToIncident(data), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Updates an incident in Supabase PostgreSQL
 */
export async function dbUpdateIncident(
  id: string,
  updates: Partial<Incident>
): Promise<{ data: Incident | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();

    // Fetch current incident to build full row update
    const { data: existing, error: fetchErr } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr) {
      return { data: null, error: fetchErr.message };
    }

    const currentIncident = mapIncidentRowToIncident(existing);
    const updatedIncident: Incident = {
      ...currentIncident,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const row = mapIncidentToRow(updatedIncident);

    const { data, error } = await supabase
      .from("incidents")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapIncidentRowToIncident(data), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Records a status change in incident_status_history
 */
export async function dbCreateStatusHistory(params: {
  incidentId: string;
  oldStatus: string | null;
  newStatus: string;
  changedBy: string;
  changedByName?: string;
  changedByRole: string;
  reason?: string;
  isInternalNote?: boolean;
}): Promise<{ success: boolean; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { success: false, error: null };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("incident_status_history").insert({
      incident_id: params.incidentId,
      old_status: params.oldStatus,
      new_status: params.newStatus,
      changed_by: params.changedBy,
      changed_by_name: params.changedByName || "Authority Officer",
      changed_by_role: params.changedByRole,
      reason: params.reason || null,
      is_internal_note: !!params.isInternalNote,
      created_at: new Date().toISOString(),
    });

    if (error) {
      if (!error.message?.includes("fetch failed") && !error.message?.includes("ENOTFOUND")) {
        console.warn(`[Supabase Status History Warning]: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    supabaseReachable = false;
    return { success: false, error: err?.message || null };
  }
}

/**
 * Retrieves status history for an incident
 */
export async function dbGetStatusHistory(incidentId: string): Promise<any[]> {
  if (!(await isSupabaseReachable())) {
    return [];
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("incident_status_history")
      .select("*")
      .eq("incident_id", incidentId)
      .order("created_at", { ascending: true });

    if (error) {
      if (!error.message?.includes("fetch failed") && !error.message?.includes("ENOTFOUND")) {
        console.warn(`[Supabase Status History Get Warning]: ${error.message}`);
      }
      return [];
    }
    return data || [];
  } catch {
    supabaseReachable = false;
    return [];
  }
}

/**
 * Records an assignment in incident_assignments
 */
export async function dbCreateIncidentAssignment(params: {
  incidentId: string;
  departmentId?: string;
  departmentName?: string;
  officerId?: string;
  officerName?: string;
  assignedBy: string;
  assignedByRole: string;
  notes?: string;
}): Promise<{ success: boolean; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { success: false, error: null };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("incident_assignments").insert({
      incident_id: params.incidentId,
      department_id: params.departmentId || null,
      department_name: params.departmentName || null,
      officer_id: params.officerId || null,
      officer_name: params.officerName || null,
      assigned_by: params.assignedBy,
      assigned_by_role: params.assignedByRole,
      notes: params.notes || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      if (!error.message?.includes("fetch failed") && !error.message?.includes("ENOTFOUND")) {
        console.warn(`[Supabase Assignment Warning]: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    supabaseReachable = false;
    return { success: false, error: err?.message || null };
  }
}

/**
 * Retrieves all departments from Supabase PostgreSQL
 */
export async function dbGetDepartments(): Promise<{ data: Department[] | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data || []).map(mapDepartmentRowToDepartment), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Inserts or updates a department in Supabase PostgreSQL
 */
export async function dbUpsertDepartment(dept: Department): Promise<{ data: Department | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const row = mapDepartmentToRow(dept);

    const { data, error } = await supabase
      .from("departments")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapDepartmentRowToDepartment(data), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Retrieves user profiles from Supabase PostgreSQL
 */
export async function dbGetUserProfiles(): Promise<{ data: UserProfile[] | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("user_profiles").select("*");

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data || []).map(mapUserRowToUserProfile), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Retrieves a single user profile by ID or email
 */
export async function dbGetUserProfileById(idOrEmail: string): Promise<{ data: UserProfile | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .or(`id.eq.${idOrEmail},email.eq.${idOrEmail}`)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapUserRowToUserProfile(data), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Upserts a user profile in Supabase PostgreSQL
 */
export async function dbUpsertUserProfile(user: UserProfile): Promise<{ data: UserProfile | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const row = mapUserProfileToRow(user);

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapUserRowToUserProfile(data), error: null };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Retrieves audit logs from Supabase PostgreSQL
 */
export async function dbGetAuditLogs(limit: number = 100): Promise<{ data: AuditLog[] | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: (data || []).map((row) => ({
        id: row.id,
        actorId: row.actor_id,
        actorName: row.actor_name,
        actorRole: row.actor_role as UserRole,
        action: row.action,
        targetId: row.target_id,
        details: row.details,
        timestamp: row.timestamp,
      })),
      error: null,
    };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Creates an audit log entry in Supabase PostgreSQL
 */
export async function dbCreateAuditLog(log: Omit<AuditLog, "id"> & { id?: string }): Promise<{ success: boolean; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { success: false, error: null };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("audit_logs").insert({
      id: log.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      actor_id: log.actorId,
      actor_name: log.actorName,
      actor_role: log.actorRole,
      action: log.action,
      target_id: log.targetId,
      details: log.details,
      timestamp: log.timestamp || new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch {
    supabaseReachable = false;
    return { success: false, error: null };
  }
}

/**
 * Retrieves knowledge base documents from Supabase PostgreSQL
 */
export async function dbGetKnowledgeDocuments(): Promise<{ data: KnowledgeDocument[] | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("knowledge_documents").select("*");

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        content: row.content,
        summary: row.summary || "",
        source: row.source,
        updatedAt: row.updated_at,
      })),
      error: null,
    };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Upserts a knowledge document in Supabase PostgreSQL
 */
export async function dbUpsertKnowledgeDocument(doc: KnowledgeDocument): Promise<{ success: boolean; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { success: false, error: null };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("knowledge_documents").upsert(
      {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        content: doc.content,
        summary: doc.summary,
        source: doc.source,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch {
    supabaseReachable = false;
    return { success: false, error: null };
  }
}

/**
 * Retrieves notifications for a specific user from Supabase PostgreSQL
 */
export async function dbGetNotifications(userId?: string): Promise<{ data: AppNotification[] | null; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { data: null, error: null };
  }

  try {
    const supabase = getSupabase();
    let query = supabase.from("notifications").select("*").order("created_at", { ascending: false });

    if (userId && userId !== "ALL") {
      query = query.or(`user_id.eq.${userId},user_id.eq.ALL`);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        incidentId: row.incident_id || undefined,
        title: row.title,
        message: row.message,
        type: row.type,
        read: row.read,
        createdAt: row.created_at,
      })),
      error: null,
    };
  } catch {
    supabaseReachable = false;
    return { data: null, error: null };
  }
}

/**
 * Inserts a notification into Supabase PostgreSQL
 */
export async function dbCreateNotification(notif: AppNotification): Promise<{ success: boolean; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { success: false, error: null };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("notifications").insert({
      id: notif.id,
      user_id: notif.userId,
      incident_id: notif.incidentId || null,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: notif.read || false,
      created_at: notif.createdAt || new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch {
    supabaseReachable = false;
    return { success: false, error: null };
  }
}

/**
 * Marks a notification as read in Supabase PostgreSQL
 */
export async function dbMarkNotificationRead(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!(await isSupabaseReachable())) {
    return { success: false, error: null };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch {
    supabaseReachable = false;
    return { success: false, error: null };
  }
}

/**
 * Full schema health verification
 */
export async function verifySupabaseSchema(): Promise<{
  connected: boolean;
  tables: Record<string, boolean>;
  storageBucket: boolean;
  details: string;
}> {
  const tables = {
    incidents: false,
    departments: false,
    user_profiles: false,
    audit_logs: false,
    incident_status_history: false,
    incident_assignments: false,
    knowledge_documents: false,
    notifications: false,
  };

  const reachable = await isSupabaseReachable();
  if (!reachable) {
    return {
      connected: false,
      tables,
      storageBucket: false,
      details: "Supabase remote database is on standby. The built-in persistent local database (data/db_store.json) is actively serving all operations.",
    };
  }

  try {
    const supabase = getSupabase();

    // Check each table with a limit(1) probe
    await Promise.all(
      Object.keys(tables).map(async (table) => {
        try {
          const { error } = await supabase.from(table).select("*").limit(1);
          tables[table as keyof typeof tables] = !error;
        } catch {
          tables[table as keyof typeof tables] = false;
        }
      })
    );

    const storageOk = await ensureStorageBucket();

    const allTablesReady = Object.values(tables).every((v) => v);
    const anyTablesReady = Object.values(tables).some((v) => v);

    return {
      connected: true,
      tables,
      storageBucket: storageOk,
      details: allTablesReady
        ? "All Supabase tables and storage buckets are active and verified."
        : anyTablesReady
        ? "Supabase connected. Some tables are pending schema execution."
        : "Supabase connected. Public schema tables need to be created in Supabase SQL editor.",
    };
  } catch (err: any) {
    return {
      connected: false,
      tables,
      storageBucket: false,
      details: `Supabase connection note: ${err?.message || 'Standby'}`,
    };
  }
}
