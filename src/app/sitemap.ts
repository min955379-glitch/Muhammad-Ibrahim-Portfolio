import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");

  const sectionAnchors = [
    "live-sites",
    "projects",
    "mobile-apks",
    "services",
    "studio-3d",
    "skills",
    "arcade",
    "about",
    "contact",
  ];

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...sectionAnchors.map((anchor) => ({
      url: `${base}/#${anchor}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
