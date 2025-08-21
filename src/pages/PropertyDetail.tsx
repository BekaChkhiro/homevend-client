
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Phone, Mail, Share2, Calendar, Loader2, Building, Building2, Home, Thermometer, Car, Droplets, Hammer, Hash, Ruler, Layers, Info, DollarSign, Banknote, Briefcase, Settings, Calendar as CalendarIcon, Wrench, Star, Trophy, Sofa, Tag, Crown } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { propertyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { FavoriteButton } from "@/components/FavoriteButton";

interface Property {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  dailyRentalSubcategory?: string;
  city: string;
  district?: string;
  cityData?: {
    id: number;
    code: string;
    nameGeorgian: string;
    nameEnglish: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn: string;
    nameRu: string;
  };
  street: string;
  streetNumber?: string;
  cadastralCode?: string;
  area: string;
  totalPrice: string;
  pricePerSqm?: number;
  currency?: string;
  
  // Property structure details
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  totalFloors?: string;
  propertyFloor?: string;
  
  // Building characteristics
  buildingStatus?: string;
  constructionYear?: string;
  condition?: string;
  projectType?: string;
  ceilingHeight?: number;
  buildingMaterial?: string;
  
  // Infrastructure
  heating?: string;
  parking?: string;
  hotWater?: string;
  
  // Conditional features with details
  hasBalcony?: boolean;
  balconyCount?: number;
  balconyArea?: number;
  hasPool?: boolean;
  poolType?: string;
  hasLivingRoom?: boolean;
  livingRoomArea?: number;
  livingRoomType?: string;
  hasLoggia?: boolean;
  loggiaArea?: number;
  hasVeranda?: boolean;
  verandaArea?: number;
  hasYard?: boolean;
  yardArea?: number;
  hasStorage?: boolean;
  storageArea?: number;
  storageType?: string;
  
  // Media and content
  photos: string[];
  features: string[];
  advantages: string[];
  furnitureAppliances: string[];
  tags: string[];
  
  // Descriptions
  descriptionGeorgian?: string;
  descriptionEnglish?: string;
  descriptionRussian?: string;
  
  // Contact and metadata
  contactName: string;
  contactPhone: string;
  status: string;
  viewCount: number;
  createdAt: string;
  project?: {
    id: number;
    projectName: string;
    street: string;
    city: {
      nameGeorgian: string;
    };
  };
  user: {
    id: number;
    fullName: string;
    email: string;
    role?: string;
  };
  
  // VIP status fields
  vipStatus?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipExpiresAt?: string;
}

// Translation functions moved outside component to prevent recreation on every render
const translateBuildingStatus = (status: string) => {
  const translations: Record<string, string> = {
    'old-built': 'ძველი აშენება', 'new-built': 'ახალი აშენება', 'under-construction': 'მშენებლობის პროცესში'
  };
  return translations[status] || status;
};

const translateConstructionYear = (year: string) => {
  const translations: Record<string, string> = {
    'before-1955': '1955 წლამდე', '1955-2000': '1955-2000 წლები', 'after-2000': '2000 წლის შემდეგ'
  };
  return translations[year] || year;
};

const translateCondition = (condition: string) => {
  const translations: Record<string, string> = {
    'excellent': 'შესანიშნავი', 'very-good': 'ძალიან კარგი', 'good': 'კარგი',
    'needs-renovation': 'საჭიროებს რემონტს', 'under-renovation': 'რემონტის პროცესში',
    'black-frame': 'შავი კარკასი', 'white-frame': 'თეთრი კარკასი', 'green-frame': 'მწვანე კარკასი'
  };
  return translations[condition] || condition;
};

const translateProjectType = (type: string) => {
  const translations: Record<string, string> = {
    'standard': 'სტანდარტული', 'non-standard': 'არასტანდარტული', 'elite': 'ელიტური'
  };
  return translations[type] || type;
};

const translateBuildingMaterial = (material: string) => {
  const translations: Record<string, string> = {
    'brick': 'აგური', 'block': 'ბლოკი', 'panel': 'პანელი', 'monolith': 'მონოლითი'
  };
  return translations[material] || material;
};

const translatePropertyType = (type: string) => {
  const translations: Record<string, string> = {
    'apartment': 'ბინა', 'house': 'სახლი', 'cottage': 'კოტეჯი', 'land': 'მიწა'
  };
  return translations[type] || type;
};

const translateDealType = (type: string) => {
  const translations: Record<string, string> = {
    'sale': 'იყიდება', 'rent': 'ქირავდება', 'daily': 'დღიური ქირავნობა'
  };
  return translations[type] || type;
};

const translateParking = (parking: string) => {
  const translations: Record<string, string> = {
    'garage': 'გარაჟი', 'parking-space': 'პარკინგი', 'no-parking': 'პარკინგი არ არის'
  };
  return translations[parking] || parking;
};

const translateHeating = (heating: string) => {
  const translations: Record<string, string> = {
    'central-heating': 'ცენტრალური გათბობა', 'gas-heating': 'გაზით გათბობა'
  };
  return translations[heating] || heating;
};

const translateHotWater = (hotWater: string) => {
  const translations: Record<string, string> = {
    'central-hot-water': 'ცენტრალური ცხელი წყალი', 'solar-heater': 'მზის კოლექტორი'
  };
  return translations[hotWater] || hotWater;
};

const translatePoolType = (poolType: string) => {
  const translations: Record<string, string> = {
    'indoor': 'შიდა აუზი', 'outdoor': 'გარე აუზი', 'jacuzzi': 'ჯაკუზი'
  };
  return translations[poolType] || poolType;
};

const translateFeature = (feature: string) => {
  const translations: Record<string, string> = {
    'internet': 'ინტერნეტი', 'elevator': 'ლიფტი', 'tv': 'ტელევიზორი',
    'cargo-elevator': 'სამუშაო ლიფტი', 'water': 'წყალი', 'gas': 'გაზი',
    'kitchen-appliances': 'სამზარეულო ტექნიკა', 'phone': 'ტელეფონი',
    'electricity': 'ელექტროენერგია', 'intercom': 'დომოფონი',
    'fenced': 'შემოღობილი', 'sewerage': 'კანალიზაცია'
  };
  return translations[feature] || feature;
};

const translateAdvantage = (advantage: string) => {
  const translations: Record<string, string> = {
    'spa': 'სპა', 'fireplace': 'ბუხარი', 'bbq': 'შაშლიკის ადგილი',
    'bar': 'ბარი', 'gym': 'სპორტული დარბაზი', 'jacuzzi': 'ჯაკუზი',
    'fruit-trees': 'ხილის ხეები', 'yard-lighting': 'ეზოს განათება',
    'sauna': 'საუნა', 'alarm': 'სიგნალიზაცია', 'security': 'უსაფრთხოება',
    'wine-cellar': 'ღვინის მარანი', 'ventilation': 'ვენტილაცია'
  };
  return translations[advantage] || advantage;
};

const translateFurnitureAppliance = (item: string) => {
  const translations: Record<string, string> = {
    'refrigerator': 'მაცივარი', 'dishwasher': 'ჭურჭლის სარეცხი', 'oven': 'ღუმელი',
    'bed': 'საწოლი', 'sofa': 'დივანი', 'gas-stove': 'გაზქურა',
    'air-conditioner': 'კონდიციონერი', 'washing-machine': 'სარეცხი მანქანა',
    'chairs': 'სკამები', 'furniture': 'ავეჯი', 'table': 'მაგიდა',
    'stove-electric': 'ელექტრო ქურა'
  };
  return translations[item] || item;
};

const translateTag = (tag: string) => {
  const translations: Record<string, string> = {
    'luxury': 'ლუქსი', 'new': 'ახალი', 'code-door': 'კარი კოდით',
    'airbnb-booking': 'Airbnb/Booking ექაუნთი', 'investment': 'საინვესტიციო',
    'disability-friendly': 'სსმპ'
  };
  return translations[tag] || tag;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (!id) {
      setError('Property ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch the specific property
      const propertyData = await propertyApi.getPropertyById(id);
      setProperty(propertyData);

      // Fetch similar properties with rate limiting handling - delay this call
      setTimeout(async () => {
        try {
          const allProperties = await propertyApi.getProperties({});
          const similar = allProperties?.properties?.filter((prop: any) =>
            prop.propertyType === propertyData.propertyType &&
            prop.id !== propertyData.id
          ).slice(0, 3) || [];
          setSimilarProperties(similar);
        } catch (error: any) {
          // Handle rate limiting specifically
          if (error.response?.status === 429) {
            const retryAfter = error.response?.data?.retryAfter || 2000;
            console.warn(`Rate limited, retrying similar properties after ${retryAfter}ms`);
            setTimeout(async () => {
              try {
                const allProperties = await propertyApi.getProperties({});
                const similar = allProperties?.properties?.filter((prop: any) =>
                  prop.propertyType === propertyData.propertyType &&
                  prop.id !== propertyData.id
                ).slice(0, 3) || [];
                setSimilarProperties(similar);
              } catch (retryError) {
                console.warn('Failed to load similar properties after retry:', retryError);
                setSimilarProperties([]);
              }
            }, Math.min(retryAfter, 5000)); // Cap at 5 seconds max
          } else {
            console.warn('Failed to load similar properties:', error);
            setSimilarProperties([]);
          }
        }
      }, 1000); // Delay initial similar properties call by 1 second

    } catch (error: any) {
      console.error('Error fetching property:', error);
      setError('Property not found or failed to load');
      toast({
        title: "შეცდომა",
        description: "განცხადების ჩატვირთვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0,
    }).format(numPrice || 0);
  };


  const getContactTitle = (userRole?: string) => {
    switch (userRole) {
      case 'agency':
        return 'დაუკავშირდით აგენტს';
      case 'developer':
        return 'დაუკავშირდით დეველოპერს';
      default:
        return 'დაუკავშირდით';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>განცხადების ჩატვირთვა...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">განცხადება ვერ მოიძებნა</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Transform property data for display
  
  // Build location string with district if available
  const getLocationString = (property: Property) => {
    let location = property.street;
    
    // Add district if available
    if (property.areaData?.nameKa) {
      location += `, ${property.areaData.nameKa}`;
    } else if (property.district) {
      location += `, ${property.district}`;
    }
    
    // Add city
    if (property.cityData?.nameGeorgian) {
      location += `, ${property.cityData.nameGeorgian}`;
    } else if (property.city) {
      location += `, ${property.city}`;
    }
    
    return location;
  };
  
  const displayProperty = {
    id: property.id,
    title: property.title || `${property.propertyType} ${property.dealType} ${property.city}`,
    price: parseInt(property.totalPrice) || 0,
    address: getLocationString(property),
    bedrooms: parseInt(property.bedrooms || '1'),
    bathrooms: parseInt(property.bathrooms || '1'),
    area: parseInt(property.area) || 0,
    type: property.propertyType,
    images: property.photos.length > 0 ? property.photos : [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"
    ],
    description: property.descriptionGeorgian || property.descriptionEnglish || 'აღწერა არ არის მითითებული',
    features: property.features,
    advantages: property.advantages,
    furnitureAppliances: property.furnitureAppliances,
    tags: property.tags,
    agent: {
      name: property.user.fullName,
      phone: property.contactPhone,
      email: property.user.email
    },
    dateAdded: property.createdAt,
    status: property.status,
    viewCount: property.viewCount
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 md:pt-32">

        {/* Top Ad Banner */}
        <div className="container mx-auto px-4 pt-4">
          <AdBanner type="horizontal" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2">
              {/* Property Images */}
              <div className="mb-4 md:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                  <div className="sm:col-span-2">
                    <img
                      src={displayProperty.images[0]}
                      alt={displayProperty.title}
                      className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
                    />
                  </div>
                  {displayProperty.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${displayProperty.title} ${index + 2}`}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Property Info */}
              <Card className="mb-4 md:mb-6">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{displayProperty.title}</h1>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {displayProperty.address}
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{translatePropertyType(displayProperty.type)}</Badge>
                        {property.dailyRentalSubcategory && (
                          <Badge variant="outline">{property.dailyRentalSubcategory}</Badge>
                        )}
                        {(() => {
                          // Check if property has active VIP status
                          const isVipActive = property.vipStatus && property.vipStatus !== 'none' && 
                            property.vipExpiresAt && new Date(property.vipExpiresAt) > new Date();
                          
                          if (!isVipActive) return null;
                          
                          const vipColors = {
                            vip: 'bg-blue-100 text-blue-800 border-blue-300',
                            vip_plus: 'bg-purple-100 text-purple-800 border-purple-300',
                            super_vip: 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          };
                          
                          const vipLabels = {
                            vip: 'VIP',
                            vip_plus: 'VIP+',
                            super_vip: 'SUPER VIP'
                          };
                          
                          const vipType = property.vipStatus!;
                          const colorClass = vipColors[vipType as keyof typeof vipColors];
                          const label = vipLabels[vipType as keyof typeof vipLabels];
                          
                          return (
                            <Badge className={colorClass}>
                              <Crown className="h-3 w-3 mr-1" />
                              {label}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <FavoriteButton 
                        propertyId={property.id}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      />
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {formatPrice(displayProperty.price)}
                  </div>
                  {property.pricePerSqm && (
                    <div className="text-lg font-semibold text-muted-foreground mb-6">
                      {formatPrice(property.pricePerSqm)}/მ²
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                    <div className="flex items-center justify-center sm:justify-start bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                      <Bed className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold text-sm sm:text-base">{displayProperty.bedrooms}</span>
                      <span className="text-muted-foreground ml-1 text-sm sm:text-base">საძინებელი</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                      <Bath className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold text-sm sm:text-base">{displayProperty.bathrooms}</span>
                      <span className="text-muted-foreground ml-1 text-sm sm:text-base">აბაზანა</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                      <Square className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold text-sm sm:text-base">{displayProperty.area}</span>
                      <span className="text-muted-foreground ml-1 text-sm sm:text-base">მ²</span>
                    </div>
                  </div>

                  {/* Required Fields Section */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                        <Info className="h-4 w-4" style={{ color: '#0f172a' }} />
                        მთავარი ინფორმაცია
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                              <Hash className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>განცხადების სათაური *</span>
                              <p className="font-semibold text-sm leading-tight break-words" style={{ color: '#0f172a' }}>{property.title}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                              <Building className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>უძრავი ქონების ტიპი *</span>
                              <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translatePropertyType(property.propertyType)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                              <Briefcase className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>გარიგების ტიპი *</span>
                              <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateDealType(property.dealType)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                              <MapPin className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>მდებარეობა *</span>
                              <p className="font-semibold text-sm leading-tight break-words" style={{ color: '#0f172a' }}>{displayProperty.address}</p>
                            </div>
                          </div>
                        </div>


                        {property.cadastralCode && (
                          <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2" style={{ borderLeftColor: '#0f172a' }}>
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Hash className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>საკადასტრო კოდი</span>
                                <p className="font-semibold text-sm font-mono tracking-wider break-all" style={{ color: '#0f172a' }}>{property.cadastralCode}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Property Structure */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                        <Home className="h-4 w-4" style={{ color: '#0f172a' }} />
                        ქონების სტრუქტურა
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {property.rooms && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Home className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>ოთახები</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{property.rooms}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.bedrooms && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Bed className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>საძინებელი</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{property.bedrooms}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Bath className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>სველი წერტილი</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{property.bathrooms}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.totalFloors && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Layers className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>სართულები სულ</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{property.totalFloors}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.propertyFloor && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Layers className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>ქონების სართული</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{property.propertyFloor}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                          <div className="flex items-start gap-3">
                            <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                              <Square className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>სარგო ფართი</span>
                              <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{property.area} მ²</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Building Information */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                        <Building className="h-4 w-4" style={{ color: '#0f172a' }} />
                        შენობის ინფორმაცია
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {property.buildingStatus && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Settings className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>სტატუსი</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateBuildingStatus(property.buildingStatus)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.constructionYear && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <CalendarIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>აშენების წელი</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateConstructionYear(property.constructionYear)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.condition && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Wrench className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>მდგომარეობა</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateCondition(property.condition)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.projectType && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Building className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>პროექტის ტიპი</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateProjectType(property.projectType)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.ceilingHeight && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Ruler className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>ჭერის სიმაღლე</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{property.ceilingHeight} მ</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.buildingMaterial && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Hammer className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>სამშენებლო მასალა</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateBuildingMaterial(property.buildingMaterial)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Infrastructure */}
                  <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                        <Settings className="h-4 w-4" style={{ color: '#0f172a' }} />
                        ინფრასტრუქტურა
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {property.heating && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Thermometer className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>გათბობა</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateHeating(property.heating)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.parking && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Car className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>პარკირება</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateParking(property.parking)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {property.hotWater && (
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                            <div className="flex items-start gap-3">
                              <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                <Droplets className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>ცხელი წყალი</span>
                                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{translateHotWater(property.hotWater)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Special Spaces */}
                  {(property.hasBalcony || property.hasPool || property.hasLivingRoom || property.hasLoggia || property.hasVeranda || property.hasYard || property.hasStorage) && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                          <Home className="h-4 w-4" style={{ color: '#0f172a' }} />
                          დამატებითი სივრცეები
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          {property.hasBalcony && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                  <Home className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>აივანი</span>
                                  <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>კი</p>
                                  {(property.balconyCount || property.balconyArea) && (
                                    <p className="text-xs mt-1 opacity-60" style={{ color: '#0f172a' }}>
                                      {property.balconyCount && `${property.balconyCount}ც`}
                                      {property.balconyCount && property.balconyArea && ' • '}
                                      {property.balconyArea && `${property.balconyArea}მ²`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasPool && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                  <Droplets className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>აუზი</span>
                                  <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>კი</p>
                                  {property.poolType && (
                                    <p className="text-xs mt-1 opacity-60" style={{ color: '#0f172a' }}>{translatePoolType(property.poolType)}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasLivingRoom && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                  <Sofa className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>მისაღები</span>
                                  <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>კი</p>
                                  {property.livingRoomArea && (
                                    <p className="text-xs mt-1 opacity-60" style={{ color: '#0f172a' }}>
                                      {property.livingRoomArea}მ²
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasLoggia && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                  <Square className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>ლოჯი</span>
                                  <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>კი</p>
                                  {property.loggiaArea && (
                                    <p className="text-xs mt-1 opacity-60" style={{ color: '#0f172a' }}>{property.loggiaArea}მ²</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasVeranda && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                  <Home className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>ვერანდა</span>
                                  <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>კი</p>
                                  {property.verandaArea && (
                                    <p className="text-xs mt-1 opacity-60" style={{ color: '#0f172a' }}>{property.verandaArea}მ²</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasYard && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                  <Square className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>აქვს ეზო</span>
                                  <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>კი</p>
                                  {property.yardArea && (
                                    <p className="text-xs mt-1 opacity-60" style={{ color: '#0f172a' }}>{property.yardArea}მ²</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.hasStorage && (
                            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-2 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="text-white rounded-lg p-2" style={{ backgroundColor: '#0f172a' }}>
                                  <Square className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-medium block mb-1 opacity-70" style={{ color: '#0f172a' }}>სათავსო</span>
                                  <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>კი</p>
                                  {property.storageArea && (
                                    <p className="text-xs mt-1 opacity-60" style={{ color: '#0f172a' }}>
                                      {property.storageArea}მ²
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}



                  {/* Features Section */}
                  {displayProperty.features && displayProperty.features.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                          <Star className="h-4 w-4" style={{ color: '#0f172a' }} />
                          მახასიათებლები
                        </h3>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                          {displayProperty.features.map((feature, index) => (
                            <div key={`feature-${index}`} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-center">
                              <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
                                {translateFeature(feature)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Advantages Section */}
                  {displayProperty.advantages && displayProperty.advantages.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                          <Trophy className="h-4 w-4" style={{ color: '#0f172a' }} />
                          უპირატესობები
                        </h3>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                          {displayProperty.advantages.map((advantage, index) => (
                            <div key={`advantage-${index}`} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-center">
                              <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
                                {translateAdvantage(advantage)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Furniture & Appliances Section */}
                  {displayProperty.furnitureAppliances && displayProperty.furnitureAppliances.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                          <Sofa className="h-4 w-4" style={{ color: '#0f172a' }} />
                          ავეჯი და ტექნიკა
                        </h3>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                          {displayProperty.furnitureAppliances.map((item, index) => (
                            <div key={`furniture-${index}`} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-center">
                              <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
                                {translateFurnitureAppliance(item)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tags Section */}
                  {displayProperty.tags && displayProperty.tags.length > 0 && (
                    <Card className="mb-4 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                          <Tag className="h-4 w-4" style={{ color: '#0f172a' }} />
                          ბეჯები
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {displayProperty.tags.map((tag, index) => (
                            <Badge key={`tag-${index}`} className="text-white px-3 py-1 text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0f172a' }}>
                              #{translateTag(tag)}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Description Section - Moved to end */}
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">აღწერა</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {displayProperty.description}
                    </p>
                  </div>

                </CardContent>
              </Card>

              {/* Ad Banner */}
              <AdBanner type="horizontal" />
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 md:top-36 space-y-4 md:space-y-6">
              {/* Developer/Agent Info */}
              <Card className="mb-4 md:mb-6 overflow-hidden border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 md:p-4 text-white">
                  <h3 className="text-lg md:text-xl font-bold text-center">{getContactTitle(property.user.role)}</h3>
                </div>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mr-3 md:mr-4 shadow-md ring-2 md:ring-4 ring-white">
                      <span className="text-white text-xl md:text-2xl font-bold">
                        {displayProperty.agent.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link 
                        to={`/user/${property.user.id}`}
                        className="font-bold text-base md:text-lg hover:text-primary transition-colors cursor-pointer block truncate"
                      >
                        {displayProperty.agent.name}
                      </Link>
                      <p className="text-xs md:text-sm text-gray-500">
                        {property.user.role === 'agency' ? 'აგენტი' : 
                         property.user.role === 'developer' ? 'დეველოპერი' : 
                         'მომხმარებელი'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Project info if linked */}
                  {property.project && (
                    <div className="mb-4 md:mb-6 bg-blue-50 rounded-lg p-3 md:p-4 hover:bg-blue-100 transition-colors border border-blue-200">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="text-white rounded-lg p-1.5 md:p-2 bg-blue-600">
                          <Building2 className="h-3 w-3 md:h-4 md:w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium block mb-1 text-blue-800">დაკავშირებული პროექტი</span>
                          <Link 
                            to={`/projects/${property.project.id}`}
                            className="font-semibold text-xs md:text-sm leading-tight break-words text-blue-900 hover:text-blue-700 hover:underline transition-colors"
                          >
                            {property.project.projectName}
                          </Link>
                          <p className="text-xs text-blue-700 mt-1">
                            {property.project.city.nameGeorgian}, {property.project.street}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 md:space-y-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-3 md:py-5 font-medium text-sm md:text-base" variant="default">
                      <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                      <span className="truncate">{displayProperty.agent.phone}</span>
                    </Button>
                    <Button className="w-full border-gray-300 text-primary hover:bg-primary/5 transition-all duration-200 py-3 md:py-5 font-medium text-sm md:text-base" variant="outline">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                      ელფოსტა
                    </Button>
                  </div>
                </CardContent>
              </Card>


              {/* Ad Banner Vertical */}
              <AdBanner type="vertical" />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">მსგავსი განცხადებები</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {similarProperties.map((prop) => {
              const similarProperty = {
                id: prop.id,
                title: `${prop.propertyType} ${prop.dealType} ${prop.city}`,
                price: parseInt(prop.totalPrice) || 0,
                address: getLocationString(prop),
                bedrooms: parseInt(prop.bedrooms || '1'),
                bathrooms: parseInt(prop.bathrooms || '1'),
                area: parseInt(prop.area) || 0,
                image: prop.photos?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
                type: prop.propertyType
              };

              return (
                <Link key={similarProperty.id} to={`/property/${similarProperty.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-300">
                    <div className="relative h-48">
                      <img
                        src={similarProperty.image}
                        alt={similarProperty.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <FavoriteButton 
                          propertyId={similarProperty.id}
                          className="bg-white/80 rounded-full"
                        />
                      </div>
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <h3 className="font-bold text-sm md:text-base truncate mb-1">{similarProperty.title}</h3>
                      <div className="flex items-center text-muted-foreground text-xs md:text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{similarProperty.address}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                        <div className="flex items-center">
                          <Bed className="h-3 w-3 mr-1" />
                          {similarProperty.bedrooms}
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-3 w-3 mr-1" />
                          {similarProperty.bathrooms}
                        </div>
                        <div className="flex items-center">
                          <Square className="h-3 w-3 mr-1" />
                          {similarProperty.area} მ²
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-primary text-sm md:text-base">
                          {formatPrice(similarProperty.price)}
                        </div>
                        <Badge variant="secondary" className="text-xs">{similarProperty.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PropertyDetail;
