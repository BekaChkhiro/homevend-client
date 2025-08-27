
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-8 sm:mt-12 lg:mt-16">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-base sm:text-lg font-bold text-primary">HOMEVEND.ge</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              საქართველოს წამყვანი უძრავი ქონების პლატფორმა. 
              ჩვენ გაგეხმარებით იპოვოთ თქვენი სახლი.
            </p>
            <div className="flex space-x-3">
              <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">სწრაფი ლინკები</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">მთავარი</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">ყიდვა</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">ქირავდება</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">ახალი პროექტები</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">სერვისები</a></li>
            </ul>
          </div>


          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">კონტაქტი</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">საკონტაქტო ნომერი</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground break-all">info@homevend.ge</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">თბილისი, ბერბუკის ქ. N7<br />მე-2 სადარბაზო, სართული 11, ბინა N54</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-muted-foreground space-y-4 sm:space-y-0">
            <p>&copy; 2024 HOMEVEND.ge. ყველა უფლება დაცულია.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-center">
              <a href="#" className="hover:text-primary transition-colors">კონფიდენციალურობა</a>
              <a href="/terms" className="hover:text-primary transition-colors">წესები და პირობები</a>
              <a href="#" className="hover:text-primary transition-colors">კუკის პოლიტიკა</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
