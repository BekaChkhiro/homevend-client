import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { 
  SlidersHorizontal, 
  Filter, 
  X, 
  Search, 
  Home, 
  Building2, 
  Car, 
  Thermometer, 
  Droplets,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Check,
  ChevronsUpDown
} from "lucide-react";

// Filter options functions that use translations
const getTransactionTypes = (t: (key: string) => string) => [
  { value: 'all', label: t('filters.transactionTypes.all') },
  { value: 'sale', label: t('filters.transactionTypes.sale') },
  { value: 'rent', label: t('filters.transactionTypes.rent') },
  { value: 'mortgage', label: t('filters.transactionTypes.mortgage') },
  { value: 'lease', label: t('filters.transactionTypes.lease') },
  { value: 'daily', label: t('filters.transactionTypes.daily') },
  { value: 'rent-to-buy', label: t('filters.transactionTypes.rentToBuy') }
];

const getDailyRentalSubcategories = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "sea", label: t('advancedFilters.dailyRental.sea') },
  { value: "mountains", label: t('advancedFilters.dailyRental.mountains') },
  { value: "villa", label: t('advancedFilters.dailyRental.villa') }
];

const getBuildingStatusOptions = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "old-built", label: t('advancedFilters.buildingStatus.oldBuilt') },
  { value: "new-built", label: t('advancedFilters.buildingStatus.newBuilt') },
  { value: "under-construction", label: t('advancedFilters.buildingStatus.underConstruction') }
];

const getConditionOptions = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "newly-renovated", label: t('advancedFilters.condition.newlyRenovated') },
  { value: "old-renovated", label: t('advancedFilters.condition.oldRenovated') },
  { value: "ongoing-renovation", label: t('advancedFilters.condition.ongoingRenovation') },
  { value: "needs-renovation", label: t('advancedFilters.condition.needsRenovation') },
  { value: "white-frame", label: t('advancedFilters.condition.whiteFrame') },
  { value: "black-frame", label: t('advancedFilters.condition.blackFrame') },
  { value: "green-frame", label: t('advancedFilters.condition.greenFrame') },
  { value: "white-plus", label: t('advancedFilters.condition.whitePlus') }
];

const getHeatingOptions = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "central-heating", label: t('advancedFilters.heating.centralHeating') },
  { value: "gas-heater", label: t('advancedFilters.heating.gasHeater') },
  { value: "electric-heater", label: t('advancedFilters.heating.electricHeater') },
  { value: "central-floor", label: t('advancedFilters.heating.centralFloor') },
  { value: "no-heating", label: t('advancedFilters.heating.noHeating') },
  { value: "individual", label: t('advancedFilters.heating.individual') },
  { value: "floor-heating", label: t('advancedFilters.heating.floorHeating') }
];

const getParkingOptions = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "garage", label: t('advancedFilters.parking.garage') },
  { value: "parking-space", label: t('advancedFilters.parking.parkingSpace') },
  { value: "yard-parking", label: t('advancedFilters.parking.yardParking') },
  { value: "underground-parking", label: t('advancedFilters.parking.undergroundParking') },
  { value: "paid-parking", label: t('advancedFilters.parking.paidParking') },
  { value: "no-parking", label: t('advancedFilters.parking.noParking') }
];

const getHotWaterOptions = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "gas-water-heater", label: t('advancedFilters.hotWater.gasWaterHeater') },
  { value: "boiler", label: t('advancedFilters.hotWater.boiler') },
  { value: "electric-water-heater", label: t('advancedFilters.hotWater.electricWaterHeater') },
  { value: "solar-heater", label: t('advancedFilters.hotWater.solarHeater') },
  { value: "no-hot-water", label: t('advancedFilters.hotWater.noHotWater') },
  { value: "central-hot-water", label: t('advancedFilters.hotWater.centralHotWater') },
  { value: "natural-hot-water", label: t('advancedFilters.hotWater.naturalHotWater') },
  { value: "individual", label: t('advancedFilters.heating.individual') }
];

const getBuildingMaterialOptions = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "block", label: t('advancedFilters.buildingMaterial.block') },
  { value: "brick", label: t('advancedFilters.buildingMaterial.brick') },
  { value: "wood", label: t('advancedFilters.buildingMaterial.wood') },
  { value: "reinforced-concrete", label: t('advancedFilters.buildingMaterial.reinforcedConcrete') },
  { value: "combined", label: t('advancedFilters.buildingMaterial.combined') }
];

const getProjectTypeOptions = (t: (key: string) => string) => [
  { value: "all", label: t('filters.transactionTypes.all') },
  { value: "non-standard", label: t('advancedFilters.projectType.nonStandard') },
  { value: "villa", label: t('advancedFilters.projectType.villa') },
  { value: "townhouse", label: t('advancedFilters.projectType.townhouse') }
];

