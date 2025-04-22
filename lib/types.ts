export interface Product {
  id: number
  product_id: string
  title: string
  brand: string
  category: string
  product_link: string
  product_description: string[]
  tags: string[]
  current_price: number
  original_price: number | null
  images: string[]
  date_added: string
  is_active: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

// For the frontend display
export interface Deal extends Omit<Product, "product_description" | "product_link"> {
  description: string[]
  affiliateLink: string
  discount: number
  image: string
}
