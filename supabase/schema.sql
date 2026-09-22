-- ====================================================================
-- Community Crisis Intelligence Platform - Supabase PostgreSQL Schema
-- Project: Community_crisis (xdbzmpqufiukerqyqkij)
-- Target: Primary & Authoritative Database
-- ====================================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. DEPARTMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    officer_count INTEGER NOT NULL DEFAULT 0,
    active_incidents_count INTEGER NOT NULL DEFAULT 0,
    resolved_count INTEGER NOT NULL DEFAULT 0,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. USER PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('CITIZEN', 'AUTHORITY', 'ADMIN')),
    department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT,
    employee_id TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. INCIDENTS TABLE (PRIMARY CORE TABLE)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incidents (
    id TEXT PRIMARY KEY,
    incident_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'REJECTED')),
    priority_score NUMERIC NOT NULL DEFAULT 50,
    priority_factors JSONB NOT NULL DEFAULT '{}'::jsonb,
    priority_override JSONB,
    citizen_id TEXT NOT NULL,
    citizen_name TEXT NOT NULL,
    citizen_email TEXT,
    citizen_phone TEXT,
    location JSONB NOT NULL DEFAULT '{}'::jsonb,
    latitude NUMERIC,
    longitude NUMERIC,
    address TEXT,
    district TEXT,
    landmark TEXT,
    media JSONB NOT NULL DEFAULT '[]'::jsonb,
    ai_analysis JSONB,
    assigned_department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
    assigned_department_name TEXT,
    assigned_officer_id TEXT,
    assigned_officer_name TEXT,
    rejection_reason TEXT,
    resolved_at TIMESTAMPTZ,
    resolution_notification JSONB,
    internal_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    public_updates JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. INCIDENT STATUS HISTORY TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incident_status_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT NOT NULL,
    changed_by_name TEXT,
    changed_by_role TEXT NOT NULL,
    reason TEXT,
    is_internal_note BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. INCIDENT ASSIGNMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incident_assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT,
    officer_id TEXT,
    officer_name TEXT,
    assigned_by TEXT NOT NULL,
    assigned_by_role TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. AUDIT LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. KNOWLEDGE DOCUMENTS TABLE (RAG Engine)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    source TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. NOTIFICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    incident_id TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('INFO', 'WARNING', 'SUCCESS', 'CRITICAL')),
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON public.incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_priority_score ON public.incidents(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_citizen_id ON public.incidents(citizen_id);
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_dept ON public.incidents(assigned_department_id);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON public.incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_status_history_incident_id ON public.incident_status_history(incident_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow public / authenticated access via PostgREST with anon/service key
DROP POLICY IF EXISTS "Public read departments" ON public.departments;
CREATE POLICY "Public read departments" ON public.departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write departments" ON public.departments;
CREATE POLICY "Public write departments" ON public.departments FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access user_profiles" ON public.user_profiles;
CREATE POLICY "Public access user_profiles" ON public.user_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read incidents" ON public.incidents;
CREATE POLICY "Public read incidents" ON public.incidents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write incidents" ON public.incidents;
CREATE POLICY "Public write incidents" ON public.incidents FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access incident_status_history" ON public.incident_status_history;
CREATE POLICY "Public access incident_status_history" ON public.incident_status_history FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access incident_assignments" ON public.incident_assignments;
CREATE POLICY "Public access incident_assignments" ON public.incident_assignments FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access audit_logs" ON public.audit_logs;
CREATE POLICY "Public access audit_logs" ON public.audit_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access knowledge_documents" ON public.knowledge_documents;
CREATE POLICY "Public access knowledge_documents" ON public.knowledge_documents FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access notifications" ON public.notifications;
CREATE POLICY "Public access notifications" ON public.notifications FOR ALL USING (true);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
