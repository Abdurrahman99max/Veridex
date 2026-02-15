import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Enable logger
app.use('*', logger(console.log));

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const prefix = "/make-server-45707f2b";
const BUCKET_NAME = "make-45707f2b-veridex-docs";
const MASTER_ADMIN = "onitiloabdurrahman@gmail.com";

// --- TYPES ---
type ApplicationState = 'APPLIED' | 'ROUTED_TO_PREP' | 'ACCEPTED' | 'REJECTED' | 'REVOKED' | 'ARCHIVED';
type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
type ReliabilityTier = 'high' | 'medium' | 'under_review';

interface StrikePolicy {
  warning_threshold: number;
  suspension_threshold: number;
  revocation_threshold: number;
  cooldown_days: number;
}

interface PolicyChangeRequest {
  id: string;
  policy_type: 'STRIKE' | 'TRANSITION';
  proposed_changes: any;
  proposed_by: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: string;
  created_at: string;
  approved_at?: string;
}

// --- CONSTANTS ---
const DEFAULT_STRIKE_POLICY: StrikePolicy = {
  warning_threshold: 1,
  suspension_threshold: 3,
  revocation_threshold: 5,
  cooldown_days: 7
};

const ALLOWED_TRANSITIONS: Record<ApplicationState, ApplicationState[]> = {
  'APPLIED': ['ACCEPTED', 'REJECTED', 'ROUTED_TO_PREP', 'ARCHIVED'],
  'ROUTED_TO_PREP': ['ACCEPTED', 'ARCHIVED'],
  'REJECTED': ['APPLIED', 'ARCHIVED'],
  'ACCEPTED': ['REVOKED', 'ARCHIVED'],
  'REVOKED': ['ARCHIVED'],
  'ARCHIVED': ['APPLIED', 'ROUTED_TO_PREP', 'ACCEPTED', 'REJECTED', 'REVOKED']
};

// --- UTILS ---

const getSupabase = async () => {
  const client = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
  return client;
};

const checkIdempotency = async (key: string) => {
  if (!key) return null;
  return await kv.get(`idempotency:${key}`);
};

const saveIdempotency = async (key: string, response: any) => {
  if (!key) return;
  await kv.set(`idempotency:${key}`, {
    response,
    created_at: new Date().toISOString()
  });
};

const logAudit = async (entity_id: string, actor_id: string, action_type: string, previous_value: any, new_value: any, note: string) => {
  const timestamp = new Date().toISOString();
  const id = `AUDIT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const entry = {
    id,
    entity_id,
    actor_id,
    action_type,
    previous_value,
    new_value,
    note,
    timestamp
  };
  
  // Save specific audit log
  await kv.set(`audit:${entity_id}:${timestamp}`, entry);
  
  // Update master audit log (for global view)
  const masterLogs = await kv.get('application_audit_log') || [];
  await kv.set('application_audit_log', [entry, ...masterLogs.slice(0, 999)]); // Keep last 1000 for performance
};

const emitEvent = async (event_type: string, entity_id: string, payload: any) => {
  const id = `EVENT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const event = {
    id,
    event_type,
    entity_id,
    payload,
    created_at: new Date().toISOString(),
    status: 'PENDING'
  };
  await kv.set(`event:${id}`, event);
  
  // Index event for processing
  const pendingEvents = await kv.get('pending_events') || [];
  await kv.set('pending_events', [...pendingEvents, id]);
  
  // Trigger async processing (mocked as direct call here for simplicity in this environment)
  await processEvent(event);
};

const processEvent = async (event: any) => {
  try {
    const applicant = await kv.get(`applicant:${event.entity_id}`);
    if (!applicant) return;

    let subject = '';
    let html = '';

    switch (event.event_type) {
      case 'USER_ACCEPTED':
        subject = 'Welcome to Veridex Core';
        html = `<h1>Congratulations ${applicant.fullName}</h1><p>Your application has been accepted into the Core track.</p>`;
        break;
      case 'USER_REJECTED':
        subject = 'Veridex Application Status';
        html = `<p>We regret to inform you that your application was not successful at this time.</p>`;
        break;
      case 'STRIKE_ISSUED':
        subject = 'Account Warning: Strike Issued';
        html = `<h1>Warning</h1><p>A strike has been issued to your account. Reason: ${event.payload.reason}</p>`;
        break;
      case 'USER_SUSPENDED':
        subject = 'Account Suspended';
        html = `<h1>Account Suspended</h1><p>Your account has been suspended until ${new Date(applicant.cooldown_until).toLocaleString()}.</p>`;
        break;
      case 'USER_REVOKED':
        subject = 'Account Revoked';
        html = `<h1>Access Revoked</h1><p>Your access to Veridex has been permanently revoked.</p>`;
        break;
    }

    if (subject && html) {
      await resend.emails.send({
        from: 'Veridex <notifications@resend.dev>',
        to: [applicant.email],
        subject,
        html: `
          <div style="font-family: monospace; background: #0A0A0B; color: #fff; padding: 40px;">
            <div style="border: 1px solid #333; padding: 20px;">
              ${html}
              <p style="margin-top: 40px; color: #666; font-size: 12px;">Ref: ${event.id}</p>
            </div>
          </div>
        `
      });
    }

    // Mark as processed
    const processedEvent = { ...event, status: 'PROCESSED', processed_at: new Date().toISOString() };
    await kv.set(`event:${event.id}`, processedEvent);
  } catch (err) {
    console.error('[EVENT] Processing error:', err);
  }
};

