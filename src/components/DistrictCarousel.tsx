import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, DollarSign, MapPin } from "lucide-react";
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

interface DistrictCarouselProps {
  className?: string;
}

export const DistrictCarousel: React.FC<DistrictCarouselProps> = ({ className = "" }) => {
  const { t, i18n } = useTranslation('home');
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await publicApiClient.get('/districts');
      const districtsData = (response.data.data || []).map((d: any) => ({
        ...d,
        pricePerSqm: parseFloat(d.pricePerSqm) || 0
      }));
      // Sort districts by price (highest first)
      const sortedDistricts = [...districtsData].sort((a, b) => b.pricePerSqm - a.pricePerSqm);
      setDistricts(sortedDistricts);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceLevel = (price: number) => {
    if (price >= 2000) return { level: t('home.districtCarousel.priceLevel.high'), color: 'text-green-600 bg-green-50 border-green-200' };
    if (price >= 1500) return { level: t('home.districtCarousel.priceLevel.medium'), color: 'text-blue-600 bg-blue-50 border-blue-200' };
    return { level: t('home.districtCarousel.priceLevel.low'), color: 'text-orange-600 bg-orange-50 border-orange-200' };
  };

  const visibleCards = 3;
  const totalSlides = Math.max(0, districts.length - visibleCards + 1);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (districts.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('home.districtCarousel.noDataFound')}</h3>
        <p className="text-gray-500">
          {t('home.districtCarousel.noDataDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Navigation Buttons */}
      {totalSlides > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full w-8 h-8 p-0 shadow-lg bg-white/80 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full w-8 h-8 p-0 shadow-lg bg-white/80 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Cards Container */}
      <div className="overflow-hidden w-full">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-6"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleCards + 6)}%)`,
          }}
        >
          {districts.map((district) => {
            const priceLevel = getPriceLevel(district.pricePerSqm);
            return (
              <div
                key={district.id}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>
                          {i18n.language === 'ka' ? district.nameKa : 
                           i18n.language === 'ru' ? district.nameRu : 
                           district.nameEn}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {priceLevel.level}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {i18n.language === 'ka' && district.nameEn ? district.nameEn : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg border ${priceLevel.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t('home.districtCarousel.pricePerSqm')}</span>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xl font-bold">
                            {district.pricePerSqm.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs opacity-75">
                        {t('home.districtCarousel.currency')}
                      </div>
                    </div>

                    {district.description && (
                      <p className="text-sm text-gray-600 mt-3">
                        {district.description}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{t('home.districtCarousel.updated')}</span>
                        <span>{new Date(district.updatedAt).toLocaleDateString(i18n.language === 'ka' ? 'ka-GE' : i18n.language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};