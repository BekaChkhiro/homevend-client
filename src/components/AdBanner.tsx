import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { advertisementApi } from "@/lib/api";

interface AdBannerProps {
  type: "horizontal" | "vertical";
  placementId: string;
  className?: string;
}

export const AdBanner = ({ type, placementId, className }: AdBannerProps) => {
  const { t } = useTranslation('adBanner');
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  const banners = {
    horizontal: {
      width: "w-full md:max-w-[720px]",
      height: "h-24",
      text: t('adBanner.horizontalBanner')
    },
    vertical: {
      width: "w-full md:max-w-[720px]",
      height: "h-64",
      text: t('adBanner.verticalBanner')
    }
  };

  const banner = banners[type];

  // Fetch active advertisement for this placement
  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const data = await advertisementApi.getActiveAdByPlacement(placementId);
        // data will be null if no active ad found (404)
        setAd(data);
      } catch (error) {
        // Unexpected error (not 404)
        console.error(`Error fetching ad for placement ${placementId}:`, error);
        setAd(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [placementId]);

  // Track view when ad is displayed
  useEffect(() => {
    if (ad && !hasTrackedView) {
      advertisementApi.trackView(ad.id).catch(err =>
        console.error('Failed to track view:', err)
      );
      setHasTrackedView(true);
    }
  }, [ad, hasTrackedView]);

  // Handle click
  const handleClick = () => {
    if (ad) {
      advertisementApi.trackClick(ad.id).catch(err =>
        console.error('Failed to track click:', err)
      );
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Show placeholder if loading or no ad
  if (loading || !ad) {
    return (
      <div className={`w-full flex items-center justify-center ${className}`}>
        <Card className={`${banner.width} ${banner.height}`}>
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">{t('adBanner.advertisement')}</div>
              <div className="text-xs text-gray-500">{loading ? 'Loading...' : banner.text}</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show real advertisement
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <Card className={`${banner.width} ${banner.height} overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`} onClick={handleClick}>
        <div className="w-full h-full relative">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
            Ad
          </div>
        </div>
      </Card>
    </div>
  );
};

