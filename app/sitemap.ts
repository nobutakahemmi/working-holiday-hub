import type { MetadataRoute } from "next";
import { eligibilityRows, publicJobs, seoPath } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = "https://working-holiday-hub.vercel.app";
  const now = new Date("2026-10-09");
  const staticRoutes = ["", "/japan", "/jobs", "/employers", "/account"].map(
    (path) => ({
      url: `${origin}${path || "/"}`,
      lastModified: now,
    }),
  );
  const visaRoutes = eligibilityRows.map((row) => ({
    url: `${origin}${seoPath(row)}`,
    lastModified: new Date(row.last_verified),
  }));
  const jobRoutes = publicJobs().map((job) => ({
    url: `${origin}/jobs/${job.slug}`,
    lastModified: new Date(job.posted_at),
  }));
  return [...staticRoutes, ...visaRoutes, ...jobRoutes];
}
