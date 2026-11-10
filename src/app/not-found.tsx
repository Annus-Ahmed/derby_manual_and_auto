import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section container page-hero">
      <p className="eyebrow">A DIFFERENT TURN</p>
      <h1>This road ends here.</h1>
      <p>We couldn’t find that page. Let’s get you back on track.</p>
      <Link className="button gold" href="/">
        Back to home ↗
      </Link>
    </section>
  );
}
