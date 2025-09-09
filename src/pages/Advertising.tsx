import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Monitor, 
  Settings, 
  Eye,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface AdPlacement {
  id: string;
  name: string;
  location: string;
  type: 'banner' | 'sidebar';
  dimensions: string;
  price: number;
  monthlyViews: number;
  ctr: number;
  description: string;
}

const Advertising = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    interestedPlacements: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adPlacements: AdPlacement[] = [
    {
      id: '1',
      name: 'მთავარი გვერდის ზედა ბანერი',
      location: 'მთავარი გვერდი - hero section-ის ქვეშ',
      type: 'banner',
      dimensions: '728x90px',
      price: 450,
      monthlyViews: 18750,
      ctr: 1.67,
      description: 'ყველაზე ხილვადი ადგილი საიტზე, რომელიც ყველა ვიზიტორს ხედავს'
    },
    {
      id: '2',
      name: 'მთავარი გვერდის გვერდითი ბარი',
      location: 'მთავარი გვერდი - ფილტრის პანელის ქვეშ',
      type: 'sidebar',
      dimensions: '300x250px',
      price: 350,
      monthlyViews: 14200,
      ctr: 1.33,
      description: 'მაღალი ენგეიჯმენტის მქონე ზონა ფილტრების გამოყენების დროს'
    },
    {
      id: '3',
      name: 'მთავარი გვერდის ქვედა ბანერი',
      location: 'მთავარი გვერდი - property grid-ის ქვეშ',
      type: 'banner',
      dimensions: '728x90px',
      price: 400,
      monthlyViews: 12890,
      ctr: 1.21,
      description: 'იდეალური ადგილი ღრმად დაინტერესებული მომხმარებლებისთვის'
    },
    {
      id: '4',
      name: 'განცხადებების გვერდის ზედა ბანერი',
      location: 'განცხადებების გვერდი - search header-ის ქვეშ',
      type: 'banner',
      dimensions: '728x90px',
      price: 380,
      monthlyViews: 16450,
      ctr: 1.42,
      description: 'მაღალი კონვერტაციის ზონა აქტიური ძიების დროს'
    },
    {
      id: '5',
      name: 'განცხადებების გვერდის გვერდითი ბარი',
      location: 'განცხადებების გვერდი - ფილტრის პანელის ქვეშ',
      type: 'sidebar',
      dimensions: '300x250px',
      price: 320,
      monthlyViews: 13200,
      ctr: 1.18,
      description: 'ტარგეტირებული აუდიტორია კონკრეტული ძიების ინტერესებით'
    },
    {
      id: '6',
      name: 'განცხადების დეტალების ზედა ბანერი',
      location: 'PropertyDetail გვერდი - header-ის ქვეშ',
      type: 'banner',
      dimensions: '728x90px',
      price: 280,
      monthlyViews: 8950,
      ctr: 1.06,
      description: 'მაღალი ინტენტის მომხმარებლები კონკრეტული ქონების შესახებ'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return <Monitor className="h-4 w-4" />;
      case 'sidebar': return <Settings className="h-4 w-4 rotate-90" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'banner': return t('advertisements:advertisingPage.placements.banner');
      case 'sidebar': return t('advertisements:advertisingPage.placements.sidebar');
      default: return type;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePlacementSelection = (placementId: string) => {
    const isSelected = contactForm.interestedPlacements.includes(placementId);
    if (isSelected) {
      setContactForm(prev => ({
        ...prev,
        interestedPlacements: prev.interestedPlacements.filter(id => id !== placementId)
      }));
    } else {
      setContactForm(prev => ({
        ...prev,
        interestedPlacements: [...prev.interestedPlacements, placementId]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: t('advertisements:advertisingPage.contactForm.messageSent'),
        description: t('advertisements:advertisingPage.contactForm.messageDescription'),
      });
      setContactForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        interestedPlacements: []
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const totalViews = adPlacements.reduce((sum, p) => sum + p.monthlyViews, 0);
  const averageCTR = adPlacements.reduce((sum, p) => sum + p.ctr, 0) / adPlacements.length;

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
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <Badge variant="secondary" className="px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                50,000+ {t('advertisements:advertisingPage.stats.users')}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                {totalViews.toLocaleString()} {t('advertisements:advertisingPage.stats.viewsPerMonth')}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                {averageCTR.toFixed(1)}% {t('advertisements:advertisingPage.stats.averageCtr')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('advertisements:advertisingPage.stats.monthlyViews')}</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-green-600">+15% {t('advertisements:advertisingPage.stats.growthThisMonth')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('advertisements:advertisingPage.stats.registeredUsers')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50,000+</div>
                <p className="text-xs text-muted-foreground">{t('advertisements:advertisingPage.stats.activeUsers')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('advertisements:advertisingPage.stats.averageCtrStat')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageCTR.toFixed(1)}%</div>
                <p className="text-xs text-green-600">{t('advertisements:advertisingPage.stats.higherThanIndustry')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('advertisements:advertisingPage.stats.listings')}</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10,000+</div>
                <p className="text-xs text-muted-foreground">{t('advertisements:advertisingPage.stats.activeListings')}</p>
              </CardContent>
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
              <Card 
                key={placement.id} 
                className={`cursor-pointer transition-all ${
                  contactForm.interestedPlacements.includes(placement.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handlePlacementSelection(placement.id)}
              >
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
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">₾{placement.price}</div>
                        <div className="text-xs text-muted-foreground">{t('advertisements:advertisingPage.placements.perMonth')}</div>
                      </div>
                      {contactForm.interestedPlacements.includes(placement.id) && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{placement.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Badge variant="outline" className="text-xs">{getTypeLabel(placement.type)}</Badge>
                      </div>
                      <p className="text-sm font-medium">{placement.dimensions}</p>
                      <p className="text-xs text-muted-foreground">{t('advertisements:advertisingPage.placements.size')}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold">{placement.monthlyViews.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{t('advertisements:advertisingPage.placements.viewsPerMonth')}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-green-600">{placement.ctr}%</div>
                      <p className="text-xs text-muted-foreground">{t('advertisements:advertisingPage.placements.averageCtr')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    {t('advertisements:advertisingPage.contactForm.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('advertisements:advertisingPage.contactForm.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t('advertisements:advertisingPage.contactForm.nameLabel')} *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          placeholder={t('advertisements:advertisingPage.contactForm.namePlaceholder')}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">{t('advertisements:advertisingPage.contactForm.companyLabel')} *</Label>
                        <Input
                          id="company"
                          name="company"
                          value={contactForm.company}
                          onChange={handleInputChange}
                          placeholder={t('advertisements:advertisingPage.contactForm.companyPlaceholder')}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">{t('advertisements:advertisingPage.contactForm.emailLabel')} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          placeholder={t('advertisements:advertisingPage.contactForm.emailPlaceholder')}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('advertisements:advertisingPage.contactForm.phoneLabel')} *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={handleInputChange}
                          placeholder={t('advertisements:advertisingPage.contactForm.phonePlaceholder')}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {contactForm.interestedPlacements.length > 0 && (
                      <div>
                        <Label>{t('advertisements:advertisingPage.contactForm.selectedPlacements')}</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {contactForm.interestedPlacements.map(placementId => {
                            const placement = adPlacements.find(p => p.id === placementId);
                            return (
                              <Badge key={placementId} variant="default">
                                {placement?.name} - ₾{placement?.price}/{t('advertisements:advertisingPage.placements.perMonth')}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="message">{t('advertisements:advertisingPage.contactForm.additionalInfo')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder={t('advertisements:advertisingPage.contactForm.additionalInfoPlaceholder')}
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full md:w-auto px-8" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('advertisements:advertisingPage.contactForm.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('advertisements:advertisingPage.contactForm.sendRequest')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('advertisements:advertisingPage.contact.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{t('advertisements:advertisingPage.contact.advertisingDepartment')}</div>
                      <div className="text-muted-foreground">+995 555 123 456</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{t('advertisements:advertisingPage.contact.email')}</div>
                      <div className="text-muted-foreground">advertising@homevend.ge</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{t('advertisements:advertisingPage.contact.workingHours')}</div>
                      <div className="text-muted-foreground">
                        {t('advertisements:advertisingPage.contact.mondayToFriday')}<br />
                        {t('advertisements:advertisingPage.contact.saturday')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">{t('advertisements:advertisingPage.specialOffer.title')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('advertisements:advertisingPage.specialOffer.discount')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('advertisements:advertisingPage.specialOffer.firstMonth')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Advertising;