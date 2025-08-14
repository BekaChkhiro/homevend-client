import { useState, useEffect } from "react";
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
  RotateCcw
} from "lucide-react";

// Filter options (same as PropertySearchHero)
const transactionTypes = [
  { value: 'all', label: 'ყველა' },
  { value: 'იყიდება', label: 'იყიდება' },
  { value: 'ქირავდება', label: 'ქირავდება' },
  { value: 'გირავდება', label: 'გირავდება' },
  { value: 'გაიცემა იჯარით', label: 'გაიცემა იჯარით' },
  { value: 'ქირავდება დღიურად', label: 'ქირავდება დღიურად' },
  { value: 'ნასყიდობა გამოსყიდობის უფლებით', label: 'ნასყიდობა გამოსყიდობის უფლებით' }
];

const dailyRentalSubcategories = [
  { value: "all", label: "ყველა" },
  { value: "sea", label: "დღიურად ზღვაზე" },
  { value: "mountains", label: "დღიურად მთაში" },
  { value: "villa", label: "აგარაკები დღიურად" }
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

const commonFeatures = [
  "ლიფტი", "კონდიციონერი", "ინტერნეტი", "კაბელური ტელევიზია", 
  "უსაფრთხოების სისტემა", "ვიდეო ზედამხედველობა", "კონსიერჟი",
  "სარეცხი მანქანა", "ჭურჭლის საბანელი მანქანა", "ბუნებრივი გაზი",
  "გაზის ღუმელი", "ელექტრო ღუმელი", "მიკროტალღური", "ცალკე შესასვლელი"
];

const commonAdvantages = [
  "ცენტრში", "მეტროსთან ახლოს", "მშვიდი რაიონი", "განვითარებული ინფრასტრუქტურა",
  "პარკთან ახლოს", "სკოლასთან ახლოს", "სავაჭრო ცენტრთან ახლოს", "ავტობუსის გაჩერებასთან ახლოს",
  "უნივერსიტეტთან ახლოს", "საავადმყოფოსთან ახლოს", "ზღვასთან ახლოს", "მთებთან ახლოს"
];

const commonFurniture = [
  "კარადა", "საწოლი", "მაცივარი", "ღუმელი", "სარეცხი მანქანა", 
  "ტელევიზორი", "მიკროტალღური", "ჭურჭლის საბანელი", "დივანი", "მაგიდა",
  "სკამები", "შრიფტი", "აივნის ავეჯი", "კონდიციონერი", "გამწვავი"
];

interface AdvancedFilterState {
  // Basic filters
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  bedrooms: string;
  bathrooms: string;
  rooms: string;
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
  onApplyFilters: (filters: AdvancedFilterState) => void;
  onClearFilters: () => void;
  totalProperties: number;
  filteredCount: number;
  transactionType?: string;
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
  totalProperties,
  filteredCount,
  transactionType 
}: AdvancedFiltersModalProps) => {
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
      filters.bedrooms !== "all",
      filters.bathrooms !== "all",
      filters.rooms !== "all",
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
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleClearAllFilters = () => {
    const clearedFilters: AdvancedFilterState = {
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
      bedrooms: "all",
      bathrooms: "all",
      rooms: "all",
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
    onClearFilters();
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
        <DialogContent className="max-w-[1368px] mx-auto max-h-[85vh] p-0 left-1/2 right-auto -translate-x-1/2 bottom-0 top-auto data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full data-[state=open]:-translate-x-1/2 data-[state=closed]:-translate-x-1/2 duration-300 ease-out transition-transform shadow-2xl overflow-hidden" style={{ borderRadius: '20px 20px 0px 0px' }}>
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-100">
          <DialogTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">გაფართოებული ფილტრები</h2>
                <p className="text-sm text-slate-600 font-normal">მოძებნეთ იდეალური უძრავი ქონება</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-base font-normal">
              <Badge variant="outline" className="px-4 py-2 bg-white border-slate-200 text-slate-700 font-medium">
                {filteredCount} / {totalProperties} განცხადება
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 px-6 bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-100/80 p-1 rounded-xl h-12">
              <TabsTrigger value="basic" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg">
                <Search className="h-4 w-4 mr-2" />
                ძირითადი
              </TabsTrigger>
              <TabsTrigger value="building" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg">
                <Building2 className="h-4 w-4 mr-2" />
                შენობა
              </TabsTrigger>
              <TabsTrigger value="amenities" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg">
                <Home className="h-4 w-4 mr-2" />
                კომფორტი
              </TabsTrigger>
              <TabsTrigger value="features" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                მახასიათებლები
              </TabsTrigger>
              <TabsTrigger value="saved" className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200 rounded-lg">
                <Bookmark className="h-4 w-4 mr-2" />
                შენახული
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[420px] w-full pr-4">
              {/* Basic Tab */}
              <TabsContent value="basic" className="space-y-8 mt-0">
                {/* Price Range */}
                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <Label className="text-lg font-bold mb-4 block text-slate-900">
                    ფასი (ლარი)
                  </Label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">მინიმალური ფასი</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.priceMin}
                        onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                        className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">მაქსიმალური ფასი</Label>
                      <Input
                        type="number"
                        placeholder="∞"
                        value={filters.priceMax}
                        onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                        className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Area */}
                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <Label className="text-lg font-bold mb-4 block text-slate-900">
                    ფართობი (მ²)
                  </Label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">მინიმალური ფართობი</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.areaMin}
                        onChange={(e) => setFilters({...filters, areaMin: e.target.value})}
                        className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">მაქსიმალური ფართობი</Label>
                      <Input
                        type="number"
                        placeholder="∞"
                        value={filters.areaMax}
                        onChange={(e) => setFilters({...filters, areaMax: e.target.value})}
                        className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <Label className="text-lg font-bold mb-6 block text-slate-900">
                    ოთახების რაოდენობა
                  </Label>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">
                        ოთახები
                      </Label>
                      <Select value={filters.rooms} onValueChange={(value) => setFilters({...filters, rooms: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder="არჩევა" />
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

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">
                        საძინებლები
                      </Label>
                      <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder="არჩევა" />
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

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">
                        სააბაზანოები
                      </Label>
                      <Select value={filters.bathrooms} onValueChange={(value) => setFilters({...filters, bathrooms: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder="არჩევა" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ყველა</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Daily Rental Subcategory - Only show when daily rental is selected in main filter */}
                {transactionType === 'ქირავდება დღიურად' && (
                  <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                    <Label className="text-lg font-bold mb-4 block text-slate-900">
                      დღიური ქირაობის ტიპი
                    </Label>
                    <div className="space-y-2">
                      <Select value={filters.dailyRentalSubcategory || "all"} onValueChange={(value) => setFilters({...filters, dailyRentalSubcategory: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder="აირჩიეთ ტიპი" />
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

                {/* Location */}
                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <Label className="text-lg font-bold mb-4 block text-slate-900">
                    მდებარეობა
                  </Label>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">რაიონი ან უბანი</Label>
                    <Input
                      type="text"
                      placeholder="მთაწმინდა, ვაკე, საბურთალო..."
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Building Tab */}
              <TabsContent value="building" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  {/* Total Floors */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">სულ სართული</Label>
                    <Select value={filters.totalFloors} onValueChange={(value) => setFilters({...filters, totalFloors: value})}>
                      <SelectTrigger className="h-11">
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
                    <Label className="text-base font-semibold mb-3 block text-slate-800">შენობის სტატუსი</Label>
                    <Select value={filters.buildingStatus} onValueChange={(value) => setFilters({...filters, buildingStatus: value})}>
                      <SelectTrigger className="h-11">
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
                  <Label className="text-base font-semibold mb-3 block text-slate-800">მშენებლობის წელი</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">დან</Label>
                      <Input
                        type="number"
                        placeholder="1950"
                        value={filters.constructionYearMin}
                        onChange={(e) => setFilters({...filters, constructionYearMin: e.target.value})}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">მდე</Label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={filters.constructionYearMax}
                        onChange={(e) => setFilters({...filters, constructionYearMax: e.target.value})}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Condition */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">მდგომარეობა</Label>
                    <Select value={filters.condition} onValueChange={(value) => setFilters({...filters, condition: value})}>
                      <SelectTrigger className="h-11">
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
                    <Label className="text-base font-semibold mb-3 block text-slate-800">პროექტის ტიპი</Label>
                    <Select value={filters.projectType} onValueChange={(value) => setFilters({...filters, projectType: value})}>
                      <SelectTrigger className="h-11">
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
                  <Label className="text-base font-semibold mb-3 block text-slate-800">ჭერის სიმაღლე (მ)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">მინიმუმ</Label>
                      <Input
                        type="number"
                        placeholder="2.0"
                        step="0.1"
                        value={filters.ceilingHeightMin}
                        onChange={(e) => setFilters({...filters, ceilingHeightMin: e.target.value})}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600 mb-1 block">მაქსიმუმ</Label>
                      <Input
                        type="number"
                        placeholder="4.0"
                        step="0.1"
                        value={filters.ceilingHeightMax}
                        onChange={(e) => setFilters({...filters, ceilingHeightMax: e.target.value})}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Building Material */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">სამშენებლო მასალა</Label>
                  <Select value={filters.buildingMaterial} onValueChange={(value) => setFilters({...filters, buildingMaterial: value})}>
                    <SelectTrigger className="h-11">
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
              <TabsContent value="amenities" className="space-y-8 mt-0">
                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <Label className="text-lg font-bold mb-6 block text-slate-900">
                    სისტემები და საკომუნიკაციო
                  </Label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-primary" />
                        გათბობა
                      </Label>
                      <Select value={filters.heating} onValueChange={(value) => setFilters({...filters, heating: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder="არჩევა" />
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
                        პარკინგი
                      </Label>
                      <Select value={filters.parking} onValueChange={(value) => setFilters({...filters, parking: value})}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
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
                </div>

                {/* Hot Water */}
                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <Label className="text-lg font-bold mb-4 block text-slate-900 flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    ცხელი წყალი
                  </Label>
                  <div className="space-y-2">
                    <Select value={filters.hotWater} onValueChange={(value) => setFilters({...filters, hotWater: value})}>
                      <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                        <SelectValue placeholder="არჩევა" />
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
                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <Label className="text-lg font-bold mb-6 block text-slate-900">
                    დამატებითი კომფორტი
                  </Label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasBalcony"
                          checked={filters.hasBalcony}
                          onCheckedChange={(checked) => setFilters({...filters, hasBalcony: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasBalcony" className="text-sm font-medium cursor-pointer">აივანი</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasPool"
                          checked={filters.hasPool}
                          onCheckedChange={(checked) => setFilters({...filters, hasPool: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasPool" className="text-sm font-medium cursor-pointer">აუზი</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasLivingRoom"
                          checked={filters.hasLivingRoom}
                          onCheckedChange={(checked) => setFilters({...filters, hasLivingRoom: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasLivingRoom" className="text-sm font-medium cursor-pointer">მისაღები</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasLoggia"
                          checked={filters.hasLoggia}
                          onCheckedChange={(checked) => setFilters({...filters, hasLoggia: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasLoggia" className="text-sm font-medium cursor-pointer">ლოჯია</Label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasVeranda"
                          checked={filters.hasVeranda}
                          onCheckedChange={(checked) => setFilters({...filters, hasVeranda: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasVeranda" className="text-sm font-medium cursor-pointer">ვერანდა</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasYard"
                          checked={filters.hasYard}
                          onCheckedChange={(checked) => setFilters({...filters, hasYard: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasYard" className="text-sm font-medium cursor-pointer">ეზო</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <Checkbox
                          id="hasStorage"
                          checked={filters.hasStorage}
                          onCheckedChange={(checked) => setFilters({...filters, hasStorage: !!checked})}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="hasStorage" className="text-sm font-medium cursor-pointer">საცავი</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6 mt-0">
                {/* Features */}
                <div>
                  <Label className="text-base font-semibold mb-4 block text-slate-800">მახასიათებლები</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {commonFeatures.map(feature => (
                      <div key={feature} className="flex items-center space-x-3">
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
                        <Label htmlFor={`feature-${feature}`} className="text-sm font-medium">{feature}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Advantages */}
                <div>
                  <Label className="text-base font-semibold mb-4 block text-slate-800">უპირატესობები</Label>
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
                        <Label htmlFor={`advantage-${advantage}`} className="text-sm font-medium">{advantage}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Furniture & Appliances */}
                <div>
                  <Label className="text-base font-semibold mb-4 block text-slate-800">ავეჯი და ტექნიკა</Label>
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
                        <Label htmlFor={`furniture-${furniture}`} className="text-sm font-medium">{furniture}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Saved Filters Tab */}
              <TabsContent value="saved" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {/* Save Current Filter */}
                  {activeFiltersCount > 0 && (
                    <div className="p-4 border border-dashed border-slate-300 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-semibold text-slate-800">მიმდინარე ფილტრის შენახვა</Label>
                        <Badge variant="secondary">{activeFiltersCount} ფილტრი</Badge>
                      </div>
                      {showSaveInput ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="ფილტრის სახელი"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleSaveFilter} size="sm">
                            შენახვა
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowSaveInput(false)}
                          >
                            გაუქმება
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowSaveInput(true)}
                        >
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          ფილტრის შენახვა
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Saved Filters List */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-slate-800">შენახული ფილტრები</Label>
                    {savedFilters.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Bookmark className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p>შენახული ფილტრები არ არის</p>
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
                                ჩატვირთვა
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
        <div className="flex items-center justify-between gap-4 p-6 border-t bg-gradient-to-r from-slate-50 to-slate-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={handleClearAllFilters}
              className="flex items-center gap-2 h-11 px-4 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4" />
              ყველას გასუფთავება
            </Button>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-primary/20 font-medium">
                  {activeFiltersCount} ფილტრი გამოყენებულია
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="h-11 px-6 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              გაუქმება
            </Button>
            <Button 
              onClick={handleApplyFilters}
              className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all duration-200 min-w-48"
            >
              <Search className="h-4 w-4 mr-2" />
              ფილტრების გამოყენება ({filteredCount})
            </Button>
          </div>
        </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};