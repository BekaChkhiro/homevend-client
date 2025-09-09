import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Phone,
  Mail,
  Building2,
  Home,
  Calendar,
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { propertyApi } from "@/lib/api";
import axios from "axios";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  agencyId?: number;
  agency?: {
    id: number;
    name: string;
    logoUrl?: string;
  };
}

interface UserProperty {
  id: number;
  uuid: string;
  title: string;
  propertyType: string;
  dealType: string;
  area: number;
  totalPrice: number;
  pricePerSqm?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyFloor?: string;
  totalFloors?: string;
  createdAt: string;
  photos?: string[];
  city?: {
    id: number;
    nameKa: string;
  };
  areaLocation?: {
    id: number;
    nameKa: string;
  };
  street?: string;
  streetNumber?: string;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { i18n } = useTranslation();
  const [user, setUser] = useState<UserData | null>(null);
  const [properties, setProperties] = useState<UserProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
        setUser(userResponse.data.data);

        // Fetch user properties
        const propertiesResponse = await axios.get(`${API_BASE_URL}/properties/user/${userId}`);
        setProperties(propertiesResponse.data.data || []);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'მომხმარებლის მონაცემების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-10 px-4 pt-48 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">შეცდომა</h2>
          <p className="text-gray-600 mb-6">{error || 'მომხმარებელი ვერ მოიძებნა'}</p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
        </div>
      </div>
    );
  }

  // Transform properties for PropertyCard component
  const transformedProperties = properties.map((prop) => ({
    id: prop.id,
    title: prop.title,
    price: prop.totalPrice,
    address: `${prop.street || ''} ${prop.streetNumber || ''}`.trim() || 'მდებარეობა არ არის მითითებული',
    city: prop.city?.nameKa,
    cityData: prop.city,
    areaData: prop.areaLocation,
    bedrooms: prop.bedrooms || 1,
    bathrooms: prop.bathrooms || 1,
    area: prop.area,
    type: prop.propertyType,
    transactionType: prop.dealType,
    image: (prop.photos && prop.photos[0]) || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
    featured: false,
  }));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'agency':
        return <Badge className="bg-purple-100 text-purple-700">სააგენტო</Badge>;
      case 'agent':
        return <Badge className="bg-blue-100 text-blue-700">აგენტი</Badge>;
      case 'admin':
        return <Badge className="bg-red-100 text-red-700">ადმინისტრატორი</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">მომხმარებელი</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-32">
        {/* Back button */}
        <Button 
          onClick={() => window.history.back()} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>

        {/* User Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                {getRoleBadge(user.role)}
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.agency && (
                  <Link 
                    to={getLanguageUrl(`agencies/${user.agencyId}`, i18n.language)}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>{user.agency.name}</span>
                  </Link>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>წევრია {new Date(user.createdAt).toLocaleDateString('ka-GE')}-დან</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Home className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm text-gray-600">განცხადებები</div>
                  <div className="text-2xl font-bold">{properties.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm text-gray-600">იყიდება</div>
                  <div className="text-2xl font-bold">
                    {properties.filter(p => p.dealType === 'sale').length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Home className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm text-gray-600">ქირავდება</div>
                  <div className="text-2xl font-bold">
                    {properties.filter(p => p.dealType === 'rent').length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {user.fullName}-ის განცხადებები
          </h2>
          
          {transformedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedProperties.map((property) => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-white">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                განცხადებები არ მოიძებნა
              </h3>
              <p className="text-gray-600">
                ამ მომხმარებელს ამჟამად არ აქვს აქტიური განცხადებები
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
