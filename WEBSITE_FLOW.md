# Veridex System — Consolidated Website Flow & Logic (Figma UI + Veridex Backend)

> Source of truth: `Abdurrahman99max/Veridex` (Vercel) + `Veridexapp` (Figma Make) merged into `Desktop/Veridex System` on `main` `3b9e97e`. Deploy: `veridex-five.vercel.app`.

## 1. Global Rule — Home Always First

`src/App.tsx:23` initializes `view='landing'` unconditionally. Draft resume is **opt-in** via sticky banner `LandingPage.tsx:23` `hasDraft` check, not auto-redirect. Explicit routes only via `?dex` → admin, `?seed` → seeder, `?design`/`#design-system` → DesignSystem. On first load every user sees Home.

```
GET /              → App.view='landing' → LandingPage (Home)
GET /?dex          → AdminLogin → AdminHub (whitelisted only)
GET /?design       → DesignSystemPage (full vx token catalogue)
localStorage vdx_app_draft_view='application' → Home + "Resume application →" banner, click → view='application' step=N
```

## 2. Home — Consolidated Landing (all Figma UI preserved)

Order exactly as on `veridexapp.figma.site` + Vercel copy, now with vx tokens (`theme.css:10` `#08307F` navy, `#0BE149` green, Urbanist):

| # | Section file | Figma origin | Content |
|---|--------------|--------------|---------|
| 1 | `Hero.tsx:22` | Vercel `Trusted work experience — before you graduate.` + Figma `Cohort 01 Now Open / The verification…` merged | Nav Veridex wordmark, `Not for beginners • Manual Review` pill, headline, subheadline, `Apply for Access` (→ `gate`) / `Check Status` (modal) / `Join waitlist` (→ application prep) |
| 2 | `ReliabilitySection.tsx:1` | Figma `Every task builds your record` + Alex Johnson card | Left: Alex Johnson VERIFIED 8/3/2 + TechCorp view; Right: `94% High Reliability` + 3 bars `Delivery 96, Quality 92, Consistency 94` (from `calculateReliability:270`) |
| 3 | `RiskSection.tsx:1` | Figma `CVs don't prove ability. They create risk.` | 3 risk cards + `Veridex removes uncertainty` navy callout |
| 4 | `WhoIsThisFor.tsx:5` | Shared (`This is for you if… / not for you`) | Selection criteria 5+5 checklist, Manual Review Required |
| 5 | `HowItWorks.tsx:4` | Shared (`How Veridex Works` 3 steps) | 1 Apply (Open Entry) → 2 Verify (Strict Filter, highlighted) → 3 Work & Trust (Earned Access) |
| 6 | `CohortSection.tsx:1` | Figma `Which track are you on?` | Progress 38/50 76%, Core card (GitHub/Figma/Case studies) → `Claim your spot` / Prep card (roadmap) → `Start your roadmap` |
| 7 | `WhatWeLookFor.tsx:4` | Shared `We are looking for evidence, not potential.` | Who qualifies 3 × green vs Who doesn't 3 × grey |
| 8 | `EmployerSection.tsx:1` | Figma `Hire talent you can actually trust.` | For Employers 3 steps + student 3 steps, `Register your company` |
| 9 | `FinalCTASection.tsx:1` | Figma `Your verified profile is waiting.` | `Get Verified` + `Learn how verification works →` |
| 10 | `Footer.tsx:5` | Shared | Brand + Platform/Resources/Legal + © |

All CTAs wire to `App.handleApply/handleWaitlist/handleCheckStatus` — no dead `href="#"` (fixed from Playwright finding).

## 3. Application Flow (frontend, no router — `App.view` state)

```
Landing --Apply--> EntryGate ("This Is Not for Everyone") --Apply--> Application
                                                 └─Waitlist───────┘

Application view (bg #EEF2F7, localStorage draft):
  track=null decided in Step1, then
  Step1Eligibility (track choice core/prep, eligibility) --Next--> 
  Step2SkillProof (12 domains + per-domain acceptable/rejection, core: proofUrl + rationale≥20w + confirmedOriginal; prep: skillLevel + learningMethods) --Next-->
  if prep: Step3Commitment (prep) --Next--> ReviewStep --Confirm--> submitApplication
  if core: Step3Verification --Next--> Step3Commitment (core) --Next--> ReviewStep --Confirm--> submitApplication

  Each Next shows NextStepConfirmation modal ("Verify your input") → confirmNextStep merges pendingStepData into formData, increments step (prep 4 steps, core 5 steps), or stays on Back.

submitApplication: POST https://{projectId}.supabase.co/functions/v1/make-server-45707f2b/submit-application {email, track, skillCategory, proofUrl, rationale, ...}
  → id VX-C|P-XXXX, application_state='APPLIED', account_status='ACTIVE', strike_count=0, tags
  → KV applicant:{id}, email_to_id_map, applicant_list, audit INITIAL_SUBMISSION
  → duplicate email → view='duplicate' (Record Located → Check My Status)
  → ok → view='success' (SuccessScreen track=core|prep, clears vdx_draft) → Return Home resets

BackStep: step>1 → step-1 else → gate. draft persists: vdx_app_draft_data/step/view/track.
```

