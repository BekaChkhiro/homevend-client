import { useState, useEffect } from "react";
import { Property } from "./components/PropertyData";
import { FilterState } from "./components/FilterTypes";
import { applyFilters } from "./components/FilterLogic";
import { HomeLayout } from "./components/HomeLayout";
import { propertyApi } from "@/lib/api";

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      // Get all properties (no status filter to show pending ones too for now)
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
      
      // Transform API data to match the Property interface
      const transformedProperties = data.map((prop: any) => {
        // Build address properly
        const parts = [];
        if (prop.street && prop.street.trim()) parts.push(prop.street);
        if (prop.areaData?.nameKa) {
          parts.push(prop.areaData.nameKa);
        } else if (prop.district && prop.district.trim()) {
          parts.push(prop.district);
        }
        if (prop.cityData?.nameGeorgian) {
          parts.push(prop.cityData.nameGeorgian);
        } else if (prop.city && prop.city.trim()) {
          parts.push(prop.city);
        }
        const address = parts.length > 0 ? parts.join(', ') : 'მდებარეობა არ არის მითითებული';
        
        return {
          id: parseInt(prop.id) || prop.id,
          title: prop.title || `${prop.propertyType} ${prop.city}`,
          price: parseInt(prop.totalPrice) || 0,
          address: address,
          city: prop.city,
          district: prop.district,
          cityData: prop.cityData,
          areaData: prop.areaData,
          bedrooms: parseInt(prop.bedrooms) || 1,
          bathrooms: parseInt(prop.bathrooms) || 1,
          area: parseInt(prop.area) || 0,
          type: prop.propertyType || 'ბინა',
          transactionType: prop.dealType || 'იყიდება',
          image: prop.photos?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
          featured: prop.viewCount > 10 || Math.random() > 0.7 // Featured if popular or randomly
        };
      });
      
      setProperties(transformedProperties);
      setFilteredProperties(transformedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Fallback to empty array on error
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    const filtered = applyFilters(properties, newFilters);
    setFilteredProperties(filtered);
  };

  return (
    <HomeLayout
      properties={properties}
      filteredProperties={filteredProperties}
      filters={filters}
      onFilterChange={handleFilterChange}
      isLoading={isLoading}
    />
  );
};

export default Home;