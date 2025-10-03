import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, DollarSign, MapPin, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { publicApiClient } from "@/lib/api";
import { useTranslation } from "react-i18next";

interface District {
  id: number;
  nameKa: string;
  nameEn: string;
  nameRu: string;
  description?: string;
  pricePerSqm: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PriceStatistics = () => {
  const { t, i18n } = useTranslation('priceStatistics');
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get localized district name
  const getDistrictName = (district: District) => {
    return i18n.language === 'en' && district.nameEn ? district.nameEn :
           i18n.language === 'ru' && district.nameRu ? district.nameRu :
           district.nameKa;
  };

  // Helper function to get secondary district name for description
  const getSecondaryDistrictName = (district: District) => {
    return i18n.language === 'ka' && district.nameEn ? district.nameEn :
           i18n.language === 'ka' && district.nameRu ? district.nameRu :
           i18n.language === 'en' && district.nameRu ? district.nameRu :
           i18n.language === 'ru' && district.nameEn ? district.nameEn :
           district.nameKa;
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await publicApiClient.get('/districts');
      // Convert pricePerSqm from string to number
      const districtsData = (response.data.data || []).map((d: any) => ({
        ...d,
        pricePerSqm: parseFloat(d.pricePerSqm) || 0
      }));
      setDistricts(districtsData);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriceLevel = (price: number) => {
    if (price >= 2000) return { level: t('priceLevel.high'), color: 'text-primary bg-primary/10 border-primary/20' };
    if (price >= 1500) return { level: t('priceLevel.medium'), color: 'text-primary bg-primary/10 border-primary/20' };
    return { level: t('priceLevel.low'), color: 'text-primary bg-primary/10 border-primary/20' };
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-44 pb-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-96 mb-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Sort districts by price (highest first)
  const sortedDistricts = [...districts].sort((a, b) => b.pricePerSqm - a.pricePerSqm);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-44 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('subtitle')}
            </p>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('expensiveDistrict')}</p>
                      <p className="text-lg font-bold text-foreground">
                        {sortedDistricts[0] ? getDistrictName(sortedDistricts[0]) : '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {sortedDistricts[0] ? formatPrice(sortedDistricts[0].pricePerSqm) : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">{t('usdPerSqm').split(' / ')[1]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('averagePrice')}</p>
                      <p className="text-lg font-bold text-foreground">{t('allDistricts')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {districts.length > 0 
                          ? formatPrice(Math.round(districts.reduce((sum, d) => sum + d.pricePerSqm, 0) / districts.length))
                          : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">{t('usdPerSqm').split(' / ')[1]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('cheapestDistrict')}</p>
                      <p className="text-lg font-bold text-foreground">
                        {sortedDistricts[sortedDistricts.length - 1] ? getDistrictName(sortedDistricts[sortedDistricts.length - 1]) : '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {sortedDistricts[sortedDistricts.length - 1] 
                          ? formatPrice(sortedDistricts[sortedDistricts.length - 1].pricePerSqm) 
                          : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">{t('usdPerSqm').split(' / ')[1]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* District Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDistricts.map((district) => {
              const priceLevel = getPriceLevel(district.pricePerSqm);
              return (
                <Card key={district.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{getDistrictName(district)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {priceLevel.level}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {getSecondaryDistrictName(district)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg border ${priceLevel.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t('pricePerSqm')}</span>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xl font-bold">
                            {district.pricePerSqm.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs opacity-75">
                        {t('usdPerSqm')}
                      </div>
                    </div>

                    {district.description && (
                      <p className="text-sm text-muted-foreground mt-3">
                        {district.description}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t('updated')}</span>
                        <span>{new Date(district.updatedAt).toLocaleDateString('ka-GE')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {districts.length === 0 && !loading && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('noData.title')}</h3>
              <p className="text-muted-foreground">
                {t('noData.subtitle')}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PriceStatistics;