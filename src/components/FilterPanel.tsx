
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import type { FilterState } from "@/pages/Index";
import { transactionTypes, propertyTypes } from "@/pages/Home/components/FilterTypes";
import { LocationFilter } from "@/components/LocationFilter";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Clear daily rental subcategory if transaction type changes to non-daily
    if (key === 'transactionType' && value !== 'ქირავდება დღიურად') {
      newFilters.dailyRentalSubcategory = '';
    }
    
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      priceMin: "",
      priceMax: "",
      location: "",
      propertyType: "all",
      transactionType: "all",
      dailyRentalSubcategory: "",
      bedrooms: "",
      areaMin: "",
      areaMax: ""
    });
  };

  return (
    <Card className="p-6 sticky top-4 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">ფილტრები</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
          <FilterX className="h-4 w-4 mr-1" />
          გასუფთავება
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Transaction Type */}
        <div>
          <Label className="text-sm font-medium mb-2 block">გარიგების ტიპი</Label>
          <Select value={filters.transactionType} onValueChange={(value) => updateFilter("transactionType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="აირჩიეთ გარიგების ტიპი" />
            </SelectTrigger>
            <SelectContent>
              {transactionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Daily Rental Subcategory - Only show when Daily Rental is selected */}
        {filters.transactionType === 'ქირავდება დღიურად' && (
          <div>
            <Label className="text-sm font-medium mb-2 block">დღიური ქირაობის ტიპი</Label>
            <Select value={filters.dailyRentalSubcategory || ""} onValueChange={(value) => updateFilter("dailyRentalSubcategory", value)}>
              <SelectTrigger>
                <SelectValue placeholder="აირჩიეთ ტიპი" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ყველა</SelectItem>
                <SelectItem value="sea">დღიურად ზღვაზე</SelectItem>
                <SelectItem value="mountains">დღიურად მთაში</SelectItem>
                <SelectItem value="villa">აგარაკები დღიურად</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Property Type */}
        <div>
          <Label className="text-sm font-medium mb-2 block">ქონების ტიპი</Label>
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter("propertyType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="აირჩიეთ ტიპი" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location - Hierarchical Selection */}
        <LocationFilter
          value={filters.location}
          onChange={(location) => updateFilter("location", location)}
          showTitle={true}
          compact={false}
        />

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-2 block">ფასი (ლარი)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="მინ"
              value={filters.priceMin}
              onChange={(e) => updateFilter("priceMin", e.target.value)}
            />
            <Input
              type="number"
              placeholder="მაქს"
              value={filters.priceMax}
              onChange={(e) => updateFilter("priceMax", e.target.value)}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <Label className="text-sm font-medium mb-2 block">საძინებლები</Label>
          <Select value={filters.bedrooms} onValueChange={(value) => updateFilter("bedrooms", value)}>
            <SelectTrigger>
              <SelectValue placeholder="რაოდენობა" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area */}
        <div>
          <Label className="text-sm font-medium mb-2 block">ფართობი (მ²)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="მინ"
              value={filters.areaMin}
              onChange={(e) => updateFilter("areaMin", e.target.value)}
            />
            <Input
              type="number"
              placeholder="მაქს"
              value={filters.areaMax}
              onChange={(e) => updateFilter("areaMax", e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
