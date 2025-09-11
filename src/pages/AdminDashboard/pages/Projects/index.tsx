import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Loader2, Eye, Edit, Trash2, MapPin, Calendar, User, Building, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { adminApi } from '@/lib/api';
import { getLanguageUrl } from '@/components/LanguageRoute';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  status: 'active' | 'completed' | 'planned' | 'inactive' | string;
  totalUnits: number;
  soldUnits: number;
  startDate: string;
  completionDate?: string;
  minPrice: number;
  maxPrice: number;
  developer: {
    id: number;
    name: string;
    email: string;
  };
  developerId: number;
  createdAt: string;
  images: string[];
}

const AdminProjects = () => {
  const { t, i18n } = useTranslation('admin');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Translation dictionaries for common Georgian place names
  const cityTranslations: Record<string, Record<string, string>> = {
    'თბილისი': { en: 'Tbilisi', ru: 'Тбилиси', ka: 'თბილისი' },
    'ბათუმი': { en: 'Batumi', ru: 'Батуми', ka: 'ბათუმი' },
    'ქუთაისი': { en: 'Kutaisi', ru: 'Кутаიси', ka: 'ქუთაისი' }
  };

  const districtTranslations: Record<string, Record<string, string>> = {
    'ვაკე-საბურთალო': { en: 'Vake-Saburtalo', ru: 'Ваке-Сабурталo', ka: 'ვაკე-საბურთალო' },
    'ვაკე': { en: 'Vake', ru: 'Ваке', ka: 'ვაკე' },
    'საბურთალო': { en: 'Saburtalo', ru: 'Сабурталo', ka: 'საბურთალო' },
    'დიდუბე': { en: 'Didube', ru: 'Дидубე', ka: 'დიდუბე' },
    'ისანი': { en: 'Isani', ru: 'Исани', ka: 'ისანი' },
    'კრწანისი': { en: 'Krtsanisi', ru: 'Крцаниси', ka: 'კრწანისი' },
    'მთაწმინდა': { en: 'Mtatsminda', ru: 'Мтацминда', ka: 'მთაწმინდა' },
    'ნაძალადევი': { en: 'Nadzaladevi', ru: 'Надзаладеви', ka: 'ნაძალადევი' },
    'სამგორი': { en: 'Samgori', ru: 'Самгори', ka: 'სამგორი' },
    'ჩუღურეთი': { en: 'Chughureti', ru: 'Чугурети', ka: 'ჩუღურეთი' }
  };

  const streetTranslations: Record<string, Record<string, string>> = {
    'ტაშკენტის ქუჩა': { en: 'Tashkenti Street', ru: 'улица Ташкенти', ka: 'ტაშკენტის ქუჩა' },
    'რუსთაველის ქუჩა': { en: 'Rustaveli Street', ru: 'улица Руставeli', ka: 'რუსთაველის ქუჩა' },
    'აღმაშენებლის ქუჩა': { en: 'Agmashenebeli Street', ru: 'улица Агмашენებели', ka: 'აღმაშენებლის ქუჩა' },
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

  // Helper function to get localized city name
  const getCityName = (city: any): string => {
    if (typeof city === 'string') return city;
    
    if (city && typeof city === 'object') {
      switch (i18n.language) {
        case 'ka':
          return city.nameGeorgian || city.nameKa || city.nameEn || city.nameEnglish || '';
        case 'ru':
          return city.nameRu || city.nameEnglish || city.nameEn || city.nameGeorgian || city.nameKa || '';
        case 'en':
        default:
          return city.nameEnglish || city.nameEn || city.nameGeorgian || city.nameKa || '';
      }
    }
    
    return '';
  };

  // Helper function to get full translated address
  const getFullTranslatedAddress = (proj: any, targetLang: string): string => {
    // If we already have a full address, translate it
    if (proj.fullAddress || proj.location || proj.address) {
      const address = proj.fullAddress || proj.location || proj.address;
      return translateText(address, targetLang);
    }
    
    // Otherwise construct from parts
    const parts = [];
    
    // Get city name
    const cityName = getCityName(proj.city);
    if (cityName) {
      parts.push(translateText(cityName, targetLang));
    }
    
    // Get street
    if (proj.street) {
      parts.push(translateText(proj.street, targetLang));
    }
    
    return parts.join(', ') || 'Address not specified';
  };

  useEffect(() => {
    fetchProjects();
  }, [i18n.language]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const result = await adminApi.getProjects({ lang: i18n.language });
      
      // Handle different response formats
      let projectsData = [];
      
      if (result && result.projects) {
        projectsData = result.projects;
      } else if (Array.isArray(result)) {
        projectsData = result;
      } else if (result) {
        projectsData = [result]; // Single project
      }
      
      if (Array.isArray(projectsData) && projectsData.length > 0) {
        // Transform API data to match our interface
        const transformedProjects = projectsData.map((proj: any) => ({
          id: proj.id,
          title: proj.projectName || proj.title || `${t('projects.title')} #${proj.id}`,
          description: proj.description || "",
          location: getFullTranslatedAddress(proj, i18n.language),
          status: proj.deliveryStatus || proj.status || "active",
          totalUnits: proj.totalUnits || 0,
          soldUnits: proj.soldUnits || 0,
          startDate: proj.createdAt || new Date().toISOString(),
          completionDate: proj.deliveryDate,
          minPrice: proj.minPrice || 0,
          maxPrice: proj.maxPrice || 0,
          developer: {
            id: proj.developer?.id || proj.developerId || 0,
            name: proj.developer?.fullName || t('projects.labels.unknownDeveloper'),
            email: proj.developer?.email || ""
          },
          developerId: proj.developerId || proj.developer?.id || 0,
          createdAt: proj.createdAt || new Date().toISOString(),
          images: proj.images || []
        }));
        
        setProjects(transformedProjects);
      } else {
        setProjects([]);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('projects.messages.errorLoading');
      
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
      
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    try {
      await adminApi.deleteProject(projectId.toString());
      
      // Remove from local state on successful delete
      setProjects(projects.filter(p => p.id !== projectId));
      
      toast({
        title: t('common.success'),
        description: t('projects.messages.deleted'),
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('projects.messages.errorDeleting');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed_with_renovation": return "bg-green-100 text-green-800";
      case "green_frame": return "bg-emerald-100 text-emerald-800";
      case "black_frame": return "bg-gray-100 text-gray-800";
      case "white_frame": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed_with_renovation": return t('projects.status.completed_with_renovation');
      case "green_frame": return t('projects.status.green_frame');
      case "black_frame": return t('projects.status.black_frame');
      case "white_frame": return t('projects.status.white_frame');
      case "active": return t('projects.status.active');
      case "completed": return t('projects.status.completed');
      case "planned": return t('projects.status.planned');
      case "inactive": return t('projects.status.inactive');
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('projects.title')}</h1>
          <p className="text-gray-600">{t('projects.subtitle')}</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('projects.loading.text')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('projects.title')}</h1>
        <p className="text-gray-600">{t('projects.subtitleWithCount', { count: projects.length })}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('projects.list.title')}</CardTitle>
              <CardDescription>{t('projects.list.description')}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('projects.buttons.filter')}
              </Button>
              <Button size="sm" onClick={fetchProjects}>
                <Plus className="h-4 w-4 mr-2" />
                {t('projects.buttons.refresh')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="border hover:shadow-sm transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    {/* Image placeholder */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop"
                        alt={project.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg truncate pr-4">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Badge className={`${getStatusColor(project.status)} px-2 py-1`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{project.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">
                          {t('projects.labels.developer')} {project.developerId}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{t('projects.labels.started')} {formatDate(project.startDate)}</span>
                        </div>
                        {project.completionDate && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{t('projects.labels.completion')} {formatDate(project.completionDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => navigate(getLanguageUrl(`projects/${project.id}`, i18n.language))}
                        title={t('projects.buttons.view')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">{t('projects.buttons.view')}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => navigate(getLanguageUrl(`admin/edit-project/${project.id}`, i18n.language))}
                        title={t('projects.buttons.edit')}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-xs">{t('projects.buttons.edit')}</span>
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate(getLanguageUrl(`admin/projects/${project.id}/manage-properties`, i18n.language))}
                        title={t('projects.buttons.manageProperties')}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        <span className="text-xs">{t('projects.buttons.manageProperties')}</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title={t('projects.buttons.delete')}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-xs">{t('projects.buttons.delete')}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('projects.deleteDialog.title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('projects.deleteDialog.description')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('projects.deleteDialog.cancel')}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(project.id)} 
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t('projects.deleteDialog.confirm')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {projects.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{t('projects.empty.text')}</p>
              <Button onClick={fetchProjects}>
                <Plus className="h-4 w-4 mr-2" />
                {t('projects.buttons.refresh')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProjects;