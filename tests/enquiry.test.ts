import { test } from "node:test";
import assert from "node:assert/strict";
import { bookingSchema, contactSchema } from "../src/lib/validation";
import { escapeHtml } from "../src/lib/email";
import { handler } from "../src/lib/handler";
import { NextRequest } from "next/server";
const valid = {
  name: "Test Learner",
  email: "learner@example.com",
  phone: "07700 900123",
  area: "DE1 1AA",
  message: "Please discuss availability.",
  privacy: true,
  course: "Manual Driving Lessons",
  transmission: "Manual",
  duration: "1 hour",
  date: "2099-12-01",
  time: "Morning",
  website: "",
  token: "test-token",
  requestId: "dd720684-8210-4a10-a76e-bc954ca1549b",
  submittedAt: "2026-11-10T10:00:00.000Z",
};
test("booking validates required details, dates, contact input and course consistency", () => {
  assert.equal(bookingSchema.safeParse(valid).success, true);
  for (const override of [
    { email: "invalid" },
    { phone: "abc1234567" },
    { privacy: false },
    { date: "2020-01-01" },
    { date: "2099-02-31" },
    { date: "" },
    { course: "" },
    { transmission: "Automatic" },
    { website: "spam" },
    { message: "a".repeat(3001) },
  ])
    assert.equal(
      bookingSchema.safeParse({ ...valid, ...override }).success,
      false,
      JSON.stringify(override),
    );
});
test("contact enquiries require a useful message", () => {
  assert.equal(
    contactSchema.safeParse({ ...valid, message: "" }).success,
    false,
  );
  assert.equal(contactSchema.safeParse(valid).success, true);
});
test("customer content is escaped for HTML email", () => {
  assert.equal(
    escapeHtml("<img src=\"x\"> & 'hi'"),
    "&lt;img src=&quot;x&quot;&gt; &amp; &#39;hi&#39;",
  );
});
const request = (
  data: unknown,
  origin = "http://localhost:3000",
  ip = "127.0.0.1",
) =>
  new NextRequest("http://localhost:3000/api/booking", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(data),
  });
test("email-only handler rejects invalid, foreign-origin, unconfigured and spam requests; reports provider errors honestly", async () => {
  const originalFetch = globalThis.fetch;
  const before = { ...process.env };
  const post = handler("booking");
  try {
    assert.equal(
      (await post(request(valid, "https://other.example"))).status,
      403,
    );
    assert.equal((await post(request({ ...valid, email: "bad" }))).status, 400);
    delete process.env.RESEND_API_KEY;
    assert.equal((await post(request(valid))).status, 503);
    process.env.RESEND_API_KEY = "re_test";
    process.env.FROM_EMAIL = "test@example.com";
    process.env.MANAGER_EMAIL = "manager@example.com";
    process.env.TURNSTILE_SECRET_KEY = "secret";
    process.env.TURNSTILE_HOSTNAMES = "localhost";
    let sent = 0;
    let payload: unknown;
    let fail = false;
    let spam = false;
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      if (url.includes("siteverify"))
        return new Response(
          JSON.stringify({
            success: !spam,
            hostname: "localhost",
            action: "booking",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      sent++;
      payload = JSON.parse(String(init?.body));
      return new Response(
        JSON.stringify(
          fail
            ? { name: "validation_error", message: "rejected" }
            : { data: [{ id: "email-1" }, { id: "email-2" }] },
        ),
        {
          status: fail ? 422 : 200,
          headers: { "content-type": "application/json" },
        },
      );
    };
    spam = true;
    assert.equal((await post(request(valid))).status, 400);
    assert.equal(sent, 0);
    spam = false;
    fail = true;
    assert.equal((await post(request(valid))).status, 502);
    fail = false;
    const response = await post(
      request(valid, "http://localhost:3000", "127.0.0.2"),
    );
    assert.equal(response.status, 200);
    assert.match(
      (await response.json()).message,
      /contact you to confirm availability/,
    );
    assert.equal(sent, 2);
    assert.ok(JSON.stringify(payload).includes("learner@example.com"));
    for (let i = 0; i < 7; i++)
      await post(request(valid, "http://localhost:3000", "127.0.0.3"));
    assert.equal(
      (await post(request(valid, "http://localhost:3000", "127.0.0.3"))).status,
      429,
    );
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env))
      if (!(key in before)) delete process.env[key];
    Object.assign(process.env, before);
  }
});
