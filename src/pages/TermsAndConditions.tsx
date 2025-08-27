import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-8 max-w-5xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl lg:text-3xl font-bold text-primary">
              წესები და პირობები
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">ჩვენს შესახებ</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>შპს „ლარჯ ჰოუმ 2025" ს/ნ 405780757</p>
                <p>მისამართი: ქ. თბილისი, ბერბუკის ქ. N7, მე-2 სადარბაზო; სართული 11, ბინა N54</p>
                <p>ელ. ფოსტა: info@homevend.ge</p>
                <p>ვებ-გვერდი: www.homevend.ge</p>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                www.homevend.ge არის განცხადებების განსათავსებელი პლატფორმა, სადაც მომხმარებლები, სააგონტოები და დეველოპერები სრულიად უფასოდ შეძლებთ უძრავი ქონების სწრაფად და მარტივად გაყიდვის მიზნით განცხადებების განთავსებას. ასევე, სურვილის შემთხვევაში შესაძლებლობა გექნებათ ისარგებლოთ ფასიანი VIP განცხადებების განთავსების სერვისით. პლატფორმაზე თქვენი ბიზნესისა თუ საქმიანობის პოპულარიზაციის მიზნით შეგიძლიათ განათავსოთ რეკლამა.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">განცხადებების განთავსება</h2>
              <p className="text-muted-foreground leading-relaxed">
                განცხადების განსათავსებლად უნდა გაიაროთ მარტივი რეგისტრაცია ელ.ფოსტის, Google-ის ან Facebook-ის მეშვეობით. რეგისტრირებულ მომხმარებელს, სააგენტოს და დეველოპერს შესაძლებლობა აქვთ განათავსონ შეუზღუდავი რაოდენობის განცხადება. განცხადების შევსება ხდება პლატფორმაზე არსებული ფორმის დახმარებით.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                საიტზე განთავსებული არათემატური ან/და პლატფორმის სპეციფიკიდან გამომდინარე შეუსაბამო განცხადება წაიშლება საიტის ადმინისტრაციის მიერ.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">საფასურები</h2>
              <p className="text-muted-foreground mb-4">
                პლატფორმაზე მომხმარებლის მიერ უძრავი ქონების გაყიდვის, გაქირავების, იჯარით გაცემის, გამოსყიდვის უფლებით ნასყიდობის, დაგირავებისა და დღიურად გაქირავების შესახებ ჩვეულებრივი განცხადების განთავსება უფასოა.
              </p>
              
              <h3 className="text-lg font-semibold mb-3 text-foreground">სააგენტოები</h3>
              <p className="text-muted-foreground mb-4">
                რეგისტრაციისას უძრავი ქონების სააგენტო ვალდებულია მონიშნოს ღილაკი „სააგენტო" და შეავსოს დამატებითი ინფორმაცია, რომელიც სავალდებულოა უძრავი ქონების სააგენტოდ რეგისტრაციისათვის. სააგენტოდ რეგისტრირებული პირების შესახებ ინფორმაცია აისახება სააგენტოების განყოფილებაში. სააგენტოების მიერ განცხადებების განთავსება უფასოა.
              </p>

              <h3 className="text-lg font-semibold mb-3 text-foreground">დეველოპერები</h3>
              <p className="text-muted-foreground mb-4">
                რეგისტრაციისას დეველოპერი ვალდებულია მონიშნოს ღილაკი „დეველოპერი" და შეავსოს დამატებითი ინფორმაცია, რომელიც სავალდებულოა დეველოპერად რეგისტრაციისათვის. დეველოპერად რეგისტრირებული პირების შესახებ ინფორმაცია აისახება დეველოპერების განყოფილებაში. დეველოპერების მიერ განცხადებების განთავსება უფასოა.
              </p>

              <h3 className="text-lg font-semibold mb-3 text-foreground">VIP განცხადებები</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-3">
                  რეგისტრირებულ მომხმარებელს, სააგენტოსა და დეველოპერს შესაძლებლობა აქვს პლატფორმაზე ჩვეულებრივი განცხადების გარდა განათავსოს შემდეგი ტიპის განცხადება:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>• Super VIP</span>
                    <span className="font-semibold">1 დღე - 8 ლარი</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• VIP +</span>
                    <span className="font-semibold">1 დღე - 6 ლარი</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• VIP</span>
                    <span className="font-semibold">1 დღე - 2 ლარი</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• ფერის დამატება</span>
                    <span className="font-semibold">1 დღე - 0.5 ლარი</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• ავტომატური განახლება</span>
                    <span className="font-semibold">1 დღე - 0.5 ლარი</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                მომხმარებლის, სააგენტოსა და დეველოპერის მიერ VIP განცხადების განთავსების საფასურის გადახდისა და განცხადების განთავსების შემდეგ განცხადება აქტიური იქნება VIP სტატუსით გადახდილი თანხის შესაბამისად. შემდგომი გადახდის განუხორციელებლობის შემთხვევაში განცხადება ავტომატურად გადავა ჩვეულებრივ (უფასო) განცხადებებში. პლატფორმის მიერ ჩვეულებრივი განცხადება ავტომატურად წაიშლება მისი განთავსებიდან 90 დღეში, იმ შემთხვევაში თუ მომხმარებლის მიერ არ მოხდება მის მიერვე განთავსებული განცხადების წაშლა.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">თანხის დაბრუნება</h2>
              <p className="text-muted-foreground">
                მომხმარებელს, სააგენტოსა და დეველოპერს შესაძლებლობა აქვს გადახდილი თანხის (მხედველობაშია გაუხარჯავი თანხა) უკან დაბრუნება მოითხოვოს გადახდიდან 12 საათის განმავლობაში. მოთხოვნილ თანხას დააკლდება საბანკო მომსახურების 2%.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">საიტის ადმინისტრაციის პასუხისმგებლობა</h2>
              <p className="text-muted-foreground">
                საიტის ადმინისტრაცია არ არის პასუხისმგებელი პლატფორმაზე განთავსებულ განცხადებებში მოცემული ინფორმაციის ნამდვილობაზე. საიტის ადმინისტრაცია არ ახორციელების უძრავი ქონების რეალიზაციას, გაქირავებას, იჯარით გაცემას, დაგირავებას, გამოსყიდვის უფლებით გასხვისებასა და დღიურად გაქირავებას. შესაბამისად, იგი პასუხს არ აგებს მათ მდგომარეობაზე. კომუნიკაცია ხორციელდება განცხადების განმთავსებელ პირსა და პოტენციურ მყიდველს შორის განცხადებაში მითითებულ საკონტაქტო მონაცემებზე და გარიგებაც ამ პირებს შორის დგება.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">მომხმარებლის ანგარიშის გაუქმება</h2>
              <p className="text-muted-foreground">
                რეგისტრირებულ მომხმარებელს, სააგენტოსა და დეველოპერს სურვილის შემთხვევაში შესაძლებლობა აქვს გააუქმოს საკუთარი ანგარიში. ამისათვის მომხმარებელი, სააგენტო, დეველოპერი საიტზე მითითებულ ელ. ფოსტის მეშვეობით აფიქსირებს საკუთარ სურვილს. საიტის ადმინისტრაცია შესაბამისი ელექტრონული წერილის მიღების შემთხვევაში გააუქმებს მომხმარებლის ანგარიშს.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">რეკლამის განთავსება</h2>
              <p className="text-muted-foreground">
                პლატფორმაზე ნებისმიერ ფიზიკურ თუ იურიდიულ პირს შესაძლებლობა აქვს განათავსოს რეკლამა საკუთარი ბიზნესისა თუ საქმიანობის პოპულარიზაციის მიზნით. რეკლამის განთავსების მსურველმა საიტის ადმინისტრაციას უნდა წარმოუდგინოს სარეკლამო ბანერი, რომელიც შესაბამისობაში უნდა იყოს „რეკლამის შესახებ" საქართველოს კანონის მოთხოვნებთან. ადმინისტრაცია იტოვებს უფლებას უარი განაცხადოს კანონთან შეუსაბამო რეკლამის განთავსებაზე. დეტალებისთვის იხილეთ რეკლამის შესახებ ინფორმაცია.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">კონფიდენციალობა</h2>
              <p className="text-muted-foreground">
                პლატფორმა კანონის შესაბამისად იცავს თქვენს პერსონალურ მონაცემებს, რათა ისინი არ გახდეს მესამე პირთათვის ხელმისაწვდომი. პლატფორმაზე განთავსებულ განცხადებაში მითითებული თქვენი სახელისა და საკონტაქტო ტელეფონის ნომრის დაცვაზე პლატფორმა პასუხს არ აგებს.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">ცვლილებების შეტანა</h2>
              <p className="text-muted-foreground">
                პლატფორმა უფლებამოსილია ნებისმიერ დროს ცალმხრივად, პლატფორმაზე გამოქვეყნების გზით, შეიტანოს ცვლილებები წესებსა და პირობებში მომხმარებლის, სააგენტოსა და დეველოპერის მხრიდან დამატებითი თანხმობის გარეშე. ცვლილებების განხორციელების შემდგომ პლატფორმის გამოყენება მიიჩნევა თქვენი მხრიდან ცვლილებებზე გაცხადებულ თანხმობად.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">დასკვნითი დებულებები</h2>
              <p className="text-muted-foreground">
                წესებსა და პირობებზე თანხმობით თქვენ ადასტურებთ, რომ ხართ ქმედუნარიანი, 18 წელს მიღწეული ფიზიკური პირი ან საქართველოს კანონმდებლობის შესაბამისად შექმნილი იურიდიული პირი და ეთანხმებით წინამდებარე წესებს და პირობებს.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;