# Verification record

Completed 10 November 2026.

- Production `npm run build`: passed; all requested routes generated and all four API handlers available.
- `npm run typecheck`: passed. Production build also performed TypeScript validation.
- `npm test`: 4 tests passed, including invalid field/date checks, contact message requirements, HTML escaping, foreign-origin rejection, missing configuration, failed spam verification, rejected provider requests, accepted batches and local rate limiting. Network providers are mocked; no test email sent.
- Production HTTP crawl: 20 linked content pages returned 200 with unique page titles, a canonical and one H1. Sitemap, robots and Open Graph image returned 200. Unknown route returned 404. Machine-readable results are in `smoke-results.json`.
- Production endpoint checks: valid form-shaped requests returned 503 for booking, contact, instructor-enquiry and student-referral with missing credentials; none falsely reported success.
- Browser QA: homepage/booking representative layouts checked at 390px, 768px, 1366px and 1920px. No horizontal document overflow. Mobile menu opened and its booking link navigated correctly. Empty booking submission displayed inline validation and focused the first invalid field. Course anchor navigated to the course section. Locally hosted photographs loaded; browser console inspection returned no errors after image fixes.
- Dependencies: installation audit reported zero known vulnerabilities at installation time.

Limits: no live Resend account/sender or Turnstile credentials were provided, so actual message delivery, mailbox placement and a real security challenge were not verified. No Vercel deployment was made. Business details, exact prices, complete instructor profiles and draft policies still need owner review. No screen-reader audit or external device lab was performed.
