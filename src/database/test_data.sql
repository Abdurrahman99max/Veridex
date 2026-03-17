-- ============================================================================
-- VERIDEX TEST DATA
-- Sample applicants for testing the Admin Hub functionality
-- ============================================================================

-- IMPORTANT: Run this AFTER schema.sql and bootstrap.sql
-- This creates realistic test data to verify all admin features work correctly

-- ============================================================================
-- 1. CORE TRACK APPLICANTS (Various States)
-- ============================================================================

-- Test Applicant 1: Pending Review (APPLIED)
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  project_context,
  motivation,
  commitment,
  application_state,
  account_status,
  reliability_tier,
  strike_count,
  tags,
  submitted_at
) VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'Sarah Chen',
  'sarah.chen@stanford.edu',
  'Stanford University',
  '2026',
  'core',
  'Full-Stack Development',
  'https://github.com/sarahchen/portfolio',
  'Built a real-time collaborative code editor using WebSockets and React. Scaled to 10k concurrent users with Redis caching.',
  'Led development for Stanford CS Department internal tools',
  'I want to contribute to high-impact startups building developer tools',
  'Available 15-20 hours/week, can start immediately',
  'APPLIED',
  'ACTIVE',
  'medium',
  0,
  '["full-stack", "react", "node", "websockets"]'::jsonb,
  NOW() - INTERVAL '2 days'
);

-- Test Applicant 2: Accepted & High Reliability
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  project_context,
  motivation,
  commitment,
  application_state,
  account_status,
  reliability_tier,
  strike_count,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'a2222222-2222-2222-2222-222222222222',
  'Marcus Johnson',
  'marcus.j@mit.edu',
  'MIT',
  '2025',
  'core',
  'Machine Learning Engineering',
  'https://github.com/marcusj/ml-projects',
  'Published research paper on efficient neural architecture search. Implemented custom CUDA kernels for 3x speedup.',
  'Research assistant at MIT CSAIL, working on AutoML systems',
  'Passionate about making ML accessible to smaller teams',
  'Available 20+ hours/week, flexible schedule',
  'ACCEPTED',
  'ACTIVE',
  'high',
  0,
  'Exceptional technical depth. Strong communication skills. Verified via portfolio review.',
  '["machine-learning", "python", "pytorch", "research"]'::jsonb,
  NOW() - INTERVAL '15 days'
);

-- Test Applicant 3: Rejected (Portfolio Insufficient)
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  project_context,
  application_state,
  account_status,
  reliability_tier,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'a3333333-3333-3333-3333-333333333333',
  'Emily Rodriguez',
  'emily.r@ucla.edu',
  'UCLA',
  '2027',
  'core',
  'Mobile Development',
  'https://github.com/emily/todo-app',
  'Built a mobile app for tracking daily tasks',
  'Personal project',
  'REJECTED',
  'ACTIVE',
  'under_review',
  'Portfolio shows basic understanding but lacks depth required for Core Track. Consider Prep Program to build more substantial projects.',
  '["mobile", "react-native"]'::jsonb,
  NOW() - INTERVAL '10 days'
);

-- Test Applicant 4: Routed to Prep Program
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  application_state,
  account_status,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'a4444444-4444-4444-4444-444444444444',
  'David Kim',
  'david.kim@berkeley.edu',
  'UC Berkeley',
  '2026',
  'core',
  'Backend Development',
  'https://github.com/davidk/api-project',
  'Created a REST API for a student club management system',
  'ROUTED_TO_PREP',
  'ACTIVE',
  'Good foundational skills. Would benefit from Prep Program mentorship before joining Core Track.',
  '["backend", "node", "express"]'::jsonb,
  NOW() - INTERVAL '7 days'
);

-- Test Applicant 5: Under Review with Strike (Warning)
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  application_state,
  account_status,
  reliability_tier,
  strike_count,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'a5555555-5555-5555-5555-555555555555',
  'Jessica Martinez',
  'jessica.m@columbia.edu',
  'Columbia University',
  '2025',
  'core',
  'DevOps Engineering',
  'https://github.com/jessicam/infra',
  'Automated deployment pipeline for microservices using Kubernetes and Terraform',
  'ACCEPTED',
  'ACTIVE',
  'under_review',
  1,
  'Strong technical skills. Received 1 strike for missed commitment deadline.',
  '["devops", "kubernetes", "terraform", "ci-cd"]'::jsonb,
  NOW() - INTERVAL '20 days'
);

-- ============================================================================
-- 2. PREP PROGRAM APPLICANTS
-- ============================================================================

