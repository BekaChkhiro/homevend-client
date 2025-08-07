import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApartmentCard } from './components/ApartmentCard';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { propertyApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface Property {
  id: number;
  propertyType: string;
  dealType: string;
  city: string;
  street: string;
  area: string;
  totalPrice: string;
  bedrooms?: string;
  bathrooms?: string;
  photos: string[];
  status: string;
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

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      setIsLoading(true);
      // Fetch all properties regardless of status for admin view
      const response = await propertyApi.getProperties({ status: '' });
      const data = response?.properties || [];
      setProperties(data);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: "შეცდომა",
        description: "განცხადებების ჩატვირთვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Transform property data for the ApartmentCard component
  const transformedProperties = properties.map((prop) => ({
    id: prop.id,
    title: `${prop.propertyType} ${prop.dealType} ${prop.city}`,
    price: parseInt(prop.totalPrice) || 0,
    address: `${prop.street}, ${prop.city}`,
    bedrooms: parseInt(prop.bedrooms || '1'),
    bathrooms: parseInt(prop.bathrooms || '1'),
    area: parseInt(prop.area) || 0,
    type: prop.propertyType,
    transactionType: prop.dealType,
    image: prop.photos?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
    featured: Math.random() > 0.5, // Random for now, could be based on viewCount or other criteria
    status: prop.status as "active" | "pending" | "inactive" | "sold",
    createdBy: {
      id: prop.user.id,
      name: prop.user.fullName,
      email: prop.user.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(prop.user.fullName)}&background=random`
    },
    createdDate: new Date(prop.createdAt).toLocaleDateString('ka-GE')
  }));
  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">განცხადებების მართვა</h1>
          <p className="text-gray-600">ყველა განცხადების ნახვა და მართვა</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>განცხადებების ჩატვირთვა...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">განცხადებების მართვა</h1>
        <p className="text-gray-600">ყველა განცხადების ნახვა და მართვა ({transformedProperties.length} განცხადება)</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>განცხადებების სია</CardTitle>
              <CardDescription>ყველა განცხადების ნახვა, დამტკიცება და უარყოფა</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                ფილტრი
              </Button>
              <Button size="sm" onClick={fetchAllProperties}>
                <Plus className="h-4 w-4 mr-2" />
                განახლება
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transformedProperties.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                {...apartment}
              />
            ))}
          </div>
          
          {transformedProperties.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">განცხადებები ვერ მოიძებნა</p>
              <Button onClick={fetchAllProperties}>
                <Plus className="h-4 w-4 mr-2" />
                განახლება
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Listings;