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
      'newly-built': 'ახალი შენობა',
      'old-building': 'ძველი შენობა',
      'newly-renovated': 'ახალი რემონტით',
      'needs-renovation': 'საჭიროებს რემონტს',
      'under-renovation': 'მიმდინარე რემონტი',
      'white-frame': 'თეთრი კარკასი'
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
  }
  if (filters.city && filters.city !== 'all') {
    activeFilters.push({ key: 'city', label: 'ქალაქი', value: filters.city });
  }
  if (filters.transactionType && filters.transactionType !== 'all') {
    activeFilters.push({ 
      key: 'transactionType', 
      label: 'გარიგების ტიპი', 
      value: getTransactionTypeLabel(filters.transactionType) 
    });
  }
  if (filters.propertyType && filters.propertyType !== 'all') {
    activeFilters.push({ 
      key: 'propertyType', 
      label: 'ქონების ტიპი', 
      value: getPropertyTypeLabel(filters.propertyType) 
    });
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
  if (filters.bedrooms && filters.bedrooms !== 'all') {
    activeFilters.push({ 
      key: 'bedrooms', 
      label: 'საძინებელი', 
      value: `${filters.bedrooms} ოთახი` 
    });
  }
  if (filters.bathrooms && filters.bathrooms !== 'all') {
    activeFilters.push({ 
      key: 'bathrooms', 
      label: 'სააბაზანო', 
      value: `${filters.bathrooms} ოთახი` 
    });
  }
  if (filters.rooms && filters.rooms !== 'all') {
    activeFilters.push({ 
      key: 'rooms', 
      label: 'ოთახები', 
      value: `${filters.rooms} ოთახი` 
    });
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
      value: filters.buildingStatus 
    });
  }
  if (filters.heating && filters.heating !== 'all') {
    activeFilters.push({ 
      key: 'heating', 
      label: 'გათბობა', 
      value: filters.heating 
    });
  }

  // Boolean amenities
  if (filters.hasBalcony) {
    activeFilters.push({ key: 'hasBalcony', label: 'აივანი', value: 'კი' });
  }
  if (filters.hasPool) {
    activeFilters.push({ key: 'hasPool', label: 'აუზი', value: 'კი' });
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
    } else {
      onRemoveFilter(filterKey);
    }
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 rounded-2xl p-5 mt-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">აქტიური ფილტრები</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 flex-1">
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

          {activeFilters.length > 1 && (
            <div className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="text-xs font-medium border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all duration-200 rounded-xl px-4 py-2"
              >
                <X className="h-3 w-3 mr-1" />
                ყველას გასუფთავება
              </Button>
            </div>
          )}
      </div>
    </div>
  );
};