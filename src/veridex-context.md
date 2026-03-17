# Veridex — Project Context Briefing
> Paste this at the start of any new chat to bring the assistant fully up to speed.

---

## 1. What Veridex Is

Veridex is a **high-trust student talent marketplace** that connects verified students with companies, hirers, and institutions. The core value proposition is **verification and trust** — students are not just listed, they are vetted. Employers get signal, not noise.

It is not a job board. It is a credentialed talent layer.

---

## 2. Repository & Project Structure

Veridex is split into **two separate repositories and two separate Figma Make projects**:

| Project | Purpose | Status |
|---|---|---|
| **Veridex Waitlist** | Verification gate / onboarding funnel | Complete — pushed to GitHub |
| **Veridex Main Platform** | The core product (marketplace, dashboards, etc.) | Planning phase — not yet started |

The two repos are intentionally separated. Shared design systems and component libraries will be maintained independently and consumed by both.

---

## 3. What Has Already Been Built (Waitlist Platform)

The waitlist system acts as the **verification gate** — the front door of the product. Users apply, are assessed, and either enter the verified talent pool or are placed on a waitlist.

### 9 Issues Fixed (Codebase is Clean)
All of the following were identified and resolved before the final GitHub push:

1. **Step counter inconsistencies** — Steps were misaligned or showing wrong counts
2. **Dynamic Tailwind classes** — Classes were being constructed dynamically, breaking Tailwind's purge/scan
3. **Rationale display bugs** — Decision rationale was not rendering correctly for applicants
4. **Regenerating Application IDs** — IDs were being regenerated on re-render instead of being stable
5. **Orphaned files** — Unused files were present in the codebase
6. **Button text inconsistencies** — CTA buttons had inconsistent language across steps
7. **Unused imports** — Dead imports were cleaned up across components
8. **Duplicate font imports** — Fonts were being imported more than once
9. **Unused type values** — TypeScript types had declared but unused values

The codebase was verified clean before the final push.

---

## 4. Core Design & Architecture Principles

These are non-negotiable rules that apply across both repos.

### Visual / Aesthetic
- **Minimalist terminal aesthetic** — Think monospace, structured, clinical but human. Not flashy.
- Prioritizes clarity and institutional credibility over decoration.

### Backend Architecture
- **Formal state-machine backend** — All application states are explicit and governed
- **RPC-only mutations** — No direct database writes; all changes go through defined remote procedure calls
- **Immutable audit logs** — Every state change is logged and cannot be altered
- **Safety Interlock** — A governance mechanism that prevents unsafe or unauthorized state transitions

### Language Rules (CRITICAL)
- **Human-Centered Language Lock** — This is a hard rule. All user-facing text must be:
  - Conversational and empathetic
  - Free of technical jargon
  - Written as if a thoughtful human is speaking to another human
- Error messages, status updates, button labels, empty states — all of it must pass this rule
- This applies even when the underlying system is highly technical

---

## 5. What's Planned Next (Main Platform)

The following topics were queued for discussion but not yet designed or built:

- **Main platform architecture** — How the marketplace, dashboards, and verification layers connect
- **Landing page design** — The public-facing entry point for the main product
- **Brand identity upload** — Logos, color tokens, typography decisions to be formalized
- **Shared component library strategy** — How components are shared between the Waitlist repo and the Main Platform repo

---

## 6. Tech Stack & Conventions

- **Framework:** React with TypeScript (`.tsx` files)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router (Data mode, using `react-router` not `react-router-dom`)
- **Icons:** `lucide-react`
- **Animation:** `motion/react` from the `motion` package
- **Forms:** `react-hook-form@7.55.0`
- **Toasts:** `sonner@2.0.3`
- **Charts:** `recharts`
- **Images:** Always use Unsplash via tool or `ImageWithFallback` component — never hardcode image URLs
- **No** `tailwind.config.js` — using Tailwind v4 natively
- **No** dynamic Tailwind class construction — all classes must be statically analyzable

---

## 7. Tone & Communication Style

When working on Veridex:
- Write component copy as if Veridex is a trusted institutional partner, not a startup
- Avoid hype language ("revolutionary," "game-changing," etc.)
- Prefer precise, calm, confident language
- The product should feel like it was built by people who take verification seriously

---

## 8. Key Terms Glossary

| Term | Meaning |
|---|---|
| **Safety Interlock** | Governance layer that blocks unauthorized state transitions |
| **RPC-only mutations** | All data changes must go through explicit remote procedure calls |
| **Human-Centered Language Lock** | Rule mandating all user-facing text be conversational and empathetic |
| **Verification Gate** | The waitlist/onboarding flow that screens applicants before platform access |
| **Immutable Audit Log** | A permanent, unalterable record of all state changes |

---

*This document was generated from the Veridex Waitlist Figma Make project after completing the initial build phase. Last updated: March 2026.*
