-- ============================================================================
-- VERIDEX SETUP VERIFICATION SCRIPT
-- Run this to verify your database is set up correctly
-- ============================================================================

-- ============================================================================
-- 1. CHECK ALL TABLES EXIST
-- ============================================================================

SELECT 
  '✅ Tables Check' as status,
  CASE 
    WHEN COUNT(*) = 6 THEN 'PASSED - All 6 tables exist'
    ELSE 'FAILED - Missing tables. Expected 6, found ' || COUNT(*)
  END as result
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'applications',
    'admin_whitelist', 
    'audit_logs',
    'strike_history',
    'policy_changes',
    'email_notifications'
  );

-- ============================================================================
-- 2. CHECK SUPER ADMIN EXISTS
-- ============================================================================

SELECT 
  '✅ Super Admin Check' as status,
  CASE 
    WHEN COUNT(*) > 0 THEN 'PASSED - Super Admin exists: ' || email
    ELSE 'FAILED - No Super Admin found. Run bootstrap.sql'
  END as result
FROM admin_whitelist
WHERE role = 'super_admin'
  AND email = 'onitiloabdurrahman@gmail.com';

-- ============================================================================
-- 3. CHECK ROW LEVEL SECURITY (RLS)
-- ============================================================================

SELECT 
  '✅ RLS Check' as status,
  table_name,
  CASE 
    WHEN row_security = 'YES' THEN '✅ Enabled'
    ELSE '❌ Disabled (Run schema.sql)'
  END as rls_status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'applications',
    'admin_whitelist',
    'audit_logs',
    'strike_history',
    'policy_changes',
    'email_notifications'
  )
ORDER BY table_name;

-- ============================================================================
-- 4. CHECK INDEXES EXIST
-- ============================================================================

SELECT 
  '✅ Indexes Check' as status,
  COUNT(*) as total_indexes,
  CASE 
    WHEN COUNT(*) >= 10 THEN 'PASSED - Indexes created'
    ELSE 'WARNING - Some indexes may be missing'
  END as result
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'applications',
    'admin_whitelist',
    'audit_logs',
    'strike_history',
    'policy_changes',
    'email_notifications'
  );

-- ============================================================================
-- 5. CHECK TEST DATA (Optional)
-- ============================================================================

SELECT 
  '✅ Test Data Check' as status,
  'Applications: ' || COUNT(*) as result
FROM applications;

SELECT 
  '✅ Test Data Check' as status,
  'Audit Logs: ' || COUNT(*) as result
FROM audit_logs;

SELECT 
  '✅ Test Data Check' as status,
  'Strike History: ' || COUNT(*) as result
FROM strike_history;

-- ============================================================================
-- 6. DETAILED ADMIN WHITELIST
-- ============================================================================

SELECT 
  '✅ Admin Whitelist Details' as status,
  email,
  role,
  name,
  added_by,
  TO_CHAR(added_at, 'Mon DD, YYYY HH24:MI') as added_date,
  is_active
FROM admin_whitelist
ORDER BY added_at DESC;

-- ============================================================================
-- 7. APPLICATION STATE SUMMARY
-- ============================================================================

SELECT 
  '✅ Application States' as status,
  application_state,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applications), 1) || '%' as percentage
FROM applications
GROUP BY application_state
ORDER BY count DESC;

-- ============================================================================
-- 8. TRACK DISTRIBUTION
-- ============================================================================

SELECT 
  '✅ Track Distribution' as status,
  track,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applications), 1) || '%' as percentage
FROM applications
GROUP BY track
ORDER BY count DESC;

-- ============================================================================
-- 9. RELIABILITY TIER DISTRIBUTION
-- ============================================================================

SELECT 
  '✅ Reliability Tiers' as status,
  reliability_tier,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applications), 1) || '%' as percentage
FROM applications
WHERE reliability_tier IS NOT NULL
GROUP BY reliability_tier
ORDER BY count DESC;

-- ============================================================================
-- 10. RECENT AUDIT ACTIVITY
-- ============================================================================

SELECT 
  '✅ Recent Audit Logs' as status,
  note,
  actor_id,
  TO_CHAR(timestamp, 'Mon DD, YYYY HH24:MI') as when_occurred
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 5;

-- ============================================================================
-- 11. STORAGE BUCKET CHECK (Manual)
-- ============================================================================

-- NOTE: Storage buckets cannot be verified via SQL
-- Manually verify in Supabase Dashboard → Storage
-- Expected bucket: 'application-documents' (Private, 10MB limit)

SELECT 
  '⚠️ Manual Check Required' as status,
  'Go to Supabase Dashboard → Storage' as instruction,
  'Verify bucket: application-documents exists (Private, 10MB limit)' as action;

-- ============================================================================
-- 12. ENVIRONMENT VARIABLE CHECK (Manual)
-- ============================================================================

SELECT 
  '⚠️ Manual Check Required' as status,
  'Go to Supabase Dashboard → Edge Functions → Secrets' as instruction,
  'Verify RESEND_API_KEY is set' as action;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================

SELECT 
  '=' as divider,
  'SETUP VERIFICATION COMPLETE' as summary,
  '=' as divider2;

SELECT 
  'Next Steps:' as instruction,
  '1. Verify storage bucket exists (application-documents)' as step_1,
  '2. Verify RESEND_API_KEY secret is set' as step_2,
  '3. Merge GitHub PR and deploy' as step_3,
  '4. Navigate to https://your-domain.com/?dex=1' as step_4,
  '5. Login with onitiloabdurrahman@gmail.com' as step_5;

-- ============================================================================
-- END OF VERIFICATION
-- ============================================================================