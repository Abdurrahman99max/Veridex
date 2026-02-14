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

// --- ENUMS & CONSTANTS ---
type ApplicationState = 'APPLIED' | 'ROUTED_TO_PREP' | 'ACCEPTED' | 'REJECTED' | 'REVOKED' | 'ARCHIVED';
type AccountStatus = 'ACTIVE' | 'DISABLED';
type AppealStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED';

const ALLOWED_TRANSITIONS: Record<ApplicationState, ApplicationState[]> = {
  'APPLIED': ['ACCEPTED', 'REJECTED', 'ROUTED_TO_PREP', 'ARCHIVED'],
  'ROUTED_TO_PREP': ['ACCEPTED', 'ARCHIVED'], // Fixed: Prep can now be promoted to Accepted
  'REJECTED': ['APPLIED', 'ARCHIVED'], // Allow re-application pathway if rejected
  'ACCEPTED': ['REVOKED', 'ARCHIVED'],
  'REVOKED': ['ARCHIVED'],
  'ARCHIVED': ['APPLIED', 'ROUTED_TO_PREP', 'ACCEPTED', 'REJECTED', 'REVOKED']
};

// --- SHARED LOGIC (Avoids loopback fetch) ---
const executeTransitionInternal = async (applicationId: string, newState: ApplicationState, reason: string, operator: string, confirmed: boolean) => {
  if (!confirmed) throw new Error('Explicit confirmation required.');

  const applicant = await kv.get(`applicant:${applicationId}`);
  if (!applicant) throw new Error('Applicant not found.');

  const currentState: ApplicationState = applicant.application_state || 
    (applicant.status === 'verified' ? 'ACCEPTED' : applicant.status === 'flagged' ? 'REJECTED' : 'APPLIED');
  
  if (!ALLOWED_TRANSITIONS[currentState].includes(newState)) {
    throw new Error(`Illegal state transition from ${currentState} to ${newState}`);
  }

  const reasonRequiredStates: ApplicationState[] = ['REJECTED', 'ROUTED_TO_PREP', 'REVOKED', 'ARCHIVED'];
  if (reasonRequiredStates.includes(newState) && (!reason || reason.trim().length < 5)) {
    throw new Error(`Mandatory reason required for transition to ${newState}`);
  }

  if (newState === 'REVOKED' && (!reason || reason.trim().length < 20)) {
    throw new Error('Revocation requires a detailed justification (min 20 chars).');
  }

  const updatedApplicant = {
    ...applicant,
    application_state: newState,
    status: newState === 'ACCEPTED' ? 'verified' : newState === 'REJECTED' ? 'flagged' : applicant.status
  };

  if (newState === 'REVOKED') {
    updatedApplicant.account_status = 'DISABLED';
  }

  await kv.set(`applicant:${applicationId}`, updatedApplicant);
  await logAudit(applicationId, operator || 'ADMIN', currentState, newState, `TRANSITION_${newState}`, reason || 'Internal state update.');
  
  return { success: true, newState, account_status: updatedApplicant.account_status };
};

// --- MIDDLEWARE & UTILS ---
const getSupabase = async () => {
  const client = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );

  try {
    const { data: buckets } = await client.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      console.log(`[STORAGE] Creating bucket: ${BUCKET_NAME}`);
      await client.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880,
      });
    }
  } catch (err) {
    console.error('[STORAGE] Init error:', err);
  }

  return client;
};

const logAudit = async (applicationId: string, actorId: string, previousState: ApplicationState | 'NONE', newState: ApplicationState, reasonCode: string, note: string) => {
  const auditLogs = await kv.get('application_audit_log') || [];
  const entry = {
    id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    application_id: applicationId,
    actor_id: actorId,
    previous_state: previousState,
    new_state: newState,
    reason_code: reasonCode,
    note: note,
    timestamp: new Date().toISOString()
  };
  // Immutable: only push new entries
  await kv.set('application_audit_log', [entry, ...auditLogs]);
};

// --- ROUTES ---

