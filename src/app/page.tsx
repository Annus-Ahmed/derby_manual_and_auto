import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowDown,
  Check,
  Route,
  HeartHandshake,
  SlidersHorizontal,
} from "lucide-react";
import {
  CourseCards,
  CTA,
  FAQ,
  Areas,
  Journal,
  Packages,
  ReviewPanel,
} from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { photo } from "@/lib/config";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero">
        <Image
          className="hero-image"
          src={photo("photo-1449965408869-eaa3f722e40d", 2200)}
          alt="Driver holding the steering wheel in a car at dusk"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="eyebrow">
            <span className="gold-line" /> YOUR JOURNEY. A NEW DIRECTION.
          </p>
          <h1>
            Learn to drive
            <br />
            with <em>confidence.</em>
            <br />
            Drive with <span className="hero-brand">DERBY MANUAL & AUTO.</span>
          </h1>
          <p className="hero-description">
            From your very first lesson to the freedom of the open road.
            <br className="desktop" /> Find your confidence, one mile at a time.
          </p>
          <div className="hero-actions">
            <Link className="button gold" href="/book-lesson/">
              Book your lesson <ArrowUpRight size={19} />
            </Link>
            <a className="button glass" href="#lessons">
              Explore courses <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero-checks">
            <span>
              <Check />
              Manual & automatic
            </span>
            <span>
              <Check />
              Your pace. Your journey.
            </span>
            <span>
              <Check />
              Derby & the Midlands
            </span>
          </div>
        </div>
        <div className="hero-caption">
          <span>01 / THE ROAD TO INDEPENDENCE</span>
          <span>
            SCROLL TO DISCOVER <ArrowDown size={14} />
          </span>
        </div>
      </section>
      <div className="route-strip">
        <div className="container">
          <p>
            A NEW NAME.
            <br />
            <strong>THE NEXT CHAPTER.</strong>
          </p>
          <span className="strip-divider" />
          <p>
            Introducing DERBY MANUAL & AUTO
            <br />
            <span>The new identity for A1 Driving Academy Ltd.</span>
          </p>
          <Link href="/about/">
            Get to know us <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
      <section id="lessons" className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">ONE DESTINATION. YOUR WAY THERE.</p>
              <h2>Find your kind of driving.</h2>
            </div>
            <p>
              First time behind the wheel or ready for a fresh start?
              <br />
              There’s a route for you.
            </p>
          </div>
          <CourseCards />
        </Reveal>
      </section>
      <section className="why-section">
        <div className="container why-grid">
          <div>
            <p className="eyebrow">MORE THAN DRIVING LESSONS</p>
            <h2>
              Confidence for your test.
              <br />
              <em>Skills for your life.</em>
            </h2>
            <p>
              Learning to drive is a big step. We want the first conversation to
              feel simple. Share your goals, ask your questions and find a way
              forward that feels right.
            </p>
            <Link className="text-link" href="/about/">
              A little more about us <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="benefit-grid">
            {[
              [
                HeartHandshake,
                "A personal starting point",
                "Tell us what feels easy, what feels daunting and what you want to achieve.",
              ],
              [
                Route,
                "Local learning",
                "Ask about lessons around Derby and the surrounding Midlands areas.",
              ],
              [
                SlidersHorizontal,
                "A choice of routes",
                "Explore manual, automatic, intensive and refresher lesson enquiries.",
              ],
              [
                Check,
                "Clear next steps",
                "Discuss availability and prices with the team before confirming a lesson.",
              ],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof Check;
              return (
                <article key={String(title)}>
                  <I size={25} />
                  <h3>{String(title)}</h3>
                  <p>{String(copy)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section container about-grid">
        <div className="about-photo">
          <Image
            src={photo("photo-1500534623283-312aade485b7", 1000)}
            alt="Sunrise over layers of hills"
            fill
            sizes="(max-width:800px) 100vw, 50vw"
          />
          <div className="photo-note">
            A new skill.
            <br />
            <em>A world of possibility.</em>
          </div>
        </div>
        <div>
          <p className="eyebrow">REAL PEOPLE. REAL CONVERSATIONS.</p>
          <h2>
            Meet your next
            <br />
            step forward.
          </h2>
          <p>
            The right learning journey starts with understanding you. Tell the
            team about your experience, preferred transmission and where you
            would like to learn.
          </p>
          <p>
            We’ll discuss instructor availability and the details that matter
            before you commit. Looking to teach? There’s a conversation for you,
            too.
          </p>
          <div className="inline-links">
            <Link className="button navy" href="/contact-us/">
              Meet the team <ArrowUpRight size={17} />
            </Link>
            <Link className="text-link" href="/join-a1/">
              Join us ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MAKE ROOM FOR YOUR NEXT CHAPTER</p>
              <h2>Lessons that fit your life.</h2>
            </div>
            <Link href="/offers/" className="text-link">
              Explore packages <ArrowUpRight size={19} />
            </Link>
          </div>
          <Packages />
        </div>
      </section>
      <section className="section container testimonial-grid">
        <div>
          <p className="eyebrow">FROM THE LEARNER’S SEAT</p>
          <h2>
            A little encouragement
            <br />
            goes a long way.
          </h2>
          <p>Discover student feedback from A1 Driving Academy.</p>
          <Link className="text-link" href="/reviews/">
            Explore student experiences <ArrowUpRight size={18} />
          </Link>
        </div>
        <ReviewPanel />
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CLOSER THAN YOU THINK</p>
              <h2>Your local road to freedom.</h2>
            </div>
            <Link className="text-link" href="/areas-we-cover/">
              All our areas <ArrowUpRight size={19} />
            </Link>
          </div>
          <Areas />
          <p className="fine">
            Coverage listed on the existing academy website. Instructor
            availability is confirmed individually.
          </p>
        </div>
      </section>
      <FAQ />
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE KNOW-HOW FOR THE JOURNEY</p>
            <h2>The learner journal.</h2>
          </div>
          <Link className="text-link" href="/blog/">
            Explore the journal <ArrowUpRight size={19} />
          </Link>
        </div>
        <Journal />
      </section>
      <CTA />
    </>
  );
}