const getCommonFeatures = (t: (key: string) => string) => [
  t('advancedFilters.features.elevator'),
  t('advancedFilters.features.airConditioning'),
  t('advancedFilters.features.internet'),
  t('advancedFilters.features.cableTv'),
  t('advancedFilters.features.securitySystem'),
  t('advancedFilters.features.videoSurveillance'),
  t('advancedFilters.features.concierge'),
  t('advancedFilters.features.washingMachine'),
  t('advancedFilters.features.dishwasher'),
  t('advancedFilters.features.naturalGas'),
  t('advancedFilters.features.gasStove'),
  t('advancedFilters.features.electricStove'),
  t('advancedFilters.features.microwave'),
  t('advancedFilters.features.separateEntrance')
];

const getCommonAdvantages = (t: (key: string) => string) => [
  t('advancedFilters.advantages.downtown'),
  t('advancedFilters.advantages.nearMetro'),
  t('advancedFilters.advantages.quietArea'),
  t('advancedFilters.advantages.developedInfrastructure'),
  t('advancedFilters.advantages.nearPark'),
  t('advancedFilters.advantages.nearSchool'),
  t('advancedFilters.advantages.nearMall'),
  t('advancedFilters.advantages.nearBusStop'),
  t('advancedFilters.advantages.nearUniversity'),
  t('advancedFilters.advantages.nearHospital'),
  t('advancedFilters.advantages.nearSea'),
  t('advancedFilters.advantages.nearMountains')
];

const getCommonFurniture = (t: (key: string) => string) => [
  t('advancedFilters.furniture.wardrobe'),
  t('advancedFilters.furniture.bed'),
  t('advancedFilters.furniture.refrigerator'),
  t('advancedFilters.furniture.stove'),
  t('advancedFilters.furniture.washingMachine'),
  t('advancedFilters.furniture.tv'),
  t('advancedFilters.furniture.microwave'),
  t('advancedFilters.furniture.dishwasher'),
  t('advancedFilters.furniture.sofa'),
  t('advancedFilters.furniture.table'),
  t('advancedFilters.furniture.chairs'),
  t('advancedFilters.furniture.balconyFurniture'),
  t('advancedFilters.furniture.airConditioner'),
  t('advancedFilters.furniture.heater')
];

interface AdvancedFilterState {
  // Basic filters
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  bedrooms: string | string[];
  bathrooms: string | string[];
  rooms: string | string[];
  location: string;
  dailyRentalSubcategory: string;
  
  // Building details
  totalFloors: string;
  buildingStatus: string;
  constructionYearMin: string;
  constructionYearMax: string;
  condition: string;
  projectType: string;
  ceilingHeightMin: string;
  ceilingHeightMax: string;
  buildingMaterial: string;
  
  // Amenities
  heating: string;
  parking: string;
  hotWater: string;
  hasBalcony: boolean;
  hasPool: boolean;
  hasLivingRoom: boolean;
  hasLoggia: boolean;
  hasVeranda: boolean;
  hasYard: boolean;
  hasStorage: boolean;
  
  // Features
  selectedFeatures: string[];
  selectedAdvantages: string[];
  selectedFurnitureAppliances: string[];
}

interface AdvancedFiltersModalProps {
  filters: AdvancedFilterState;
  onApplyFilters?: (filters: AdvancedFilterState) => void;
  onClearFilters?: () => void;
  totalProperties?: number;
  filteredCount?: number;
  transactionType?: string;
  basicFilters?: {
    search?: string;
    transactionType?: string;
    propertyType?: string;
    city?: string;
  };
  onSearch?: (filters: AdvancedFilterState) => void; // Direct search callback for mobile UX
}

interface SavedFilter {
  id: string;
  name: string;
  filters: AdvancedFilterState;
  createdAt: Date;
}

