import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Loader2, Eye, Edit, Trash2, MapPin, Calendar, User, Phone, Mail, Building } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { agencyApi } from '@/lib/api';
import { getLanguageUrl } from '@/components/LanguageRoute';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Agency {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  totalListings: number;
  activeListings: number;
  totalAgents: number;
  owner: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  logo?: string;
}

// Component to display agency logo from AWS
const AgencyLogo = ({ agencyId, agencyName }: {
  agencyId: number;
  agencyName: string;
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgencyLogo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/agency/${agencyId}/images?purpose=agency_logo`);

        if (response.ok) {
          const data = await response.json();

          if (data.images && data.images.length > 0) {
            const firstLogo = data.images[0];
            const logoUrl = firstLogo.urls?.small || firstLogo.urls?.medium || firstLogo.urls?.original;

            if (logoUrl) {
              const img = new Image();
              img.onload = () => {
                setLogoUrl(logoUrl);
                setLoading(false);
              };
              img.onerror = () => {
                setLoading(false);
              };
              img.src = logoUrl;
              return;
            }
          }
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadAgencyLogo();
  }, [agencyId]);

  if (loading) {
    return (
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={agencyName}
        className="w-20 h-20 rounded-lg object-cover"
        onError={() => setLogoUrl(null)}
      />
    );
  }

  return (
    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
      <Building className="h-8 w-8 text-blue-600" />
    </div>
  );
};

const AdminAgencies = () => {
  const { t, i18n } = useTranslation('admin');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Translation dictionaries for common Georgian place names
  const cityTranslations: Record<string, Record<string, string>> = {
    'თბილისი': { en: 'Tbilisi', ru: 'Тбилиси', ka: 'თბილისი' },
    'ბათუმი': { en: 'Batumi', ru: 'Батуми', ka: 'ბათუმი' },
    'ქუთაისი': { en: 'Kutaisi', ru: 'Кутაიси', ka: 'ქუთაისი' }
  };

  const districtTranslations: Record<string, Record<string, string>> = {
    'ვაკე-საბურთალო': { en: 'Vake-Saburtalo', ru: 'Ваке-Сабурталo', ka: 'ვაკე-საბურთალო' },
    'ვაკე': { en: 'Vake', ru: 'Ваке', ka: 'ვაკე' },
    'საბურთალო': { en: 'Saburtalo', ru: 'Сабурталo', ka: 'საბურთალო' },
    'დიდუბე': { en: 'Didube', ru: 'Дидубе', ka: 'დიდუბე' },
    'ისანი': { en: 'Isani', ru: 'Исани', ka: 'ისანი' },
    'კრწანისი': { en: 'Krtsanisi', ru: 'Крцаниси', ka: 'კრწანისი' },
    'მთაწმინდა': { en: 'Mtatsminda', ru: 'Мтацминда', ka: 'მთაწმინდა' },
    'ნაძალადევი': { en: 'Nadzaladevi', ru: 'Надзაладеви', ka: 'ნაძალადევი' },
    'სამგორი': { en: 'Samgori', ru: 'Самгори', ka: 'სამგორი' },
    'ჩუღურეთი': { en: 'Chughureti', ru: 'Чугурети', ka: 'ჩუღურეთი' }
  };

  const streetTranslations: Record<string, Record<string, string>> = {
    'ტაშკენტის ქუჩა': { en: 'Tashkenti Street', ru: 'улица Ташкенти', ka: 'ტაშკენტის ქუჩა' },
    'რუსთაველის ქუჩა': { en: 'Rustaveli Street', ru: 'улица Руstaveli', ka: 'რუსთაველის ქუჩა' },
    'აღმაშენებლის ქუჩა': { en: 'Agmashenebeli Street', ru: 'улица Агмашенებели', ka: 'აღმაშენებლის ქუჩა' },
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

  useEffect(() => {
    fetchAgencies();
  }, [i18n.language]);

  const fetchAgencies = async () => {
    try {
      setIsLoading(true);
      const data = await agencyApi.getAgencies({ lang: i18n.language });
      console.log('Agencies API response:', data);
      
      // Process agencies data to ensure all fields are properly displayed
      const processedAgencies = (data.agencies || []).map((agency: any) => ({
        id: agency.id || 0,
        name: agency.name || agency.agencyName || 'Unknown Agency',
        description: agency.description || '',
        address: translateText(agency.address || agency.location || 'Address not provided', i18n.language),
        phone: agency.phone || agency.phoneNumber || 'Not provided',
        email: agency.email || 'Not provided',
        website: agency.website || '',
        status: agency.status || agency.isActive ? 'active' : 'inactive',
        totalListings: agency.totalListings || agency.listingCount || 0,
        activeListings: agency.activeListings || agency.activeListingCount || 0,
        totalAgents: agency.totalAgents || agency.agentCount || 0,
        owner: {
          id: agency.owner?.id || agency.ownerId || 0,
          name: agency.owner?.name || agency.owner?.fullName || agency.ownerName || 'Unknown Owner',
          email: agency.owner?.email || agency.ownerEmail || 'Not provided',
          phone: agency.owner?.phone || agency.ownerPhone || 'Not provided'
        },
        createdAt: agency.createdAt || new Date().toISOString(),
        logo: agency.logo || ''
      }));
      
      console.log('Processed agencies:', processedAgencies);
      setAgencies(processedAgencies);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('agencies.messages.errorLoading');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (agencyId: number) => {
    try {
      // Note: This endpoint would need to be implemented in adminApi
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_BASE_URL}/admin/agencies/${agencyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t('agencies.messages.deleteError', { status: response.status }));
      }

      setAgencies(agencies.filter(a => a.id !== agencyId));
      
      toast({
        title: t('common.success'),
        description: t('agencies.messages.deleted'),
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('agencies.messages.errorDeleting');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (agencyId: number, newStatus: string) => {
    try {
      const updateData = {
        isActive: newStatus === 'active',
        isVerified: newStatus === 'active' ? true : undefined
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_BASE_URL}/admin/agencies/${agencyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t('agencies.messages.statusError', { status: response.status }));
      }

      // Update local state
      setAgencies(agencies.map(a => 
        a.id === agencyId 
          ? { ...a, status: newStatus as 'active' | 'inactive' | 'pending' }
          : a
      ));
      
      toast({
        title: t('common.success'),
        description: t('agencies.messages.statusChanged', { status: getStatusText(newStatus) }),
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('agencies.messages.errorChangingStatus');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return t('agencies.status.active');
      case "pending": return t('agencies.status.pending');
      case "inactive": return t('agencies.status.inactive');
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('agencies.title')}</h1>
          <p className="text-gray-600">{t('agencies.subtitle')}</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('agencies.loading.text')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('agencies.title')}</h1>
        <p className="text-gray-600">{t('agencies.subtitleWithCount', { count: agencies.length })}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('agencies.list.title')}</CardTitle>
              <CardDescription>{t('agencies.list.description')}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('agencies.buttons.filter')}
              </Button>
              <Button size="sm" onClick={fetchAgencies}>
                <Plus className="h-4 w-4 mr-2" />
                {t('agencies.buttons.refresh')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agencies.map((agency) => (
              <Card key={agency.id} className="border hover:shadow-sm transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    {/* Agency Logo */}
                    <div className="relative flex-shrink-0">
                      <AgencyLogo
                        agencyId={agency.owner.id}
                        agencyName={agency.name}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg truncate pr-4">
                          {agency.name}
                        </h3>
                        <Badge className={`${getStatusColor(agency.status)} px-2 py-1`}>
                          {getStatusText(agency.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4" title={agency.address}>
                          {agency.address}
                        </span>
                        {agency.phone !== 'Not provided' && (
                          <>
                            <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="text-sm truncate mr-4">{agency.phone}</span>
                          </>
                        )}
                        {agency.email !== 'Not provided' && (
                          <>
                            <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="text-sm truncate">{agency.email}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">
                          {t('agencies.labels.owner')} {agency.owner.name}
                        </span>
                        <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">
                          {agency.totalAgents} {t('agencies.labels.agents')}, {agency.activeListings} {t('agencies.labels.activeListings')}
                        </span>
                      </div>
                      
                      {agency.description && (
                        <div className="text-sm text-gray-600 mb-2 line-clamp-2" title={agency.description}>
                          {agency.description}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{t('agencies.labels.registration')} {formatDate(agency.createdAt)}</span>
                        </div>
                        <div>
                          {t('agencies.labels.totalListings', { count: agency.totalListings })}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => navigate(getLanguageUrl(`agencies/${agency.id}`, i18n.language))}
                        title={t('agencies.buttons.view')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">{t('agencies.buttons.view')}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => {
                          // Simple inline editing by toggling agency status
                          const newStatus = agency.status === 'active' ? 'inactive' : 'active';
                          handleStatusChange(agency.id, newStatus);
                        }}
                        title={t('agencies.buttons.changeStatus')}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-xs">{t('agencies.buttons.changeStatus')}</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title={t('agencies.buttons.delete')}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-xs">{t('agencies.buttons.delete')}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('agencies.deleteDialog.title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('agencies.deleteDialog.description')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('agencies.deleteDialog.cancel')}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(agency.id)} 
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t('agencies.deleteDialog.confirm')}
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
          
          {agencies.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{t('agencies.empty.text')}</p>
              <Button onClick={fetchAgencies}>
                <Plus className="h-4 w-4 mr-2" />
                {t('agencies.buttons.refresh')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAgencies;