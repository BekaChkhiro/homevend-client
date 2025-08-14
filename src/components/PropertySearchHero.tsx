import { Search, MapPin, Home, CreditCard, Building2, Warehouse, TreePine, Factory, Hotel, Coins, X, SlidersHorizontal, Filter, Car, Thermometer, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { transactionTypes, propertyTypes } from "@/pages/Home/components/FilterTypes";
import { AdvancedFiltersModal } from "@/components/AdvancedFiltersModal";

const cities = [
  { value: "all", label: "ქალაქი" },
  { value: "თბილისი", label: "თბილისი" },
  { value: "ბათუმი", label: "ბათუმი" },
  { value: "ქუთაისი", label: "ქუთაისი" },
  { value: "რუსთავი", label: "რუსთავი" },
  { value: "ზუგდიდი", label: "ზუგდიდი" },
  { value: "თელავი", label: "თელავი" },
  { value: "გორი", label: "გორი" },
  { value: "ბაკურიანი", label: "ბაკურიანი" },
  { value: "ბორჯომი", label: "ბორჯომი" },
  { value: "გუდაური", label: "გუდაური" },
];


interface PropertySearchFilters {
  search: string;
  transactionType: string;
  propertyType: string;
  city: string;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  bedrooms: string;
  bathrooms: string;
  dailyRentalSubcategory: string;
  location: string;
  // Building Details
  rooms: string;
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
  renderAdvancedFilters?: (props: {
    filters: PropertySearchFilters;
    onApplyFilters: (filters: PropertySearchFilters) => void;
    onClearFilters: () => void;
  }) => React.ReactNode;
}

export const PropertySearchHero = ({ onSearch, totalProperties = 0, filteredCount = 0, renderAdvancedFilters }: PropertySearchHeroProps) => {
  const [filters, setFilters] = useState<PropertySearchFilters>({
    search: "",
    transactionType: "all",
    propertyType: "all",
    city: "all",
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
    bedrooms: "all",
    bathrooms: "all",
    dailyRentalSubcategory: "all",
    location: "",
    // Building Details
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


  const handleSearch = () => {
    onSearch(filters);
    setShowAdditionalFilters(false);
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
      propertyType: "all",
      city: "all",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
      bedrooms: "all",
      bathrooms: "all",
      dailyRentalSubcategory: "all",
      location: "",
      // Building Details
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
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const hasActiveFilters = filters.search !== "" || 
    filters.transactionType !== "all" || 
    filters.propertyType !== "all" || 
    filters.city !== "all" ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.areaMin !== "" ||
    filters.areaMax !== "" ||
    filters.bedrooms !== "all" ||
    filters.bathrooms !== "all" ||
    filters.location !== "" ||
    filters.rooms !== "all" ||
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


  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 mx-auto">
          <div className="flex gap-4 items-end">
            {/* Transaction Type */}
            <div className="w-2/12 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <label className="text-xs font-semibold text-slate-700">
                  გარიგების ტიპი
                </label>
              </div>
              <Select 
                value={filters.transactionType} 
                onValueChange={(value) => setFilters({...filters, transactionType: value})}
              >
                <SelectTrigger className="h-12 text-sm border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors">
                  <SelectValue placeholder="აირჩიეთ ტიპი" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {transactionTypes.map((type) => {
                    const getIcon = (value: string) => {
                      switch(value) {
                        case 'იყიდება': return <Coins className="h-4 w-4 text-primary" />;
                        case 'ქირავდება': return <Home className="h-4 w-4 text-primary" />;
                        case 'გირავდება': return <CreditCard className="h-4 w-4 text-primary" />;
                        case 'გაიცემა იჯარით': return <Building2 className="h-4 w-4 text-primary" />;
                        case 'ქირავდება დღიურად': return <Hotel className="h-4 w-4 text-primary" />;
                        case 'ნასყიდობა გამოსყიდობის უფლებით': return <CreditCard className="h-4 w-4 text-primary" />;
                        default: return <CreditCard className="h-4 w-4 text-primary" />;
                      }
                    };
                    return (
                      <SelectItem key={type.value} value={type.value} className="text-base py-3">
                        <div className="flex items-center gap-3">
                          {getIcon(type.value)}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="w-2/12 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <label className="text-xs font-semibold text-slate-700">
                  ქონების ტიპი
                </label>
              </div>
              <Select 
                value={filters.propertyType} 
                onValueChange={(value) => setFilters({...filters, propertyType: value})}
              >
                <SelectTrigger className="h-12 text-sm border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl transition-colors">
                  <SelectValue placeholder="აირჩიეთ ტიპი" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {propertyTypes.map((type) => {
                    const getIcon = (value: string) => {
                      switch(value) {
                        case 'ბინები': return <Building2 className="h-4 w-4 text-primary" />;
                        case 'სახლები': return <Home className="h-4 w-4 text-primary" />;
                        case 'აგარაკები': return <TreePine className="h-4 w-4 text-primary" />;
                        case 'მიწის ნაკვეთები': return <MapPin className="h-4 w-4 text-primary" />;
                        case 'კომერციული ფართები': return <Factory className="h-4 w-4 text-primary" />;
                        case 'სასტუმროები': return <Hotel className="h-4 w-4 text-primary" />;
                        default: return <Home className="h-4 w-4 text-primary" />;
                      }
                    };
                    return (
                      <SelectItem key={type.value} value={type.value} className="text-base py-3">
                        <div className="flex items-center gap-3">
                          {getIcon(type.value)}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Search Input with Integrated City Selection */}
            <div className="w-4/12 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <label className="text-xs font-semibold text-slate-700">
                  მისამართი
                </label>
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="შეიყვანეთ მისამართი, რაიონი..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-base border-2 border-slate-200 hover:border-primary/50 focus:border-primary rounded-xl pl-11 pr-32 transition-colors"
                />

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Select 
                    value={filters.city} 
                    onValueChange={(value) => setFilters({...filters, city: value})}
                  >
                    <SelectTrigger className="h-9 w-36 text-sm border border-slate-300 hover:border-primary/50 focus:border-primary rounded-lg transition-colors bg-white/90 backdrop-blur-sm">
                      <SelectValue placeholder="ქალაქი" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-60 w-48">
                      {cities.map((city) => (
                        <SelectItem key={city.value} value={city.value} className="text-sm py-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>{city.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

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
                const updatedFilters = { ...filters, ...advancedFilters };
                setFilters(updatedFilters);
                onSearch(updatedFilters);
              }}
              onClearFilters={clearAllFilters}
              totalProperties={totalProperties}
              filteredCount={filteredCount}
              transactionType={filters.transactionType}
            />

            {/* Search and Clear Buttons */}
            <div className="w-3/12 flex flex-col justify-end">
              {hasActiveFilters ? (
                <div className="grid grid-cols-10 gap-2">
                  <Button 
                    onClick={handleSearch}
                    size="lg" 
                    className="group h-12 col-span-7 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
                  >
                    <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    ძიება
                  </Button>
                  
                  <Button 
                    onClick={clearAllFilters}
                    variant="outline" 
                    size="lg"
                    className="h-12 col-span-3 flex items-center justify-center border border-slate-300 hover:bg-slate-100 rounded-xl transition-all duration-300"
                    aria-label="გასუფთავება"
                  >
                    <X className="h-6 w-6 text-red-500" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleSearch}
                  size="lg" 
                  className="group h-12 w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
                >
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  ძიება
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};