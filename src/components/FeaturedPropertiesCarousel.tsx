
import { PropertyCard } from "@/components/PropertyCard";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Property } from "@/pages/Index";

interface FeaturedPropertiesCarouselProps {
  properties: Property[];
  isLoading?: boolean;
}

export const FeaturedPropertiesCarousel = ({ properties, isLoading = false }: FeaturedPropertiesCarouselProps) => {
  // Use all properties instead of filtering for featured only
  const displayProperties = properties;

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
    <Carousel
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {displayProperties.map((property) => (
          <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <PropertyCard property={property} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
