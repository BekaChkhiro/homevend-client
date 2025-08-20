import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertySearchHero } from "@/components/PropertySearchHero";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { FeaturedPropertiesCarousel } from "@/components/FeaturedPropertiesCarousel";
import { DistrictCarousel } from "@/components/DistrictCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, MapPin, TrendingUp, Users, BarChart3, Home as HomeIcon, CheckCircle, Phone, Globe, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { propertyApi, agencyApi, projectApi } from "@/lib/api";
import type { Property, FilterState } from "@/pages/Index";

interface Agency {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  agentCount: number;
  propertyCount: number;
  totalSales?: number;
  isVerified?: boolean;
  owner?: {
    fullName: string;
  };
  address?: string;
  phone?: string;
  website?: string;
  socialMediaUrl?: string;
  createdAt?: string;
}

interface Project {
  id: number;
  projectName: string;
  description?: string;
  numberOfBuildings: number;
  totalApartments: number;
  city: {
    nameGeorgian: string;
  };
  photos?: Array<{
    url: string;
  }>;
  pricing: Array<{
    totalPriceFrom: number;
  }>;
}

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priceMin: "",
    priceMax: "",
    location: "",
    city: "all",
    propertyType: [],
    transactionType: "all",
    bedrooms: [],
    bathrooms: [],
    areaMin: "",
    areaMax: "",
    rooms: [],
    totalFloors: "all",
    buildingStatus: "all",
    constructionYearMin: "",
    constructionYearMax: "",
    condition: "all",
    projectType: "all",
    ceilingHeightMin: "",
    ceilingHeightMax: "",
    heating: "all",
    parking: "all",
    hotWater: "all",
    buildingMaterial: "all",
    hasBalcony: false,
    hasPool: false,
    hasLivingRoom: false,
    hasLoggia: false,
    hasVeranda: false,
    hasYard: false,
    hasStorage: false,
    selectedFeatures: [],
    selectedAdvantages: [],
    selectedFurnitureAppliances: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [propertiesResponse, agenciesResponse, projectsResponse] = await Promise.allSettled([
        propertyApi.getProperties({ limit: 20 }),
        agencyApi.getAgencies({ limit: 4 }),
        projectApi.getProjects({ limit: 6 })
      ]);

      // Process properties
      if (propertiesResponse.status === 'fulfilled') {
        const data = propertiesResponse.value?.properties || [];
        
        const transformedProperties = data.map((prop: any) => {
          const parts = [];
          if (prop.street && prop.street.trim()) parts.push(prop.street);
          if (prop.areaData?.nameKa) {
            parts.push(prop.areaData.nameKa);
          } else if (prop.district && prop.district.trim()) {
            parts.push(prop.district);
          }
          if (prop.cityData?.nameGeorgian) {
            parts.push(prop.cityData.nameGeorgian);
          } else if (prop.city && prop.city.trim()) {
            parts.push(prop.city);
          }
          const address = parts.length > 0 ? parts.join(', ') : 'მდებარეობა არ არის მითითებული';
          
          return {
            id: parseInt(prop.id) || prop.id,
            title: prop.title || `${prop.propertyType} ${prop.city}`,
            price: parseInt(prop.totalPrice) || 0,
            address: address,
            city: prop.city,
            district: prop.district,
            cityData: prop.cityData,
            areaData: prop.areaData,
            bedrooms: parseInt(prop.bedrooms) || 1,
            bathrooms: parseInt(prop.bathrooms) || 1,
            area: parseInt(prop.area) || 0,
            type: prop.propertyType || 'ბინა',
            transactionType: prop.dealType || 'იყიდება',
            image: prop.photos?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
            featured: prop.viewCount > 10 || Math.random() > 0.7,
            // VIP status fields
            vipStatus: prop.vipStatus || 'none',
            vipExpiresAt: prop.vipExpiresAt
          };
        });
        
        setProperties(transformedProperties);
        // Get featured properties (first 8)
        setFeaturedProperties(transformedProperties.slice(0, 8));
      }

      // Process agencies
      if (agenciesResponse.status === 'fulfilled') {
        setAgencies(agenciesResponse.value?.agencies?.slice(0, 4) || []);
      }

      // Process projects
      if (projectsResponse.status === 'fulfilled') {
        const projectsData = projectsResponse.value?.projects || [];
        console.log('Projects data:', projectsData);
        setProjects(projectsData.slice(0, 6));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchFilters: FilterState) => {
    // Navigate to properties page with filters
    navigate('/properties', { 
      state: { filters: searchFilters }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getMinPrice = (pricing: Project['pricing']) => {
    if (!pricing || pricing.length === 0) return null;
    return Math.min(...pricing.map(p => p.totalPriceFrom));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Search */}
      <div className="pt-32">
        <PropertySearchHero
          onSearch={handleSearch}
          totalProperties={properties.length}
          filteredCount={properties.length}
          variant="default"
        />

        {/* Latest Properties Carousel */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ბოლოს დამატებული განცხადებები
                </h2>
                <p className="text-gray-600">
                  ნახეთ უახლესი უძრავი ქონების განცხადებები
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/properties">
                  ყველას ნახვა
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <PropertyCardSkeleton key={index} />
                  ))}
                </div>
                {/* Carousel navigation buttons skeleton */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </div>
            ) : (
              <FeaturedPropertiesCarousel properties={properties} />
            )}
          </div>
        </section>

        {/* Agencies Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  სააგენტოები
                </h2>
                <p className="text-gray-600">
                  იპოვნეთ საუკეთესო უძრავი ქონების სააგენტოები
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/agencies">
                  ყველას ნახვა
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {agencies.map((agency) => (
                  <Card key={agency.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {agency.logoUrl ? (
                            <img
                              src={agency.logoUrl}
                              alt={agency.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg truncate">
                              {agency.name}
                            </CardTitle>
                            {agency.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            მოღვაწე: {agency.owner?.fullName || 'არ არის მითითებული'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {agency.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {agency.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        {agency.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{agency.address}</span>
                          </div>
                        )}
                        {agency.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{agency.phone}</span>
                          </div>
                        )}
                        {agency.website && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Globe className="h-4 w-4 flex-shrink-0" />
                            <a 
                              href={agency.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              ვებსაიტი
                            </a>
                          </div>
                        )}
                        {agency.socialMediaUrl && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="h-4 w-4 flex-shrink-0" />
                            <a 
                              href={agency.socialMediaUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              სოციალური მედია
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                            <Users className="h-3 w-3" />
                            {agency.agentCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">აგენტი</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                            <Building2 className="h-3 w-3" />
                            {agency.propertyCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">უძრავი ქონება</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                            <TrendingUp className="h-3 w-3" />
                            {agency.totalSales || 0}
                          </div>
                          <div className="text-xs text-gray-500">გაყიდვა</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1" size="sm">
                          <Link to={`/agencies/${agency.id}`}>
                            დეტალები
                          </Link>
                        </Button>
                      </div>

                      {agency.createdAt && (
                        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                          დაარსდა: {new Date(agency.createdAt).toLocaleDateString('ka-GE')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ჩვენი სერვისები
                </h2>
                <p className="text-gray-600">
                  მიიღეთ პროფესიონალური სერვისები უძრავი ქონების სფეროში
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/services">
                  ყველას ნახვა
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <HomeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>ქონების შეფასება</CardTitle>
                  <CardDescription>
                    მიიღეთ ზუსტი შეფასება თქვენი უძრავი ქონებისთვის ბაზრის აქტუალური ფასებით
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to="/services">
                      დეტალურად
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>იურიდიული კონსულტაცია</CardTitle>
                  <CardDescription>
                    პროფესიონალური იურიდიული დახმარება უძრავი ქონების ყიდვა-გაყიდვაში
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to="/services">
                      დეტალურად
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Districts Carousel */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ფასების სტატისტიკა
                </h2>
                <p className="text-gray-600">
                  იხილეთ თბილისის რაიონებში უძრავი ქონების საშუალო ფასები
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/price-statistics">
                  ყველას ნახვა
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <DistrictCarousel />
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;