-- Prep Applicant 1: Active in Program
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  skill_level,
  learning_methods,
  weekly_hours,
  primary_goal,
  application_state,
  account_status,
  tags,
  submitted_at
) VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'Alex Thompson',
  'alex.t@nyu.edu',
  'NYU',
  '2027',
  'prep',
  'Web Development',
  'https://github.com/alext/learning-projects',
  'Completed freeCodeCamp responsive web design certification. Building personal portfolio.',
  'beginner',
  '["online courses", "documentation", "hands-on projects"]'::jsonb,
  '10-15 hours',
  'Build production-ready web applications',
  'APPLIED',
  'ACTIVE',
  '["prep-program", "web-dev", "beginner"]'::jsonb,
  NOW() - INTERVAL '3 days'
);

-- Prep Applicant 2: Ready for Promotion
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  skill_level,
  learning_methods,
  weekly_hours,
  primary_goal,
  application_state,
  account_status,
  reliability_tier,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'Priya Patel',
  'priya.p@gatech.edu',
  'Georgia Tech',
  '2026',
  'prep',
  'Data Engineering',
  'https://github.com/priyap/data-pipeline',
  'Completed 3 substantial projects: ETL pipeline, data warehouse design, and real-time analytics dashboard.',
  'intermediate',
  '["mentorship", "project-based learning", "peer collaboration"]'::jsonb,
  '15-20 hours',
  'Transition to Core Track and work on production data systems',
  'ROUTED_TO_PREP',
  'ACTIVE',
  'high',
  'Excellent progress in Prep Program. Ready for Core Track promotion.',
  '["prep-program", "data-engineering", "graduation-ready"]'::jsonb,
  NOW() - INTERVAL '90 days'
);

-- ============================================================================
-- 3. EDGE CASES FOR TESTING
-- ============================================================================

-- Test Case: Suspended Account (Multiple Strikes)
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  application_state,
  account_status,
  reliability_tier,
  strike_count,
  cooldown_until,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'e1111111-1111-1111-1111-111111111111',
  'Tom Bradley',
  'tom.b@cornell.edu',
  'Cornell University',
  '2025',
  'core',
  'Software Engineering',
  'https://github.com/tomb/projects',
  'Full-stack engineer with experience in React and Django',
  'ACCEPTED',
  'SUSPENDED',
  'under_review',
  3,
  NOW() + INTERVAL '5 days',
  'Account suspended due to 3 strikes: missed commitments and false skill claims.',
  '["suspended", "multiple-strikes"]'::jsonb,
  NOW() - INTERVAL '45 days'
);

-- Test Case: Revoked Access
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  application_state,
  account_status,
  reliability_tier,
  strike_count,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'e2222222-2222-2222-2222-222222222222',
  'Rachel Green',
  'rachel.g@upenn.edu',
  'UPenn',
  '2024',
  'core',
  'Product Design',
  'https://github.com/rachelg/designs',
  'UX/UI designer with coding skills',
  'REVOKED',
  'REVOKED',
  'under_review',
  5,
  'Access permanently revoked after 5 strikes for policy violations and behavior issues.',
  '["revoked", "policy-violation"]'::jsonb,
  NOW() - INTERVAL '60 days'
);

-- Test Case: Archived Application
INSERT INTO applications (
  id,
  full_name,
  email,
  university,
  grad_year,
  track,
  skill_category,
  proof_url,
  rationale,
  application_state,
  account_status,
  manual_archive_id,
  archived_by,
  archived_at,
  admin_feedback,
  tags,
  submitted_at
) VALUES (
  'e3333333-3333-3333-3333-333333333333',
  'Michael Scott',
  'michael.s@duke.edu',
  'Duke University',
  '2024',
  'core',
  'Sales Engineering',
  'https://github.com/michaels/crm',
  'Built CRM system for small businesses',
  'ARCHIVED',
  'ACTIVE',
  'ARCH-2024-001',
  'onitiloabdurrahman@gmail.com',
  NOW() - INTERVAL '30 days',
  'Graduated and no longer active. Archived for record-keeping.',
  '["archived", "graduated"]'::jsonb,
  NOW() - INTERVAL '180 days'
);

-- ============================================================================
-- 4. SAMPLE AUDIT LOGS FOR TEST APPLICANTS
-- ============================================================================

-- Audit: Marcus Johnson Accepted
INSERT INTO audit_logs (
  entity_id,
  actor_id,
  action_type,
  previous_value,
  new_value,
  note,
  timestamp
) VALUES (
  'a2222222-2222-2222-2222-222222222222',
  'onitiloabdurrahman@gmail.com',
  'STATUS_CHANGE',
  jsonb_build_object('state', 'APPLIED', 'tier', 'medium'),
  jsonb_build_object('state', 'ACCEPTED', 'tier', 'high'),
  'Super Admin verified Marcus Johnson on ' || TO_CHAR(NOW() - INTERVAL '15 days', 'Mon DD, YYYY'),
  NOW() - INTERVAL '15 days'
);

