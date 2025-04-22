import { Deal } from "@/lib/types";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image"
import { Badge } from "@/components/ui/badge";

interface ImageSliderProps {
  deal: Deal;
  expanded?: boolean;
}

export function ImageSlider({ deal, expanded = false }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Parse images from the deal
  let images = [];
  
  if (deal.images && deal.images.length > 0) {
    images = deal.images.map(img => {
      // First try to parse as JSON in case it's stored that way
      try {
        const parsed = JSON.parse(img);
        return parsed.imageUrl || parsed.url || parsed;
      } catch (e) {
        // If it's not JSON, use it directly as a URL string
        return img;
      }
    }).filter(Boolean);
  }
  
  // Fallback to main image or placeholder
  if (images.length === 0 && deal.image) {
    images.push(deal.image);
  }
  
  // Final fallback to placeholder
  if (images.length === 0) {
    images.push("/placeholder.svg");
  }
  
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const sliderClass = expanded 
    ? "relative w-full h-full aspect-square md:aspect-[4/3] bg-gray-100 dark:bg-gray-800" 
    : "relative pt-[56.25%] bg-gray-100 dark:bg-gray-800"; // 16:9 aspect ratio for card view

  return (
    <div className={sliderClass}>
      <Image 
        src={images[currentIndex]} 
        alt={deal.title} 
        fill 
        sizes={expanded ? "60vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        className="object-contain"
        priority={expanded}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
      
      {!expanded && deal.discount > 20 && (
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{deal.discount}% OFF</Badge>
      )}
      
      {images.length > 1 && (
        <>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeft size={expanded ? 20 : 16} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full"
            aria-label="Next image"
          >
            <ChevronRight size={expanded ? 20 : 16} />
          </button>
        </>
      )}
    </div>
  );
}