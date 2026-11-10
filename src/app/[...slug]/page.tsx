import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Phone, Mail, MapPin, Clock } from "lucide-react";
import { pages, articles } from "@/lib/content";
import { business, courses, photo } from "@/lib/config";
import { EnquiryForm } from "@/components/enquiry-form";
import {
  Areas,
  CourseCards,
  CTA,
  FAQ,
  Journal,
  Packages,
  ReviewPanel,
} from "@/components/ui";
type Props = { params: Promise<{ slug: string[] }> };
export function generateStaticParams() {
  return [
    ...Object.keys(pages).map((s) => ({ slug: [s] })),
    ...courses.map((c) => ({ slug: ["program", c.slug] })),
    ...articles.map((a) => ({ slug: ["blog", a.slug] })),
  ];
}
function resolve(slug: string[]) {
  const key = slug.join("/");
  const course =
    slug[0] === "program" && slug.length === 2
      ? courses.find((c) => c.slug === slug[1])
      : undefined;
  const article =
    slug[0] === "blog" && slug.length === 2
      ? articles.find((a) => a.slug === slug[1])
      : undefined;
  const page = pages[key];
  return { key, course, article, page };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { course, article, page } = resolve(slug);
  if (!course && !article && !page) return {};
  const title = course
    ? `${course.name} in Derby`
    : article?.title || page.title;
  const description = course?.description || article?.intro || page.description;
  return {
    title,
    description,
    alternates: { canonical: `/${slug.join("/")}/` },
    openGraph: {
      title,
      description,
      url: `/${slug.join("/")}/`,
      type: article ? "article" : "website",
      ...(article ? { images: [photo(article.image, 1200)] } : {}),
    },
  };
}
export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const { key, course, article, page } = resolve(slug);
  if (!course && !article && !page) notFound();
  if (article)
    return (
      <>
        <section className="page-hero container">
          <Link className="eyebrow" href="/blog/">
            ← THE LEARNER JOURNAL
          </Link>
          <h1>{article.title}</h1>
          <p>{article.intro}</p>
        </section>
        <article className="article-full container">
          <div className="article-cover">
            <Image
              src={photo(article.image, 1600)}
              alt="Open scenery for a learning journey"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="reading">
            <p className="eyebrow">{article.category} · 1 MIN READ</p>
            {article.sections.map(([h, p]) => (
              <section key={h}>
                <h2>{h}</h2>
                <p>{p}</p>
              </section>
            ))}
            <Link className="button navy" href="/book-lesson/">
              Talk about your lessons <ArrowUpRight size={18} />
            </Link>
          </div>
        </article>
        <CTA />
      </>
    );
  if (course)
    return (
      <>
        <section className="course-hero">
          <div className="container course-hero-grid">
            <div>
              <p className="eyebrow">{course.tag}</p>
              <h1>
                {course.name}
                <br />
                <em>in Derby.</em>
              </h1>
              <p>{course.description}</p>
              <Link
                className="button gold"
                href={`/book-lesson/?course=${course.slug}`}
              >
                Request {course.name.toLowerCase()} <ArrowUpRight size={17} />
              </Link>
              <p className="fine">
                Availability and current prices confirmed directly.
              </p>
            </div>
            <div className="course-hero-image">
              <Image
                src={photo(course.image, 1200)}
                alt={`A view of the road for ${course.name.toLowerCase()}`}
                fill
                priority
                sizes="(max-width:800px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>
        <section className="section container details-grid">
          <div>
            <p className="eyebrow">MAKE IT YOUR JOURNEY</p>
            <h2>
              A starting point
              <br />
              that suits you.
            </h2>
            <p>{course.detail}</p>
          </div>
          <div className="info-card">
            <h3>Let’s discuss the details</h3>
            <ul className="check-list">
              {[
                "Your previous driving experience",
                "Your postcode and preferred pick-up point",
                "Your ideal lesson length and availability",
                "Current prices and lesson arrangements",
              ].map((t) => (
                <li key={t}>
                  <Check size={17} />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              className="text-link"
              href={`/book-lesson/?course=${course.slug}`}
            >
              Start an enquiry <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
        <FAQ />
        <section className="section soft">
          <div className="container">
            <p className="eyebrow">EXPLORE YOUR OPTIONS</p>
            <h2>Other ways to learn.</h2>
            <CourseCards />
          </div>
        </section>
        <CTA />
      </>
    );
  const formKind =
    key === "book-lesson"
      ? "booking"
      : key === "contact-us"
        ? "contact"
        : key === "student-referral-for-instructors"
          ? "student-referral"
          : key === "join-a1" || key === "become-a-driving-instructor"
            ? "instructor-enquiry"
            : undefined;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
      </section>
      {formKind ? (
        <section className="section container enquiry-layout">
          <aside>
            <p className="eyebrow">A CONVERSATION COMES FIRST</p>
            <h2>
              {formKind === "booking"
                ? "Let’s find your route."
                : "We’re here to help."}
            </h2>
            <p>
              {formKind === "booking"
                ? "Your request goes directly to the academy team. We’ll contact you to discuss your options and confirm the details."
                : "Your enquiry goes directly to the academy team. Please include the information that will help us respond."}
            </p>
            <div className="contact-list">
              <a href={business.phoneHref}>
                <Phone size={19} />
                <span>
                  Call the academy<strong>{business.phone}</strong>
                </span>
              </a>
              <a href={`mailto:${business.email}`}>
                <Mail size={19} />
                <span>
                  Send an email<strong>{business.email}</strong>
                </span>
              </a>
              <p>
                <MapPin size={19} />
                {business.address}
              </p>
              <p>
                <Clock size={19} />
                {business.hours}
              </p>
            </div>
            <a
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/search/?api=1&query=36+Joseph+Street+Derby+DE23+8QH"
            >
              View on Google Maps <ArrowUpRight size={16} />
            </a>
            <p className="fine">
              Contact details and opening hours from the original academy site;
              subject to owner confirmation.
            </p>
          </aside>
          <EnquiryForm kind={formKind} />
        </section>
      ) : null}
      {key === "about" && (
        <>
          <section className="section container details-grid">
            <div>
              <p className="eyebrow">THE SAME CONVERSATION. A NEW LOOK.</p>
              <h2>
                Learning starts
                <br />
                with you.
              </h2>
              <p>
                There is more than one way to learn to drive. Whether you are
                exploring manual lessons, considering automatic or returning for
                a refresher, a good place to begin is a conversation about your
                needs.
              </p>
              <p>
                DERBY MANUAL & AUTO brings the academy’s services together in a
                clearer, more accessible website. You can explore your options
                and request a lesson without an account or online payment.
              </p>
              <Link className="button navy" href="/book-lesson/">
                Start your journey <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="info-card">
              <h3>A conversation with the team</h3>
              <p>
                Ask about the instructors currently teaching in your area, their
                lesson approach and transmission options. We’ll discuss who is
                available before you commit.
              </p>
              <Link className="text-link" href="/contact-us/">
                Ask about instructors ↗
              </Link>
              <p className="fine">
                Individual instructor profiles will be added when approved
                details and photography are provided.
              </p>
            </div>
          </section>
          <section className="section soft">
            <div className="container">
              <CourseCards />
            </div>
          </section>
        </>
      )}
      {key === "offers" && (
        <section className="section container">
          <Packages />
          <div className="info-card offer-note">
            <h3>Looking for an introductory offer?</h3>
            <p>
              Offers on the original website may have changed. Contact the team
              to confirm eligibility, lesson allocation, expiry and all
              conditions before making a booking.
            </p>
            <Link className="text-link" href="/contact-us/">
              Ask about current offers ↗
            </Link>
          </div>
        </section>
      )}
      {key === "reviews" && (
        <section className="section container">
          <ReviewPanel />
          <div className="reading">
            <h2>Read the original feedback.</h2>
            <p>
              To preserve the context of students’ comments, you can read the
              published reviews on the existing academy website. Testimonials
              are not a guarantee of a particular result.
            </p>
            <a
              className="button navy"
              href="https://a1drivingacademy.co.uk/reviews/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the original reviews <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      )}
      {key === "areas-we-cover" && (
        <section className="section container">
          <Areas />
          <div className="reading">
            <h2>Not sure about your postcode?</h2>
            <p>
              The original academy website lists Derby, Nottingham, Leicester
              and Burton-upon-Trent. Availability varies by postcode, instructor
              and transmission. Include your preferred area in an enquiry so the
              team can check.
            </p>
            <Link className="button navy" href="/book-lesson/">
              Check lesson availability <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      )}
      {key === "blog" && (
        <section className="section container">
          <Journal />
        </section>
      )}
      {["privacy-policy", "terms-and-conditions", "cookie-policy"].includes(
        key,
      ) && <Legal kind={key} />}
      {![
        "privacy-policy",
        "terms-and-conditions",
        "cookie-policy",
        "book-lesson",
      ].includes(key) && <CTA />}
    </>
  );
}
function Legal({ kind }: { kind: string }) {
  const privacy = kind === "privacy-policy";
  const cookies = kind === "cookie-policy";
  const sections = privacy
    ? [
        [
          "Who handles your enquiry",
          `${business.legalName}, presented here as ${business.name}, receives enquiries. Contact ${business.email} or write to ${business.address} with questions about your information.`,
        ],
        [
          "Information you provide",
          "Forms collect your name, email, telephone number, preferred area and message. Booking requests also collect course preferences, lesson duration, date and time. Instructor forms may collect teaching experience. Please do not include sensitive information or another person’s details.",
        ],
        [
          "Why we use it",
          "The academy uses your information to respond to your enquiry and discuss lessons or instructor services. The intended lawful basis is taking steps at your request before a contract, or legitimate interests in responding to general enquiries. A privacy acknowledgement is not consent to marketing.",
        ],
        [
          "Service providers",
          "The deployment is intended to use Vercel for hosting, Resend for transactional email and Cloudflare Turnstile for spam protection. These providers may process technical information, including IP addresses, and may handle data internationally under their applicable safeguards. No booking database or advertising analytics is included.",
        ],
        [
          "Retention and your choices",
          "Enquiries are held in the academy’s email system only as long as needed for responding, service administration and applicable obligations. The owner must confirm the retention schedule before launch. You may request access, correction, deletion, restriction or a copy of your information where applicable, or object to relevant processing by emailing the academy.",
        ],
        [
          "Questions or complaints",
          "Contact the academy first if you have a concern. You can also contact the UK Information Commissioner’s Office at ico.org.uk.",
        ],
      ]
    : cookies
      ? [
          [
            "Analytics and advertising",
            "This application does not install analytics or advertising cookies. It does not load embedded maps, videos or social tracking widgets. External links open the relevant provider only when you follow them.",
          ],
          [
            "Security checks",
            "Enquiry forms use Cloudflare Turnstile when configured. It processes technical browser and network information to help prevent automated abuse. The application does not enable Turnstile pre-clearance cookies. Cloudflare controls the security service and its supporting processing.",
          ],
          [
            "External images and fonts",
            "Illustrative photographs are stored with this website and served through Next.js image optimisation. Manrope and Inter fonts are self-hosted. Third-party links have their own privacy and cookie policies.",
          ],
          [
            "Your browser settings",
            "You can manage cookies through your browser. If tracking or optional embedded services are added later, this policy and any required consent controls must be updated before they are enabled.",
          ],
        ]
      : [
          [
            "Enquiries and confirmation",
            "Submitting a form is an enquiry only. It does not reserve a slot, create a confirmed lesson, guarantee a test result or take a payment. The team must confirm availability and arrangements directly.",
          ],
          [
            "Prices and packages",
            "All prices, package contents, pick-up arrangements and offers must be confirmed directly before booking. Older offers on the original academy website should not be treated as a current quote.",
          ],
          [
            "Lesson arrangements",
            "The academy will provide applicable lesson terms, cancellation and rescheduling rules, payment arrangements and any eligibility requirements before you commit. No fixed cancellation period or refund rule is represented by this enquiry website.",
          ],
          [
            "Accurate information",
            "Please provide accurate contact details and do not send abusive, unlawful or third-party personal information. Dates and times supplied on the form are preferences only.",
          ],
          [
            "Instructor and referral enquiries",
            "Recruitment, training and referral enquiries do not guarantee work, pupil numbers, qualifications or income. Terms and availability are discussed separately.",
          ],
          [
            "Website information",
            "Business details reproduced from the previous website remain provisional until approved. General journal articles help you prepare questions and do not replace individual instruction or official guidance.",
          ],
        ];
  return (
    <article className="container legal reading">
      {!business.approved && (
        <div className="form-notice">
          Draft for business-owner review. Operational details must be confirmed
          before public launch.
        </div>
      )}
      {sections.map(([h, p]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{p}</p>
        </section>
      ))}
      <p>
        For questions, email{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
      {privacy && (
        <p>
          Provider information:{" "}
          <a href="https://vercel.com/legal/privacy-policy">Vercel</a>,{" "}
          <a href="https://resend.com/legal/privacy-policy">Resend</a>,{" "}
          <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>,{" "}
          <a href="https://ico.org.uk/">ICO</a>.
        </p>
      )}
    </article>
  );
}
