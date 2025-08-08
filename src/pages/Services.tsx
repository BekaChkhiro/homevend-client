import { Settings, Camera, Scale, Gavel, CreditCard, Clock, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Services = () => {
  const services = [
    {
      id: 1,
      title: "ქონების შეფასება",
      description: "პროფესიონალური ქონების შეფასება გამოცდილი ექსპერტების მიერ",
      icon: <Scale className="h-6 w-6" />,
      status: "მალე",
      statusColor: "bg-orange-100 text-orange-800",
      details: [
        "სრული ბაზრის ანალიზი",
        "დეტალური შეფასების რეპორტი",
        "სერტიფიცირებული შემფასებლები"
      ]
    },
    {
      id: 2,
      title: "ფოტო გადაღება",
      description: "პროფესიონალური ფოტო გადაღება ქონების რეკლამისთვის",
      icon: <Camera className="h-6 w-6" />,
      status: "მალე",
      statusColor: "bg-orange-100 text-orange-800",
      details: [
        "მაღალი ხარისხის ფოტოები",
        "პროფესიონალური ფოტოგრაფი",
        "სხვადასხვა რაკურსით გადაღება"
      ]
    },
    {
      id: 3,
      title: "იურიდიული კონსულტაცია",
      description: "უძრავი ქონების იურიდიული მხარდაჭერა და კონსულტაცია",
      icon: <Gavel className="h-6 w-6" />,
      status: "ხელმისაწვდომია",
      statusColor: "bg-green-100 text-green-800",
      phone: "+995 555 123 456",
      details: [
        "ხელშეკრულების მომზადება",
        "იურიდიული ექსპერტიზა",
        "სასამართლო წარმომადგენლობა"
      ]
    },
    {
      id: 4,
      title: "იპოთეკური დაფინანსება",
      description: "იპოთეკური სესხის მიღების დახმარება და კონსულტაცია",
      icon: <CreditCard className="h-6 w-6" />,
      status: "ხელმისაწვდომია",
      statusColor: "bg-green-100 text-green-800",
      details: [
        "საუკეთესო პირობების მოძებნა",
        "განაცხადის მომზადება",
        "ბანკთან მოლაპარაკება"
      ]
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ჩვენი სერვისები</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              უძრავი ქონების სფეროში სრული მომსახურების პაკეტი თქვენი საჭიროებისთვის
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
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge className={`mt-2 ${service.statusColor}`}>
                        {service.status === "მალე" && <Clock className="h-3 w-3 mr-1" />}
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-600 mt-3">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.details.map((detail, index) => (
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
                    მალე ხელმისაწვდომი
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
              გაქვთ კითხვები ჩვენი სერვისების შესახებ?
            </h2>
            <p className="text-muted-foreground mb-6">
              დაგვიკავშირდით და ჩვენი ექსპერტები დაგეხმარებიან სწორი არჩევანის გაკეთებაში
            </p>
            <Button size="lg">
              <Phone className="h-5 w-5 mr-2" />
              დაკავშირება
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};