# Tutorial: Building This Professional Next.js Portfolio (Beginner-Friendly)

This tutorial explains, step by step, how this project was built and how each part works.

It is written for someone new to frontend development, so you can understand both **what** was done and **why** it was done.

---

## 1. What We Built

We built a local professional website with:

- A polished, responsive homepage (enterprise + edgy visual style)
- Sections for About, Career Journey, Portfolio roadmap, and Contact
- A dedicated contact page (`/contact`) with form validation and anti-spam checks
- A "Digital Twin" chat section that answers questions about Piotr's public profile
- A backend chatbot API (`/api/chat`) that:
  - uses only curated public data
  - refuses sensitive/private requests
  - optionally uses OpenRouter when available
  - safely falls back to local logic if AI API is unavailable

---

## 2. Technology Summary

### Framework and Language

- **Next.js 16.2.4 (App Router)**: full-stack React framework (frontend + backend routes)
  - ⚠️ **Note**: This is a recent version with breaking changes; see `AGENTS.md` for compatibility notes
- **React 19.2.4**: component-based UI
- **TypeScript 5**: JavaScript with type safety

### Styling

- **Tailwind CSS v4** (via `@import "tailwindcss"` in global CSS)
- Custom CSS variables + handcrafted visual system in `app/globals.css`

### Backend Features

- **Route Handlers** in `app/api/*/route.ts` for APIs
- **Nodemailer** for contact form emails
- **HMAC captcha signing** in `lib/captcha.ts`

### AI Chat

- **OpenRouter API** integration in `app/api/chat/route.ts`
- Target model configured as:
  - `google/gemma-4-31b-it:free`
- If OpenRouter is unavailable/rate-limited, chatbot uses local safe fallback

---

## 3. High-Level Architecture

At a high level, the project has 3 layers:

1. **UI layer** (pages/components)
   - Homepage + contact page + chat component
2. **API layer** (server endpoints)
   - `/api/contact` for email form submissions
   - `/api/chat` for Digital Twin responses
3. **Data & security layer**
   - `data/public-profile.json` as the single allowed profile source for chat
   - captcha signing/validation + refusal rules for sensitive requests

---

## 4. Project Walkthrough (Step by Step)

## Step A: Base app structure

Main app files:

- `website/app/layout.tsx`
- `website/app/page.tsx`
- `website/app/globals.css`

`layout.tsx` defines global HTML wrapper, metadata, and fonts.

```tsx
export const metadata: Metadata = {
  title: "Piotr Kroczak | AI & Data Science",
  description:
    "Professional profile site for Piotr Kroczak focused on AI, data science, and automation.",
};
```

---

## Step B: Homepage content and sections

The homepage (`app/page.tsx`) is a single-page experience containing:

- Hero section
- About section
- Career timeline
- Portfolio roadmap cards
- Digital Twin section
- Contact strip

Static content arrays (like career timeline) are defined in the same file for now:

```tsx
type CareerStep = {
  period: string;
  role: string;
  company: string;
  summary: string;
  impact: string[];
};
```

Then rendered with `.map()`:

```tsx
{careerJourney.map((step) => (
  <article key={`${step.company}-${step.period}`}>
    <p>{step.period}</p>
    <h3>{step.role}</h3>
    <h4>{step.company}</h4>
  </article>
))}
```

This is a common React pattern: define data first, then render it dynamically.

---

## Step C: Custom design system

All major styling lives in `app/globals.css`.

Important ideas used:

- CSS variables for theme tokens:

```css
:root {
  --bg-0: #f6f8fb;
  --bg-1: #dfe6ef;
  --ink: #0f1828;
  --accent: #00a8c5;
}
```

- Shared component classes (`.panel`, `.btn-primary`, `.contact-strip`)
- Responsive breakpoints (`@media (max-width: 980px)`, `@media (max-width: 720px)`)
- Motion (`.reveal`) with reduced-motion fallback

This gives the site a consistent look while still allowing each section to feel distinct.

---

## Step D: Contact page + form workflow

Contact page files:

- `app/contact/page.tsx`
- `app/contact/contact-form.tsx`
- `app/api/contact/route.ts`
- `lib/captcha.ts`

### 1) Page setup

`/contact` generates a captcha challenge server-side and passes it to the client form.

