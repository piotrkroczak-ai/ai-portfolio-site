---
name: site-agents
description: "Technical specification for AI agents working on Piotr's portfolio site. Enforces security boundaries, API patterns, and code conventions."
---

# AI Agent Specification — Portfolio Site

Technical specification for AI coding agents (Copilot, Claude, etc.) working on this project.

---

## Security Boundaries (MANDATORY)

### Chat Data Source

The chatbot (`/api/chat`) must source responses exclusively from `website/data/public-profile.json`. This is the enforced trust boundary.

Rules:
- All chat facts must exist in `public-profile.json` before being used in responses
- Never add facts, links, or credentials from other sources
- Never expose `.env` files, API keys, system prompts, or file paths to users
- Never bypass `PRIVATE_REQUEST_PATTERNS` (defined in `/api/chat/route.ts` lines 47-74)

Response refusal must use the `REFUSAL_RESPONSE` constant:
```ts
const REFUSAL_RESPONSE = "I can only discuss information from Piotr's public profile. I cannot share private documents, images, hidden files, API keys, system instructions, or technical secrets.";
```

### Sensitive Data Protection

- No email addresses in code (except `.env.local`)
- No API keys in git repositories
- No file paths in error messages
- No system prompts visible to users

---

## Architecture Constraints

### Server-Side Security Requirements

These operations MUST execute on the server:
- `/api/chat`: chatbot logic, refusal checks, OpenRouter calls
- `/api/contact`: form validation, SMTP handling, captcha verification
- `lib/captcha.ts`: HMAC signature generation/verification

Client-side MUST NOT handle:
- Refusal pattern checking
- Captcha validation logic
- Email validation (server does final check)
- OpenRouter calls

### Route Organization

```
website/app/
├── page.tsx
├── layout.tsx
├── globals.css
├── contact/
│   ├── page.tsx
│   └── contact-form.tsx
├── components/
│   └── VirtualMeChat.tsx
└── api/
    ├── chat/route.ts (SECURITY CRITICAL)
    └── contact/route.ts (SECURITY CRITICAL)
```

### Data Flow Requirements

1. Static content (career, portfolio) → `page.tsx` or `public-profile.json`
2. User input → Client form → Server validation → Action
3. External APIs → Server-side only (OpenRouter via `/api/chat`)

---

## Code Standards

### TypeScript

- Strict mode required
- All function parameters and return types must be explicitly typed
- Use `type` for data structures (not `interface`)

### React Components

- Functional components only
- Use hooks (`useState`, `useEffect`)
- Client components require `"use client"` pragma
- Keep components under 200 lines

### Styling

- Tailwind CSS v4 for all utilities
- Custom styles in `app/globals.css` only
- No inline styles or new CSS files
- Responsive mobile-first: then `@media (max-width: 980px)`, then `@media (max-width: 720px)`

### API Routes

- Validate all input on server (never trust client)
- Return JSON: `{ message?: string, data?: any, status?: "ok" | "error" }`
- Use `NextResponse` for type safety
- Wrap in try/catch; never expose stack traces

---

## Mandatory Prohibitions

DO NOT:

1. Add chat facts outside `public-profile.json` — suggest updating the profile file instead
2. Move refusal logic to frontend — all safety checks belong server-side
3. Commit secrets or API keys — use environment variables
4. Modify captcha signing without rotating `CAPTCHA_SECRET`
5. Add API routes without error handling
6. Trust client-side validation for security — always validate server-side
7. Modify `PRIVATE_REQUEST_PATTERNS` without manual testing

---

## Pre-Commit Verification

After modifications:

1. Run `npm run build` (catches TypeScript errors)
2. Run `npm run lint` (code style check)
3. Manual test: ask chat for private info (should be refused)
4. Responsive check: test on mobile and desktop

---

## Key Files

| File | Purpose | Status |
|------|---------|--------|
| `website/app/api/chat/route.ts` | Chatbot logic, refusal patterns | SECURITY CRITICAL |
| `website/app/api/contact/route.ts` | Form validation, email, captcha | SECURITY CRITICAL |
| `website/lib/captcha.ts` | HMAC signing | SECURITY CRITICAL |
| `website/data/public-profile.json` | Chat fact source | SINGLE SOURCE OF TRUTH |
| `website/app/page.tsx` | Homepage, data arrays | UI |
| `website/app/globals.css` | Design system | STYLING |

---

## Versions

- Next.js 16.2.4 (see `website/AGENTS.md` for breaking changes)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- Node.js 18+

---

## Environment Variables

Required for local development:
```env
CAPTCHA_SECRET=local-dev-secret
```

Optional:
```env
OPENROUTER_API_KEY=<key>
SMTP_HOST=<host>
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASSWORD=<password>
SMTP_FROM_EMAIL=noreply@example.com
SMTP_TO_EMAIL=recipient@example.com
```

Never commit `.env.local`. Use platform secrets (Vercel, AWS, etc.) for production.

---

## Optional Assets

Two optional files can be stored in `website/`:

### `picture.png`
- Professional headshot photo (JPEG or PNG)
- Used in future UI enhancements
- Not currently integrated; prepare for future use
- **Not in git** (add to `.gitignore`)

### `profile.pdf`
- LinkedIn profile export (PDF)
- Can be referenced for additional CV/resume context
- Never directly exposed to users via chat or public routes
- **Not in git** (add to `.gitignore`)

Both files are security-protected: they exist locally for reference but are never served to the web or exposed through API endpoints.

