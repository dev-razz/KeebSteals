import type { Deal } from "@/lib/types"

export function ProductJsonLd({ deal }: { deal: Deal }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.description,
    image: deal.image,
    brand: {
      "@type": "Brand",
      name: deal.brand,
    },
    offers: {
      "@type": "Offer",
      price: deal.current_price,
      priceCurrency: "USD",
      url: `/deal/${deal.product_id}`,
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      ...(deal.original_price && { price: deal.current_price, priceSpecification: { price: deal.original_price } }),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

export function WebsiteJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KeebSteals",
    url: "/",
    potentialAction: {
      "@type": "SearchAction",
      target: "/?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; item: string }[]
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
