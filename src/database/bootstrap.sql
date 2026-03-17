-- ============================================================================
-- VERIDEX SUPER ADMIN BOOTSTRAP
-- One-time script to add the first Super Admin to the system
-- ============================================================================

-- IMPORTANT: Run this ONLY ONCE after setting up the database schema
-- This adds Abdurrahman Onitilo as the first Super Admin

-- ============================================================================
-- 1. ADD FIRST SUPER ADMIN
-- ============================================================================

INSERT INTO admin_whitelist (email, role, name, added_by, added_at, is_active)
VALUES (
  'onitiloabdurrahman@gmail.com',
  'super_admin',
  'Abdurrahman Onitilo',
  'SYSTEM_BOOTSTRAP',
  NOW(),
  true
)
ON CONFLICT (email) DO UPDATE
SET 
  role = 'super_admin',
  name = 'Abdurrahman Onitilo',
  is_active = true;

-- ============================================================================
-- 2. CREATE AUDIT LOG FOR BOOTSTRAP ACTION
-- ============================================================================

INSERT INTO audit_logs (
  entity_id,
  actor_id,
  action_type,
  previous_value,
  new_value,
  note,
  timestamp
)
VALUES (
  uuid_generate_v4(), -- Placeholder UUID
  'SYSTEM',
  'ADMIN_BOOTSTRAP',
  NULL,
  jsonb_build_object(
    'email', 'onitiloabdurrahman@gmail.com',
    'role', 'super_admin',
    'name', 'Abdurrahman Onitilo'
  ),
  'System bootstrapped first Super Admin: Abdurrahman Onitilo',
  NOW()
);

-- ============================================================================
-- 3. VERIFICATION QUERY
-- ============================================================================

-- Run this to verify the Super Admin was added successfully:
SELECT 
  email,
  role,
  name,
  added_by,
  added_at,
  is_active
FROM admin_whitelist
WHERE email = 'onitiloabdurrahman@gmail.com';

-- ============================================================================
-- BOOTSTRAP COMPLETE
-- ============================================================================
-- You can now log in to the Admin Hub at:
-- https://your-veridex-domain.com/?dex=1
-- 
-- Email: onitiloabdurrahman@gmail.com
-- (Use your Google login)
-- ============================================================================

-- ============================================================================
-- OPTIONAL: Add Additional Super Admins or Team Members
-- ============================================================================

-- Example: Add another Super Admin
-- INSERT INTO admin_whitelist (email, role, name, added_by, added_at, is_active)
-- VALUES (
--   'another.admin@example.com',
--   'super_admin',
--   'Jane Doe',
--   'onitiloabdurrahman@gmail.com',
--   NOW(),
--   true
-- );

-- Example: Add an Admin
-- INSERT INTO admin_whitelist (email, role, name, added_by, added_at, is_active)
-- VALUES (
--   'regular.admin@example.com',
--   'admin',
--   'John Smith',
--   'onitiloabdurrahman@gmail.com',
--   NOW(),
--   true
-- );

-- Example: Add a Moderator
-- INSERT INTO admin_whitelist (email, role, name, added_by, added_at, is_active)
-- VALUES (
--   'moderator@example.com',
--   'moderator',
--   'Sarah Johnson',
--   'onitiloabdurrahman@gmail.com',
--   NOW(),
--   true
-- );
