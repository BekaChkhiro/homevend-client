import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, type AuthContextType } from "@/contexts/AuthContext";
import { User, Building, Upload, X } from "lucide-react";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth() as AuthContextType;
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "agency",
    // Agency specific fields
    agencyName: "",
    agencyPhone: "",
    agencySocialMedia: "",
    agencyWebsite: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData({
      ...formData,
      role: value as "user" | "agency",
    });
    // Reset logo when switching tabs
    if (value !== "agency") {
      setLogoFile(null);
      setLogoPreview("");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "შეცდომა",
          description: "გთხოვთ აირჩიოთ სურათის ფაილი",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "შეცდომა", 
          description: "ლოგოს ზომა არ უნდა აღემატებოდეს 5MB-ს",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "შეცდომა",
        description: "პაროლები არ ემთხვევა ერთმანეთს",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      toast({
        title: "შეცდომა",
        description: "პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const registrationData: any = {
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Add role-specific data
      if (formData.role === "agency") {
        // For agency registration, don't send fullName
        registrationData.agencyData = {
          name: formData.agencyName,
          phone: formData.agencyPhone,
          socialMediaUrl: formData.agencySocialMedia || undefined,
          website: formData.agencyWebsite || undefined,
        };
      } else {
        // For regular user registration, send fullName
        registrationData.fullName = formData.fullName;
      }

      const success = await register(registrationData);

      if (success) {
        toast({
          title: "რეგისტრაცია წარმატებით დასრულდა!",
          description: "მოგესალმებით HOMEVEND.ge-ზე!",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "შეცდომა",
        description: "რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-48">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">რეგისტრაცია</CardTitle>
              <CardDescription className="text-center">
                შექმენით ანგარიში HOMEVEND.ge-ზე
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    რეგულარული მომხმარებელი
                  </TabsTrigger>
                  <TabsTrigger value="agency" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    სააგენტო
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="mt-6">
                  <TabsContent value="user" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium">
                          სახელი და გვარი
                        </label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="შეიყვანეთ სახელი და გვარი"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          ელ-ფოსტა
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="თქვენი ელ-ფოსტის მისამართი"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                          პაროლი
                        </label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="შეიყვანეთ პაროლი"
                          required
                          minLength={6}
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          გაიმეორეთ პაროლი
                        </label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="გაიმეორეთ პაროლი"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="agency" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="agencyName" className="text-sm font-medium">
                          სააგენტოს დასახელება
                        </label>
                        <Input
                          id="agencyName"
                          name="agencyName"
                          placeholder="შეიყვანეთ სააგენტოს დასახელება"
                          required
                          value={formData.agencyName}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="agencyLogo" className="text-sm font-medium">
                          ლოგო (არასავალდებულო)
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="relative">
                              <input
                                id="agencyLogo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                disabled={isLoading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-md bg-background hover:bg-gray-50 transition-colors cursor-pointer">
                                <Upload className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {logoFile ? logoFile.name : "აირჩიეთ ლოგოს ფაილი"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {logoPreview && (
                            <div className="relative">
                              <img
                                src={logoPreview}
                                alt="ლოგოს წინასწარი ნახვა"
                                className="w-16 h-16 object-cover rounded-md border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setLogoFile(null);
                                  setLogoPreview("");
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                disabled={isLoading}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          მხარდაჭერილი ფორმატები: JPG, PNG, GIF. მაქსიმალური ზომა: 5MB
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          ელ-ფოსტა
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="სააგენტოს ელ-ფოსტის მისამართი"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="agencyPhone" className="text-sm font-medium">
                          ტელეფონის ნომერი
                        </label>
                        <Input
                          id="agencyPhone"
                          name="agencyPhone"
                          placeholder="ტელეფონის ნომერი"
                          required
                          value={formData.agencyPhone}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="agencySocialMedia" className="text-sm font-medium">
                          სოციალური მედია URL (არასავალდებულო)
                        </label>
                        <Input
                          id="agencySocialMedia"
                          name="agencySocialMedia"
                          placeholder="https://facebook.com/yourpage"
                          value={formData.agencySocialMedia}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="agencyWebsite" className="text-sm font-medium">
                          ვებსაიტი (არასავალდებულო)
                        </label>
                        <Input
                          id="agencyWebsite"
                          name="agencyWebsite"
                          placeholder="https://yourwebsite.com"
                          value={formData.agencyWebsite}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                          პაროლი
                        </label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="შეიყვანეთ პაროლი"
                          required
                          minLength={6}
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          გაიმეორეთ პაროლი
                        </label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="გაიმეორეთ პაროლი"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? "მიმდინარეობს..." : formData.role === "agency" ? "სააგენტოს რეგისტრაცია" : "რეგისტრაცია"}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                უკვე გაქვთ ანგარიში?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  შესვლა
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
