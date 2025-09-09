import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApartmentCard } from './components/ApartmentCard';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface Property {
  id: number;
  title?: string;
  propertyType: string;
  dealType: string;
  city: any; // Can be string or object depending on endpoint
  cityId?: number;
  district?: string;
  street: string;
  area: string;
  totalPrice: string;
  bedrooms?: string;
  bathrooms?: string;
  photos: string[];
  status?: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
}

const Listings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation('admin');

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      setIsLoading(true);
      // Fetch all properties using admin endpoint
      const response = await adminApi.getAllProperties({ limit: 100 });
      console.log('Admin API Response:', response);
      
      // The admin API returns the data directly as an array
      const data = Array.isArray(response) ? response : [];
      console.log('Properties data:', data);
      
      // Ensure all properties have user data
      const validProperties = data.filter((prop: Property) => prop.user && prop.user.fullName);
      
      if (data.length !== validProperties.length) {
        console.warn(`Filtered out ${data.length - validProperties.length} properties without user data`);
      }
      
      setProperties(validProperties);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: t('common.error'),
        description: t('listings.messages.errorLoadingListings'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    try {
      // Add delete API call here when backend is ready
      console.log('Deleting property:', propertyId);
      
      // For now, just remove from local state
      setProperties(properties.filter(p => p.id.toString() !== propertyId));
      
      toast({
        title: t('common.success'),
        description: t('listings.messages.listingDeleted'),
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('listings.messages.errorDeletingListing'),
        variant: "destructive",
      });
    }
  };

  // Transform property data for the ApartmentCard component
  const transformedProperties = properties.map((prop) => {
    // Handle city being either a string or an object
    const cityName = typeof prop.city === 'string' 
      ? prop.city 
      : (prop.city?.nameGeorgian || prop.city?.nameEnglish || 'Unknown');
    
    return {
      id: prop.id.toString(),
      title: prop.title || `${prop.propertyType} ${cityName}`,
      propertyType: prop.propertyType,
      dealType: prop.dealType,
      city: cityName,
      district: prop.district,
      street: prop.street,
      area: prop.area,
      totalPrice: prop.totalPrice,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      viewCount: 0, // Mock data since not in API
      createdAt: prop.createdAt,
      photos: prop.photos || [],
      contactName: prop.user.fullName,
      contactPhone: '', // Mock data since not in API
      owner: {
        id: prop.user.id,
        fullName: prop.user.fullName,
        email: prop.user.email,
      },
      isOwnProperty: false, // Admin view - these are not own properties
    };
  });
  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('listings.title')}</h1>
          <p className="text-gray-600">{t('listings.subtitle')}</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('listings.messages.loadingListings')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('listings.title')}</h1>
        <p className="text-gray-600">{t('listings.subtitleWithCount', { count: transformedProperties.length })}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('listings.list.title')}</CardTitle>
              <CardDescription>{t('listings.list.description')}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('common.filter')}
              </Button>
              <Button size="sm" onClick={fetchAllProperties}>
                <Plus className="h-4 w-4 mr-2" />
                {t('common.refresh')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transformedProperties.map((property) => (
              <ApartmentCard
                key={property.id}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </div>
          
          {transformedProperties.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{t('listings.messages.noListingsFound')}</p>
              <Button onClick={fetchAllProperties}>
                <Plus className="h-4 w-4 mr-2" />
                {t('common.refresh')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Listings;