import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building2, Eye, Filter, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { projectApi } from "@/lib/api";
import { useTranslation } from "react-i18next";

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
  developer: {
    id: number;
    fullName: string;
  };
  photos?: Array<{
    id: number;
    url?: string;
    urls?: {
      original: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    fileName: string;
    originalName?: string;
  }>;
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

interface ProjectFilters {
  search: string;
  city: string;
  area: string;
  projectType: string;
  deliveryStatus: string;
}

// Helper function to map i18n language code to URL language code
const getUrlLanguage = (i18nLanguage: string): string => {
  const langMap: Record<string, string> = {
    'en': 'en',
    'ka': 'ge', // i18n uses 'ka', URL uses 'ge'
    'ru': 'ru'
  };
  return langMap[i18nLanguage] || 'ge';
};

// Helper functions to get translated city and area names
const getCityName = (city: Project['city'], i18nLanguage: string) => {
  if (city) {
    if (i18nLanguage === 'en' && city.nameEnglish) {
      return city.nameEnglish;
    } else if (i18nLanguage === 'ru' && city.nameRussian) {
      return city.nameRussian;
    }
    return city.nameGeorgian;
  }
  return '';
};

const getAreaName = (areaData: Project['areaData'], i18nLanguage: string) => {
  if (areaData) {
    if (i18nLanguage === 'en' && areaData.nameEn) {
      return areaData.nameEn;
    } else if (i18nLanguage === 'ru' && areaData.nameRu) {
      return areaData.nameRu;
    }
    return areaData.nameKa;
  }
  return '';
};

const Projects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('projects');
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    city: '',
    area: '',
    projectType: 'all',
    deliveryStatus: 'all'
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const projectType = searchParams.get('projectType');
    if (projectType) {
      setFilters(prev => ({ ...prev, projectType }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProjects();
  }, [currentPage, filters]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...(filters.city && { city: filters.city }),
        ...(filters.area && { area: filters.area }),
        ...(filters.projectType && filters.projectType !== 'all' && { projectType: filters.projectType }),
        ...(filters.deliveryStatus && filters.deliveryStatus !== 'all' && { deliveryStatus: filters.deliveryStatus })
      };

      const data = await projectApi.getProjects(params);
      console.log('Projects API response:', data); // Debug log
      
      // Fetch images for each project
      const projectsWithPhotos = Array.isArray(data.projects) ? await Promise.all(
        data.projects.map(async (project: Project) => {
          try {
            const imageResponse = await fetch(`/api/upload/project/${project.id}/images`);
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              return {
                ...project,
                photos: imageData.images || []
              };
            }
          } catch (error) {
            console.error(`Error fetching images for project ${project.id}:`, error);
          }
          return {
            ...project,
            photos: []
          };
        })
      ) : [];
      
      setProjects(projectsWithPhotos);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: t('error.title'),
        description: t('error.description'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      area: '',
      projectType: 'all',
      deliveryStatus: 'all'
    });
    setCurrentPage(1);
  };

  const getProjectTypeLabel = (type: string) => {
    return t(`projectTypes.${type}`, type);
  };

  const getDeliveryStatusLabel = (status: string) => {
    return t(`deliveryStatuses.${status}`, status);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-48">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600">
              {t('description')}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium">{t('filters.title')}</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="ml-auto"
              >
                {t('filters.clearFilters')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('filters.search')}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.projectType} onValueChange={(value) => handleFilterChange('projectType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.projectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
                  <SelectItem value="private_house">{t('projectTypes.private_house')}</SelectItem>
                  <SelectItem value="apartment_building">{t('projectTypes.apartment_building')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.deliveryStatus} onValueChange={(value) => handleFilterChange('deliveryStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.deliveryStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                  <SelectItem value="completed_with_renovation">{t('deliveryStatuses.completed_with_renovation')}</SelectItem>
                  <SelectItem value="green_frame">{t('deliveryStatuses.green_frame')}</SelectItem>
                  <SelectItem value="black_frame">{t('deliveryStatuses.black_frame')}</SelectItem>
                  <SelectItem value="white_frame">{t('deliveryStatuses.white_frame')}</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder={t('filters.city')}
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />

              <Input
                placeholder={t('filters.area')}
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
              />
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loading')}</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('noProjects.title')}
              </h3>
              <p className="text-gray-600">
                {t('noProjects.description')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const minPrice = getMinPrice(project.pricing);
                return (
                  <Card
                    key={project.id}
                    className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    onClick={() => navigate(`/${getUrlLanguage(i18n.language)}/projects/${project.id}`)}
                  >
                    {/* Project Photo */}
                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                      {project.photos && project.photos.length > 0 ? (
                        <img
                          src={project.photos[0].urls?.medium || project.photos[0].urls?.original || project.photos[0].url}
                          alt={project.projectName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <div class="text-center">
                                  <div class="h-12 w-12 mx-auto mb-2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15l-3 18h-9l-3-18Z" />
                                    </svg>
                                  </div>
                                  <p class="text-xs text-gray-500">No Image</p>
                                </div>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center">
                            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No Images</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {project.projectName}
                        </CardTitle>
                        <Badge className={getDeliveryStatusColor(project.deliveryStatus)}>
                          {getDeliveryStatusLabel(project.deliveryStatus)}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {getCityName(project.city, i18n.language)}
                          {project.areaData && `, ${getAreaName(project.areaData, i18n.language)}`}
                          , {project.street}
                          {project.streetNumber && ` ${project.streetNumber}`}
                        </span>
                      </div>

                      {/* Project Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{t('projectInfo.type')}</span>
                          <p className="font-medium">{getProjectTypeLabel(project.projectType)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('projectInfo.buildings')}</span>
                          <p className="font-medium">{project.numberOfBuildings}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('projectInfo.apartments')}</span>
                          <p className="font-medium">{project.totalApartments}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('projectInfo.floors')}</span>
                          <p className="font-medium">{project.numberOfFloors}</p>
                        </div>
                      </div>

                      {/* Price */}
                      {minPrice && (
                        <div className="pt-2 border-t">
                          <span className="text-gray-500 text-sm">{t('projectInfo.priceFrom')}</span>
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(minPrice)}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t text-sm text-gray-500">
                        <span>{project.developer?.fullName || `${t('projectInfo.developerId')} ${project.developer}`}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{project.viewCount}</span>
                        </div>
                      </div>

                      {project.deliveryDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{t('projectInfo.delivery')} {new Date(project.deliveryDate).toLocaleDateString('ka-GE')}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  {t('pagination.previous')}
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  {t('pagination.next')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Projects;