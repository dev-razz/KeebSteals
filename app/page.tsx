import { Header } from "@/components/header"
import { getDeals, getUniqueBrands } from "./actions/product-actions"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { DealsProvider } from "@/lib/deals-context"
import { ClientDealsContainer } from "@/components/client-deals-container"

// Set a cache time of 5 minutes (in milliseconds)
const CACHE_TIME = 5 * 60 * 1000

type SearchParams = {
  brand?: string
  category?: string
  tags?: string | string[]
  search?: string
  minPrice?: string
  maxPrice?: string
  sort?: "price_asc" | "price_desc" | "discount" | "newest"
};

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // Fetch all deals without filtering (we'll filter on the client)
  const params = await searchParams
  const allDeals = await getDeals()

  // Also fetch the initially filtered deals for SSR
  const brand = params.brand as string | undefined
  const category = params.category as string | undefined
  const tags = params.tags
    ? Array.isArray(params.tags)
      ? params.tags
      : [params.tags]
    : undefined

  const search = params.search as string | undefined
  const minPrice = params.minPrice ? Number.parseFloat(params.minPrice as string) : undefined
  const maxPrice = params.maxPrice ? Number.parseFloat(params.maxPrice as string) : undefined
  const sortBy = params.sort as "price_asc" | "price_desc" | "discount" | "newest" | undefined

  const brands = await getUniqueBrands()
  const allTags = ["75%", "65%", "60%", "40%", "TKL", "100%", "Tenkeyless", "Wireless"]

  return (
    <DealsProvider initialDeals={allDeals}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-2">KeebDeals</h1>
            <p className="text-gray-600">Find the best deals on mechanical keyboards, updated daily.</p>

            {allDeals.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">
                  No deals found in the database.
                </p>
              </div>
            )}
          </section>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientDealsContainer brands={brands} tags={allTags} deals={allDeals} searchQuery={search}/>
          </Suspense>
        </main>

        <footer className="bg-white border-t py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} KeebDeals. All rights reserved.</p>
            <p className="mt-2">Affiliate disclosure: We may earn a commission when you purchase through our links.</p>
            <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-blue-700 font-medium">Use coupon code: <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200">TB9NV51TCTZ3</span> for an extra discount!</p>
            </div>
          </div>
        </footer>
      </div>
    </DealsProvider>
  )
}