const calculateReliability = (applicant: any, strikes: any[]) => {
  const strikeCount = strikes.length;
  if (strikeCount === 0 && applicant.application_state === 'ACCEPTED') return 'high';
  if (strikeCount === 1) return 'medium';
  return 'under_review';
};

// --- RPC IMPLEMENTATIONS ---

const executeTransitionInternal = async (applicationId: string, newState: ApplicationState, reason: string, operator: string, confirmed: boolean, idempotencyKey?: string) => {
  // Check Idempotency
  const cached = await checkIdempotency(idempotencyKey || '');
  if (cached) return cached.response;

  if (!confirmed) throw new Error('Explicit confirmation required.');

  const applicant = await kv.get(`applicant:${applicationId}`);
  if (!applicant) throw new Error('Applicant not found.');

  const currentState: ApplicationState = applicant.application_state || 'APPLIED';
  
  if (!ALLOWED_TRANSITIONS[currentState].includes(newState)) {
    throw new Error(`Illegal state transition from ${currentState} to ${newState}`);
  }

  // Governance: Mandatory reasons
  const reasonRequiredStates: ApplicationState[] = ['REJECTED', 'ROUTED_TO_PREP', 'REVOKED', 'ARCHIVED'];
  if (reasonRequiredStates.includes(newState) && (!reason || reason.trim().length < 5)) {
    throw new Error(`Mandatory reason required for transition to ${newState}`);
  }

  const updatedApplicant = {
    ...applicant,
    application_state: newState,
    last_modified: new Date().toISOString(),
    last_modified_by: operator
  };

  if (newState === 'REVOKED') {
    updatedApplicant.account_status = 'REVOKED';
  }

  // Handle Track Promotion
  if (newState === 'ACCEPTED' && updatedApplicant.track === 'prep' && (operator === 'SYSTEM_PROMOTION' || operator === 'ADMIN')) {
      updatedApplicant.track = 'core';
  }

  // Recalculate Reliability
  const strikes = await kv.getByPrefix(`strike:${applicationId}:`) || [];
  updatedApplicant.reliabilityTier = calculateReliability(updatedApplicant, strikes);

  // Save
  await kv.set(`applicant:${applicationId}`, updatedApplicant);
  
  // Audit
  await logAudit(applicationId, operator, `TRANSITION_${newState}`, currentState, newState, reason);
  
  // Event
  await emitEvent(`USER_${newState}`, applicationId, { reason, operator });

  const response = { success: true, newState, account_status: updatedApplicant.account_status, reliabilityTier: updatedApplicant.reliabilityTier };
  await saveIdempotency(idempotencyKey || '', response);
  return response;
};

// --- ROUTES ---

