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
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { PhotoGallerySection } from "../../../Dashboard/pages/AddProperty/components/PhotoGallerySection";

interface City {
  id: number;
  nameGeorgian: string;
  nameEnglish?: string;
  nameRussian?: string;
}

interface Area {
  id: number;
  nameKa: string;
  nameEn?: string;
  nameRu?: string;
}

const AdminEditProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('admin');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [projectOwner, setProjectOwner] = useState<any>(null);

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
    // Additional amenities
    hasBikePath: false,
    hasChildrenArea: false,
    hasGarden: false,
    hasGroceryStore: false,
    hasGym: false,
    hasLaundry: false,
    hasParking: false,
    hasRestaurant: false,
    hasSportsField: false,
    hasSquare: false,
    hasStorage: false,
    hasSwimmingPool: false,
  });

  const [customAmenities, setCustomAmenities] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadData = async () => {
      await fetchCities();
      if (id) {
        await fetchProject();
      }
    };
    loadData();
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
      console.log('Admin fetching project with ID:', id);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Try admin-specific endpoint first
      let response = await fetch(`${apiUrl}/admin/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Admin project fetch response status:', response.status);
      
      // If admin endpoint doesn't work, try regular endpoint
      if (response.status === 404 || !response.ok) {
        console.log('Admin endpoint failed, trying regular project endpoint...');
        response = await fetch(`${apiUrl}/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Regular project fetch response status:', response.status);
      }

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: t('common.error'),
            description: t('editProject.messages.notFound'),
            variant: "destructive",
          });
          navigate(getLanguageUrl('admin/projects', i18n.language));
          return;
        }
        throw new Error('Failed to fetch project');
      }

      const result = await response.json();
      
      // Extract the actual project data from the response
      const project = result.data || result;
      
      // Store project owner info
      setProjectOwner(project.developer || project.user || null);
      
      // If project has a cityId, fetch areas for that city first
      if (project.cityId) {
        await fetchAreas(project.cityId);
      }
      
      // Convert project data to form format
      const newFormData = {
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
        
        // Additional amenities from the project data
        hasBikePath: project.hasBikePath || false,
        hasChildrenArea: project.hasChildrenArea || false,
        hasGarden: project.hasGarden || false,
        hasGroceryStore: project.hasGroceryStore || false,
        hasGym: project.hasGym || false,
        hasLaundry: project.hasLaundry || false,
        hasParking: project.hasParking || false,
        hasRestaurant: project.hasRestaurant || false,
        hasSportsField: project.hasSportsField || false,
        hasSquare: project.hasSquare || false,
        hasStorage: project.hasStorage || false,
        hasSwimmingPool: project.hasSwimmingPool || false,
      };
      
      setFormData(newFormData);

      // Convert amenities from project data to customAmenities format
      const amenitiesMap: {[key: string]: string} = {};
      
      // Map distance-based amenities from project data
      const distanceBasedAmenities = [
        'pharmacy', 'kindergarten', 'school', 'university', 'hospital', 'clinic',
        'busStop', 'metro', 'groceryStore', 'supermarket', 'mall', 'bank', 'atm',
        'restaurant', 'cafe', 'bakery', 'sportsCenter', 'gym', 'stadium', 'swimmingPool',
        'park', 'garden', 'square', 'parking', 'bikePath', 'sportsField', 'childrenArea',
        'laundry', 'storage', 'cinema', 'theater', 'library', 'postOffice', 'gasStation',
        'carWash', 'veterinary', 'beautyCenter', 'dentist'
      ];
      
      // Check for each amenity type at different distances
      distanceBasedAmenities.forEach(amenityType => {
        if (project[`${amenityType}300m`]) {
          amenitiesMap[amenityType] = '300m';
        } else if (project[`${amenityType}500m`]) {
          amenitiesMap[amenityType] = '500m';
        } else if (project[`${amenityType}1km`]) {
          amenitiesMap[amenityType] = '1km';
        } else if (project[`${amenityType}OnSite`] || project[`has${amenityType.charAt(0).toUpperCase() + amenityType.slice(1)}`]) {
          amenitiesMap[amenityType] = 'onSite';
        }
      });
      
      // Convert amenities array format (if exists)
      if (project.amenities && Array.isArray(project.amenities)) {
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
      }
      
      // Fallback for customAmenities format
      if (project.customAmenities && typeof project.customAmenities === 'object') {
        Object.assign(amenitiesMap, project.customAmenities);
      }
      
      setCustomAmenities(amenitiesMap);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: t('common.error'),
        description: t('editProject.messages.loadError'),
        variant: "destructive",
      });
      navigate(getLanguageUrl('admin/projects', i18n.language));
    } finally {
      setIsFetching(false);
    }
  };

  const fetchCities = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/cities`);
      
      if (response.ok) {
        const result = await response.json();
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/areas?cityId=${cityId}`);
      if (response.ok) {
        const result = await response.json();
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

  // Helper function to get city name based on language
  const getCityName = (city: City) => {
    if (i18n.language === 'en' && city.nameEnglish) {
      return city.nameEnglish;
    } else if (i18n.language === 'ru' && city.nameRussian) {
      return city.nameRussian;
    }
    return city.nameGeorgian;
  };

  // Helper function to get area name based on language
  const getAreaName = (area: Area) => {
    if (i18n.language === 'en' && area.nameEn) {
      return area.nameEn;
    } else if (i18n.language === 'ru' && area.nameRu) {
      return area.nameRu;
    }
    return area.nameKa;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      // Only include fields that actually exist in the Project entity
      const projectData = {
        // Basic Information
        projectName: formData.projectName,
        description: formData.description,
        
        // Location
        cityId: parseInt(formData.cityId),
        areaId: formData.areaId ? parseInt(formData.areaId) : undefined,
        street: formData.street,
        streetNumber: formData.streetNumber,
        
        // Project Details  
        projectType: formData.projectType,
        deliveryStatus: formData.deliveryStatus,
        deliveryDate: formData.deliveryDate || undefined,
        numberOfBuildings: parseInt(formData.numberOfBuildings),
        totalApartments: parseInt(formData.totalApartments),
        numberOfFloors: parseInt(formData.numberOfFloors),
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : undefined,
        
        
        // Post-handover services
        securityService: formData.securityService,
        hasLobby: formData.hasLobby,
        hasConcierge: formData.hasConcierge,
        videoSurveillance: formData.videoSurveillance,
        hasLighting: formData.hasLighting,
        landscaping: formData.landscaping,
        yardCleaning: formData.yardCleaning,
        entranceCleaning: formData.entranceCleaning,
        hasDoorman: formData.hasDoorman,
        fireSystem: formData.fireSystem,
        mainDoorLock: formData.mainDoorLock,
        maintenance: formData.maintenance,
        
        // Custom amenities for fields not in the entity
        customAmenities: customAmenities,
      };


      // Try admin-specific endpoint first for updates
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      let response = await fetch(`${apiUrl}/admin/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(projectData),
      });

      // If admin endpoint doesn't work, try regular endpoint
      if (response.status === 404 || response.status === 403) {
        response = await fetch(`${apiUrl}/projects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(projectData),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        
        // Handle specific error cases
        if (response.status === 404) {
          toast({
            title: t('editProject.messages.notFound'),
            description: t('editProject.messages.noProjectWithId'),
            variant: "destructive",
          });
          return;
        }
        
        if (response.status === 403) {
          toast({
            title: t('editProject.messages.accessDenied'),
            description: t('editProject.messages.noEditPermission'),
            variant: "destructive",
          });
          return;
        }
        
        throw new Error(`Update failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      toast({
        title: t('common.success'),
        description: t('editProject.messages.updated'),
      });

      navigate(getLanguageUrl('admin/projects', i18n.language));
    } catch (error: any) {
      console.error('Error updating project:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      
      toast({
        title: t('common.error'),
        description: t('editProject.messages.updateError', { error: error.message }),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(getLanguageUrl('admin/projects', i18n.language))}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-2xl font-bold mb-2">{t('editProject.title')}</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
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
          onClick={() => navigate(getLanguageUrl('admin/projects', i18n.language))}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">{t('editProject.title')}</h1>
        <div className="space-y-1">
          <p className="text-gray-600">Project #{id}</p>
          {projectOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>{t('editProject.labels.projectOwner')}:</strong> {projectOwner.fullName || projectOwner.name} ({projectOwner.email})
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {t('editProject.labels.adminNote')}
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">{t('editProject.tabs.basic')}</TabsTrigger>
            <TabsTrigger value="amenities">{t('editProject.tabs.amenities')}</TabsTrigger>
            <TabsTrigger value="services">{t('editProject.tabs.services')}</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('editProject.sections.projectInfo.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">{t('editProject.fields.projectName')} *</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectType">{t('editProject.fields.projectType')} *</Label>
                    <Select
                      value={formData.projectType || ""}
                      onValueChange={(value) => handleInputChange('projectType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('editProject.placeholders.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private_house">{t('editProject.projectTypes.privateHouse')}</SelectItem>
                        <SelectItem value="apartment_building">{t('editProject.projectTypes.apartmentBuilding')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">{t('editProject.fields.description')}</Label>
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
                  {t('editProject.sections.location.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cityId">{t('editProject.fields.city')} *</Label>
                    <Select
                      value={formData.cityId || ""}
                      onValueChange={(value) => handleInputChange('cityId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('editProject.placeholders.selectCity')} />
                      </SelectTrigger>
                      <SelectContent>
                        {(cities || []).map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {getCityName(city)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="areaId">{t('editProject.fields.area')}</Label>
                    <Select
                      value={formData.areaId || ""}
                      onValueChange={(value) => handleInputChange('areaId', value)}
                      disabled={!formData.cityId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('editProject.placeholders.selectArea')} />
                      </SelectTrigger>
                      <SelectContent>
                        {(areas || []).map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {getAreaName(area)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="street">{t('editProject.fields.street')} *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="streetNumber">{t('editProject.fields.streetNumber')}</Label>
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
                  {t('editProject.sections.details.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryStatus">{t('editProject.fields.deliveryStatus')} *</Label>
                    <Select
                      value={formData.deliveryStatus || ""}
                      onValueChange={(value) => handleInputChange('deliveryStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('editProject.placeholders.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed_with_renovation">{t('editProject.deliveryStatuses.completedWithRenovation')}</SelectItem>
                        <SelectItem value="green_frame">{t('editProject.deliveryStatuses.greenFrame')}</SelectItem>
                        <SelectItem value="black_frame">{t('editProject.deliveryStatuses.blackFrame')}</SelectItem>
                        <SelectItem value="white_frame">{t('editProject.deliveryStatuses.whiteFrame')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate">{t('editProject.fields.deliveryDate')}</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="numberOfBuildings">{t('editProject.fields.numberOfBuildings')} *</Label>
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
                    <Label htmlFor="totalApartments">{t('editProject.fields.totalApartments')} *</Label>
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
                    <Label htmlFor="numberOfFloors">{t('editProject.fields.numberOfFloors')} *</Label>
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
                    <Label htmlFor="parkingSpaces">{t('editProject.fields.parkingSpaces')}</Label>
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
              projectId={id ? parseInt(id) : undefined}
              entityType="project"
              onImagesChange={(images) => {
                console.log('Project images updated in AWS:', images);
              }}
            />
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-6">

            {/* Distance-based amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('editProject.sections.amenitiesByDistance.title')}
                </CardTitle>
                <CardDescription>{t('editProject.sections.amenitiesByDistance.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const amenityTypes = [
                    { key: 'pharmacy', label: `💊 ${t('editProject.amenityTypes.pharmacy')}` },
                    { key: 'kindergarten', label: `👶 ${t('editProject.amenityTypes.kindergarten')}` },
                    { key: 'school', label: `🎒 ${t('editProject.amenityTypes.school')}` },
                    { key: 'university', label: `🎓 ${t('editProject.amenityTypes.university')}` },
                    { key: 'hospital', label: `🏥 ${t('editProject.amenityTypes.hospital')}` },
                    { key: 'clinic', label: `🩺 ${t('editProject.amenityTypes.clinic')}` },
                    { key: 'busStop', label: `🚌 ${t('editProject.amenityTypes.busStop')}` },
                    { key: 'metro', label: `🚇 ${t('editProject.amenityTypes.metro')}` },
                    { key: 'groceryStore', label: `🛒 ${t('editProject.amenityTypes.groceryStore')}` },
                    { key: 'supermarket', label: `🏬 ${t('editProject.amenityTypes.supermarket')}` },
                    { key: 'mall', label: `🏢 ${t('editProject.amenityTypes.mall')}` },
                    { key: 'bank', label: `🏦 ${t('editProject.amenityTypes.bank')}` },
                    { key: 'atm', label: `💳 ${t('editProject.amenityTypes.atm')}` },
                    { key: 'restaurant', label: `🍽️ ${t('editProject.amenityTypes.restaurant')}` },
                    { key: 'cafe', label: `☕ ${t('editProject.amenityTypes.cafe')}` },
                    { key: 'bakery', label: `🥖 ${t('editProject.amenityTypes.bakery')}` },
                    { key: 'sportsCenter', label: `🏋️ ${t('editProject.amenityTypes.sportsCenter')}` },
                    { key: 'gym', label: `💪 ${t('editProject.amenityTypes.gym')}` },
                    { key: 'stadium', label: `🏟️ ${t('editProject.amenityTypes.stadium')}` },
                    { key: 'swimmingPool', label: `🏊 ${t('editProject.amenityTypes.swimmingPool')}` },
                    { key: 'park', label: `🌳 ${t('editProject.amenityTypes.park')}` },
                    { key: 'garden', label: `🌳 ${t('editProject.amenityTypes.garden')}` },
                    { key: 'square', label: `🏛️ ${t('editProject.amenityTypes.square')}` },
                    { key: 'parking', label: `🚗 ${t('editProject.amenityTypes.parking')}` },
                    { key: 'bikePath', label: `🚴 ${t('editProject.amenityTypes.bikePath')}` },
                    { key: 'sportsField', label: `⚽ ${t('editProject.amenityTypes.sportsField')}` },
                    { key: 'childrenArea', label: `🎪 ${t('editProject.amenityTypes.childrenArea')}` },
                    { key: 'laundry', label: `🧺 ${t('editProject.amenityTypes.laundry')}` },
                    { key: 'storage', label: `📦 ${t('editProject.amenityTypes.storage')}` },
                    { key: 'cinema', label: `🎬 ${t('editProject.amenityTypes.cinema')}` },
                    { key: 'theater', label: `🎭 ${t('editProject.amenityTypes.theater')}` },
                    { key: 'library', label: `📚 ${t('editProject.amenityTypes.library')}` },
                    { key: 'postOffice', label: `📫 ${t('editProject.amenityTypes.postOffice')}` },
                    { key: 'gasStation', label: `⛽ ${t('editProject.amenityTypes.gasStation')}` },
                    { key: 'carWash', label: `🚗 ${t('editProject.amenityTypes.carWash')}` },
                    { key: 'veterinary', label: `🐕 ${t('editProject.amenityTypes.veterinary')}` },
                    { key: 'beautyCenter', label: `💄 ${t('editProject.amenityTypes.beautyCenter')}` },
                    { key: 'dentist', label: `🦷 ${t('editProject.amenityTypes.dentist')}` }
                  ];

                  const distances = [
                    { key: 'onSite', label: t('editProject.distances.onSite'), color: 'bg-green-100 text-green-800' },
                    { key: '300m', label: t('editProject.distances.300m'), color: 'bg-blue-100 text-blue-800' },
                    { key: '500m', label: t('editProject.distances.500m'), color: 'bg-purple-100 text-purple-800' },
                    { key: '1km', label: t('editProject.distances.1km'), color: 'bg-orange-100 text-orange-800' }
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
                  {t('editProject.sections.services.title')}
                </CardTitle>
                <CardDescription>{t('editProject.sections.services.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'securityService', label: `🛡️ ${t('editProject.services.securityService')}` },
                    { key: 'hasConcierge', label: `🛎️ ${t('editProject.services.hasConcierge')}` },
                    { key: 'videoSurveillance', label: `📹 ${t('editProject.services.videoSurveillance')}` },
                    { key: 'hasLobby', label: `🏛️ ${t('editProject.services.hasLobby')}` },
                    { key: 'hasDoorman', label: `🚪 ${t('editProject.services.hasDoorman')}` },
                    { key: 'yardCleaning', label: `🧹 ${t('editProject.services.yardCleaning')}` },
                    { key: 'entranceCleaning', label: `🚪 ${t('editProject.services.entranceCleaning')}` },
                    { key: 'landscaping', label: `🌺 ${t('editProject.services.landscaping')}` },
                    { key: 'hasLighting', label: `💡 ${t('editProject.services.hasLighting')}` },
                    { key: 'fireSystem', label: `🔥 ${t('editProject.services.fireSystem')}` },
                    { key: 'mainDoorLock', label: `🔒 ${t('editProject.services.mainDoorLock')}` },
                    { key: 'maintenance', label: `🔧 ${t('editProject.services.maintenance')}` }
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
            onClick={() => navigate(getLanguageUrl('admin/projects', i18n.language))}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('common.saving') : t('editProject.buttons.saveChanges')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProject;