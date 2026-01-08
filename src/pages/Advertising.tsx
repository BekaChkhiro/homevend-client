import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Phone,
  Mail
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdPlacement {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  pageType: 'home' | 'listings' | 'detail';
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  bannerType: 'horizontal' | 'vertical';
}

// SVG Preview component for ad placement visualization
const PlacementPreview = ({
  pageType,
  position,
  bannerType
}: {
  pageType: 'home' | 'listings' | 'detail';
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  bannerType: 'horizontal' | 'vertical';
}) => {
  const { t } = useTranslation();

  // Common SVG elements
  const Header = () => (
    <rect x="10" y="10" width="180" height="20" rx="2" fill="#e5e7eb" />
  );

  const ContentBlock = ({ y, height = 25 }: { y: number; height?: number }) => (
    <rect x="10" y={y} width="180" height={height} rx="2" fill="#f3f4f6" />
  );

  const PropertyGrid = ({ y }: { y: number }) => (
    <g>
      <rect x="10" y={y} width="55" height="35" rx="2" fill="#f3f4f6" />
      <rect x="72" y={y} width="55" height="35" rx="2" fill="#f3f4f6" />
      <rect x="134" y={y} width="55" height="35" rx="2" fill="#f3f4f6" />
    </g>
  );

  const AdBanner = ({ x, y, width, height }: { x: number; y: number; width: number; height: number }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="3"
        fill="#22872d"
        className="animate-pulse"
      />
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        AD
      </text>
    </g>
  );

  const Sidebar = ({ y, hasAd }: { y: number; hasAd?: boolean }) => (
    <g>
      <rect x="145" y={y} width="45" height="60" rx="2" fill="#f3f4f6" />
      {hasAd && <AdBanner x={145} y={y + 65} width={45} height={50} />}
    </g>
  );

  // Page layouts based on type
  const renderHomePage = () => {
    if (position === 'top') {
      return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect width="200" height="160" fill="#fafafa" rx="4" />
          <Header />
          <ContentBlock y={35} height={30} />
          <AdBanner x={10} y={70} width={180} height={20} />
          <PropertyGrid y={95} />
          <ContentBlock y={135} height={15} />
        </svg>
      );
    }
    // bottom
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect width="200" height="160" fill="#fafafa" rx="4" />
        <Header />
        <ContentBlock y={35} height={30} />
        <PropertyGrid y={70} />
        <PropertyGrid y={110} />
        <AdBanner x={10} y={150} width={180} height={20} />
      </svg>
    );
  };

  const renderListingsPage = () => {
    if (position === 'top') {
      return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect width="200" height="160" fill="#fafafa" rx="4" />
          <Header />
          <ContentBlock y={35} height={20} />
          <AdBanner x={10} y={60} width={180} height={20} />
          <PropertyGrid y={85} />
          <PropertyGrid y={125} />
        </svg>
      );
    }
    if (position === 'middle') {
      return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect width="200" height="160" fill="#fafafa" rx="4" />
          <Header />
          <ContentBlock y={35} height={15} />
          <PropertyGrid y={55} />
          <AdBanner x={10} y={95} width={180} height={20} />
          <PropertyGrid y={120} />
        </svg>
      );
    }
    // bottom
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect width="200" height="160" fill="#fafafa" rx="4" />
        <Header />
        <ContentBlock y={35} height={15} />
        <PropertyGrid y={55} />
        <PropertyGrid y={95} />
        <AdBanner x={10} y={135} width={180} height={20} />
      </svg>
    );
  };

  const renderDetailPage = () => {
    if (position === 'top') {
      return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect width="200" height="160" fill="#fafafa" rx="4" />
          <Header />
          <AdBanner x={10} y={35} width={180} height={20} />
          <rect x="10" y="60" width="125" height="50" rx="2" fill="#f3f4f6" />
          <Sidebar y={60} />
          <ContentBlock y={115} height={35} />
        </svg>
      );
    }
    if (position === 'middle') {
      return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect width="200" height="160" fill="#fafafa" rx="4" />
          <Header />
          <rect x="10" y="35" width="125" height="45" rx="2" fill="#f3f4f6" />
          <Sidebar y={35} />
          <AdBanner x={10} y={85} width={125} height={20} />
          <ContentBlock y={110} height={40} />
        </svg>
      );
    }
    // sidebar
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect width="200" height="160" fill="#fafafa" rx="4" />
        <Header />
        <rect x="10" y="35" width="125" height="50" rx="2" fill="#f3f4f6" />
        <rect x="145" y="35" width="45" height="40" rx="2" fill="#f3f4f6" />
        <AdBanner x={145} y={80} width={45} height={50} />
        <ContentBlock y={115} height={35} />
      </svg>
    );
  };

  return (
    <div className="w-full aspect-[5/4] bg-gray-50 rounded-lg p-2 border border-gray-200">
      {pageType === 'home' && renderHomePage()}
      {pageType === 'listings' && renderListingsPage()}
      {pageType === 'detail' && renderDetailPage()}
    </div>
  );
};

