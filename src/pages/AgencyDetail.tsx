import React, { useState, useEffect, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle,
  Star,
  Briefcase,
  Eye
} from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertySearchHero } from "@/components/PropertySearchHero";
import { agencyApi } from "@/lib/api";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useTranslation } from "react-i18next";

interface PropertySearchFilters {
  search: string;
  transactionType: string;
  propertyType: string;
  city: string;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  bedrooms: string;
  bathrooms: string;
  dailyRentalSubcategory: string;
  location: string;
  // Building Details
  rooms: string;
  totalFloors: string;
  buildingStatus: string;
  constructionYearMin: string;
  constructionYearMax: string;
  condition: string;
  projectType: string;
  ceilingHeightMin: string;
  ceilingHeightMax: string;
  heating: string;
  parking: string;
  hotWater: string;
  buildingMaterial: string;
  // Boolean Amenities
  hasBalcony: boolean;
  hasPool: boolean;
  hasLivingRoom: boolean;
  hasLoggia: boolean;
  hasVeranda: boolean;
  hasYard: boolean;
  hasStorage: boolean;
  // Features and Furniture Arrays
  selectedFeatures: string[];
  selectedAdvantages: string[];
  selectedFurnitureAppliances: string[];
}

// This interface can be moved to a shared types file
interface Agency {
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
  agentCount: number;
  propertyCount: number;
  totalSales: number;
  createdAt: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
  };
  agents?: Agent[];
  properties: AgencyProperty[];
  allProperties?: AgencyProperty[];
}

interface AgencyDetailResponse {
  success: boolean;
  data: Agency;
}

interface Agent {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

interface AgencyProperty {
  id: number;
  uuid?: string;
  title?: string;
  propertyType: string;
  dealType: string;
  area?: string | number;
  totalPrice?: string | number;
  street?: string;
  streetNumber?: string;
  createdAt?: string;
  // Optional fields if backend expands selection later
  photos?: string[];
  bedrooms?: string | number;
  bathrooms?: string | number;
  address?: string;
  city?: {
    id: number;
    nameGeorgian: string;
  };
  cityData?: any;
  areaData?: {
    id: number;
    nameKa: string;
  };
  user?: {
    id: number;
    fullName: string;
  };
}

const AgencyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgencyDetail = async () => {
      try {
        setLoading(true);
        const data = await agencyApi.getAgencyById(id!);
        setAgency(data);
      } catch (err: any) {
        console.error('Error fetching agency details:', err);
        setError(err.response?.data?.message || 'სააგენტოს დეტალების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgencyDetail();
    }
  }, [id]);

  // Handle search from PropertySearchHero
  const handleSearch = (filters: PropertySearchFilters) => {
    if (agency) {
      const propertiesToDisplay = agency.allProperties || agency.properties || [];
      const transformedProperties = transformProperties(propertiesToDisplay);
      applyFilters(filters, transformedProperties);
    }
  };

