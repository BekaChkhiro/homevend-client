import React, { useState, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, TrendingDown, DollarSign, Home, Building2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface District {
  id: number;
  nameKa: string;
  nameEn: string;
  description?: string;
  isActive: boolean;
}

interface PriceStatistic {
  notes: ReactNode;
  id: number;
  districtId: number;
  propertyType: string;
  dealType: string;
  averagePricePerSqm: number;
  minPricePerSqm?: number;
  maxPricePerSqm?: number;
  currency: string;
  period?: string;
  sampleSize: number;
  district: District;
  updatedAt: string;
}

interface DistrictPriceOverview {
  district: District;
  statistics: PriceStatistic[];
}

const PriceStatistics = () => {
  const [overviewData, setOverviewData] = useState<DistrictPriceOverview[]>([]);
  const [filteredData, setFilteredData] = useState<DistrictPriceOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedDealType, setSelectedDealType] = useState('all');

  useEffect(() => {
    fetchPriceOverview();
  }, []);

  useEffect(() => {
    filterData();
  }, [overviewData, searchTerm, selectedPropertyType, selectedDealType]);

  const fetchPriceOverview = async () => {
    try {
      const response = await fetch('/api/price-statistics/overview');
      if (response.ok) {
        const data = await response.json();
        setOverviewData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching price overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = overviewData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.district.nameKa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Property type filter
    if (selectedPropertyType !== 'all') {
      filtered = filtered.map(item => ({
        ...item,
        statistics: item.statistics.filter(stat => stat.propertyType === selectedPropertyType)
      })).filter(item => item.statistics.length > 0);
    }

    // Deal type filter
    if (selectedDealType !== 'all') {
      filtered = filtered.map(item => ({
        ...item,
        statistics: item.statistics.filter(stat => stat.dealType === selectedDealType)
      })).filter(item => item.statistics.length > 0);
    }

    setFilteredData(filtered);
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return <Building2 className="h-4 w-4" />;
      case 'house':
        return <Home className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getDealTypeBadgeVariant = (dealType: string) => {
    return dealType === 'sale' ? 'default' : 'secondary';
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-44 pb-8">
        <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ფასების სტატისტიკა რაიონების მიხედვით
          </h1>
          <p className="text-gray-600 mb-6">
            თბილისის სხვადასხვა რაიონებში უძრავი ქონების კვადრატული მეტრის საშუალო ფასები
          </p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ძებნა რაიონის მიხედვით..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="ქონების ტიპი" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა ტიპი</SelectItem>
                <SelectItem value="apartment">ბინა</SelectItem>
                <SelectItem value="house">სახლი</SelectItem>
                <SelectItem value="commercial">კომერციული</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDealType} onValueChange={setSelectedDealType}>
              <SelectTrigger>
                <SelectValue placeholder="გარიგების ტიპი" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა</SelectItem>
                <SelectItem value="sale">ყიდვა</SelectItem>
                <SelectItem value="rent">ქირავდება</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedPropertyType('all');
                setSelectedDealType('all');
              }}
            >
              გასუფთავება
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((districtData) => (
            <Card key={districtData.district.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {districtData.district.nameKa}
                  </span>
                  <span className="text-sm text-gray-500">
                    {districtData.district.nameEn}
                  </span>
                </CardTitle>
                {districtData.district.description && (
                  <CardDescription>
                    {districtData.district.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {districtData.statistics.map((stat) => (
                    <div key={stat.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPropertyTypeIcon(stat.propertyType)}
                          <span className="font-medium capitalize">
                            {stat.propertyType === 'apartment' ? 'ბინა' :
                             stat.propertyType === 'house' ? 'სახლი' :
                             stat.propertyType === 'commercial' ? 'კომერციული' : 
                             stat.propertyType === 'general' ? 'ზოგადი' : stat.propertyType}
                          </span>
                        </div>
                        <Badge variant={getDealTypeBadgeVariant(stat.dealType)}>
                          {stat.dealType === 'sale' ? 'ყიდვა' : 'ქირავდება'}
                          {stat.period && ` (${stat.period})`}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">ფასი 1 კვ/მ:</span>
                          <span className="font-bold text-green-600 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatPrice(stat.averagePricePerSqm, stat.currency)}
                          </span>
                        </div>

                        {stat.minPricePerSqm && stat.maxPricePerSqm && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">დიაპაზონი:</span>
                            <div className="flex items-center gap-1 text-sm">
                              <TrendingDown className="h-3 w-3 text-red-500" />
                              <span>{formatPrice(stat.minPricePerSqm, stat.currency)}</span>
                              <span className="text-gray-400">-</span>
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span>{formatPrice(stat.maxPricePerSqm, stat.currency)}</span>
                            </div>
                          </div>
                        )}

                        {stat.sampleSize > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">ნიმუშის ზომა:</span>
                            <Badge variant="outline" className="text-xs">
                              {stat.sampleSize} ქონება
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">განახლებულია:</span>
                          <span className="text-xs text-gray-500">
                            {new Date(stat.updatedAt).toLocaleDateString('ka-GE')}
                          </span>
                        </div>
                      </div>

                      {stat.notes && (
                        <div className="mt-2 text-xs text-gray-600 italic">
                          {stat.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {districtData.statistics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>მონაცემები არ მოიძებნა</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">მონაცემები არ მოიძებნა</h3>
            <p className="text-gray-500 mb-4">
              შეეცადეთ შეცვალოთ ძებნის პარამეტრები ან ფილტრები
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedPropertyType('all');
                setSelectedDealType('all');
              }}
            >
              ფილტრების გასუფთავება
            </Button>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PriceStatistics;