import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { projectApi } from "@/lib/api";
import {
  MapPin,
  Calendar,
  Building2,
  Eye,
  Shield,
  Users,
  ArrowLeft,
  Phone,
  Mail,
  Check,
  X,
  Camera,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface ProjectDetail {
  id: number;
  uuid: string;
  projectName: string;
  description?: string;
  street: string;
  streetNumber?: string;
  latitude?: number;
  longitude?: number;
  projectType: 'private_house' | 'apartment_building';
  deliveryStatus: 'completed_with_renovation' | 'green_frame' | 'black_frame' | 'white_frame';
  deliveryDate?: string;
  numberOfBuildings: number;
  totalApartments: number;
  numberOfFloors: number;
  parkingSpaces?: number;
  viewCount: number;
  createdAt: string;
  developerId: number;
  city: {
    id: number;
    nameGeorgian: string;
    nameEnglish?: string;
    nameRussian?: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn?: string;
    nameRu?: string;
  };
  developer?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  customAmenities?: {[key: string]: string};
  amenities?: Array<{
    id: number;
    amenityType: string;
    distance: string;
    nameGeorgian?: string;
    nameEnglish?: string;
  }>;
  photos?: Array<{
    id: number;
    url: string;
    fileName: string;
  }>;
  // Services
  securityService: boolean;
  hasLobby: boolean;
  hasConcierge: boolean;
  videoSurveillance: boolean;
  hasLighting: boolean;
  landscaping: boolean;
  yardCleaning: boolean;
  entranceCleaning: boolean;
  hasDoorman: boolean;
  fireSystem: boolean;
  mainDoorLock: boolean;
  maintenance: boolean;
  linkedProperties?: Array<{
    id: number;
    uuid?: string;
    title: string;
    propertyType: string;
    dealType: string;
    street?: string;
    streetNumber?: string;
    area: number;
    totalPrice: number;
    pricePerSqm?: number;
    rooms?: string;
    bedrooms?: string;
    bathrooms?: string;
    floor?: number;
    viewCount?: number;
    createdAt?: string;
    city?: {
      id: number;
      nameGeorgian: string;
      nameEnglish?: string;
      nameRussian?: string;
    };
    areaData?: {
      id: number;
      nameKa: string;
      nameEn?: string;
      nameRu?: string;
    };
    user?: {
      id: number;
      fullName: string;
    };
  }>;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('projects');
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [projectImages, setProjectImages] = useState<any[]>([]);

  // Reset photo index when images change
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [projectImages]);

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchProjectImages(id);
    }
  }, [id]);

  // Keyboard navigation for photo slideshow
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (projectImages && projectImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          prevPhoto();
        } else if (e.key === 'ArrowRight') {
          nextPhoto();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [projectImages]);

  const fetchProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      const data = await projectApi.getProjectById(projectId);
      
      if (!data) {
        toast({
          title: t('error.title'),
          description: t('projectDetail.notFound'),
          variant: "destructive",
        });
        navigate(`/${i18n.language}/projects`);
        return;
      }
      
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      if (error?.response?.status === 404) {
        toast({
          title: t('error.title'),
          description: t('projectDetail.notFound'),
          variant: "destructive",
        });
        navigate(`/${i18n.language}/projects`);
      } else {
        toast({
          title: t('error.title'),
          description: t('projectDetail.loadingError'),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectImages = async (projectId: string) => {
    try {
      const response = await fetch(`/api/upload/project/${projectId}/images`);
      if (response.ok) {
        const data = await response.json();
        setProjectImages(data.images || []);
      } else {
        console.error('Failed to fetch project images');
        setProjectImages([]);
      }
    } catch (error) {
      console.error('Error fetching project images:', error);
      setProjectImages([]);
    }
  };

  const getProjectTypeLabel = (type: string) => {
    return t(`projectTypes.${type}`, type);
  };

  const getDeliveryStatusLabel = (status: string) => {
    return t(`deliveryStatuses.${status}`, status);
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'completed_with_renovation':
        return 'bg-green-100 text-green-800';
      case 'green_frame':
        return 'bg-emerald-100 text-emerald-800';
      case 'black_frame':
        return 'bg-gray-100 text-gray-800';
      case 'white_frame':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const nextPhoto = () => {
    if (projectImages && projectImages.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === projectImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (projectImages && projectImages.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? projectImages.length - 1 : prev - 1
      );
    }
  };

  const BooleanIcon = ({ value }: { value: boolean }) => (
    value ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-red-600" />
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-10 px-4 pt-48">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">პროექტის ჩატვირთვა...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-10 px-4 pt-48">
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              პროექტი ვერ მოიძებნა
            </h3>
            <Button onClick={() => navigate('/projects')}>
              {t('projectDetail.backToProjects')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-48">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('projectDetail.backToProjects')}
          </Button>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.projectName}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {i18n.language === 'ka' ? project.city.nameGeorgian : i18n.language === 'ru' ? (project.city.nameRussian || project.city.nameGeorgian) : (project.city.nameEnglish || project.city.nameGeorgian)}
                    {project.areaData && `, ${i18n.language === 'ka' ? project.areaData.nameKa : i18n.language === 'ru' ? (project.areaData.nameRu || project.areaData.nameKa) : (project.areaData.nameEn || project.areaData.nameKa)}`}
                    , {project.street}
                    {project.streetNumber && ` ${project.streetNumber}`}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{project.viewCount} {t('projectDetail.views')}</span>
                  </div>
                  <span>{t('projectDetail.addedOn')}: {new Date(project.createdAt).toLocaleDateString(i18n.language === 'ka' ? 'ka-GE' : i18n.language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                </div>
              </div>
              <Badge className={getDeliveryStatusColor(project.deliveryStatus)}>
                {getDeliveryStatusLabel(project.deliveryStatus)}
              </Badge>
            </div>

            {project.description && (
              <p className="text-gray-700 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Content - Photos and Main Info */}
            <div className="xl:col-span-2 space-y-8">
              {/* Photo Slideshow */}
              {projectImages && projectImages.length > 0 ? (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                    <img
                      src={projectImages[currentPhotoIndex].urls?.medium || projectImages[currentPhotoIndex].urls?.original}
                      alt={projectImages[currentPhotoIndex].originalName || projectImages[currentPhotoIndex].fileName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {projectImages.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Photo Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {currentPhotoIndex + 1} / {projectImages.length}
                    </div>
                  </div>
                  
                  {/* Photo Thumbnails */}
                  {projectImages.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {projectImages.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentPhotoIndex 
                              ? 'border-primary shadow-md' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image.urls?.thumbnail || image.urls?.small || image.urls?.original}
                            alt={image.originalName || image.fileName}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">{t('projectDetail.noImages')}</p>
                    <p className="text-sm">{t('projectDetail.noImagesDescription')}</p>
                  </div>
                </div>
              )}
              
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {t('projectDetail.details')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">{t('projectDetail.buildings')}</div>
                      <div className="text-2xl font-bold text-primary">{project.numberOfBuildings}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">{t('projectDetail.apartments')}</div>
                      <div className="text-2xl font-bold text-primary">{project.totalApartments}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">{t('projectDetail.floors')}</div>
                      <div className="text-2xl font-bold text-primary">{project.numberOfFloors}</div>
                    </div>
                    {project.parkingSpaces && (
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">{t('projectDetail.parking')}</div>
                        <div className="text-2xl font-bold text-primary">{project.parkingSpaces}</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">{t('projectDetail.type')}</div>
                      <div className="text-sm font-medium text-gray-700">{getProjectTypeLabel(project.projectType)}</div>
                    </div>
                    {project.deliveryDate && (
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">{t('projectDetail.delivery')}</div>
                        <div className="text-sm font-medium text-gray-700">{new Date(project.deliveryDate).toLocaleDateString('ka-GE')}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('projectDetail.location')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[80px_1fr] gap-y-3 gap-x-4 items-center">
                    <span className="text-sm text-gray-500">{t('projectDetail.city')}:</span>
                    <span className="font-medium">{i18n.language === 'ka' ? project.city.nameGeorgian : i18n.language === 'ru' ? (project.city.nameRussian || project.city.nameGeorgian) : (project.city.nameEnglish || project.city.nameGeorgian)}</span>
                    
                    {project.areaData && (
                      <>
                        <span className="text-sm text-gray-500">{t('projectDetail.area')}:</span>
                        <span className="font-medium">{i18n.language === 'ka' ? project.areaData.nameKa : i18n.language === 'ru' ? (project.areaData.nameRu || project.areaData.nameKa) : (project.areaData.nameEn || project.areaData.nameKa)}</span>
                      </>
                    )}
                    
                    <span className="text-sm text-gray-500">{t('projectDetail.address')}:</span>
                    <span className="font-medium">{project.street}{project.streetNumber && ` ${project.streetNumber}`}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {project.amenities && project.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('projectDetail.amenities')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Amenity labels with translations and emojis
                      const amenityLabels: {[key: string]: string} = {
                        pharmacy: '💊 ' + t('projectDetail.amenityTypes.pharmacy'),
                        kindergarten: '👶 ' + t('projectDetail.amenityTypes.kindergarten'),
                        school: '🎒 ' + t('projectDetail.amenityTypes.school'),
                        university: '🎓 ' + t('projectDetail.amenityTypes.university'),
                        hospital: '🏥 ' + t('projectDetail.amenityTypes.hospital'),
                        clinic: '🩺 ' + t('projectDetail.amenityTypes.clinic'),
                        busStop: '🚌 ' + t('projectDetail.amenityTypes.busStop'),
                        bus_stop: '🚌 ' + t('projectDetail.amenityTypes.bus_stop'),
                        metro: '🚇 ' + t('projectDetail.amenityTypes.metro'),
                        groceryStore: '🛒 ' + t('projectDetail.amenityTypes.groceryStore'),
                        grocery_store: '🛒 ' + t('projectDetail.amenityTypes.grocery_store'),
                        supermarket: '🏬 ' + t('projectDetail.amenityTypes.supermarket'),
                        mall: '🏢 ' + t('projectDetail.amenityTypes.mall'),
                        bank: '🏦 ' + t('projectDetail.amenityTypes.bank'),
                        atm: '💳 ' + t('projectDetail.amenityTypes.atm'),
                        restaurant: '🍽️ ' + t('projectDetail.amenityTypes.restaurant'),
                        cafe: '☕ ' + t('projectDetail.amenityTypes.cafe'),
                        bakery: '🥖 ' + t('projectDetail.amenityTypes.bakery'),
                        sportsCenter: '🏋️ ' + t('projectDetail.amenityTypes.sportsCenter'),
                        sports_center: '🏋️ ' + t('projectDetail.amenityTypes.sports_center'),
                        stadium: '🏟️ ' + t('projectDetail.amenityTypes.stadium'),
                        swimmingPool: '🏊 ' + t('projectDetail.amenityTypes.swimmingPool'),
                        swimming_pool: '🏊 ' + t('projectDetail.amenityTypes.swimming_pool'),
                        park: '🌳 ' + t('projectDetail.amenityTypes.park'),
                        square: '🏛️ ' + t('projectDetail.amenityTypes.square'),
                        cinema: '🎬 ' + t('projectDetail.amenityTypes.cinema'),
                        theater: '🎭 ' + t('projectDetail.amenityTypes.theater'),
                        library: '📚 ' + t('projectDetail.amenityTypes.library'),
                        postOffice: '📫 ' + t('projectDetail.amenityTypes.postOffice'),
                        post_office: '📫 ' + t('projectDetail.amenityTypes.post_office'),
                        gasStation: '⛽ ' + t('projectDetail.amenityTypes.gasStation'),
                        gas_station: '⛽ ' + t('projectDetail.amenityTypes.gas_station'),
                        carWash: '🚗 ' + t('projectDetail.amenityTypes.carWash'),
                        car_wash: '🚗 ' + t('projectDetail.amenityTypes.car_wash'),
                        veterinary: '🐕 ' + t('projectDetail.amenityTypes.veterinary'),
                        beautyCenter: '💄 ' + t('projectDetail.amenityTypes.beautyCenter'),
                        beauty_center: '💄 ' + t('projectDetail.amenityTypes.beauty_center'),
                        dentist: '🦷 ' + t('projectDetail.amenityTypes.dentist'),
                        gym: '💪 ' + t('projectDetail.amenityTypes.gym'),
                        garden: '🌳 ' + t('projectDetail.amenityTypes.garden'),
                        parking: '🚗 ' + t('projectDetail.amenityTypes.parking'),
                        laundry: '🧺 ' + t('projectDetail.amenityTypes.laundry'),
                        storage: '📦 ' + t('projectDetail.amenityTypes.storage'),
                        childrenArea: '🎪 ' + t('projectDetail.amenityTypes.childrenArea'),
                        children_area: '🎪 ' + t('projectDetail.amenityTypes.children_area'),
                        bikePath: '🚴 ' + t('projectDetail.amenityTypes.bikePath'),
                        bike_path: '🚴 ' + t('projectDetail.amenityTypes.bike_path'),
                        sportsField: '⚽ ' + t('projectDetail.amenityTypes.sportsField'),
                        sports_field: '⚽ ' + t('projectDetail.amenityTypes.sports_field')
                      };

                      // Group amenities by distance
                      const amenitiesByDistance = project.amenities.reduce((acc: {[key: string]: any[]}, amenity) => {
                        const distance = amenity.distance;
                        if (!acc[distance]) {
                          acc[distance] = [];
                        }
                        acc[distance].push(amenity);
                        return acc;
                      }, {});

                      const distanceSections = [
                        { key: 'on_site', title: '🏢 ' + t('projectDetail.distances.onSite'), color: 'bg-gray-50' },
                        { key: 'within_300m', title: '📍 ' + t('projectDetail.distances.within300m'), color: '' },
                        { key: 'within_500m', title: '📍 ' + t('projectDetail.distances.within500m'), color: '' },
                        { key: 'within_1km', title: '📍 ' + t('projectDetail.distances.within1km'), color: '' }
                      ];

                      return (
                        <div className="space-y-6">
                          {distanceSections.map((section, index) => {
                            const amenitiesInSection = amenitiesByDistance[section.key];
                            if (!amenitiesInSection || amenitiesInSection.length === 0) {
                              return null;
                            }

                            return (
                              <div key={section.key}>
                                <div className={`${section.color} p-4 rounded-lg`}>
                                  <h4 className="font-semibold text-gray-800 mb-3">{section.title}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {amenitiesInSection.map((amenity) => (
                                      <div key={amenity.id} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <span className="text-sm">{amenityLabels[amenity.amenityType] || amenity.amenityType}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {index < distanceSections.length - 1 && <Separator className="my-4" />}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Services - Only show services that are true */}
              {(() => {
                const availableServices = [
                  { key: 'securityService', label: t('projectDetail.serviceTypes.securityService'), value: project.securityService },
                  { key: 'hasLobby', label: t('projectDetail.serviceTypes.hasLobby'), value: project.hasLobby },
                  { key: 'hasConcierge', label: t('projectDetail.serviceTypes.hasConcierge'), value: project.hasConcierge },
                  { key: 'videoSurveillance', label: t('projectDetail.serviceTypes.videoSurveillance'), value: project.videoSurveillance },
                  { key: 'hasLighting', label: t('projectDetail.serviceTypes.hasLighting'), value: project.hasLighting },
                  { key: 'landscaping', label: t('projectDetail.serviceTypes.landscaping'), value: project.landscaping },
                  { key: 'yardCleaning', label: t('projectDetail.serviceTypes.yardCleaning'), value: project.yardCleaning },
                  { key: 'entranceCleaning', label: t('projectDetail.serviceTypes.entranceCleaning'), value: project.entranceCleaning },
                  { key: 'hasDoorman', label: t('projectDetail.serviceTypes.hasDoorman'), value: project.hasDoorman },
                  { key: 'fireSystem', label: t('projectDetail.serviceTypes.fireSystem'), value: project.fireSystem },
                  { key: 'mainDoorLock', label: t('projectDetail.serviceTypes.mainDoorLock'), value: project.mainDoorLock },
                  { key: 'maintenance', label: t('projectDetail.serviceTypes.maintenance'), value: project.maintenance }
                ].filter(service => service.value === true);

                return availableServices.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {t('projectDetail.services')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {availableServices.map((service) => (
                          <div key={service.key} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>{service.label}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              })()}
            </div>

            {/* Right Sidebar - Developer Info */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('projectDetail.developer')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {project.developer?.fullName || `${t('projectDetail.developer')} ID: ${project.developerId}`}
                      </h3>
                    </div>
                    
                    <Separator />
                    
                    {project.developer?.email && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                          <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm break-all">{project.developer.email}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {project.developer?.phone ? (
                        <>
                          {!showPhone ? (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setShowPhone(true)}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              {t('projectDetail.showPhone')}
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                                <Phone className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">{project.developer?.phone}</span>
                              </div>
                              <Button
                                variant="default"
                                className="w-full"
                                onClick={() => {
                                  navigator.clipboard.writeText(project.developer?.phone!);
                                  toast({
                                    title: "ნომერი დაკოპირდა",
                                    description: project.developer?.phone,
                                  });
                                }}
                              >
                                {t('projectDetail.copyPhone')}
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          {t('projectDetail.phoneUnavailable')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* All Apartments - Full Width */}
          {project?.linkedProperties && project.linkedProperties.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {t('projectDetail.allApartmentsInProject', { count: project.linkedProperties.length })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.linkedProperties.map((property) => (
                      <Card key={property.id} className="hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-primary/30 hover:border-l-primary" onClick={() => navigate(`/${i18n.language}/property/${property.id}`)}>
                        <CardContent className="p-0">
                          <div className="flex min-h-[140px]">
                            {/* Property Photo */}
                            <div className="w-36 flex-shrink-0 bg-gray-100 rounded-l-lg overflow-hidden">
                              <img
                                src="/placeholder.svg"
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Property Info */}
                            <div className="flex-1 p-4">
                              <div className="h-full flex flex-col justify-between space-y-2">
                                {/* Title */}
                                <h3 className="font-semibold text-base line-clamp-2 text-gray-900 leading-tight">
                                  {property.title}
                                </h3>
                                
                                {/* Price per sqm (most prominent) */}
                                <div className="flex items-baseline gap-2">
                                  {property.pricePerSqm ? (
                                    <div className="text-xl font-bold text-primary">
                                      ₾{new Intl.NumberFormat('ka-GE').format(property.pricePerSqm)}
                                    </div>
                                  ) : (
                                    <div className="text-xl font-bold text-primary">
                                      ₾{Math.round(property.totalPrice / property.area).toLocaleString()}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500">{t('projectDetail.perSqm')}</div>
                                </div>
                                
                                {/* Key Info with Badges */}
                                <div className="flex gap-1.5 flex-wrap">
                                  {/* Area Badge */}
                                  <Badge variant="secondary" className="text-xs px-2 py-1">
                                    {property.area} {t('projectDetail.sqm')}
                                  </Badge>
                                  
                                  {/* Rooms Badge */}
                                  {property.rooms && (
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                      {property.rooms} {t('projectDetail.rooms')}
                                    </Badge>
                                  )}
                                  
                                  {/* Bedrooms Badge */}
                                  {property.bedrooms && (
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                      {property.bedrooms} {t('projectDetail.bedrooms')}
                                    </Badge>
                                  )}
                                  
                                  {/* Floor Badge */}
                                  <Badge variant="outline" className="text-xs px-2 py-1">
                                    {t('projectDetail.floor', { floor: property.floor || 1 })}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;