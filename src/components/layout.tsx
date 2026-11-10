"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X, Phone, MoveUpRight } from "lucide-react";
import { business } from "@/lib/config";
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Derby Manual and Auto home">
      <span className="brand-icon">
        d<span>↗</span>
      </span>
      <span>
        DERBY<span className="brand-small">MANUAL & AUTO</span>
      </span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const nav = [
    ["Home", "/"],
    ["Our lessons", "/program/manual-lesson/"],
    ["About us", "/about/"],
    ["Areas we cover", "/areas-we-cover/"],
    ["Reviews", "/reviews/"],
  ];
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>YOUR NEXT CHAPTER STARTS BEHIND THE WHEEL.</span>
          <a href={business.phoneHref}>
            <Phone size={12} />
            {business.phone}
          </a>
        </div>
      </div>
      <header className="header">
        <div className="container nav">
          <Brand />
          <nav
            className={open ? "navlinks is-open" : "navlinks"}
            aria-label="Main navigation"
          >
            {nav.map(([label, url]) => (
              <Link
                aria-current={path === url ? "page" : undefined}
                key={url}
                href={url}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              className="button gold nav-cta"
              href="/book-lesson/"
              onClick={() => setOpen(false)}
            >
              Book a lesson <ArrowUpRight size={17} />
            </Link>
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Brand />
          <p>
            Learn with confidence.
            <br />
            Drive with freedom.
          </p>
          <a href={business.phoneHref}>{business.phone}</a>
          <br />
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </div>
        <div>
          <h3>Find your route</h3>
          {[
            ["Manual lessons", "/program/manual-lesson/"],
            ["Automatic lessons", "/program/automatic-lesson/"],
            ["Intensive courses", "/program/crash-courses/"],
            ["Offers & packages", "/offers/"],
            ["Book a lesson", "/book-lesson/"],
          ].map(([t, u]) => (
            <Link key={u} href={u}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h3>The academy</h3>
          {[
            ["About us", "/about/"],
            ["Reviews", "/reviews/"],
            ["Learner journal", "/blog/"],
            ["Join our team", "/join-a1/"],
            ["Become an instructor", "/become-a-driving-instructor/"],
            ["Student referrals", "/student-referral-for-instructors/"],
          ].map(([t, u]) => (
            <Link key={u} href={u}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h3>Let’s talk</h3>
          <p>{business.address}</p>
          <p>{business.hours}</p>
          <Link href="/contact-us/">
            Contact the team <MoveUpRight size={14} />
          </Link>
          <Link href="/areas-we-cover/">Explore our areas</Link>
          {business.socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.name} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {business.name}. {business.legalName}.
        </span>
        <div>
          <Link href="/privacy-policy/">Privacy</Link>
          <Link href="/terms-and-conditions/">Terms</Link>
          <Link href="/cookie-policy/">Cookies</Link>
        </div>
      </div>
      {!business.approved && (
        <p className="provisional container">
          Business details are taken from the existing academy website and
          remain subject to owner confirmation.
        </p>
      )}
    </footer>
  );
}
