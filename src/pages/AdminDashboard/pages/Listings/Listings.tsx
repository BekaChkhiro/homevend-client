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
  // Additional fields for database-structured data
  cityData?: any;
  areaData?: any;
  districtData?: any;
  buildingNumber?: string;
  houseNumber?: string;
  location?: string;
  fullAddress?: string;
  address?: string;
}

const Listings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation('admin');

  useEffect(() => {
    fetchAllProperties();
  }, [i18n.language]);

  const fetchAllProperties = async () => {
    try {
      setIsLoading(true);
      // Fetch all properties using admin endpoint with current language
      const response = await adminApi.getAllProperties({ 
        limit: 100, 
        lang: i18n.language 
      });
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

  // Translation dictionaries for common Georgian place names
  const cityTranslations: Record<string, Record<string, string>> = {
    'თბილისი': { en: 'Tbilisi', ru: 'Тбилиси', ka: 'თბილისი' },
    'ბათუმი': { en: 'Batumi', ru: 'Батуми', ka: 'ბათუმი' },
    'ქუთაისი': { en: 'Kutaisi', ru: 'Кутаиси', ka: 'ქუთაისი' }
  };

  const districtTranslations: Record<string, Record<string, string>> = {
    'ვაკე-საბურთალო': { en: 'Vake-Saburtalo', ru: 'Ваке-Сабурталo', ka: 'ვაკე-საბურთალო' },
    'ვაკე': { en: 'Vake', ru: 'Ваке', ka: 'ვაკე' },
    'საბურთალო': { en: 'Saburtalo', ru: 'Сабурталo', ka: 'საბურთალო' },
    'დიდუბე': { en: 'Didube', ru: 'Дидубе', ka: 'დიდუბე' },
    'ისანი': { en: 'Isani', ru: 'Исани', ka: 'ისანი' },
    'კრწანისი': { en: 'Krtsanisi', ru: 'Крцаниси', ka: 'კრწანისი' },
    'მთაწმინდა': { en: 'Mtatsminda', ru: 'Мтацминда', ka: 'მთაწმინდა' },
    'ნაძალადევი': { en: 'Nadzaladevi', ru: 'Надзаладеви', ka: 'ნაძალადევი' },
    'სამგორი': { en: 'Samgori', ru: 'Самгори', ka: 'სამგორი' },
    'ჩუღურეთი': { en: 'Chughureti', ru: 'Чугурети', ka: 'ჩუღურეთი' }
  };

  const streetTranslations: Record<string, Record<string, string>> = {
    'ტაშკენტის ქუჩა': { en: 'Tashkenti Street', ru: 'улица Ташкенти', ka: 'ტაშკენტის ქუჩა' },
    'რუსთაველის ქუჩა': { en: 'Rustaveli Street', ru: 'улица Руstaveli', ka: 'რუსთაველის ქუჩა' },
    'აღმაშენებლის ქუჩა': { en: 'Agmashenebeli Street', ru: 'улица Агмашенебели', ka: 'აღმაშენებლის ქუჩა' },
    'ვაჟა-ფშაველას ქუჩა': { en: 'Vazha-Pshavela Street', ru: 'улица Важа-Пшавела', ka: 'ვაჟა-ფშაველას ქუჩა' }
  };

  // Helper function to translate Georgian text to target language
  const translateText = (text: string, targetLang: string): string => {
    if (!text || targetLang === 'ka') return text;
    
    let translatedText = text;
    
    // Translate cities
    Object.entries(cityTranslations).forEach(([georgian, translations]) => {
      if (translatedText.includes(georgian)) {
        translatedText = translatedText.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    // Translate districts
    Object.entries(districtTranslations).forEach(([georgian, translations]) => {
      if (translatedText.includes(georgian)) {
        translatedText = translatedText.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    // Translate streets
    Object.entries(streetTranslations).forEach(([georgian, translations]) => {
      if (translatedText.includes(georgian)) {
        translatedText = translatedText.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    return translatedText;
  };

  // Helper function to get full translated address from property data
  const getFullAddress = (prop: any): string => {
    const parts = [];
    
    // First try to get structured address data from database
    // Handle city
    if (prop.cityData || prop.city) {
      const city = prop.cityData || prop.city;
      let cityName;
      
      if (typeof city === 'string') {
        cityName = city;
      } else if (city && typeof city === 'object') {
        switch (i18n.language) {
          case 'ka':
            cityName = city.nameGeorgian || city.nameKa || city.nameEn || city.nameEnglish;
            break;
          case 'ru':
            cityName = city.nameRu || city.nameEnglish || city.nameEn || city.nameGeorgian || city.nameKa;
            break;
          case 'en':
          default:
            cityName = city.nameEnglish || city.nameEn || city.nameGeorgian || city.nameKa;
            break;
        }
      }
      
      if (cityName) parts.push(cityName);
    }
    
    // Handle district/area
    if (prop.areaData || prop.districtData) {
      const area = prop.areaData || prop.districtData;
      let areaName;
      
      if (typeof area === 'string') {
        areaName = area;
      } else if (area && typeof area === 'object') {
        switch (i18n.language) {
          case 'ka':
            areaName = area.nameKa || area.nameGeorgian || area.nameEn || area.nameEnglish;
            break;
          case 'ru':
            areaName = area.nameRu || area.nameEnglish || area.nameEn || area.nameGeorgian || area.nameKa;
            break;
          case 'en':
          default:
            areaName = area.nameEn || area.nameEnglish || area.nameGeorgian || area.nameKa;
            break;
        }
      }
      
      if (areaName) parts.push(areaName);
    } else if (prop.district) {
      parts.push(prop.district);
    }
    
    // Add street if available
    if (prop.street) {
      parts.push(prop.street);
    }
    
    // Add building number if available
    if (prop.buildingNumber || prop.houseNumber) {
      const buildingNum = prop.buildingNumber || prop.houseNumber;
      if (parts.length > 0 && prop.street) {
        parts[parts.length - 1] = `${parts[parts.length - 1]} ${buildingNum}`;
      } else {
        parts.push(buildingNum);
      }
    }
    
    // If we got structured data, return it
    if (parts.length > 0) {
      return parts.join(', ');
    }
    
    // Fallback to existing address fields with client-side translation
    let address = '';
    if (prop.location) {
      address = prop.location;
    } else if (prop.fullAddress) {
      address = prop.fullAddress;
    } else if (prop.address) {
      address = prop.address;
    }
    
    if (address) {
      return translateText(address, i18n.language);
    }
    
    return t('common.notSpecified');
  };

  // Helper function to get localized city name  
  const getCityName = (city: any): string => {
    if (typeof city === 'string') {
      return translateText(city, i18n.language);
    }
    
    if (city && typeof city === 'object') {
      switch (i18n.language) {
        case 'ka':
          return city.nameGeorgian || city.nameKa || city.nameEn || city.nameEnglish || 'Unknown';
        case 'ru':
          return city.nameRu || city.nameEnglish || city.nameEn || city.nameGeorgian || city.nameKa || 'Unknown';
        case 'en':
        default:
          return city.nameEnglish || city.nameEn || city.nameGeorgian || city.nameKa || 'Unknown';
      }
    }
    
    return 'Unknown';
  };

  // Transform property data for the ApartmentCard component
  const transformedProperties = properties.map((prop) => {
    const cityName = getCityName(prop.city);
    const fullAddress = getFullAddress(prop);
    
    return {
      id: prop.id.toString(),
      title: prop.title || `${prop.propertyType} ${cityName}`,
      propertyType: prop.propertyType,
      dealType: prop.dealType,
      city: cityName,
      district: translateText(prop.district || '', i18n.language),
      street: translateText(prop.street || '', i18n.language),
      fullAddress: fullAddress,
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