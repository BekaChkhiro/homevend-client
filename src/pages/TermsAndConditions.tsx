import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { termsApi } from "@/lib/api";

interface TermsSection {
  id: string;
  order: number;
  headerKa: string;
  headerEn: string;
  headerRu: string;
  contentKa: string;
  contentEn: string;
  contentRu: string;
}

const TermsAndConditions = () => {
  const { i18n } = useTranslation();
  const [sections, setSections] = useState<TermsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchTermsContent();
  }, [i18n.language]);

  const fetchTermsContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await termsApi.getActiveTerms(i18n.language);

      if (data && data.sections) {
        // Sort sections by order
        const sortedSections = [...data.sections].sort((a, b) =>
          (a.order || 0) - (b.order || 0)
        );
        setSections(sortedSections);

        if (data.updatedAt) {
          setLastUpdated(new Date(data.updatedAt));
        }
      } else {
        // If no content from API, use default sections
        setSections(getDefaultSections());
      }
    } catch (err) {
      console.error('Error fetching terms and conditions:', err);
      setError('Failed to load terms and conditions');
      // Fall back to default content on error
      setSections(getDefaultSections());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSections = (): TermsSection[] => {
    return [
      {
        id: '1',
        order: 0,
        headerKa: 'ჩვენს შესახებ',
        headerEn: 'About Us',
        headerRu: 'О нас',
        contentKa: `შპს „ლარჯ ჰოუმ 2025" ს/ნ 405780757
მისამართი: ქ. თბილისი, ბერბუკის ქ. N7, მე-2 სადარბაზო; სართული 11, ბინა N54
ელ. ფოსტა: info@homevend.ge
ვებ-გვერდი: www.homevend.ge

www.homevend.ge არის განცხადებების განსათავსებელი პლატფორმა, სადაც მომხმარებლები, სააგონტოები და დეველოპერები სრულიად უფასოდ შეძლებთ უძრავი ქონების სწრაფად და მარტივად გაყიდვის მიზნით განცხადებების განთავსებას.`,
        contentEn: `LLC "Large Home 2025" ID: 405780757
Address: Tbilisi, Berbuki St. N7, 2nd Building; Floor 11, Apt. N54
Email: info@homevend.ge
Website: www.homevend.ge

www.homevend.ge is an advertising platform where users, agencies and developers can post real estate sale advertisements completely free of charge.`,
        contentRu: `ООО "Лардж Хоум 2025" ИД: 405780757
Адрес: г. Тбилиси, ул. Бербуки N7, 2-й подъезд; 11 этаж, кв. N54
Эл. почта: info@homevend.ge
Веб-сайт: www.homevend.ge

www.homevend.ge - это платформа для размещения объявлений, где пользователи, агентства и застройщики могут совершенно бесплатно размещать объявления о продаже недвижимости.`
      },
      {
        id: '2',
        order: 1,
        headerKa: 'განცხადებების განთავსება',
        headerEn: 'Posting Advertisements',
        headerRu: 'Размещение объявлений',
        contentKa: 'განცხადების განსათავსებლად უნდა გაიაროთ მარტივი რეგისტრაცია ელ.ფოსტის, Google-ის ან Facebook-ის მეშვეობით. რეგისტრირებულ მომხმარებელს, სააგენტოს და დეველოპერს შესაძლებლობა აქვთ განათავსონ შეუზღუდავი რაოდენობის განცხადება.',
        contentEn: 'To post an advertisement, you need to complete a simple registration via email, Google or Facebook. Registered users, agencies and developers can post unlimited number of advertisements.',
        contentRu: 'Для размещения объявления необходимо пройти простую регистрацию через электронную почту, Google или Facebook. Зарегистрированные пользователи, агентства и застройщики могут размещать неограниченное количество объявлений.'
      },
      {
        id: '3',
        order: 2,
        headerKa: 'საფასურები',
        headerEn: 'Fees',
        headerRu: 'Тарифы',
        contentKa: 'პლატფორმაზე მომხმარებლის მიერ უძრავი ქონების გაყიდვის, გაქირავების, იჯარით გაცემის, გამოსყიდვის უფლებით ნასყიდობის, დაგირავებისა და დღიურად გაქირავების შესახებ ჩვეულებრივი განცხადების განთავსება უფასოა.',
        contentEn: 'Posting regular advertisements for sale, rental, lease, mortgage, and daily rental of real estate on the platform is free.',
        contentRu: 'Размещение обычных объявлений о продаже, аренде, лизинге, ипотеке и посуточной аренде недвижимости на платформе бесплатно.'
      }
    ];
  };

  const renderSectionContent = (section: TermsSection) => {
    const header = i18n.language === 'ka' ? section.headerKa :
                   i18n.language === 'ru' ? section.headerRu :
                   section.headerEn;
    const content = i18n.language === 'ka' ? section.contentKa :
                    i18n.language === 'ru' ? section.contentRu :
                    section.contentEn;

    if (!header && !content) return null;

    return (
      <section key={section.id} className="mb-8">
        {header && (
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            {header}
          </h2>
        )}
        {content && (
          <div className="space-y-3">
            {content.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null;

              // Check if it's a list item
              if (paragraph.startsWith('- ') || paragraph.startsWith('• ')) {
                return (
                  <li key={index} className="ml-6 text-muted-foreground">
                    {paragraph.substring(2)}
                  </li>
                );
              }

              return (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}
        {section.order < sections.length - 1 && (
          <Separator className="my-8" />
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-8 max-w-5xl">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-8 max-w-5xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl lg:text-3xl font-bold text-primary">
              {i18n.language === 'ka' ? 'წესები და პირობები' :
               i18n.language === 'ru' ? 'Правила и условия' :
               'Terms and Conditions'}
            </CardTitle>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-2">
                {i18n.language === 'ka' ? 'ბოლო განახლება: ' :
                 i18n.language === 'ru' ? 'Последнее обновление: ' :
                 'Last updated: '}
                {lastUpdated.toLocaleDateString(i18n.language === 'ka' ? 'ka-GE' :
                                                i18n.language === 'ru' ? 'ru-RU' :
                                                'en-US')}
              </p>
            )}
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            {error && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {sections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {i18n.language === 'ka' ? 'წესები და პირობები მალე დაემატება' :
                   i18n.language === 'ru' ? 'Правила и условия скоро будут добавлены' :
                   'Terms and conditions will be added soon'}
                </p>
              </div>
            ) : (
              <div>
                {sections.map((section) => renderSectionContent(section))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;