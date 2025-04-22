"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { DealsList } from "@/components/deals-list"
import { FilterBar } from "@/components/filter-bar"
import { useDeals } from "@/lib/deals-context"
import type { Deal } from "@/lib/types"

export function ClientDealsContainer({
  brands,
  tags,
  deals,
  searchQuery,
}: {
  brands: string[]
  tags: string[]
  deals: Deal[]
  searchQuery?: string
}) {
  const { allDeals } = useDeals()
  const searchParams = useSearchParams()
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(deals)

  // Memoize the search params string to prevent unnecessary re-renders
  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams])

  // Create a stable filter function
  const filterDeals = useCallback((deals: Deal[], params: string) => {
    const searchParams = new URLSearchParams(params)
    let filteredDeals = [...deals]

    // Filter by brand
    const brand = searchParams.get("brand")
    if (brand) {
      filteredDeals = filteredDeals.filter((deal) => deal.brand === brand)
    }

    // Filter by tags
    const tags = searchParams.getAll("tags")
    if (tags.length > 0) {
      filteredDeals = filteredDeals.filter((deal) => tags.some((tag) => {
        if (tag === "Wireless") {
          return deal.tags.includes("bluetooth") || deal.tags.includes("2.4GHz") || deal.tags.includes("wireless")
        }
        return deal.tags.includes(tag)
      }))
    }

    // Filter by price range
    const minPrice = searchParams.get("minPrice")
    if (minPrice) {
      const min = Number.parseFloat(minPrice)
      filteredDeals = filteredDeals.filter((deal) => deal.current_price >= min)
    }

    const maxPrice = searchParams.get("maxPrice")
    if (maxPrice) {
      const max = Number.parseFloat(maxPrice)
      filteredDeals = filteredDeals.filter((deal) => deal.current_price <= max)
    }

    // Filter by search query
    const search = searchParams.get("search")
    if (search) {
        const searchLower = search.toLowerCase()
        filteredDeals = filteredDeals.filter(
        (deal) =>
            deal.title.toLowerCase().includes(searchLower) ||
            deal.brand.toLowerCase().includes(searchLower) ||
            deal.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        )
    }

    // Sort deals
    const sort = searchParams.get("sort")
    if (sort) {
      switch (sort) {
        case "price_asc":
          filteredDeals.sort((a, b) => a.current_price - b.current_price)
          break
        case "price_desc":
          filteredDeals.sort((a, b) => b.current_price - a.current_price)
          break
        case "discount":
          filteredDeals.sort((a, b) => b.discount - a.discount)
          break
        case "newest":
          filteredDeals.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
          break
      }
    }

    return filteredDeals
  }, [])

  // Apply filters whenever search params or all deals change
  useEffect(() => {
    if (allDeals.length > 0) {
      setFilteredDeals(filterDeals(allDeals, searchParamsString))
    }
  }, [searchParamsString, allDeals, filterDeals])

  return (
    <>
      <FilterBar brands={brands} tags={tags} searchQuery={searchQuery}/>
      <DealsList deals={filteredDeals} />
    </>
  )
}
