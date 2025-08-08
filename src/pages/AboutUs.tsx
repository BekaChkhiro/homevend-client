import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Award, TrendingUp, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">ჩვენს შესახებ</h1>
            <p className="text-xl text-muted-foreground mb-8">
              HomeVend არის საქართველოს წამყვანი უძრავი ქონების პლატფორმა,
              რომელიც აერთიანებს მყიდველებს და გამყიდველებს ერთ ადგილას.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2">
                <Home className="h-4 w-4 mr-2" />
                10,000+ განცხადება
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                50,000+ მომხმარებელი
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                #1 პლატფორმა
              </Badge>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">ჩვენი მისია</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-center">
                  ჩვენი მისიაა გავხადოთ უძრავი ქონების ყიდვა-გაყიდვის პროცესი
                  მარტივი, უსაფრთხო და ეფექტური. ვეხმარებით ადამიანებს იპოვონ
                  მათი ოცნების სახლი ან გაყიდონ ქონება სწრაფად და გამჭვირვალედ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">ჩვენი ხედვა</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-center">
                  ჩვენი ხედვაა ვიყოთ საქართველოში უძრავი ქონების ბაზრის
                  ლიდერი და შევქმნათ ციფრული ეკოსისტემა, სადაც თითოეული
                  მომხმარებელი მიიღებს საუკეთესო მომსახურებას.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">რატომ HomeVend?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ჩვენ გთავაზობთ უნიკალურ სერვისებს, რომლებიც გხდის უძრავი ქონების
              ძებნის და გაყიდვის პროცესს მაქსიმალურად კომფორტულს.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">ფართო არჩევანი</h3>
                <p className="text-muted-foreground text-sm">
                  ათასობით განცხადება ყველა რეგიონიდან და ყველა ფასის კატეგორიიდან
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">ვერიფიცირებული აგენტები</h3>
                <p className="text-muted-foreground text-sm">
                  ყველა აგენტი გადის ვერიფიკაციას უსაფრთხოების მაქსიმალური დონისთვის
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">ბაზრის ანალიტიკა</h3>
                <p className="text-muted-foreground text-sm">
                  რეალურ დროში ფასების ანალიზი და ბაზრის ტენდენციების თვალყურება
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 მხარდაჭერა</h3>
                <p className="text-muted-foreground text-sm">
                  ჩვენი გუნდი მზადაა დაგეხმაროთ ნებისმიერ დროს
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">სწრაფი კომუნიკაცია</h3>
                <p className="text-muted-foreground text-sm">
                  მყისიერი შეტყობინებები აგენტებთან და მყიდველებთან
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">ინტერაქტიული რუკა</h3>
                <p className="text-muted-foreground text-sm">
                  განცხადებების ნახვა რუკაზე და მდებარეობის ზუსტი განსაზღვრა
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ჩვენი მონაცემები</h2>
              <p className="text-muted-foreground">რიცხვები, რომლებიც ჩვენს წარმატებაზე მეტყველებს</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">განცხადება</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-muted-foreground">მომხმარებელი</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">აგენტი</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">კმაყოფილება</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">მზად ხართ დაიწყოთ?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              შემოგვიერთდით ათასობით კმაყოფილ მომხმარებელს და იპოვეთ თქვენი ოცნების სახლი ან გაყიდეთ ქონება სწრაფად.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Link to="/dashboard/add-property" className="flex items-center gap-1.5">
                განცხადების დამატება
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                <Link to="/properties" className="flex items-center gap-1.5">
                ქონების ძებნა
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;