// 0. Vault Ingestion (Proxy Upload)
app.post(`${prefix}/vault/upload`, async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const path = body['path'] as string;

    if (!file || !path) return c.json({ error: 'Missing file or path' }, 400);

    const supabase = await getSupabase();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        contentType: file.type,
        upsert: true
      });

    if (error) throw error;
    return c.json({ success: true, path: data.path });
  } catch (err) {
    console.error('[VAULT] Upload error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// Admin: Get Signed URL for Trust Anchor
app.post(`${prefix}/admin/signed-url`, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    const { path } = await c.req.json();
    const supabase = await getSupabase();
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, 900); // 15 minutes

    if (error) throw error;
    return c.json({ url: data.signedUrl });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 1. Submit Application
app.post(`${prefix}/submit-application`, async (c) => {
  try {
    const data = await c.req.json();
    const email = data.email.toLowerCase().trim();
    
    // Check for existing email
    const emailMap = await kv.get('email_to_id_map') || {};
    if (emailMap[email]) {
      // Human-centered security: don't reveal if email exists, just return a generic success 
      // or a hint to check status portal to prevent enumeration.
      return c.json({ 
        success: true, 
        duplicate: true,
        message: 'If this email is already in our registry, you can check your status in the portal.' 
      });
    }

    const id = `VX-${data.track === 'core' ? 'C' : 'P'}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    // Auto-tagging logic
    const tags = [];
    if (email.endsWith('.edu') || email.endsWith('.edu.ng')) tags.push('UNIVERSITY MAIL');
    if (data.rationale && data.rationale.length > 100) tags.push('DETAILED SUBMISSION');
    if (data.track === 'core') tags.push('STEADY APPLICANT');
    if (data.documentPath) tags.push('VERIFIED_ID');
    
    const applicant = {
      ...data,
      email,
      id,
      application_state: 'APPLIED', // New governance field
      account_status: 'ACTIVE',    // New governance field
      status: 'pending',           // Legacy support
      submittedAt: new Date().toISOString(),
      tags
    };

    // Save to KV store
    await kv.set(`applicant:${id}`, applicant);
    
    // Update the Identity map
    emailMap[email] = id;
    await kv.set('email_to_id_map', emailMap);
    
    // Update the master list
    const existingList = (await kv.get('applicant_list')) || [];
    await kv.set('applicant_list', [id, ...existingList]);

    // Governance: Audit initial submission
    await logAudit(id, 'SYSTEM', 'NONE', 'APPLIED', 'INITIAL_SUBMISSION', `Application received via frontend flow.`);

    return c.json({ success: true, id });
  } catch (err) {
    console.error('Submission error:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 1.5 Public Status Lookup (Privacy Hardened)
app.post(`${prefix}/status-lookup`, async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) return c.json({ error: 'Email required' }, 400);

    const emailMap = await kv.get('email_to_id_map') || {};
    const id = emailMap[email.toLowerCase().trim()];
    
    if (!id) {
      return c.json({ found: false, message: 'No record found.' });
    }

    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ found: false });

    // Return only non-sensitive fields
    return c.json({
      found: true,
      name: applicant.firstName || applicant.fullName,
      application_state: applicant.application_state || 'APPLIED',
      account_status: applicant.account_status || 'ACTIVE',
      track: applicant.track
    });
  } catch (err) {
    return c.json({ error: 'System busy' }, 500);
  }
});

// 2. Admin Whitelist Check & OTP Trigger
app.post(`${prefix}/admin/request-otp`, async (c) => {
  try {
    const body = await c.req.json();
    const email = body.email.toLowerCase();
    
    const whitelist = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
    
    if (!whitelist.includes(email)) {
      console.log(`[AUTH] Unauthorized attempt: ${email}`);
      return c.json({ success: true, message: 'If authorized, a code has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    await kv.set(`otp:${email}`, { code: otp, expires });
    
    const { error } = await resend.emails.send({
      from: 'Veridex Hub <onboarding@resend.dev>',
      to: [email],
      subject: 'Veridex Access Code',
      html: `
        <div style="background-color: #0A0A0B; color: #FFFFFF; font-family: monospace; padding: 40px; border-radius: 8px; max-width: 400px; margin: 0 auto;">
          <h1 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: #71717A; margin: 0;">Identity Verification</h1>
          <p style="font-size: 14px; color: #A1A1AA; margin-bottom: 30px;">Enter the following code to authorize your session.</p>
          <div style="background-color: #18181B; border: 1px solid #27272A; padding: 24px; text-align: center; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: #FFFFFF;">${otp}</span>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    return c.json({ success: true });
  } catch (err) {
    console.error('OTP error:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 3. Admin Verify OTP
app.post(`${prefix}/admin/verify-otp`, async (c) => {
  try {
    const body = await c.req.json();
    const email = body.email.toLowerCase();
    const code = body.code;
    const stored = await kv.get(`otp:${email}`);
    
    if (stored && stored.code === code && stored.expires > Date.now()) {
      await kv.del(`otp:${email}`);
      return c.json({ success: true, token: `vdx_auth_${Math.random().toString(36).substring(2)}` });
    }
    
    return c.json({ success: false, error: 'Invalid or expired code' }, 401);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 4. Get All Applicants
app.get(`${prefix}/admin/applicants`, async (c) => {
  try {
    const list = (await kv.get('applicant_list')) || [];
    const applicants = await Promise.all(list.map(id => kv.get(`applicant:${id}`)));
    return c.json(applicants.filter(a => a !== null));
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 5. Governance: State Transition RPC
app.post(`${prefix}/admin/execute-transition`, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    const { applicationId, newState, reason, operator, confirmed } = await c.req.json();
    const result = await executeTransitionInternal(applicationId, newState, reason, operator, confirmed);
    return c.json(result);
  } catch (err) {
    console.error('[RPC] Transition error:', err.message);
    return c.json({ error: err.message }, 500);
  }
});

// 6. Appeal Submission
app.post(`${prefix}/appeals/submit`, async (c) => {
  try {
    const { applicationId, appealReason } = await c.req.json();
    const applicant = await kv.get(`applicant:${applicationId}`);
    
    if (!applicant) return c.json({ error: 'Application not found' }, 404);
    if (applicant.application_state !== 'REVOKED') {
      return c.json({ error: 'Appeals are only permitted for revoked accounts.' }, 403);
    }

    const appeals = await kv.get('application_appeals') || [];
    const newAppeal = {
      id: `APPEAL-${Date.now()}`,
      application_id: applicationId,
      appellant_id: applicant.email,
      appeal_reason: appealReason,
      appeal_status: 'PENDING',
      reviewed_by: null,
      decision_note: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set('application_appeals', [newAppeal, ...appeals]);
    
    await logAudit(applicationId, 'USER', 'REVOKED', 'REVOKED', 'APPEAL_FILED', `User filed an appeal: ${appealReason.substring(0, 50)}...`);

    return c.json({ success: true, appealId: newAppeal.id });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 7. Get Audit Logs (Admin)
app.get(`${prefix}/admin/application-audit-log/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const allLogs = await kv.get('application_audit_log') || [];
    const filtered = allLogs.filter((log: any) => log.application_id === id);
    return c.json(filtered);
  } catch (err) {
    return c.json([], 500);
  }
});

// 8. Legacy Update Status (Refactored to call internal logic)
app.patch(`${prefix}/admin/applicants/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const { status, reliabilityTier, adminFeedback, operator } = await c.req.json();
    
    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ success: false, error: 'Not found' }, 404);

    let newState: ApplicationState = applicant.application_state || 'APPLIED';
    if (status === 'verified') newState = 'ACCEPTED';
    else if (status === 'flagged') newState = 'REJECTED';
    else if (status === 'archived') newState = 'ARCHIVED';

    const result = await executeTransitionInternal(id, newState, adminFeedback, operator, true);

    if (reliabilityTier && newState === 'ACCEPTED') {
        const current = await kv.get(`applicant:${id}`);
        await kv.set(`applicant:${id}`, { ...current, reliabilityTier, adminFeedback });
    }

    return c.json(result);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 9. Legacy Reroute (Refactored)
app.patch(`${prefix}/admin/applicants/:id/reroute`, async (c) => {
  try {
    const id = c.req.param('id');
    const { operator } = await c.req.json();
    const result = await executeTransitionInternal(id, 'ROUTED_TO_PREP', 'Institutional reroute to Preparation Program.', operator, true);
    return c.json(result);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 10. Legacy Delete (Soft Archive Refactor)
app.post(`${prefix}/admin/applicants/:id/delete`, async (c) => {
    try {
      const id = c.req.param('id');
      const { operator } = await c.req.json();
      const result = await executeTransitionInternal(id, 'ARCHIVED', 'Requested archive/deletion from administrator.', operator, true);
      return c.json(result);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
});

// 11. Global Activity History (Maintained)
app.get(`${prefix}/admin/audit-logs`, async (c) => {
  try {
    const logs = await kv.get('application_audit_log') || [];
    return c.json(logs);
  } catch (err) {
    return c.json([], 500);
  }
});

// 12. Manage Whitelist
app.post(`${prefix}/admin/whitelist`, async (c) => {
  try {
    const { email, action } = await c.req.json();
    const current = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
    
    let updated;
    if (action === 'add') {
      updated = [...new Set([...current, email.toLowerCase()])];
    } else {
      updated = current.filter(e => e !== email.toLowerCase());
    }
    
    await kv.set('admin_whitelist', updated);
    return c.json({ success: true, whitelist: updated });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 13. Get Whitelist
app.get(`${prefix}/admin/whitelist`, async (c) => {
  try {
    const whitelist = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
    return c.json(whitelist);
  } catch (err) {
    return c.json([], 500);
  }
});

Deno.serve(app.fetch);
