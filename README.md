# DERBY MANUAL & AUTO

Responsive Next.js App Router website for A1 Driving Academy Ltd’s requested new identity. Includes all requested page routes, three article routes, four email-only enquiry endpoints, shared Zod validation, React Hook Form, Tailwind CSS, Lucide icons and reduced-motion-aware Framer Motion. No database, authentication, payment system or admin area.

## Local development

Requires Node.js 20.9+ (use a supported LTS version in production).

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Without configured email/security credentials, the website displays an honest unavailable message and endpoints return 503; it never simulates a successful submission.

## Configuration

- `src/lib/config.ts`: repeated business details, courses, areas and approved social URLs.
- `src/lib/content.ts`: page introductions and editorial articles.
- `src/app/[...slug]/page.tsx`: complete route-specific content and provisional legal copy.
- `src/app/globals.css`: navy/gold design system and responsive breakpoints.
- `docs/BUSINESS-REVIEW.md`: provisional content decisions and source links.
- `docs/source-audit.json`: collected source data and linked profiles.

Set server-only `RESEND_API_KEY`, `MANAGER_EMAIL` and `FROM_EMAIL` in `.env.local` and your deployment provider. Use a Resend-verified sender domain with SPF/DKIM. Never prefix secrets with NEXT_PUBLIC_.

Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` and `TURNSTILE_HOSTNAMES` (comma-separated hostnames, without protocol). Create a Turnstile widget allowing the actual deployment domain; allow localhost only for development. The server validates the token, hostname and form action. Challenges are single-use and expire; the UI resets them after a failed attempt.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before building. Metadata, canonicals and the sitemap use this value. Keep `NEXT_PUBLIC_BUSINESS_APPROVED=false` during review; after owner approval, revise the draft policies, then set true and rebuild to enable indexing and LocalBusiness structured data.

## Email behaviour

The server sends the manager notification and customer acknowledgement in a single Resend batch. A successful response means Resend accepted the batch, not that downstream inbox delivery is guaranteed. Monitor Resend delivery events, bounces and spam-folder placement. Any provider/network error produces a website error. Reply-to for the manager email is the customer; acknowledgement reply-to is the configured manager.

The client generates a submission reference reused across retries. Provider idempotency uses this reference plus a content hash to prevent duplicate identical batches while permitting corrected details. The customer-device submission timestamp stays stable for retries and is labelled in the email. Messages are HTML-escaped. Logs do not include submitted personal data or secrets.

Security includes server Zod validation, origin checks, payload limits, a local best-effort six-attempt/ten-minute IP limiter, a honeypot and mandatory server-verified Turnstile. The in-memory limiter is not globally shared between serverless instances; Turnstile is the production anti-spam service. Configure Vercel Firewall rate rules for `/api/*` if stronger distributed quotas are desired, without adding a database.

## Vercel deployment

1. Push this project to a repository in your own GitHub/GitLab/Bitbucket account.
2. Import it into Vercel; select the Next.js framework preset and a supported Node LTS runtime. Build command: `npm run build`. Output: default.
3. Add the environment variables above in Vercel project settings for the correct environments. Use separate preview credentials and hostname allowlists where needed.
4. Deploy a preview. Check all forms, email contents and actual receipt at both addresses. Complete the business/legal review before public launch.
5. Add the final domain in Vercel, set its DNS as Vercel instructs, update SITE_URL and Turnstile hostnames, then rebuild.
6. Set approved indexing only after the owner signs off. Review migration redirects from the original site's offer and dated article URLs before switching DNS.

No Vercel account, domain or credentials are supplied in this workspace, so this repository does not represent a live deployment.

## Verification

```powershell
npm run typecheck
npm test
npm run build
```

See `docs/TESTING.md` for integration and browser acceptance checks. Real inbox delivery requires configured provider credentials and permission to use the recipient addresses. No live test emails are sent by the automated suite.
