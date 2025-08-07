import { useState, useEffect } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import type { Property, FilterState } from "@/pages/Index";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, SlidersHorizontal, MapPin, Home, TrendingUp, Filter } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



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
    areaMin: "",
    areaMax: ""
  });
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    applyFiltersAndSort(newFilters, sortBy);
  };

  const applyFiltersAndSort = (currentFilters: FilterState, currentSort: string) => {
    // Apply filters
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(currentFilters.search.toLowerCase());

      const matchesPriceMin = !currentFilters.priceMin || property.price >= parseInt(currentFilters.priceMin);
      const matchesPriceMax = !currentFilters.priceMax || property.price <= parseInt(currentFilters.priceMax);

      const matchesLocation = !currentFilters.location ||
        property.address.toLowerCase().includes(currentFilters.location.toLowerCase());

      const matchesType = !currentFilters.propertyType || property.type === currentFilters.propertyType;
      const matchesTransaction = !currentFilters.transactionType || property.transactionType === currentFilters.transactionType;
      const matchesBedrooms = !currentFilters.bedrooms || property.bedrooms === parseInt(currentFilters.bedrooms);

      const matchesAreaMin = !currentFilters.areaMin || property.area >= parseInt(currentFilters.areaMin);
      const matchesAreaMax = !currentFilters.areaMax || property.area <= parseInt(currentFilters.areaMax);

      return matchesSearch && matchesPriceMin && matchesPriceMax && matchesLocation &&
        matchesType && matchesTransaction && matchesBedrooms && matchesAreaMin && matchesAreaMax;
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

  const handleSearch = () => {
    handleFilterChange({ ...filters, search: searchInput });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
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

  console.log('Render - properties:', properties);
  console.log('Render - filteredProperties:', filteredProperties);
  console.log('Render - isLoading:', isLoading);
  console.log('Render - totalProperties:', totalProperties);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32">

        {/* Hero Section with Enhanced Search */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">უძრავი ქონების განცხადებები</h1>
              <p className="text-xl text-muted-foreground mb-8">
                იპოვეთ თქვენი იდეალური ქონება {totalProperties.toLocaleString()}+ განცხადებიდან
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="ძებნა სათაურით ან მისამართით..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-white h-12 text-lg"
                  />
                </div>
                <Button onClick={handleSearch} size="lg" className="h-12 px-8">
                  <Search className="h-5 w-5 mr-2" />
                  ძებნა
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{totalProperties}</div>
                  <div className="text-sm text-muted-foreground">სულ განცხადება</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{featuredProperties}</div>
                  <div className="text-sm text-muted-foreground">რჩეული განცხადება</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">₾{averagePrice.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">საშუალო ფასი</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{Object.keys(stats).length}</div>
                  <div className="text-sm text-muted-foreground">ქონების ტიპი</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                ნაჩვენებია {filteredProperties.length} განცხადება {totalProperties} საერთოდან
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Property Type Stats */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    ქონების ტიპები
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(stats).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm">{type}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Filter Panel */}
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

              {/* Sidebar Ad Banner */}
              <div className="mt-6">
                <AdBanner type="vertical" />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
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
                      areaMin: "",
                      areaMax: ""
                    });
                    setSearchInput("");
                    setFilteredProperties(properties);
                  }}>
                    ფილტრების გასუფთავება
                  </Button>
                </div>
              ) : (
                <>
                  {console.log('About to render PropertyGrid with:', filteredProperties)}
                  <PropertyGrid properties={filteredProperties} />

                  {/* Load More Button */}
                  {filteredProperties.length >= 12 && (
                    <div className="text-center mt-8">
                      <Button variant="outline" size="lg">
                        მეტის ნახვა
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Bottom Ad Banner */}
              {!isLoading && filteredProperties.length > 0 && (
                <div className="mt-8">
                  <AdBanner type="horizontal" />
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Properties;