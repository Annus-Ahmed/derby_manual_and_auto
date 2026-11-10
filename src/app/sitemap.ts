import type { MetadataRoute } from "next";
import { pages, articles } from "@/lib/content";
import { courses, siteUrl } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    ...Object.keys(pages).map((p) => `/${p}/`),
    ...courses.map((c) => `/program/${c.slug}/`),
    ...articles.map((a) => `/blog/${a.slug}/`),
  ].map((path) => ({
    url: new URL(path, siteUrl).href,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
