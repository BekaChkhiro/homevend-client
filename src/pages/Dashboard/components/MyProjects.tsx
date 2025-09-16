import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Building2, MapPin, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

interface Project {
  id: number;
  uuid: string;
  projectName: string;
  description?: string;
  street: string;
  streetNumber?: string;
  projectType: 'private_house' | 'apartment_building';
  deliveryStatus: 'completed_with_renovation' | 'green_frame' | 'black_frame' | 'white_frame';
  deliveryDate?: string;
  numberOfBuildings: number;
  totalApartments: number;
  numberOfFloors: number;
  viewCount: number;
  createdAt: string;
  city: {
    id: number;
    nameGeorgian: string;
    nameEnglish?: string;
    nameRussian?: string;
  };
  areaData?: {
    id: number;
    nameKa: string;
    nameEn?: string;
    nameRu?: string;
  };
  pricing: Array<{
    id: number;
    roomType: string;
    totalArea: number;
    pricePerSqm: number;
    totalPriceFrom: number;
    totalPriceTo?: number;
    availableUnits: number;
  }>;
}

export const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, i18n } = useTranslation('userDashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  useEffect(() => {
    if (user?.role === 'developer') {
      fetchUserProjects();
    }
  }, [user]);

  const fetchUserProjects = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/projects/my-projects?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: t('common.error'),
        description: t('projects.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      
      // Reset to first page if current page is empty after deletion
      const newTotalPages = Math.ceil(updatedProjects.length / projectsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      toast({
        title: t('common.success'),
        description: t('projects.deleteSuccess'),
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: t('common.error'),
        description: t('projects.deleteError'),
        variant: "destructive",
      });
    }
  };

  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'private_house':
        return t('projectTypes.privateHouse');
      case 'apartment_building':
        return t('projectTypes.apartmentComplex');
      default:
        return type;
    }
  };

  const getDeliveryStatusLabel = (status: string) => {
    switch (status) {
      case 'completed_with_renovation':
        return t('deliveryStatuses.completedWithRenovation');
      case 'green_frame':
        return t('deliveryStatuses.greenFrame');
      case 'black_frame':
        return t('deliveryStatuses.blackFrame');
      case 'white_frame':
        return t('deliveryStatuses.whiteFrame');
      default:
        return status;
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'completed_with_renovation':
        return 'bg-green-100 text-green-800';
      case 'green_frame':
        return 'bg-emerald-100 text-emerald-800';
      case 'black_frame':
        return 'bg-gray-100 text-gray-800';
      case 'white_frame':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getMinPrice = (pricing: Project['pricing']) => {
    if (!pricing || pricing.length === 0) return null;
    return Math.min(...pricing.map(p => p.totalPriceFrom));
  };

  // Helper function to get city name based on language
  const getCityName = (city: Project['city']) => {
    if (i18n.language === 'en' && city.nameEnglish) {
      return city.nameEnglish;
    } else if (i18n.language === 'ru' && city.nameRussian) {
      return city.nameRussian;
    }
    return city.nameGeorgian;
  };

  // Helper function to get area name based on language
  const getAreaName = (area: Project['areaData']) => {
    if (!area) return '';
    if (i18n.language === 'en' && area.nameEn) {
      return area.nameEn;
    } else if (i18n.language === 'ru' && area.nameRu) {
      return area.nameRu;
    }
    return area.nameKa;
  };

  // Show different content for non-developers
  if (user?.role !== 'developer') {
    return (
      <div className="bg-white p-8 rounded-lg border text-center">
        <div className="max-w-xs mx-auto">
          <div className="mb-4">
            <Building2 className="mx-auto w-32 h-32 opacity-50 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t('projects.developerAccountRequired')}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {t('projects.developerAccountRequiredDesc')}
          </p>
        </div>
      </div>
    );
  }
  
  // Pagination calculations
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = projects.slice(startIndex, endIndex);

  const hasProjects = projects.length > 0;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t('projects.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">{t('projects.title')}</h2>
        <Button 
          className="flex items-center"
          onClick={() => navigate(getLanguageUrl('/dashboard/add-project', i18n.language))}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t('projects.addProject')}
        </Button>
      </div>
      
      {hasProjects ? (
        <div className="space-y-4">
          {paginatedProjects.map((project) => {
            const minPrice = getMinPrice(project.pricing);
            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.projectName}</CardTitle>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {getCityName(project.city)}
                          {project.areaData && `, ${getAreaName(project.areaData)}`}
                          , {project.street}
                          {project.streetNumber && ` ${project.streetNumber}`}
                        </span>
                      </div>
                      <Badge className={getDeliveryStatusColor(project.deliveryStatus)}>
                        {getDeliveryStatusLabel(project.deliveryStatus)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getLanguageUrl(`/dashboard/edit-project/${project.id}`, i18n.language))}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t('common.edit')}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('common.delete')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('projects.confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('projects.confirmDeleteMessage', { projectName: project.projectName })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                              {t('common.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">{t('projects.type')}:</span>
                      <p className="font-medium">{getProjectTypeLabel(project.projectType)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">{t('projects.buildings')}:</span>
                      <p className="font-medium">{project.numberOfBuildings}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">{t('projects.apartments')}:</span>
                      <p className="font-medium">{project.totalApartments}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">{t('projects.floors')}:</span>
                      <p className="font-medium">{project.numberOfFloors}</p>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      {minPrice && (
                        <div>
                          <span className="text-gray-500 text-sm">{t('projects.priceFrom')}:</span>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(minPrice)}
                          </p>
                        </div>
                      )}
                      {project.deliveryDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{t('projects.delivery')}: {new Date(project.deliveryDate).toLocaleDateString('ka-GE')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{project.viewCount}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getLanguageUrl(`/dashboard/projects/${project.id}/manage-properties`, i18n.language))}
                      >
                        <Building2 className="h-4 w-4 mr-1" />
                        {t('projects.manageProperties')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getLanguageUrl(`/projects/${project.id}`, i18n.language))}
                      >
                        {t('projects.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg border text-center">
          <div className="max-w-xs mx-auto">
            <div className="mb-4">
              <Building2 className="mx-auto w-32 h-32 opacity-50 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t('projects.noProjects')}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {t('projects.noProjectsDesc')}
            </p>
            <Button 
              className="flex items-center mx-auto"
              onClick={() => navigate(getLanguageUrl('/dashboard/add-project', i18n.language))}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('projects.addProject')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};