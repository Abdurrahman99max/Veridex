-- ============================================================================
-- VERIDEX DATABASE SCHEMA
-- High-Trust Student Platform with Role-Based Admin System
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. APPLICATIONS TABLE
-- Stores all student applications (Core Track & Prep Program)
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  university TEXT NOT NULL,
  grad_year TEXT,
  
  -- Application Details
  track TEXT NOT NULL CHECK (track IN ('core', 'prep')),
  skill_category TEXT NOT NULL,
  proof_url TEXT NOT NULL,
  rationale TEXT NOT NULL,
  project_context TEXT,
  motivation TEXT,
  commitment TEXT,
  
  -- Prep Track Specific Fields
  skill_level TEXT,
  learning_methods JSONB,
  weekly_hours TEXT,
  primary_goal TEXT,
  
  -- State Machine States
  application_state TEXT NOT NULL DEFAULT 'APPLIED' 
    CHECK (application_state IN ('APPLIED', 'ROUTED_TO_PREP', 'ACCEPTED', 'REJECTED', 'REVOKED', 'ARCHIVED')),
  account_status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'REVOKED')),
  
  -- Reliability & Trust System
  reliability_tier TEXT DEFAULT 'medium' 
    CHECK (reliability_tier IN ('high', 'medium', 'under_review')),
  strike_count INTEGER DEFAULT 0,
  cooldown_until TIMESTAMPTZ,
  
  -- Admin Feedback
  admin_feedback TEXT,
  
  -- Document Storage
  document_path TEXT,
  
  -- Metadata
  tags JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Archive Tracking
  manual_archive_id TEXT,
  archived_by TEXT,
  archived_at TIMESTAMPTZ
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_state ON applications(application_state);
CREATE INDEX IF NOT EXISTS idx_applications_track ON applications(track);
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON applications(submitted_at DESC);

-- ============================================================================
-- 2. ADMIN WHITELIST TABLE
-- Role-Based Access Control for Admin Team
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_whitelist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  name TEXT,
  added_by TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_whitelist_email ON admin_whitelist(email);
CREATE INDEX IF NOT EXISTS idx_admin_whitelist_role ON admin_whitelist(role);

-- ============================================================================
-- 3. AUDIT LOGS TABLE
-- Immutable audit trail for all admin actions
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL, -- Links to applications.id
  actor_id TEXT NOT NULL, -- Admin email who performed action
  action_type TEXT NOT NULL, -- e.g., 'STATUS_CHANGE', 'STRIKE_ISSUED', 'REROUTE'
  previous_value JSONB,
  new_value JSONB,
  note TEXT NOT NULL, -- Human-readable description
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB -- Additional context (IP, user agent, etc.)
);

-- Index for faster entity lookups
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ============================================================================
-- 4. STRIKE HISTORY TABLE
-- Tracks all strikes issued to students
-- ============================================================================
CREATE TABLE IF NOT EXISTS strike_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  strike_type TEXT NOT NULL CHECK (strike_type IN (
    'POLICY_VIOLATION', 
    'FALSE_INFORMATION', 
    'MISSED_COMMITMENT', 
    'BEHAVIOR_ISSUE',
    'OTHER'
  )),
  reason TEXT NOT NULL,
  issued_by TEXT NOT NULL, -- Admin email
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  strike_number INTEGER NOT NULL, -- 1st, 2nd, 3rd strike
  action_taken TEXT, -- e.g., 'WARNING', 'SUSPENSION', 'REVOCATION'
  cooldown_days INTEGER,
  metadata JSONB
);

-- Index for strike tracking
CREATE INDEX IF NOT EXISTS idx_strike_history_application ON strike_history(application_id);
CREATE INDEX IF NOT EXISTS idx_strike_history_issued ON strike_history(issued_at DESC);

-- ============================================================================
-- 5. POLICY CHANGES TABLE
-- Governance proposals for strike policies and state transitions
-- ============================================================================
CREATE TABLE IF NOT EXISTS policy_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_type TEXT NOT NULL CHECK (policy_type IN ('strike_policy', 'transition_rules', 'admin_permissions')),
  proposed_by TEXT NOT NULL, -- Admin email
  proposed_at TIMESTAMPTZ DEFAULT NOW(),
  current_policy JSONB NOT NULL,
  proposed_policy JSONB NOT NULL,
  justification TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  effective_date TIMESTAMPTZ,
  metadata JSONB
);

-- Index for policy management
CREATE INDEX IF NOT EXISTS idx_policy_changes_status ON policy_changes(status);
CREATE INDEX IF NOT EXISTS idx_policy_changes_proposed ON policy_changes(proposed_at DESC);

-- ============================================================================
-- 6. EMAIL NOTIFICATIONS LOG
-- Track all email notifications sent by the system
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'ADMIN_ADDED',
    'ADMIN_REMOVED',
    'POLICY_PROPOSED',
    'POLICY_APPROVED',
    'POLICY_REJECTED',
    'STRIKE_ISSUED',
    'ACCOUNT_SUSPENDED',
    'ACCOUNT_REVOKED'
  )),
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'SENT' CHECK (status IN ('SENT', 'FAILED', 'PENDING')),
  error_message TEXT,
  metadata JSONB
);

-- Index for email tracking
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON email_notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent ON email_notifications(sent_at DESC);

-- ============================================================================
-- 7. STORAGE BUCKET SETUP (Run this in Supabase Storage UI or via API)
-- ============================================================================
-- Bucket Name: application-documents
-- Public: false (use signed URLs)
-- File Size Limit: 10MB
-- Allowed MIME Types: application/pdf, image/jpeg, image/png, image/jpg

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE strike_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Note: Since admin operations are handled via Edge Functions with service role,
-- we'll create permissive policies that allow service role access only

-- Applications: Service role only
CREATE POLICY "Service role full access" ON applications
  FOR ALL USING (auth.role() = 'service_role');

-- Admin Whitelist: Service role only
CREATE POLICY "Service role full access" ON admin_whitelist
  FOR ALL USING (auth.role() = 'service_role');

-- Audit Logs: Service role only (immutable)
CREATE POLICY "Service role full access" ON audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Strike History: Service role only
CREATE POLICY "Service role full access" ON strike_history
  FOR ALL USING (auth.role() = 'service_role');

-- Policy Changes: Service role only
CREATE POLICY "Service role full access" ON policy_changes
  FOR ALL USING (auth.role() = 'service_role');

-- Email Notifications: Service role only
CREATE POLICY "Service role full access" ON email_notifications
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for applications table
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================
-- Next Steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Create storage bucket: application-documents (via Supabase Dashboard)
-- 3. Run bootstrap.sql to add first Super Admin
-- 4. Run test_data.sql to add sample applicants
-- ============================================================================