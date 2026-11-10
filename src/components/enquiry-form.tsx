"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { bookingSchema, contactSchema, type Enquiry } from "@/lib/validation";
import { business, courses } from "@/lib/config";
type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
export function EnquiryForm({
  kind = "booking",
}: {
  kind?: "booking" | "contact" | "instructor-enquiry" | "student-referral";
}) {
  const booking = kind === "booking";
  const [success, setSuccess] = useState("");
  const [failure, setFailure] = useState("");
  const [ready, setReady] = useState(false);
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    watch,
  } = useForm<Enquiry>({
    resolver: zodResolver(booking ? bookingSchema : contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      area: "",
      message: "",
      experience: "",
      website: "",
      privacy: false,
      token: "",
    },
  });
  const selected = watch("course");
  useEffect(() => {
    setValue("requestId", crypto.randomUUID());
    setValue("submittedAt", new Date().toISOString());
    const p = new URLSearchParams(location.search);
    if (p.get("area")) setValue("area", p.get("area")!);
    const c = courses.find((c) => c.slug === p.get("course"));
    if (c) setValue("course", c.label);
  }, [setValue]);
  useEffect(() => {
    if (selected === "Manual Driving Lessons")
      setValue("transmission", "Manual");
    if (selected === "Automatic Driving Lessons")
      setValue("transmission", "Automatic");
  }, [selected, setValue]);
  useEffect(() => {
    if (!ready || !key || !widget.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(widget.current, {
      sitekey: key,
      action: kind,
      theme: "light",
      size: "flexible",
      callback: (token: string) => setValue("token", token),
      "expired-callback": () => setValue("token", ""),
      "error-callback": () => {
        setValue("token", "");
        setFailure(
          "The security check could not load. Please retry or telephone the team.",
        );
      },
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, [ready, key, kind, setValue, success]);
  async function submit(data: Enquiry) {
    setFailure("");
    try {
      if (!key || !data.token) {
        setFailure(
          "Please complete the security check. If unavailable, telephone the team.",
        );
        return;
      }
      const r = await fetch(`/api/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await r.json();
      if (!r.ok) {
        if (result.errors)
          for (const [k, v] of Object.entries(result.errors))
            setError(k as keyof Enquiry, { message: (v as string[])[0] });
        throw new Error(
          result.message ||
            "We could not send your enquiry. Please telephone the team.",
        );
      }
      setSuccess(result.message);
    } catch (e) {
      setFailure(
        e instanceof Error
          ? e.message
          : "Unable to submit. Please telephone the team.",
      );
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      setValue("token", "");
    }
  }
  const field = (
    name: keyof Enquiry,
    label: string,
    type = "text",
    required = true,
  ) => (
    <div className="field" key={name}>
      <label htmlFor={name}>
        {label}
        {required ? " *" : " (optional)"}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        aria-required={required}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        autoComplete={
          { name: "name", email: "email", phone: "tel", area: "postal-code" }[
            name as string
          ]
        }
        min={
          type === "date"
            ? new Intl.DateTimeFormat("en-CA", {
                timeZone: "Europe/London",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date())
            : undefined
        }
      />
      {errors[name] && (
        <span id={`${name}-error`} className="field-error">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );
  const select = (name: keyof Enquiry, label: string, options: string[]) => (
    <div className="field" key={name}>
      <label htmlFor={name}>{label} *</label>
      <select
        id={name}
        {...register(name)}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      >
        <option value="">Please select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {errors[name] && (
        <span id={`${name}-error`} className="field-error">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );
  if (success)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={48} />
        <h2>Your enquiry is with us.</h2>
        <p>{success}</p>
        <Link className="button navy" href="/">
          Back to home <ArrowUpRight size={18} />
        </Link>
      </div>
    );
  return (
    <form className="enquiry-form" onSubmit={handleSubmit(submit)} noValidate>
      <fieldset disabled={isSubmitting}>
        <legend>
          <span>01</span> A little about you
        </legend>
        <div className="form-grid">
          {field("name", "Full name")}
          {field("email", "Email address", "email")}
          {field("phone", "Phone number", "tel")}
          {field("area", "Postcode or preferred area")}
        </div>
      </fieldset>
      {booking && (
        <fieldset disabled={isSubmitting}>
          <legend>
            <span>02</span> Your preferred lessons
          </legend>
          <div className="form-grid">
            {select("course", "Selected course", [
              ...courses.map((c) => c.label),
              "Refresher Lessons",
              "Other available services",
            ])}
            {select("transmission", "Transmission", [
              "Manual",
              "Automatic",
              "Please advise",
            ])}
            {select("duration", "Preferred lesson duration", [
              "1 hour",
              "1.5 hours",
              "2 hours",
              "Please advise",
            ])}
            {field("date", "Preferred date", "date")}
            {select("time", "Preferred time", [
              "Morning",
              "Afternoon",
              "Evening",
              "Flexible",
            ])}
          </div>
          <p className="fine">
            Preferences help us plan. They do not reserve a lesson or guarantee
            availability.
          </p>
        </fieldset>
      )}
      {(kind === "instructor-enquiry" || kind === "student-referral") && (
        <fieldset disabled={isSubmitting}>
          <legend>
            <span>02</span> Your teaching plans
          </legend>
          <div className="field">
            <label htmlFor="experience">
              Experience, teaching areas and availability (optional)
            </label>
            <textarea id="experience" {...register("experience")} rows={4} />
            {errors.experience && (
              <span className="field-error">{errors.experience.message}</span>
            )}
          </div>
        </fieldset>
      )}
      <fieldset disabled={isSubmitting}>
        <legend>
          <span>{booking ? "03" : "02"}</span> Anything else?
        </legend>
        <div className="field">
          <label htmlFor="message">
            {booking ? "Additional message (optional)" : "Your message *"}
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message", {
              validate: (v) =>
                booking ||
                v.trim().length >= 10 ||
                "Please include a message of at least 10 characters.",
            })}
            placeholder={
              kind === "student-referral"
                ? "Please do not include anyone else’s personal details."
                : "Tell us what you would like us to know."
            }
          />
          {errors.message && (
            <span className="field-error">{errors.message.message}</span>
          )}
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave empty</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            {...register("privacy")}
            aria-invalid={!!errors.privacy}
          />
          <span>
            I have read the <Link href="/privacy-policy/">privacy policy</Link>{" "}
            and understand my details will be used to respond to this enquiry. *
          </span>
        </label>
        {errors.privacy && (
          <p className="field-error">{errors.privacy.message}</p>
        )}
        <div ref={widget} />
        {key ? (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            onReady={() => setReady(true)}
            onError={() =>
              setFailure(
                "The security check could not load. Please telephone the team.",
              )
            }
          />
        ) : (
          <p className="form-notice">
            Online enquiries are being configured. Please call{" "}
            <a href={business.phoneHref}>{business.phone}</a> to speak to the
            team.
          </p>
        )}
        {failure && (
          <p role="alert" className="form-error">
            {failure}
          </p>
        )}
        <button type="submit" className="button gold" disabled={isSubmitting}>
          {isSubmitting
            ? "Sending your enquiry…"
            : booking
              ? "Send booking request"
              : "Send enquiry"}
          <ArrowUpRight size={18} />
        </button>
        <p className="fine secure">
          <LockKeyhole size={13} /> Your details go to the academy team. No
          online payment.
        </p>
      </fieldset>
    </form>
  );
}
