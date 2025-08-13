import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, DollarSign, MapPin, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { publicApiClient } from "@/lib/api";

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
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (price >= 2000) return { level: 'მაღალი', color: 'text-green-600 bg-green-50 border-green-200' };
    if (price >= 1500) return { level: 'საშუალო', color: 'text-green-600 bg-green-50 border-green-200' };
    return { level: 'დაბალი', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-44 pb-8">
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
      <div className="min-h-screen bg-gray-50 pt-44 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              რაიონების ფასები
            </h1>
            <p className="text-gray-600 mb-6">
              თბილისის რაიონებში უძრავი ქონების საშუალო ფასი კვადრატულ მეტრზე
            </p>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">ყველაზე ძვირი რაიონი</p>
                      <p className="text-lg font-bold text-gray-900">
                        {sortedDistricts[0]?.nameKa || '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {sortedDistricts[0] ? formatPrice(sortedDistricts[0].pricePerSqm) : '-'}
                      </p>
                      <p className="text-xs text-gray-500">კვ/მ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">საშუალო ფასი</p>
                      <p className="text-lg font-bold text-gray-900">ყველა რაიონი</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {districts.length > 0 
                          ? formatPrice(Math.round(districts.reduce((sum, d) => sum + d.pricePerSqm, 0) / districts.length))
                          : '-'}
                      </p>
                      <p className="text-xs text-gray-500">კვ/მ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">ყველაზე იაფი რაიონი</p>
                      <p className="text-lg font-bold text-gray-900">
                        {sortedDistricts[sortedDistricts.length - 1]?.nameKa || '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {sortedDistricts[sortedDistricts.length - 1] 
                          ? formatPrice(sortedDistricts[sortedDistricts.length - 1].pricePerSqm) 
                          : '-'}
                      </p>
                      <p className="text-xs text-gray-500">კვ/მ</p>
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
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{district.nameKa}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {priceLevel.level}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {district.nameEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg border ${priceLevel.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">ფასი 1 კვ/მ:</span>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xl font-bold">
                            {district.pricePerSqm.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs opacity-75">
                        USD / კვადრატული მეტრი
                      </div>
                    </div>

                    {district.description && (
                      <p className="text-sm text-gray-600 mt-3">
                        {district.description}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>განახლებულია:</span>
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
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">მონაცემები არ მოიძებნა</h3>
              <p className="text-gray-500">
                ამჟამად არ არის ხელმისაწვდომი რაიონების ფასების ინფორმაცია
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