import { Search, MapPin, Home, CreditCard, Building2, Warehouse, TreePine, Factory, Hotel, Coins, X, SlidersHorizontal, Filter, Car, Thermometer, Droplets, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { transactionTypes, propertyTypes, getTransactionTypes, getPropertyTypes } from "@/pages/Home/components/FilterTypes";
import { AdvancedFiltersModal } from "@/components/AdvancedFiltersModal";
import { LocationFilter } from "@/components/LocationFilter";
import { ActiveFilters } from "@/components/ActiveFilters";
import { citiesApi, areasApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface City {
  id: number;
  code: string;
  nameGeorgian: string;
  nameEnglish?: string;
  nameRussian?: string;
  name_georgian?: string;
  name_english?: string;
  name_russian?: string;
}

interface Area {
  id: number;
  nameKa: string;
  nameEn: string;
  nameRu?: string;
  cityId: number;
  name_georgian?: string;
  name_english?: string;
  name_russian?: string;
}


interface PropertySearchFilters {
  search: string;
  transactionType: string;
  propertyType: string | string[];
  city: string;
  areaId?: number;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  bedrooms: string | string[];
  bathrooms: string | string[];
  dailyRentalSubcategory: string;
  location: string;
  // Building Details
  rooms: string | string[];
  totalFloors: string;
  buildingStatus: string;
  constructionYearMin: string;
  constructionYearMax: string;
  condition: string;
  projectType: string;
  ceilingHeightMin: string;
  ceilingHeightMax: string;
  heating: string;
  parking: string;
  hotWater: string;
  buildingMaterial: string;
  // Boolean Amenities
  hasBalcony: boolean;
  hasPool: boolean;
  hasLivingRoom: boolean;
  hasLoggia: boolean;
  hasVeranda: boolean;
  hasYard: boolean;
  hasStorage: boolean;
  // Features and Furniture Arrays
  selectedFeatures: string[];
  selectedAdvantages: string[];
  selectedFurnitureAppliances: string[];
}

interface PropertySearchHeroProps {
  onSearch: (filters: PropertySearchFilters) => void;
  totalProperties?: number;
  filteredCount?: number;
  variant?: 'default' | 'minimal';
  initialFilters?: Partial<PropertySearchFilters>;
  isSearching?: boolean;
  onRemoveFilter?: (filterKey: string) => void;
  onClearAllFilters?: () => void;
  renderAdvancedFilters?: (props: {
    filters: PropertySearchFilters;
    onApplyFilters: (filters: PropertySearchFilters) => void;
    onClearFilters: () => void;
  }) => React.ReactNode;
}

export interface PropertySearchHeroRef {
  clearAllFilters: () => void;
}

export const PropertySearchHero = forwardRef<PropertySearchHeroRef, PropertySearchHeroProps>(({ onSearch, totalProperties = 0, filteredCount = 0, variant = 'default', initialFilters, isSearching = false, onRemoveFilter, onClearAllFilters, renderAdvancedFilters }, ref) => {
  const { t, i18n } = useTranslation('common');
  
  // Get translated filter options
  const translatedTransactionTypes = getTransactionTypes(t);
  const translatedPropertyTypes = getPropertyTypes(t);
  
  // Helper functions to get localized names
  const getCityName = (city: City): string => {
    switch (i18n.language) {
      case 'en':
        return city.name_english || city.nameEnglish || city.name_georgian || city.nameGeorgian;
      case 'ru':
        return city.name_russian || city.nameRussian || city.name_georgian || city.nameGeorgian;
      case 'ka':
      default:
        return city.name_georgian || city.nameGeorgian;
    }
  };
  
  const getAreaName = (area: Area): string => {
    switch (i18n.language) {
      case 'en':
        return area.name_english || area.nameEn || area.name_georgian || area.nameKa;
      case 'ru':
        return area.name_russian || area.nameRu || area.name_georgian || area.nameKa;
      case 'ka':
      default:
        return area.name_georgian || area.nameKa;
    }
  };
  
  // API data state
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [areaPopoverOpen, setAreaPopoverOpen] = useState(false);
  const [transactionTypePopoverOpen, setTransactionTypePopoverOpen] = useState(false);
  const [propertyTypePopoverOpen, setPropertyTypePopoverOpen] = useState(false);
  const [mobileTransactionTypePopoverOpen, setMobileTransactionTypePopoverOpen] = useState(false);
  const [mobilePropertyTypePopoverOpen, setMobilePropertyTypePopoverOpen] = useState(false);
  const processedLocationRef = useRef<string | null>(null);

  const getDefaultFilters = (): PropertySearchFilters => ({
    search: "",
    transactionType: "all",
    propertyType: [],
    city: "all",
    areaId: undefined,
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
    bedrooms: [],
    bathrooms: [],
    dailyRentalSubcategory: "all",
    location: "",
    // Building Details
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
    // Boolean Amenities
    hasBalcony: false,
    hasPool: false,
    hasLivingRoom: false,
    hasLoggia: false,
    hasVeranda: false,
    hasYard: false,
    hasStorage: false,
    // Features and Furniture Arrays
    selectedFeatures: [],
    selectedAdvantages: [],
    selectedFurnitureAppliances: []
  });

  const [filters, setFilters] = useState<PropertySearchFilters>(() => ({
    ...getDefaultFilters(),
    ...initialFilters
  }));
  
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoadingCities(true);
        const citiesData = await citiesApi.getAllCities(true);
        setCities(citiesData || []);
      } catch (error) {
        console.error('Failed to load cities:', error);
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  // Load areas when city is selected
  useEffect(() => {
    const loadAreas = async () => {
      if (!selectedCityId) {
        console.log('🏙️ No city selected, clearing areas');
        setAreas([]);
        return;
      }
      
      try {
        console.log('🏙️ Loading areas for city ID:', selectedCityId);
        setIsLoadingAreas(true);
        const areasData = await areasApi.getAreasByCity(selectedCityId);
        console.log('🏙️ Areas loaded:', areasData?.length || 0, 'areas');
        setAreas(areasData || []);
      } catch (error) {
        console.error('🚫 Failed to load areas:', error);
        setAreas([]);
      } finally {
        setIsLoadingAreas(false);
      }
    };
    loadAreas();
  }, [selectedCityId]);

  // Update filters when initialFilters prop changes
  useEffect(() => {
    if (initialFilters) {
      console.log('🔄 Updating from initialFilters:', initialFilters);
      const newFilters = {
        ...getDefaultFilters(),
        ...initialFilters
      };
      setFilters(newFilters);
      
      // Update city and area selection based on new filters
      if (initialFilters.city && initialFilters.city !== 'all' && cities.length > 0) {
        const foundCity = cities.find(c => c.nameGeorgian === initialFilters.city);
        if (foundCity) {
          console.log('🏙️ Setting selectedCityId to:', foundCity.id);
          setSelectedCityId(foundCity.id);
        }
      }
      
      // Update area selection if areaId is provided
      if (initialFilters.areaId && typeof initialFilters.areaId === 'number') {
        console.log('🗺️ Setting selectedAreaId from areaId:', initialFilters.areaId);
        setSelectedAreaId(initialFilters.areaId);
      } else if (initialFilters.location && areas.length > 0 && processedLocationRef.current !== initialFilters.location) {
        // Fallback: try to extract area from location string
        console.log('🗺️ Trying to extract area from location string:', initialFilters.location);
        processedLocationRef.current = initialFilters.location;
        const locationParts = initialFilters.location.split(',').map(part => part.replace(/\+/g, ' ').trim());
        if (locationParts.length > 1) {
          const areaName = locationParts[1]; // Second part should be area name
          console.log('🗺️ Looking for area:', areaName);
          const foundArea = areas.find(a => getAreaName(a) === areaName);
          if (foundArea && selectedAreaId !== foundArea.id) {
            console.log('🗺️ Found area, setting selectedAreaId to:', foundArea.id);
            setSelectedAreaId(foundArea.id);
          }
        }
      }
    }
  }, [initialFilters, cities, areas, selectedAreaId]);

  // Expose clearAllFilters function to parent via ref
  useImperativeHandle(ref, () => ({
    clearAllFilters
  }));

  const handleSearch = (customFilters?: Partial<PropertySearchFilters>) => {
    console.log('🔍 PropertySearchHero handleSearch called', { customFilters });
    console.log('🔍 selectedCityId:', selectedCityId);
    console.log('🔍 selectedAreaId:', selectedAreaId);
    const currentFilters = customFilters ? { ...filters, ...customFilters } : filters;
    console.log('🔍 Current filters:', currentFilters);
    
    // Build location from selected city and area
    const searchLocation = buildLocationString();
    console.log('🔍 Built location string:', searchLocation);
    
    const searchFilters = {
      ...currentFilters,
      location: searchLocation,
      areaId: selectedAreaId || undefined
    };
    
    console.log('🔍 Final search filters with areaId:', searchFilters);
    onSearch(searchFilters);
    setShowAdditionalFilters(false);
  };


  // Helper function to build location string from city and area selection
  const buildLocationString = () => {
    const cityName = selectedCityId ? getCityName(cities.find(c => c.id === selectedCityId)!) : '';
    const areaName = selectedAreaId ? getAreaName(areas.find(a => a.id === selectedAreaId)!) : '';
    
    const locationParts = [cityName, areaName].filter(Boolean);
    return locationParts.join(', ');
  };

  // Handle city selection
  const handleCityChange = (value: string) => {
    console.log('🆗 City changed to:', value);
    const numericCityId = value === 'all' ? null : parseInt(value);
    setSelectedCityId(numericCityId);
    setSelectedAreaId(null); // Reset area selection
    setCityPopoverOpen(false); // Close popover
    
    // Update filters
    const cityName = numericCityId ? getCityName(cities.find(c => c.id === numericCityId)!) || value : 'all';
    const updatedFilters = {...filters, city: cityName, search: ''};
    setFilters(updatedFilters);
  };

  // Handle area selection
  const handleAreaChange = (value: string) => {
    console.log('🆗 Area changed to:', value);
    const numericAreaId = value === 'all' ? null : parseInt(value);
    setSelectedAreaId(numericAreaId);
    setAreaPopoverOpen(false); // Close popover
  };

  // Handle transaction type selection
  const handleTransactionTypeChange = (value: string) => {
    console.log('🆗 Transaction type changed to:', value);
    const updatedFilters = {...filters, transactionType: value};
    setFilters(updatedFilters);
    setTransactionTypePopoverOpen(false);
    setMobileTransactionTypePopoverOpen(false);
  };

  // Handle property type selection  
  const handlePropertyTypeChange = (value: string) => {
    console.log('🆗 Property type changed to:', value);
    const currentPropertyTypes = Array.isArray(filters.propertyType) ? filters.propertyType : [];
    
    let newPropertyTypes;
    if (currentPropertyTypes.includes(value)) {
      // Remove if already selected
      newPropertyTypes = currentPropertyTypes.filter(type => type !== value);
    } else {
      // Add if not selected
      newPropertyTypes = [...currentPropertyTypes, value];
    }
    
    const updatedFilters = {...filters, propertyType: newPropertyTypes};
    setFilters(updatedFilters);
    // Don't close popover to allow multiple selections
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      transactionType: "all",
      propertyType: [],
      city: "all",
      areaId: undefined,
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
      bedrooms: [],
      bathrooms: [],
      dailyRentalSubcategory: "all",
      location: "",
      // Building Details
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
      // Boolean Amenities
      hasBalcony: false,
      hasPool: false,
      hasLivingRoom: false,
      hasLoggia: false,
      hasVeranda: false,
      hasYard: false,
      hasStorage: false,
      // Features and Furniture Arrays
      selectedFeatures: [],
      selectedAdvantages: [],
      selectedFurnitureAppliances: []
    };
    
    // Clear city and area selections
    setSelectedCityId(null);
    setSelectedAreaId(null);
    setAreas([]); // Clear areas list
    
    // Close any open popovers
    setCityPopoverOpen(false);
    setAreaPopoverOpen(false);
    setTransactionTypePopoverOpen(false);
    setPropertyTypePopoverOpen(false);
    setMobileTransactionTypePopoverOpen(false);
    setMobilePropertyTypePopoverOpen(false);
    
    setFilters(clearedFilters);
    // Apply cleared filters immediately
    onSearch(clearedFilters);
  };

  const hasActiveFilters = filters.search !== "" || 
    filters.transactionType !== "all" || 
    (Array.isArray(filters.propertyType) ? filters.propertyType.length > 0 : filters.propertyType !== "all") || 
    filters.city !== "all" ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.areaMin !== "" ||
    filters.areaMax !== "" ||
    (Array.isArray(filters.bedrooms) ? filters.bedrooms.length > 0 : filters.bedrooms !== "all") ||
    (Array.isArray(filters.bathrooms) ? filters.bathrooms.length > 0 : filters.bathrooms !== "all") ||
    filters.location !== "" ||
    (Array.isArray(filters.rooms) ? filters.rooms.length > 0 : filters.rooms !== "all") ||
    filters.totalFloors !== "all" ||
    filters.buildingStatus !== "all" ||
    filters.constructionYearMin !== "" ||
    filters.constructionYearMax !== "" ||
    filters.condition !== "all" ||
    filters.projectType !== "all" ||
    filters.ceilingHeightMin !== "" ||
    filters.ceilingHeightMax !== "" ||
    filters.heating !== "all" ||
    filters.parking !== "all" ||
    filters.hotWater !== "all" ||
    filters.buildingMaterial !== "all" ||
    filters.hasBalcony ||
    filters.hasPool ||
    filters.hasLivingRoom ||
    filters.hasLoggia ||
    filters.hasVeranda ||
    filters.hasYard ||
    filters.hasStorage ||
    filters.selectedFeatures.length > 0 ||
    filters.selectedAdvantages.length > 0 ||
    filters.selectedFurnitureAppliances.length > 0;


  // Dynamic styling based on variant
  const sectionClasses = variant === 'minimal' 
    ? "py-4 sm:py-6 lg:py-8" 
    : "bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-4 sm:py-6 lg:py-8";
    
  const containerClasses = variant === 'minimal'
    ? "bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-gray-200 mx-auto"
    : "bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-2xl border border-white/20 mx-auto";

  const buttonClasses = variant === 'minimal'
    ? "group h-10 sm:h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl transition-all duration-300"
    : "group h-10 sm:h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300";

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className={containerClasses}>
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-end">
            
            {/* Mobile: Transaction Type and Property Type side by side */}
            <div className="flex flex-row gap-2 sm:gap-3 lg:hidden w-full">
              {/* Transaction Type */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <label className="text-xs font-semibold text-slate-700">
                    {t('propertySearchHero.transactionType')}
                  </label>
                </div>
                <Popover open={mobileTransactionTypePopoverOpen} onOpenChange={setMobileTransactionTypePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={mobileTransactionTypePopoverOpen}
                      className="h-10 w-full justify-between text-xs border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors font-normal"
                    >
                    {filters.transactionType && filters.transactionType !== 'all' ? (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const getIcon = (value: string) => {
                            switch(value) {
                              case 'sale': return <Coins className="h-4 w-4 text-primary" />;
                              case 'rent': return <Home className="h-4 w-4 text-primary" />;
                              case 'mortgage': return <CreditCard className="h-4 w-4 text-primary" />;
                              case 'lease': return <Building2 className="h-4 w-4 text-primary" />;
                              case 'daily': return <Hotel className="h-4 w-4 text-primary" />;
                              case 'rent-to-buy': return <CreditCard className="h-4 w-4 text-primary" />;
                              default: return <CreditCard className="h-4 w-4 text-primary" />;
                            }
                          };
                          return getIcon(filters.transactionType);
                        })()}
                        {translatedTransactionTypes.find((type) => type.value === filters.transactionType)?.label}
                      </div>
                    ) : (
                      t('propertySearchHero.chooseType')
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0 z-50" align="start">
                  <Command>
                    <CommandInput placeholder={t('propertySearchHero.searchTransactionType')} />
                    <CommandList>
                      <CommandEmpty>{t('propertySearchHero.noTransactionTypeFound')}</CommandEmpty>
                      <CommandGroup>
                        {translatedTransactionTypes.map((type) => {
                          const getIcon = (value: string) => {
                            switch(value) {
                              case 'sale': return <Coins className="h-4 w-4 text-primary" />;
                              case 'rent': return <Home className="h-4 w-4 text-primary" />;
                              case 'mortgage': return <CreditCard className="h-4 w-4 text-primary" />;
                              case 'lease': return <Building2 className="h-4 w-4 text-primary" />;
                              case 'daily': return <Hotel className="h-4 w-4 text-primary" />;
                              case 'rent-to-buy': return <CreditCard className="h-4 w-4 text-primary" />;
                              default: return <CreditCard className="h-4 w-4 text-primary" />;
                            }
                          };
                          return (
                            <CommandItem
                              key={type.value}
                              value={type.label}
                              onSelect={() => handleTransactionTypeChange(type.value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filters.transactionType === type.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {getIcon(type.value)}
                              <span className="ml-2">{type.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              </div>

              {/* Property Type */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <label className="text-xs font-semibold text-slate-700">
                    {t('propertySearchHero.propertyType')}
                  </label>
                </div>
                <Popover open={mobilePropertyTypePopoverOpen} onOpenChange={setMobilePropertyTypePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={mobilePropertyTypePopoverOpen}
                      className="h-10 w-full justify-between text-xs border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors font-normal"
                    >
                      {Array.isArray(filters.propertyType) && filters.propertyType.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          {filters.propertyType.length === 1 
                            ? translatedPropertyTypes.find((type) => type.value === filters.propertyType[0])?.label 
                            : `${filters.propertyType.length} ${t('propertySearchHero.selected')}`
                          }
                        </div>
                      ) : (
t('propertySearchHero.chooseType')
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0 z-50" align="start">
                    <Command>
                      <CommandInput placeholder={t('propertySearchHero.searchPropertyType')} />
                      <CommandList>
                        <CommandEmpty>{t('propertySearchHero.noPropertyTypeFound')}</CommandEmpty>
                        <CommandGroup>
                          {translatedPropertyTypes.map((type) => {
                            const getIcon = (value: string) => {
                              switch(value) {
                                case 'apartment': return <Building2 className="h-4 w-4 text-primary" />;
                                case 'house': return <Home className="h-4 w-4 text-primary" />;
                                case 'cottage': return <TreePine className="h-4 w-4 text-primary" />;
                                case 'land': return <MapPin className="h-4 w-4 text-primary" />;
                                case 'commercial': return <Factory className="h-4 w-4 text-primary" />;
                                case 'office': return <Building2 className="h-4 w-4 text-primary" />;
                                case 'hotel': return <Hotel className="h-4 w-4 text-primary" />;
                                default: return <Home className="h-4 w-4 text-primary" />;
                              }
                            };
                            const isSelected = Array.isArray(filters.propertyType) 
                              ? filters.propertyType.includes(type.value) 
                              : filters.propertyType === type.value;
                            
                            return (
                              <CommandItem
                                key={type.value}
                                value={type.label}
                                onSelect={() => handlePropertyTypeChange(type.value)}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  className="mr-2"
                                />
                                {getIcon(type.value)}
                                <span className="ml-2">{type.label}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Desktop: Transaction Type */}
            <div className="hidden lg:flex w-2/12 flex-col gap-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <label className="text-sm font-semibold text-slate-700">
                  {t('propertySearchHero.transactionType')}
                </label>
              </div>
              <Popover open={transactionTypePopoverOpen} onOpenChange={setTransactionTypePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={transactionTypePopoverOpen}
                    className="h-12 w-full justify-between text-sm border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors font-normal"
                  >
                    {filters.transactionType && filters.transactionType !== 'all' ? (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const getIcon = (value: string) => {
                            switch(value) {
                              case 'sale': return <Coins className="h-4 w-4 text-primary" />;
                              case 'rent': return <Home className="h-4 w-4 text-primary" />;
                              case 'mortgage': return <CreditCard className="h-4 w-4 text-primary" />;
                              case 'lease': return <Building2 className="h-4 w-4 text-primary" />;
                              case 'daily': return <Hotel className="h-4 w-4 text-primary" />;
                              case 'rent-to-buy': return <CreditCard className="h-4 w-4 text-primary" />;
                              default: return <CreditCard className="h-4 w-4 text-primary" />;
                            }
                          };
                          return getIcon(filters.transactionType);
                        })()}
                        {translatedTransactionTypes.find((type) => type.value === filters.transactionType)?.label}
                      </div>
                    ) : (
                      t('propertySearchHero.chooseType')
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0 z-50" align="start">
                  <Command>
                    <CommandInput placeholder={t('propertySearchHero.searchTransactionType')} />
                    <CommandList>
                      <CommandEmpty>{t('propertySearchHero.noTransactionTypeFound')}</CommandEmpty>
                      <CommandGroup>
                        {translatedTransactionTypes.map((type) => {
                          const getIcon = (value: string) => {
                            switch(value) {
                              case 'sale': return <Coins className="h-4 w-4 text-primary" />;
                              case 'rent': return <Home className="h-4 w-4 text-primary" />;
                              case 'mortgage': return <CreditCard className="h-4 w-4 text-primary" />;
                              case 'lease': return <Building2 className="h-4 w-4 text-primary" />;
                              case 'daily': return <Hotel className="h-4 w-4 text-primary" />;
                              case 'rent-to-buy': return <CreditCard className="h-4 w-4 text-primary" />;
                              default: return <CreditCard className="h-4 w-4 text-primary" />;
                            }
                          };
                          return (
                            <CommandItem
                              key={type.value}
                              value={type.label}
                              onSelect={() => handleTransactionTypeChange(type.value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filters.transactionType === type.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {getIcon(type.value)}
                              <span className="ml-2">{type.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Desktop: Property Type */}
            <div className="hidden lg:flex w-2/12 flex-col gap-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <label className="text-sm font-semibold text-slate-700">
                  {t('propertySearchHero.propertyType')}
                </label>
              </div>
              <Popover open={propertyTypePopoverOpen} onOpenChange={setPropertyTypePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={propertyTypePopoverOpen}
                    className="h-10 sm:h-12 w-full justify-between text-xs sm:text-sm border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors font-normal"
                  >
                    {Array.isArray(filters.propertyType) && filters.propertyType.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-primary" />
                        {filters.propertyType.length === 1 
                          ? translatedPropertyTypes.find((type) => type.value === filters.propertyType[0])?.label 
                          : `${filters.propertyType.length} ${t('propertySearchHero.selected')}`
                        }
                      </div>
                    ) : (
                      t('propertySearchHero.chooseType')
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0 z-50" align="start">
                  <Command>
                    <CommandInput placeholder={t('propertySearchHero.searchPropertyType')} />
                    <CommandList>
                      <CommandEmpty>{t('propertySearchHero.noPropertyTypeFound')}</CommandEmpty>
                      <CommandGroup>
                        {translatedPropertyTypes.map((type) => {
                          const getIcon = (value: string) => {
                            switch(value) {
                              case 'apartment': return <Building2 className="h-4 w-4 text-primary" />;
                              case 'house': return <Home className="h-4 w-4 text-primary" />;
                              case 'cottage': return <TreePine className="h-4 w-4 text-primary" />;
                              case 'land': return <MapPin className="h-4 w-4 text-primary" />;
                              case 'commercial': return <Factory className="h-4 w-4 text-primary" />;
                              case 'office': return <Building2 className="h-4 w-4 text-primary" />;
                              case 'hotel': return <Hotel className="h-4 w-4 text-primary" />;
                              default: return <Home className="h-4 w-4 text-primary" />;
                            }
                          };
                          const isSelected = Array.isArray(filters.propertyType) 
                            ? filters.propertyType.includes(type.value) 
                            : filters.propertyType === type.value;
                          
                          return (
                            <CommandItem
                              key={type.value}
                              value={type.label}
                              onSelect={() => handlePropertyTypeChange(type.value)}
                            >
                              <Checkbox
                                checked={isSelected}
                                className="mr-2"
                              />
                              {getIcon(type.value)}
                              <span className="ml-2">{type.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Location Selection - City and District */}
            <div className="w-full lg:w-5/12 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  {t('propertySearchHero.location')}
                </label>
              </div>
              <div className="flex flex-row gap-2">
                {/* City Selection */}
                <div className="flex-1">
                  <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityPopoverOpen}
                        className="h-10 sm:h-12 w-full justify-between text-xs sm:text-base border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors font-normal"
                        disabled={isLoadingCities}
                      >
                        {isLoadingCities ? (
                          t('common.loading')
                        ) : selectedCityId ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-primary" />
                            {selectedCityId ? getCityName(cities.find((city) => city.id === selectedCityId)!) : ''}
                          </div>
                        ) : (
                          t('propertySearchHero.city')
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 z-50" align="start">
                      <Command>
                        <CommandInput placeholder={t('propertySearchHero.searchCity')} />
                        <CommandList>
                          <CommandEmpty>{t('propertySearchHero.noCityFound')}</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              key="all"
                              value="all-cities"
                              onSelect={() => handleCityChange('all')}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCityId === null ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {t('propertySearchHero.allCities')}
                            </CommandItem>
                            {cities.map((city) => (
                              <CommandItem
                                key={city.id}
                                value={city.nameGeorgian}
                                onSelect={() => handleCityChange(city.id.toString())}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCityId === city.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <MapPin className="mr-2 h-3 w-3 text-primary" />
                                {getCityName(city)}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Area/District Selection - Only show when city is selected AND has areas */}
                {selectedCityId && areas.length > 0 && (
                  <div className="flex-1">
                    <Popover open={areaPopoverOpen} onOpenChange={setAreaPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={areaPopoverOpen}
                          className="h-10 sm:h-12 w-full justify-between text-xs sm:text-base border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors font-normal"
                          disabled={isLoadingAreas}
                        >
                          {isLoadingAreas ? (
                            t('common.loading')
                          ) : selectedAreaId ? (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-primary" />
                              {selectedAreaId ? getAreaName(areas.find((area) => area.id === selectedAreaId)!) : ''}
                            </div>
                          ) : (
                            t('propertySearchHero.area')
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 z-50" align="start">
                        <Command>
                          <CommandInput placeholder={t('propertySearchHero.searchArea')} />
                          <CommandList>
                            <CommandEmpty>{t('propertySearchHero.noAreaFound')}</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                key="all"
                                value="all-areas"
                                onSelect={() => handleAreaChange('all')}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedAreaId === null ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {t('propertySearchHero.allAreas')}
                              </CommandItem>
                              {areas.map((area) => (
                                <CommandItem
                                  key={area.id}
                                  value={area.nameKa}
                                  onSelect={() => handleAreaChange(area.id.toString())}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedAreaId === area.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <MapPin className="mr-2 h-3 w-3 text-primary" />
                                  {getAreaName(area)}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>

            {/* Search and Advanced Filter Buttons */}
            <div className="w-full lg:w-auto lg:flex-1 flex flex-row gap-2 justify-end items-end">
              {/* Advanced Filters Button */}
              <AdvancedFiltersModal
                filters={{
                  priceMin: filters.priceMin,
                  priceMax: filters.priceMax,
                  areaMin: filters.areaMin,
                  areaMax: filters.areaMax,
                  bedrooms: filters.bedrooms,
                  bathrooms: filters.bathrooms,
                  rooms: filters.rooms,
                  location: filters.location,
                  dailyRentalSubcategory: filters.dailyRentalSubcategory,
                  totalFloors: filters.totalFloors,
                  buildingStatus: filters.buildingStatus,
                  constructionYearMin: filters.constructionYearMin,
                  constructionYearMax: filters.constructionYearMax,
                  condition: filters.condition,
                  projectType: filters.projectType,
                  ceilingHeightMin: filters.ceilingHeightMin,
                  ceilingHeightMax: filters.ceilingHeightMax,
                  buildingMaterial: filters.buildingMaterial,
                  heating: filters.heating,
                  parking: filters.parking,
                  hotWater: filters.hotWater,
                  hasBalcony: filters.hasBalcony,
                  hasPool: filters.hasPool,
                  hasLivingRoom: filters.hasLivingRoom,
                  hasLoggia: filters.hasLoggia,
                  hasVeranda: filters.hasVeranda,
                  hasYard: filters.hasYard,
                  hasStorage: filters.hasStorage,
                  selectedFeatures: filters.selectedFeatures,
                  selectedAdvantages: filters.selectedAdvantages,
                  selectedFurnitureAppliances: filters.selectedFurnitureAppliances
                }}
                onApplyFilters={(advancedFilters) => {
                  console.log('🎯 PropertySearchHero: onApplyFilters called', { advancedFilters, currentFilters: filters });
                  const updatedFilters = { ...filters, ...advancedFilters };
                  console.log('📋 PropertySearchHero: updatedFilters', updatedFilters);
                  setFilters(updatedFilters);
                  // Advanced filters will only update state, navigation happens on search button click
                }}
                onClearFilters={clearAllFilters}
                totalProperties={totalProperties}
                filteredCount={filteredCount}
                transactionType={filters.transactionType}
                onSearch={(advancedFilters) => {
                  console.log('📱 PropertySearchHero: onSearch from AdvancedFilters called', { advancedFilters });
                  handleSearch(advancedFilters);
                }}
              />

              {/* Search Button */}
              {hasActiveFilters ? (
                <div className="flex-1">
                  <Button 
                    onClick={() => handleSearch()}
                    size="lg" 
                    className={`${buttonClasses} w-full text-sm sm:text-base h-12`}
                    disabled={isSearching}
                    data-search-button="true"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t('propertySearchHero.searching')}
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        {t('common.search')}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex-1">
                  <Button 
                    onClick={() => handleSearch()}
                    size="lg" 
                    className={`${buttonClasses} w-full text-sm sm:text-base h-12`}
                    disabled={isSearching}
                    data-search-button="true"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t('propertySearchHero.searching')}
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        {t('common.search')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Active Filters - Show inside the same container */}
        {onRemoveFilter && onClearAllFilters && (
          <ActiveFilters 
            filters={filters}
            onRemoveFilter={onRemoveFilter}
            onClearAll={onClearAllFilters}
          />
        )}
      </div>
    </section>
  );
});