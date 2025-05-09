import type { Metadata } from "next"

// Base metadata for the site
export const baseMetadata: Metadata = {
  title: {
    template: "Keebdeals",
    default: "Keebdeals - Find the Best Mechanical Keyboard Deals",
  },
  description:
    "Discover the best deals on mechanical keyboards, gaming keyboards, and accessories. Save money with our curated selection of keyboard deals updated daily.",
  keywords: [
    "keeb deals",
    "keyboard deals",
    "mechanical keyboard",
    "gaming keyboard",
    "keyboard sale",
    "discount keyboards",
    "cheap mechanical keyboards",
    "Aula f75",
    "Ajazz AK820 pro",
    "Epomaker",
    "Aula",
    "Ajazz",
    "Keychron",
    "Keyboard Coupon code",
    "Epomaker Discout Coupon",
    "mechanical keyboards on sale",
    "discounted mechanical keyboards",
    "genuine keyboard discounts",
    "price history sales"
  ],
  verification: {
    google: "pteXhD_sCRcQIizD12dTTZgLhu2flYqm0VfE0M8GXTo",
  },
  authors: [{ name: "Keebdeals Team" }],
  creator: "Keebdeals",
  publisher: "Keebdeals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://keebdeals.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Keebdeals",
    title: "Keebdeals - Find the Best Mechanical Keyboard Deals",
    description:
      "Discover the best deals on mechanical keyboards, gaming keyboards, and accessories. Save money with our curated selection of keyboard deals updated daily.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keebdeals - Find the Best Mechanical Keyboard Deals",
    description:
      "Discover the best deals on mechanical keyboards, gaming keyboards, and accessories. Save money with our curated selection of keyboard deals updated daily.",
    creator: "@Keebdeals",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Generate metadata for a specific deal
export function generateDealMetadata(deal: {
  title: string
  description: string
  brand: string
  current_price: number
  original_price?: number | null
  discount: number
  image: string
  product_id: string
}): Metadata {
  const title = `${deal.title} | ${deal.discount > 0 ? `${deal.discount}% Off` : "Deal"}`
  const description = `${deal.description.slice(0, 150)}... Get this ${deal.brand} keyboard at ${
    deal.discount > 0 ? `${deal.discount}% off` : "a great price"
  }. Original price: $${deal.original_price || deal.current_price}, now only $${deal.current_price}.`

  return {
    title,
    description,
    alternates: {
      canonical: `/deal/${deal.product_id}`,
    },
    openGraph: {
      title,
      description,
      url: `/deal/${deal.product_id}`,
    },
    twitter: {
      title,
      description,
      images: [deal.image],
    },
  }
}