## 4. Backend & Evaluation Engine

**Edge** `src/supabase/functions/make-server-45707f2b/index.ts:746` Hono on `prefix=/make-server-45707f2b`, KV via `kv_store.ts`, Resend emails, Supabase Storage `make-45707f2b-veridex-docs`.

**Key routes:**
- `POST /submit-application:343` idempotency via `email_to_id_map`, duplicate guard
- `POST /status-lookup:383` checks `SUSPENDED && cooldown_until>now` → suspended response else `{id,name,application_state,account_status,track,reliabilityTier}`
- `POST /admin/execute-transition:419` → `executeTransitionInternal:279` ALLOWED_TRANSITIONS:69, reason≥5 for REJECTED|ROUTED_TO_PREP|REVOKED|ARCHIVED, writes `applicant:{id}.application_state`, recalculates `reliabilityTier=calculateReliability:270`, logs `audit:*` + `emitEvent USER_*` → Resend branded email `processEvent:195`
- `POST /admin/issue-strike:433` uses `policy:strike:63` `warning1,suspension3,revocation5,cooldown7d` → writes `strike:{id}:{strikeId}`, updates `strike_count`, sets `SUSPENDED+cooldown_until` or `REVOKED`, emits `STRIKE_ISSUED|USER_SUSPENDED|REVOKED`
- `GET /admin/applicants:545`, `GET /admin/audit-logs:557`, `POST /vault/upload:672` + `POST /admin/signed-url:706`
- OTP + whitelist `MASTER_ADMIN=onitiloabdurrahman@gmail.com:28`, roles `super_admin|admin|moderator:31`, self-approval blocked.

**DB `database/schema.sql:266`** 6 tables: `applications` (track/core|prep, application_state 6 values, reliability_tier, strike_count, tags JSONB, RLS service_role only), `admin_whitelist`, `audit_logs` (immutable), `strike_history` (5 strike_types), `policy_changes`, `email_notifications`. `verify_setup.sql` + `bootstrap.sql` for first super admin.

**Reliability (current → consolidated):** current `high|medium|under_review` by strike count; consolidated adds `reliability_score 0-100 = 0.4*delivery +0.4*quality +0.2*consistency` mapped to same tiers, displayed via `ReliabilitySection` progress bars `#0BE149`.

## 5. Admin & Ops

`/?dex` → `AdminLogin` OTP (6-digit, 10min, `otp:{email}` KV) → `AdminHub` (applicant list, transition buttons ACCEPTED/REJECTED/ROUTED_TO_PREP/ARCHIVED, strike modal, audit log, whitelist CRUD, policy governance `request-policy-change:498` → `approve-policy-change:519` dual-admin). `/ ?seed` → `DemoDataSeeder` with `seed-demo-data.ts`.

Design system QA: `/?design` → `DesignSystemPage.tsx:1475` shows VxLogo 4 variants/5 sizes, VxButton 5 variants, VxBadge 6, VxInput/Select/Card/Avatar/Alert/Progress, ProfileCard, JobCard — single token truth.

## 6. Navigation Map

```
Home ──Apply──▶ Gate ──Start──▶ App Step1 → Step2 → Step3* → Review → Success / Duplicate
 │         └──Waitlist──────────────────────────────────────────────┘
 ├──Check Status (modal) → status-lookup → suspended|found view
 ├──Resume draft banner (if vdx_app_draft_view)
 ├──Employer CTA → Gate (same flow; future: employer register)
 ├──Cohort Prep → Gate waitlist path
 └──Footer links (static)

Admin: /?dex → OTP → Hub → [transition|strike|policy|vault]
Seeder: /?seed → demo data
Design: /?design → catalogue (no auth)
```

All routes client-side, no Next.js — `Vite 6.3.5` SPA, `vercel.json` at root ensures SPA fallback.

## 7. Deployment

`push main` → Vercel `veridex-five.vercel.app` auto-deploy (Vite build). `vercel.json:1` at root, `index.html` → `src/main.tsx` → `App.tsx`. `vite.config.ts` + `@tailwindcss/vite`. Fresh build replaces `index-CAgWDVPd.js/Bsv8An9P.css` with new hash.
