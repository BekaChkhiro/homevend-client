import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { AddAdvertisementModal } from './components/AddAdvertisementModal';
import { advertisementApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { 
  Monitor, 
  Smartphone, 
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Settings,
  Trash2
} from 'lucide-react';

interface AdPlacement {
  id: string;
  name: string;
  location: string;
  type: 'banner' | 'sidebar' | 'popup' | 'footer';
  dimensions: string;
  status: 'active' | 'inactive';
  price: number;
  views: number;
  clicks: number;
  currentAd?: {
    title: string;
    advertiser: string;
    startDate: string;
    endDate: string;
  };
}

const Advertisements = () => {
  const { t } = useTranslation('admin');
  const { toast } = useToast();
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlacementForAd, setSelectedPlacementForAd] = useState<string | undefined>();
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const adPlacements: AdPlacement[] = [
    {
      id: '1',
      name: t('advertisements.placements.homeTopBanner.name'),
      location: t('advertisements.placements.homeTopBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'active',
      price: 450,
      views: 18750,
      clicks: 312,
      currentAd: {
        title: t('advertisements.sampleAds.vakeResidence.title'),
        advertiser: t('advertisements.sampleAds.vakeResidence.advertiser'),
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      }
    },
    {
      id: '3',
      name: t('advertisements.placements.homeBottomBanner.name'),
      location: t('advertisements.placements.homeBottomBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'active',
      price: 400,
      views: 12890,
      clicks: 156,
      currentAd: {
        title: t('advertisements.sampleAds.propertyInsurance.title'),
        advertiser: t('advertisements.sampleAds.propertyInsurance.advertiser'),
        startDate: '2024-01-10',
        endDate: '2024-02-10'
      }
    },
    {
      id: '4',
      name: t('advertisements.placements.listingsTopBanner.name'),
      location: t('advertisements.placements.listingsTopBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'active',
      price: 380,
      views: 16450,
      clicks: 234,
      currentAd: {
        title: t('advertisements.sampleAds.propertyValuation.title'),
        advertiser: t('advertisements.sampleAds.propertyValuation.advertiser'),
        startDate: '2024-01-25',
        endDate: '2024-02-25'
      }
    },
    {
      id: '5',
      name: t('advertisements.placements.listingsMiddleBanner.name'),
      location: t('advertisements.placements.listingsMiddleBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'inactive',
      price: 320,
      views: 0,
      clicks: 0
    },
    {
      id: '6',
      name: t('advertisements.placements.listingsBottomBanner.name'),
      location: t('advertisements.placements.listingsBottomBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'inactive',
      price: 300,
      views: 0,
      clicks: 0
    },
    {
      id: '7',
      name: t('advertisements.placements.detailTopBanner.name'),
      location: t('advertisements.placements.detailTopBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'active',
      price: 280,
      views: 8950,
      clicks: 95,
      currentAd: {
        title: t('advertisements.sampleAds.mortgageLoan.title'),
        advertiser: t('advertisements.sampleAds.mortgageLoan.advertiser'),
        startDate: '2024-01-18',
        endDate: '2024-03-18'
      }
    },
    {
      id: '8',
      name: t('advertisements.placements.detailMiddleBanner.name'),
      location: t('advertisements.placements.detailMiddleBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'inactive',
      price: 250,
      views: 0,
      clicks: 0
    },
    {
      id: '9',
      name: t('advertisements.placements.detailSidebar.name'),
      location: t('advertisements.placements.detailSidebar.location'),
      type: 'sidebar',
      dimensions: '300x250px (vertical)',
      status: 'active',
      price: 220,
      views: 7340,
      clicks: 78,
      currentAd: {
        title: t('advertisements.sampleAds.renovationMaterials.title'),
        advertiser: t('advertisements.sampleAds.renovationMaterials.advertiser'),
        startDate: '2024-01-22',
        endDate: '2024-02-22'
      }
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return <Monitor className="h-4 w-4" />;
      case 'sidebar': return <Settings className="h-4 w-4 rotate-90" />;
      case 'popup': return <Eye className="h-4 w-4" />;
      case 'footer': return <Smartphone className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'banner': return t('advertisements.types.banner');
      case 'sidebar': return t('advertisements.types.sidebar');
      case 'popup': return t('advertisements.types.popup');
      case 'footer': return t('advertisements.types.footer');
      default: return type;
    }
  };

  // Fetch advertisements on mount
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const data = await advertisementApi.getAdvertisements();
      setAdvertisements(data.advertisements || []);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load advertisements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdvertisement = (placementId?: string) => {
    setSelectedPlacementForAd(placementId);
    setIsAddModalOpen(true);
  };

  const handleSubmitAdvertisement = async (adData: any) => {
    try {
      const createdAd = await advertisementApi.createAdvertisement({
        title: adData.title,
        description: adData.description,
        advertiser: adData.advertiser,
        placementId: adData.placementId,
        startDate: adData.startDate,
        endDate: adData.endDate,
        imageUrl: adData.imageUrl,
        targetUrl: adData.targetUrl,
      });

      toast({
        title: 'Success',
        description: 'Advertisement created successfully',
      });

      // Refresh the list
      fetchAdvertisements();

      // Return the created advertisement so the modal can upload the image
      return createdAd;
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create advertisement',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteAdvertisement = async (id: number) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      await advertisementApi.deleteAdvertisement(id);
      toast({
        title: 'Success',
        description: 'Advertisement deleted successfully',
      });
      fetchAdvertisements();
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete advertisement',
        variant: 'destructive',
      });
    }
  };

  // Find active ad for each placement
  const getActiveAdForPlacement = (placementId: string) => {
    return advertisements.find(
      ad => ad.placementId === placementId && ad.status === 'active'
    );
  };

  // Update placement stats with real data
  const getPlacementStats = (placementId: string) => {
    const ad = getActiveAdForPlacement(placementId);
    return {
      views: ad?.views || 0,
      clicks: ad?.clicks || 0,
      currentAd: ad ? {
        title: ad.title,
        advertiser: ad.advertiser,
        startDate: new Date(ad.startDate).toLocaleDateString(),
        endDate: new Date(ad.endDate).toLocaleDateString(),
      } : undefined,
    };
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('advertisements.title')}</h1>
        <p className="text-gray-600">{t('advertisements.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('advertisements.stats.totalPlacements')}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adPlacements.length}</div>
            <p className="text-xs text-muted-foreground">
              {adPlacements.filter(p => p.status === 'active').length} {t('advertisements.stats.activeCount')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('advertisements.stats.totalViews')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adPlacements.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-green-600">{t('advertisements.stats.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('advertisements.stats.totalClicks')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adPlacements.reduce((sum, p) => sum + p.clicks, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              CTR: {((adPlacements.reduce((sum, p) => sum + p.clicks, 0) / 
                      adPlacements.reduce((sum, p) => sum + p.views, 0)) * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('advertisements.stats.ctrIndicator')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((adPlacements.reduce((sum, p) => sum + p.clicks, 0) / 
                adPlacements.reduce((sum, p) => sum + p.views, 0)) * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-green-600">{t('advertisements.stats.averageCtr')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading advertisements...</p>
            </CardContent>
          </Card>
        ) : (
          adPlacements.map((placement) => {
            const stats = getPlacementStats(placement.id);
            const activeAd = getActiveAdForPlacement(placement.id);

            return (
              <Card key={placement.id} className={selectedPlacement === placement.id ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(placement.type)}
                      <div>
                        <CardTitle className="text-lg">{placement.name}</CardTitle>
                        <CardDescription>{placement.location}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={activeAd ? 'default' : 'secondary'}>
                        {activeAd ? t('advertisements.status.active') : t('advertisements.status.inactive')}
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(placement.type)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('advertisements.labels.dimensions')}</p>
                      <p className="font-medium">{placement.dimensions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('advertisements.labels.performance')}</p>
                      <p className="font-medium">{stats.views.toLocaleString()} {t('advertisements.labels.views')} • {stats.clicks} {t('advertisements.labels.clicks')}</p>
                    </div>
                  </div>

                  {stats.currentAd && (
                    <div className="border rounded-lg p-3 bg-green-50 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-green-800 text-sm">{stats.currentAd.title}</h4>
                          <p className="text-xs text-green-600">{stats.currentAd.advertiser}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-600">{t('advertisements.labels.expires')} {stats.currentAd.endDate} {t('advertisements.labels.until')}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {activeAd ? (
                      <Button variant="outline" size="sm" onClick={() => handleDeleteAdvertisement(activeAd.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t('advertisements.buttons.delete')}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleAddAdvertisement(placement.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        {t('advertisements.buttons.activate')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <AddAdvertisementModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedPlacementForAd(undefined);
        }}
        onSubmit={handleSubmitAdvertisement}
        availablePlacements={adPlacements}
        selectedPlacementId={selectedPlacementForAd}
      />
    </div>
  );
};

export default Advertisements;