```tsx
const captcha = createCaptchaChallenge();
```

### 2) Client form

The form sends `FormData` to `/api/contact`:

```tsx
const response = await fetch("/api/contact", {
  method: "POST",
  body: formData,
});
```

### 3) API validation

The backend validates:

- required fields
- email format
- size limits
- captcha signature + answer
- honeypot field (bot trap)

### 4) Email sending

If valid and SMTP is configured, it sends to `User Email` with Nodemailer.

---

## Step E: Digital Twin chatbot

Chatbot files:

- `app/components/VirtualMeChat.tsx` (UI)
- `app/api/chat/route.ts` (logic)
- `data/public-profile.json` (allowed facts)

### 1) Curated public data source

The chatbot must only answer from:

- `website/data/public-profile.json`

This is the most important safety boundary.

### 2) Chat UI behavior

`VirtualMeChat.tsx` keeps message history in React state and posts user questions to `/api/chat`.

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([]);
```

Starter questions are pre-defined buttons for usability.

### 3) Backend safety policy

`/api/chat` applies strict rules:

- private/sensitive request patterns are refused
- unknown topics return "not available"
- only curated public facts are used

Example refusal pattern list includes:

```ts
const PRIVATE_REQUEST_PATTERNS: RegExp[] = [
  /profile\.pdf/i,
  /picture\.png/i,
  /(^|[^a-z])\.env/i,
  /\bapi key\b/i,
  /\bsystem prompt\b/i,
];
```

### 4) OpenRouter + fallback

The API first computes a safe local answer from the curated profile data.

Then it tries OpenRouter (Gemma 4 31B free) for response refinement:

```ts
const DIGITAL_TWIN_MODEL = "google/gemma-4-31b-it:free";
```

If OpenRouter fails (for example rate limit), it gracefully returns local safe output.

This ensures the chatbot still works even when AI provider access is unavailable.

---

## 5. Detailed Code Review (with Beginner Notes)

## A) `app/layout.tsx`

Purpose:

- global metadata (title/description)
- global fonts
- wraps all pages

Key beginner takeaway:

- In App Router, `layout.tsx` is shared across routes.

---

## B) `app/page.tsx`

Purpose:

- main homepage composition
- data arrays for content blocks
- section navigation

Key beginner takeaway:

- Keep repetitive UI data in arrays + map render to avoid copy-paste.

---

## C) `app/components/VirtualMeChat.tsx`

Purpose:

- interactive chat frontend
- request/response lifecycle handling

Core flow:

1. user types question
2. frontend calls `/api/chat`
3. assistant response appended to message list

Key beginner takeaway:

- `useState` manages UI state; async `fetch` connects UI to backend APIs.

---

## D) `app/api/chat/route.ts`

Purpose:

- enforce chatbot safety policy
- optionally call OpenRouter
- return fallback safely

High-level logic:

1. parse user question
2. reject private/sensitive prompts
3. generate local answer from curated data
4. try OpenRouter with strict system prompt
5. if OpenRouter fails, return local answer

Key beginner takeaway:

- You can treat backend routes as "secure decision points" and keep sensitive logic server-side.

---

## E) `app/api/contact/route.ts`

Purpose:

- validate contact form
- anti-spam checks
- send mail via SMTP

Key beginner takeaway:

- Always validate user input on the server, even if you already validate in the browser.

---

## F) `lib/captcha.ts`

Purpose:

- create signed arithmetic captcha challenges
- verify they were not tampered with

Security idea used:

- HMAC signature (`crypto.createHmac`) protects hidden captcha payload

Key beginner takeaway:

- Hidden form fields are never trusted by default; signatures help verify integrity.

---

## 6. How to Run Locally

### Initial Setup

From project root:

```bash
cd website
npm install
npm run dev
```

Then open:

- `http://localhost:3000`

### Environment Variables

Create a `.env.local` file in the `website/` directory with:

