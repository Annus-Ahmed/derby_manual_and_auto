import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { business, siteUrl } from "@/lib/config";
import "./globals.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Driving Lessons Derby | DERBY MANUAL & AUTO",
    template: "%s | DERBY MANUAL & AUTO",
  },
  description:
    "Explore manual, automatic and intensive driving lessons in Derby and the surrounding areas. Request a lesson with DERBY MANUAL & AUTO.",
  robots: business.approved
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: business.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {business.approved && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "DrivingSchool",
                name: business.name,
                legalName: business.legalName,
                url: siteUrl,
                telephone: business.phone,
                email: business.email,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "36 Joseph Street",
                  addressLocality: "Derby",
                  postalCode: "DE23 8QH",
                  addressCountry: "GB",
                },
                areaServed: business.areas,
                sameAs: business.socials.map((s) => s.url),
              }).replace(/</g, "\\u003c"),
            }}
          />
        )}
      </body>
    </html>
  );
}
