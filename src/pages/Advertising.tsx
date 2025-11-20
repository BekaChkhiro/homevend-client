import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdPlacement {
  id: string;
  name: string;
  location: string;
  description: string;
}

const Advertising = () => {
  const { t } = useTranslation();

  const adPlacements: AdPlacement[] = [
    {
      id: '1',
      name: t('advertisements:advertisingPage.placements.homeTopBanner.name'),
      location: t('advertisements:advertisingPage.placements.homeTopBanner.location'),
      description: t('advertisements:advertisingPage.placements.homeTopBanner.description')
    },
    {
      id: '3',
      name: t('advertisements:advertisingPage.placements.homeBottomBanner.name'),
      location: t('advertisements:advertisingPage.placements.homeBottomBanner.location'),
      description: t('advertisements:advertisingPage.placements.homeBottomBanner.description')
    },
    {
      id: '4',
      name: t('advertisements:advertisingPage.placements.listingsTopBanner.name'),
      location: t('advertisements:advertisingPage.placements.listingsTopBanner.location'),
      description: t('advertisements:advertisingPage.placements.listingsTopBanner.description')
    },
    {
      id: '5',
      name: t('advertisements:advertisingPage.placements.listingsMiddleBanner.name'),
      location: t('advertisements:advertisingPage.placements.listingsMiddleBanner.location'),
      description: t('advertisements:advertisingPage.placements.listingsMiddleBanner.description')
    },
    {
      id: '6',
      name: t('advertisements:advertisingPage.placements.listingsBottomBanner.name'),
      location: t('advertisements:advertisingPage.placements.listingsBottomBanner.location'),
      description: t('advertisements:advertisingPage.placements.listingsBottomBanner.description')
    },
    {
      id: '7',
      name: t('advertisements:advertisingPage.placements.detailTopBanner.name'),
      location: t('advertisements:advertisingPage.placements.detailTopBanner.location'),
      description: t('advertisements:advertisingPage.placements.detailTopBanner.description')
    },
    {
      id: '8',
      name: t('advertisements:advertisingPage.placements.detailMiddleBanner.name'),
      location: t('advertisements:advertisingPage.placements.detailMiddleBanner.location'),
      description: t('advertisements:advertisingPage.placements.detailMiddleBanner.description')
    },
    {
      id: '9',
      name: t('advertisements:advertisingPage.placements.detailSidebar.name'),
      location: t('advertisements:advertisingPage.placements.detailSidebar.location'),
      description: t('advertisements:advertisingPage.placements.detailSidebar.description')
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

          <div className="grid gap-6">
            {adPlacements.map((placement) => (
              <Card key={placement.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{placement.name}</CardTitle>
                      <CardDescription>{placement.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{placement.description}</p>
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