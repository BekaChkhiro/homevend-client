import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPin,
  Calendar,
  Building2,
  Eye,
  Car,
  Shield,
  Lightbulb,
  TreePine,
  Camera,
  Users,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  Facebook,
  Check,
  X
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
  };
  pricing: Array<{
    id: number;
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
  }>;
  // Amenities
  hasGroceryStore: boolean;
  hasBikePath: boolean;
  hasSportsField: boolean;
  hasChildrenArea: boolean;
  hasSquare: boolean;
  // 300m amenities
  pharmacy300m: boolean;
  kindergarten300m: boolean;
  school300m: boolean;
  busStop300m: boolean;
  groceryStore300m: boolean;
  bikePath300m: boolean;
  sportsField300m: boolean;
  stadium300m: boolean;
  square300m: boolean;
  // 500m amenities
  pharmacy500m: boolean;
  kindergarten500m: boolean;
  school500m: boolean;
  university500m: boolean;
  busStop500m: boolean;
  groceryStore500m: boolean;
  bikePath500m: boolean;
  sportsField500m: boolean;
  stadium500m: boolean;
  square500m: boolean;
  // 1km amenities
  hospital1km: boolean;
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
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "შეცდომა",
            description: "პროექტი ვერ მოიძებნა",
            variant: "destructive",
          });
          navigate('/projects');
          return;
        }
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "შეცდომა",
        description: "პროექტის ჩატვირთვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'private_house':
        return 'კერძო სახლი';
      case 'apartment_building':
        return 'საცხოვრებელი კომპლექსი';
      default:
        return type;
    }
  };

  const getDeliveryStatusLabel = (status: string) => {
    switch (status) {
      case 'completed_with_renovation':
        return 'ჩაბარება რემონტით';
      case 'green_frame':
        return 'მწვანე კარკასი';
      case 'black_frame':
        return 'შავი კარკასი';
      case 'white_frame':
        return 'თეთრი კარკასი';
      default:
        return status;
    }
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

  const getRoomTypeLabel = (roomType: string) => {
    switch (roomType) {
      case 'studio':
        return 'სტუდიო';
      case 'one_bedroom':
        return '1 საძინებელი';
      case 'two_bedroom':
        return '2 საძინებელი';
      case 'three_bedroom':
        return '3 საძინებელი';
      case 'four_bedroom':
        return '4 საძინებელი';
      case 'five_plus_bedroom':
        return '5+ საძინებელი';
      default:
        return roomType;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0
    }).format(price);
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
        <div className="max-w-6xl mx-auto">
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

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">მიმოხილვა</TabsTrigger>
              <TabsTrigger value="pricing">ფასები</TabsTrigger>
              <TabsTrigger value="amenities">კომფორტი</TabsTrigger>
              <TabsTrigger value="developer">დეველოპერი</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      პროექტის ინფორმაცია
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">ტიპი:</span>
                        <p className="font-medium">{getProjectTypeLabel(project.projectType)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">კორპუსები:</span>
                        <p className="font-medium">{project.numberOfBuildings}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">ბინები:</span>
                        <p className="font-medium">{project.totalApartments}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">სართულები:</span>
                        <p className="font-medium">{project.numberOfFloors}</p>
                      </div>
                      {project.parkingSpaces && (
                        <div>
                          <span className="text-gray-500">პარკინგი:</span>
                          <p className="font-medium">{project.parkingSpaces} ადგილი</p>
                        </div>
                      )}
                      {project.deliveryDate && (
                        <div>
                          <span className="text-gray-500">ჩაბარება:</span>
                          <p className="font-medium">{new Date(project.deliveryDate).toLocaleDateString('ka-GE')}</p>
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
                    <div className="space-y-2">
                      <p><strong>ქალაქი:</strong> {project.city.nameGeorgian}</p>
                      {project.areaData && (
                        <p><strong>რაიონი:</strong> {project.areaData.nameKa}</p>
                      )}
                      <p><strong>მისამართი:</strong> {project.street}{project.streetNumber && ` ${project.streetNumber}`}</p>
                      {project.latitude && project.longitude && (
                        <div className="pt-2">
                          <p className="text-sm text-gray-600">კოორდინატები: {project.latitude}, {project.longitude}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ფასები ოთახების მიხედვით</CardTitle>
                  <CardDescription>
                    ხელმისაწვდომი ბინების ტიპები და მათი ღირებულება
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.pricing && project.pricing.length > 0 ? (
                    <div className="grid gap-4">
                      {project.pricing.map((price) => (
                        <div key={price.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {getRoomTypeLabel(price.roomType)}
                              </h3>
                              <p className="text-gray-600">
                                {price.numberOfRooms} ოთახი • {price.totalArea} მ²
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {formatPrice(price.totalPriceFrom)}
                                {price.totalPriceTo && (
                                  <span className="text-base font-normal text-gray-600">
                                    - {formatPrice(price.totalPriceTo)}
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatPrice(price.pricePerSqm)} / მ²
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">ხელმისაწვდომი:</span>
                              <p className="font-medium">{price.availableUnits} / {price.totalUnits}</p>
                            </div>
                            {price.livingArea && (
                              <div>
                                <span className="text-gray-500">საცხოვრებელი:</span>
                                <p className="font-medium">{price.livingArea} მ²</p>
                              </div>
                            )}
                            {price.balconyArea && (
                              <div>
                                <span className="text-gray-500">ბალკონი:</span>
                                <p className="font-medium">{price.balconyArea} მ²</p>
                              </div>
                            )}
                            {price.floorFrom && price.floorTo && (
                              <div>
                                <span className="text-gray-500">სართული:</span>
                                <p className="font-medium">{price.floorFrom}-{price.floorTo}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                              <BooleanIcon value={price.hasBalcony} />
                              <span>ბალკონი</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BooleanIcon value={price.hasTerrace} />
                              <span>ტერასა</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BooleanIcon value={price.hasLoggia} />
                              <span>ლოჯია</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">ფასების ინფორმაცია არ არის ხელმისაწვდომი</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Amenities Tab */}
            <TabsContent value="amenities" className="space-y-6">
              <div className="grid gap-6">
                {/* Project Area Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle>პროექტის ტერიტორიაზე</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasGroceryStore} />
                        <span>მაღაზია</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasBikePath} />
                        <span>ველოსიპედის ბილიკი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasSportsField} />
                        <span>სპორტული მოედანი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasChildrenArea} />
                        <span>ბავშვთა მოედანი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasSquare} />
                        <span>მოედანი</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 300m Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle>300 მეტრის რადიუსში</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.pharmacy300m} />
                        <span>აფთიაქი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.kindergarten300m} />
                        <span>ბაღი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.school300m} />
                        <span>სკოლა</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.busStop300m} />
                        <span>ავტობუსის გაჩერება</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.groceryStore300m} />
                        <span>მაღაზია</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.stadium300m} />
                        <span>სტადიონი</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 500m Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle>500 მეტრის რადიუსში</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.pharmacy500m} />
                        <span>აფთიაქი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.kindergarten500m} />
                        <span>ბაღი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.school500m} />
                        <span>სკოლა</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.university500m} />
                        <span>უნივერსიტეტი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.busStop500m} />
                        <span>ავტობუსის გაჩერება</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.stadium500m} />
                        <span>სტადიონი</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 1km Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle>1 კილომეტრის რადიუსში</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hospital1km} />
                        <span>ჰოსპიტალი</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      სერვისები
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.securityService} />
                        <span>უსაფრთხოების სერვისი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasLobby} />
                        <span>ლობი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasConcierge} />
                        <span>კონსიერჟი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.videoSurveillance} />
                        <span>ვიდეო ზედამხედველობა</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasLighting} />
                        <span>განათება</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.landscaping} />
                        <span>ლანდშაფტის დიზაინი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.yardCleaning} />
                        <span>ეზოს დალაგება</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.entranceCleaning} />
                        <span>შესასვლელის დალაგება</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.hasDoorman} />
                        <span>კარისკაცი</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.fireSystem} />
                        <span>ხანძრის ჩაქრობის სისტემა</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BooleanIcon value={project.mainDoorLock} />
                        <span>მთავარი კარის საკეტი</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Developer Tab */}
            <TabsContent value="developer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    დეველოპერი
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{project.developer.fullName}</h3>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span>{project.developer.email}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => navigate(`/projects?developer=${project.developer.id}`)}
                        variant="outline"
                        className="w-full"
                      >
                        ყველა პროექტის ნახვა
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;