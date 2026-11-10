import { z } from "zod";
import { courses } from "./config";
const text = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, "Please complete this field.")
    .max(max, `Please use no more than ${max} characters.`);
export const enquirySchema = z.object({
  name: text(2, 100),
  email: z.email("Please enter a valid email address.").max(254),
  phone: text(7, 30).refine(
    (v) =>
      /^[+\d\s().-]+$/.test(v) &&
      v.replace(/\D/g, "").length >= 7 &&
      v.replace(/\D/g, "").length <= 15,
    "Please enter a valid telephone number.",
  ),
  area: text(2, 120),
  message: z.string().trim().max(3000),
  privacy: z
    .boolean()
    .refine((v) => v, "Please acknowledge the privacy policy."),
  course: z
    .enum(
      [
        ...courses.map((c) => c.label),
        "Refresher Lessons",
        "Other available services",
      ],
      { error: "Please choose a course." },
    )
    .optional(),
  transmission: z
    .enum(["Manual", "Automatic", "Please advise"], {
      error: "Please choose a transmission.",
    })
    .optional(),
  duration: z
    .enum(["1 hour", "1.5 hours", "2 hours", "Please advise"], {
      error: "Please choose a lesson duration.",
    })
    .optional(),
  date: z.string().optional(),
  time: z
    .enum(["Morning", "Afternoon", "Evening", "Flexible"], {
      error: "Please choose a preferred time.",
    })
    .optional(),
  experience: z.string().trim().max(1000).optional(),
  website: z.string().max(0, "Unable to submit."),
  token: z.string().max(2048),
  requestId: z.uuid(),
  submittedAt: z.iso.datetime(),
});
export const contactSchema = enquirySchema.refine(
  (d) => d.message.length >= 10,
  {
    path: ["message"],
    message: "Please include a message of at least 10 characters.",
  },
);
export const bookingSchema = enquirySchema
  .extend({ date: z.string().min(1, "Please choose a preferred date.") })
  .superRefine((d, ctx) => {
    for (const key of [
      "course",
      "transmission",
      "duration",
      "date",
      "time",
    ] as const)
      if (!d[key])
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Please complete this field.",
        });
    if (d.course === "Manual Driving Lessons" && d.transmission !== "Manual")
      ctx.addIssue({
        code: "custom",
        path: ["transmission"],
        message: "Choose Manual for manual lessons.",
      });
    if (
      d.course === "Automatic Driving Lessons" &&
      d.transmission !== "Automatic"
    )
      ctx.addIssue({
        code: "custom",
        path: ["transmission"],
        message: "Choose Automatic for automatic lessons.",
      });
    if (d.date) {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/London",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      const parsed = new Date(d.date + "T12:00:00Z");
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(d.date) ||
        !Number.isFinite(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== d.date ||
        d.date < today
      )
        ctx.addIssue({
          code: "custom",
          path: ["date"],
          message: "Choose a valid date from today onwards.",
        });
    }
  });
export type Enquiry = z.infer<typeof enquirySchema>;
