import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { FilterState } from "@/pages/Index";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (filterKey: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) => {
  // Helper function to get Georgian labels for filter values
  const getTransactionTypeLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'sale': 'იყიდება',
      'rent': 'ქირავდება',
      'mortgage': 'გირავდება',
      'lease': 'გაიცემა იჯარით',
      'daily': 'ქირავდება დღიურად',
      'rent-to-buy': 'ნასყიდობა გამოსყიდობის უფლებით'
    };
    return mapping[value] || value;
  };

  const getPropertyTypeLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'apartment': 'ბინები',
      'house': 'სახლები',
      'cottage': 'აგარაკები',
      'land': 'მიწის ნაკვეთები',
      'commercial': 'კომერციული ფართები',
      'office': 'საოფისე ფართები',
      'hotel': 'სასტუმროები'
    };
    return mapping[value] || value;
  };

  const getConditionLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'newly-renovated': 'ახალი გარემონტებული',
      'old-renovated': 'ძველი გარემონტებული',
      'ongoing-renovation': 'მიმდინარე რემონტი',
      'needs-renovation': 'სარემონტო',
      'white-frame': 'თეთრი კარკასი',
      'black-frame': 'შავი კარკასი',
      'green-frame': 'მწვანე კარკასი',
      'white-plus': 'თეთრი პლიუსი'
    };
    return mapping[value] || value;
  };

  const getHeatingLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'central-heating': 'ცენტრალური გათბობა',
      'gas-heater': 'გაზის გამათბობელი',
      'electric-heater': 'დენის გამათბობელი',
      'central-floor': 'ცენტრალური+იატაკის გათბობა',
      'no-heating': 'გათბობის გარეშე',
      'individual': 'ინდივიდუალური',
      'floor-heating': 'იატაკის გათბობა'
    };
    return mapping[value] || value;
  };

  const getBuildingStatusLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'old-built': 'ძველი აშენებული',
      'new-built': 'ახალი აშენებული',
      'under-construction': 'მშენებარე'
    };
    return mapping[value] || value;
  };

  const getParkingLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'garage': 'ავტოფარეხი',
      'parking-space': 'პარკინგის ადგილი',
      'yard-parking': 'ეზოს პარკინგი',
      'underground-parking': 'მიწისქვეშა პარკინგი',
      'paid-parking': 'ფასიანი ავტოსადგომი',
      'no-parking': 'პარკინგის გარეშე'
    };
    return mapping[value] || value;
  };

  const getProjectTypeLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'non-standard': 'არასტანდარტული',
      'villa': 'ვილა',
      'townhouse': 'თაუნჰაუსი'
    };
    return mapping[value] || value;
  };

  const getBuildingMaterialLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'block': 'ბლოკი',
      'brick': 'აგური',
      'wood': 'ხის მასალა',
      'reinforced-concrete': 'რკინა-ბეტონი',
      'combined': 'კომბინირებული'
    };
    return mapping[value] || value;
  };

  const getHotWaterLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'gas-water-heater': 'გაზის გამაცხელებელი',
      'boiler': 'ავზი',
      'electric-water-heater': 'დენის გამაცხელებელი',
      'solar-heater': 'მზის გამაცხელებელი',
      'no-hot-water': 'ცხელი წყლის გარეშე',
      'central-hot-water': 'ცენტრალური ცხელი წყალი',
      'natural-hot-water': 'ბუნებრივი ცხელი წყალი',
      'individual': 'ინდივიდუალური'
    };
    return mapping[value] || value;
  };

  const getDailyRentalLabel = (value: string): string => {
    const mapping: { [key: string]: string } = {
      'sea': 'ზღვასთან დღიური ქირაობა',
      'mountains': 'მთაში დღიური ქირაობა',
      'villa': 'დღიური ვილები'
    };
    return mapping[value] || value;
  };

  // Collect all active filters
  const activeFilters: Array<{ key: string; label: string; value: string }> = [];

  // Basic filters
  if (filters.search) {
    activeFilters.push({ key: 'search', label: 'ძიება', value: filters.search });
  }
  if (filters.location && filters.location !== filters.search) {
    activeFilters.push({ key: 'location', label: 'მდებარეობა', value: filters.location });
  } else if (filters.city && filters.city !== 'all') {
    activeFilters.push({ key: 'city', label: 'ქალაქი', value: filters.city });
  }
  if (filters.transactionType && filters.transactionType !== 'all') {
    activeFilters.push({ 
      key: 'transactionType', 
      label: 'გარიგების ტიპი', 
      value: getTransactionTypeLabel(filters.transactionType) 
    });
  }
  if (filters.propertyType) {
    if (Array.isArray(filters.propertyType) && filters.propertyType.length > 0) {
      filters.propertyType.forEach((type, index) => {
        activeFilters.push({ 
          key: `propertyType-${index}`, 
          label: 'ქონების ტიპი', 
          value: getPropertyTypeLabel(type) 
        });
      });
    } else if (typeof filters.propertyType === 'string' && filters.propertyType !== 'all') {
      activeFilters.push({ 
        key: 'propertyType', 
        label: 'ქონების ტიპი', 
        value: getPropertyTypeLabel(filters.propertyType) 
      });
    }
  }

  // Price filters
  if (filters.priceMin && filters.priceMax) {
    activeFilters.push({ 
      key: 'price-range', 
      label: 'ფასი', 
      value: `${filters.priceMin} - ${filters.priceMax} ლარი` 
    });
  } else if (filters.priceMin) {
    activeFilters.push({ 
      key: 'priceMin', 
      label: 'მინ. ფასი', 
      value: `${filters.priceMin} ლარი` 
    });
  } else if (filters.priceMax) {
    activeFilters.push({ 
      key: 'priceMax', 
      label: 'მაქს. ფასი', 
      value: `${filters.priceMax} ლარი` 
    });
  }

  // Area filters
  if (filters.areaMin && filters.areaMax) {
    activeFilters.push({ 
      key: 'area-range', 
      label: 'ფართობი', 
      value: `${filters.areaMin} - ${filters.areaMax} მ²` 
    });
  } else if (filters.areaMin) {
    activeFilters.push({ 
      key: 'areaMin', 
      label: 'მინ. ფართობი', 
      value: `${filters.areaMin} მ²` 
    });
  } else if (filters.areaMax) {
    activeFilters.push({ 
      key: 'areaMax', 
      label: 'მაქს. ფართობი', 
      value: `${filters.areaMax} მ²` 
    });
  }

  // Room filters
  if (filters.bedrooms) {
    if (Array.isArray(filters.bedrooms) && filters.bedrooms.length > 0) {
      filters.bedrooms.forEach((bedroom, index) => {
        activeFilters.push({ 
          key: `bedrooms-${index}`, 
          label: 'საძინებელი', 
          value: `${bedroom} ოთახი` 
        });
      });
    } else if (typeof filters.bedrooms === 'string' && filters.bedrooms !== 'all') {
      activeFilters.push({ 
        key: 'bedrooms', 
        label: 'საძინებელი', 
        value: `${filters.bedrooms} ოთახი` 
      });
    }
  }

  if (filters.bathrooms) {
    if (Array.isArray(filters.bathrooms) && filters.bathrooms.length > 0) {
      filters.bathrooms.forEach((bathroom, index) => {
        const displayValue = bathroom === 'shared' ? 'საერთო' : `${bathroom} ოთახი`;
        activeFilters.push({ 
          key: `bathrooms-${index}`, 
          label: 'სააბაზანო', 
          value: displayValue 
        });
      });
    } else if (typeof filters.bathrooms === 'string' && filters.bathrooms !== 'all') {
      const displayValue = filters.bathrooms === 'shared' ? 'საერთო' : `${filters.bathrooms} ოთახი`;
      activeFilters.push({ 
        key: 'bathrooms', 
        label: 'სააბაზანო', 
        value: displayValue 
      });
    }
  }

  if (filters.rooms) {
    if (Array.isArray(filters.rooms) && filters.rooms.length > 0) {
      filters.rooms.forEach((room, index) => {
        activeFilters.push({ 
          key: `rooms-${index}`, 
          label: 'ოთახები', 
          value: `${room} ოთახი` 
        });
      });
    } else if (typeof filters.rooms === 'string' && filters.rooms !== 'all') {
      activeFilters.push({ 
        key: 'rooms', 
        label: 'ოთახები', 
        value: `${filters.rooms} ოთახი` 
      });
    }
  }

  // Building details
  if (filters.condition && filters.condition !== 'all') {
    activeFilters.push({ 
      key: 'condition', 
      label: 'მდგომარეობა', 
      value: getConditionLabel(filters.condition) 
    });
  }
  if (filters.buildingStatus && filters.buildingStatus !== 'all') {
    activeFilters.push({ 
      key: 'buildingStatus', 
      label: 'შენობის სტატუსი', 
      value: getBuildingStatusLabel(filters.buildingStatus) 
    });
  }
  if (filters.heating && filters.heating !== 'all') {
    activeFilters.push({ 
      key: 'heating', 
      label: 'გათბობა', 
      value: getHeatingLabel(filters.heating) 
    });
  }
  if (filters.parking && filters.parking !== 'all') {
    activeFilters.push({ 
      key: 'parking', 
      label: 'პარკინგი', 
      value: getParkingLabel(filters.parking) 
    });
  }
  if (filters.hotWater && filters.hotWater !== 'all') {
    activeFilters.push({ 
      key: 'hotWater', 
      label: 'ცხელი წყალი', 
      value: getHotWaterLabel(filters.hotWater) 
    });
  }
  if (filters.buildingMaterial && filters.buildingMaterial !== 'all') {
    activeFilters.push({ 
      key: 'buildingMaterial', 
      label: 'მშენებლობის მასალა', 
      value: getBuildingMaterialLabel(filters.buildingMaterial) 
    });
  }
  if (filters.projectType && filters.projectType !== 'all') {
    activeFilters.push({ 
      key: 'projectType', 
      label: 'პროექტის ტიპი', 
      value: getProjectTypeLabel(filters.projectType) 
    });
  }
  if (filters.dailyRentalSubcategory && filters.dailyRentalSubcategory !== 'all') {
    activeFilters.push({ 
      key: 'dailyRentalSubcategory', 
      label: 'დღიური ქირის კატეგორია', 
      value: getDailyRentalLabel(filters.dailyRentalSubcategory) 
    });
  }
  if (filters.totalFloors && filters.totalFloors !== 'all') {
    activeFilters.push({ 
      key: 'totalFloors', 
      label: 'სართულები', 
      value: `${filters.totalFloors} სართული` 
    });
  }
  if (filters.constructionYearMin && filters.constructionYearMax) {
    activeFilters.push({ 
      key: 'construction-year-range', 
      label: 'მშენებლობის წელი', 
      value: `${filters.constructionYearMin} - ${filters.constructionYearMax}` 
    });
  } else if (filters.constructionYearMin) {
    activeFilters.push({ 
      key: 'constructionYearMin', 
      label: 'მშენებლობის წელი', 
      value: `${filters.constructionYearMin} წლიდან` 
    });
  } else if (filters.constructionYearMax) {
    activeFilters.push({ 
      key: 'constructionYearMax', 
      label: 'მშენებლობის წელი', 
      value: `${filters.constructionYearMax} წლამდე` 
    });
  }
  if (filters.ceilingHeightMin && filters.ceilingHeightMax) {
    activeFilters.push({ 
      key: 'ceiling-height-range', 
      label: 'ჭერის სიმაღლე', 
      value: `${filters.ceilingHeightMin} - ${filters.ceilingHeightMax} მ` 
    });
  } else if (filters.ceilingHeightMin) {
    activeFilters.push({ 
      key: 'ceilingHeightMin', 
      label: 'ჭერის სიმაღლე', 
      value: `${filters.ceilingHeightMin} მ-დან` 
    });
  } else if (filters.ceilingHeightMax) {
    activeFilters.push({ 
      key: 'ceilingHeightMax', 
      label: 'ჭერის სიმაღლე', 
      value: `${filters.ceilingHeightMax} მ-მდე` 
    });
  }

  // Boolean amenities
  if (filters.hasBalcony) {
    activeFilters.push({ key: 'hasBalcony', label: 'აივანი', value: 'კი' });
  }
  if (filters.hasPool) {
    activeFilters.push({ key: 'hasPool', label: 'აუზი', value: 'კი' });
  }
  if (filters.hasLivingRoom) {
    activeFilters.push({ key: 'hasLivingRoom', label: 'მისაღები', value: 'კი' });
  }
  if (filters.hasLoggia) {
    activeFilters.push({ key: 'hasLoggia', label: 'ლოჯია', value: 'კი' });
  }
  if (filters.hasVeranda) {
    activeFilters.push({ key: 'hasVeranda', label: 'ვერანდა', value: 'კი' });
  }
  if (filters.hasYard) {
    activeFilters.push({ key: 'hasYard', label: 'ეზო', value: 'კი' });
  }
  if (filters.hasStorage) {
    activeFilters.push({ key: 'hasStorage', label: 'საცავი', value: 'კი' });
  }

  // Features, Advantages, Furniture arrays
  if (filters.selectedFeatures && filters.selectedFeatures.length > 0) {
    filters.selectedFeatures.forEach(feature => {
      activeFilters.push({ key: `feature-${feature}`, label: 'თვისება', value: feature });
    });
  }
  if (filters.selectedAdvantages && filters.selectedAdvantages.length > 0) {
    filters.selectedAdvantages.forEach(advantage => {
      activeFilters.push({ key: `advantage-${advantage}`, label: 'უპირატესობა', value: advantage });
    });
  }
  if (filters.selectedFurnitureAppliances && filters.selectedFurnitureAppliances.length > 0) {
    filters.selectedFurnitureAppliances.forEach(furniture => {
      activeFilters.push({ key: `furniture-${furniture}`, label: 'ავეჯი/ტექნიკა', value: furniture });
    });
  }

  // Handle special combined filters
  const handleRemoveFilter = (filterKey: string) => {
    if (filterKey === 'price-range') {
      onRemoveFilter('priceMin');
      onRemoveFilter('priceMax');
    } else if (filterKey === 'area-range') {
      onRemoveFilter('areaMin');
      onRemoveFilter('areaMax');
    } else if (filterKey === 'construction-year-range') {
      onRemoveFilter('constructionYearMin');
      onRemoveFilter('constructionYearMax');
    } else if (filterKey === 'ceiling-height-range') {
      onRemoveFilter('ceilingHeightMin');
      onRemoveFilter('ceilingHeightMax');
    } else if (filterKey.startsWith('feature-')) {
      const feature = filterKey.replace('feature-', '');
      // Handle feature removal logic here
      onRemoveFilter('selectedFeatures');
    } else if (filterKey.startsWith('advantage-')) {
      const advantage = filterKey.replace('advantage-', '');
      // Handle advantage removal logic here
      onRemoveFilter('selectedAdvantages');
    } else if (filterKey.startsWith('furniture-')) {
      const furniture = filterKey.replace('furniture-', '');
      // Handle furniture removal logic here
      onRemoveFilter('selectedFurnitureAppliances');
    } else if (filterKey.startsWith('propertyType-')) {
      const index = parseInt(filterKey.replace('propertyType-', ''));
      // Handle individual property type removal logic here
      onRemoveFilter(`propertyType-${index}`);
    } else if (filterKey.startsWith('rooms-')) {
      const index = parseInt(filterKey.replace('rooms-', ''));
      // Handle individual rooms removal logic here
      onRemoveFilter(`rooms-${index}`);
    } else if (filterKey.startsWith('bedrooms-')) {
      const index = parseInt(filterKey.replace('bedrooms-', ''));
      // Handle individual bedrooms removal logic here
      onRemoveFilter(`bedrooms-${index}`);
    } else if (filterKey.startsWith('bathrooms-')) {
      const index = parseInt(filterKey.replace('bathrooms-', ''));
      // Handle individual bathrooms removal logic here
      onRemoveFilter(`bathrooms-${index}`);
    } else {
      onRemoveFilter(filterKey);
    }
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 rounded-2xl p-5 mt-4 shadow-sm">
      <div className="space-y-4">
        {/* Header row with title and clear button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">აქტიური ფილტრები</span>
          </div>
          
          {activeFilters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="text-xs font-medium border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all duration-200 rounded-xl px-4 py-2"
            >
              <X className="h-3 w-3 mr-1" />
              ყველას გასუფთავება
            </Button>
          )}
        </div>
        
        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <div 
              key={filter.key} 
              className="group relative bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{filter.label}</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                </div>
                <span className="text-sm font-semibold text-slate-800">{filter.value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-5 w-5 p-0 rounded-full hover:bg-red-50 group-hover:bg-red-100 transition-colors opacity-70 hover:opacity-100"
                  onClick={() => handleRemoveFilter(filter.key)}
                >
                  <X className="h-3 w-3 text-slate-400 hover:text-red-500 transition-colors" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};