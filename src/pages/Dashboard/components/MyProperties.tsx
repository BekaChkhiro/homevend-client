import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserPropertyCard } from "./UserPropertyCard";
import { MyProjects } from "./MyProjects";
import { propertyApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Property {
  id: string;
  title: string;
  propertyType: string;
  dealType: string;
  city: string;
  district?: string;
  cityData?: {
    id: number;
    code: string;
    nameGeorgian: string;
    nameEnglish: string;
    nameRussian?: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn: string;
    nameRu: string;
  };
  street: string;
  area: string;
  totalPrice: string;
  bedrooms?: string;
  bathrooms?: string;
  viewCount: number;
  createdAt: string;
  photos: string[];
  contactName: string;
  contactPhone: string;
  // New fields for agency functionality
  owner?: {
    id: number;
    fullName: string;
    email: string;
  };
  isOwnProperty?: boolean;
  // VIP status fields
  vipStatus?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipExpiresAt?: string;
  // Active services
  services?: Array<{
    serviceType: string;
    expiresAt: string;
    colorCode?: string;
  }>;
}

export const MyProperties: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, i18n } = useTranslation('userDashboard');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;

  useEffect(() => {
    fetchUserProperties();
  }, [i18n.language]);

  const fetchUserProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyApi.getUserProperties({ lang: i18n.language });
      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: t('common.error'),
        description: t('properties.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await propertyApi.deleteProperty(propertyId);
      const updatedProperties = properties.filter(p => p.id !== propertyId);
      setProperties(updatedProperties);
      
      // Reset to first page if current page is empty after deletion
      const newTotalPages = Math.ceil(updatedProperties.length / propertiesPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      toast({
        title: t('common.success'),
        description: t('properties.deleteSuccess'),
      });
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        title: t('common.error'),
        description: t('properties.deleteError'),
        variant: "destructive",
      });
    }
  };

  
  // Pagination calculations
  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const paginatedProperties = properties.slice(startIndex, endIndex);

  const hasProperties = properties.length > 0;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t('properties.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg md:text-xl font-medium mb-4">{t('properties.title')}</h2>
      
      {hasProperties ? (
        <div className="space-y-4">
          {paginatedProperties.map((property) => (
            <UserPropertyCard
              key={property.id}
              property={property}
              services={property.services}
              onDelete={handleDeleteProperty}
              onVipPurchased={fetchUserProperties}
            />
          ))}
        </div>

      ) : (
        <div className="bg-white p-4 md:p-8 rounded-lg border text-center">
          <div className="max-w-xs mx-auto">
            <div className="mb-4">
              <img 
                src="/placeholder.svg" 
                alt="No properties" 
                className="mx-auto w-24 h-24 md:w-32 md:h-32 opacity-50"
              />
            </div>
            <h3 className="text-base md:text-lg font-medium mb-2">{t('properties.noProperties')}</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-4">
              {t('properties.noPropertiesDesc')}
            </p>
            <Button 
              className="flex items-center mx-auto text-sm"
              onClick={() => navigate(getLanguageUrl('/dashboard/add-property', i18n.language))}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('properties.addProperty')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
