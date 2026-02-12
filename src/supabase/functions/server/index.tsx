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
      details: `Signal received from ${email} (${data.track})`,
      operator: 'SYSTEM_PROTOCOL',
      timestamp: new Date().toISOString()
    }, ...logs].slice(0, 100));

    return c.json({ success: true, id });
  } catch (err) {
    console.error('Submission error:', err);
    return c.json({ success: false, error: err.message }, 500);
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
      subject: 'Veridex Access Protocol',
      html: `
        <div style="background-color: #0A0A0B; color: #FFFFFF; font-family: monospace; padding: 40px; border-radius: 8px; max-width: 400px; margin: 0 auto;">
          <h1 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: #71717A; margin: 0;">Identity Verification</h1>
          <p style="font-size: 14px; color: #A1A1AA; margin-bottom: 30px;">Enter the following protocol to authorize your session.</p>
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

// 5. Update Status + Automated Emails
app.patch(`${prefix}/admin/applicants/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const { status, reliabilityTier, adminFeedback, operator } = await c.req.json();
    
    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ success: false, error: 'Not found' }, 404);
    
    const updated = { ...applicant, status, reliabilityTier, adminFeedback };
    await kv.set(`applicant:${id}`, updated);

    // Automation: Send Status Update Email
    let emailSent = false;
    let emailError = null;

    if (status === 'verified' || status === 'flagged') {
      try {
        console.log(`[EMAIL] Protocol Triggered for ${applicant.email}...`);
        
        let subject = '';
        let bodyHtml = '';
        const firstName = applicant.fullName.split(' ')[0];

        if (status === 'verified') {
          const tierMap: any = {
            'high': 'Verified – High Reliability',
            'medium': 'Verified – Medium Reliability',
            'under_review': 'Under Review (Limited Access)'
          };
          const displayTier = tierMap[reliabilityTier || 'medium'] || 'Verified – Medium Reliability';

          subject = 'Your application has been approved';
          bodyHtml = `
            <div style="background-color: #0A0A0B; color: #FFFFFF; font-family: monospace; padding: 40px; border: 1px solid #27272A; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #10B981; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #10B981; padding-bottom: 10px;">PROTOCOL VERIFIED</h2>
              <p style="color: #A1A1AA; line-height: 1.6;">Hello ${firstName},</p>
              <p style="color: #A1A1AA; line-height: 1.6;">Your application has been reviewed, and you have been accepted into the platform.</p>
              <p style="color: #A1A1AA; line-height: 1.6;">Based on the skill evidence you submitted, you meet our current standard for task-ready final-year students. You are now eligible to be matched with paid tasks from employers.</p>
              
              <div style="background: #18181B; padding: 20px; border-radius: 4px; border-left: 4px solid #10B981; margin: 20px 0;">
                <p style="margin: 0; font-size: 12px; color: #52525B; text-transform: uppercase;">Your current Reliability Tier is:</p>
                <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 18px; color: #FFFFFF;">${displayTier}</p>
              </div>

              <p style="color: #A1A1AA; font-size: 13px;">This tier reflects our confidence in your ability to deliver professional standards, meet deadlines, and represent the platform responsibly.</p>
              
              <ul style="color: #A1A1AA; font-size: 12px; line-height: 1.8;">
                <li>Acceptance does not guarantee task assignment</li>
                <li>Tasks are matched based on employer needs</li>
                <li>Your reliability tier can evolve based on performance</li>
              </ul>

              <p style="color: #FFFFFF; font-weight: bold; margin-top: 30px;">This platform is built on trust. Protect it.</p>
              
              <div style="margin-top: 30px; border-top: 1px solid #27272A; padding-top: 20px; font-size: 11px; color: #52525B;">
                <p>Veridex Team | Reference: ${id}</p>
              </div>
            </div>
          `;
        } else if (status === 'flagged') {
          subject = 'Application review outcome';
          bodyHtml = `
            <div style="background-color: #0A0A0B; color: #FFFFFF; font-family: monospace; padding: 40px; border: 1px solid #27272A; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #EF4444; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #EF4444; padding-bottom: 10px;">AUDIT_INCOMPLETE</h2>
              <p style="color: #A1A1AA; line-height: 1.6;">Hello ${firstName},</p>
              <p style="color: #A1A1AA; line-height: 1.6;">We’ve completed a manual review of your application. At this time, we’re unable to approve your profile for task assignment.</p>
              
              <div style="background: #18181B; padding: 20px; border-radius: 4px; border-left: 4px solid #EF4444; margin: 20px 0;">
                <p style="margin: 0; font-size: 12px; color: #52525B; text-transform: uppercase;">🔹 Skill-Specific Feedback Block:</p>
                <p style="margin: 10px 0 10px 0; color: #FFFFFF; font-size: 14px; line-height: 1.5;">${adminFeedback || 'Proof provided does not currently meet the task-ready professional standard required for employer matching.'}</p>
                
                <div style="font-size: 12px; margin-top: 15px; border-top: 1px solid #27272A; padding-top: 10px;">
                  <p style="color: #EF4444; margin: 5px 0;"><strong>❌ What we cannot accept:</strong> generic coursework, unverified certificates, incomplete projects.</p>
                  <p style="color: #10B981; margin: 5px 0;"><strong>✅ What acceptable proof looks like:</strong> live production links, verifiable GitHub commits, signed technical endorsements.</p>
                </div>
              </div>

              <p style="color: #A1A1AA; font-size: 13px;">Our platform is designed exclusively for final-year students who demonstrate applied work. You are encouraged to improve your submission and re-apply once your proof of work meets the standard described in our documentation.</p>
              
              <p style="color: #FFFFFF; font-weight: bold; margin-top: 30px;">This platform prioritizes employer trust.</p>
              
              <div style="margin-top: 30px; border-top: 1px solid #27272A; padding-top: 20px; font-size: 11px; color: #52525B;">
                <p>Veridex Team | Reference: ${id}</p>
              </div>
            </div>
          `;
        }

        if (subject && bodyHtml) {
          const { data: emailData, error: emailErr } = await resend.emails.send({
            from: 'Veridex Protocol <onboarding@resend.dev>',
            to: [applicant.email],
            subject: subject,
            html: bodyHtml
          });

          if (emailErr) emailError = emailErr;
          else emailSent = true;
        }
      } catch (err) {
        emailError = err.message;
      }
    }

    const logs = await kv.get('audit_logs') || [];
    await kv.set('audit_logs', [{
      id: `LOG-${Date.now()}`,
      action: 'STATUS_UPDATE',
      details: `Protocol ${id} updated. Status: ${status}. Tier: ${reliabilityTier || 'N/A'}. Email: ${emailSent}`,
      operator: operator || 'UNKNOWN_ADMIN',
      timestamp: new Date().toISOString()
    }, ...logs].slice(0, 100));
    
    return c.json({ success: true, emailSent, emailError });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 6. Reroute Core to Prep
