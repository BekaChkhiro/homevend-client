
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Bed, Bath, Square, Phone, Mail, Share2, Calendar, Loader2 } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { propertyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface Property {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  city: string;
  street: string;
  area: string;
  totalPrice: string;
  bedrooms?: string;
  bathrooms?: string;
  photos: string[];
  features: string[];
  advantages: string[];
  furnitureAppliances: string[];
  tags: string[];
  contactName: string;
  contactPhone: string;
  descriptionGeorgian?: string;
  descriptionEnglish?: string;
  descriptionRussian?: string;
  status: string;
  viewCount: number;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
}

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

      // Fetch similar properties of the same type
      const allProperties = await propertyApi.getProperties({ status: '' });
      const similar = allProperties?.properties?.filter((prop: any) =>
        prop.propertyType === propertyData.propertyType &&
        prop.id !== propertyData.id
      ).slice(0, 3) || [];
      setSimilarProperties(similar);

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
  const displayProperty = {
    id: property.id,
    title: property.title || `${property.propertyType} ${property.dealType} ${property.city}`,
    price: parseInt(property.totalPrice) || 0,
    address: `${property.street}, ${property.city}`,
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
      <div className="pt-32">

        {/* Top Ad Banner */}
        <div className="container mx-auto px-4 pt-4">
          <AdBanner type="horizontal" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Property Images */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <img
                      src={displayProperty.images[0]}
                      alt={displayProperty.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  {displayProperty.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${displayProperty.title} ${index + 2}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Property Info */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{displayProperty.title}</h1>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {displayProperty.address}
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{displayProperty.type}</Badge>
                        <Badge className="bg-primary text-primary-foreground">ტოპ ქონება</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-primary mb-6">
                    {formatPrice(displayProperty.price)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold">{displayProperty.bedrooms}</span>
                      <span className="text-muted-foreground ml-1">საძინებელი</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold">{displayProperty.bathrooms}</span>
                      <span className="text-muted-foreground ml-1">აბაზანა</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold">{displayProperty.area}</span>
                      <span className="text-muted-foreground ml-1">მ²</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">აღწერა</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {displayProperty.description}
                    </p>
                  </div>

                  {/* Features Section */}
                  {displayProperty.features && displayProperty.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">მახასიათებლები</h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {displayProperty.features.map((feature, index) => (
                          <div key={`feature-${index}`} className="bg-card border border-border rounded-md px-3 py-2 hover:shadow-sm transition-shadow duration-200">
                            <span className="text-xs font-medium text-card-foreground text-center block">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advantages Section */}
                  {displayProperty.advantages && displayProperty.advantages.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">უპირატესობები</h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {displayProperty.advantages.map((advantage, index) => (
                          <div key={`advantage-${index}`} className="bg-card border border-border rounded-md px-3 py-2 hover:shadow-sm transition-shadow duration-200">
                            <span className="text-xs font-medium text-card-foreground text-center block">{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Furniture & Appliances Section */}
                  {displayProperty.furnitureAppliances && displayProperty.furnitureAppliances.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">ავეჯი და ტექნიკა</h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {displayProperty.furnitureAppliances.map((item, index) => (
                          <div key={`furniture-${index}`} className="bg-card border border-border rounded-md px-3 py-2 hover:shadow-sm transition-shadow duration-200">
                            <span className="text-xs font-medium text-card-foreground text-center block">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags Section */}
                  {displayProperty.tags && displayProperty.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-foreground">ტეგები</h3>
                      <div className="flex flex-wrap gap-2">
                        {displayProperty.tags.map((tag, index) => (
                          <Badge key={`tag-${index}`} className="bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ad Banner */}
              <AdBanner type="horizontal" />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Agent Info */}
              <Card className="mb-6 overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                  <h3 className="text-xl font-bold text-center">დაუკავშირდით აგენტს</h3>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-md ring-4 ring-white">
                      <span className="text-white text-2xl font-bold">
                        {displayProperty.agent.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{displayProperty.agent.name}</h4>
                      <p className="text-sm text-gray-500">უძრავი აგენტი</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-5 font-medium" variant="default">
                      <Phone className="h-5 w-5 mr-3" />
                      {displayProperty.agent.phone}
                    </Button>
                    <Button className="w-full border-primary text-primary hover:bg-primary/5 transition-all duration-200 py-5 font-medium" variant="outline">
                      <Mail className="h-5 w-5 mr-3" />
                      ელფოსტა
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">დეტალები</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span>{displayProperty.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">დაემატა:</span>
                      <span>{new Date(displayProperty.dateAdded).toLocaleDateString('ka-GE')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ტიპი:</span>
                      <span>{displayProperty.type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ad Banner Vertical */}
              <AdBanner type="vertical" />
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">მსგავსი განცხადებები</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((prop) => {
              const similarProperty = {
                id: prop.id,
                title: `${prop.propertyType} ${prop.dealType} ${prop.city}`,
                price: parseInt(prop.totalPrice) || 0,
                address: `${prop.street}, ${prop.city}`,
                bedrooms: parseInt(prop.bedrooms || '1'),
                bathrooms: parseInt(prop.bathrooms || '1'),
                area: parseInt(prop.area) || 0,
                image: prop.photos?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
                type: prop.propertyType
              };

              return (
                <Link key={similarProperty.id} to={`/property/${similarProperty.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={similarProperty.image}
                        alt={similarProperty.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button variant="ghost" size="sm" className="bg-white/80 rounded-full h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold truncate mb-1">{similarProperty.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {similarProperty.address}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
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
                        <div className="font-bold text-primary">
                          {formatPrice(similarProperty.price)}
                        </div>
                        <Badge variant="secondary">{similarProperty.type}</Badge>
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
