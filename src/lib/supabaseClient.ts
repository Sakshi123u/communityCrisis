import { createClient, SupabaseClient } from "@supabase/supabase-js";

const env = (import.meta as any).env || {};

const SUPABASE_URL =
  env.VITE_SUPABASE_URL || "https://xdbzmpqufiukerqyqkij.supabase.co";
const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY || "sb_publishable_eCLutund6vtzvWiCCjl0Dg_KCtqNTCk";

export const PROJECT_NAME = "Community_crisis";
export const PROJECT_ID = "xdbzmpqufiukerqyqkij";

let clientInstance: SupabaseClient | null = null;

export function getClientSupabase(): SupabaseClient {
  if (!clientInstance) {
    const cleanUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
    clientInstance = createClient(cleanUrl, SUPABASE_ANON_KEY);
  }
  return clientInstance;
}
