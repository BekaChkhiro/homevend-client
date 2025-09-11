import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Home, 
  FileText, 
  Building2,
  TrendingUp,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { adminApi, agencyApi } from '@/lib/api';
import { getLanguageUrl } from '@/components/LanguageRoute';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalDevelopers: number;
  totalAgencies: number;
  totalProperties: number;
  totalProjects: number;
  monthlyUsers: number;
  monthlyProperties: number;
}

interface RecentUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface RecentProperty {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  price: number;
  location: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
  };
}

interface RecentProject {
  id: number;
  name: string;
  description: string;
  city: string;
  fullAddress: string;
  deliveryStatus: string;
  createdAt: string;
  developer: {
    id: number;
    fullName: string;
  };
}

interface RecentDeveloper {
  id: number;
  fullName: string;
  email: string;
  companyName?: string;
  totalProjects: number;
  createdAt: string;
}

interface RecentAgency {
  id: number;
  name: string;
  owner: {
    id: number;
    fullName: string;
  };
  totalAgents: number;
  totalListings: number;
  createdAt: string;
}

const Overview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentListings, setRecentListings] = useState<RecentProperty[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentDevelopers, setRecentDevelopers] = useState<RecentDeveloper[]>([]);
  const [recentAgencies, setRecentAgencies] = useState<RecentAgency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation('admin');
  const navigate = useNavigate();

  // Translation dictionaries for common Georgian place names
  const cityTranslations: Record<string, Record<string, string>> = {
    'თბილისი': {
      en: 'Tbilisi',
      ru: 'Тбилиси',
      ka: 'თბილისი'
    },
    'ბათუმი': {
      en: 'Batumi',
      ru: 'Батуми', 
      ka: 'ბათუმი'
    },
    'ქუთაისი': {
      en: 'Kutaisi',
      ru: 'Кутаиси',
      ka: 'ქუთაისი'
    }
  };

  const districtTranslations: Record<string, Record<string, string>> = {
    'ვაკე-საბურთალო': {
      en: 'Vake-Saburtalo',
      ru: 'Ваке-Сабурталo',
      ka: 'ვაკე-საბურთალო'
    },
    'ვაკე': {
      en: 'Vake',
      ru: 'Ваке',
      ka: 'ვაკე'
    },
    'საბურთალო': {
      en: 'Saburtalo',
      ru: 'Сабурталo',
      ka: 'საბურთალო'
    },
    'დიდუბე': {
      en: 'Didube',
      ru: 'Дидубе',
      ka: 'დიდუბე'
    },
    'ისანი': {
      en: 'Isani',
      ru: 'Исани',
      ka: 'ისანი'
    },
    'კრწანისი': {
      en: 'Krtsanisi',
      ru: 'Крцаниси',
      ka: 'კრწანისი'
    },
    'მთაწმინდა': {
      en: 'Mtatsminda',
      ru: 'Мтацминда',
      ka: 'მთაწმინდა'
    },
    'ნაძალადევი': {
      en: 'Nadzaladevi',
      ru: 'Надзаладеви',
      ka: 'ნაძალადევი'
    },
    'სამგორი': {
      en: 'Samgori',
      ru: 'Самгори',
      ka: 'სამგორი'
    },
    'ჩუღურეთი': {
      en: 'Chughureti',
      ru: 'Чугурети',
      ka: 'ჩუღურეთი'
    }
  };

  const streetTranslations: Record<string, Record<string, string>> = {
    'ტაშკენტის ქუჩა': {
      en: 'Tashkenti Street',
      ru: 'улица Ташкенти',
      ka: 'ტაშკენტის ქუჩა'
    },
    'რუსთაველის ქუჩა': {
      en: 'Rustaveli Street',
      ru: 'улица Руставели',
      ka: 'რუსთაველის ქუჩა'
    },
    'აღმაშენებლის ქუჩა': {
      en: 'Agmashenebeli Street',
      ru: 'улица Агмашенебели',
      ka: 'აღმაშენებლის ქუჩა'
    },
    'ვაჟა-ფშაველას ქუჩა': {
      en: 'Vazha-Pshavela Street',
      ru: 'улица Важа-Пшавела',
      ka: 'ვაჟა-ფშაველას ქუჩა'
    }
  };

  // Helper function to translate Georgian address to target language
  const translateAddress = (address: string, targetLang: string): string => {
    if (!address || targetLang === 'ka') return address;
    
    let translatedAddress = address;
    
    // Translate cities
    Object.entries(cityTranslations).forEach(([georgian, translations]) => {
      if (translatedAddress.includes(georgian)) {
        translatedAddress = translatedAddress.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    // Translate districts
    Object.entries(districtTranslations).forEach(([georgian, translations]) => {
      if (translatedAddress.includes(georgian)) {
        translatedAddress = translatedAddress.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    // Translate streets
    Object.entries(streetTranslations).forEach(([georgian, translations]) => {
      if (translatedAddress.includes(georgian)) {
        translatedAddress = translatedAddress.replace(georgian, translations[targetLang] || georgian);
      }
    });
    
    return translatedAddress;
  };

  // Helper function to get full translated address from property/project data
  const getLocationFromData = (data: any): string => {
    const parts = [];
    
    // First try to get structured address data from database
    // Check for translated city data
    if (data.cityData || data.city) {
      const city = data.cityData || data.city;
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
    
    // Check for translated area/district data
    if (data.areaData || data.districtData) {
      const area = data.areaData || data.districtData;
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
    } else if (data.district) {
      parts.push(data.district);
    }
    
    // Add street if available
    if (data.street) {
      parts.push(data.street);
    }
    
    // Add building number if available
    if (data.buildingNumber || data.houseNumber) {
      const buildingNum = data.buildingNumber || data.houseNumber;
      if (parts.length > 0 && data.street) {
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
    if (data.location) {
      address = data.location;
    } else if (data.fullAddress) {
      address = data.fullAddress;
    } else if (data.address) {
      address = data.address;
    } else {
      return t('common.notSpecified');
    }
    
    // Apply client-side translation as fallback
    return translateAddress(address, i18n.language);
  };

  // Helper function to get translated city name from project data
  const getCityNameFromProject = (project: any): string => {
    let cityName = '';
    
    if (typeof project.city === 'string') {
      cityName = project.city;
    } else if (project.city && typeof project.city === 'object') {
      // Try to get the city name from the object structure first
      switch (i18n.language) {
        case 'ka':
          cityName = project.city.nameGeorgian || project.city.nameKa || project.city.nameEn || project.city.nameEnglish || '';
          break;
        case 'ru':
          cityName = project.city.nameRu || project.city.nameEnglish || project.city.nameEn || project.city.nameGeorgian || project.city.nameKa || '';
          break;
        case 'en':
        default:
          cityName = project.city.nameEnglish || project.city.nameEn || project.city.nameGeorgian || project.city.nameKa || project.city.name || '';
          break;
      }
    }
    
    if (!cityName) {
      return 'Unknown';
    }
    
    // Apply client-side translation if needed
    return translateAddress(cityName, i18n.language);
  };

  // Helper function to get translated company name
  const getCompanyName = (company: any): string => {
    if (!company) return '';
    
    if (typeof company === 'string') {
      return company;
    }
    
    if (company && typeof company === 'object') {
      switch (i18n.language) {
        case 'ka':
          return company.nameKa || company.nameGeorgian || company.nameEn || company.nameEnglish || company.name || '';
        case 'ru':
          return company.nameRu || company.nameEnglish || company.nameEn || company.nameGeorgian || company.nameKa || company.name || '';
        case 'en':
        default:
          return company.nameEnglish || company.nameEn || company.name || company.nameGeorgian || company.nameKa || '';
      }
    }
    
    return '';
  };

  useEffect(() => {
    fetchDashboardData();
  }, [i18n.language]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch main dashboard stats with language parameter
      const result = await adminApi.getDashboardStats({ lang: i18n.language });
      setStats(result.stats);
      
      
      // Process recent listings with proper location translation
      const processedListings = (result.recentProperties || []).map((listing: any) => ({
        ...listing,
        location: getLocationFromData(listing)
      }));
      setRecentListings(processedListings);
      setRecentUsers(result.recentUsers || []);
      
      // Fetch additional data for new sections
      await Promise.allSettled([
        fetchRecentProjects(),
        fetchRecentDevelopers(),
        fetchRecentAgencies()
      ]);
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('overview.messages.errorLoadingData');
      
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentProjects = async () => {
    try {
      const result = await adminApi.getProjects({ limit: 5, lang: i18n.language });
      
      
      const projects = result.projects?.slice(0, 5).map((project: any) => ({
        id: project.id,
        name: project.name || project.title || project.projectName || 'Unnamed Project',
        description: project.description || '',
        city: getCityNameFromProject(project),
        fullAddress: getLocationFromData(project),
        deliveryStatus: project.deliveryStatus || project.status || 'active',
        createdAt: project.createdAt,
        developer: {
          id: project.developerId || project.userId || project.developer?.id,
          fullName: project.developerName || project.user?.fullName || project.developer?.fullName || 'Unknown Developer'
        }
      })) || [];
      
      setRecentProjects(projects);
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      setRecentProjects([]);
    }
  };

  const fetchRecentDevelopers = async () => {
    try {
      const result = await adminApi.getUsers({ role: 'developer', limit: 5, lang: i18n.language });
      
      const developers = result.users?.slice(0, 5).map((user: any) => ({
        id: user.id,
        fullName: user.fullName || 'Unknown Developer',
        email: user.email || 'No email',
        companyName: getCompanyName(user.companyName || user.company),
        totalProjects: user.totalProjects || user.projectCount || user.projects?.length || 0,
        createdAt: user.createdAt
      })) || [];
      
      setRecentDevelopers(developers);
    } catch (error) {
      console.error('Error fetching recent developers:', error);
      setRecentDevelopers([]);
    }
  };

  const fetchRecentAgencies = async () => {
    try {
      const result = await agencyApi.getAgencies({ limit: 5, lang: i18n.language });
      const agencies = result.agencies?.slice(0, 5).map((agency: any) => ({
        id: agency.id,
        name: agency.name || 'Unknown Agency',
        owner: {
          id: agency.ownerId || agency.owner?.id || 0,
          fullName: typeof agency.owner === 'object' && agency.owner ?
            (agency.owner.fullName || agency.owner.name || 'Unknown Owner') :
            (agency.ownerName || 'Unknown Owner')
        },
        totalAgents: Number(agency.totalAgents || agency.agentCount || 0),
        totalListings: Number(agency.totalListings || agency.listingCount || 0),
        createdAt: agency.createdAt
      })) || [];
      setRecentAgencies(agencies);
    } catch (error) {
      console.error('Error fetching recent agencies:', error);
      setRecentAgencies([]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  const getRoleText = (role: string) => {
    const roleKey = `overview.roles.${role}` as const;
    return t(roleKey, { defaultValue: role });
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('overview.title')}</h1>
          <p className="text-gray-600">{t('overview.subtitle')}</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('overview.messages.loadingData')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = stats ? [
    { title: t('overview.stats.totalUsers'), value: stats.totalUsers.toString(), icon: Users, change: t('overview.stats.thisMonth', { count: stats.monthlyUsers }), navigateTo: 'users' },
    { title: t('overview.stats.activeListings'), value: stats.totalProperties.toString(), icon: Home, change: t('overview.stats.thisMonth', { count: stats.monthlyProperties }), navigateTo: 'listings' },
    { title: t('overview.stats.projects'), value: stats.totalProjects.toString(), icon: Building2, change: t('overview.stats.totalProjects'), navigateTo: 'projects' },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('overview.title')}</h1>
        <p className="text-gray-600">{t('overview.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-blue-600">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {stat.change}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(getLanguageUrl(`admin/${stat.navigateTo}`, i18n.language))}
                  className="h-6 px-2 text-xs"
                >
                  {t('overview.buttons.view')}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{t('overview.recent.listings')}</CardTitle>
                <CardDescription>{t('overview.recent.listingsSubtitle', { count: recentListings.length })}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(getLanguageUrl('admin/listings', i18n.language))}
              >
                {t('overview.buttons.viewAll', { defaultValue: 'View All' })}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.length > 0 ? (
                  recentListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold">{listing.title}</h4>
                        <p className="text-sm text-gray-600">{t('overview.labels.user')} {listing.user.fullName}</p>
                        <p className="text-sm text-gray-600">{t('overview.labels.location')} {listing.location || t('common.notSpecified')}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm font-medium text-primary">{formatPrice(listing.price)}</p>
                          <p className="text-xs text-gray-500">{formatDate(listing.createdAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getLanguageUrl(`property/${listing.id}`, i18n.language))}
                        className="ml-4"
                      >
                        {t('overview.buttons.view')}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {t('overview.messages.noListings')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{t('overview.recent.projects')}</CardTitle>
                <CardDescription>{t('overview.recent.projectsSubtitle', { count: recentProjects.length })}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(getLanguageUrl('admin/projects', i18n.language))}
              >
                {t('overview.buttons.viewAll', { defaultValue: 'View All' })}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold">{project.name}</h4>
                        <p className="text-sm text-gray-600">{t('overview.labels.developer')} {project.developer.fullName}</p>
                        <p className="text-sm text-gray-600">{t('overview.labels.location')} {project.fullAddress}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t(`overview.deliveryStatus.${project.deliveryStatus}`, { defaultValue: project.deliveryStatus })}
                          </span>
                          <p className="text-xs text-gray-500">{formatDate(project.createdAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getLanguageUrl(`projects/${project.id}`, i18n.language))}
                        className="ml-4"
                      >
                        {t('overview.buttons.view')}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {t('overview.messages.noProjects')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{t('overview.recent.agencies')}</CardTitle>
                <CardDescription>{t('overview.recent.agenciesSubtitle', { count: recentAgencies.length })}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(getLanguageUrl('admin/agencies', i18n.language))}
              >
                {t('overview.buttons.viewAll', { defaultValue: 'View All' })}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAgencies.length > 0 ? (
                  recentAgencies.map((agency) => (
                    <div key={agency.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold">{agency.name}</h4>
                        <p className="text-sm text-gray-600">{t('overview.labels.owner')} {agency.owner.fullName}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {t('overview.labels.agents', { count: agency.totalAgents })}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {t('overview.labels.listings', { count: agency.totalListings })}
                          </span>
                          <p className="text-xs text-gray-500">{formatDate(agency.createdAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getLanguageUrl(`agencies/${agency.id}`, i18n.language))}
                        className="ml-4"
                      >
                        {t('overview.buttons.view')}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {t('overview.messages.noAgencies')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{t('overview.recent.users')}</CardTitle>
                <CardDescription>{t('overview.recent.usersSubtitle', { count: recentUsers.length })}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(getLanguageUrl('admin/users', i18n.language))}
              >
                {t('overview.buttons.viewAll', { defaultValue: 'View All' })}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold">{user.fullName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {getRoleText(user.role)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(getLanguageUrl(`user/${user.id}`, i18n.language))}
                        >
                          {t('overview.buttons.view')}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {t('overview.messages.noUsers')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{t('overview.recent.developers')}</CardTitle>
                <CardDescription>{t('overview.recent.developersSubtitle', { count: recentDevelopers.length })}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(getLanguageUrl('admin/users?role=developer', i18n.language))}
              >
                {t('overview.buttons.viewAll', { defaultValue: 'View All' })}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDevelopers.length > 0 ? (
                  recentDevelopers.map((developer) => (
                    <div key={developer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold">{developer.fullName}</p>
                        <p className="text-sm text-gray-600">{developer.email}</p>
                        {developer.companyName && (
                          <p className="text-sm text-gray-600">{t('overview.labels.company')} {developer.companyName}</p>
                        )}
                        <div className="flex items-center gap-4 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {t('overview.labels.projects', { count: developer.totalProjects })}
                          </span>
                          <p className="text-xs text-gray-500">{formatDate(developer.createdAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getLanguageUrl(`developers/${developer.id}`, i18n.language))}
                        className="ml-4"
                      >
                        {t('overview.buttons.view')}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {t('overview.messages.noDevelopers')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;