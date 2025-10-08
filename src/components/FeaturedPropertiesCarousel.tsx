
import { PropertyCard } from "@/components/PropertyCard";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Property } from "@/pages/Index";
import type { CarouselApi } from "@/components/ui/carousel";

interface FeaturedPropertiesCarouselProps {
  properties: Property[];
  isLoading?: boolean;
}

export const FeaturedPropertiesCarousel = ({ properties, isLoading = false }: FeaturedPropertiesCarouselProps) => {
  // Use all properties instead of filtering for featured only
  const displayProperties = properties;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>განცხადებების ჩატვირთვა...</span>
        </div>
      </div>
    );
  }

  if (displayProperties.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
          containScroll: "trimSnaps"
        }}
        className="w-full max-w-full overflow-hidden"
      >
        <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4 overflow-visible">
          {displayProperties.map((property, index) => (
            <CarouselItem key={property.id} className="pl-1 sm:pl-2 md:pl-4 basis-1/2 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 min-w-0 flex-shrink-0">
              <div className="w-full min-w-0 overflow-hidden">
                <PropertyCard property={property} isPriority={index === 0} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="flex -left-2 md:left-3 " />
        <CarouselNext className="flex -right-2 md:right-3" />
      </Carousel>
      
      {/* Dots Indicator */}
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === current - 1 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
