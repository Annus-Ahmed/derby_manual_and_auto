import type { MetadataRoute } from "next";
import { business, siteUrl } from "@/lib/config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: business.approved ? "/" : undefined,
      disallow: business.approved ? "/api/" : "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
