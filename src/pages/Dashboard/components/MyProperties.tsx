import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserPropertyCard } from "./UserPropertyCard";
import { MyProjects } from "./MyProjects";
import { propertyApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
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
}

export const MyProperties: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;

  useEffect(() => {
    fetchUserProperties();
  }, []);

  const fetchUserProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyApi.getUserProperties();
      setProperties(data || []);
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
        title: "წარმატება",
        description: "განცხადება წარმატებით წაიშალა",
      });
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        title: "შეცდომა",
        description: "განცხადების წაშლისას მოხდა შეცდომა",
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
          <span>განცხადებების ჩატვირთვა...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-medium mb-4">ჩემი განცხადებები</h2>
      
      {hasProperties ? (
        <div className="space-y-4">
          {properties.map((property) => (
            <UserPropertyCard
              key={property.id}
              property={property}
              onDelete={handleDeleteProperty}
            />
          ))}
        </div>

      ) : (
        <div className="bg-white p-8 rounded-lg border text-center">
          <div className="max-w-xs mx-auto">
            <div className="mb-4">
              <img 
                src="/placeholder.svg" 
                alt="No properties" 
                className="mx-auto w-32 h-32 opacity-50"
              />
            </div>
            <h3 className="text-lg font-medium mb-2">თქვენ არ გაქვთ განცხადებები დამატებული</h3>
            <p className="text-sm text-gray-500 mb-4">
              დაამატეთ თქვენი პირველი განცხადება და გაზარდეთ გაყიდვების შანსები
            </p>
            <Button 
              className="flex items-center mx-auto"
              onClick={() => navigate('/dashboard/add-property')}
            >
              <Plus className="h-4 w-4 mr-1" />
              განცხადების დამატება
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
