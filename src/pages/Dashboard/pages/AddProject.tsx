import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Trash2, Building2, MapPin, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface City {
  id: number;
  nameGeorgian: string;
}

interface Area {
  id: number;
  nameKa: string;
}

interface PricingData {
  roomType: string;
  numberOfRooms: number;
  totalArea: number;
  livingArea?: number;
  balconyArea?: number;
  pricePerSqm: number;
  totalPriceFrom: number;
  totalPriceTo?: number;
  availableUnits: number;
  totalUnits: number;
  hasBalcony: boolean;
  hasTerrace: boolean;
  hasLoggia: boolean;
  floorFrom?: number;
  floorTo?: number;
}

export const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    cityId: "",
    areaId: "",
    street: "",
    streetNumber: "",
    projectType: "",
    deliveryStatus: "",
    deliveryDate: "",
    numberOfBuildings: "",
    totalApartments: "",
    numberOfFloors: "",
    parkingSpaces: "",
    // Amenities in project area
    hasGroceryStore: false,
    hasBikePath: false,
    hasSportsField: false,
    hasChildrenArea: false,
    hasSquare: false,
    // Within 300 meters
    pharmacy300m: false,
    kindergarten300m: false,
    school300m: false,
    busStop300m: false,
    groceryStore300m: false,
    bikePath300m: false,
    sportsField300m: false,
    stadium300m: false,
    square300m: false,
    // Within 500 meters
    pharmacy500m: false,
    kindergarten500m: false,
    school500m: false,
    university500m: false,
    busStop500m: false,
    groceryStore500m: false,
    bikePath500m: false,
    sportsField500m: false,
    stadium500m: false,
    square500m: false,
    // Within 1 kilometer
    hospital1km: false,
    // Services
    securityService: false,
    hasLobby: false,
    hasConcierge: false,
    videoSurveillance: false,
    hasLighting: false,
    landscaping: false,
    yardCleaning: false,
    entranceCleaning: false,
    hasDoorman: false,
    fireSystem: false,
    mainDoorLock: false,
  });

  const [pricing, setPricing] = useState<PricingData[]>([]);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (formData.cityId) {
      fetchAreas(parseInt(formData.cityId));
    } else {
      setAreas([]);
      setFormData(prev => ({ ...prev, areaId: "" }));
    }
  }, [formData.cityId]);

  const fetchCities = async () => {
    try {
      console.log('Fetching cities...');
      const response = await fetch('/api/cities');
      console.log('Cities response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Cities response:', result);
        // Handle the API response format { success: true, data: cities }
        const cities = result.success && result.data ? result.data : [];
        setCities(Array.isArray(cities) ? cities : []);
      } else {
        console.error('Failed to fetch cities:', response.status, response.statusText);
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };

  const fetchAreas = async (cityId: number) => {
    try {
      const response = await fetch(`/api/areas?cityId=${cityId}`);
      if (response.ok) {
        const result = await response.json();
        console.log('Areas response:', result);
        // Handle the API response format
        const areas = result.success && result.data ? result.data : result;
        setAreas(Array.isArray(areas) ? areas : []);
      } else {
        console.error('Failed to fetch areas:', response.status);
        setAreas([]);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    }
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addPricingEntry = () => {
    setPricing(prev => [...prev, {
      roomType: "one_bedroom",
      numberOfRooms: 1,
      totalArea: 0,
      livingArea: 0,
      balconyArea: 0,
      pricePerSqm: 0,
      totalPriceFrom: 0,
      totalPriceTo: 0,
      availableUnits: 1,
      totalUnits: 1,
      hasBalcony: false,
      hasTerrace: false,
      hasLoggia: false,
      floorFrom: 1,
      floorTo: 1,
    }]);
  };

  const removePricingEntry = (index: number) => {
    setPricing(prev => prev.filter((_, i) => i !== index));
  };

  const updatePricingEntry = (index: number, field: string, value: any) => {
    setPricing(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const getRoomTypeLabel = (roomType: string) => {
    switch (roomType) {
      case 'studio': return 'სტუდიო';
      case 'one_bedroom': return '1 საძინებელი';
      case 'two_bedroom': return '2 საძინებელი';
      case 'three_bedroom': return '3 საძინებელი';
      case 'four_bedroom': return '4 საძინებელი';
      case 'five_plus_bedroom': return '5+ საძინებელი';
      default: return roomType;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.role !== 'developer') {
      toast({
        title: "შეცდომა",
        description: "მხოლოდ დეველოპერებს შეუძლიათ პროექტების დამატება",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const projectData = {
        ...formData,
        cityId: parseInt(formData.cityId),
        areaId: formData.areaId ? parseInt(formData.areaId) : undefined,
        numberOfBuildings: parseInt(formData.numberOfBuildings),
        totalApartments: parseInt(formData.totalApartments),
        numberOfFloors: parseInt(formData.numberOfFloors),
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : undefined,
        deliveryDate: formData.deliveryDate || undefined,
        pricing: pricing.length > 0 ? pricing : undefined,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();

      toast({
        title: "წარმატება",
        description: "პროექტი წარმატებით შეიქმნა",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "შეცდომა",
        description: "პროექტის შექმნისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'developer') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>წვდომა აკრძალულია</CardTitle>
            <CardDescription>
              მხოლოდ დეველოპერებს შეუძლიათ პროექტების დამატება
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              უკან დაბრუნება
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">ახალი პროექტის დამატება</h1>
        <p className="text-gray-600">შეავსეთ პროექტის ინფორმაცია</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">ძირითადი ინფო</TabsTrigger>
            <TabsTrigger value="amenities">კომფორტი</TabsTrigger>
            <TabsTrigger value="services">სერვისები</TabsTrigger>
            <TabsTrigger value="pricing">ფასები</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  პროექტის ინფორმაცია
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">პროექტის დასახელება *</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectType">პროექტის ტიპი *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => handleInputChange('projectType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="აირჩიეთ ტიპი" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private_house">კერძო სახლი</SelectItem>
                        <SelectItem value="apartment_building">საცხოვრებელი კომპლექსი</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">აღწერა</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  ლოკაცია
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cityId">ქალაქი *</Label>
                    <Select
                      value={formData.cityId}
                      onValueChange={(value) => handleInputChange('cityId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="აირჩიეთ ქალაქი" />
                      </SelectTrigger>
                      <SelectContent>
                        {(cities || []).map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.nameGeorgian}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="areaId">რაიონი</Label>
                    <Select
                      value={formData.areaId}
                      onValueChange={(value) => handleInputChange('areaId', value)}
                      disabled={!formData.cityId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="აირჩიეთ რაიონი" />
                      </SelectTrigger>
                      <SelectContent>
                        {(areas || []).map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.nameKa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="street">ქუჩა *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="streetNumber">ნომერი</Label>
                    <Input
                      id="streetNumber"
                      value={formData.streetNumber}
                      onChange={(e) => handleInputChange('streetNumber', e.target.value)}
                    />
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  პროექტის დეტალები
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryStatus">ჩაბარების სტატუსი *</Label>
                    <Select
                      value={formData.deliveryStatus}
                      onValueChange={(value) => handleInputChange('deliveryStatus', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="აირჩიეთ სტატუსი" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed_with_renovation">ჩაბარება რემონტით</SelectItem>
                        <SelectItem value="green_frame">მწვანე კარკასი</SelectItem>
                        <SelectItem value="black_frame">შავი კარკასი</SelectItem>
                        <SelectItem value="white_frame">თეთრი კარკასი</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate">ჩაბარების თარიღი</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="numberOfBuildings">კორპუსების რაოდენობა *</Label>
                    <Input
                      id="numberOfBuildings"
                      type="number"
                      min="1"
                      value={formData.numberOfBuildings}
                      onChange={(e) => handleInputChange('numberOfBuildings', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalApartments">სულ ბინები *</Label>
                    <Input
                      id="totalApartments"
                      type="number"
                      min="1"
                      value={formData.totalApartments}
                      onChange={(e) => handleInputChange('totalApartments', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="numberOfFloors">სართულების რაოდენობა *</Label>
                    <Input
                      id="numberOfFloors"
                      type="number"
                      min="1"
                      value={formData.numberOfFloors}
                      onChange={(e) => handleInputChange('numberOfFloors', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="parkingSpaces">პარკინგის ადგილები</Label>
                    <Input
                      id="parkingSpaces"
                      type="number"
                      min="0"
                      value={formData.parkingSpaces}
                      onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>პროექტის ტერიტორიაზე</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'hasGroceryStore', label: 'მაღაზია' },
                    { key: 'hasBikePath', label: 'ველოსიპედის ბილიკი' },
                    { key: 'hasSportsField', label: 'სპორტული მოედანი' },
                    { key: 'hasChildrenArea', label: 'ბავშვთა მოედანი' },
                    { key: 'hasSquare', label: 'მოედანი' },
                  ].map((amenity) => (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.key}
                        checked={formData[amenity.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(amenity.key, checked)}
                      />
                      <Label htmlFor={amenity.key}>{amenity.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>300 მეტრის რადიუსში</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'pharmacy300m', label: 'აფთიაქი' },
                    { key: 'kindergarten300m', label: 'ბაღი' },
                    { key: 'school300m', label: 'სკოლა' },
                    { key: 'busStop300m', label: 'ავტობუსის გაჩერება' },
                    { key: 'groceryStore300m', label: 'მაღაზია' },
                    { key: 'bikePath300m', label: 'ველოსიპედის ბილიკი' },
                    { key: 'sportsField300m', label: 'სპორტული მოედანი' },
                    { key: 'stadium300m', label: 'სტადიონი' },
                    { key: 'square300m', label: 'მოედანი' },
                  ].map((amenity) => (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.key}
                        checked={formData[amenity.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(amenity.key, checked)}
                      />
                      <Label htmlFor={amenity.key}>{amenity.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>500 მეტრის რადიუსში</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'pharmacy500m', label: 'აფთიაქი' },
                    { key: 'kindergarten500m', label: 'ბაღი' },
                    { key: 'school500m', label: 'სკოლა' },
                    { key: 'university500m', label: 'უნივერსიტეტი' },
                    { key: 'busStop500m', label: 'ავტობუსის გაჩერება' },
                    { key: 'groceryStore500m', label: 'მაღაზია' },
                    { key: 'bikePath500m', label: 'ველოსიპედის ბილიკი' },
                    { key: 'sportsField500m', label: 'სპორტული მოედანი' },
                    { key: 'stadium500m', label: 'სტადიონი' },
                    { key: 'square500m', label: 'მოედანი' },
                  ].map((amenity) => (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.key}
                        checked={formData[amenity.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(amenity.key, checked)}
                      />
                      <Label htmlFor={amenity.key}>{amenity.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>1 კილომეტრის რადიუსში</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hospital1km"
                      checked={formData.hospital1km}
                      onCheckedChange={(checked) => handleInputChange('hospital1km', checked)}
                    />
                    <Label htmlFor="hospital1km">ჰოსპიტალი</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>სერვისები და უსაფრთხოება</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'securityService', label: 'უსაფრთხოების სერვისი' },
                    { key: 'hasLobby', label: 'ლობი' },
                    { key: 'hasConcierge', label: 'კონსიერჟი' },
                    { key: 'videoSurveillance', label: 'ვიდეო ზედამხედველობა' },
                    { key: 'hasLighting', label: 'განათება' },
                    { key: 'landscaping', label: 'ლანდშაფტის დიზაინი' },
                    { key: 'yardCleaning', label: 'ეზოს დალაგება' },
                    { key: 'entranceCleaning', label: 'შესასვლელის დალაგება' },
                    { key: 'hasDoorman', label: 'კარისკაცი' },
                    { key: 'fireSystem', label: 'ხანძრის ჩაქრობის სისტემა' },
                    { key: 'mainDoorLock', label: 'მთავარი კარის საკეტი' },
                  ].map((service) => (
                    <div key={service.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.key}
                        checked={formData[service.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(service.key, checked)}
                      />
                      <Label htmlFor={service.key}>{service.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  ფასები ოთახების მიხედვით
                </CardTitle>
                <CardDescription>
                  დაამატეთ სხვადასხვა ტიპის ბინების ფასები
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPricingEntry}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  ფასის დამატება
                </Button>

                {pricing.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">ფასის ვარიანტი {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePricingEntry(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>ოთახების ტიპი</Label>
                        <Select
                          value={entry.roomType}
                          onValueChange={(value) => updatePricingEntry(index, 'roomType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="studio">სტუდიო</SelectItem>
                            <SelectItem value="one_bedroom">1 საძინებელი</SelectItem>
                            <SelectItem value="two_bedroom">2 საძინებელი</SelectItem>
                            <SelectItem value="three_bedroom">3 საძინებელი</SelectItem>
                            <SelectItem value="four_bedroom">4 საძინებელი</SelectItem>
                            <SelectItem value="five_plus_bedroom">5+ საძინებელი</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>ოთახების რაოდენობა</Label>
                        <Input
                          type="number"
                          min="1"
                          value={entry.numberOfRooms}
                          onChange={(e) => updatePricingEntry(index, 'numberOfRooms', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label>საერთო ფართობი (მ²)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.totalArea}
                          onChange={(e) => updatePricingEntry(index, 'totalArea', parseFloat(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label>საცხოვრებელი ფართობი (მ²)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.livingArea || ''}
                          onChange={(e) => updatePricingEntry(index, 'livingArea', e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </div>

                      <div>
                        <Label>ბალკონის ფართობი (მ²)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.balconyArea || ''}
                          onChange={(e) => updatePricingEntry(index, 'balconyArea', e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </div>

                      <div>
                        <Label>ფასი მ²-ზე</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.pricePerSqm}
                          onChange={(e) => updatePricingEntry(index, 'pricePerSqm', parseFloat(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label>ფასი (დან)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.totalPriceFrom}
                          onChange={(e) => updatePricingEntry(index, 'totalPriceFrom', parseFloat(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label>ფასი (მდე)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.totalPriceTo || ''}
                          onChange={(e) => updatePricingEntry(index, 'totalPriceTo', e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </div>

                      <div>
                        <Label>ხელმისაწვდომი ბინები</Label>
                        <Input
                          type="number"
                          min="1"
                          value={entry.availableUnits}
                          onChange={(e) => updatePricingEntry(index, 'availableUnits', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label>სულ ბინები</Label>
                        <Input
                          type="number"
                          min="1"
                          value={entry.totalUnits}
                          onChange={(e) => updatePricingEntry(index, 'totalUnits', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label>სართული (დან)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={entry.floorFrom || ''}
                          onChange={(e) => updatePricingEntry(index, 'floorFrom', e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </div>

                      <div>
                        <Label>სართული (მდე)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={entry.floorTo || ''}
                          onChange={(e) => updatePricingEntry(index, 'floorTo', e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`hasBalcony-${index}`}
                          checked={entry.hasBalcony}
                          onCheckedChange={(checked) => updatePricingEntry(index, 'hasBalcony', checked)}
                        />
                        <Label htmlFor={`hasBalcony-${index}`}>ბალკონი</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`hasTerrace-${index}`}
                          checked={entry.hasTerrace}
                          onCheckedChange={(checked) => updatePricingEntry(index, 'hasTerrace', checked)}
                        />
                        <Label htmlFor={`hasTerrace-${index}`}>ტერასა</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`hasLoggia-${index}`}
                          checked={entry.hasLoggia}
                          onCheckedChange={(checked) => updatePricingEntry(index, 'hasLoggia', checked)}
                        />
                        <Label htmlFor={`hasLoggia-${index}`}>ლოჯია</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            გაუქმება
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "შენახვა..." : "პროექტის შენახვა"}
          </Button>
        </div>
      </form>
    </div>
  );
};