  const applyFilters = (currentFilters: PropertySearchFilters, properties: any[]) => {
    const filtered = properties.filter(property => {
      const matchesSearch = !currentFilters.search || 
        property.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(currentFilters.search.toLowerCase());

      const matchesPriceMin = !currentFilters.priceMin || property.price >= parseInt(currentFilters.priceMin);
      const matchesPriceMax = !currentFilters.priceMax || property.price <= parseInt(currentFilters.priceMax);

      const matchesLocation = !currentFilters.location ||
        property.address.toLowerCase().includes(currentFilters.location.toLowerCase());

      const matchesCity = currentFilters.city === 'all' || !currentFilters.city ||
        property.city?.toLowerCase() === currentFilters.city.toLowerCase();

      const matchesType = currentFilters.propertyType === 'all' || !currentFilters.propertyType ||
        property.type === currentFilters.propertyType;

      const matchesTransactionType = currentFilters.transactionType === 'all' || !currentFilters.transactionType ||
        property.transactionType === currentFilters.transactionType;

      const matchesDailyRentalSubcategory = currentFilters.dailyRentalSubcategory === 'all' || !currentFilters.dailyRentalSubcategory || 
        (property.transactionType === 'ქირავდება დღიურად' && property.dailyRentalSubcategory === currentFilters.dailyRentalSubcategory);

      const matchesBedrooms = currentFilters.bedrooms === 'all' || !currentFilters.bedrooms ||
        property.bedrooms === parseInt(currentFilters.bedrooms);

      const matchesBathrooms = currentFilters.bathrooms === 'all' || !currentFilters.bathrooms ||
        property.bathrooms === parseInt(currentFilters.bathrooms);

      const matchesAreaMin = !currentFilters.areaMin || property.area >= parseInt(currentFilters.areaMin);
      const matchesAreaMax = !currentFilters.areaMax || property.area <= parseInt(currentFilters.areaMax);

      return matchesSearch && matchesPriceMin && matchesPriceMax && matchesLocation && matchesCity &&
        matchesType && matchesTransactionType && matchesDailyRentalSubcategory && 
        matchesBedrooms && matchesBathrooms && matchesAreaMin && matchesAreaMax;
    });

    setFilteredProperties(filtered);
  };

  const transformProperties = (propertiesToDisplay: AgencyProperty[]) => {
    return propertiesToDisplay.map((prop: AgencyProperty) => {
      const priceNum = typeof prop.totalPrice === 'string' ? parseInt(prop.totalPrice) : (prop.totalPrice || 0);
      const areaNum = typeof prop.area === 'string' ? parseInt(prop.area) : (prop.area || 0);
      
      // Build proper address from street and streetNumber
      const addressParts = [];
      if (prop.street) addressParts.push(prop.street);
      if (prop.streetNumber) addressParts.push(prop.streetNumber);
      const fullAddress = addressParts.length > 0 ? addressParts.join(' ') : 'მდებარეობა არ არის მითითებული';
      
      return {
        id: prop.id,
        title: prop.title || `${prop.propertyType || ''} ${prop.dealType || ''}`.trim(),
        price: priceNum || 0,
        address: fullAddress,
        city: prop.city?.nameGeorgian,
        cityData: prop.city ? {
          id: prop.city.id,
          nameGeorgian: prop.city.nameGeorgian,
          nameEnglish: prop.city.nameGeorgian,
          code: ''
        } : prop.cityData,
        areaData: prop.areaData ? {
          id: prop.areaData.id,
          nameKa: prop.areaData.nameKa,
          nameEn: prop.areaData.nameKa
        } : undefined,
        bedrooms: prop.bedrooms ? (typeof prop.bedrooms === 'string' ? parseInt(prop.bedrooms) : prop.bedrooms) : 1,
        bathrooms: prop.bathrooms ? (typeof prop.bathrooms === 'string' ? parseInt(prop.bathrooms) : prop.bathrooms) : 1,
        area: areaNum || 0,
        type: prop.propertyType,
        transactionType: prop.dealType,
        image: (prop.photos && prop.photos[0]) || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
        featured: false,
        agentName: prop.user?.fullName, // Add agent name
      };
    });
  };

