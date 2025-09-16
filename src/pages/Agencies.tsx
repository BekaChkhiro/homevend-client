import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  Star,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";
import { agencyApi } from "@/lib/api";

interface Agency {
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
  agentCount: number;
  propertyCount: number;
  totalSales: number;
  createdAt: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
  };
}

// Component to display agency logo from AWS
const AgencyLogo = ({ agencyId, agencyName, size = "w-8 h-8 sm:w-12 sm:h-12" }: {
  agencyId: number;
  agencyName: string;
  size?: string;
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
      <div className={`${size} bg-gray-100 rounded-lg flex items-center justify-center animate-pulse`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={agencyName}
        className={`${size} rounded-lg object-cover`}
        onError={() => setLogoUrl(null)}
      />
    );
  }

  return (
    <div className={`${size} bg-primary/10 rounded-lg flex items-center justify-center`}>
      <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
    </div>
  );
};

const Agencies = () => {
  const { t, i18n } = useTranslation(['agencies', 'common']);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchAgencies = async (page: number, search?: string) => {
    try {
      setLoading(true);
      
      const params: any = {
        page,
        limit: 12,
        role: 'agency'
      };
      
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const data = await agencyApi.getAgencies(params);
      
      setAgencies(data.agencies);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAgencies(1, searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-48">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('agencies.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('agencies.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={t('agencies.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="px-6">
              {t('agencies.searchButton')}
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('agencies.loading')}</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {t('agencies.showing', { count: agencies.length, total: pagination.total })}
              </p>
            </div>

            {/* Agencies Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
              {agencies.map((agency) => (
                <Card key={agency.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AgencyLogo
                        agencyId={agency.owner.id}
                        agencyName={agency.name}
                        size="w-8 h-8 sm:w-12 sm:h-12"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg truncate">
                            {agency.name}
                          </CardTitle>
                          {agency.isVerified && (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('agencies.owner', { name: agency.owner.fullName })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {agency.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {agency.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      {agency.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{agency.address}</span>
                        </div>
                      )}
                      {agency.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{agency.phone}</span>
                        </div>
                      )}
                      {agency.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <a 
                            href={agency.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {t('agencies.website')}
                          </a>
                        </div>
                      )}
                      {agency.socialMediaUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 flex-shrink-0" />
                          <a 
                            href={agency.socialMediaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {t('agencies.socialMedia')}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                          <Users className="h-3 w-3" />
                          {agency.agentCount}
                        </div>
                        <div className="text-xs text-gray-500">{t('agencies.agents')}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                          <Building2 className="h-3 w-3" />
                          {agency.propertyCount}
                        </div>
                        <div className="text-xs text-gray-500">{t('agencies.properties')}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                          <TrendingUp className="h-3 w-3" />
                          {agency.totalSales}
                        </div>
                        <div className="text-xs text-gray-500">{t('agencies.sales')}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to={getLanguageUrl(`agencies/${agency.id}`, i18n.language)}>
                          {t('agencies.detailsButton')}
                        </Link>
                      </Button>
                    </div>

                    <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                      {t('agencies.founded', { date: formatDate(agency.createdAt) })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {t('agencies.pagination.previous')}
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = Math.max(1, currentPage - 2) + i;
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
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                  >
                    {t('agencies.pagination.next')}
                  </Button>
                </div>
              </div>
            )}

            {agencies.length === 0 && !loading && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('agencies.noAgenciesFound')}
                </h3>
                <p className="text-gray-600">
                  {t('agencies.noAgenciesDescription')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Agencies;
