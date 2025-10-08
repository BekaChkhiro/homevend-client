import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { citiesApi, areasApi } from "@/lib/api";

interface City {
  id: number;
  code: string;
  nameGeorgian: string;
  nameEnglish?: string;
}

interface Area {
  id: number;
  nameKa: string;
  nameEn: string;
  cityId: number;
}

interface LocationFilterProps {
  value: string; // Current location string
  onChange: (location: string) => void;
  placeholder?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export const LocationFilter = ({ 
  value, 
  onChange, 
  placeholder = "აირჩიეთ მდებარეობა",
  showTitle = true,
  compact = false
}: LocationFilterProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [streetValue, setStreetValue] = useState<string>("");
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);

  // Initialize from value prop (for URL sync)
  useEffect(() => {
    if (value && cities.length > 0) {
      // Try to parse the location value to set initial selections
      const parts = value.split(', ').map(p => p.trim()).filter(Boolean);
      
      if (parts.length > 0) {
        // Find city match
        const cityMatch = cities.find(city => 
          city.nameGeorgian === parts[0] || city.nameEnglish === parts[0]
        );
        
        if (cityMatch && cityMatch.id !== selectedCityId) {
          setSelectedCityId(cityMatch.id);
          
          // If there are more parts, set street value to the rest
          if (parts.length > 1) {
            setStreetValue(parts.slice(1).join(', '));
          }
        }
      }
    }
  }, [value, cities.length]);

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoadingCities(true);
        const citiesData = await citiesApi.getAllCities(true); // Only active cities
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
        setAreas([]);
        return;
      }
      
      try {
        setIsLoadingAreas(true);
        const areasData = await areasApi.getAreasByCity(selectedCityId);
        setAreas(areasData || []);
      } catch (error) {
        console.error('Failed to load areas:', error);
        setAreas([]);
      } finally {
        setIsLoadingAreas(false);
      }
    };
    loadAreas();
  }, [selectedCityId]);

  const buildLocationString = (cityId: number | null, areaId: number | null, street: string) => {
    const cityName = cityId ? cities.find(c => c.id === cityId)?.nameGeorgian : '';
    const areaName = areaId ? areas.find(a => a.id === areaId)?.nameKa : '';
    
    const locationParts = [cityName, areaName, street].filter(Boolean);
    return locationParts.join(', ');
  };

  const handleCityChange = (cityId: string) => {
    const numericCityId = cityId === 'all' ? null : parseInt(cityId);
    setSelectedCityId(numericCityId);
    setSelectedAreaId(null); // Reset area selection
    
    const newLocation = buildLocationString(numericCityId, null, streetValue);
    onChange(newLocation);
  };

  const handleAreaChange = (areaId: string) => {
    const numericAreaId = areaId === 'all' ? null : parseInt(areaId);
    setSelectedAreaId(numericAreaId);
    
    const newLocation = buildLocationString(selectedCityId, numericAreaId, streetValue);
    onChange(newLocation);
  };

  const handleStreetChange = (street: string) => {
    setStreetValue(street);
    const newLocation = buildLocationString(selectedCityId, selectedAreaId, street);
    onChange(newLocation);
  };

  const containerClass = compact ? "space-y-2" : "space-y-3";
  const labelClass = compact ? "text-xs text-muted-foreground mb-1 block" : "text-sm font-medium mb-2 block";

  return (
    <div className={containerClass}>
      {showTitle && (
        <Label className={compact ? labelClass : "text-sm font-medium mb-2 block"}>
          მდებარეობა
        </Label>
      )}
      
      {/* City Selection */}
      <div>
        {!compact && <Label className="text-xs text-muted-foreground mb-1 block">ქალაქი</Label>}
        <Select
          value={selectedCityId?.toString() || 'all'}
          onValueChange={handleCityChange}
          disabled={isLoadingCities}
        >
          <SelectTrigger aria-label="აირჩიეთ ქალაქი">
            <SelectValue placeholder={isLoadingCities ? "იტვირთება..." : "აირჩიეთ ქალაქი"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ყველა ქალაქი</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.nameGeorgian}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Area/District Selection - Only show when city is selected */}
      {selectedCityId && (
        <div>
          {!compact && <Label className="text-xs text-muted-foreground mb-1 block">უბანი/რაიონი</Label>}
          <Select
            value={selectedAreaId?.toString() || 'all'}
            onValueChange={handleAreaChange}
            disabled={isLoadingAreas}
          >
            <SelectTrigger aria-label="აირჩიეთ უბანი/რაიონი">
              <SelectValue placeholder={isLoadingAreas ? "იტვირთება..." : "აირჩიეთ უბანი"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ყველა უბანი</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {area.nameKa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Street/Address Input */}
      <div>
        {!compact && <Label className="text-xs text-muted-foreground mb-1 block">ქუჩა/მისამართი</Label>}
        <Input
          type="text"
          placeholder={compact ? placeholder : "შეიყვანეთ ქუჩის სახელი ან მისამართი"}
          value={streetValue}
          onChange={(e) => handleStreetChange(e.target.value)}
        />
      </div>
      
      {/* Current Location Display */}
      {!compact && value && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          მიმდინარე მდებარეობა: {value}
        </div>
      )}
    </div>
  );
};