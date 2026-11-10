import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import { business, courses, faqs, photo } from "@/lib/config";
import { articles } from "@/lib/content";
export function CTA() {
  return (
    <section className="cta">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">THE ROAD AHEAD IS YOURS</p>
          <h2>
            A little courage.
            <br />A whole lot of freedom.
          </h2>
          <p>Let’s take that first step together.</p>
        </div>
        <Link className="button gold" href="/book-lesson/">
          Book your lesson <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export function CourseCards() {
  return (
    <div className="course-grid">
      {courses.map((c, i) => (
        <Link className="course-card" href={`/program/${c.slug}/`} key={c.slug}>
          <div className="course-image">
            <Image
              src={photo(c.image, 900)}
              alt={
                i === 0
                  ? "Driver holding a steering wheel at dusk"
                  : i === 1
                    ? "Dark car travelling along a road"
                    : "Snow-capped mountains above a forested valley"
              }
              fill
              sizes="(max-width: 700px) 100vw, 33vw"
            />
            <span className="number">0{i + 1}</span>
          </div>
          <div className="course-body">
            <p className="eyebrow">{c.tag}</p>
            <h3>
              {c.name}
              <ArrowUpRight size={25} />
            </h3>
            <p>{c.description}</p>
            <span className="text-link">
              Explore {c.name.toLowerCase()} <span>↗</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function FAQ() {
  return (
    <section className="section container faq-grid">
      <div>
        <p className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</p>
        <h2>
          A little clarity
          <br />
          before you start.
        </h2>
        <p>Still have something on your mind?</p>
        <Link className="text-link" href="/contact-us/">
          Talk to our team <ArrowUpRight size={18} />
        </Link>
      </div>
      <div>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function Areas() {
  return (
    <div className="area-grid">
      {business.areas.map((a, i) => (
        <Link key={a} href={`/book-lesson/?area=${encodeURIComponent(a)}`}>
          <span className="area-index">0{i + 1}</span>
          <MapPin size={19} />
          <h3>{a}</h3>
          <ArrowUpRight size={20} />
        </Link>
      ))}
    </div>
  );
}
export function Journal() {
  return (
    <div className="journal-grid">
      {articles.map((a) => (
        <Link key={a.slug} className="article-card" href={`/blog/${a.slug}/`}>
          <div className="article-image">
            <Image
              src={photo(a.image, 700)}
              alt="Scenic surroundings for a driving journey"
              fill
              sizes="(max-width:700px) 100vw, 33vw"
            />
          </div>
          <p className="eyebrow">
            {a.category} <span>1 MIN READ</span>
          </p>
          <h3>
            {a.title} <ArrowUpRight size={21} />
          </h3>
          <p>{a.intro}</p>
        </Link>
      ))}
    </div>
  );
}
export function Packages() {
  return (
    <>
      <div className="package-grid">
        {["Hourly lessons", "Block bookings", "Intensive courses"].map(
          (p, i) => (
            <article
              className={"package " + (i === 1 ? "featured" : "")}
              key={p}
            >
              <p className="eyebrow">0{i + 1} / YOUR WAY TO LEARN</p>
              <h3>{p}</h3>
              <p>
                {
                  [
                    "Build your confidence one lesson at a time.",
                    "Plan ahead with a series of lessons.",
                    "Make space for focused learning.",
                  ][i]
                }
              </p>
              <h4>{i === 2 ? "Tailored quote" : "Request current prices"}</h4>
              <ul>
                {[
                  "Discuss your experience",
                  "Choose manual or automatic",
                  "Confirm local availability",
                ].map((t) => (
                  <li key={t}>
                    <Check size={15} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/book-lesson/"
                className={"button " + (i === 1 ? "gold" : "outline")}
              >
                Enquire about lessons <ArrowUpRight size={17} />
              </Link>
            </article>
          ),
        )}
      </div>
      <p className="fine">
        Prices, package contents and conditions will be confirmed by the team
        before you book. No payment is taken on this website.
      </p>
    </>
  );
}
export function ReviewPanel() {
  return (
    <div className="review-panel">
      <span className="quote-mark">“</span>
      <p className="eyebrow">FROM THE A1 DRIVING ACADEMY WEBSITE</p>
      <blockquote>“He has been very supportive”</blockquote>
      <p>Sharmol Miah · excerpt from published student feedback</p>
      <a
        className="text-link"
        href="https://a1drivingacademy.co.uk/reviews/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read the original review <ArrowUpRight size={16} />
      </a>
      <p className="fine">
        Historical feedback under the academy’s previous name. No rating or
        current instructor availability is implied.
      </p>
    </div>
  );
}
