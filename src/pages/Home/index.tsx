import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertySearchHero } from "@/components/PropertySearchHero";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { FeaturedPropertiesCarousel } from "@/components/FeaturedPropertiesCarousel";
import { DistrictCarousel } from "@/components/DistrictCarousel";
import { AdBanner } from "@/components/AdBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, MapPin, TrendingUp, Users, BarChart3, Home as HomeIcon, CheckCircle, Phone, Globe, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useTranslation } from "react-i18next";
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
    id: number;
    fullName: string;
  };
  address?: string;
  phone?: string;
  website?: string;
  socialMediaUrl?: string;
  createdAt?: string;
}

// AgencyLogo component for displaying logos from S3
const AgencyLogo = ({ userId, name }: { userId: number; name: string }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`/api/upload/agency/${userId}/images?purpose=agency_logo`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            const logo = data.images[0];
            setLogoUrl(logo.urls?.small || logo.urls?.medium || logo.urls?.original);
          }
        }
      } catch (error) {
        console.error('Error fetching agency logo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
    );
  }

  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
        />
      ) : (
        <Building2 className="h-6 w-6 text-primary" />
      )}
    </div>
  );
};


const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['home', 'common']);
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
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
        agencyApi.getAgencies({ limit: 4, role: 'agency' }),
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
          const address = parts.length > 0 ? parts.join(', ') : t('home.locationNotSpecified');
          
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
            type: prop.propertyType || t('home.propertyTypes.apartment'),
            transactionType: prop.dealType || t('home.dealTypes.sale'),
            image: prop.photos?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
            featured: prop.viewCount > 10 || Math.random() > 0.7,
            // VIP status fields
            vipStatus: prop.vipStatus || 'none',
            vipExpiresAt: prop.vipExpiresAt,
            // Color separation service fields
            colorSeparationEnabled: prop.colorSeparationEnabled || false,
            colorSeparationExpiresAt: prop.colorSeparationExpiresAt,
            // Price negotiable
            isPriceNegotiable: prop.isPriceNegotiable || false
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

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchFilters: FilterState) => {
    // Navigate to properties page with filters
    navigate(getLanguageUrl('properties', i18n.language), { 
      state: { filters: searchFilters }
    });
  };

  const formatPrice = (price: number) => {
    // Use appropriate locale for number formatting based on current language
    let locale = 'ka-GE';
    switch (i18n.language) {
      case 'ka':
        locale = 'ka-GE';
        break;
      case 'en':
        locale = 'en-US';
        break;
      case 'ru':
        locale = 'ru-RU';
        break;
      default:
        locale = 'ka-GE';
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0
    }).format(price);
  };


  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Hero Section with Search */}
      <div className="pt-20 md:pt-24 lg:pt-32">
        <PropertySearchHero
          onSearch={handleSearch}
          totalProperties={properties.length}
          filteredCount={properties.length}
          variant="default"
          initialFilters={filters}
        />

        {/* First Advertisement - After Hero Section */}
        <section className="py-4 md:py-6 lg:py-8">
          <div className="container mx-auto px-3 sm:px-4">
            <AdBanner type="horizontal" placementId="1" />
          </div>
        </section>

        {/* Latest Properties Carousel */}
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {t('home.sections.latestProperties.title')}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('home.sections.latestProperties.subtitle')}
                </p>
              </div>
              <Button asChild variant="outline" className="text-sm sm:text-base">
                <Link to={getLanguageUrl('properties', i18n.language)}>
                  <span className="hidden sm:inline">{t('home.sections.latestProperties.viewAll')}</span>
                  <span className="sm:hidden">{t('common:common.view')}</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {t('home.sections.agencies.title')}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('home.sections.agencies.subtitle')}
                </p>
              </div>
              <Button asChild variant="outline" className="text-sm sm:text-base">
                <Link to={getLanguageUrl('agencies', i18n.language)}>
                  <span className="hidden sm:inline">{t('home.sections.agencies.viewAll')}</span>
                  <span className="sm:hidden">{t('common:common.view')}</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {agencies.map((agency) => (
                  <Card key={agency.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="p-4 sm:p-6 pb-3">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <AgencyLogo userId={agency.owner?.id || agency.id} name={agency.name} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base sm:text-lg truncate">
                              {agency.name}
                            </CardTitle>
                            {agency.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {t('home.sections.agencies.owner')} {agency.owner?.fullName || t('home.sections.agencies.notSpecified')}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
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
                              {t('home.sections.agencies.website')}
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
                              {t('home.sections.agencies.socialMedia')}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                            <Users className="h-3 w-3" />
                            {agency.agentCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">{t('home.sections.agencies.agents')}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                            <Building2 className="h-3 w-3" />
                            {agency.propertyCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">{t('home.sections.agencies.properties')}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                            <TrendingUp className="h-3 w-3" />
                            {agency.totalSales || 0}
                          </div>
                          <div className="text-xs text-gray-500">{t('home.sections.agencies.sales')}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1 text-xs sm:text-sm" size="sm">
                          <Link to={getLanguageUrl(`/agencies/${agency.id}`, i18n.language)}>
                            {t('home.sections.agencies.details')}
                          </Link>
                        </Button>
                      </div>

                      {agency.createdAt && (
                        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                          {t('home.sections.agencies.founded')} {new Date(agency.createdAt).toLocaleDateString(i18n.language === 'ka' ? 'ka-GE' : i18n.language === 'ru' ? 'ru-RU' : 'en-US')}
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
        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {t('home.sections.services.title')}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('home.sections.services.subtitle')}
                </p>
              </div>
              <Button asChild variant="outline" className="text-sm sm:text-base">
                <Link to="/services">
                  <span className="hidden sm:inline">{t('home.sections.services.viewAll')}</span>
                  <span className="sm:hidden">{t('common:common.view')}</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <HomeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{t('home.sections.services.propertyValuation.title')}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {t('home.sections.services.propertyValuation.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Button asChild className="text-sm sm:text-base w-full sm:w-auto">
                  <Link to={getLanguageUrl('services', i18n.language)}>
                    {t('home.sections.services.learnMore')}
                  </Link>
                </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{t('home.sections.services.legalConsultation.title')}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {t('home.sections.services.legalConsultation.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Button asChild className="text-sm sm:text-base w-full sm:w-auto">
                  <Link to={getLanguageUrl('services', i18n.language)}>
                    {t('home.sections.services.learnMore')}
                  </Link>
                </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Districts Carousel */}
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {t('home.sections.priceStatistics.title')}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('home.sections.priceStatistics.subtitle')}
                </p>
              </div>
              <Button asChild variant="outline" className="text-sm sm:text-base">
                <Link to={getLanguageUrl('price-statistics', i18n.language)}>
                  <span className="hidden sm:inline">{t('home.sections.priceStatistics.viewAll')}</span>
                  <span className="sm:hidden">{t('common:common.view')}</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>

            <DistrictCarousel />
          </div>
        </section>

        {/* Third Advertisement - Before Footer */}
        <section className="py-4 md:py-6 lg:py-8">
          <div className="container mx-auto px-3 sm:px-4">
            <AdBanner type="horizontal" placementId="3" />
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;
