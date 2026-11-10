import { NextRequest, NextResponse } from "next/server";
import { bookingSchema, contactSchema } from "./validation";
import { sendEnquiry } from "./email";
const buckets = new Map<string, { count: number; until: number }>();
const reply = (message: string, status: number, extra?: object) =>
  NextResponse.json(
    { message, ...extra },
    { status, headers: { "Cache-Control": "no-store" } },
  );
export function handler(kind: string) {
  return async function POST(req: NextRequest) {
    try {
      const origin = req.headers.get("origin");
      if (!origin || origin !== new URL(req.url).origin)
        return reply("Please submit the form from this website.", 403);
      if (!req.headers.get("content-type")?.startsWith("application/json"))
        return reply("Please send a valid form submission.", 415);
      if (Number(req.headers.get("content-length") || 0) > 20000)
        return reply("Your message is too large.", 413);
      const ip = process.env.VERCEL
        ? req.headers.get("x-vercel-forwarded-for")?.split(",")[0] || "unknown"
        : req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
      const now = Date.now();
      for (const [key, b] of buckets) if (b.until < now) buckets.delete(key);
      const b = buckets.get(ip) || { count: 0, until: now + 600000 };
      b.count++;
      buckets.set(ip, b);
      if (b.count > 6)
        return reply(
          "Too many attempts. Please wait ten minutes or telephone the team.",
          429,
        );
      const raw = await req.text();
      if (raw.length > 20000) return reply("Your message is too large.", 413);
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        return reply("Invalid form data.", 400);
      }
      const parsed = (
        kind === "booking" ? bookingSchema : contactSchema
      ).safeParse(body);
      if (!parsed.success)
        return reply("Please check the highlighted fields.", 400, {
          errors: parsed.error.flatten().fieldErrors,
        });
      if (
        !process.env.RESEND_API_KEY ||
        !process.env.MANAGER_EMAIL ||
        !process.env.FROM_EMAIL
      )
        return reply(
          "Online enquiries are temporarily unavailable. Please telephone the team.",
          503,
        );
      const secret = process.env.TURNSTILE_SECRET_KEY;
      if (!secret)
        return reply(
          "Online enquiries are temporarily unavailable. Please telephone the team.",
          503,
        );
      const verification = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: new URLSearchParams({
            secret,
            response: parsed.data.token,
            ...(ip === "local" || ip === "unknown" ? {} : { remoteip: ip }),
          }),
          signal: AbortSignal.timeout(10000),
        },
      );
      const check = await verification.json();
      const hosts = (
        process.env.TURNSTILE_HOSTNAMES || new URL(req.url).hostname
      )
        .split(",")
        .map((s) => s.trim());
      if (
        !verification.ok ||
        !check.success ||
        !hosts.includes(check.hostname) ||
        check.action !== kind
      )
        return reply("Please complete the security check again.", 400);
      await sendEnquiry(kind, parsed.data);
      return reply(
        kind === "booking"
          ? "Thank you! Your booking request has been submitted successfully. Our team will review your preferred lesson details and contact you to confirm availability."
          : "Thank you! Your enquiry has been received. Our team will contact you to discuss the next steps.",
        200,
      );
    } catch {
      return reply(
        "We could not send your enquiry. Please try again or telephone the team. Your lesson has not been confirmed.",
        502,
      );
    }
  };
}
