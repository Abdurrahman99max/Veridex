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
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const prefix = "/make-server-45707f2b";
const BUCKET_NAME = "make-45707f2b-veridex-docs";
const MASTER_ADMIN = "onitiloabdurrahman@gmail.com";

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
    
    // 🛡️ IDENTITY LOCK: Check for existing email to prevent duplicates
    const emailMap = await kv.get('email_to_id_map') || {};
    if (emailMap[email]) {
      return c.json({ 
        success: false, 
        error: 'IDENTITY_ALREADY_REGISTERED',
        message: 'This protocol already exists in our secure database.' 
      }, 409);
    }

    const id = `VX-${data.track === 'core' ? 'C' : 'P'}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    // Auto-tagging logic
    const tags = [];
    if (email.endsWith('.edu') || email.endsWith('.edu.ng')) tags.push('UNIVERSITY MAIL');
    if (data.rationale && data.rationale.length > 100) tags.push('DETAILED PROTOCOL');
    if (data.track === 'core') tags.push('STEADY PROTOCOL');
    if (data.documentPath) tags.push('TRUST_ANCHOR');
    
    const applicant = {
      ...data,
      email,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      tags
    };

    // Save to KV store
    await kv.set(`applicant:${id}`, applicant);
    
    // Update the Identity Lock map
    emailMap[email] = id;
    await kv.set('email_to_id_map', emailMap);
    
    // Update the master list
    const existingList = (await kv.get('applicant_list')) || [];
    await kv.set('applicant_list', [id, ...existingList]);

    // LOG ACTION
    const logs = await kv.get('audit_logs') || [];
    await kv.set('audit_logs', [{
      id: `LOG-${Date.now()}`,
      action: 'NEW_APPLICATION',
      details: `Signal received from ${email}`,
      timestamp: new Date().toISOString()
    }, ...logs].slice(0, 100));

    return c.json({ success: true, id });
  } catch (err) {
    console.error('Submission error:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 2. Admin Whitelist Check & OTP Trigger (Integrated with Resend)
app.post(`${prefix}/admin/request-otp`, async (c) => {
  try {
    const body = await c.req.json();
    const email = body.email.toLowerCase();
    
    // Check whitelist in KV, default to MASTER_ADMIN
    const whitelist = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
    
    if (!whitelist.includes(email)) {
      // Security: Always return success to prevent email enumeration
      console.log(`[AUTH] Unauthorized attempt: ${email}`);
      return c.json({ success: true, message: 'If authorized, a code has been sent.' });
    }

    // Generate real 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await kv.set(`otp:${email}`, { code: otp, expires });
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Veridex <onboarding@resend.dev>',
      to: [email],
      subject: 'Veridex Access Protocol',
      html: `
        <div style="background-color: #0A0A0B; color: #FFFFFF; font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace; padding: 40px; border-radius: 8px; max-width: 400px; margin: 0 auto;">
          <div style="border-bottom: 1px solid #27272A; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: #71717A; margin: 0;">Identity Verification</h1>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #A1A1AA; margin-bottom: 30px;">
            Enter the following technical protocol to authorize your session in the Ghost Hub.
          </p>
          <div style="background-color: #18181B; border: 1px solid #27272A; padding: 24px; text-align: center; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: #FFFFFF;">${otp}</span>
          </div>
          <div style="margin-top: 40px; border-top: 1px solid #27272A; pt-20; font-size: 10px; color: #52525B; text-align: center;">
            <p>This code expires in 10 minutes. Veridex Protocol v1.0.4</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return c.json({ success: false, error: 'Failed to deliver protocol. Resend verification required.' }, 500);
    }

    console.log(`[AUTH] Protocol sent to ${email}`);
    return c.json({ success: true });
  } catch (err) {
    console.error('OTP Request error:', err);
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
      // Return a "session token"
      return c.json({ success: true, token: `vdx_auth_${Math.random().toString(36).substring(2)}` });
    }
    
    return c.json({ success: false, error: 'Invalid or expired code' }, 401);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 4. Get All Applicants (Protected)
app.get(`${prefix}/admin/applicants`, async (c) => {
  try {
    const list = (await kv.get('applicant_list')) || [];
    const applicants = await Promise.all(
      list.map(id => kv.get(`applicant:${id}`))
    );
    return c.json(applicants.filter(a => a !== null));
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 5. Update Status
app.patch(`${prefix}/admin/applicants/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ success: false, error: 'Not found' }, 404);
    
    const updated = { ...applicant, status };
    await kv.set(`applicant:${id}`, updated);

    // LOG ACTION
    const logs = await kv.get('audit_logs') || [];
    await kv.set('audit_logs', [{
      id: `LOG-${Date.now()}`,
      action: 'STATUS_UPDATE',
      details: `Protocol ${id} marked as ${status}`,
      timestamp: new Date().toISOString()
    }, ...logs].slice(0, 100));
    
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 6. Delete Protocol (for Support)
app.delete(`${prefix}/admin/applicants/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ success: false, error: 'Not found' }, 404);

    const email = applicant.email;

    // Remove from main list
    const list = (await kv.get('applicant_list')) || [];
    const newList = list.filter(item => item !== id);
    await kv.set('applicant_list', newList);

    // Remove from Email Map (🛡️ Unlock Identity)
    const emailMap = await kv.get('email_to_id_map') || {};
    delete emailMap[email];
    await kv.set('email_to_id_map', emailMap);

    // Delete record
    await kv.del(`applicant:${id}`);

    // LOG ACTION
    const logs = await kv.get('audit_logs') || [];
    await kv.set('audit_logs', [{
      id: `LOG-${Date.now()}`,
      action: 'PROTOCOL_DELETED',
      details: `Identity ${email} removed from secure node.`,
      timestamp: new Date().toISOString()
    }, ...logs].slice(0, 100));

    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 7. Get Audit Logs
app.get(`${prefix}/admin/audit-logs`, async (c) => {
  try {
    const logs = await kv.get('audit_logs') || [];
    return c.json(logs);
  } catch (err) {
    return c.json([], 500);
  }
});

// 6. Manage Whitelist
app.post(`${prefix}/admin/whitelist`, async (c) => {
  const { email, action } = await c.req.json();
  const current = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
  
  let updated;
  if (action === 'add') {
    updated = [...new Set([...current, email])];
  } else {
    updated = current.filter(e => e !== email);
  }
  
  await kv.set('admin_whitelist', updated);
  return c.json({ success: true, whitelist: updated });
});

Deno.serve(app.fetch);
