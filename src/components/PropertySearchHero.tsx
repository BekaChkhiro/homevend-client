import { Search, MapPin, Home, CreditCard, Building2, Warehouse, TreePine, Factory, Hotel, Coins, X, SlidersHorizontal, Filter, Car, Thermometer, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { transactionTypes, propertyTypes } from "@/pages/Home/components/FilterTypes";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const buildingStatusOptions = [
  { value: "all", label: "ყველა" },
  { value: "ახალი აშენება", label: "ახალი აშენება" },
  { value: "მშენებარე", label: "მშენებარე" },
  { value: "ექსისტინგი", label: "არსებული" },
  { value: "რეკონსტრუქცია", label: "რეკონსტრუქცია" }
];

const conditionOptions = [
  { value: "all", label: "ყველა" },
  { value: "ახალი", label: "ახალი" },
  { value: "კარგი", label: "კარგი" },
  { value: "საშუალო", label: "საშუალო" },
  { value: "საჭიროებს რემონტს", label: "საჭიროებს რემონტს" },
  { value: "ძველი რემონტი", label: "ძველი რემონტი" }
];

const heatingOptions = [
  { value: "all", label: "ყველა" },
  { value: "ცენტრალური", label: "ცენტრალური" },
  { value: "ავტონომიური", label: "ავტონომიური" },
  { value: "კონდიციონერი", label: "კონდიციონერი" },
  { value: "ერთჯერადი", label: "ერთჯერადი" },
  { value: "არ არის", label: "არ არის" }
];

const parkingOptions = [
  { value: "all", label: "ყველა" },
  { value: "კერძო ზოვი", label: "კერძო ზოვი" },
  { value: "გარაჟი", label: "გარაჟი" },
  { value: "ქუჩაში", label: "ქუჩაში" },
  { value: "არ არის", label: "არ არის" }
];

const hotWaterOptions = [
  { value: "all", label: "ყველა" },
  { value: "ცენტრალური", label: "ცენტრალური" },
  { value: "ელექტრო", label: "ელექტრო" },
  { value: "გაზი", label: "გაზი" },
  { value: "არ არის", label: "არ არის" }
];

const buildingMaterialOptions = [
  { value: "all", label: "ყველა" },
  { value: "ბეტონი", label: "ბეტონი" },
  { value: "აგური", label: "აგური" },
  { value: "ბლოკი", label: "ბლოკი" },
  { value: "ხე", label: "ხე" },
  { value: "კომბინირებული", label: "კომბინირებული" }
];

const projectTypeOptions = [
  { value: "all", label: "ყველა" },
  { value: "ქრუშოვკა", label: "ქრუშოვკა" },
  { value: "ბრეჟნევკა", label: "ბრეჟნევკა" },
  { value: "სტალინკა", label: "სტალინკა" },
  { value: "ახალი პროექტი", label: "ახალი პროექტი" },
  { value: "კერძო სახლი", label: "კერძო სახლი" }
];

// Common feature options - these would ideally come from the backend
const commonFeatures = [
  "ლიფტი", "კონდიციონერი", "ინტერნეტი", "კაბელური ტელევიზია", 
  "უსაფრთხოების სისტემა", "ვიდეო ზედამხედველობა", "კონსიერჟი",
  "სარეცხი მანქანა", "ჭურჭლის საბანელი მანქანა"
];

const commonAdvantages = [
  "ცენტრში", "მეტროსთან ახლოს", "მშვიდი რაიონი", "განვითარებული ინფრასტრუქტურა",
  "პარკთან ახლოს", "სკოლასთან ახლოს", "სავაჭრო ცენტრთან ახლოს", "ავტობუსის გაჩერებასთან ახლოს"
];

const commonFurniture = [
  "კარადა", "საწოლი", "მაცივარი", "ღუმელი", "სარეცხი მანქანა", 
  "ტელევიზორი", "მიკროტალღური", "ჭურჭლის საბანელი", "დივანი", "მაგიდა"
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
}

export const PropertySearchHero = ({ onSearch }: PropertySearchHeroProps) => {
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

  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);

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

  const additionalFiltersCount = [
    filters.priceMin !== "",
    filters.priceMax !== "",
    filters.areaMin !== "",
    filters.areaMax !== "",
    filters.bedrooms !== "all",
    filters.bathrooms !== "all",
    filters.location !== "",
    filters.rooms !== "all",
    filters.totalFloors !== "all",
    filters.buildingStatus !== "all",
    filters.constructionYearMin !== "",
    filters.constructionYearMax !== "",
    filters.condition !== "all",
    filters.projectType !== "all",
    filters.ceilingHeightMin !== "",
    filters.ceilingHeightMax !== "",
    filters.heating !== "all",
    filters.parking !== "all",
    filters.hotWater !== "all",
    filters.buildingMaterial !== "all",
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

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 mx-auto">
          <div className="flex gap-4">
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

            {/* Additional Filters Button */}
            <div className="w-2/12 flex flex-col justify-end">
              <DropdownMenu open={showAdditionalFilters} onOpenChange={setShowAdditionalFilters} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-12 border-2 border-slate-300 hover:border-primary/50 rounded-xl transition-all duration-300 relative"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    დამატებითი
                    {additionalFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {additionalFiltersCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[600px] p-0" align="end" side="bottom" sideOffset={8}>
                  <Card className="border-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg">დამატებითი ფილტრები</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="basic">ძირითადი</TabsTrigger>
                          <TabsTrigger value="building">შენობა</TabsTrigger>
                          <TabsTrigger value="amenities">კომფორტი</TabsTrigger>
                          <TabsTrigger value="features">მახასიათებლები</TabsTrigger>
                        </TabsList>
                        
                        {/* Basic Tab */}
                        <TabsContent value="basic" className="space-y-4 mt-4">
                          {/* Price Range */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">ფასი (ლარი)</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="მინ"
                                value={filters.priceMin}
                                onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                              />
                              <Input
                                type="number"
                                placeholder="მაქს"
                                value={filters.priceMax}
                                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                              />
                            </div>
                          </div>

                          {/* Area */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">ფართობი (მ²)</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="მინ"
                                value={filters.areaMin}
                                onChange={(e) => setFilters({...filters, areaMin: e.target.value})}
                              />
                              <Input
                                type="number"
                                placeholder="მაქს"
                                value={filters.areaMax}
                                onChange={(e) => setFilters({...filters, areaMax: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Rooms */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">ოთახები</Label>
                              <Select value={filters.rooms} onValueChange={(value) => setFilters({...filters, rooms: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="რაოდენობა" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">ყველა</SelectItem>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5+</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Bedrooms */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">საძინებლები</Label>
                              <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="რაოდენობა" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">ყველა</SelectItem>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5+</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            {/* Bathrooms */}
                            <Label className="text-sm font-medium mb-2 block">სააბაზანოები</Label>
                            <Select value={filters.bathrooms} onValueChange={(value) => setFilters({...filters, bathrooms: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="რაოდენობა" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ყველა</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Location/District */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">რაიონი/უბანი</Label>
                            <Input
                              type="text"
                              placeholder="შეიყვანეთ რაიონი ან უბანი"
                              value={filters.location}
                              onChange={(e) => setFilters({...filters, location: e.target.value})}
                            />
                          </div>
                        </TabsContent>

                        {/* Building Tab */}
                        <TabsContent value="building" className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Total Floors */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">სულ სართული</Label>
                              <Select value={filters.totalFloors} onValueChange={(value) => setFilters({...filters, totalFloors: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="არჩევა" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">ყველა</SelectItem>
                                  <SelectItem value="1-3">1-3 სართული</SelectItem>
                                  <SelectItem value="4-9">4-9 სართული</SelectItem>
                                  <SelectItem value="10-16">10-16 სართული</SelectItem>
                                  <SelectItem value="17+">17+ სართული</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Building Status */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">შენობის სტატუსი</Label>
                              <Select value={filters.buildingStatus} onValueChange={(value) => setFilters({...filters, buildingStatus: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="არჩევა" />
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
                            <Label className="text-sm font-medium mb-2 block">მშენებლობის წელი</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="დან"
                                value={filters.constructionYearMin}
                                onChange={(e) => setFilters({...filters, constructionYearMin: e.target.value})}
                              />
                              <Input
                                type="number"
                                placeholder="მდე"
                                value={filters.constructionYearMax}
                                onChange={(e) => setFilters({...filters, constructionYearMax: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Condition */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">მდგომარეობა</Label>
                              <Select value={filters.condition} onValueChange={(value) => setFilters({...filters, condition: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="არჩევა" />
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
                              <Label className="text-sm font-medium mb-2 block">პროექტის ტიპი</Label>
                              <Select value={filters.projectType} onValueChange={(value) => setFilters({...filters, projectType: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="არჩევა" />
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
                            <Label className="text-sm font-medium mb-2 block">ჭერის სიმაღლე (მ)</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="მინ"
                                step="0.1"
                                value={filters.ceilingHeightMin}
                                onChange={(e) => setFilters({...filters, ceilingHeightMin: e.target.value})}
                              />
                              <Input
                                type="number"
                                placeholder="მაქს"
                                step="0.1"
                                value={filters.ceilingHeightMax}
                                onChange={(e) => setFilters({...filters, ceilingHeightMax: e.target.value})}
                              />
                            </div>
                          </div>

                          {/* Building Material */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">სამშენებლო მასალა</Label>
                            <Select value={filters.buildingMaterial} onValueChange={(value) => setFilters({...filters, buildingMaterial: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="არჩევა" />
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
                        <TabsContent value="amenities" className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Heating */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                                <Thermometer className="h-4 w-4" />
                                გათბობა
                              </Label>
                              <Select value={filters.heating} onValueChange={(value) => setFilters({...filters, heating: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="არჩევა" />
                                </SelectTrigger>
                                <SelectContent>
                                  {heatingOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Parking */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                პარკინგი
                              </Label>
                              <Select value={filters.parking} onValueChange={(value) => setFilters({...filters, parking: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="არჩევა" />
                                </SelectTrigger>
                                <SelectContent>
                                  {parkingOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Hot Water */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                              <Droplets className="h-4 w-4" />
                              ცხელი წყალი
                            </Label>
                            <Select value={filters.hotWater} onValueChange={(value) => setFilters({...filters, hotWater: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="არჩევა" />
                              </SelectTrigger>
                              <SelectContent>
                                {hotWaterOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Boolean Amenities */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">დამატებითი კომფორტი</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hasBalcony"
                                  checked={filters.hasBalcony}
                                  onCheckedChange={(checked) => setFilters({...filters, hasBalcony: !!checked})}
                                />
                                <Label htmlFor="hasBalcony" className="text-sm">აივანი</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hasPool"
                                  checked={filters.hasPool}
                                  onCheckedChange={(checked) => setFilters({...filters, hasPool: !!checked})}
                                />
                                <Label htmlFor="hasPool" className="text-sm">აუზი</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hasLivingRoom"
                                  checked={filters.hasLivingRoom}
                                  onCheckedChange={(checked) => setFilters({...filters, hasLivingRoom: !!checked})}
                                />
                                <Label htmlFor="hasLivingRoom" className="text-sm">მისაღები</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hasLoggia"
                                  checked={filters.hasLoggia}
                                  onCheckedChange={(checked) => setFilters({...filters, hasLoggia: !!checked})}
                                />
                                <Label htmlFor="hasLoggia" className="text-sm">ლოჯია</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hasVeranda"
                                  checked={filters.hasVeranda}
                                  onCheckedChange={(checked) => setFilters({...filters, hasVeranda: !!checked})}
                                />
                                <Label htmlFor="hasVeranda" className="text-sm">ვერანდა</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hasYard"
                                  checked={filters.hasYard}
                                  onCheckedChange={(checked) => setFilters({...filters, hasYard: !!checked})}
                                />
                                <Label htmlFor="hasYard" className="text-sm">ეზო</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hasStorage"
                                  checked={filters.hasStorage}
                                  onCheckedChange={(checked) => setFilters({...filters, hasStorage: !!checked})}
                                />
                                <Label htmlFor="hasStorage" className="text-sm">საცავი</Label>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Features Tab */}
                        <TabsContent value="features" className="space-y-4 mt-4 max-h-80 overflow-y-auto">
                          {/* Features */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">მახასიათებლები</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {commonFeatures.map(feature => (
                                <div key={feature} className="flex items-center space-x-2">
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
                                  <Label htmlFor={`feature-${feature}`} className="text-sm">{feature}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Advantages */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">უპირატესობები</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {commonAdvantages.map(advantage => (
                                <div key={advantage} className="flex items-center space-x-2">
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
                                  <Label htmlFor={`advantage-${advantage}`} className="text-sm">{advantage}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Furniture & Appliances */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">ავეჯი და ტექნიკა</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {commonFurniture.map(furniture => (
                                <div key={furniture} className="flex items-center space-x-2">
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
                                  <Label htmlFor={`furniture-${furniture}`} className="text-sm">{furniture}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex gap-2 pt-4 border-t mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
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
                              location: "",
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
                          }}
                          className="flex-1"
                        >
                          ყველას გასუფთავება
                        </Button>
                        <Button onClick={handleSearch} size="sm" className="flex-1">
                          ფილტრების გამოყენება
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search and Clear Buttons */}
            <div className="w-2/12 flex flex-col justify-end">
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