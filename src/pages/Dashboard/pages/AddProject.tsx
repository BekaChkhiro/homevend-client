import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Building2, MapPin, Calendar, DollarSign, Bed, Square } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PhotoGallerySection } from "./AddProject/components/PhotoGallerySection";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

interface City {
  id: number;
  nameGeorgian: string;
}

interface Area {
  id: number;
  nameKa: string;
}

interface UserProperty {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  city: string;
  street: string;
  streetNumber?: string;
  area: number;
  totalPrice: number;
  rooms?: string;
  viewCount: number;
  createdAt: string;
  cityData?: {
    nameGeorgian: string;
  };
  areaData?: {
    nameKa: string;
  };
}


export const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['projectForm', 'common']);
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
    pharmacy1km: false,
    kindergarten1km: false,
    school1km: false,
    university1km: false,
    hospital1km: false,
    clinic1km: false,
    busStop1km: false,
    metro1km: false,
    groceryStore1km: false,
    supermarket1km: false,
    mall1km: false,
    bank1km: false,
    atm1km: false,
    restaurant1km: false,
    cafe1km: false,
    bakery1km: false,
    sportsCenter1km: false,
    stadium1km: false,
    swimmingPool1km: false,
    park1km: false,
    square1km: false,
    cinema1km: false,
    theater1km: false,
    library1km: false,
    postOffice1km: false,
    gasStation1km: false,
    carWash1km: false,
    veterinary1km: false,
    beautyCenter1km: false,
    dentist1km: false,
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
    maintenance: false,
  });

  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [customAmenities, setCustomAmenities] = useState<{[key: string]: string}>({});
  const [projectImages, setProjectImages] = useState<File[]>([]);

  useEffect(() => {
    fetchCities();
    fetchUserProperties();
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

  const handleCustomAmenityChange = (amenityType: string, distance: string) => {
    setCustomAmenities(prev => ({
      ...prev,
      [amenityType]: distance
    }));
  };

  const fetchUserProperties = async () => {
    try {
      setPropertiesLoading(true);
      const response = await fetch('/api/properties/my-properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Only show properties that are not already linked to any project
        const properties = Array.isArray(data) ? data : (data.data || data.properties || []);
        const unlinkedProperties = properties.filter((property: any) => !property.projectId);
        setUserProperties(unlinkedProperties || []);
      } else {
        setUserProperties([]);
      }
    } catch (error) {
      console.error('Error fetching user properties:', error);
      setUserProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handlePropertySelection = (propertyId: number, selected: boolean) => {
    if (selected) {
      setSelectedProperties(prev => [...prev, propertyId]);
    } else {
      setSelectedProperties(prev => prev.filter(id => id !== propertyId));
    }
  };

  const clearCustomAmenity = (amenityType: string) => {
    setCustomAmenities(prev => {
      const newState = { ...prev };
      delete newState[amenityType];
      return newState;
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.role !== 'developer') {
      toast({
        title: t('common.error'),
        description: t('addProject.onlyDevelopers'),
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
        customAmenities: customAmenities,
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
      const projectId = newProject.project?.id || newProject.id;

      // Upload images to AWS if any were selected
      if (projectImages.length > 0 && projectId) {
        try {
          const formData = new FormData();
          projectImages.forEach(file => {
            formData.append('images', file);
          });
          formData.append('purpose', 'project_gallery');

          const uploadResponse = await fetch(`/api/upload/project/${projectId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.error('Failed to upload project images');
            // Don't fail the whole operation if image upload fails
          } else {
            console.log('Project images uploaded successfully');
          }
        } catch (uploadError) {
          console.error('Error uploading project images:', uploadError);
          // Don't fail the whole operation if image upload fails
        }
      }

      // Link selected properties to the project
      if (selectedProperties.length > 0) {
        try {
          await Promise.all(selectedProperties.map(async (propertyId) => {
            const linkResponse = await fetch(`/api/properties/${propertyId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ projectId: newProject.project?.id || newProject.id }),
            });
            
            if (!linkResponse.ok) {
              console.error(`Failed to link property ${propertyId} to project`);
            }
          }));
        } catch (linkError) {
          console.error('Error linking properties to project:', linkError);
          // Don't fail the whole operation if linking fails
        }
      }


      toast({
        title: t('projectForm.success.created'),
      });

      navigate(getLanguageUrl('/dashboard', i18n.language));
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: t('projectForm.error'),
        description: t('projectForm.errors.updateError'),
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
            <CardTitle>{t('addProject.accessDenied')}</CardTitle>
            <CardDescription>
              {t('addProject.accessDeniedDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(getLanguageUrl('/dashboard', i18n.language))} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('projectForm.addProject.backToDashboard')}
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
          onClick={() => navigate(getLanguageUrl('/dashboard', i18n.language))}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('projectForm.addProject.backToDashboard')}
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">{t('projectForm.addProject.title')}</h1>
        <p className="text-gray-600">{t('projectForm.addProject.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">{t('projectForm.tabs.basic')}</TabsTrigger>
            <TabsTrigger value="photos">{t('projectForm.tabs.photos')}</TabsTrigger>
            <TabsTrigger value="amenities">{t('projectForm.tabs.amenities')}</TabsTrigger>
            <TabsTrigger value="services">{t('projectForm.tabs.services')}</TabsTrigger>
            <TabsTrigger value="properties">{t('projectForm.tabs.properties')}</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('projectForm.sections.projectInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">{t('projectForm.fields.projectName')} *</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectType">{t('projectForm.fields.projectType')} *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => handleInputChange('projectType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.placeholders.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private_house">{t('projectForm.projectTypes.privateHouse')}</SelectItem>
                        <SelectItem value="apartment_building">{t('projectForm.projectTypes.apartmentBuilding')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">{t('projectForm.fields.description')}</Label>
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
                  {t('projectForm.sections.location')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cityId">{t('projectForm.fields.city')} *</Label>
                    <Select
                      value={formData.cityId}
                      onValueChange={(value) => handleInputChange('cityId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.placeholders.selectCity')} />
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
                    <Label htmlFor="areaId">{t('projectForm.fields.district')}</Label>
                    <Select
                      value={formData.areaId}
                      onValueChange={(value) => handleInputChange('areaId', value)}
                      disabled={!formData.cityId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.placeholders.selectDistrict')} />
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
                    <Label htmlFor="street">{t('projectForm.fields.street')} *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="streetNumber">{t('projectForm.fields.streetNumber')}</Label>
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
                  {t('projectForm.sections.projectDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryStatus">{t('projectForm.fields.deliveryStatus')} *</Label>
                    <Select
                      value={formData.deliveryStatus}
                      onValueChange={(value) => handleInputChange('deliveryStatus', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.placeholders.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed_with_renovation">{t('projectForm.deliveryStatuses.completedWithRenovation')}</SelectItem>
                        <SelectItem value="green_frame">{t('projectForm.deliveryStatuses.greenFrame')}</SelectItem>
                        <SelectItem value="black_frame">{t('projectForm.deliveryStatuses.blackFrame')}</SelectItem>
                        <SelectItem value="white_frame">{t('projectForm.deliveryStatuses.whiteFrame')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate">{t('projectForm.fields.deliveryDate')}</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="numberOfBuildings">{t('projectForm.fields.buildingsCount')} *</Label>
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
                    <Label htmlFor="totalApartments">{t('projectForm.fields.totalApartments')} *</Label>
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
                    <Label htmlFor="numberOfFloors">{t('projectForm.fields.floorsCount')} *</Label>
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
                    <Label htmlFor="parkingSpaces">{t('projectForm.fields.parkingSpaces')}</Label>
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

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <PhotoGallerySection
              images={projectImages}
              onPendingImagesChange={setProjectImages}
            />
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-6">

            {/* Distance-based amenities with flexible selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('projectForm.amenities.title')}
                </CardTitle>
                <CardDescription>{t('projectForm.amenities.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const amenityTypes = [
                    { key: 'pharmacy', label: t('projectForm.amenities.types.pharmacy') },
                    { key: 'kindergarten', label: t('projectForm.amenities.types.kindergarten') },
                    { key: 'school', label: t('projectForm.amenities.types.school') },
                    { key: 'university', label: t('projectForm.amenities.types.university') },
                    { key: 'hospital', label: t('projectForm.amenities.types.hospital') },
                    { key: 'clinic', label: t('projectForm.amenities.types.clinic') },
                    { key: 'busStop', label: t('projectForm.amenities.types.busStop') },
                    { key: 'metro', label: t('projectForm.amenities.types.metro') },
                    { key: 'groceryStore', label: t('projectForm.amenities.types.groceryStore') },
                    { key: 'supermarket', label: `${t('projectForm.amenities.types.supermarket')}` },
                    { key: 'mall', label: `${t('projectForm.amenities.types.mall')}` },
                    { key: 'bank', label: `${t('projectForm.amenities.types.bank')}` },
                    { key: 'atm', label: `${t('projectForm.amenities.types.atm')}` },
                    { key: 'restaurant', label: `${t('projectForm.amenities.types.restaurant')}` },
                    { key: 'cafe', label: `${t('projectForm.amenities.types.cafe')}` },
                    { key: 'bakery', label: `${t('projectForm.amenities.types.bakery')}` },
                    { key: 'sportsCenter', label: `${t('projectForm.amenities.types.sportsCenter')}` },
                    { key: 'gym', label: `${t('projectForm.amenities.types.gym')}` },
                    { key: 'stadium', label: `${t('projectForm.amenities.types.stadium')}` },
                    { key: 'swimmingPool', label: `${t('projectForm.amenities.types.swimmingPool')}` },
                    { key: 'park', label: `${t('projectForm.amenities.types.park')}` },
                    { key: 'garden', label: `${t('projectForm.amenities.types.garden')}` },
                    { key: 'square', label: `${t('projectForm.amenities.types.square')}` },
                    { key: 'parking', label: `${t('projectForm.amenities.types.parking')}` },
                    { key: 'bikePath', label: `${t('projectForm.amenities.types.bikePath')}` },
                    { key: 'sportsField', label: `${t('projectForm.amenities.types.sportsField')}` },
                    { key: 'childrenArea', label: `${t('projectForm.amenities.types.childrenArea')}` },
                    { key: 'laundry', label: `${t('projectForm.amenities.types.laundry')}` },
                    { key: 'storage', label: `${t('projectForm.amenities.types.storage')}` },
                    { key: 'cinema', label: `${t('projectForm.amenities.types.cinema')}` },
                    { key: 'theater', label: `${t('projectForm.amenities.types.theater')}` },
                    { key: 'library', label: `${t('projectForm.amenities.types.library')}` },
                    { key: 'postOffice', label: `${t('projectForm.amenities.types.postOffice')}` },
                    { key: 'gasStation', label: `${t('projectForm.amenities.types.gasStation')}` },
                    { key: 'carWash', label: `${t('projectForm.amenities.types.carWash')}` },
                    { key: 'veterinary', label: `${t('projectForm.amenities.types.veterinary')}` },
                    { key: 'beautyCenter', label: `${t('projectForm.amenities.types.beautyCenter')}` },
                    { key: 'dentist', label: `${t('projectForm.amenities.types.dentist')}` }
                  ];

                  const distances = [
                    { key: 'onSite', label: t('projectForm.amenities.distances.onSite'), color: 'bg-green-100 text-green-800' },
                    { key: '300m', label: t('projectForm.amenities.distances.300m'), color: 'bg-blue-100 text-blue-800' },
                    { key: '500m', label: t('projectForm.amenities.distances.500m'), color: 'bg-purple-100 text-purple-800' },
                    { key: '1km', label: t('projectForm.amenities.distances.1km'), color: 'bg-orange-100 text-orange-800' }
                  ];

                  return (
                    <div className="space-y-6 max-h-96 overflow-y-auto">
                      {amenityTypes.map((amenity) => (
                        <div key={amenity.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="font-medium text-gray-900">{amenity.label}</Label>
                            <div className="flex items-center gap-2">
                              {customAmenities[amenity.key] && (
                                <Badge variant="outline" className="text-xs">
                                  {distances.find(d => d.key === customAmenities[amenity.key])?.label}
                                </Badge>
                              )}
                              {customAmenities[amenity.key] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => clearCustomAmenity(amenity.key)}
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                >
                                  ✕
                                </Button>
                              )}
                            </div>
                          </div>
                          <RadioGroup
                            value={customAmenities[amenity.key] || ""}
                            onValueChange={(value) => handleCustomAmenityChange(amenity.key, value)}
                          >
                            <div className="flex flex-wrap gap-2">
                              {distances.map((distance) => (
                                <div key={distance.key} className="flex items-center">
                                  <RadioGroupItem
                                    value={distance.key}
                                    id={`${amenity.key}-${distance.key}`}
                                    className="mr-2"
                                  />
                                  <Label 
                                    htmlFor={`${amenity.key}-${distance.key}`}
                                    className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-all ${
                                      customAmenities[amenity.key] === distance.key
                                        ? distance.color 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {distance.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('projectForm.services.title')}
                </CardTitle>
                <CardDescription>{t('projectForm.services.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'securityService', label: `${t('projectForm.services.types.securityService')}` },
                    { key: 'hasConcierge', label: `${t('projectForm.services.types.hasConcierge')}` },
                    { key: 'videoSurveillance', label: `${t('projectForm.services.types.videoSurveillance')}` },
                    { key: 'hasLobby', label: `${t('projectForm.services.types.hasLobby')}` },
                    { key: 'hasDoorman', label: `${t('projectForm.services.types.hasDoorman')}` },
                    { key: 'yardCleaning', label: t('projectForm.services.types.yardCleaning') },
                    { key: 'entranceCleaning', label: t('projectForm.services.types.entranceCleaning') },
                    { key: 'landscaping', label: t('projectForm.services.types.landscaping') },
                    { key: 'hasLighting', label: t('projectForm.services.types.hasLighting') },
                    { key: 'fireSystem', label: t('projectForm.services.types.fireSystem') },
                    { key: 'mainDoorLock', label: t('projectForm.services.types.mainDoorLock') },
                    { key: 'maintenance', label: t('projectForm.services.types.maintenance') }
                  ].map((service) => (
                    <div key={service.key} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={service.key}
                        checked={formData[service.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(service.key, checked)}
                      />
                      <Label htmlFor={service.key} className="text-sm cursor-pointer">{service.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('projectForm.attachProperties.title')}
                </CardTitle>
                <CardDescription>
                  {t('projectForm.attachProperties.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {propertiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">{t('projectForm.loading')}</span>
                  </div>
                ) : userProperties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('projectForm.attachProperties.noProperties')}</p>
                    <p className="text-sm mt-2">{t('projectForm.attachProperties.noPropertiesDescription')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      {selectedProperties.length > 0 
                        ? `${selectedProperties.length} properties selected for attachment`
                        : 'Choose properties to attach to this project'
                      }
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                      {userProperties.map((property) => (
                        <div 
                          key={property.id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            selectedProperties.includes(property.id) 
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handlePropertySelection(property.id, !selectedProperties.includes(property.id))}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Checkbox
                                  checked={selectedProperties.includes(property.id)}
                                  onCheckedChange={() => handlePropertySelection(property.id, !selectedProperties.includes(property.id))}
                                  className="pointer-events-none"
                                />
                                <h4 className="font-semibold text-sm line-clamp-2">{property.title}</h4>
                              </div>
                              
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                                    {property.cityData?.nameGeorgian || property.city}
                                    {property.areaData && `, ${property.areaData.nameKa}`}
                                    , {property.street}
                                    {property.streetNumber && ` ${property.streetNumber}`}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Square className="h-4 w-4" />
                                    <span>{property.area} m²</span>
                                  </div>
                                  {property.rooms && (
                                    <div className="flex items-center gap-1">
                                      <Bed className="h-4 w-4" />
                                      <span>{property.rooms} rooms</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>
                                      {new Intl.NumberFormat('ka-GE', {
                                        style: 'currency',
                                        currency: 'GEL',
                                        minimumFractionDigits: 0
                                      }).format(property.totalPrice)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {property.propertyType === 'apartment' ? 'Apartment' :
                                       property.propertyType === 'house' ? 'House' :
                                       property.propertyType === 'commercial' ? 'Commercial' :
                                       property.propertyType}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {property.dealType === 'sale' ? 'For Sale' :
                                       property.dealType === 'rent' ? 'For Rent' :
                                       property.dealType === 'daily' ? 'Daily' :
                                       property.dealType}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {new Date(property.createdAt).toLocaleDateString('ka-GE')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedProperties.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>{selectedProperties.length}</strong> properties will be attached to this project after creation
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
            {t('projectForm.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('projectForm.saving') : t('projectForm.createProject')}
          </Button>
        </div>
      </form>
    </div>
  );
};