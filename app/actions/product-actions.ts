"use server"

import { createSupabaseClient } from "@/database/supabase.js"
import type { Deal, Product } from "@/lib/types"

// Helper function to calculate discount percentage
function calculateDiscount(currentPrice: number, originalPrice: number | null): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

// Helper function to convert Product to Deal
function productToDeal(product: Product): Deal {
  return {
    id: product.id,
    product_id: product.product_id,
    title: product.title,
    brand: product.brand,
    category: product.category,
    description: product.product_description,
    affiliateLink: product.product_link+"?sca_ref=6573596.dggYxeW3Rw",
    current_price: product.current_price,
    original_price: product.original_price,
    discount: calculateDiscount(product.current_price, product.original_price),
    image: product.images && product.images.length > 0 ? JSON.parse(product.images[0]).imageUrl : "/placeholder.svg",
    images: product.images || [],
    tags: product.tags || [],
    date_added: product.date_added,
    is_active: product.is_active,
    featured: product.featured,
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}

export async function getDeals(): Promise<Deal[]> {
  const supabase = createSupabaseClient()

  let query = supabase.from("product").select("*").eq("is_active", true)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching deals:", error)
    return []
  }

  let deals = (data as Product[]).map(productToDeal)

  return deals
}

export async function getDealById(id: string): Promise<Deal | null> {
  const supabase = createSupabaseClient()

  // Try to find by id first
  let { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", Number.parseInt(id))
    .eq("is_active", true)
    .single()

  // If not found by id, try product_id
  if (error || !data) {
    const result = await supabase.from("product").select("*").eq("product_id", id).eq("is_active", true).single()

    if (result.error) {
      console.error("Error fetching deal by ID:", result.error)
      return null
    }

    data = result.data
  }

  if (!data) return null

  return productToDeal(data as Product)
}


export async function getUniqueBrands(): Promise<string[]> {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase.from("product").select("brand").eq("is_active", true).order("brand")

  if (error) {
    console.error("Error fetching brands:", error)
    return []
  }

  // Extract unique brands
  const brands = [...new Set(data.map((item) => item.brand))]
  return brands.filter(Boolean) as string[]
}
