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
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priceMin: "",
    priceMax: "",
    location: "",
    propertyType: "all",
    transactionType: "all",
    bedrooms: "all",
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

  // Helper functions for URL params
  const getFiltersFromURL = (): FilterState => {
    const searchParams = new URLSearchParams(location.search);
    
    return {
      search: searchParams.get('search') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      location: searchParams.get('location') || '',
      propertyType: searchParams.get('propertyType') || 'all',
      transactionType: searchParams.get('transactionType') || 'all',
      dailyRentalSubcategory: searchParams.get('dailyRentalSubcategory') || 'all',
      bedrooms: searchParams.get('bedrooms') || 'all',
      bathrooms: searchParams.get('bathrooms') || 'all',
      areaMin: searchParams.get('areaMin') || '',
      areaMax: searchParams.get('areaMax') || '',
      // Extended fields
      rooms: searchParams.get('rooms') || 'all',
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
    const searchParams = new URLSearchParams();
    
    // Only add non-empty/non-default values to URL
    if (newFilters.search) searchParams.set('search', newFilters.search);
    if (newFilters.priceMin) searchParams.set('priceMin', newFilters.priceMin);
    if (newFilters.priceMax) searchParams.set('priceMax', newFilters.priceMax);
    if (newFilters.location) searchParams.set('location', newFilters.location);
    if (newFilters.propertyType && newFilters.propertyType !== 'all') searchParams.set('propertyType', newFilters.propertyType);
    if (newFilters.transactionType && newFilters.transactionType !== 'all') searchParams.set('transactionType', newFilters.transactionType);
    if (newFilters.dailyRentalSubcategory && newFilters.dailyRentalSubcategory !== 'all') searchParams.set('dailyRentalSubcategory', newFilters.dailyRentalSubcategory);
    if (newFilters.bedrooms && newFilters.bedrooms !== 'all') searchParams.set('bedrooms', newFilters.bedrooms);
    if (newFilters.bathrooms && newFilters.bathrooms !== 'all') searchParams.set('bathrooms', newFilters.bathrooms);
    if (newFilters.areaMin) searchParams.set('areaMin', newFilters.areaMin);
    if (newFilters.areaMax) searchParams.set('areaMax', newFilters.areaMax);
    
    // Extended fields
    if (newFilters.rooms && newFilters.rooms !== 'all') searchParams.set('rooms', newFilters.rooms);
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
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
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

  // Apply filters when properties are loaded or filters/sort change
  useEffect(() => {
    if (properties.length > 0) {
      applyFiltersAndSort(filters, sortBy);
    }
  }, [properties, filters, sortBy]);

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching properties from API...');
      
      // Get all properties - same as Home page
      const response = await propertyApi.getProperties({});
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
      console.log('🔍 Sample raw property data:', data[0]);
      
      // Transform API data to match the Property interface - same as Home page
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
          featured: prop.viewCount > 10 || Math.random() > 0.7, // Featured if popular or randomly
          
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
          
          // Many-to-many relationships
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
          expiresAt: prop.expiresAt ? new Date(prop.expiresAt) : undefined
        };
      });
      
      console.log('Transformed properties count:', transformedProperties.length);
      console.log('🔍 Sample transformed property:', transformedProperties[0]);
      console.log('🏷️ Transaction types in data:', transformedProperties.map(p => p.transactionType));
      
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
    updateURLFromFilters(newFilters, sortBy, 1);
  };

  const applyFiltersAndSort = (currentFilters: FilterState, currentSort: string) => {
    console.log('🔍 Applying filters:', currentFilters);
    console.log('📋 Properties to filter:', properties.length);
    
    // Apply filters
    let filtered = properties.filter(property => {
      // Basic search filters
      const matchesSearch = !currentFilters.search || currentFilters.search === "" ||
        property.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(currentFilters.search.toLowerCase());

      // Enhanced location matching for hierarchical search
      const matchesLocation = !currentFilters.location || currentFilters.location === "" || (() => {
        const locationQuery = currentFilters.location.toLowerCase();
        const locationParts = locationQuery.split(',').map(part => part.trim()).filter(Boolean);
        
        // Build search fields from property data
        const searchFields = [
          property.address?.toLowerCase(),
          property.city?.toLowerCase(),
          property.district?.toLowerCase(),
          property.cityData?.nameGeorgian?.toLowerCase(),
          property.cityData?.nameEnglish?.toLowerCase(),
          property.areaData?.nameKa?.toLowerCase(),
          property.areaData?.nameEn?.toLowerCase()
        ].filter(Boolean);
        
        // If it's a simple single-term search, check all fields
        if (locationParts.length === 1) {
          const searchTerm = locationParts[0];
          return searchFields.some(field => field?.includes(searchTerm));
        }
        
        // For multi-part searches (e.g. "თბილისი, ვაკე, ქუჩა"), check if all parts are found
        return locationParts.every(part => 
          searchFields.some(field => field?.includes(part))
        );
      })();

      // Property type and transaction type
      const matchesType = !currentFilters.propertyType || currentFilters.propertyType === "all" || property.type === currentFilters.propertyType;
      const matchesTransaction = !currentFilters.transactionType || currentFilters.transactionType === "all" || property.transactionType === currentFilters.transactionType;

      // Debug transaction type matching
      if (currentFilters.transactionType && currentFilters.transactionType !== "all") {
        console.log(`🏷️ Checking transaction type: filter="${currentFilters.transactionType}" vs property="${property.transactionType}" (ID: ${property.id})`);
      }

      // Price filters
      const matchesPriceMin = !currentFilters.priceMin || property.price >= parseInt(currentFilters.priceMin);
      const matchesPriceMax = !currentFilters.priceMax || property.price <= parseInt(currentFilters.priceMax);

      // Area filters
      const matchesAreaMin = !currentFilters.areaMin || property.area >= parseInt(currentFilters.areaMin);
      const matchesAreaMax = !currentFilters.areaMax || property.area <= parseInt(currentFilters.areaMax);

      // Room count filters
      const matchesBedrooms = !currentFilters.bedrooms || currentFilters.bedrooms === "all" || property.bedrooms === parseInt(currentFilters.bedrooms);
      const matchesBathrooms = !currentFilters.bathrooms || currentFilters.bathrooms === "all" || property.bathrooms === parseInt(currentFilters.bathrooms);
      
      // Rooms filter (check both rooms field and bedrooms as fallback)
      const matchesRooms = !currentFilters.rooms || currentFilters.rooms === "all" || 
        (property.rooms ? property.rooms === currentFilters.rooms : property.bedrooms === parseInt(currentFilters.rooms));

      // Building details filters (with defensive checks)
      const matchesTotalFloors = !currentFilters.totalFloors || currentFilters.totalFloors === "all" || 
        (property.totalFloors && property.totalFloors === currentFilters.totalFloors);

      const matchesBuildingStatus = !currentFilters.buildingStatus || currentFilters.buildingStatus === "all" || 
        (property.buildingStatus && property.buildingStatus === currentFilters.buildingStatus);

      const normalizeConditionFilter = (val: string | undefined) => {
        if (!val) return undefined;
        const map: Record<string, string> = {
          'ongoing-renovation': 'under-renovation',
          'white-plus': 'white-frame'
        };
        return map[val] || val;
      };

      const matchesCondition = !currentFilters.condition || currentFilters.condition === "all" || (() => {
        const expected = normalizeConditionFilter(currentFilters.condition);
        return property.condition && property.condition === expected;
      })();

      const matchesProjectType = !currentFilters.projectType || currentFilters.projectType === "all" || 
        (property.projectType && property.projectType === currentFilters.projectType);

      const matchesHeating = !currentFilters.heating || currentFilters.heating === "all" || 
        (property.heating && property.heating === currentFilters.heating);

      const matchesParking = !currentFilters.parking || currentFilters.parking === "all" || 
        (property.parking && property.parking === currentFilters.parking);

      const matchesHotWater = !currentFilters.hotWater || currentFilters.hotWater === "all" || 
        (property.hotWater && property.hotWater === currentFilters.hotWater);

      const matchesBuildingMaterial = !currentFilters.buildingMaterial || currentFilters.buildingMaterial === "all" || 
        (property.buildingMaterial && property.buildingMaterial === currentFilters.buildingMaterial);

      // Construction year filters
      const matchesConstructionYearMin = !currentFilters.constructionYearMin || !property.constructionYear ||
        (typeof property.constructionYear === 'number' ? property.constructionYear >= parseInt(currentFilters.constructionYearMin) :
         parseInt(property.constructionYear) >= parseInt(currentFilters.constructionYearMin));

      const matchesConstructionYearMax = !currentFilters.constructionYearMax || !property.constructionYear ||
        (typeof property.constructionYear === 'number' ? property.constructionYear <= parseInt(currentFilters.constructionYearMax) :
         parseInt(property.constructionYear) <= parseInt(currentFilters.constructionYearMax));

      // Ceiling height filters
      const matchesCeilingHeightMin = !currentFilters.ceilingHeightMin || !property.ceilingHeight ||
        property.ceilingHeight >= parseFloat(currentFilters.ceilingHeightMin);

      const matchesCeilingHeightMax = !currentFilters.ceilingHeightMax || !property.ceilingHeight ||
        property.ceilingHeight <= parseFloat(currentFilters.ceilingHeightMax);

      // Boolean amenities filters
      const matchesBalcony = !currentFilters.hasBalcony || property.hasBalcony === currentFilters.hasBalcony;
      const matchesPool = !currentFilters.hasPool || property.hasPool === currentFilters.hasPool;
      const matchesLivingRoom = !currentFilters.hasLivingRoom || property.hasLivingRoom === currentFilters.hasLivingRoom;
      const matchesLoggia = !currentFilters.hasLoggia || property.hasLoggia === currentFilters.hasLoggia;
      const matchesVeranda = !currentFilters.hasVeranda || property.hasVeranda === currentFilters.hasVeranda;
      const matchesYard = !currentFilters.hasYard || property.hasYard === currentFilters.hasYard;
      const matchesStorage = !currentFilters.hasStorage || property.hasStorage === currentFilters.hasStorage;

      // Array filters (features, advantages, furniture/appliances)
      const matchesFeatures = !currentFilters.selectedFeatures?.length || 
        currentFilters.selectedFeatures.every(feature => 
          property.features?.some((pFeature: any) => {
            if (typeof pFeature === 'string') return pFeature === feature;
            const vals = [pFeature.code, pFeature.nameGeorgian, pFeature.nameEnglish].filter(Boolean).map((v: any) => v.toString());
            return vals.includes(feature);
          })
        );

      const matchesAdvantages = !currentFilters.selectedAdvantages?.length || 
        currentFilters.selectedAdvantages.every(advantage => 
          property.advantages?.some((pAdvantage: any) => {
            if (typeof pAdvantage === 'string') return pAdvantage === advantage;
            const vals = [pAdvantage.code, pAdvantage.nameGeorgian, pAdvantage.nameEnglish].filter(Boolean).map((v: any) => v.toString());
            return vals.includes(advantage);
          })
        );

      const matchesFurnitureAppliances = !currentFilters.selectedFurnitureAppliances?.length || 
        currentFilters.selectedFurnitureAppliances.every(furniture => {
          const norm = (val: any) => (val ?? '').toString().trim().toLowerCase();
          // Bidirectional mapping between common keys and Georgian labels
          const furnitureMap: Record<string, string> = {
            'refrigerator': 'მაცივარი',
            'dishwasher': 'ჭურჭლის სარეცხი',
            'oven': 'ღუმელი',
            'bed': 'საწოლი',
            'sofa': 'დივანი',
            'gas-stove': 'გაზქურა',
            'stove-gas': 'გაზქურა',
            'air-conditioner': 'კონდიციონერი',
            'washing-machine': 'სარეცხი მანქანა',
            'chairs': 'სკამები',
            'furniture': 'ავეჯი',
            'table': 'მაგიდა',
            'stove-electric': 'ელექტრო ქურა',
            'microwave': 'მიკროტალღური',
            'tv': 'ტელევიზორი',
            'wardrobe': 'კარადა',
            'balcony-furniture': 'აივნის ავეჯი',
            'grill': 'გამწვავი'
          };
          const reverseMap: Record<string, string> = Object.keys(furnitureMap).reduce((acc, key) => {
            const ka = furnitureMap[key];
            acc[norm(ka)] = key;
            return acc;
          }, {} as Record<string, string>);

          const filterAliases = (() => {
            const base = norm(furniture);
            const key = reverseMap[base];
            return key ? [base, norm(key)] : [base];
          })();

          const hasMatch = property.furnitureAppliances?.some((pFurniture: any) => {
            const raw = typeof pFurniture === 'string'
              ? pFurniture
              : (pFurniture?.code ?? pFurniture?.nameGeorgian ?? pFurniture?.nameEnglish ?? '');
            const rawNorm = norm(raw);
            // Include possible Georgian translation of key if item is a known key
            const translated = furnitureMap[rawNorm];
            const itemAliases = [rawNorm, translated ? norm(translated) : ''].filter(Boolean);
            // Compare aliases with flexible equals/contains
            return filterAliases.some(fa => itemAliases.some(ia => ia === fa || ia.includes(fa) || fa.includes(ia)));
          });

          // Debug logging for furniture filtering
          if (currentFilters.selectedFurnitureAppliances.includes('სკამები')) {
            console.log(`🪑 Furniture Debug for Property ${property.id}:`);
            console.log(`  - Looking for: "${furniture}" (aliases: ${JSON.stringify(filterAliases)})`);
            console.log(`  - Property furnitureAppliances:`, property.furnitureAppliances);
            console.log(`  - Found match: ${hasMatch}`);
          }

          return hasMatch;
        });

      // Daily rental subcategory
      const matchesDailyRentalSubcategory = !currentFilters.dailyRentalSubcategory || 
        currentFilters.dailyRentalSubcategory === "all" || 
        property.dailyRentalSubcategory === currentFilters.dailyRentalSubcategory;

      // Return true only if ALL conditions match
      return matchesSearch && matchesLocation && matchesType && matchesTransaction &&
        matchesPriceMin && matchesPriceMax && matchesAreaMin && matchesAreaMax &&
        matchesBedrooms && matchesBathrooms && matchesRooms &&
        matchesTotalFloors && matchesBuildingStatus && matchesCondition && matchesProjectType &&
        matchesConstructionYearMin && matchesConstructionYearMax &&
        matchesCeilingHeightMin && matchesCeilingHeightMax &&
        matchesHeating && matchesParking && matchesHotWater && matchesBuildingMaterial &&
        matchesBalcony && matchesPool && matchesLivingRoom && matchesLoggia &&
        matchesVeranda && matchesYard && matchesStorage &&
        matchesFeatures && matchesAdvantages && matchesFurnitureAppliances &&
        matchesDailyRentalSubcategory;
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
    updateURLFromFilters(filters, value, 1);
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
          totalProperties={totalProperties}
          filteredCount={filteredProperties.length}
          initialFilters={filters}
          onSearch={(searchFilters) => handleFilterChange({
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
          })} 
        />

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
                    const clearedFilters = {
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
