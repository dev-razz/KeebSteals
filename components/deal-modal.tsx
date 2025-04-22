import { Deal } from "@/lib/types";
import { X, ShoppingCart, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageSlider } from "@/components/image-slider";

interface DealModalProps {
  deal: Deal;
  onClose: () => void;
}

export function DealModal({ deal, onClose }: DealModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-300" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800">
          <Link 
            href={deal.affiliateLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors group flex items-center gap-1.5"
          >
            <h2 className="text-xl font-semibold line-clamp-1">{deal.title}</h2>
            <ExternalLink className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-5">
          <div className="md:col-span-4 h-[400px] md:h-[500px] lg:h-[600px] bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden">
            <ImageSlider deal={deal} expanded={true} />
          </div>
          
          <div className="md:col-span-3 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-5">
                <Badge variant="outline" className="px-3 py-1 text-sm font-medium">{deal.brand}</Badge>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-green-600 dark:text-green-500">${deal.current_price}</span>
                    {deal.original_price && (
                      <span className="text-lg text-gray-500 line-through ml-3">${deal.original_price}</span>
                    )}
                  </div>
                  {deal.discount > 0 && (
                    <span className="text-red-500 font-medium text-sm">({deal.discount}% off)</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-5">
                {deal.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2.5 py-0.5 font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-3">
              <Button className="w-full py-6 text-base flex items-center gap-2 transition-all hover:scale-[1.02]" size="lg" asChild>
                <Link href={deal.affiliateLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  View Deal
                </Link>
              </Button>
            </div>

              <div className="my-4">
                <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Key Features</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  {typeof deal.description === 'string' 
                    ? <li className="flex gap-2 items-start">
                        <div className="size-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <p>{deal.description}</p>
                      </li>
                    : deal.description.map((desc, index) => (
                        <li key={index} className="flex gap-2 items-start">
                          <div className="size-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                          <p>{desc}</p>
                        </li>
                      ))
                  }
                </ul>
              </div>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  );
}