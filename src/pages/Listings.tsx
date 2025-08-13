import { useState, useEffect } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import type { Property, FilterState } from "@/pages/Index";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

// Transform backend property data to frontend format
const transformProperty = (backendProperty: any): Property => {
  console.log('Transforming property:', backendProperty);

  const transformed = {
    id: backendProperty.id,
    title: backendProperty.title || `${backendProperty.propertyType || 'ქონება'} ${backendProperty.city || ''}-ში`,
    price: parseInt(backendProperty.totalPrice) || 0,
    address: `${backendProperty.street || ''}, ${backendProperty.city || ''}`,
    bedrooms: parseInt(backendProperty.bedrooms || '1'),
    bathrooms: parseInt(backendProperty.bathrooms || '1'),
    area: parseInt(backendProperty.area) || 0,
    type: backendProperty.propertyType || 'უცნობი ტიპი',
    transactionType: backendProperty.dealType || 'იყიდება',
    image: backendProperty.photos && backendProperty.photos.length > 0
      ? backendProperty.photos[0]
      : "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=300&fit=crop",
    featured: false
  };

  console.log('Transformed to:', transformed);
  return transformed;
};

// Sample property data - keeping as fallback
const sampleProperties = [
  {
    id: 1,
    title: "ლუქსუსური ბინა ვაკეში",
    price: 250000,
    address: "ვაკე, თბილისი",
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    type: "ბინები",
    transactionType: "იყიდება",  // Add this line
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=300&fit=crop",
    featured: false
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
    transactionType: "იყიდება",
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
    transactionType: 'იყიდება',
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
    transactionType: 'იყიდება',
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
    transactionType: 'იყიდება',
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=500&h=300&fit=crop",
    featured: true
  }
];

const Listings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priceMin: "",
    priceMax: "",
    location: "",
    propertyType: "",
    transactionType: "",
    bedrooms: "",
    areaMin: "",
    areaMax: ""
  });
  const [searchInput, setSearchInput] = useState("");

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await propertyApi.getProperties({});
      const backendProperties = response?.properties || [];

      // Transform backend data to frontend format
      const transformedProperties = backendProperties.map(transformProperty);

      // Debug logging
      console.log('Backend properties:', backendProperties);
      console.log('Transformed properties:', transformedProperties);

      // Use real data if available, otherwise fallback to sample data
      // TEMPORARY: Always include some sample data to test if the issue is with the component
      const finalProperties = transformedProperties.length > 0
        ? [...transformedProperties, ...sampleProperties.slice(0, 2)]
        : sampleProperties.slice(0, 5);

      setProperties(finalProperties);
      setFilteredProperties(finalProperties);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      // Use fallback data on error
      setProperties(sampleProperties.slice(0, 5));
      setFilteredProperties(sampleProperties.slice(0, 5));

      toast({
        title: "შეცდომა",
        description: "განცხადებების ჩატვირთვისას მოხდა შეცდომა. გამოჩნდება ნიმუშის მონაცემები.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      const matchesType = !newFilters.propertyType || property.type === newFilters.propertyType;

      const matchesBedrooms = !newFilters.bedrooms || property.bedrooms === parseInt(newFilters.bedrooms);

      const matchesAreaMin = !newFilters.areaMin || property.area >= parseInt(newFilters.areaMin);
      const matchesAreaMax = !newFilters.areaMax || property.area <= parseInt(newFilters.areaMax);

      return matchesSearch && matchesPriceMin && matchesPriceMax && matchesLocation &&
        matchesType && matchesBedrooms && matchesAreaMin && matchesAreaMax;
    });

    setFilteredProperties(filtered);
  };

  const handleSearch = () => {
    handleFilterChange({ ...filters, search: searchInput });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32">

        {/* Page Header with Search */}
        <div className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">უძრავი ქონების განცხადებები</h1>
            <div className="flex gap-2 max-w-lg">
              <Input
                placeholder="ძებნა სათაურით ან მისამართით..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-white"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                ძებნა
              </Button>
            </div>
          </div>
        </div>

        {/* Top Ad Banner */}
        <div className="container mx-auto px-4 py-6">
          <AdBanner type="horizontal" />
        </div>

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
              <PropertyGrid properties={filteredProperties} isLoading={isLoading} />

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

export default Listings;
