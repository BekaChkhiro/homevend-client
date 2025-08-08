import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { PropertySearchHero } from "@/components/PropertySearchHero";
import type { Property, FilterState } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, SlidersHorizontal, MapPin, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


const Properties = () => {
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
    bathrooms: "all",
    areaMin: "",
    areaMax: "",
    // Extended fields
    rooms: "all",
    totalFloors: "all",
    buildingStatus: "all",
    constructionYearMin: "",
    constructionYearMax: "",
    condition: "all",
    projectType: "all",
    ceilingHeightMin: "",
    ceilingHeightMax: "",
    heating: "all",
    parking: "all",
    hotWater: "all",
    buildingMaterial: "all",
    hasBalcony: false,
    hasPool: false,
    hasLivingRoom: false,
    hasLoggia: false,
    hasVeranda: false,
    hasYard: false,
    hasStorage: false,
    selectedFeatures: [],
    selectedAdvantages: [],
    selectedFurnitureAppliances: []
  });
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const PROPERTIES_PER_PAGE = 16;

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching properties from API...');
      
      // Get all properties (no status filter to show pending ones too for now) - same as Home page
      const response = await propertyApi.getProperties({ status: '' });
      console.log('API Response:', response); // Debug log
      
      // The api.ts already extracts .data, so response = {properties: [], pagination: {}}
      const data = response?.properties || response || [];
      
      if (!Array.isArray(data)) {
        console.warn('Expected array but got:', typeof data, data);
        setProperties([]);
        setFilteredProperties([]);
        return;
      }
      
      console.log('Properties found:', data.length);
      
      // Transform API data to match the Property interface - same as Home page
      const transformedProperties = data.map((prop: any) => ({
        id: parseInt(prop.id) || prop.id,
        title: prop.title || `${prop.propertyType} ${prop.city}`,
        price: parseInt(prop.totalPrice) || 0,
        address: `${prop.street}, ${prop.city}`,
        bedrooms: parseInt(prop.bedrooms) || 1,
        bathrooms: parseInt(prop.bathrooms) || 1,
        area: parseInt(prop.area) || 0,
        type: prop.propertyType || 'ბინა',
        transactionType: prop.dealType || 'იყიდება',
        image: prop.photos?.[0] || "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=300&fit=crop",
        featured: prop.viewCount > 10 || Math.random() > 0.7 // Featured if popular or randomly
      }));
      
      console.log('Transformed properties:', transformedProperties);
      console.log('Transformed properties count:', transformedProperties.length);
      
      setProperties(transformedProperties);
      setFilteredProperties(transformedProperties);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Fallback to empty array on error - same as Home page
      setProperties([]);
      setFilteredProperties([]);

      toast({
        title: "შეცდომა",
        description: "განცხადებების ჩატვირთვისას მოხდა შეცდომა.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    applyFiltersAndSort(newFilters, sortBy);
  };

  const applyFiltersAndSort = (currentFilters: FilterState, currentSort: string) => {
    // Apply filters
    let filtered = properties.filter(property => {
      const matchesSearch = !currentFilters.search || currentFilters.search === "" ||
        property.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(currentFilters.search.toLowerCase());

      const matchesPriceMin = !currentFilters.priceMin || property.price >= parseInt(currentFilters.priceMin);
      const matchesPriceMax = !currentFilters.priceMax || property.price <= parseInt(currentFilters.priceMax);

      const matchesLocation = !currentFilters.location ||
        property.address.toLowerCase().includes(currentFilters.location.toLowerCase());

      const matchesType = !currentFilters.propertyType || currentFilters.propertyType === "all" || property.type === currentFilters.propertyType;
      const matchesTransaction = !currentFilters.transactionType || currentFilters.transactionType === "all" || property.transactionType === currentFilters.transactionType;
      const matchesBedrooms = !currentFilters.bedrooms || currentFilters.bedrooms === "all" || property.bedrooms === parseInt(currentFilters.bedrooms);
      const matchesBathrooms = !currentFilters.bathrooms || currentFilters.bathrooms === "all" || property.bathrooms === parseInt(currentFilters.bathrooms);

      const matchesAreaMin = !currentFilters.areaMin || property.area >= parseInt(currentFilters.areaMin);
      const matchesAreaMax = !currentFilters.areaMax || property.area <= parseInt(currentFilters.areaMax);

      return matchesSearch && matchesPriceMin && matchesPriceMax && matchesLocation &&
        matchesType && matchesTransaction && matchesBedrooms && matchesBathrooms && matchesAreaMin && matchesAreaMax;
    });

    // Apply sorting
    switch (currentSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'area-large':
        filtered.sort((a, b) => b.area - a.area);
        break;
      case 'area-small':
        filtered.sort((a, b) => a.area - b.area);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProperties(filtered);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
    applyFiltersAndSort(filters, value);
  };

  const getPropertyTypeStats = () => {
    const stats = properties.reduce((acc, property) => {
      acc[property.type] = (acc[property.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const stats = getPropertyTypeStats();
  const totalProperties = properties.length;
  const featuredProperties = properties.filter(p => p.featured).length;
  const averagePrice = properties.length > 0 
    ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
    : 0;

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE);
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const endIndex = startIndex + PROPERTIES_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log('Render - properties:', properties);
  console.log('Render - filteredProperties:', filteredProperties);
  console.log('Render - isLoading:', isLoading);
  console.log('Render - totalProperties:', totalProperties);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32">

        {/* Property Search Section */}
        <PropertySearchHero onSearch={(searchFilters) => handleFilterChange({
          ...filters,
          search: searchFilters.search,
          transactionType: searchFilters.transactionType,
          propertyType: searchFilters.propertyType,
          priceMin: searchFilters.priceMin,
          priceMax: searchFilters.priceMax,
          location: searchFilters.location,
          bedrooms: searchFilters.bedrooms,
          bathrooms: searchFilters.bathrooms,
          areaMin: searchFilters.areaMin,
          areaMax: searchFilters.areaMax,
          // Extended filter fields
          rooms: searchFilters.rooms,
          totalFloors: searchFilters.totalFloors,
          buildingStatus: searchFilters.buildingStatus,
          constructionYearMin: searchFilters.constructionYearMin,
          constructionYearMax: searchFilters.constructionYearMax,
          condition: searchFilters.condition,
          projectType: searchFilters.projectType,
          ceilingHeightMin: searchFilters.ceilingHeightMin,
          ceilingHeightMax: searchFilters.ceilingHeightMax,
          heating: searchFilters.heating,
          parking: searchFilters.parking,
          hotWater: searchFilters.hotWater,
          buildingMaterial: searchFilters.buildingMaterial,
          hasBalcony: searchFilters.hasBalcony,
          hasPool: searchFilters.hasPool,
          hasLivingRoom: searchFilters.hasLivingRoom,
          hasLoggia: searchFilters.hasLoggia,
          hasVeranda: searchFilters.hasVeranda,
          hasYard: searchFilters.hasYard,
          hasStorage: searchFilters.hasStorage,
          selectedFeatures: searchFilters.selectedFeatures,
          selectedAdvantages: searchFilters.selectedAdvantages,
          selectedFurnitureAppliances: searchFilters.selectedFurnitureAppliances
        })} />

        {/* Top Ad Banner */}
        <div className="container mx-auto px-4 py-6">
          <AdBanner type="horizontal" />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Results Header with Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">განცხადებები</h2>
              <p className="text-muted-foreground">
                ნაჩვენებია {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} ({filteredProperties.length} საერთოდან {totalProperties} განცხადებიდან)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">ყველაზე ახალი</SelectItem>
                  <SelectItem value="price-low">ფასი: ზრდადობით</SelectItem>
                  <SelectItem value="price-high">ფასი: კლებადობით</SelectItem>
                  <SelectItem value="area-large">ფართობი: დიდიდან პატარამდე</SelectItem>
                  <SelectItem value="area-small">ფართობი: პატარიდან დიდამდე</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content */}
          <div>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>განცხადებები იტვირთება...</span>
                  </div>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">განცხადებები ვერ მოიძებნა</h3>
                  <p className="text-muted-foreground mb-4">
                    სცადეთ ფილტრების შეცვლა ან ძიების პარამეტრების მოდიფიცირება
                  </p>
                  <Button onClick={() => {
                    setFilters({
                      search: "",
                      priceMin: "",
                      priceMax: "",
                      location: "",
                      propertyType: "",
                      transactionType: "",
                      bedrooms: "",
                      bathrooms: "all",
                      areaMin: "",
                      areaMax: "",
                      // Extended fields
                      rooms: "all",
                      totalFloors: "all",
                      buildingStatus: "all",
                      constructionYearMin: "",
                      constructionYearMax: "",
                      condition: "all",
                      projectType: "all",
                      ceilingHeightMin: "",
                      ceilingHeightMax: "",
                      heating: "all",
                      parking: "all",
                      hotWater: "all",
                      buildingMaterial: "all",
                      hasBalcony: false,
                      hasPool: false,
                      hasLivingRoom: false,
                      hasLoggia: false,
                      hasVeranda: false,
                      hasYard: false,
                      hasStorage: false,
                      selectedFeatures: [],
                      selectedAdvantages: [],
                      selectedFurnitureAppliances: []
                    });
                    setFilteredProperties(properties);
                  }}>
                    ფილტრების გასუფთავება
                  </Button>
                </div>
              ) : (
                <>
                  {/* 4 Column Property Grid with Middle Ad */}
                  <div className="mb-8">
                    {/* First 8 properties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {paginatedProperties.slice(0, 8).map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>          
                              
                    {/* Middle Ad Banner - Show only if there are more than 8 properties */}
                    {paginatedProperties.length > 8 && (
                      <div className="mb-8">
                        <AdBanner type="horizontal" />
                      </div>
                    )}
                    
                    {/* Remaining properties */}
                    {paginatedProperties.length > 8 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedProperties.slice(8).map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {/* Page Numbers */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current page
                            if (
                              page === 1 || 
                              page === totalPages || 
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            } else if (
                              page === currentPage - 2 || 
                              page === currentPage + 2
                            ) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }
                            return null;
                          })}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}

            {/* Bottom Ad Banner */}
            {!isLoading && filteredProperties.length > 0 && (
              <div className="mt-8 max-w-4xl mx-auto">
                <AdBanner type="horizontal" />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Properties;