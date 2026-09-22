import fs from "fs";
import path from "path";
import { Incident, Department, KnowledgeDocument, AuditLog, AppNotification, UserProfile } from "../types";
import {
  initialIncidents,
  initialDepartments,
  sampleUsers,
  sampleKnowledgeBase,
  sampleAuditLogs,
  sampleNotifications,
} from "../data/mockData";

export interface DataStore {
  incidents: Incident[];
  departments: Department[];
  users: UserProfile[];
  knowledge: KnowledgeDocument[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "db_store.json");

/**
 * Ensures the data directory exists and returns loaded store or initial defaults
 */
export function loadDataStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const fileContent = fs.readFileSync(STORE_FILE, "utf-8");
      const data = JSON.parse(fileContent) as Partial<DataStore>;
      
      console.log(`[Storage] Loaded persistent JSON store from ${STORE_FILE}`);
      return {
        incidents: Array.isArray(data.incidents) && data.incidents.length > 0 ? data.incidents : [...initialIncidents],
        departments: Array.isArray(data.departments) && data.departments.length > 0 ? data.departments : [...initialDepartments],
        users: Array.isArray(data.users) && data.users.length > 0 ? data.users : [...sampleUsers],
        knowledge: Array.isArray(data.knowledge) && data.knowledge.length > 0 ? data.knowledge : [...sampleKnowledgeBase],
        auditLogs: Array.isArray(data.auditLogs) ? data.auditLogs : [...sampleAuditLogs],
        notifications: Array.isArray(data.notifications) ? data.notifications : [...sampleNotifications],
      };
    }
  } catch (err: any) {
    console.error("[Storage Error] Failed to load data store, using initial defaults:", err.message);
  }

  // Default fallback
  const initialStore: DataStore = {
    incidents: [...initialIncidents],
    departments: [...initialDepartments],
    users: [...sampleUsers],
    knowledge: [...sampleKnowledgeBase],
    auditLogs: [...sampleAuditLogs],
    notifications: [...sampleNotifications],
  };

  saveDataStore(initialStore);
  return initialStore;
}

/**
 * Saves the current data store to disk asynchronously or synchronously
 */
export function saveDataStore(store: DataStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
    console.log(`[Storage] Persistent database updated on disk (${store.incidents.length} incidents saved).`);
  } catch (err: any) {
    console.error("[Storage Error] Failed to write data store to disk:", err.message);
  }
}