```env
# Optional: For OpenRouter integration
OPENROUTER_API_KEY=your-openrouter-key-here

# Optional: For contact form email (SMTP)
SM# Chat shows fallback instead of OpenRouter

Possible causes:

- `OPENROUTER_API_KEY` is not set or invalid
- free-tier model rate-limited
- temporary provider outage

What happens in this project:

- Chatbot gracefully returns safe answers from `public-profile.json` (`mode: local-mock`)
- Users can still interact; they just won't get AI-refined responses

### Contact form returns "SMTP not configured"

This is expected if email settings aren't set up. The form will:

- ✅ Validate input (required fields, email format, captcha)
- ❌ Not send emails without SMTP settings
- Log validation results to console

**To enable emails**, add SMTP variables to `.env.local` (see Environment Variables section above).

### Captcha validation fails

Possible causes:

- `CAPTCHA_SECRET` not set (using insecure default)
- Secret changed between form generation and submission
- Form data tampered with

During development, the default secret is fine. **Before deploying**, generate a strong random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then set it in `.env.localroduction)

### Optional Checks

```bash
npm run lint
npm run build
```
curity Checklist (Before Deployment)

When deploying to production, ensure:

- [ ] **Captcha Secret**: Generate a strong `CAPTCHA_SECRET` (see troubleshooting). Never use the default.
- [ ] **OpenRouter API Key**: Keep `OPENROUTER_API_KEY` secret; never commit to git.
- [ ] **SMTP Credentials**: Store SMTP password securely; use environment variables, never hardcode.
- [ ] **Profile Data**: Verify `public-profile.json` contains only information you want public.
- [ ] **Refusal Patterns**: Review the `PRIVATE_REQUEST_PATTERNS` in `/api/chat/route.ts` for edge cases.
- [ ] **Rate Limiting**: Consider adding rate limiting to `/api/contact` and `/api/chat` endpoints.
- [ ] **CORS/CSP**: Check `next.config.ts` and headers for security policies (especially if adding external APIs).
- [ ] **Environment Variables**: Use a secrets manager (Vercel Environment Variables, AWS Secrets Manager, etc.) — never `.env.local` in production.

**Example for Vercel deployment:**

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add each variable from `.env.local` as a secure environment variable
3. Never expose `OPENROUTER_API_KEY`, `SMTP_PASSWORD`, or `CAPTCHA_SECRET`

## 10. Project Metadata Files

This project includes two configuration files for AI development:

- **`CLAUDE.md`**: Currently just references `AGENTS.md` (placeholder for Claude-specific instructions)
- **`AGENTS.md`**: Contains breaking change notice for Next.js 16.x — reminders that APIs and conventions may differ from training data

These are hints for developers using AI tools to stay aware of version-specific quirks.

---

## 11. Next Steps

If you want to extend this project, consider:

1. **Part 2 Tutorial**: "How `/api/chat` works line by line" (diving into the safety policy engine)
2. **Analytics Integration**: Add PostHog or Plausible for privacy-respecting usage tracking
3. **Automated Tests**: Jest + React Testing Library for components and API routes
4. **CI/CD Pipeline**: GitHub Actions to lint, test, and deploy on push
5. **Database Integration**: Optional—store contact messages in a database instead of just emailing

---

---

## 9. Se
---

## 7. Common Troubleshooting

## Chat shows fallback instead of OpenRouter

Possible causes:

- OpenRouter key invalid
- free-tier model rate-limited
- temporary provider outage

What happens in this project:

- Chatbot still returns safe answers from `public-profile.json` (`mode: local-mock`)

## Contact form returns SMTP not configured

Add SMTP values in `.env.local` based on `.env.local.example`.

---

## 8. Self-Review: 5 Ways to Improve This Code

1. **Split large homepage into smaller components**  
   `app/page.tsx` is long; breaking sections into components would improve readability and reuse.

2. **Move homepage content to structured data files**  
   Career, pillars, and portfolio arrays could be moved into `data/` to separate content from rendering logic.

3. **Add automated tests for API routes**  
   Unit/integration tests for `/api/chat`, captcha validation, and `/api/contact` would reduce regression risk.

4. **Show chatbot mode in UI (OpenRouter vs fallback)**  
   Exposing a small status badge would make debugging easier and explain behavior to users during provider rate limits.

5. **Improve production observability**  
   Add structured logging and error monitoring (for chat failures and SMTP issues) to diagnose real-world problems faster.

---

If you want, the next step can be a **Part 2 tutorial** focused only on one topic (for example: "How `/api/chat` works line by line").
