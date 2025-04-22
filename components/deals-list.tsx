import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import type { Deal } from "@/lib/types"
import { DealModal } from "@/components/deal-modal"

interface DealsListProps {
  deals: Deal[]
}

export function DealsList({ deals }: DealsListProps) {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No deals found</h3>
        <p className="mt-2 text-gray-500">Try adjusting your filters or check back later for new deals.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <Card 
            key={deal.id} 
            className="overflow-hidden flex flex-col h-full"
          >
            <div
              className="relative pt-[56.25%] bg-gray-100 cursor-pointer"
              onClick={() => setSelectedDeal(deal)}
            >
              <Image 
                src={deal.image || "/placeholder.svg"} 
                alt={deal.title} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                className="object-cover" 
              />
              {deal.discount > 20 && (
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{deal.discount}% OFF</Badge>
              )}
            </div>

            <CardContent className="pt-4 flex-grow">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {deal.brand}
                </Badge>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-green-600">${deal.current_price}</span>
                  {deal.original_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">${deal.original_price}</span>
                  )}
                </div>
              </div>

              <Link href={deal.affiliateLink} target="_blank" rel="noopener noreferrer">
                <h3 className="font-medium line-clamp-2 mb-2 hover:underline">{deal.title}</h3>
              </Link>

              <div className="flex flex-wrap gap-1 mb-3">
                {deal.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-0 pb-4 flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href={deal.affiliateLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Deal
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Use the DealModal component */}
      {selectedDeal && (
        <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}
    </>
  )
}