const Advertising = () => {
  const { t } = useTranslation();

  const adPlacements: AdPlacement[] = [
    {
      id: '1',
      name: t('advertisements:advertisingPage.placements.homeTopBanner.name'),
      location: t('advertisements:advertisingPage.placements.homeTopBanner.location'),
      description: t('advertisements:advertisingPage.placements.homeTopBanner.description'),
      price: 400,
      pageType: 'home',
      position: 'top',
      bannerType: 'horizontal'
    },
    {
      id: '3',
      name: t('advertisements:advertisingPage.placements.homeBottomBanner.name'),
      location: t('advertisements:advertisingPage.placements.homeBottomBanner.location'),
      description: t('advertisements:advertisingPage.placements.homeBottomBanner.description'),
      price: 400,
      pageType: 'home',
      position: 'bottom',
      bannerType: 'horizontal'
    },
    {
      id: '4',
      name: t('advertisements:advertisingPage.placements.listingsTopBanner.name'),
      location: t('advertisements:advertisingPage.placements.listingsTopBanner.location'),
      description: t('advertisements:advertisingPage.placements.listingsTopBanner.description'),
      price: 400,
      pageType: 'listings',
      position: 'top',
      bannerType: 'horizontal'
    },
    {
      id: '5',
      name: t('advertisements:advertisingPage.placements.listingsMiddleBanner.name'),
      location: t('advertisements:advertisingPage.placements.listingsMiddleBanner.location'),
      description: t('advertisements:advertisingPage.placements.listingsMiddleBanner.description'),
      price: 400,
      pageType: 'listings',
      position: 'middle',
      bannerType: 'horizontal'
    },
    {
      id: '6',
      name: t('advertisements:advertisingPage.placements.listingsBottomBanner.name'),
      location: t('advertisements:advertisingPage.placements.listingsBottomBanner.location'),
      description: t('advertisements:advertisingPage.placements.listingsBottomBanner.description'),
      price: 400,
      pageType: 'listings',
      position: 'bottom',
      bannerType: 'horizontal'
    },
    {
      id: '7',
      name: t('advertisements:advertisingPage.placements.detailTopBanner.name'),
      location: t('advertisements:advertisingPage.placements.detailTopBanner.location'),
      description: t('advertisements:advertisingPage.placements.detailTopBanner.description'),
      price: 400,
      pageType: 'detail',
      position: 'top',
      bannerType: 'horizontal'
    },
    {
      id: '8',
      name: t('advertisements:advertisingPage.placements.detailMiddleBanner.name'),
      location: t('advertisements:advertisingPage.placements.detailMiddleBanner.location'),
      description: t('advertisements:advertisingPage.placements.detailMiddleBanner.description'),
      price: 400,
      pageType: 'detail',
      position: 'middle',
      bannerType: 'horizontal'
    },
    {
      id: '9',
      name: t('advertisements:advertisingPage.placements.detailSidebar.name'),
      location: t('advertisements:advertisingPage.placements.detailSidebar.location'),
      description: t('advertisements:advertisingPage.placements.detailSidebar.description'),
      price: 400,
      pageType: 'detail',
      position: 'sidebar',
      bannerType: 'vertical'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('advertisements:advertisingPage.title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('advertisements:advertisingPage.subtitle')}
            </p>
          </div>
        </div>

        {/* Intro Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('advertisements:advertisingPage.intro.title')}</CardTitle>
                <CardDescription className="text-base">
                  {t('advertisements:advertisingPage.intro.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Advertising Placements */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('advertisements:advertisingPage.placements.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('advertisements:advertisingPage.placements.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {adPlacements.map((placement) => (
              <Card key={placement.id} className="hover:shadow-lg transition-all overflow-hidden">
                {/* Preview SVG on top */}
                <div className="p-4 pb-0">
                  <PlacementPreview
                    pageType={placement.pageType}
                    position={placement.position}
                    bannerType={placement.bannerType}
                  />
                </div>

                {/* Info section below */}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight">{placement.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{placement.location}</CardDescription>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-primary">{placement.price}₾</div>
                      <div className="text-xs text-muted-foreground">{t('advertisements:advertisingPage.placements.perMonth')}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">{placement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Restrictions */}
        <div className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-900">
                  {t('advertisements:advertisingPage.legalRestrictions.title')}
                </CardTitle>
                <CardDescription className="text-amber-800">
                  {t('advertisements:advertisingPage.legalRestrictions.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {(t('advertisements:advertisingPage.legalRestrictions.restrictions', { returnObjects: true }) as string[]).map((restriction, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-900">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{restriction}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-amber-800 font-medium">
                  {t('advertisements:advertisingPage.legalRestrictions.contactInfo')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('advertisements:advertisingPage.contact.title')}</CardTitle>
                <CardDescription>
                  {t('advertisements:advertisingPage.contactForm.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{t('advertisements:advertisingPage.contact.advertisingDepartment')}</div>
                    <div className="text-muted-foreground text-lg">+995 595 36 55 55</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{t('advertisements:advertisingPage.contact.email')}</div>
                    <div className="text-muted-foreground text-lg">advertising@homevend.ge</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{t('advertisements:advertisingPage.contact.workingHours')}</div>
                    <div className="text-muted-foreground">
                      {t('advertisements:advertisingPage.contact.mondayToFriday')}<br />
                      {t('advertisements:advertisingPage.contact.saturday')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Advertising;
