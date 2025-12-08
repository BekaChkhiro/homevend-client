
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FilterPanel } from "@/components/FilterPanel";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeaturedPropertiesCarousel } from "@/components/FeaturedPropertiesCarousel";
import { AdBanner } from "@/components/AdBanner";

// Sample property data with real images - now 6 featured properties
const sampleProperties = [
  {
    id: 1,
    title: "ლუქსუსური ბინა ვაკეში",
    price: 250000,
    address: "ვაკე, თბილისი",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: "ბინები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "კომფორტული სახლი საბურთალოში",
    price: 180000,
    address: "საბურთალო, თბილისი",
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    type: "სახლები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=500&h=300&fit=crop",
    featured: false
  },
  {
    id: 3,
    title: "ახალი ბინა ისანში",
    price: 95000,
    address: "ისანი, თბილისი",
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    type: "ბინები",
    transactionType: "ქირავდება",
    image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=500&h=300&fit=crop",
    featured: false
  },
  {
    id: 4,
    title: "სასტუმრო ოფისი ვერაში",
    price: 45000,
    address: "ვერა, თბილისი",
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    type: "კომერციული ფართები",
    transactionType: "გაიცემა იჯარით",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 5,
    title: "ვილა მთაწმინდაზე",
    price: 450000,
    address: "მთაწმინდა, თბილისი",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    type: "აგარაკები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 6,
    title: "თანამედროვე სტუდია ცენტრში",
    price: 65000,
    address: "ძველი თბილისი",
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    type: "ბინები",
    transactionType: "ქირავდება დღიურად",
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 7,
    title: "ბინა ნაძალადევში",
    price: 120000,
    address: "ნაძალადევი, თბილისი",
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    type: "ბინები",
    transactionType: "გირავდება",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 8,
    title: "პენტჰაუსი ვაკეში",
    price: 380000,
    address: "ვაკე, თბილისი",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    type: "ბინები",
    transactionType: "ქირავდება",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&h=300&fit=crop",
    featured: true
  }
];

export interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  city?: string;
  district?: string;
  cityData?: {
    id: number;
    code: string;
    nameGeorgian: string;
    nameEnglish: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  transactionType: string;
  dailyRentalSubcategory?: string;
  image: string;
  featured: boolean;
  agentName?: string;
  
  // Extended properties from database model
  rooms?: string;
  totalFloors?: string;
  propertyFloor?: string;
  buildingStatus?: string;
  constructionYear?: string | number;
  condition?: string;
  projectType?: string;
  ceilingHeight?: number;
  
  // Infrastructure
  heating?: string;
  parking?: string;
  hotWater?: string;
  buildingMaterial?: string;
  
  // Boolean amenities
  hasBalcony?: boolean;
  balconyCount?: number;
  balconyArea?: number;
  hasPool?: boolean;
  poolType?: string;
  hasLivingRoom?: boolean;
  livingRoomArea?: number;
  livingRoomType?: string;
  hasLoggia?: boolean;
  loggiaArea?: number;
  hasVeranda?: boolean;
  verandaArea?: number;
  hasYard?: boolean;
  yardArea?: number;
  hasStorage?: boolean;
  storageArea?: number;
  storageType?: string;
  
  // Many-to-many relationships
  features?: Array<{ id: number; name: string; nameKa: string; nameEn: string } | string>;
  advantages?: Array<{ id: number; name: string; nameKa: string; nameEn: string } | string>;
  furnitureAppliances?: Array<{ id: number; name: string; nameKa: string; nameEn: string } | string>;
  tags?: Array<{ id: number; name: string; nameKa: string; nameEn: string } | string>;
  
  // Additional fields
  photos?: string[];
  contactName?: string;
  contactPhone?: string;
  descriptionGeorgian?: string;
  descriptionEnglish?: string;
  descriptionRussian?: string;
  viewCount?: number;
  favoriteCount?: number;
  inquiryCount?: number;
  isFeatured?: boolean;
  featuredUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  expiresAt?: Date;
  
  // VIP status fields
  vipStatus?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipExpiresAt?: string;
  
  // Additional services
  colorSeparationEnabled?: boolean;
  colorSeparationExpiresAt?: string;

  // Price negotiable
  isPriceNegotiable?: boolean;
}

export interface FilterState {
  search: string;
  priceMin: string;
  priceMax: string;
  location: string;
  city?: string;
  areaId?: number;
  propertyType: string | string[];
  transactionType: string;
  dailyRentalSubcategory?: string;
  bedrooms: string | string[];
  bathrooms?: string | string[];
  areaMin: string;
  areaMax: string;
  // Extended fields for comprehensive filtering
  rooms?: string | string[];
  totalFloors?: string;
  buildingStatus?: string;
  constructionYearMin?: string;
  constructionYearMax?: string;
  condition?: string;
  projectType?: string;
  ceilingHeightMin?: string;
  ceilingHeightMax?: string;
  heating?: string;
  parking?: string;
  hotWater?: string;
  buildingMaterial?: string;
  hasBalcony?: boolean;
  hasPool?: boolean;
  hasLivingRoom?: boolean;
  hasLoggia?: boolean;
  hasVeranda?: boolean;
  hasYard?: boolean;
  hasStorage?: boolean;
  selectedFeatures?: string[];
  selectedAdvantages?: string[];
  selectedFurnitureAppliances?: string[];
}

const Index = () => {
  const [properties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priceMin: "",
    priceMax: "",
    location: "",
    propertyType: "all",
    transactionType: "all",
    bedrooms: "",
    areaMin: "",
    areaMax: ""
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Apply filters
    const filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                          property.address.toLowerCase().includes(newFilters.search.toLowerCase());
      
      const matchesPriceMin = !newFilters.priceMin || property.price >= parseInt(newFilters.priceMin);
      const matchesPriceMax = !newFilters.priceMax || property.price <= parseInt(newFilters.priceMax);
      
      const matchesLocation = !newFilters.location || 
                            property.address.toLowerCase().includes(newFilters.location.toLowerCase());
      
      const matchesType = !newFilters.propertyType || newFilters.propertyType === 'all' || property.type === newFilters.propertyType;
      
      const matchesTransactionType = !newFilters.transactionType || newFilters.transactionType === 'all' || property.transactionType === newFilters.transactionType;
      
      const matchesBedrooms = !newFilters.bedrooms || property.bedrooms === parseInt(newFilters.bedrooms);
      
      const matchesAreaMin = !newFilters.areaMin || property.area >= parseInt(newFilters.areaMin);
      const matchesAreaMax = !newFilters.areaMax || property.area <= parseInt(newFilters.areaMax);
      
      return matchesSearch && matchesPriceMin && matchesPriceMax && matchesLocation && 
             matchesType && matchesTransactionType && matchesBedrooms && matchesAreaMin && matchesAreaMax;
    });
    
    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32">
      <HeroSection onSearch={(heroFilters) => handleFilterChange({
        ...filters, 
        search: heroFilters.search,
        transactionType: heroFilters.transactionType,
        propertyType: heroFilters.propertyType
      })} />
      
      {/* Top Ad Banner */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner type="horizontal" />
      </div>
      
      <FeaturedPropertiesCarousel properties={properties} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            
            {/* Sidebar Ad Banner */}
            <div className="mt-6">
              <AdBanner type="vertical" />
            </div>
          </div>
          <div className="lg:col-span-3">
            <PropertyGrid properties={filteredProperties} />
            
            {/* Bottom Ad Banner */}
            <div className="mt-8">
              <AdBanner type="horizontal" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default Index;