// 1. Submit Application
app.post(`${prefix}/submit-application`, async (c) => {
  try {
    const data = await c.req.json();
    const email = data.email.toLowerCase().trim();
    
    const emailMap = await kv.get('email_to_id_map') || {};
    if (emailMap[email]) {
      return c.json({ success: true, duplicate: true });
    }

    const id = `VX-${data.track === 'core' ? 'C' : 'P'}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    const applicant = {
      ...data,
      email,
      id,
      application_state: 'APPLIED',
      account_status: 'ACTIVE',
      strike_count: 0,
      submittedAt: new Date().toISOString(),
      tags: data.tags || []
    };

    await kv.set(`applicant:${id}`, applicant);
    
    emailMap[email] = id;
    await kv.set('email_to_id_map', emailMap);
    
    const existingList = (await kv.get('applicant_list')) || [];
    await kv.set('applicant_list', [id, ...existingList]);

    await logAudit(id, 'SYSTEM', 'INITIAL_SUBMISSION', null, 'APPLIED', `Application received.`);

    return c.json({ success: true, id });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 2. Status Lookup
app.post(`${prefix}/status-lookup`, async (c) => {
  try {
    const { email } = await c.req.json();
    const emailMap = await kv.get('email_to_id_map') || {};
    const id = emailMap[email.toLowerCase().trim()];
    
    if (!id) return c.json({ found: false });

    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ found: false });

    // Enforcement: Check for suspension
    if (applicant.account_status === 'SUSPENDED' && applicant.cooldown_until && new Date(applicant.cooldown_until) > new Date()) {
       return c.json({ 
         found: true, 
         suspended: true, 
         cooldown_until: applicant.cooldown_until,
         message: `Account suspended until ${new Date(applicant.cooldown_until).toLocaleString()}`
       });
    }

    return c.json({
      found: true,
      id: applicant.id,
      name: applicant.fullName,
      application_state: applicant.application_state,
      account_status: applicant.account_status,
      track: applicant.track,
      reliabilityTier: applicant.reliabilityTier
    });
  } catch (err) {
    return c.json({ error: 'System busy' }, 500);
  }
});

// 3. Admin: Execute Transition (RPC)
app.post(`${prefix}/admin/execute-transition`, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    const { applicationId, newState, reason, operator, confirmed, idempotencyKey } = await c.req.json();
    const result = await executeTransitionInternal(applicationId, newState, reason, operator, confirmed, idempotencyKey);
    return c.json(result);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 4. Admin: Issue Strike (RPC)
app.post(`${prefix}/admin/issue-strike`, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    const { applicationId, reason, operator, strikeType, idempotencyKey } = await c.req.json();
    
    const cached = await checkIdempotency(idempotencyKey || '');
    if (cached) return c.json(cached.response);

    const applicant = await kv.get(`applicant:${applicationId}`);
    if (!applicant) throw new Error('Applicant not found');

    const policy: StrikePolicy = await kv.get('policy:strike') || DEFAULT_STRIKE_POLICY;
    
    const strikeId = `STRIKE-${Date.now()}`;
    const strikeRecord = {
      id: strikeId,
      user_id: applicationId,
      reason,
      issued_by: operator,
      strike_type: strikeType,
      created_at: new Date().toISOString()
    };

    await kv.set(`strike:${applicationId}:${strikeId}`, strikeRecord);

    const strikes = await kv.getByPrefix(`strike:${applicationId}:`) || [];
    const strikeCount = strikes.length;

    applicant.strike_count = strikeCount;
    
    let enforcementAction = 'NONE';
    if (strikeCount >= policy.revocation_threshold) {
      applicant.account_status = 'REVOKED';
      applicant.application_state = 'REVOKED';
      enforcementAction = 'REVOCATION';
    } else if (strikeCount >= policy.suspension_threshold) {
      applicant.account_status = 'SUSPENDED';
      const cooldown = new Date();
      cooldown.setDate(cooldown.getDate() + policy.cooldown_days);
      applicant.cooldown_until = cooldown.toISOString();
      enforcementAction = 'SUSPENSION';
    } else if (strikeCount >= policy.warning_threshold) {
      enforcementAction = 'WARNING';
    }

    applicant.reliabilityTier = calculateReliability(applicant, strikes);
    await kv.set(`applicant:${applicationId}`, applicant);
    
    await logAudit(applicationId, operator, 'STRIKE_ISSUED', strikeCount - 1, strikeCount, reason);
    await emitEvent('STRIKE_ISSUED', applicationId, { reason, strikeCount, enforcementAction });
    
    if (enforcementAction === 'REVOCATION') await emitEvent('USER_REVOKED', applicationId, { reason: 'Strike threshold exceeded' });
    if (enforcementAction === 'SUSPENSION') await emitEvent('USER_SUSPENDED', applicationId, { reason: 'Strike threshold exceeded' });

    const response = { success: true, strikeCount, enforcementAction };
    await saveIdempotency(idempotencyKey || '', response);
    return c.json(response);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 5. Policy Governance: Request Change
app.post(`${prefix}/admin/request-policy-change`, async (c) => {
  try {
    const { proposed_changes, policy_type, proposed_by } = await c.req.json();
    const id = `POLREQ-${Date.now()}`;
    const request: PolicyChangeRequest = {
      id,
      policy_type,
      proposed_changes,
      proposed_by,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    await kv.set(`policy_request:${id}`, request);
    await logAudit('SYSTEM', proposed_by, 'POLICY_CHANGE_REQUESTED', null, request, `Proposed ${policy_type} policy change`);
    return c.json({ success: true, id });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 6. Policy Governance: Approve Change
app.post(`${prefix}/admin/approve-policy-change`, async (c) => {
  try {
    const { requestId, approved_by } = await c.req.json();
    const request: PolicyChangeRequest = await kv.get(`policy_request:${requestId}`);
    
    if (!request || request.status !== 'PENDING') throw new Error('Invalid request');
    if (request.proposed_by === approved_by) throw new Error('Self-approval not allowed');

    if (request.policy_type === 'STRIKE') {
      await kv.set('policy:strike', request.proposed_changes);
    }

    request.status = 'APPROVED';
    request.approved_by = approved_by;
    request.approved_at = new Date().toISOString();
    
    await kv.set(`policy_request:${requestId}`, request);
    await logAudit('SYSTEM', approved_by, 'POLICY_CHANGE_APPROVED', null, request, `Approved ${request.policy_type} policy change`);
    
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 7. Admin: Get Applicants (With Visibility Fixes)
app.get(`${prefix}/admin/applicants`, async (c) => {
  try {
    const list = (await kv.get('applicant_list')) || [];
    // Efficient retrieval for Prep vs Core visibility
    const applicants = await Promise.all(list.map(id => kv.get(`applicant:${id}`)));
    return c.json(applicants.filter(a => a !== null));
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 8. Admin: Get Audit Logs
app.get(`${prefix}/admin/audit-logs`, async (c) => {
  try {
    const logs = await kv.get('application_audit_log') || [];
    return c.json(logs);
  } catch (err) {
    return c.json([], 500);
  }
});

// 9. OTP Flow (Hardened with Auth Check)
app.post(`${prefix}/admin/request-otp`, async (c) => {
  try {
    const { email } = await c.req.json();
    const whitelist = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
    
    if (!whitelist.includes(email.toLowerCase())) {
      return c.json({ success: true, message: 'If authorized, a code has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    await kv.set(`otp:${email.toLowerCase()}`, { code: otp, expires });
    
    await resend.emails.send({
      from: 'Veridex Hub <onboarding@resend.dev>',
      to: [email],
      subject: 'Veridex Access Code',
      html: `<h1>Code: ${otp}</h1>`
    });

    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

app.post(`${prefix}/admin/verify-otp`, async (c) => {
  try {
    const { email, code } = await c.req.json();
    const stored = await kv.get(`otp:${email.toLowerCase()}`);
    
    if (stored && stored.code === code && stored.expires > Date.now()) {
      await kv.del(`otp:${email.toLowerCase()}`);
      return c.json({ success: true, token: `vdx_auth_${Math.random().toString(36).substring(2)}` });
    }
    return c.json({ success: false, error: 'Invalid or expired code' }, 401);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 10. Admin: Whitelist Management
app.get(`${prefix}/admin/whitelist`, async (c) => {
  const whitelist = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
  return c.json(whitelist);
});

app.post(`${prefix}/admin/whitelist`, async (c) => {
  try {
    const { email, action } = await c.req.json();
    const current = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
    let updated = action === 'add' ? [...new Set([...current, email.toLowerCase()])] : current.filter(e => e !== email.toLowerCase());
    await kv.set('admin_whitelist', updated);
    return c.json({ success: true, whitelist: updated });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 11. Legacy Endpoints (Refactored to RPC internally)
app.patch(`${prefix}/admin/applicants/:id`, async (c) => {
  const id = c.req.param('id');
  const { status, adminFeedback, operator } = await c.req.json();
  let newState: ApplicationState = 'APPLIED';
  if (status === 'verified') newState = 'ACCEPTED';
  else if (status === 'flagged') newState = 'REJECTED';
  else if (status === 'archived') newState = 'ARCHIVED';
  return c.json(await executeTransitionInternal(id, newState, adminFeedback || 'Legacy update', operator, true));
});

app.patch(`${prefix}/admin/applicants/:id/reroute`, async (c) => {
  const id = c.req.param('id');
  const { operator } = await c.req.json();
  return c.json(await executeTransitionInternal(id, 'ROUTED_TO_PREP', 'Reroute to Prep', operator, true));
});

app.post(`${prefix}/admin/applicants/:id/delete`, async (c) => {
  const id = c.req.param('id');
  const { operator } = await c.req.json();
  return c.json(await executeTransitionInternal(id, 'ARCHIVED', 'Archive requested', operator, true));
});

Deno.serve(app.fetch);
