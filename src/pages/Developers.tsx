import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle,
  TrendingUp,
  Construction
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { developerApi } from "@/lib/api";

interface Developer {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMediaUrl?: string;
  address?: string;
  isVerified: boolean;
  projectCount: number;
  propertyCount: number;
  totalSales: number;
  createdAt: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
  };
}

// Component to display developer logo from AWS
const DeveloperLogo = ({ developerId, developerName, size = "w-12 h-12" }: {
  developerId: number;
  developerName: string;
  size?: string;
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeveloperLogo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/developer/${developerId}/images?purpose=developer_logo`);

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

    loadDeveloperLogo();
  }, [developerId]);

  if (loading) {
    return (
      <div className={`${size} bg-gray-100 rounded-lg flex items-center justify-center animate-pulse`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={developerName}
        className={`${size} rounded-lg object-cover`}
        onError={() => setLogoUrl(null)}
      />
    );
  }

  return (
    <div className={`${size} bg-primary/10 rounded-lg flex items-center justify-center`}>
      <Construction className="h-6 w-6 text-primary" />
    </div>
  );
};

const Developers = () => {
  const { i18n, t } = useTranslation('developers');
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchDevelopers = async (page: number, search?: string) => {
    try {
      setLoading(true);
      
      const params: any = {
        page,
        limit: 12
      };
      
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const data = await developerApi.getDevelopers(params);
      
      setDevelopers(data.developers);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchDevelopers(1, searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const DeveloperCard = ({ developer }: { developer: Developer }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <DeveloperLogo
              developerId={developer.id}
              developerName={developer.name}
              size="w-12 h-12"
            />
            <div>
              <CardTitle className="text-lg font-semibold">{developer.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {developer.isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <span className="text-sm text-muted-foreground">{t('developer')}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {developer.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {developer.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Construction className="h-4 w-4 text-muted-foreground" />
            <span>{developer.projectCount} {t('projectsCount')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{developer.propertyCount} {t('propertiesCount')}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {developer.address && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{developer.address}</span>
            </div>
          )}
          
          {developer.phone && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{developer.phone}</span>
            </div>
          )}
          
          {developer.email && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{developer.email}</span>
            </div>
          )}
          
          {developer.website && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="truncate">{developer.website}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-1 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>{developer.totalSales.toLocaleString()} ₾</span>
          </div>
          
          <Link to={getLanguageUrl(`developers/${developer.id}`, i18n.language)}>
            <Button variant="outline" size="sm">
              {t('viewDetails')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex w-full max-w-md space-x-2">
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : developers.length > 0 ? (
            <>
              <div className="text-center text-sm text-muted-foreground">
                {t('foundDevelopers').replace('{count}', String(pagination.total || 0))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developers.map((developer) => (
                  <DeveloperCard key={developer.id} developer={developer} />
                ))}
              </div>
              
              {pagination.pages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    {t('pagination.previous')}
                  </Button>
                  
                  {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > pagination.pages) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === pagination.pages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Construction className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('noDevelopersFound')}</h3>
              <p className="text-muted-foreground">
                {t('noDevelopersDescription')}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Developers;
