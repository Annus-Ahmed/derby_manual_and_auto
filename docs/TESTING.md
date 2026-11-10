# Form and deployment acceptance testing

## Automated checks

Run `npm test`, `npm run typecheck`, and `npm run build`. Tests exercise server validation, invalid requests, configuration failures, spam rejection, provider failures, email escaping and the accepted-batch response using mocked providers. These tests never send real email.

## Configured preview

Use a verified Resend sender and two email addresses you control for MANAGER_EMAIL and the form customer. Configure Turnstile for the preview hostname. Do not use Cloudflare always-pass testing keys in production.

1. Visit `/book-lesson/`; submit empty. Required inline errors should appear, with no POST.
2. Try invalid email, short phone, missing privacy acknowledgement, past date and inconsistent course/transmission. Server must reject invalid data even when browser checks are bypassed.
3. Complete a valid request with all preferences. During submission the button and fieldsets are disabled.
4. Confirm the exact requested booking success message appears only after HTTP 200. The manager email should contain every field, an ISO timestamp and the correct subject. Reply should target the customer.
5. Confirm the acknowledgement arrives and clearly says receipt does not confirm a lesson. Inspect Resend delivery status for both messages; API acceptance alone does not guarantee delivery.
6. Exercise `/contact-us/`, `/join-a1/`, `/become-a-driving-instructor/` and `/student-referral-for-instructors/`; check correct email labels. Referral form should not ask for a learner's personal information.
7. Temporarily use an invalid Resend key. The form must show an error and reset the security check. Restore the key afterwards.
8. Remove a required secret. The endpoint must return 503 and never show success.
9. Attempt cross-origin POST, missing/expired/reused security tokens, honeypot content and oversized payloads. They must not send email.
10. Retry the same submission reference and payload: Resend idempotency should prevent a duplicate batch. Changed details produce a new content hash, allowing a corrected submission under the same reference.

## Browser checks

Check 390px mobile, 768px tablet, 1366px laptop and 1920px desktop layouts. Check for horizontal overflow, useful image crops, readable navigation, mobile menu, full-page content and native date picker. Follow every internal link, all course CTAs and phone/email links. Verify query parameters preselect course/area.

Use keyboard only: skip link, navigation, menu button, FAQ disclosures, forms and footer. Inspect visible focus states, label associations, inline errors and screen-reader success/error announcements. Test reduced motion. Native mobile date controls use the device's calendar UI.

Check unique titles/descriptions, canonical URLs, Open Graph image, sitemap, robots and 404 handling. In review mode indexing and structured data remain disabled. When approved, verify the actual domain and owner-approved business data in rendered JSON-LD.
