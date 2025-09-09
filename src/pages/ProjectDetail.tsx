import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
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
  };
  areaData?: {
    id: number;
    nameKa: string;
  };
  developer: {
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
    };
    areaData?: {
      id: number;
      nameKa: string;
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
  const { t } = useTranslation('projects');
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  // Keyboard navigation for photo slideshow
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (project?.photos && project.photos.length > 1) {
        if (e.key === 'ArrowLeft') {
          prevPhoto();
        } else if (e.key === 'ArrowRight') {
          nextPhoto();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [project?.photos]);

  const fetchProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: t('error.title'),
            description: t('projectDetail.notFound'),
            variant: "destructive",
          });
          navigate('/projects');
          return;
        }
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      
      // Add mock photos for testing
      data.photos = [
        { id: 1, url: '/placeholder.svg', fileName: 'project-exterior-1.jpg' },
        { id: 2, url: '/placeholder.svg', fileName: 'project-exterior-2.jpg' },
        { id: 3, url: '/placeholder.svg', fileName: 'project-interior-1.jpg' },
        { id: 4, url: '/placeholder.svg', fileName: 'project-lobby.jpg' },
        { id: 5, url: '/placeholder.svg', fileName: 'project-courtyard.jpg' },
        { id: 6, url: '/placeholder.svg', fileName: 'project-building.jpg' }
      ];
      
      // Developer phone will come from real API data
      
      // linkedProperties will come from API only - no mock data
      
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: t('error.title'),
        description: t('projectDetail.loadingError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    if (project?.photos && project.photos.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === project.photos!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (project?.photos && project.photos.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? project.photos!.length - 1 : prev - 1
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
              უკან დაბრუნება
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
            უკან დაბრუნება
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
                    {project.city.nameGeorgian}
                    {project.areaData && `, ${project.areaData.nameKa}`}
                    , {project.street}
                    {project.streetNumber && ` ${project.streetNumber}`}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{project.viewCount} ნახვა</span>
                  </div>
                  <span>დაემატა: {new Date(project.createdAt).toLocaleDateString('ka-GE')}</span>
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
              {project.photos && project.photos.length > 0 && (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                    <img
                      src={project.photos[currentPhotoIndex].url}
                      alt={project.photos[currentPhotoIndex].fileName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {project.photos.length > 1 && (
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
                      {currentPhotoIndex + 1} / {project.photos.length}
                    </div>
                  </div>
                  
                  {/* Photo Thumbnails */}
                  {project.photos.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {project.photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentPhotoIndex 
                              ? 'border-primary shadow-md' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.fileName}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    პროექტის დეტალები
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">კორპუსი</div>
                      <div className="text-2xl font-bold text-primary">{project.numberOfBuildings}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">ბინა</div>
                      <div className="text-2xl font-bold text-primary">{project.totalApartments}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">სართული</div>
                      <div className="text-2xl font-bold text-primary">{project.numberOfFloors}</div>
                    </div>
                    {project.parkingSpaces && (
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">პარკინგი</div>
                        <div className="text-2xl font-bold text-primary">{project.parkingSpaces}</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">ტიპი</div>
                      <div className="text-sm font-medium text-gray-700">{getProjectTypeLabel(project.projectType)}</div>
                    </div>
                    {project.deliveryDate && (
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">ჩაბარება</div>
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
                    ლოკაცია
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[80px_1fr] gap-y-3 gap-x-4 items-center">
                    <span className="text-sm text-gray-500">ქალაქი:</span>
                    <span className="font-medium">{project.city.nameGeorgian}</span>
                    
                    {project.areaData && (
                      <>
                        <span className="text-sm text-gray-500">რაიონი:</span>
                        <span className="font-medium">{project.areaData.nameKa}</span>
                      </>
                    )}
                    
                    <span className="text-sm text-gray-500">მისამართი:</span>
                    <span className="font-medium">{project.street}{project.streetNumber && ` ${project.streetNumber}`}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {project.amenities && project.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>კომფორტი და მანძილები</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Amenity labels in Georgian
                      const amenityLabels: {[key: string]: string} = {
                        pharmacy: '💊 აფთიაქი',
                        kindergarten: '👶 საბავშვო ბაღი',
                        school: '🎒 სკოლა',
                        university: '🎓 უნივერსიტეტი',
                        hospital: '🏥 საავადმყოფო',
                        clinic: '🩺 კლინიკა',
                        busStop: '🚌 ავტობუსის გაჩერება',
                        bus_stop: '🚌 ავტობუსის გაჩერება',
                        metro: '🚇 მეტრო',
                        groceryStore: '🛒 საყიდლების მაღაზია',
                        grocery_store: '🛒 საყიდლების მაღაზია',
                        supermarket: '🏬 სუპერმარკეტი',
                        mall: '🏢 სავაჭრო ცენტრი',
                        bank: '🏦 ბანკი',
                        atm: '💳 ბანკომატი',
                        restaurant: '🍽️ რესტორანი',
                        cafe: '☕ კაფე',
                        bakery: '🥖 საცხობი',
                        sportsCenter: '🏋️ სპორტული ცენტრი',
                        sports_center: '🏋️ სპორტული ცენტრი',
                        stadium: '🏟️ სტადიონი',
                        swimmingPool: '🏊 საცურაო აუზი',
                        swimming_pool: '🏊 საცურაო აუზი',
                        park: '🌳 პარკი',
                        square: '🏛️ მოედანი',
                        cinema: '🎬 კინო',
                        theater: '🎭 თეატრი',
                        library: '📚 ბიბლიოთეკა',
                        postOffice: '📫 ფოსტის განყოფილება',
                        post_office: '📫 ფოსტის განყოფილება',
                        gasStation: '⛽ ბენზინგასამართი სადგური',
                        gas_station: '⛽ ბენზინგასამართი სადგური',
                        carWash: '🚗 ავტორეცხვა',
                        car_wash: '🚗 ავტორეცხვა',
                        veterinary: '🐕 ვეტერინარული კლინიკა',
                        beautyCenter: '💄 სილამაზის სალონი',
                        beauty_center: '💄 სილამაზის სალონი',
                        dentist: '🦷 სტომატოლოგია',
                        gym: '💪 სპორტული დარბაზი',
                        garden: '🌳 ბაღი',
                        parking: '🚗 პარკინგი',
                        laundry: '🧺 სამრეცხაო',
                        storage: '📦 საწყობი',
                        childrenArea: '🎪 ბავშვთა მოედანი',
                        children_area: '🎪 ბავშვთა მოედანი',
                        bikePath: '🚴 ველოსიპედის ბილიკი',
                        bike_path: '🚴 ველოსიპედის ბილიკი',
                        sportsField: '⚽ სპორტული მოედანი',
                        sports_field: '⚽ სპორტული მოედანი'
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
                        { key: 'on_site', title: '🏢 პროექტის ტერიტორიაზე', color: 'bg-gray-50' },
                        { key: 'within_300m', title: '📍 300 მეტრის რადიუსში', color: '' },
                        { key: 'within_500m', title: '📍 500 მეტრის რადიუსში', color: '' },
                        { key: 'within_1km', title: '📍 1 კილომეტრის რადიუსში', color: '' }
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
                  { key: 'securityService', label: 'უსაფრთხოების სერვისი', value: project.securityService },
                  { key: 'hasLobby', label: 'ლობი', value: project.hasLobby },
                  { key: 'hasConcierge', label: 'კონსიერჟი', value: project.hasConcierge },
                  { key: 'videoSurveillance', label: 'ვიდეო ზედამხედველობა', value: project.videoSurveillance },
                  { key: 'hasLighting', label: 'განათება', value: project.hasLighting },
                  { key: 'landscaping', label: 'ლანდშაფტის დიზაინი', value: project.landscaping },
                  { key: 'yardCleaning', label: 'ეზოს დალაგება', value: project.yardCleaning },
                  { key: 'entranceCleaning', label: 'შესასვლელის დალაგება', value: project.entranceCleaning },
                  { key: 'hasDoorman', label: 'კარისკაცი', value: project.hasDoorman },
                  { key: 'fireSystem', label: 'ხანძრის ჩაქრობის სისტემა', value: project.fireSystem },
                  { key: 'mainDoorLock', label: 'მთავარი კარის საკეტი', value: project.mainDoorLock },
                  { key: 'maintenance', label: 'ტექნიკური მომსახურება', value: project.maintenance }
                ].filter(service => service.value === true);

                return availableServices.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        ჩაბარების შემდგომ სერვისები
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
                    დეველოპერი
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{project.developer.fullName}</h3>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm break-all">{project.developer.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {project.developer.phone ? (
                        <>
                          {!showPhone ? (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setShowPhone(true)}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              ნომრის ნახვა
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                                <Phone className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">{project.developer.phone}</span>
                              </div>
                              <Button
                                variant="default"
                                className="w-full"
                                onClick={() => {
                                  navigator.clipboard.writeText(project.developer.phone!);
                                  toast({
                                    title: "ნომერი დაკოპირდა",
                                    description: project.developer.phone,
                                  });
                                }}
                              >
                                ნომრის კოპირება
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
                          ნომერი მიუწვდომელია
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
                    ყველა {project.linkedProperties.length} ბინა პროექტში
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.linkedProperties.map((property) => (
                      <Card key={property.id} className="hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-primary/30 hover:border-l-primary" onClick={() => navigate(`/property/${property.id}`)}>
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
                                  <div className="text-xs text-gray-500">მ²-ზე</div>
                                </div>
                                
                                {/* Key Info with Badges */}
                                <div className="flex gap-1.5 flex-wrap">
                                  {/* Area Badge */}
                                  <Badge variant="secondary" className="text-xs px-2 py-1">
                                    {property.area} მ²
                                  </Badge>
                                  
                                  {/* Rooms Badge */}
                                  {property.rooms && (
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                      {property.rooms} ოთახი
                                    </Badge>
                                  )}
                                  
                                  {/* Bedrooms Badge */}
                                  {property.bedrooms && (
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                      {property.bedrooms} საძინებელი
                                    </Badge>
                                  )}
                                  
                                  {/* Floor Badge */}
                                  <Badge variant="outline" className="text-xs px-2 py-1">
                                    {property.floor || 1} სართული
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