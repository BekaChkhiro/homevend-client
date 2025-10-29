import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "შეტყობინება გაგზავნილია",
        description: "ჩვენ დაგიკავშირდებით 24 საათში",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16 mt-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">დაგვიკავშირდით</h1>
            <p className="text-xl text-muted-foreground mb-8">
              გაქვთ კითხვები ან სჭირდებათ დახმარება? ჩვენი გუნდი მზადაა დაგეხმაროთ
              უძრავი ქონების ნებისმიერ საკითხში.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                24/7 მხარდაჭერა
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                სწრაფი პასუხი
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <HelpCircle className="h-4 w-4 mr-2" />
                პროფესიონალი კონსულტაცია
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    დაგვიკავშირდით
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">სახელი და გვარი *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="თქვენი სახელი"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">ელექტრონული ფოსტა *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@gmail.com"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">ტელეფონის ნომერი</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+995 555 123 456"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">თემა *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="შეტყობინების თემა"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">შეტყობინება *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="დაწერეთ თქვენი შეტყობინება აქ..."
                        rows={6}
                        required
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
                          იგზავნება...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          გაგზავნა
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle>საკონტაქტო ინფორმაცია</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">ტელეფონი</div>
                      <a href="tel:+995595365555" className="text-muted-foreground hover:text-primary transition-colors block">
                        +995 595 36 55 55
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">ელექტრონული ფოსტა</div>
                      <div className="text-muted-foreground">info@homevend.ge</div>
                      <div className="text-muted-foreground">support@homevend.ge</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">მისამართი</div>
                      <div className="text-muted-foreground">
                        თბილისი, ვაშლიჯვარი<br />
                        ვაჟა-ფშაველას გამზ. 77<br />
                        0177, საქართველო
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">სამუშაო საათები</div>
                      <div className="text-muted-foreground">
                        ორშ-პარ: 09:00 - 18:00<br />
                        შაბათი: 10:00 - 16:00<br />
                        კვირა: დახურული
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>ხშირად დასმული კითხვები</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-medium text-sm mb-1">როგორ დავამატო განცხადება?</div>
                    <div className="text-xs text-muted-foreground">
                      დარეგისტრირდით და შედით თქვენს პროფილში, სადაც შეძლებთ ახალი განცხადების დამატებას.
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-sm mb-1">რამდენია სერვისის ღირებულება?</div>
                    <div className="text-xs text-muted-foreground">
                      ძირითადი ფუნქციები უფასოა. პრემიუმ სერვისებისთვის იხილეთ ჩვენი ფასები.
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-sm mb-1">როგორ დავუკავშირდე აგენტს?</div>
                    <div className="text-xs text-muted-foreground">
                      განცხადების გვერდზე იხილავთ აგენტის საკონტაქტო ინფორმაციას და შეტყობინების ღილაკს.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold text-orange-800">საგანგებო კონტაქტი</span>
                  </div>
                  <p className="text-sm text-orange-700 mb-2">
                    საგანგებო შემთხვევებისთვის ან სასწრაფო დახმარებისთვის:
                  </p>
                  <a href="tel:+995595365555" className="font-bold text-orange-800 hover:text-orange-900 transition-colors block">
                    +995 595 36 55 55
                  </a>
                  <div className="text-xs text-orange-600 mt-1">24/7 ხელმისაწვდომი</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto px-4 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>ჩვენი მდებარეობა</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-96 bg-muted rounded-b-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">ინტერაქტიული რუკა</p>
                  <p className="text-sm text-muted-foreground">
                    თბილისი, ვაშლიჯვარი, ვაჟა-ფშაველას გამზ. 77
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;