export const AdvancedFiltersModal = ({ 
  filters: initialFilters, 
  onApplyFilters, 
  onClearFilters,
  totalProperties = 0,
  filteredCount = 0,
  transactionType,
  basicFilters,
  onSearch
}: AdvancedFiltersModalProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  
  // Get translated filter options
  const transactionTypes = getTransactionTypes(t);
  const dailyRentalSubcategories = getDailyRentalSubcategories(t);
  const buildingStatusOptions = getBuildingStatusOptions(t);
  const conditionOptions = getConditionOptions(t);
  const heatingOptions = getHeatingOptions(t);
  const parkingOptions = getParkingOptions(t);
  const hotWaterOptions = getHotWaterOptions(t);
  const buildingMaterialOptions = getBuildingMaterialOptions(t);
  const projectTypeOptions = getProjectTypeOptions(t);
  const commonFeatures = getCommonFeatures(t);
  const commonAdvantages = getCommonAdvantages(t);
  const commonFurniture = getCommonFurniture(t);
  
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilterState>(initialFilters);
  const [activeTab, setActiveTab] = useState("basic");
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filterName, setFilterName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  
  // Load saved filters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('homevend_saved_filters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Update internal filters when props change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Count active filters
  const getActiveFiltersCount = () => {
    return [
      filters.priceMin !== "",
      filters.priceMax !== "",
      filters.areaMin !== "",
      filters.areaMax !== "",
      (Array.isArray(filters.bedrooms) ? filters.bedrooms.length > 0 : filters.bedrooms !== "all"),
      (Array.isArray(filters.bathrooms) ? filters.bathrooms.length > 0 : filters.bathrooms !== "all"),
      (Array.isArray(filters.rooms) ? filters.rooms.length > 0 : filters.rooms !== "all"),
      filters.location !== "",
      filters.dailyRentalSubcategory !== "" && filters.dailyRentalSubcategory !== "all",
      filters.totalFloors !== "all",
      filters.buildingStatus !== "all",
      filters.constructionYearMin !== "",
      filters.constructionYearMax !== "",
      filters.condition !== "all",
      filters.projectType !== "all",
      filters.ceilingHeightMin !== "",
      filters.ceilingHeightMax !== "",
      filters.buildingMaterial !== "all",
      filters.heating !== "all",
      filters.parking !== "all",
      filters.hotWater !== "all",
      filters.hasBalcony,
      filters.hasPool,
      filters.hasLivingRoom,
      filters.hasLoggia,
      filters.hasVeranda,
      filters.hasYard,
      filters.hasStorage,
      filters.selectedFeatures.length > 0,
      filters.selectedAdvantages.length > 0,
      filters.selectedFurnitureAppliances.length > 0
    ].filter(Boolean).length;
  };

  const handleApplyFilters = () => {
    console.log('🔄 AdvancedFiltersModal: handleApplyFilters called', { filters, onApplyFilters: !!onApplyFilters });
    
    if (onApplyFilters) {
      // If onApplyFilters prop exists, use it (for backward compatibility)
      console.log('🎯 AdvancedFiltersModal: Using onApplyFilters prop');
      onApplyFilters(filters);
      
      // On mobile/tablet, also trigger search automatically to provide better UX
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      if (isMobile && onSearch) {
        console.log('📱 Mobile detected: Calling onSearch directly for better UX');
        // If onSearch prop is available, use it directly
        onSearch(filters);
      } else if (isMobile) {
        console.log('📱 Mobile detected: Auto-triggering search button click');
        // Fallback to clicking search button
        setTimeout(() => {
          const searchButton = document.querySelector('[data-search-button="true"]') as HTMLButtonElement;
          if (searchButton && !searchButton.disabled) {
            console.log('🔍 Auto-clicking search button for mobile UX');
            searchButton.click();
          }
        }, 100);
      }
      
      setOpen(false);
      return;
    }

    // Otherwise, navigate to properties page with URL filters
    const searchParams = new URLSearchParams();
    
    // Add basic filters from props if available
    if (basicFilters?.search) searchParams.set('search', basicFilters.search);
    if (basicFilters?.transactionType && basicFilters.transactionType !== 'all') {
      searchParams.set('transactionType', basicFilters.transactionType);
    }
    if (basicFilters?.propertyType && basicFilters.propertyType !== 'all') {
      searchParams.set('propertyType', basicFilters.propertyType);
    }
    if (basicFilters?.city && basicFilters.city !== 'all') {
      searchParams.set('location', basicFilters.city);
    }
    
    // Add advanced filters
    if (filters.priceMin) searchParams.set('priceMin', filters.priceMin);
    if (filters.priceMax) searchParams.set('priceMax', filters.priceMax);
    if (filters.areaMin) searchParams.set('areaMin', filters.areaMin);
    if (filters.areaMax) searchParams.set('areaMax', filters.areaMax);
    if (filters.bedrooms) {
      if (Array.isArray(filters.bedrooms) && filters.bedrooms.length > 0) {
        searchParams.set('bedrooms', filters.bedrooms.join(','));
      } else if (typeof filters.bedrooms === 'string' && filters.bedrooms !== 'all') {
        searchParams.set('bedrooms', filters.bedrooms);
      }
    }
    if (filters.bathrooms) {
      if (Array.isArray(filters.bathrooms) && filters.bathrooms.length > 0) {
        searchParams.set('bathrooms', filters.bathrooms.join(','));
      } else if (typeof filters.bathrooms === 'string' && filters.bathrooms !== 'all') {
        searchParams.set('bathrooms', filters.bathrooms);
      }
    }
    if (filters.rooms) {
      if (Array.isArray(filters.rooms) && filters.rooms.length > 0) {
        searchParams.set('rooms', filters.rooms.join(','));
      } else if (typeof filters.rooms === 'string' && filters.rooms !== 'all') {
        searchParams.set('rooms', filters.rooms);
      }
    }
    if (filters.dailyRentalSubcategory && filters.dailyRentalSubcategory !== 'all') searchParams.set('dailyRentalSubcategory', filters.dailyRentalSubcategory);
    if (filters.totalFloors && filters.totalFloors !== 'all') searchParams.set('totalFloors', filters.totalFloors);
    if (filters.buildingStatus && filters.buildingStatus !== 'all') searchParams.set('buildingStatus', filters.buildingStatus);
    if (filters.constructionYearMin) searchParams.set('constructionYearMin', filters.constructionYearMin);
    if (filters.constructionYearMax) searchParams.set('constructionYearMax', filters.constructionYearMax);
    if (filters.condition && filters.condition !== 'all') searchParams.set('condition', filters.condition);
    if (filters.projectType && filters.projectType !== 'all') searchParams.set('projectType', filters.projectType);
    if (filters.ceilingHeightMin) searchParams.set('ceilingHeightMin', filters.ceilingHeightMin);
    if (filters.ceilingHeightMax) searchParams.set('ceilingHeightMax', filters.ceilingHeightMax);
    if (filters.heating && filters.heating !== 'all') searchParams.set('heating', filters.heating);
    if (filters.parking && filters.parking !== 'all') searchParams.set('parking', filters.parking);
    if (filters.hotWater && filters.hotWater !== 'all') searchParams.set('hotWater', filters.hotWater);
    if (filters.buildingMaterial && filters.buildingMaterial !== 'all') searchParams.set('buildingMaterial', filters.buildingMaterial);
    if (filters.hasBalcony) searchParams.set('hasBalcony', 'true');
    if (filters.hasPool) searchParams.set('hasPool', 'true');
    if (filters.hasLivingRoom) searchParams.set('hasLivingRoom', 'true');
    if (filters.hasLoggia) searchParams.set('hasLoggia', 'true');
    if (filters.hasVeranda) searchParams.set('hasVeranda', 'true');
    if (filters.hasYard) searchParams.set('hasYard', 'true');
    if (filters.hasStorage) searchParams.set('hasStorage', 'true');
    if (filters.selectedFeatures?.length) searchParams.set('selectedFeatures', filters.selectedFeatures.join(','));
    if (filters.selectedAdvantages?.length) searchParams.set('selectedAdvantages', filters.selectedAdvantages.join(','));
    if (filters.selectedFurnitureAppliances?.length) searchParams.set('selectedFurnitureAppliances', filters.selectedFurnitureAppliances.join(','));
    
    const queryString = searchParams.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ''}`);
    setOpen(false);
  };

  const handleClearAllFilters = () => {
    const clearedFilters: AdvancedFilterState = {
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
      bedrooms: [],
      bathrooms: [],
      rooms: [],
      location: "",
      dailyRentalSubcategory: "all",
      totalFloors: "all",
      buildingStatus: "all",
      constructionYearMin: "",
      constructionYearMax: "",
      condition: "all",
      projectType: "all",
      ceilingHeightMin: "",
      ceilingHeightMax: "",
      buildingMaterial: "all",
      heating: "all",
      parking: "all",
      hotWater: "all",
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
    
    if (onClearFilters) {
      onClearFilters();
    } else {
      // If no callback provided, navigate to properties page without filters
      navigate('/properties');
      setOpen(false);
    }
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: { ...filters },
      createdAt: new Date()
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('homevend_saved_filters', JSON.stringify(updatedFilters));
    
    setFilterName("");
    setShowSaveInput(false);
  };

  const handleLoadSavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
  };

  const handleDeleteSavedFilter = (filterId: string) => {
    const updatedFilters = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updatedFilters);
    localStorage.setItem('homevend_saved_filters', JSON.stringify(updatedFilters));
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="h-12 w-12 border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors relative flex items-center justify-center p-0"
        >
          <SlidersHorizontal className="h-5 w-5" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs h-5 min-w-5 flex items-center justify-center p-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogPortal>
        <DialogOverlay className="bg-transparent backdrop-blur-[2px]" />
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1200px] xl:max-w-[1368px] mx-auto max-h-[90vh] sm:max-h-[85vh] p-0 left-1/2 right-auto -translate-x-1/2 bottom-0 top-auto data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full data-[state=open]:-translate-x-1/2 data-[state=closed]:-translate-x-1/2 duration-300 ease-out transition-transform shadow-2xl overflow-hidden" style={{ borderRadius: '20px 20px 0px 0px' }}>
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-100">
          <DialogTitle className="flex items-center justify-between text-xl sm:text-2xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900">{t('advancedFilters.title')}</h2>
                <p className="text-xs sm:text-sm text-slate-600 font-normal hidden sm:block">{t('advancedFilters.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-normal">
              <Badge variant="outline" className="px-2 sm:px-4 py-1 sm:py-2 bg-white border-slate-200 text-slate-700 font-medium text-xs sm:text-sm">
                <span className="hidden sm:inline">{filteredCount} / {totalProperties} {t('advancedFilters.properties')}</span>
                <span className="sm:hidden">{filteredCount}/{totalProperties}</span>
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 px-3 sm:px-6 bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4 sm:mb-8 bg-slate-100/80 p-1 rounded-xl h-10 sm:h-12 overflow-x-auto">
              <TabsTrigger value="basic" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg text-xs sm:text-sm px-2 sm:px-4">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('advancedFilters.tabs.basic')}</span>
                <span className="sm:hidden">{t('advancedFilters.tabs.basicShort')}</span>
              </TabsTrigger>
              <TabsTrigger value="building" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg text-xs sm:text-sm px-2 sm:px-4">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('advancedFilters.tabs.building')}</span>
                <span className="sm:hidden">{t('advancedFilters.tabs.buildingShort')}</span>
              </TabsTrigger>
              <TabsTrigger value="amenities" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg text-xs sm:text-sm px-2 sm:px-4">
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('advancedFilters.tabs.amenities')}</span>
                <span className="sm:hidden">{t('advancedFilters.tabs.amenitiesShort')}</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg text-xs sm:text-sm px-2 sm:px-4">
                <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('advancedFilters.tabs.features')}</span>
                <span className="sm:hidden">{t('advancedFilters.tabs.featuresShort')}</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg text-xs sm:text-sm px-2 sm:px-4">
                <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('advancedFilters.tabs.saved')}</span>
                <span className="sm:hidden">{t('advancedFilters.tabs.savedShort')}</span>
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[280px] sm:h-[420px] w-full pr-2 sm:pr-4 touch-pan-y overscroll-contain">
              {/* Basic Tab */}
              <TabsContent value="basic" className="space-y-8 mt-0">
                {/* Price Range */}
                <div className="group bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-2.5 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg sm:rounded-xl">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <Label className="text-lg sm:text-xl font-bold text-slate-900">
                      {t('advancedFilters.price.title')}
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                        {t('advancedFilters.price.minPrice')}
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          value={filters.priceMin}
                          onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                          className="h-14 pl-4 pr-12 bg-white/70 backdrop-blur-sm border-slate-200/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 text-lg font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₾</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
                        {t('advancedFilters.price.maxPrice')}
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="∞"
                          value={filters.priceMax}
                          onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                          className="h-14 pl-4 pr-12 bg-white/70 backdrop-blur-sm border-slate-200/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 text-lg font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₾</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Area */}
                <div className="group bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-emerald-400/30 transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-lg sm:rounded-xl">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    <Label className="text-lg sm:text-xl font-bold text-slate-900">
                      {t('advancedFilters.area.title')}
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                        {t('advancedFilters.area.minArea')}
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          value={filters.areaMin}
                          onChange={(e) => setFilters({...filters, areaMin: e.target.value})}
                          className="h-14 pl-4 pr-12 bg-white/70 backdrop-blur-sm border-slate-200/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl transition-all duration-300 text-lg font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">m²</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"></div>
                        {t('advancedFilters.area.maxArea')}
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="∞"
                          value={filters.areaMax}
                          onChange={(e) => setFilters({...filters, areaMax: e.target.value})}
                          className="h-14 pl-4 pr-12 bg-white/70 backdrop-blur-sm border-slate-200/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl transition-all duration-300 text-lg font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">m²</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-100">
                  <Label className="text-base sm:text-lg font-bold mb-4 sm:mb-6 block text-slate-900">
                    {t('advancedFilters.rooms.title')}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">{t('advancedFilters.rooms.rooms')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="h-10 sm:h-12 w-full justify-between text-xs sm:text-sm border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-lg sm:rounded-xl transition-colors font-normal"
                          >
                            {Array.isArray(filters.rooms) && filters.rooms.length > 0 ? (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Home className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                {filters.rooms.length === 1 
                                  ? filters.rooms[0] 
                                  : `${filters.rooms.length} ${t('advancedFilters.rooms.selected')}`
                                }
                              </div>
                            ) : (
                              t('advancedFilters.rooms.chooseRooms')
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder={t('advancedFilters.rooms.searchRooms')} />
                            <CommandList>
                              <CommandEmpty>{t('advancedFilters.rooms.noRoomsFound')}</CommandEmpty>
                              <CommandGroup>
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map(room => {
                                  const roomsArray = Array.isArray(filters.rooms) ? filters.rooms : [];
                                  const isSelected = roomsArray.includes(room);
                                  
                                  return (
                                    <CommandItem
                                      key={room}
                                      value={room}
                                      onSelect={() => {
                                        const currentRooms = Array.isArray(filters.rooms) ? filters.rooms : [];
                                        let newRooms;
                                        if (isSelected) {
                                          newRooms = currentRooms.filter(r => r !== room);
                                        } else {
                                          newRooms = [...currentRooms, room];
                                        }
                                        setFilters({...filters, rooms: newRooms});
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        className="mr-2"
                                      />
                                      <Home className="mr-2 h-4 w-4 text-primary" />
                                      <span>{room}</span>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">{t('advancedFilters.rooms.bedrooms')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="h-10 sm:h-12 w-full justify-between text-xs sm:text-sm border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-lg sm:rounded-xl transition-colors font-normal"
                          >
                            {Array.isArray(filters.bedrooms) && filters.bedrooms.length > 0 ? (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                {filters.bedrooms.length === 1 
                                  ? filters.bedrooms[0] 
                                  : `${filters.bedrooms.length} ${t('advancedFilters.rooms.selected')}`
                                }
                              </div>
                            ) : (
                              t('advancedFilters.rooms.chooseBedrooms')
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder={t('advancedFilters.rooms.searchBedrooms')} />
                            <CommandList>
                              <CommandEmpty>{t('advancedFilters.rooms.noBedroomsFound')}</CommandEmpty>
                              <CommandGroup>
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map(bedroom => {
                                  const bedroomsArray = Array.isArray(filters.bedrooms) ? filters.bedrooms : [];
                                  const isSelected = bedroomsArray.includes(bedroom);
                                  
                                  return (
                                    <CommandItem
                                      key={bedroom}
                                      value={bedroom}
                                      onSelect={() => {
                                        const currentBedrooms = Array.isArray(filters.bedrooms) ? filters.bedrooms : [];
                                        let newBedrooms;
                                        if (isSelected) {
                                          newBedrooms = currentBedrooms.filter(b => b !== bedroom);
                                        } else {
                                          newBedrooms = [...currentBedrooms, bedroom];
                                        }
                                        setFilters({...filters, bedrooms: newBedrooms});
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        className="mr-2"
                                      />
                                      <Building2 className="mr-2 h-4 w-4 text-primary" />
                                      <span>{bedroom}</span>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">{t('advancedFilters.rooms.bathrooms')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="h-10 sm:h-12 w-full justify-between text-xs sm:text-sm border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-lg sm:rounded-xl transition-colors font-normal"
                          >
                            {Array.isArray(filters.bathrooms) && filters.bathrooms.length > 0 ? (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                {filters.bathrooms.length === 1 
                                  ? (filters.bathrooms[0] === 'shared' ? t('advancedFilters.rooms.shared') : filters.bathrooms[0])
                                  : `${filters.bathrooms.length} ${t('advancedFilters.rooms.selected')}`
                                }
                              </div>
                            ) : (
                              t('advancedFilters.rooms.chooseBathrooms')
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder={t('advancedFilters.rooms.searchBathrooms')} />
                            <CommandList>
                              <CommandEmpty>{t('advancedFilters.rooms.noBathroomsFound')}</CommandEmpty>
                              <CommandGroup>
                                {['1', '2', '3+', 'shared'].map(bathroom => {
                                  const bathroomsArray = Array.isArray(filters.bathrooms) ? filters.bathrooms : [];
                                  const isSelected = bathroomsArray.includes(bathroom);
                                  const displayLabel = bathroom === 'shared' ? t('advancedFilters.rooms.shared') : bathroom;
                                  
                                  return (
                                    <CommandItem
                                      key={bathroom}
                                      value={bathroom}
                                      onSelect={() => {
                                        const currentBathrooms = Array.isArray(filters.bathrooms) ? filters.bathrooms : [];
                                        let newBathrooms;
                                        if (isSelected) {
                                          newBathrooms = currentBathrooms.filter(b => b !== bathroom);
                                        } else {
                                          newBathrooms = [...currentBathrooms, bathroom];
                                        }
                                        setFilters({...filters, bathrooms: newBathrooms});
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        className="mr-2"
                                      />
                                      <Droplets className="mr-2 h-4 w-4 text-primary" />
                                      <span>{displayLabel}</span>
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
                </div>

                {/* Daily Rental Subcategory - Only show when daily rental is selected in main filter */}
                {transactionType === 'daily' && (
                  <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                    <Label className="text-lg font-bold mb-4 block text-slate-900">
                      {t('advancedFilters.dailyRental.title')}
                    </Label>
                    <div className="space-y-2">
                      <Select value={filters.dailyRentalSubcategory || "all"} onValueChange={(value) => setFilters({...filters, dailyRentalSubcategory: value})}>
                        <SelectTrigger className="h-10 sm:h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 text-xs sm:text-sm">
                          <SelectValue placeholder={t('advancedFilters.dailyRental.chooseType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {dailyRentalSubcategories.map((subcategory) => (
                            <SelectItem key={subcategory.value} value={subcategory.value}>
                              {subcategory.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

              </TabsContent>

              {/* Building Tab */}
              <TabsContent value="building" className="space-y-4 sm:space-y-6 mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Total Floors */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.building.totalFloors')}</Label>
                    <Select value={filters.totalFloors} onValueChange={(value) => setFilters({...filters, totalFloors: value})}>
                      <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm">
                        <SelectValue placeholder={t('common.chooseType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('filters.transactionTypes.all')}</SelectItem>
                        <SelectItem value="1-3">{t('advancedFilters.building.floors13')}</SelectItem>
                        <SelectItem value="4-9">{t('advancedFilters.building.floors49')}</SelectItem>
                        <SelectItem value="10-16">{t('advancedFilters.building.floors1016')}</SelectItem>
                        <SelectItem value="17+">{t('advancedFilters.building.floors17plus')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Building Status */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.building.buildingStatus')}</Label>
                    <Select value={filters.buildingStatus} onValueChange={(value) => setFilters({...filters, buildingStatus: value})}>
                      <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm">
                        <SelectValue placeholder={t('common.chooseType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {buildingStatusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Construction Year */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.building.constructionYear')}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">{t('advancedFilters.building.from')}</Label>
                      <Input
                        type="number"
                        placeholder="1950"
                        value={filters.constructionYearMin}
                        onChange={(e) => setFilters({...filters, constructionYearMin: e.target.value})}
                        className="h-10 sm:h-11 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">{t('advancedFilters.building.to')}</Label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={filters.constructionYearMax}
                        onChange={(e) => setFilters({...filters, constructionYearMax: e.target.value})}
                        className="h-10 sm:h-11 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Condition */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.building.condition')}</Label>
                    <Select value={filters.condition} onValueChange={(value) => setFilters({...filters, condition: value})}>
                      <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm">
                        <SelectValue placeholder={t('common.chooseType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Project Type */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.building.projectType')}</Label>
                    <Select value={filters.projectType} onValueChange={(value) => setFilters({...filters, projectType: value})}>
                      <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm">
                        <SelectValue placeholder={t('common.chooseType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ceiling Height */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.building.ceilingHeight')}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">{t('advancedFilters.building.minimum')}</Label>
                      <Input
                        type="number"
                        placeholder="2.0"
                        step="0.1"
                        value={filters.ceilingHeightMin}
                        onChange={(e) => setFilters({...filters, ceilingHeightMin: e.target.value})}
                        className="h-10 sm:h-11 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">{t('advancedFilters.building.maximum')}</Label>
                      <Input
                        type="number"
                        placeholder="4.0"
                        step="0.1"
                        value={filters.ceilingHeightMax}
                        onChange={(e) => setFilters({...filters, ceilingHeightMax: e.target.value})}
                        className="h-10 sm:h-11 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Building Material */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.building.buildingMaterial')}</Label>
                  <Select value={filters.buildingMaterial} onValueChange={(value) => setFilters({...filters, buildingMaterial: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={t('common.chooseType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingMaterialOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="space-y-4 sm:space-y-8 mt-0">
                <div className="bg-slate-50/50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-100">
                  <Label className="text-base sm:text-lg font-bold mb-4 sm:mb-6 block text-slate-900">
                    {t('advancedFilters.amenities.systemsTitle')}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-primary" />
                        {t('advancedFilters.amenities.heating')}
                      </Label>
                      <Select value={filters.heating} onValueChange={(value) => setFilters({...filters, heating: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder={t('common.chooseType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {heatingOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary" />
                        {t('advancedFilters.amenities.parking')}
                      </Label>
                      <Select value={filters.parking} onValueChange={(value) => setFilters({...filters, parking: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder={t('common.chooseType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {parkingOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Hot Water */}
                <div className="bg-slate-50/50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-100">
                  <Label className="text-base sm:text-lg font-bold mb-3 sm:mb-4 block text-slate-900 flex items-center gap-2">
                    <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    {t('advancedFilters.amenities.hotWater')}
                  </Label>
                  <div className="space-y-2">
                    <Select value={filters.hotWater} onValueChange={(value) => setFilters({...filters, hotWater: value})}>
                      <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                        <SelectValue placeholder={t('common.chooseType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {hotWaterOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boolean Amenities */}
                <div className="bg-slate-50/50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-100">
                  <Label className="text-base sm:text-lg font-bold mb-4 sm:mb-6 block text-slate-900">
                    {t('advancedFilters.amenities.additionalComfort')}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasBalcony"
                          checked={filters.hasBalcony}
                          onCheckedChange={(checked) => setFilters({...filters, hasBalcony: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasBalcony" className="text-sm font-medium cursor-pointer">{t('advancedFilters.amenities.balcony')}</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasPool"
                          checked={filters.hasPool}
                          onCheckedChange={(checked) => setFilters({...filters, hasPool: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasPool" className="text-sm font-medium cursor-pointer">{t('advancedFilters.amenities.pool')}</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasLivingRoom"
                          checked={filters.hasLivingRoom}
                          onCheckedChange={(checked) => setFilters({...filters, hasLivingRoom: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasLivingRoom" className="text-sm font-medium cursor-pointer">{t('advancedFilters.amenities.livingRoom')}</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasLoggia"
                          checked={filters.hasLoggia}
                          onCheckedChange={(checked) => setFilters({...filters, hasLoggia: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasLoggia" className="text-sm font-medium cursor-pointer">{t('advancedFilters.amenities.loggia')}</Label>
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasVeranda"
                          checked={filters.hasVeranda}
                          onCheckedChange={(checked) => setFilters({...filters, hasVeranda: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasVeranda" className="text-sm font-medium cursor-pointer">{t('advancedFilters.amenities.veranda')}</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasYard"
                          checked={filters.hasYard}
                          onCheckedChange={(checked) => setFilters({...filters, hasYard: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasYard" className="text-sm font-medium cursor-pointer">{t('advancedFilters.amenities.yard')}</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasStorage"
                          checked={filters.hasStorage}
                          onCheckedChange={(checked) => setFilters({...filters, hasStorage: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasStorage" className="text-sm font-medium cursor-pointer">{t('advancedFilters.amenities.storage')}</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4 sm:space-y-6 mt-0">
                {/* Features */}
                <div>
                  <Label className="text-base font-semibold mb-4 block text-slate-800">{t('advancedFilters.features.title')}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {commonFeatures.map(feature => (
                      <div key={feature} className="flex items-center space-x-2 sm:space-x-3">
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={filters.selectedFeatures.includes(feature)}
                          onCheckedChange={(checked) => {
                            const newFeatures = checked 
                              ? [...filters.selectedFeatures, feature]
                              : filters.selectedFeatures.filter(f => f !== feature);
                            setFilters({...filters, selectedFeatures: newFeatures});
                          }}
                        />
                        <Label htmlFor={`feature-${feature}`} className="text-xs sm:text-sm font-medium cursor-pointer">{feature}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Advantages */}
                <div>
                  <Label className="text-base font-semibold mb-4 block text-slate-800">{t('advancedFilters.advantages.title')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {commonAdvantages.map(advantage => (
                      <div key={advantage} className="flex items-center space-x-3">
                        <Checkbox
                          id={`advantage-${advantage}`}
                          checked={filters.selectedAdvantages.includes(advantage)}
                          onCheckedChange={(checked) => {
                            const newAdvantages = checked 
                              ? [...filters.selectedAdvantages, advantage]
                              : filters.selectedAdvantages.filter(a => a !== advantage);
                            setFilters({...filters, selectedAdvantages: newAdvantages});
                          }}
                        />
                        <Label htmlFor={`advantage-${advantage}`} className="text-xs sm:text-sm font-medium cursor-pointer">{advantage}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Furniture & Appliances */}
                <div>
                  <Label className="text-base font-semibold mb-4 block text-slate-800">{t('advancedFilters.furniture.title')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {commonFurniture.map(furniture => (
                      <div key={furniture} className="flex items-center space-x-3">
                        <Checkbox
                          id={`furniture-${furniture}`}
                          checked={filters.selectedFurnitureAppliances.includes(furniture)}
                          onCheckedChange={(checked) => {
                            const newFurniture = checked 
                              ? [...filters.selectedFurnitureAppliances, furniture]
                              : filters.selectedFurnitureAppliances.filter(f => f !== furniture);
                            setFilters({...filters, selectedFurnitureAppliances: newFurniture});
                          }}
                        />
                        <Label htmlFor={`furniture-${furniture}`} className="text-xs sm:text-sm font-medium cursor-pointer">{furniture}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Saved Filters Tab */}
              <TabsContent value="saved" className="space-y-4 sm:space-y-6 mt-0">
                <div className="space-y-4">
                  {/* Save Current Filter */}
                  {activeFiltersCount > 0 && (
                    <div className="p-4 border border-dashed border-slate-300 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-semibold text-slate-800">{t('advancedFilters.saved.saveCurrent')}</Label>
                        <Badge variant="secondary">{activeFiltersCount} {t('advancedFilters.saved.filters')}</Badge>
                      </div>
                      {showSaveInput ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder={t('advancedFilters.saved.filterNamePlaceholder')}
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleSaveFilter} size="sm">
                            {t('common.save')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowSaveInput(false)}
                          >
                            {t('common.cancel')}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowSaveInput(true)}
                        >
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          {t('advancedFilters.saved.saveFilter')}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Saved Filters List */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">{t('advancedFilters.saved.savedFiltersTitle')}</Label>
                    {savedFilters.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Bookmark className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p>{t('advancedFilters.saved.noSavedFilters')}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {savedFilters.map(savedFilter => (
                          <div key={savedFilter.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                            <div className="flex-1">
                              <div className="font-medium">{savedFilter.name}</div>
                              <div className="text-sm text-slate-500">
                                {savedFilter.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLoadSavedFilter(savedFilter)}
                              >
                                {t('advancedFilters.saved.load')}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteSavedFilter(savedFilter.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 border-t bg-gradient-to-r from-slate-50 to-slate-100/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 order-2 sm:order-1">
            <Button 
              variant="outline"
              onClick={handleClearAllFilters}
              className="flex items-center justify-center gap-2 h-10 sm:h-11 px-3 sm:px-4 w-full sm:w-auto border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm sm:text-base"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('advancedFilters.actions.clearAll')}</span>
              <span className="sm:hidden">{t('advancedFilters.actions.clear')}</span>
            </Button>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-2 sm:px-4 py-1 sm:py-2 bg-primary/10 text-primary border-primary/20 font-medium text-xs sm:text-sm">
                  <span className="hidden sm:inline">{activeFiltersCount} {t('advancedFilters.actions.filtersApplied')}</span>
                  <span className="sm:hidden">{activeFiltersCount} {t('advancedFilters.saved.filters')}</span>
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 sm:gap-3 order-1 sm:order-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 sm:flex-none h-10 sm:h-11 px-4 sm:px-6 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm sm:text-base"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={() => {
                console.log('🚀 BUTTON CLICKED! Starting handleApplyFilters...');
                handleApplyFilters();
              }}
              className="flex-1 sm:flex-none h-10 sm:h-11 px-4 sm:px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all duration-200 sm:min-w-48 text-sm sm:text-base"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t('common.search')}
            </Button>
          </div>
        </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
