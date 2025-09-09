import { Settings, Camera, Scale, Gavel, CreditCard, Clock, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export const Services = () => {
  const { t } = useTranslation('services');

  const services = [
    {
      id: 1,
      titleKey: "services.propertyAppraisal.title",
      descriptionKey: "services.propertyAppraisal.description",
      detailsKey: "services.propertyAppraisal.details",
      icon: <Scale className="h-6 w-6" />,
      status: "comingSoon",
      statusColor: "bg-orange-100 text-orange-800"
    },
    {
      id: 2,
      titleKey: "services.photography.title",
      descriptionKey: "services.photography.description",
      detailsKey: "services.photography.details",
      icon: <Camera className="h-6 w-6" />,
      status: "comingSoon",
      statusColor: "bg-orange-100 text-orange-800"
    },
    {
      id: 3,
      titleKey: "services.legalConsultation.title",
      descriptionKey: "services.legalConsultation.description",
      detailsKey: "services.legalConsultation.details",
      icon: <Gavel className="h-6 w-6" />,
      status: "available",
      statusColor: "bg-green-100 text-green-800",
      phone: "+995 555 123 456"
    },
    {
      id: 4,
      titleKey: "services.mortgageFinancing.title",
      descriptionKey: "services.mortgageFinancing.description",
      detailsKey: "services.mortgageFinancing.details",
      icon: <CreditCard className="h-6 w-6" />,
      status: "available",
      statusColor: "bg-green-100 text-green-800"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-16">
        {/* Header */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary text-white p-3 rounded-lg">
                <Settings className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 mx-auto">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{t(service.titleKey)}</CardTitle>
                      <Badge className={`mt-2 ${service.statusColor}`}>
                        {service.status === "comingSoon" && <Clock className="h-3 w-3 mr-1" />}
                        {t(`status.${service.status}`)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-600 mt-3">
                  {t(service.descriptionKey)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {(t(service.detailsKey, { returnObjects: true }) as string[]).map((detail, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mr-2"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
                
                {service.phone ? (
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{service.phone}</span>
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    <Clock className="h-4 w-4 mr-2" />
                    {t('buttons.comingSoon')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-4">
          <div className="text-center bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('contact.description')}
            </p>
            <Button size="lg">
              <Phone className="h-5 w-5 mr-2" />
              {t('buttons.contact')}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};