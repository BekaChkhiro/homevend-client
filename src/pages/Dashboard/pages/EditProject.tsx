import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft, Plus, Trash2, Building2, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PhotoGallerySection } from "./AddProject/components/PhotoGallerySection";
import { useTranslation } from "react-i18next";

interface City {
  id: number;
  nameGeorgian: string;
}

interface Area {
  id: number;
  nameKa: string;
}

export const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation(['projectForm', 'common']);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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

  const [customAmenities, setCustomAmenities] = useState<{[key: string]: string}>({});
  const [projectImages, setProjectImages] = useState<File[]>([]);

  useEffect(() => {
    fetchCities();
    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (formData.cityId) {
      fetchAreas(parseInt(formData.cityId));
    } else {
      setAreas([]);
      setFormData(prev => ({ ...prev, areaId: "" }));
    }
  }, [formData.cityId]);

  const fetchProject = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: t('projectForm.error'),
            description: t('projectForm.errors.projectNotFound'),
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }
        throw new Error('Failed to fetch project');
      }

      const project = await response.json();
      
      // Convert project data to form format
      setFormData({
        projectName: project.projectName || "",
        description: project.description || "",
        cityId: project.cityId?.toString() || "",
        areaId: project.areaId?.toString() || "",
        street: project.street || "",
        streetNumber: project.streetNumber || "",
        projectType: project.projectType || "",
        deliveryStatus: project.deliveryStatus || "",
        deliveryDate: project.deliveryDate ? project.deliveryDate.split('T')[0] : "",
        numberOfBuildings: project.numberOfBuildings?.toString() || "",
        totalApartments: project.totalApartments?.toString() || "",
        numberOfFloors: project.numberOfFloors?.toString() || "",
        parkingSpaces: project.parkingSpaces?.toString() || "",
        // Services
        securityService: project.securityService || false,
        hasLobby: project.hasLobby || false,
        hasConcierge: project.hasConcierge || false,
        videoSurveillance: project.videoSurveillance || false,
        hasLighting: project.hasLighting || false,
        landscaping: project.landscaping || false,
        yardCleaning: project.yardCleaning || false,
        entranceCleaning: project.entranceCleaning || false,
        hasDoorman: project.hasDoorman || false,
        fireSystem: project.fireSystem || false,
        mainDoorLock: project.mainDoorLock || false,
        maintenance: project.maintenance || false,
      });

      // Convert amenities array to customAmenities format
      if (project.amenities && Array.isArray(project.amenities)) {
        const amenitiesMap: {[key: string]: string} = {};
        project.amenities.forEach((amenity: any) => {
          // Convert database distance format to form format
          let distanceKey: string;
          switch (amenity.distance) {
            case 'on_site':
              distanceKey = 'onSite';
              break;
            case 'within_300m':
              distanceKey = '300m';
              break;
            case 'within_500m':
              distanceKey = '500m';
              break;
            case 'within_1km':
              distanceKey = '1km';
              break;
            default:
              distanceKey = amenity.distance;
          }
          amenitiesMap[amenity.amenityType] = distanceKey;
        });
        setCustomAmenities(amenitiesMap);
      } else if (project.customAmenities) {
        // Fallback for old format
        setCustomAmenities(project.customAmenities);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: t('projectForm.error'),
        description: t('projectForm.errors.loadingError'),
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setIsFetching(false);
    }
  };

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
        title: t('projectForm.error'),
        description: t('projectForm.errors.permissionError'),
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

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      toast({
        title: t('projectForm.success'),
        description: t('projectForm.success.updated'),
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating project:', error);
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
            <CardTitle>{t('projectForm.accessDenied.title')}</CardTitle>
            <CardDescription>
              {t('projectForm.accessDenied.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('projectForm.backButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{t('projectForm.loading')}</p>
          </div>
        </div>
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
          {t('projectForm.backButton')}
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">{t('projectForm.editTitle')}</h1>
        <p className="text-gray-600">{t('projectForm.editSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">{t('projectForm.tabs.basic')}</TabsTrigger>
            <TabsTrigger value="amenities">{t('projectForm.tabs.amenities')}</TabsTrigger>
            <TabsTrigger value="services">{t('projectForm.tabs.services')}</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('projectForm.projectInfo.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">{t('projectForm.projectInfo.projectNameRequired')}</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectType">{t('projectForm.projectInfo.projectTypeRequired')}</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => handleInputChange('projectType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.projectInfo.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private_house">{t('projectForm.projectInfo.types.privateHouse')}</SelectItem>
                        <SelectItem value="apartment_building">{t('projectForm.projectInfo.types.apartmentBuilding')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">{t('projectForm.projectInfo.description')}</Label>
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
                  {t('projectForm.location.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cityId">{t('projectForm.location.cityRequired')}</Label>
                    <Select
                      value={formData.cityId}
                      onValueChange={(value) => handleInputChange('cityId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.location.selectCity')} />
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
                    <Label htmlFor="areaId">{t('projectForm.location.area')}</Label>
                    <Select
                      value={formData.areaId}
                      onValueChange={(value) => handleInputChange('areaId', value)}
                      disabled={!formData.cityId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.location.selectArea')} />
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
                    <Label htmlFor="street">{t('projectForm.location.streetRequired')}</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="streetNumber">{t('projectForm.location.streetNumber')}</Label>
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
                  {t('projectForm.projectDetails.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryStatus">{t('projectForm.projectDetails.deliveryStatusRequired')}</Label>
                    <Select
                      value={formData.deliveryStatus}
                      onValueChange={(value) => handleInputChange('deliveryStatus', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projectForm.projectDetails.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed_with_renovation">{t('projectForm.projectDetails.deliveryStatuses.completedWithRenovation')}</SelectItem>
                        <SelectItem value="green_frame">{t('projectForm.projectDetails.deliveryStatuses.greenFrame')}</SelectItem>
                        <SelectItem value="black_frame">{t('projectForm.projectDetails.deliveryStatuses.blackFrame')}</SelectItem>
                        <SelectItem value="white_frame">{t('projectForm.projectDetails.deliveryStatuses.whiteFrame')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate">{t('projectForm.projectDetails.deliveryDate')}</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="numberOfBuildings">{t('projectForm.projectDetails.numberOfBuildingsRequired')}</Label>
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
                    <Label htmlFor="totalApartments">{t('projectForm.projectDetails.totalApartmentsRequired')}</Label>
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
                    <Label htmlFor="numberOfFloors">{t('projectForm.projectDetails.numberOfFloorsRequired')}</Label>
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
                    <Label htmlFor="parkingSpaces">{t('projectForm.projectDetails.parkingSpaces')}</Label>
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

            {/* Photo Gallery Section */}
            <PhotoGallerySection
              images={projectImages}
              onImagesChange={setProjectImages}
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
                    { key: 'supermarket', label: t('projectForm.amenities.types.supermarket') },
                    { key: 'mall', label: t('projectForm.amenities.types.mall') },
                    { key: 'bank', label: t('projectForm.amenities.types.bank') },
                    { key: 'atm', label: t('projectForm.amenities.types.atm') },
                    { key: 'restaurant', label: t('projectForm.amenities.types.restaurant') },
                    { key: 'cafe', label: t('projectForm.amenities.types.cafe') },
                    { key: 'bakery', label: t('projectForm.amenities.types.bakery') },
                    { key: 'sportsCenter', label: t('projectForm.amenities.types.sportsCenter') },
                    { key: 'gym', label: t('projectForm.amenities.types.gym') },
                    { key: 'stadium', label: t('projectForm.amenities.types.stadium') },
                    { key: 'swimmingPool', label: t('projectForm.amenities.types.swimmingPool') },
                    { key: 'park', label: t('projectForm.amenities.types.park') },
                    { key: 'garden', label: t('projectForm.amenities.types.garden') },
                    { key: 'square', label: t('projectForm.amenities.types.square') },
                    { key: 'parking', label: t('projectForm.amenities.types.parking') },
                    { key: 'bikePath', label: t('projectForm.amenities.types.bikePath') },
                    { key: 'sportsField', label: t('projectForm.amenities.types.sportsField') },
                    { key: 'childrenArea', label: t('projectForm.amenities.types.childrenArea') },
                    { key: 'laundry', label: t('projectForm.amenities.types.laundry') },
                    { key: 'storage', label: t('projectForm.amenities.types.storage') },
                    { key: 'cinema', label: t('projectForm.amenities.types.cinema') },
                    { key: 'theater', label: t('projectForm.amenities.types.theater') },
                    { key: 'library', label: t('projectForm.amenities.types.library') },
                    { key: 'postOffice', label: t('projectForm.amenities.types.postOffice') },
                    { key: 'gasStation', label: t('projectForm.amenities.types.gasStation') },
                    { key: 'carWash', label: t('projectForm.amenities.types.carWash') },
                    { key: 'veterinary', label: t('projectForm.amenities.types.veterinary') },
                    { key: 'beautyCenter', label: t('projectForm.amenities.types.beautyCenter') },
                    { key: 'dentist', label: t('projectForm.amenities.types.dentist') }
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
                    { key: 'securityService', label: t('projectForm.services.types.securityService') },
                    { key: 'hasConcierge', label: t('projectForm.services.types.hasConcierge') },
                    { key: 'videoSurveillance', label: t('projectForm.services.types.videoSurveillance') },
                    { key: 'hasLobby', label: t('projectForm.services.types.hasLobby') },
                    { key: 'hasDoorman', label: t('projectForm.services.types.hasDoorman') },
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
            {isLoading ? t('projectForm.saving') : t('projectForm.saveChanges')}
          </Button>
        </div>
      </form>
    </div>
  );
};