  // Apply initial filters when agency data changes
  useEffect(() => {
    if (agency) {
      const propertiesToDisplay = agency.allProperties || agency.properties || [];
      const transformedProperties = transformProperties(propertiesToDisplay);
      // Set initial empty filters
      const initialFilters: PropertySearchFilters = {
        search: "",
        transactionType: "all",
        propertyType: "all",
        city: "all",
        priceMin: "",
        priceMax: "",
        areaMin: "",
        areaMax: "",
        bedrooms: "all",
        bathrooms: "all",
        dailyRentalSubcategory: "all",
        location: "",
        rooms: "all",
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
      };
      applyFilters(initialFilters, transformedProperties);
    }
  }, [agency]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-10 px-4 pt-48 text-center">
          <h2 className="text-2xl font-bold text-red-600">შეცდომა</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-10 px-4 pt-48 text-center">
          <h2 className="text-2xl font-bold">სააგენტო არ მოიძებნა</h2>
        </div>
      </div>
    );
  }

  // Get transformed properties for display
  const propertiesToDisplay = agency.allProperties || agency.properties || [];
  const transformedProperties = transformProperties(propertiesToDisplay);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-32">
        {/* Agency Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            {agency.logoUrl ? (
              <img
                src={agency.logoUrl}
                alt={agency.name}
                className="w-28 h-28 rounded-lg object-cover"
              />
            ) : (
              <Building2 className="h-16 w-16 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{agency.name}</h1>
              {agency.isVerified && (
                <Badge variant="default" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  ვერიფიცირებული
                </Badge>
              )}
            </div>
            <p className="text-lg text-gray-600">{agency.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{agency.address || 'მისამართი მითითებული არ არის'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{agency.phone || 'ტელეფონი მითითებული არ არის'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{agency.email || 'ელ.ფოსტა მითითებული არ არის'}</span>
                </div>
                {agency.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ვებსაიტი</a>
                    </div>
                )}
                {agency.socialMediaUrl && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Star className="h-4 w-4" />
                        <a href={agency.socialMediaUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">სოციალური მედია</a>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">აგენტები</div>
              <div className="text-2xl font-bold">{agency.agentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">განცხადებები</div>
              <div className="text-2xl font-bold">{agency.propertyCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">სულ გაყიდვები</div>
              <div className="text-2xl font-bold">{agency.totalSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">წევრია</div>
              <div className="text-2xl font-bold">{new Date(agency.createdAt).toLocaleDateString('ka-GE')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Row 1: Agents */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">აგენტები</h2>
            {agency.agents && agency.agents.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">{agency.agents.length}</Badge>
            )}
          </div>
          {agency.agents && agency.agents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agency.agents.map((agent) => (
                <Card key={agent.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                        {agent.fullName?.charAt(0) || 'A'}
                      </div>
                      <div className="font-semibold truncate">{agent.fullName}</div>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      <span className="truncate">{agent.phone || 'ტელეფონი არ არის'}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      <span className="truncate">{agent.email || 'ელფოსტა არ არის'}</span>
                    </div>
                    <Link to={getLanguageUrl(`user/${agent.id}`, i18n.language)} className="block mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        პროფილის ნახვა
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">აგენტები არ მოიძებნა</h3>
              <p className="text-gray-600">ამ სააგენტოს ამჟამად არ ჰყავს მითითებული აგენტები.</p>
            </div>
          )}
        </div>

        {/* Row 2: Properties */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {agency.name}-ს და მისი აგენტების განცხადებები
            {transformedProperties.length > 0 && (
              <Badge variant="secondary" className="ml-2 px-3 py-1">{transformedProperties.length}</Badge>
            )}
          </h2>
          
          {transformedProperties && transformedProperties.length > 0 ? (
            <>
              {/* PropertySearchHero Filter - minimal variant */}
              <PropertySearchHero 
                onSearch={handleSearch}
                totalProperties={transformedProperties.length}
                filteredCount={filteredProperties.length}
                variant="minimal"
              />
              
              {/* Properties Grid */}
              <div className="mt-8">
                {filteredProperties.length > 0 ? (
                  <>
                    <div className="mb-4 text-sm text-gray-600">
                      {filteredProperties.length === transformedProperties.length 
                        ? `ყველა განცხადება (${filteredProperties.length})`
                        : `${filteredProperties.length} განცხადება ${transformedProperties.length}-დან`
                      }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property as any} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">ფილტრებთან შესაბამისი განცხადებები არ მოიძებნა</h3>
                    <p className="text-gray-600">სცადეთ სხვა ფილტრები ან წაშალეთ არსებული ფილტრები.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">განცხადებები არ მოიძებნა</h3>
              <p className="text-gray-600">ამ სააგენტოს ამჟამად არ აქვს განცხადებები.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyDetail;
