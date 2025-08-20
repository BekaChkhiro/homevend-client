import { useState, useEffect, useRef } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { PropertySearchHero, PropertySearchHeroRef } from "@/components/PropertySearchHero";
import type { Property, FilterState } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, SlidersHorizontal, MapPin, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
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
  const searchHeroRef = useRef<PropertySearchHeroRef>(null);
  
  // Mapping function to convert database enum values to Georgian display values
  const mapDealTypeToGeorgian = (dealType: string): string => {
    const mapping: { [key: string]: string } = {
      'sale': 'იყიდება',
      'rent': 'ქირავდება',
      'mortgage': 'გირავდება',
      'lease': 'გაიცემა იჯარით',
      'daily': 'ქირავდება დღიურად',
      'rent-to-buy': 'ნასყიდობა გამოსყიდობის უფლებით'
    };
    return mapping[dealType] || dealType;
  };

  // Mapping function to convert database property types to Georgian display values
  const mapPropertyTypeToGeorgian = (propertyType: string): string => {
    const mapping: { [key: string]: string } = {
      'apartment': 'ბინები',
      'house': 'სახლები',
      'cottage': 'აგარაკები',
      'land': 'მიწის ნაკვეთები',
      'commercial': 'კომერციული ფართები',
      'office': 'საოფისე ფართები',
      'hotel': 'სასტუმროები'
    };
    return mapping[propertyType] || propertyType;
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priceMin: "",
    priceMax: "",
    location: "",
    city: "all",
    propertyType: [],
    transactionType: "all",
    bedrooms: [],
    bathrooms: [],
    areaMin: "",
    areaMax: "",
    // Extended fields
    rooms: [],
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

  // Helper functions for URL params
  const getFiltersFromURL = (): FilterState => {
    const searchParams = new URLSearchParams(location.search);
    
    return {
      search: searchParams.get('search') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      location: searchParams.get('location') || '',
      city: searchParams.get('city') || 'all',
      propertyType: (() => {
        const propertyTypeParam = searchParams.get('propertyType');
        if (!propertyTypeParam || propertyTypeParam === 'all') return [];
        return propertyTypeParam.includes(',') ? propertyTypeParam.split(',') : [propertyTypeParam];
      })(),
      transactionType: searchParams.get('transactionType') || 'all',
      dailyRentalSubcategory: searchParams.get('dailyRentalSubcategory') || 'all',
      bedrooms: (() => {
        const bedroomsParam = searchParams.get('bedrooms');
        if (!bedroomsParam || bedroomsParam === 'all') return [];
        return bedroomsParam.includes(',') ? bedroomsParam.split(',') : [bedroomsParam];
      })(),
      bathrooms: (() => {
        const bathroomsParam = searchParams.get('bathrooms');
        if (!bathroomsParam || bathroomsParam === 'all') return [];
        return bathroomsParam.includes(',') ? bathroomsParam.split(',') : [bathroomsParam];
      })(),
      areaMin: searchParams.get('areaMin') || '',
      areaMax: searchParams.get('areaMax') || '',
      // Extended fields
      rooms: (() => {
        const roomsParam = searchParams.get('rooms');
        if (!roomsParam || roomsParam === 'all') return [];
        return roomsParam.includes(',') ? roomsParam.split(',') : [roomsParam];
      })(),
      totalFloors: searchParams.get('totalFloors') || 'all',
      buildingStatus: searchParams.get('buildingStatus') || 'all',
      constructionYearMin: searchParams.get('constructionYearMin') || '',
      constructionYearMax: searchParams.get('constructionYearMax') || '',
      condition: searchParams.get('condition') || 'all',
      projectType: searchParams.get('projectType') || 'all',
      ceilingHeightMin: searchParams.get('ceilingHeightMin') || '',
      ceilingHeightMax: searchParams.get('ceilingHeightMax') || '',
      heating: searchParams.get('heating') || 'all',
      parking: searchParams.get('parking') || 'all',
      hotWater: searchParams.get('hotWater') || 'all',
      buildingMaterial: searchParams.get('buildingMaterial') || 'all',
      hasBalcony: searchParams.get('hasBalcony') === 'true',
      hasPool: searchParams.get('hasPool') === 'true',
      hasLivingRoom: searchParams.get('hasLivingRoom') === 'true',
      hasLoggia: searchParams.get('hasLoggia') === 'true',
      hasVeranda: searchParams.get('hasVeranda') === 'true',
      hasYard: searchParams.get('hasYard') === 'true',
      hasStorage: searchParams.get('hasStorage') === 'true',
      selectedFeatures: searchParams.get('selectedFeatures')?.split(',').filter(Boolean) || [],
      selectedAdvantages: searchParams.get('selectedAdvantages')?.split(',').filter(Boolean) || [],
      selectedFurnitureAppliances: searchParams.get('selectedFurnitureAppliances')?.split(',').filter(Boolean) || []
    };
  };

  const updateURLFromFilters = (newFilters: FilterState, newSortBy?: string, newPage?: number) => {
    console.log('🆕 updateURLFromFilters called with:', {
      filters: newFilters,
      sortBy: newSortBy,
      page: newPage
    });
    
    const searchParams = new URLSearchParams();
    
    // Only add non-empty/non-default values to URL
    if (newFilters.search) searchParams.set('search', newFilters.search);
    if (newFilters.priceMin) searchParams.set('priceMin', newFilters.priceMin);
    if (newFilters.priceMax) searchParams.set('priceMax', newFilters.priceMax);
    if (newFilters.location) searchParams.set('location', newFilters.location);
    if (newFilters.city && newFilters.city !== 'all') searchParams.set('city', newFilters.city);
    if (newFilters.propertyType) {
      if (Array.isArray(newFilters.propertyType) && newFilters.propertyType.length > 0) {
        searchParams.set('propertyType', newFilters.propertyType.join(','));
      } else if (typeof newFilters.propertyType === 'string' && newFilters.propertyType !== 'all') {
        searchParams.set('propertyType', newFilters.propertyType);
      }
    }
    if (newFilters.transactionType && newFilters.transactionType !== 'all') searchParams.set('transactionType', newFilters.transactionType);
    if (newFilters.dailyRentalSubcategory && newFilters.dailyRentalSubcategory !== 'all') searchParams.set('dailyRentalSubcategory', newFilters.dailyRentalSubcategory);
    if (newFilters.bedrooms) {
      if (Array.isArray(newFilters.bedrooms) && newFilters.bedrooms.length > 0) {
        searchParams.set('bedrooms', newFilters.bedrooms.join(','));
      } else if (typeof newFilters.bedrooms === 'string' && newFilters.bedrooms !== 'all') {
        searchParams.set('bedrooms', newFilters.bedrooms);
      }
    }
    if (newFilters.bathrooms) {
      if (Array.isArray(newFilters.bathrooms) && newFilters.bathrooms.length > 0) {
        searchParams.set('bathrooms', newFilters.bathrooms.join(','));
      } else if (typeof newFilters.bathrooms === 'string' && newFilters.bathrooms !== 'all') {
        searchParams.set('bathrooms', newFilters.bathrooms);
      }
    }
    if (newFilters.areaMin) searchParams.set('areaMin', newFilters.areaMin);
    if (newFilters.areaMax) searchParams.set('areaMax', newFilters.areaMax);
    
    // Extended fields
    if (newFilters.rooms) {
      if (Array.isArray(newFilters.rooms) && newFilters.rooms.length > 0) {
        searchParams.set('rooms', newFilters.rooms.join(','));
      } else if (typeof newFilters.rooms === 'string' && newFilters.rooms !== 'all') {
        searchParams.set('rooms', newFilters.rooms);
      }
    }
    if (newFilters.totalFloors && newFilters.totalFloors !== 'all') searchParams.set('totalFloors', newFilters.totalFloors);
    if (newFilters.buildingStatus && newFilters.buildingStatus !== 'all') searchParams.set('buildingStatus', newFilters.buildingStatus);
    if (newFilters.constructionYearMin) searchParams.set('constructionYearMin', newFilters.constructionYearMin);
    if (newFilters.constructionYearMax) searchParams.set('constructionYearMax', newFilters.constructionYearMax);
    if (newFilters.condition && newFilters.condition !== 'all') searchParams.set('condition', newFilters.condition);
    if (newFilters.projectType && newFilters.projectType !== 'all') searchParams.set('projectType', newFilters.projectType);
    if (newFilters.ceilingHeightMin) searchParams.set('ceilingHeightMin', newFilters.ceilingHeightMin);
    if (newFilters.ceilingHeightMax) searchParams.set('ceilingHeightMax', newFilters.ceilingHeightMax);
    if (newFilters.heating && newFilters.heating !== 'all') searchParams.set('heating', newFilters.heating);
    if (newFilters.parking && newFilters.parking !== 'all') searchParams.set('parking', newFilters.parking);
    if (newFilters.hotWater && newFilters.hotWater !== 'all') searchParams.set('hotWater', newFilters.hotWater);
    if (newFilters.buildingMaterial && newFilters.buildingMaterial !== 'all') searchParams.set('buildingMaterial', newFilters.buildingMaterial);
    if (newFilters.hasBalcony) searchParams.set('hasBalcony', 'true');
    if (newFilters.hasPool) searchParams.set('hasPool', 'true');
    if (newFilters.hasLivingRoom) searchParams.set('hasLivingRoom', 'true');
    if (newFilters.hasLoggia) searchParams.set('hasLoggia', 'true');
    if (newFilters.hasVeranda) searchParams.set('hasVeranda', 'true');
    if (newFilters.hasYard) searchParams.set('hasYard', 'true');
    if (newFilters.hasStorage) searchParams.set('hasStorage', 'true');
    if (newFilters.selectedFeatures?.length) searchParams.set('selectedFeatures', newFilters.selectedFeatures.join(','));
    if (newFilters.selectedAdvantages?.length) searchParams.set('selectedAdvantages', newFilters.selectedAdvantages.join(','));
    if (newFilters.selectedFurnitureAppliances?.length) searchParams.set('selectedFurnitureAppliances', newFilters.selectedFurnitureAppliances.join(','));
    
    // Add sort and page if provided
    if (newSortBy && newSortBy !== 'newest') searchParams.set('sort', newSortBy);
    if (newPage && newPage > 1) searchParams.set('page', newPage.toString());
    
    const newSearch = searchParams.toString();
    const newURL = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    console.log('🆕 Navigating to:', newURL);
    console.log('🆕 Search params:', newSearch);
    navigate(newURL, { replace: true });
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    const urlSort = new URLSearchParams(location.search).get('sort') || 'newest';
    const urlPage = parseInt(new URLSearchParams(location.search).get('page') || '1');
    
    setFilters(urlFilters);
    setSortBy(urlSort);
    setCurrentPage(urlPage);
  }, [location.search]);

  // Fetch properties with filters from API - removed client-side filtering
  useEffect(() => {
    fetchProperties();
  }, [filters, sortBy, currentPage]); // Re-fetch when filters, sort, or page changes

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching properties from API with filters:', filters, 'sort:', sortBy, 'page:', currentPage);
      
      // Convert frontend filters to API parameters
      const apiParams = {
        page: currentPage,
        limit: PROPERTIES_PER_PAGE,
        search: filters.search || undefined,
        location: filters.location || undefined,
        city: filters.city !== 'all' ? filters.city : undefined,
        propertyType: Array.isArray(filters.propertyType) && filters.propertyType.length > 0 
          ? filters.propertyType.map(type => type === 'ბინები' ? 'apartment' : type === 'სახლები' ? 'house' : type === 'აგარაკები' ? 'cottage' : type === 'მიწის ნაკვეთები' ? 'land' : type === 'კომერციული ფართები' ? 'commercial' : type === 'საოფისე ფართები' ? 'office' : type === 'სასტუმროები' ? 'hotel' : type)
          : undefined,
        dealType: filters.transactionType !== 'all' 
          ? (filters.transactionType === 'იყიდება' ? 'sale' : filters.transactionType === 'ქირავდება' ? 'rent' : filters.transactionType === 'გირავდება' ? 'mortgage' : filters.transactionType === 'გაიცემა იჯარით' ? 'lease' : filters.transactionType === 'ქირავდება დღიურად' ? 'daily' : filters.transactionType === 'ნასყიდობა გამოსყიდობის უფლებით' ? 'rent-to-buy' : filters.transactionType)
          : undefined,
        dailyRentalSubcategory: filters.dailyRentalSubcategory !== 'all' ? filters.dailyRentalSubcategory : undefined,
        minPrice: filters.priceMin ? Number(filters.priceMin) : undefined,
        maxPrice: filters.priceMax ? Number(filters.priceMax) : undefined,
        minArea: filters.areaMin ? Number(filters.areaMin) : undefined,
        maxArea: filters.areaMax ? Number(filters.areaMax) : undefined,
        bedrooms: Array.isArray(filters.bedrooms) && filters.bedrooms.length > 0 ? filters.bedrooms : undefined,
        bathrooms: Array.isArray(filters.bathrooms) && filters.bathrooms.length > 0 ? filters.bathrooms : undefined,
        rooms: Array.isArray(filters.rooms) && filters.rooms.length > 0 ? filters.rooms : undefined,
        totalFloors: filters.totalFloors !== 'all' ? filters.totalFloors : undefined,
        buildingStatus: filters.buildingStatus !== 'all' ? filters.buildingStatus : undefined,
        constructionYearMin: filters.constructionYearMin || undefined,
        constructionYearMax: filters.constructionYearMax || undefined,
        condition: filters.condition !== 'all' ? filters.condition : undefined,
        projectType: filters.projectType !== 'all' ? filters.projectType : undefined,
        ceilingHeightMin: filters.ceilingHeightMin ? Number(filters.ceilingHeightMin) : undefined,
        ceilingHeightMax: filters.ceilingHeightMax ? Number(filters.ceilingHeightMax) : undefined,
        heating: filters.heating !== 'all' ? filters.heating : undefined,
        parking: filters.parking !== 'all' ? filters.parking : undefined,
        hotWater: filters.hotWater !== 'all' ? filters.hotWater : undefined,
        buildingMaterial: filters.buildingMaterial !== 'all' ? filters.buildingMaterial : undefined,
        hasBalcony: filters.hasBalcony || undefined,
        hasPool: filters.hasPool || undefined,
        hasLivingRoom: filters.hasLivingRoom || undefined,
        hasLoggia: filters.hasLoggia || undefined,
        hasVeranda: filters.hasVeranda || undefined,
        hasYard: filters.hasYard || undefined,
        hasStorage: filters.hasStorage || undefined,
        features: filters.selectedFeatures && filters.selectedFeatures.length > 0 ? filters.selectedFeatures : undefined,
        advantages: filters.selectedAdvantages && filters.selectedAdvantages.length > 0 ? filters.selectedAdvantages : undefined,
        furnitureAppliances: filters.selectedFurnitureAppliances && filters.selectedFurnitureAppliances.length > 0 ? filters.selectedFurnitureAppliances : undefined,
        sort: sortBy
      };

      // Remove undefined values
      Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === undefined) {
          delete apiParams[key];
        }
      });

      const response = await propertyApi.getProperties(apiParams);
      console.log('🎯 API Response:', response);
      
      // Server returns: { properties: [...], pagination: { page, limit, total, pages } }
      const data = response?.properties || [];
      const pagination = response?.pagination || {};
      
      if (!Array.isArray(data)) {
        console.warn('Expected array but got:', typeof data, data);
        setProperties([]);
        setFilteredProperties([]);
        return;
      }
      
      console.log(`✅ Found ${data.length} properties (page ${pagination.page} of ${pagination.pages})`);
      console.log('🔍 Sample property data:', data[0]);
      
      // Transform API data to match frontend interface
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
          type: mapPropertyTypeToGeorgian(prop.propertyType) || 'ბინები',
          transactionType: mapDealTypeToGeorgian(prop.dealType) || 'იყიდება',
          dailyRentalSubcategory: prop.dailyRentalSubcategory,
          image: prop.photos?.[0] || "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=300&fit=crop",
          featured: prop.isFeatured || prop.viewCount > 10,
          
          // Extended properties from database
          rooms: prop.rooms,
          totalFloors: prop.totalFloors,
          propertyFloor: prop.propertyFloor,
          buildingStatus: prop.buildingStatus,
          constructionYear: prop.constructionYear,
          condition: prop.condition,
          projectType: prop.projectType,
          ceilingHeight: prop.ceilingHeight,
          
          // Infrastructure
          heating: prop.heating,
          parking: prop.parking,
          hotWater: prop.hotWater,
          buildingMaterial: prop.buildingMaterial,
          
          // Boolean amenities
          hasBalcony: prop.hasBalcony || false,
          balconyCount: prop.balconyCount,
          balconyArea: prop.balconyArea,
          hasPool: prop.hasPool || false,
          poolType: prop.poolType,
          hasLivingRoom: prop.hasLivingRoom || false,
          livingRoomArea: prop.livingRoomArea,
          livingRoomType: prop.livingRoomType,
          hasLoggia: prop.hasLoggia || false,
          loggiaArea: prop.loggiaArea,
          hasVeranda: prop.hasVeranda || false,
          verandaArea: prop.verandaArea,
          hasYard: prop.hasYard || false,
          yardArea: prop.yardArea,
          hasStorage: prop.hasStorage || false,
          storageArea: prop.storageArea,
          storageType: prop.storageType,
          
          // Relations (empty from server for performance)
          features: prop.features || [],
          advantages: prop.advantages || [],
          furnitureAppliances: prop.furnitureAppliances || [],
          tags: prop.tags || [],
          
          // Additional fields
          photos: prop.photos || [],
          contactName: prop.contactName,
          contactPhone: prop.contactPhone,
          contactEmail: prop.contactEmail,
          descriptionGeorgian: prop.descriptionGeorgian,
          descriptionEnglish: prop.descriptionEnglish,
          descriptionRussian: prop.descriptionRussian,
          viewCount: prop.viewCount || 0,
          favoriteCount: prop.favoriteCount || 0,
          inquiryCount: prop.inquiryCount || 0,
          isFeatured: prop.isFeatured || false,
          featuredUntil: prop.featuredUntil ? new Date(prop.featuredUntil) : undefined,
          createdAt: prop.createdAt ? new Date(prop.createdAt) : undefined,
          updatedAt: prop.updatedAt ? new Date(prop.updatedAt) : undefined,
          publishedAt: prop.publishedAt ? new Date(prop.publishedAt) : undefined,
          expiresAt: prop.expiresAt ? new Date(prop.expiresAt) : undefined,
          
          // VIP status fields
          vipStatus: prop.vipStatus || 'none',
          vipExpiresAt: prop.vipExpiresAt
        };
      });
      
      
      // No need for separate properties and filteredProperties since filtering is server-side
      setProperties(transformedProperties);
      setFilteredProperties(transformedProperties);
    } catch (error: any) {
      console.error('❌ Error fetching properties:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Fallback to empty array on error
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
    console.log('🔄 Properties: handleFilterChange called with:', newFilters);
    setIsFiltering(true);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    updateURLFromFilters(newFilters, sortBy, 1);
    // No need for client-side filtering delay - server handles it
    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

  // Removed applyFiltersAndSort - now handled server-side for better performance

  const handleSortChange = (value: string) => {
    console.log('🔄 handleSortChange called with:', value);
    setIsFiltering(true);
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
    updateURLFromFilters(filters, value, 1);
    // Server handles sorting - just show loading state briefly
    setTimeout(() => {
      setIsFiltering(false);
    }, 200);
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
    console.log('🔄 handlePageChange called with page:', page);
    setCurrentPage(page);
    updateURLFromFilters(filters, sortBy, page);
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
        <PropertySearchHero 
          ref={searchHeroRef}
          totalProperties={totalProperties}
          filteredCount={filteredProperties.length}
          initialFilters={filters}
          isSearching={isFiltering}
          onRemoveFilter={(filterKey: string) => {
            const newFilters = { ...filters };
            
            // Handle different filter types
            switch (filterKey) {
              case 'search':
                newFilters.search = '';
                break;
              case 'location':
                newFilters.location = '';
                break;
              case 'city':
                newFilters.city = 'all';
                break;
              case 'transactionType':
                newFilters.transactionType = 'all';
                break;
              case 'propertyType':
                newFilters.propertyType = [];
                break;
              case 'priceMin':
                newFilters.priceMin = '';
                break;
              case 'priceMax':
                newFilters.priceMax = '';
                break;
              case 'areaMin':
                newFilters.areaMin = '';
                break;
              case 'areaMax':
                newFilters.areaMax = '';
                break;
              case 'bedrooms':
                newFilters.bedrooms = [];
                break;
              case 'bathrooms':
                newFilters.bathrooms = [];
                break;
              case 'rooms':
                newFilters.rooms = [];
                break;
              case 'condition':
                newFilters.condition = 'all';
                break;
              case 'buildingStatus':
                newFilters.buildingStatus = 'all';
                break;
              case 'heating':
                newFilters.heating = 'all';
                break;
              case 'hasBalcony':
                newFilters.hasBalcony = false;
                break;
              case 'hasPool':
                newFilters.hasPool = false;
                break;
              case 'hasYard':
                newFilters.hasYard = false;
                break;
              case 'hasStorage':
                newFilters.hasStorage = false;
                break;
              case 'selectedFeatures':
                newFilters.selectedFeatures = [];
                break;
              case 'selectedAdvantages':
                newFilters.selectedAdvantages = [];
                break;
              case 'selectedFurnitureAppliances':
                newFilters.selectedFurnitureAppliances = [];
                break;
              default:
                // Handle individual property type removal
                if (filterKey.startsWith('propertyType-')) {
                  const index = parseInt(filterKey.replace('propertyType-', ''));
                  if (Array.isArray(newFilters.propertyType)) {
                    newFilters.propertyType = newFilters.propertyType.filter((_, i) => i !== index);
                  }
                }
                // Handle individual rooms removal
                else if (filterKey.startsWith('rooms-')) {
                  const index = parseInt(filterKey.replace('rooms-', ''));
                  if (Array.isArray(newFilters.rooms)) {
                    newFilters.rooms = newFilters.rooms.filter((_, i) => i !== index);
                  }
                }
                // Handle individual bedrooms removal
                else if (filterKey.startsWith('bedrooms-')) {
                  const index = parseInt(filterKey.replace('bedrooms-', ''));
                  if (Array.isArray(newFilters.bedrooms)) {
                    newFilters.bedrooms = newFilters.bedrooms.filter((_, i) => i !== index);
                  }
                }
                // Handle individual bathrooms removal
                else if (filterKey.startsWith('bathrooms-')) {
                  const index = parseInt(filterKey.replace('bathrooms-', ''));
                  if (Array.isArray(newFilters.bathrooms)) {
                    newFilters.bathrooms = newFilters.bathrooms.filter((_, i) => i !== index);
                  }
                }
                break;
            }
            
            handleFilterChange(newFilters);
          }}
          onClearAllFilters={() => {
            // Call PropertySearchHero's clear function to reset city/district selections
            if (searchHeroRef.current) {
              searchHeroRef.current.clearAllFilters();
            }
          }}
          onSearch={(searchFilters) => handleFilterChange({
            ...filters,
            search: searchFilters.search,
            city: searchFilters.city,
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
          })} 
        />

        {/* Top Ad Banner */}
        <div className="container mx-auto px-4 py-6">
          <AdBanner type="horizontal" />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Loading skeleton header */}
          {isLoading ? (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-80 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          ) : (
            /* Results Header with Sorting - only show when not loading */
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
          )}

          {/* Main Content */}
          <div>
              {isLoading ? (
                <div className="mb-8">
                  {/* Initial page load skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <PropertyCardSkeleton key={`initial-skeleton-${index}`} />
                    ))}
                  </div>
                  
                  {/* Second row of skeletons */}
                  <div className="mb-8">
                    <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <PropertyCardSkeleton key={`initial-skeleton-second-${index}`} />
                    ))}
                  </div>
                </div>
              ) : isFiltering ? (
                <div className="mb-8">
                  {/* Skeleton loading with actual results count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: Math.min(8, PROPERTIES_PER_PAGE) }).map((_, index) => (
                      <PropertyCardSkeleton key={`skeleton-${index}`} />
                    ))}
                  </div>
                  
                  {/* Show more skeletons if there were more properties */}
                  {filteredProperties.length > 8 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array.from({ length: Math.min(8, filteredProperties.length - 8) }).map((_, index) => (
                        <PropertyCardSkeleton key={`skeleton-more-${index}`} />
                      ))}
                    </div>
                  )}
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">განცხადებები ვერ მოიძებნა</h3>
                  <p className="text-muted-foreground mb-4">
                    სცადეთ ფილტრების შეცვლა ან ძიების პარამეტრების მოდიფიცირება
                  </p>
                  <Button onClick={() => {
                    const clearedFilters = {
                      search: "",
                      priceMin: "",
                      priceMax: "",
                      location: "",
                      city: "all",
                      propertyType: [],
                      transactionType: "all",
                      bedrooms: [],
                      bathrooms: [],
                      areaMin: "",
                      areaMax: "",
                      // Extended fields
                      rooms: [],
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
                    };
                    setFilters(clearedFilters);
                    setFilteredProperties(properties);
                    setCurrentPage(1);
                    setSortBy("newest");
                    // Clear URL as well
                    navigate(location.pathname, { replace: true });
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
