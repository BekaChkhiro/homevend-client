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
import { User, Building, Upload, X, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth() as AuthContextType;
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "agency" | "developer",
    // Agency specific fields
    agencyName: "",
    agencyPhone: "",
    agencySocialMedia: "",
    agencyWebsite: "",
    // Developer specific fields (same as agency)
    developerName: "",
    developerPhone: "",
    developerSocialMedia: "",
    developerWebsite: "",
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
      role: value as "user" | "agency" | "developer",
    });
    // Reset logo when switching tabs
    if (value !== "agency" && value !== "developer") {
      setLogoFile(null);
      setLogoPreview("");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (match backend config)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "შეცდომა",
          description: "მხარდაჭერილი ფორმატები: JPG, PNG, SVG",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 2MB to match backend config)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "შეცდომა",
          description: "ლოგოს ზომა არ უნდა აღემატებოდეს 2MB-ს",
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
    if (formData.password.length < 8) {
      toast({
        title: "შეცდომა",
        description: "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Password complexity validation
    if (!/[a-z]/.test(formData.password) || !/[A-Z]/.test(formData.password)) {
      toast({
        title: "შეცდომა",
        description: "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ და ერთ პატარა ასოს",
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
      } else if (formData.role === "developer") {
        // For developer registration, don't send fullName
        registrationData.developerData = {
          name: formData.developerName,
          phone: formData.developerPhone,
          socialMediaUrl: formData.developerSocialMedia || undefined,
          website: formData.developerWebsite || undefined,
        };
      } else {
        // For regular user registration, send fullName
        registrationData.fullName = formData.fullName;
      }

      // We need to call the register API directly to get the full response with entity IDs
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const registerResponse = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const registerResult = await registerResponse.json();
      console.log('🎉 Full registration result:', registerResult);

      // Store auth data
      const { user, token } = registerResult.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      const success = true;

      if (success) {
        // If registration was successful and there's a logo file, upload it
        if (logoFile && (formData.role === "agency" || formData.role === "developer")) {
          toast({
            title: "ლოგოს ატვირთვა...",
            description: "რეგისტრაცია წარმატებით დასრულდა, ლოგო იტვირთება...",
          });

          try {
            // Use the user data directly from the registration response
            console.log('📊 User data from registration:', user);

            // IMPORTANT: Use the user ID for S3 folder structure, not the entity ID
            // This ensures consistent folder naming with user IDs (e.g., /developer/50/ not /developer/7/)
            let entityId = user.id; // Use user ID instead of developer/agency ID

            console.log('🔑 Using user ID for upload:', entityId, 'for role:', formData.role);

            if (entityId) {
                const uploadFormData = new FormData();
                uploadFormData.append('images', logoFile);
                uploadFormData.append('purpose', `${formData.role}_logo`);

                // Wait a brief moment to ensure token is properly stored
                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('🚀 Uploading logo:', {
                  entityType: formData.role,
                  entityId: entityId,
                  purpose: `${formData.role}_logo`,
                  fileName: logoFile.name,
                  fileSize: logoFile.size,
                  fileType: logoFile.type
                });

                const uploadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/${formData.role}/${entityId}`;
                console.log('📤 Upload URL:', uploadUrl);

                const uploadResponse = await fetch(uploadUrl, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: uploadFormData,
                });

                console.log('📥 Upload response status:', uploadResponse.status);

                if (uploadResponse.ok) {
                  const responseData = await uploadResponse.json();
                  console.log('✅ Upload success:', responseData);
                  toast({
                    title: "რეგისტრაცია და ლოგო წარმატებით ატვირთდა!",
                    description: "შეამოწმეთ თქვენი ელ.ფოსტა ანგარიშის გასააქტიურებლად",
                  });
                } else {
                  const errorData = await uploadResponse.json().catch(() => ({}));
                  console.error('❌ Upload failed:', uploadResponse.status, errorData);
                  toast({
                    title: "რეგისტრაცია წარმატებით დასრულდა!",
                    description: `ლოგოს ატვირთვა ვერ მოხერხდა (${uploadResponse.status}), შეგიძლიათ მოგვიანებით ატვირთოთ პროფილიდან. შეამოწმეთ ელ.ფოსტა ანგარიშის გასააქტიურებლად.`,
                  });
                }
              } else {
                console.warn('⚠️ No entity ID found for logo upload');
              }
          } catch (logoError) {
            console.error('💥 Logo upload error:', logoError);
            toast({
              title: "რეგისტრაცია წარმატებით დასრულდა!",
              description: "ლოგოს ატვირთვა ვერ მოხერხდა (შიდა შეცდომა), შეგიძლიათ მოგვიანებით ატვირთოთ პროფილიდან. შეამოწმეთ ელ.ფოსტა ანგარიშის გასააქტიურებლად.",
            });
          }
        } else {
          toast({
            title: "რეგისტრაცია წარმატებით დასრულდა!",
            description: "შეამოწმეთ თქვენი ელ.ფოსტა ანგარიშის გასააქტიურებლად",
          });
        }

        // Add success toast if not already shown
        toast({
          title: "რეგისტრაცია წარმატებით დასრულდა!",
          description: `მოგესალმებით, ${user.fullName || formData.agencyName || formData.developerName}! შეამოწმეთ ელ.ფოსტა ანგარიშის გასააქტიურებლად.`,
        });

        navigate(getLanguageUrl('login?message=check-email', i18n.language));
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    მომხმარებელი
                  </TabsTrigger>
                  <TabsTrigger value="agency" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    სააგენტო
                  </TabsTrigger>
                  <TabsTrigger value="developer" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    დეველოპერი
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
                          minLength={8}
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          მინიმუმ 8 სიმბოლო, უნდა შეიცავდეს დიდ და პატარა ასოებს
                        </p>
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
                                accept="image/jpeg,image/png,image/svg+xml"
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
                          მხარდაჭერილი ფორმატები: JPG, PNG, SVG. მაქსიმალური ზომა: 2MB
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
                          minLength={8}
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          მინიმუმ 8 სიმბოლო, უნდა შეიცავდეს დიდ და პატარა ასოებს
                        </p>
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

                  <TabsContent value="developer" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="developerName" className="text-sm font-medium">
                          დეველოპერული კომპანიის დასახელება
                        </label>
                        <Input
                          id="developerName"
                          name="developerName"
                          placeholder="შეიყვანეთ კომპანიის დასახელება"
                          required
                          value={formData.developerName}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="developerLogo" className="text-sm font-medium">
                          ლოგო (არასავალდებულო)
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="relative">
                              <input
                                id="developerLogo"
                                type="file"
                                accept="image/jpeg,image/png,image/svg+xml"
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
                          მხარდაჭერილი ფორმატები: JPG, PNG, SVG. მაქსიმალური ზომა: 2MB
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
                          placeholder="კომპანიის ელ-ფოსტის მისამართი"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="developerPhone" className="text-sm font-medium">
                          ტელეფონის ნომერი
                        </label>
                        <Input
                          id="developerPhone"
                          name="developerPhone"
                          placeholder="ტელეფონის ნომერი"
                          required
                          value={formData.developerPhone}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="developerSocialMedia" className="text-sm font-medium">
                          სოციალური მედია URL (არასავალდებულო)
                        </label>
                        <Input
                          id="developerSocialMedia"
                          name="developerSocialMedia"
                          placeholder="https://facebook.com/yourpage"
                          value={formData.developerSocialMedia}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="developerWebsite" className="text-sm font-medium">
                          ვებსაიტი (არასავალდებულო)
                        </label>
                        <Input
                          id="developerWebsite"
                          name="developerWebsite"
                          placeholder="https://yourwebsite.com"
                          value={formData.developerWebsite}
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
                          minLength={8}
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          მინიმუმ 8 სიმბოლო, უნდა შეიცავდეს დიდ და პატარა ასოებს
                        </p>
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
                    {isLoading ? "მიმდინარეობს..." : 
                     formData.role === "agency" ? "სააგენტოს რეგისტრაცია" :
                     formData.role === "developer" ? "დეველოპერის რეგისტრაცია" : "რეგისტრაცია"}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                უკვე გაქვთ ანგარიში?{" "}
                <Link to={getLanguageUrl('login', i18n.language)} className="text-primary hover:underline">
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
