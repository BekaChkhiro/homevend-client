import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Building2,
  Construction,
  Calendar,
  User,
  ArrowLeft,
  ExternalLink,
  Bed
} from "lucide-react";
import { agencyApi } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";

interface Developer {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMediaUrl?: string;
  address?: string;
  isVerified: boolean;
  propertyCount: number;
  totalSales: number;
  createdAt: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface Project {
  id: number;
  uuid: string;
  projectName: string;
  description?: string;
  projectType: string;
  deliveryStatus: string;
  deliveryDate?: string;
  totalApartments: number;
  numberOfBuildings: number;
  numberOfFloors: number;
  createdAt: string;
}

interface Property {
  id: number;
  title: string;
  totalPrice: number;
  propertyType: string;
  dealType: string;
  area: number;
  rooms?: number;
  street: string;
  photos?: { url: string }[];
  createdAt: string;
}

const DeveloperDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'properties'>('projects');

  useEffect(() => {
    if (id) {
      fetchDeveloperData(id);
    }
  }, [id]);

  const fetchDeveloperData = async (developerId: string) => {
    try {
      setLoading(true);
      
      // Fetch developer info using agency API
      const response = await agencyApi.getAgencyById(developerId);
      const agencyData = response.data || response;
      
      setDeveloper(agencyData);
      setProjects(agencyData.projects || []);
      setProperties(agencyData.properties || []);
      
    } catch (error) {
      console.error('Error fetching developer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Construction className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">დეველოპერი ვერ მოიძებნა</h3>
            <p className="text-muted-foreground mb-4">
              მოთხოვნილი დეველოპერი არ არსებობს ან წაშლილია
            </p>
            <Button asChild>
              <Link to="/developers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                უკან დაბრუნება
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-40">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/developers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              დეველოპერები
            </Link>
          </Button>
        </div>

        {/* Developer Header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {developer.logoUrl ? (
                    <img 
                      src={developer.logoUrl} 
                      alt={developer.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Construction className="h-12 w-12 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl font-bold">{developer.name}</CardTitle>
                      {developer.isVerified && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          გადამოწმებული
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      დეველოპერი • {developer.owner.fullName}
                    </p>
                  </div>

                  {developer.description && (
                    <p className="text-foreground">{developer.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{developer.propertyCount}</div>
                      <div className="text-sm text-muted-foreground">პროექტი</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{developer.totalSales}</div>
                      <div className="text-sm text-muted-foreground">განცხადება</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{Math.max(1, new Date().getFullYear() - new Date(developer.createdAt).getFullYear() + 1)}</div>
                      <div className="text-sm text-muted-foreground">წელი ბაზარზე</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {developer.address && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{developer.address}</span>
                  </div>
                )}
                
                {developer.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{developer.phone}</span>
                  </div>
                )}
                
                {developer.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{developer.email}</span>
                  </div>
                )}
                
                {developer.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={developer.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      ვებსაიტი
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>დაარსდა: {formatDate(developer.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-2 px-1 font-medium text-sm transition-colors ${
                activeTab === 'projects'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Construction className="h-4 w-4 mr-2 inline" />
              პროექტები
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`pb-2 px-1 font-medium text-sm transition-colors ${
                activeTab === 'properties'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building2 className="h-4 w-4 mr-2 inline" />
              განცხადებები
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">პროექტები</h3>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const getProjectTypeLabel = (type: string) => {
                    switch (type) {
                      case 'private_house': return 'კერძო სახლი';
                      case 'apartment_building': return 'საცხოვრებელი კომპლექსი';
                      default: return type;
                    }
                  };

                  const getDeliveryStatusLabel = (status: string) => {
                    switch (status) {
                      case 'completed_with_renovation': return 'ჩაბარება რემონტით';
                      case 'green_frame': return 'მწვანე კარკასი';
                      case 'black_frame': return 'შავი კარკასი';
                      case 'white_frame': return 'თეთრი კარკასი';
                      default: return status;
                    }
                  };

                  const getDeliveryStatusColor = (status: string) => {
                    switch (status) {
                      case 'completed_with_renovation': return 'bg-green-100 text-green-800';
                      case 'green_frame': return 'bg-emerald-100 text-emerald-800';
                      case 'black_frame': return 'bg-gray-100 text-gray-800';
                      case 'white_frame': return 'bg-blue-100 text-blue-800';
                      default: return 'bg-gray-100 text-gray-800';
                    }
                  };

                  return (
                    <Card 
                      key={project.id} 
                      className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    >
                      {/* Project Photo */}
                      <div className="aspect-video w-full overflow-hidden bg-gray-100">
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Building2 className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {project.projectName}
                          </CardTitle>
                          <Badge className={getDeliveryStatusColor(project.deliveryStatus)}>
                            {getDeliveryStatusLabel(project.deliveryStatus)}
                          </Badge>
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Project Info */}
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
                        </div>

                        {/* Delivery Date */}
                        {project.deliveryDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>ჩაბარება: {new Date(project.deliveryDate).toLocaleDateString('ka-GE')}</span>
                          </div>
                        )}

                        <Button asChild className="w-full" size="sm">
                          <Link to={`/projects/${project.uuid}`}>
                            დეტალურად
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Construction className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">პროექტები არ არის დამატებული</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">განცხადებები</h3>
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {properties.map((property) => {
                  // Convert property format to match PropertyCard interface
                  const formattedProperty = {
                    id: property.id,
                    title: property.title,
                    price: property.totalPrice,
                    type: property.dealType === 'sale' ? 'იყიდება' : 'ქირავდება',
                    propertyType: property.propertyType,
                    bedrooms: property.rooms || 0,
                    bathrooms: 1, // Default as we don't have this data
                    area: property.area,
                    address: property.street,
                    image: '/placeholder.svg', // Default placeholder
                    agentName: developer?.owner?.fullName,
                    cityData: null,
                    areaData: null,
                    district: null,
                    city: null,
                    vipStatus: 'none' as const,
                    vipExpiresAt: null
                  };

                  return (
                    <div key={property.id} className="w-full">
                      <PropertyCard property={formattedProperty} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">განცხადებები არ არის დამატებული</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default DeveloperDetail;