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
      views: 0,
      clicks: 0
    },
    {
      id: '3',
      name: t('advertisements.placements.homeBottomBanner.name'),
      location: t('advertisements.placements.homeBottomBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'active',
      price: 400,
      views: 0,
      clicks: 0
    },
    {
      id: '4',
      name: t('advertisements.placements.listingsTopBanner.name'),
      location: t('advertisements.placements.listingsTopBanner.location'),
      type: 'banner',
      dimensions: '728x90px (horizontal)',
      status: 'active',
      price: 380,
      views: 0,
      clicks: 0
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
      views: 0,
      clicks: 0
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
      views: 0,
      clicks: 0
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

  const fetchAdvertisements = async (forceRefresh = false) => {
    try {
      setLoading(true);
      console.log(`🟡 [FETCH ADS 1] Starting fetch... (forceRefresh: ${forceRefresh})`);

      // Add cache-busting parameter to force fresh data
      const params = forceRefresh ? { _t: Date.now() } : {};
      console.log('🟡 [FETCH ADS 2] Fetch params:', params);

      const data = await advertisementApi.getAdvertisements(params as any);

      console.log('🟡 [FETCH ADS 3] Received data:', data);
      console.log('🟡 [FETCH ADS 4] Number of ads:', data.advertisements?.length || 0);
      console.log('🟡 [FETCH ADS 5] Ad IDs:', data.advertisements?.map((ad: any) => ad.id).join(', '));
      console.log('🟡 [FETCH ADS 6] Full ad list:', data.advertisements);

      setAdvertisements(data.advertisements || []);
      console.log('🟡 [FETCH ADS 7] State updated with advertisements');
    } catch (error) {
      console.error('🟡 [FETCH ADS 8] Error fetching advertisements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load advertisements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      console.log('🟡 [FETCH ADS 9] Fetch completed, loading set to false');
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
    console.log('🔴 [DELETE DEBUG 1] handleDeleteAdvertisement called with ID:', id);
    console.log('🔴 [DELETE DEBUG 2] typeof id:', typeof id, 'value:', id);

    const confirmed = confirm('Are you sure you want to delete this advertisement?');
    console.log('🔴 [DELETE DEBUG 3] User confirmed:', confirmed);

    if (!confirmed) {
      console.log('🔴 [DELETE DEBUG 4] User cancelled delete');
      return;
    }

    try {
      console.log('🔴 [DELETE DEBUG 5] Starting delete API call for ID:', id);
      console.log('🔴 [DELETE DEBUG 6] advertisementApi object:', advertisementApi);

      const response = await advertisementApi.deleteAdvertisement(id);

      console.log('🔴 [DELETE DEBUG 7] API response received:', response);
      console.log('🔴 [DELETE DEBUG 8] response.success:', response.success);

      if (!response.success) {
        console.log('🔴 [DELETE DEBUG 9] Response indicates failure:', response.error);
        throw new Error(response.error || 'Failed to delete advertisement');
      }

      console.log('🔴 [DELETE DEBUG 10] Delete successful, updating local state');

      // Immediately remove from local state for instant UI feedback
      setAdvertisements((prev) => {
        const updated = prev.filter(ad => ad.id !== id);
        console.log(`🔴 [DELETE DEBUG 11] Updated local state. Before: ${prev.length}, After: ${updated.length}`);
        console.log(`🔴 [DELETE DEBUG 12] Removed ad IDs:`, prev.filter(ad => ad.id === id).map(a => a.id));
        return updated;
      });

      console.log('🔴 [DELETE DEBUG 13] Showing success toast');

      toast({
        title: 'Success',
        description: 'Advertisement deleted successfully',
      });

      // Force refresh from server to ensure sync
      console.log('🔴 [DELETE DEBUG 14] Scheduling refresh in 500ms');
      setTimeout(() => {
        console.log('🔴 [DELETE DEBUG 15] Executing scheduled refresh');
        fetchAdvertisements(true); // Force refresh with cache-busting
      }, 500);

      console.log('🔴 [DELETE DEBUG 16] handleDeleteAdvertisement completed successfully');

    } catch (error: any) {
      console.error('🔴 [DELETE DEBUG 17] Error caught:', error);
      console.error('🔴 [DELETE DEBUG 18] Error type:', error?.constructor?.name);
      console.error('🔴 [DELETE DEBUG 19] Error message:', error?.message);
      console.error('🔴 [DELETE DEBUG 20] Error response:', error?.response?.data);
      console.error('🔴 [DELETE DEBUG 21] Error response status:', error?.response?.status);

      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to delete advertisement';
      console.error('🔴 [DELETE DEBUG 22] Final error message:', errorMessage);

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      console.log('🔴 [DELETE DEBUG 23] Refreshing after error');
      // Refresh on error to ensure state is correct
      fetchAdvertisements(true);
    }
  };

  // Find ALL ads for each placement (not just active)
  const getAllAdsForPlacement = (placementId: string) => {
    return advertisements.filter(ad => ad.placementId === placementId);
  };

  // Find active ad for each placement
  const getActiveAdForPlacement = (placementId: string) => {
    return advertisements.find(
      ad => ad.placementId === placementId && ad.status === 'active'
    );
  };

  // Update placement stats with real data
  const getPlacementStats = (placementId: string) => {
    const allAds = getAllAdsForPlacement(placementId);
    const totalViews = allAds.reduce((sum, ad) => sum + (ad.views || 0), 0);
    const totalClicks = allAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0);

    const activeAd = getActiveAdForPlacement(placementId);

    return {
      views: totalViews,
      clicks: totalClicks,
      currentAd: activeAd ? {
        title: activeAd.title,
        advertiser: activeAd.advertiser,
        startDate: new Date(activeAd.startDate).toLocaleDateString(),
        endDate: new Date(activeAd.endDate).toLocaleDateString(),
      } : undefined,
    };
  };

  // Calculate real statistics from advertisements
  const totalViews = advertisements.reduce((sum, ad) => sum + (ad.views || 0), 0);
  const totalClicks = advertisements.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  const averageCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';
  const activeAdsCount = advertisements.filter(ad => ad.status === 'active').length;

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
              {activeAdsCount} {t('advertisements.stats.activeCount')}
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
              {totalViews.toLocaleString()}
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
              {totalClicks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              CTR: {averageCTR}%
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
              {averageCTR}%
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
            const allAds = getAllAdsForPlacement(placement.id);

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

                  {/* Show all advertisements for this placement */}
                  {allAds.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        {allAds.length === 1 ? 'Advertisement:' : `${allAds.length} Advertisements:`}
                      </p>
                      {allAds.map(ad => (
                        <div
                          key={ad.id}
                          className={`border rounded-lg p-3 ${
                            ad.status === 'active' ? 'bg-green-50 border-green-200' :
                            ad.status === 'expired' ? 'bg-gray-50 border-gray-200' :
                            'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">
                                  ID: {ad.id} - {ad.title}
                                </h4>
                                <Badge
                                  variant={ad.status === 'active' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {ad.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {ad.advertiser} • {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                console.log('🔵 [BUTTON CLICK] Delete button clicked for ad ID:', ad.id);
                                handleDeleteAdvertisement(ad.id);
                              }}
                              className="ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddAdvertisement(placement.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      {allAds.length > 0 ? t('advertisements.buttons.addAnother') || 'Add Another' : t('advertisements.buttons.activate')}
                    </Button>
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