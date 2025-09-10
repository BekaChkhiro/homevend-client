
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

interface AdBannerProps {
  type: "horizontal" | "vertical";
  className?: string;
}

export const AdBanner = ({ type, className }: AdBannerProps) => {
  const { t } = useTranslation('adBanner');

  const banners = {
    horizontal: {
      width: "w-full",
      height: "h-24",
      text: t('adBanner.horizontalBanner')
    },
    vertical: {
      width: "w-full",
      height: "h-64",
      text: t('adBanner.verticalBanner')
    }
  };

  const banner = banners[type];

  return (
    <Card className={`${banner.width} ${banner.height} ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">{t('adBanner.advertisement')}</div>
          <div className="text-xs text-gray-500">{banner.text}</div>
        </div>
      </div>
    </Card>
  );
};

