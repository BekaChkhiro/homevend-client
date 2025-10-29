import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building2, MapPin, Mail, Phone, Globe } from "lucide-react";
import { motion } from "framer-motion";

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            >
              ჩვენს შესახებ
            </motion.h1>

            {/* Company info card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 mb-8"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    შპს „ლარჯ ჰოუმ 2025"
                  </h2>
                  <p className="text-lg text-muted-foreground">ს/ნ 405780757</p>
                </div>
              </div>

              {/* Contact information grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Address */}
                <motion.div
                  variants={itemVariants}
                  className="group p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">მისამართი</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        ქ. თბილისი, ბერბუკის ქ. N7, მე-2 სადარბაზო; სართული 11, ბინა N54
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  variants={itemVariants}
                  className="group p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">ელ. ფოსტა</p>
                      <a
                        href="mailto:info@homevend.ge"
                        className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 font-medium hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        info@homevend.ge
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  variants={itemVariants}
                  className="group p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">საკონტაქტო ნომერი</p>
                      <p className="text-gray-700 dark:text-gray-300">-</p>
                    </div>
                  </div>
                </motion.div>

                {/* Website */}
                <motion.div
                  variants={itemVariants}
                  className="group p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-2">ვებსაიტი</p>
                      <a
                        href="https://www.homevend.ge"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 font-medium hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        www.homevend.ge
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Description section */}
              <motion.div
                variants={itemVariants}
                className="relative p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border-l-4 border-primary"
              >
                <div className="absolute top-4 right-4 opacity-10 dark:opacity-5">
                  <Building2 className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    პლატფორმის შესახებ
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    <a
                      href="https://www.homevend.ge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-bold hover:underline transition-colors"
                    >
                      www.homevend.ge
                    </a>{" "}
                    არის განცხადებების განსათავსებელი პლატფორმა, სადაც მომხმარებლები, სააგონტოები და დეველოპერები სრულიად უფასოდ შეძლებთ უძრავი ქონების სწრაფად და მარტივად გაყიდვის მიზნით განცხადებების განთავსებას. ასევე, სურვილის შემთხვევაში შესაძლებლობა გექნებათ ისარგებლოთ ფასიანი VIP განცხადებების განთავსების სერვისით. პლატფორმაზე თქვენი ბიზნესისა თუ საქმიანობის პოპულარიზაციის მიზნით შეგიძლიათ განათავსოთ რეკლამა.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative bottom accent */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center"
            >
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
