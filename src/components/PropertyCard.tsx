
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property } from "@/pages/Index";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  // Debug logging
  console.log('PropertyCard received property:', property);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get city name for badge
  const getCityName = () => {
    if (property.cityData) {
      return property.cityData.nameGeorgian;
    } else if (property.city) {
      return property.city;
    }
    return null;
  };

  // Build the location string with district and street (without city)
  // Order: District → Street → Street Number
  const getDistrictAndStreet = () => {
    const parts = [];
    
    // 1. Add district/area first
    if (property.areaData?.nameKa) {
      parts.push(property.areaData.nameKa);
    } else if (property.district) {
      parts.push(property.district);
    }
    
    // 2. Add street and street number from address
    if (property.address && property.address !== 'მდებარეობა არ არის მითითებული') {
      // Try to extract street part (first part before comma)
      const addressParts = property.address.split(', ');
      if (addressParts.length > 0) {
        const streetPart = addressParts[0];
        // Only add if it's not already district/area name
        if (!parts.some(part => streetPart.includes(part))) {
          // Split street part to separate street name and number
          const streetMatch = streetPart.match(/^(.+?)(\d+.*)$/);
          if (streetMatch) {
            // Street name and number found
            const streetName = streetMatch[1].trim();
            const streetNumber = streetMatch[2].trim();
            if (streetName) parts.push(streetName);
            if (streetNumber) parts.push(streetNumber);
          } else {
            // No number found, just add the street part
            parts.push(streetPart);
          }
        }
      }
    }
    
    return parts.length > 0 ? parts.join(', ') : 'მდებარეობა არ არის მითითებული';
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {property.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            ტოპ ქონება
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {getCityName() && (
          <Badge className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 backdrop-blur-sm">
            {getCityName()}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {property.title || 'სათაური არ არის მითითებული'}
          </h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {getDistrictAndStreet()}
          </div>
          {property.agentName && (
            <div className="text-xs text-muted-foreground mt-1">
              აგენტი: {property.agentName}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(property.price)}
          </div>
          <Badge variant="secondary">{property.type}</Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area} მ²</span>
          </div>
        </div>
        
        <Link to={`/property/${property.id}`}>
          <Button className="w-full" variant="outline">
            დეტალურად
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
