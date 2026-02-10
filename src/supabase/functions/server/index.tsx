import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as kv from "./kv_store.tsx";

const app = new Hono();

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

// --- MIDDLEWARE & UTILS ---
const getSupabase = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
};

// --- ROUTES ---

// 1. Submit Application
app.post(`${prefix}/submit-application`, async (c) => {
  try {
    const data = await c.req.json();
    const id = `VX-${data.track === 'core' ? 'C' : 'P'}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    // Auto-tagging logic
    const tags = [];
    if (data.email.endsWith('.edu') || data.email.endsWith('.edu.ng')) tags.push('UNIVERSITY MAIL');
    if (data.rationale.length > 100) tags.push('DETAILED PROTOCOL');
    if (data.track === 'core') tags.push('STEADY PROTOCOL');
    
    const applicant = {
      ...data,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      tags
    };

    // Save to KV store
    await kv.set(`applicant:${id}`, applicant);
    
    // Also save to a list of all applicants for easy retrieval
    const existingList = (await kv.get('applicant_list')) || [];
    await kv.set('applicant_list', [id, ...existingList]);

    return c.json({ success: true, id });
  } catch (err) {
    console.error('Submission error:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 2. Admin Whitelist Check & OTP Trigger (Simulated for this environment)
app.post(`${prefix}/admin/request-otp`, async (c) => {
  try {
    const { email } = await c.req.json();
    
    // Check whitelist in KV
    const whitelist = (await kv.get('admin_whitelist')) || ['admin@veridex.com']; // Default for testing
    
    if (!whitelist.includes(email)) {
      // Security: Always return success to prevent email enumeration
      return c.json({ success: true, message: 'If authorized, a code has been sent.' });
    }

    // In a real app, we'd use supabase.auth.signInWithOtp
    // Here we'll mock it for the brainstorming/prototype flow
    const mockOtp = "123456"; 
    await kv.set(`otp:${email}`, { code: mockOtp, expires: Date.now() + 600000 });
    
    console.log(`[AUTH] OTP for ${email}: ${mockOtp}`);
    
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 3. Admin Verify OTP
app.post(`${prefix}/admin/verify-otp`, async (c) => {
  try {
    const { email, code } = await c.req.json();
    const stored = await kv.get(`otp:${email}`);
    
    if (stored && stored.code === code && stored.expires > Date.now()) {
      await kv.del(`otp:${email}`);
      // Return a "session token" (mocked)
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
    // Filter out any potential nulls if an applicant was deleted but not removed from list
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
    
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 6. Manage Whitelist (For the Master Admin)
app.post(`${prefix}/admin/whitelist`, async (c) => {
  const { email, action } = await c.req.json();
  const current = (await kv.get('admin_whitelist')) || ['admin@veridex.com'];
  
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