app.patch(`${prefix}/admin/applicants/:id/reroute`, async (c) => {
  try {
    const id = c.req.param('id');
    const { operator } = await c.req.json();
    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ success: false, error: 'Not found' }, 404);

    const updated = { 
      ...applicant, 
      track: 'prep', 
      tags: [...(applicant.tags || []), 'REROUTED_FROM_CORE'] 
    };
    await kv.set(`applicant:${id}`, updated);

    // Send Reroute Email
    let emailSent = false;
    let emailError = null;
    const firstName = applicant.fullName.split(' ')[0];
    try {
      const { data, error } = await resend.emails.send({
        from: 'Veridex Protocol <onboarding@resend.dev>',
        to: [applicant.email],
        subject: 'SIGNAL OPTIMIZATION: Rerouting to Preparation Track',
        html: `
          <div style="background-color: #0A0A0B; color: #FFFFFF; font-family: monospace; padding: 40px; border: 1px solid #27272A; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #F59E0B; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #F59E0B; padding-bottom: 10px;">SIGNAL_OPTIMIZATION</h2>
            <p style="color: #A1A1AA; line-height: 1.6;">Hello ${firstName},</p>
            <p style="color: #A1A1AA; line-height: 1.6;">We have completed the audit of your technical signals.</p>
            <p style="color: #A1A1AA; line-height: 1.6;">Based on the evidence provided, we are rerouting your application to the <strong>Veridex Prep Track</strong>.</p>
            
            <div style="background: #18181B; padding: 20px; border-radius: 4px; border-left: 4px solid #F59E0B; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #FFFFFF;">The Strategy:</p>
              <p style="margin: 10px 0 0 0; color: #A1A1AA; font-size: 13px; line-height: 1.5;">The Prep track is specifically designed as a bridge—allowing you to harden your skills and refine your portfolio before entering the high-stakes Core environment.</p>
            </div>

            <p style="color: #A1A1AA; font-size: 13px;">This move ensures you have a foundational spot in the ecosystem while you work toward the professional standard required for promotion to the Core track.</p>
            
            <p style="color: #FFFFFF; font-weight: bold; margin-top: 30px;">We don't lower our standards, we help you meet them.</p>
            
            <div style="margin-top: 30px; border-top: 1px solid #27272A; padding-top: 20px; font-size: 11px; color: #52525B;">
              <p>Veridex Team | Reference: ${id}</p>
            </div>
          </div>
        `
      });
      if (error) emailError = error;
      else emailSent = true;
    } catch (e) {
      emailError = e.message;
    }

    const logs = await kv.get('audit_logs') || [];
    await kv.set('audit_logs', [{
      id: `LOG-${Date.now()}`,
      action: 'PROTOCOL_REROUTE',
      details: `Identity ${applicant.email} rerouted from Core to Prep track. Email: ${emailSent}`,
      operator: operator || 'UNKNOWN_ADMIN',
      timestamp: new Date().toISOString()
    }, ...logs].slice(0, 100));

    return c.json({ success: true, emailSent, emailError });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 7. Delete Protocol
app.post(`${prefix}/admin/applicants/:id/delete`, async (c) => {
  try {
    const id = c.req.param('id');
    const { operator } = await c.req.json();
    const applicant = await kv.get(`applicant:${id}`);
    if (!applicant) return c.json({ success: false, error: 'Not found' }, 404);

    const email = applicant.email;
    const list = (await kv.get('applicant_list')) || [];
    await kv.set('applicant_list', list.filter(item => item !== id));

    const emailMap = await kv.get('email_to_id_map') || {};
    delete emailMap[email];
    await kv.set('email_to_id_map', emailMap);

    await kv.del(`applicant:${id}`);

    const logs = await kv.get('audit_logs') || [];
    await kv.set('audit_logs', [{
      id: `LOG-${Date.now()}`,
      action: 'PROTOCOL_DELETED',
      details: `Identity ${email} removed.`,
      operator: operator || 'UNKNOWN_ADMIN',
      timestamp: new Date().toISOString()
    }, ...logs].slice(0, 100));

    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 8. Get Audit Logs
app.get(`${prefix}/admin/audit-logs`, async (c) => {
  try {
    const logs = await kv.get('audit_logs') || [];
    return c.json(logs);
  } catch (err) {
    return c.json([], 500);
  }
});

// 9. Manage Whitelist
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

// 10. Get Whitelist
app.get(`${prefix}/admin/whitelist`, async (c) => {
  try {
    const whitelist = (await kv.get('admin_whitelist')) || [MASTER_ADMIN];
    return c.json(whitelist);
  } catch (err) {
    return c.json([], 500);
  }
});

Deno.serve(app.fetch);
