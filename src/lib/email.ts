import { Resend } from "resend";
import { createHash } from "node:crypto";
import { business } from "./config";
import type { Enquiry } from "./validation";
export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const labels: Record<string, string> = {
  name: "Customer name",
  email: "Email",
  phone: "Telephone",
  course: "Selected course",
  transmission: "Transmission",
  duration: "Lesson duration",
  date: "Preferred date",
  time: "Preferred time",
  area: "Postcode / preferred area",
  experience: "Experience / interests",
  message: "Additional message",
};
export function emailTemplate(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;background:#F5F7FA;padding:32px;color:#18212B"><div style="max-width:640px;margin:auto;background:white"><div style="background:#102C46;border-bottom:4px solid #F5B82E;padding:28px;color:white;font-size:19px;font-weight:bold">${business.name}</div><div style="padding:28px"><h1 style="font-size:23px">${escapeHtml(title)}</h1>${body}<p style="color:#5b6875;font-size:13px">This is an enquiry, not a confirmed lesson booking.</p></div></div></div>`;
}
export async function sendEnquiry(kind: string, data: Enquiry) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const title =
    kind === "booking"
      ? "New Driving Lesson Booking Request"
      : kind === "contact"
        ? "New General Contact Enquiry"
        : kind === "instructor-enquiry"
          ? "New Instructor Recruitment Enquiry"
          : "New Student Referral Enquiry";
  const rows = Object.entries(labels)
    .filter(([k]) => data[k as keyof Enquiry])
    .map(
      ([k, label]) =>
        `<tr><th style="text-align:left;padding:10px;border-bottom:1px solid #ddd">${label}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(String(data[k as keyof Enquiry]))}</td></tr>`,
    )
    .join("");
  const result = await resend.batch.send(
    [
      {
        from: process.env.FROM_EMAIL!,
        to: process.env.MANAGER_EMAIL!,
        replyTo: data.email,
        subject: `${title} – ${business.name}`,
        html: emailTemplate(
          title,
          `<table style="width:100%;border-collapse:collapse">${rows}</table><p>Submitted (customer device): ${escapeHtml(data.submittedAt)}</p><p>Reference: ${data.requestId}</p>`,
        ),
        text: `${title}\n${Object.entries(labels)
          .filter(([k]) => data[k as keyof Enquiry])
          .map(([k, l]) => `${l}: ${data[k as keyof Enquiry]}`)
          .join(
            "\n",
          )}\nSubmitted (customer device): ${data.submittedAt}\nReference: ${data.requestId}`,
      },
      {
        from: process.env.FROM_EMAIL!,
        to: data.email,
        replyTo: process.env.MANAGER_EMAIL!,
        subject: `We’ve received your enquiry – ${business.name}`,
        html: emailTemplate(
          "Your enquiry is with us",
          `<p>Hello ${escapeHtml(data.name)},</p><p>Thank you for getting in touch. We have received your ${kind === "booking" ? "lesson request" : "enquiry"}. Our team will review your details and contact you to discuss the next steps.</p><p>Your reference: ${data.requestId}</p>`,
        ),
        text: `Hello ${data.name},\nWe have received your enquiry. Our team will contact you to discuss next steps. This is not a confirmed booking. Reference: ${data.requestId}`,
      },
    ],
    {
      idempotencyKey: `${kind}/${data.requestId}/${createHash("sha256")
        .update(
          JSON.stringify(
            Object.fromEntries(
              Object.keys(labels).map((k) => [
                k,
                data[k as keyof Enquiry] || "",
              ]),
            ),
          ),
        )
        .digest("hex")
        .slice(0, 20)}`,
    },
  );
  if (result.error || !result.data)
    throw new Error("Email provider rejected request");
}
