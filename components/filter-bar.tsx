"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, SlidersHorizontal, X, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

interface FilterBarProps {
  brands: string[]
  tags: string[]
  searchQuery?: string
}

export function FilterBar({ brands, tags, searchQuery }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get filters from URL
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<string>("Best Deals")
  const [isInitialized, setIsInitialized] = useState(false)
  const [search, setSearch] = useState(searchQuery || "")

  // Memoize the function to update URL to prevent it from changing on every render
  const updateURL = useCallback(
    (params: URLSearchParams) => {
      router.push(`?${params.toString()}`)
    },
    [router],
  )

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (isInitialized) return

    const urlBrand = searchParams.get("brand")
    const urlTags = searchParams.getAll("tags")
    const urlSort = searchParams.get("sort")
    const urlSearch = searchParams.get("search")

    const filters: string[] = []
    if (urlBrand) filters.push(urlBrand)
    filters.push(...urlTags)

    // Add price range filters
    const minPrice = searchParams.get("minPrice")
    if (minPrice) filters.push(`min:${minPrice}`)

    const maxPrice = searchParams.get("maxPrice")
    if (maxPrice) filters.push(`max:${maxPrice}`)

    setActiveFilters(filters)
    if (urlSearch) setSearch(urlSearch)

    // Set sort option from URL
    if (urlSort) {
      switch (urlSort) {
        case "price_asc":
          setSortOption("Price: Low to High")
          break
        case "price_desc":
          setSortOption("Price: High to Low")
          break
        case "discount":
          setSortOption("Best Deals")
          break
        case "newest":
          setSortOption("Newest")
          break
      }
    }

    setIsInitialized(true)
  }, [searchParams, isInitialized])

  // Update URL with filters - memoized to prevent recreation on every render
  const updateFilters = useCallback(
    (newFilters: string[], newSort?: string, newSearch?: string) => {
      const params = new URLSearchParams()

      // Add brand filter (assuming the first brand in filters is the selected one)
      const brandFilter = newFilters.find((f) => brands.includes(f))
      if (brandFilter) {
        params.set("brand", brandFilter)
      }

      // Add tag filters
      const tagFilters = newFilters.filter((f) => tags.includes(f))
      tagFilters.forEach((tag) => {
        params.append("tags", tag)
      })

      // Add price range filters
      const minPriceFilter = newFilters.find((f) => f.startsWith("min:"))
      if (minPriceFilter) {
        params.set("minPrice", minPriceFilter.replace("min:", ""))
      }

      const maxPriceFilter = newFilters.find((f) => f.startsWith("max:"))
      if (maxPriceFilter) {
        params.set("maxPrice", maxPriceFilter.replace("max:", ""))
      }

      // Add search query
      if (newSearch !== undefined) {
        if (newSearch) {
          params.set("search", newSearch)
        }
      } else if (search) {
        params.set("search", search)
      }

      // Add sort option
      const sortToUse = newSort || sortOption
      if (sortToUse) {
        switch (sortToUse) {
          case "Price: Low to High":
            params.set("sort", "price_asc")
            break
          case "Price: High to Low":
            params.set("sort", "price_desc")
            break
          case "Best Deals":
            params.set("sort", "discount")
            break
          case "Newest":
            params.set("sort", "newest")
            break
        }
      }

      // Update URL
      updateURL(params)
    },
    [brands, sortOption, tags, updateURL, search],
  )

  const toggleFilter = useCallback(
    (filter: string) => {
      setActiveFilters((prevFilters) => {
        let newFilters: string[]

        if (prevFilters.includes(filter)) {
          newFilters = prevFilters.filter((f) => f !== filter)
        } else {
          // If it's a brand, replace any existing brand
          if (brands.includes(filter)) {
            newFilters = [...prevFilters.filter((f) => !brands.includes(f)), filter]
          } else {
            newFilters = [...prevFilters, filter]
          }
        }

        // Update URL after state is updated
        setTimeout(() => updateFilters(newFilters), 0)

        return newFilters
      })
    },
    [brands, updateFilters],
  )

  const clearFilters = useCallback(() => {
    setActiveFilters([])
    setSearch("")
    router.push("/")
  }, [router])

  const handleSortChange = useCallback(
    (option: string) => {
      setSortOption(option)
      updateFilters(activeFilters, option)
    },
    [activeFilters, updateFilters],
  )

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      updateFilters(activeFilters, undefined, search)
    },
    [activeFilters, search, updateFilters],
  )

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>Brand</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {brands.map((brand) => (
                <DropdownMenuItem key={brand} onClick={() => toggleFilter(brand)}>
                  {brand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>Type</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {tags.map((tag) => (
                <DropdownMenuItem key={tag} onClick={() => toggleFilter(tag)}>
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>Price</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  const newFilters = activeFilters
                    .filter((f) => !f.startsWith("min:") && !f.startsWith("max:"))
                    .concat(["max:50"])
                  setActiveFilters(newFilters)
                  updateFilters(newFilters)
                }}
              >
                Under $50
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const newFilters = activeFilters
                    .filter((f) => !f.startsWith("min:") && !f.startsWith("max:"))
                    .concat(["min:50", "max:100"])
                  setActiveFilters(newFilters)
                  updateFilters(newFilters)
                }}
              >
                $50-$100
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const newFilters = activeFilters
                    .filter((f) => !f.startsWith("min:") && !f.startsWith("max:"))
                    .concat(["min:100", "max:150"])
                  setActiveFilters(newFilters)
                  updateFilters(newFilters)
                }}
              >
                $100-$150
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const newFilters = activeFilters
                    .filter((f) => !f.startsWith("min:") && !f.startsWith("max:"))
                    .concat(["min:150"])
                  setActiveFilters(newFilters)
                  updateFilters(newFilters)
                }}
              >
                $150+
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search keyboards..."
              className="w-full md:w-40 lg:w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>Sort: {sortOption}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange("Best Deals")}>Best Deals</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("Price: Low to High")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("Price: High to Low")}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("Newest")}>Newest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(activeFilters.length > 0 || search) && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters
            .filter((filter) => !filter.startsWith("min:") && !filter.startsWith("max:"))
            .map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <button onClick={() => toggleFilter(filter)} className="ml-1 rounded-full hover:bg-gray-200 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

          {activeFilters.some((f) => f.startsWith("min:") || f.startsWith("max:")) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {activeFilters.find((f) => f.startsWith("min:"))
                ? `$${activeFilters.find((f) => f.startsWith("min:"))?.replace("min:", "")}`
                : "$0"}
              {" - "}
              {activeFilters.find((f) => f.startsWith("max:"))
                ? `$${activeFilters.find((f) => f.startsWith("max:"))?.replace("max:", "")}`
                : "∞"}
              <button
                onClick={() => {
                  const newFilters = activeFilters.filter((f) => !f.startsWith("min:") && !f.startsWith("max:"))
                  setActiveFilters(newFilters)
                  updateFilters(newFilters)
                }}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {search}
              <button
                onClick={() => {
                  setSearch("")
                  updateFilters(activeFilters, undefined, "")
                }}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button variant="link" size="sm" onClick={clearFilters} className="text-xs h-auto p-0">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
