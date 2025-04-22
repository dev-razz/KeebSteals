import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://keyboarddeals.example.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/","/database"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}