-- Audit: Emily Rodriguez Rejected
INSERT INTO audit_logs (
  entity_id,
  actor_id,
  action_type,
  previous_value,
  new_value,
  note,
  timestamp
) VALUES (
  'a3333333-3333-3333-3333-333333333333',
  'onitiloabdurrahman@gmail.com',
  'STATUS_CHANGE',
  jsonb_build_object('state', 'APPLIED'),
  jsonb_build_object('state', 'REJECTED'),
  'Super Admin flagged Emily Rodriguez on ' || TO_CHAR(NOW() - INTERVAL '10 days', 'Mon DD, YYYY'),
  NOW() - INTERVAL '10 days'
);

-- Audit: David Kim Rerouted
INSERT INTO audit_logs (
  entity_id,
  actor_id,
  action_type,
  previous_value,
  new_value,
  note,
  timestamp
) VALUES (
  'a4444444-4444-4444-4444-444444444444',
  'onitiloabdurrahman@gmail.com',
  'REROUTE',
  jsonb_build_object('state', 'APPLIED', 'track', 'core'),
  jsonb_build_object('state', 'ROUTED_TO_PREP', 'track', 'prep'),
  'Super Admin rerouted David Kim to Prep Program on ' || TO_CHAR(NOW() - INTERVAL '7 days', 'Mon DD, YYYY'),
  NOW() - INTERVAL '7 days'
);

-- ============================================================================
-- 5. SAMPLE STRIKE HISTORY
-- ============================================================================

-- Strike for Jessica Martinez
INSERT INTO strike_history (
  application_id,
  strike_type,
  reason,
  issued_by,
  issued_at,
  strike_number,
  action_taken,
  cooldown_days
) VALUES (
  'a5555555-5555-5555-5555-555555555555',
  'MISSED_COMMITMENT',
  'Failed to deliver project milestone by agreed deadline without prior communication',
  'onitiloabdurrahman@gmail.com',
  NOW() - INTERVAL '5 days',
  1,
  'WARNING',
  7
);

-- Strikes for Tom Bradley (Suspended Account)
INSERT INTO strike_history (
  application_id,
  strike_type,
  reason,
  issued_by,
  issued_at,
  strike_number,
  action_taken
) VALUES 
(
  'e1111111-1111-1111-1111-111111111111',
  'MISSED_COMMITMENT',
  'Missed first project deadline',
  'onitiloabdurrahman@gmail.com',
  NOW() - INTERVAL '40 days',
  1,
  'WARNING'
),
(
  'e1111111-1111-1111-1111-111111111111',
  'FALSE_INFORMATION',
  'Overstated skill level on profile',
  'onitiloabdurrahman@gmail.com',
  NOW() - INTERVAL '25 days',
  2,
  'WARNING'
),
(
  'e1111111-1111-1111-1111-111111111111',
  'MISSED_COMMITMENT',
  'Missed second project deadline after warning',
  'onitiloabdurrahman@gmail.com',
  NOW() - INTERVAL '10 days',
  3,
  'SUSPENSION'
);

-- ============================================================================
-- 6. VERIFICATION QUERIES
-- ============================================================================

-- Count applicants by state
SELECT 
  application_state, 
  COUNT(*) as count 
FROM applications 
GROUP BY application_state 
ORDER BY count DESC;

-- Count applicants by track
SELECT 
  track, 
  COUNT(*) as count 
FROM applications 
GROUP BY track;

-- View all audit logs with human-readable format
SELECT 
  note,
  actor_id,
  timestamp
FROM audit_logs
ORDER BY timestamp DESC;

-- Count strikes by applicant
SELECT 
  a.full_name,
  a.email,
  COUNT(s.id) as total_strikes
FROM applications a
LEFT JOIN strike_history s ON a.id = s.application_id
GROUP BY a.id, a.full_name, a.email
HAVING COUNT(s.id) > 0
ORDER BY total_strikes DESC;

-- ============================================================================
-- TEST DATA SETUP COMPLETE
-- ============================================================================
-- You now have:
-- - 8 Core Track applicants (various states)
-- - 2 Prep Program applicants
-- - 3 Edge cases (suspended, revoked, archived)
-- - Sample audit logs
-- - Strike history examples
--
-- Total: 13 test applicants ready for Admin Hub testing
-- ============================================================================