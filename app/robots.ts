import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://keebdeals.vercel.app/"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/","/database"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}