import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Home, Building2, Tent, Hotel, Briefcase, CreditCard, MapPin, BookOpen } from "lucide-react";
import type { PropertyFormData } from "../types/propertyForm";
import { citiesApi, areasApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface City {
  id: number;
  code: string;
  nameGeorgian: string;
  nameEnglish: string;
  nameRussian: string;
  isActive: boolean;
}

interface Area {
  id: number;
  cityId: number;
  nameKa: string;
  nameEn: string;
  nameRu: string;
  isActive: boolean;
}

interface Project {
  id: number;
  projectName: string;
  city: {
    nameGeorgian: string;
  };
  street: string;
}

export const BasicInfoSection = () => {
  const form = useFormContext<PropertyFormData>();
  const { user } = useAuth();
  const watchedDealType = form.watch("dealType");
  const watchedCity = form.watch("city");
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Fetch cities on component mount
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchCities = async (retryCount = 0) => {
      if (!isMounted) return;
      
      try {
        if (retryCount === 0) setCitiesLoading(true);
        
        const fetchedCities = await citiesApi.getAllCities(true); // Only active cities
        
        if (isMounted) {
          setCities(fetchedCities);
        }
      } catch (error: any) {
        if (!isMounted) return;
        
        // Handle 429 (Too Many Requests) with limited retry
        if (error.response?.status === 429 && retryCount === 0) {
          // Only retry once for 429 errors and only on first attempt
          const retryAfter = Math.min(error.response?.data?.retryAfter || 2000, 5000); // Max 5 seconds
          
          setTimeout(() => {
            if (isMounted) {
              fetchCities(retryCount + 1);
            }
          }, retryAfter);
          return;
        }
        
        // For persistent failures or non-429 errors, stop trying
        if (isMounted) {
          setCities([]); // Set empty array so form can still work
        }
      } finally {
        if (isMounted && retryCount === 0) {
          setCitiesLoading(false);
        }
      }
    };

    fetchCities();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch areas when city changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!watchedCity || citiesLoading || cities.length === 0) {
        setAreas([]);
        return;
      }

      try {
        setAreasLoading(true);
        const selectedCity = cities.find(c => c.code === watchedCity);
        if (selectedCity) {
          const fetchedAreas = await areasApi.getAreasByCity(selectedCity.id);
          setAreas(fetchedAreas);
          // Clear district selection when city changes (only if there's a current value)
          const currentDistrict = form.getValues("district");
          if (currentDistrict) {
            form.setValue("district", "", { shouldValidate: false, shouldDirty: false });
          }
        } else {
          setAreas([]);
          form.setValue("district", "", { shouldValidate: false, shouldDirty: false });
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setAreasLoading(false);
      }
    };

    fetchAreas();
  }, [watchedCity, cities.length, citiesLoading]);

  // Fetch projects for developers
  useEffect(() => {
    const fetchProjects = async () => {
      if (user?.role !== 'developer') {
        return;
      }

      try {
        setProjectsLoading(true);
        const response = await fetch('/api/projects/my-projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data || []);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 border-b border-border/50 pb-4 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">ძირითადი ინფორმაცია</h3>
          <p className="text-sm text-muted-foreground">შეავსეთ ქონების ძირითადი მონაცემები</p>
        </div>
      </div>
      
      {/* Title */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <Label htmlFor="title" className="text-base font-semibold text-foreground flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <span>განცხადების სათაური</span>
            <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1 ml-11">შეიყვანეთ მიმზიდველი სათაური თქვენი ქონებისთვის</p>
        </div>
        <div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    id="title" 
                    placeholder="მაგ: 2 საძინებლიანი ბინა ვაკეში, შესანიშნავი ხედით" 
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 კარგი სათაური უნდა იყოს ინფორმაციული და მიმზიდველი. მიუთითეთ ძირითადი დეტალები როგორიცაა ოთახების რაოდენობა და მდებარეობა
            </p>
          </div>
        </div>
      </div>
      
      {/* Property Type */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <Label className="text-base font-semibold text-foreground flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span>უძრავი ქონების ტიპი</span>
            <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1 ml-11">აირჩიეთ ქონების ტიპი</p>
        </div>
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {[
                    { value: "apartment", label: "ბინები", icon: <Building2 className="h-5 w-5" />, desc: "მრავალსართულიანი" },
                    { value: "house", label: "კერძო სახლები", icon: <Home className="h-5 w-5" />, desc: "ცალკე მდგომი" },
                    { value: "cottage", label: "აგრაკები", icon: <Tent className="h-5 w-5" />, desc: "დასასვენებელი" },
                    { value: "land", label: "მიწის ნაკვეთები", icon: <MapPin className="h-5 w-5" />, desc: "სამშენებლო" },
                    { value: "commercial", label: "კომერციული", icon: <Briefcase className="h-5 w-5" />, desc: "მაღაზია, საწყობი" },
                    { value: "office", label: "საოფისე", icon: <Briefcase className="h-5 w-5" />, desc: "ოფისის ფართი" },
                    { value: "hotel", label: "სასტუმროები", icon: <Hotel className="h-5 w-5" />, desc: "სასტუმრო" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`property-type-${option.value}`}
                      className="group relative flex items-center gap-4 border-2 border-border bg-gradient-to-r from-background to-background hover:from-accent/30 hover:to-accent/10 rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all duration-300 data-[state=checked]:border-primary data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary/10 data-[state=checked]:to-primary/5 data-[state=checked]:shadow-xl min-h-[100px]"
                    >
                      <RadioGroupItem 
                        value={option.value} 
                        id={`property-type-${option.value}`} 
                        className="w-5 h-5 border-2 hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:text-white data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_15px_rgba(59,130,246,0.6)] data-[state=checked]:radio-checked-animation shrink-0 transition-all duration-300" 
                      />
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-muted to-muted/50 rounded-xl group-hover:from-primary/20 group-hover:to-primary/10 group-data-[state=checked]:from-primary/20 group-data-[state=checked]:to-primary/10 transition-all duration-300 shrink-0">
                        <span className="text-muted-foreground group-hover:text-primary group-data-[state=checked]:text-primary transition-colors">
                          {option.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm lg:text-base text-foreground group-data-[state=checked]:text-primary transition-all block truncate">
                          {option.label}
                        </span>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-1 truncate">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="mt-2" />
            </FormItem>
          )}
        />
      </div>
      
      {/* Deal Type */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <Label className="text-base font-semibold text-foreground flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <span>გარიგების ტიპი</span>
            <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1 ml-11">როგორი გარიგება გსურთ</p>
        </div>
        <FormField
          control={form.control}
          name="dealType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {[
                    { value: "sale", label: "იყიდება", desc: "სრული გაყიდვა" },
                    { value: "rent", label: "ქირავდება", desc: "გრძელვადიანი ქირა" },
                    { value: "mortgage", label: "გირავდება", desc: "გირავით გადაცემა" },
                    { value: "lease", label: "გაიცემა იჯარით", desc: "კომერციული იჯარა" },
                    { value: "daily", label: "ქირავდება დღიურად", desc: "მოკლევადიანი ქირა" },
                    { value: "redemption", label: "ნასყიდობა გამოსყიდობის უფლებით", desc: "გამოსყიდობის უფლებით" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`deal-type-${option.value}`}
                      className="group flex items-center gap-3 border-2 border-border bg-background rounded-xl p-4 cursor-pointer hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:shadow-md"
                    >
                      <RadioGroupItem 
                        value={option.value} 
                        id={`deal-type-${option.value}`} 
                        className="w-5 h-5 border-2 hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:text-white data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_15px_rgba(59,130,246,0.6)] data-[state=checked]:radio-checked-animation flex-shrink-0 transition-all duration-300" 
                      />
                      <div className="flex-1">
                        <span className="font-medium text-foreground group-data-[state=checked]:text-primary group-data-[state=checked]:font-semibold transition-all block">
                          {option.label}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="mt-2" />
            </FormItem>
          )}
        />
      </div>
      
      {/* Daily Rental Subcategory - Only show when dealType is "daily" */}
      {watchedDealType === "daily" && (
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <Label className="text-base font-semibold text-foreground flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <span>დღიურის კატეგორია</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1 ml-11">აირჩიეთ დღიური ქირაობის ტიპი</p>
          </div>
          <FormField
            control={form.control}
            name="dailyRentalSubcategory"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors">
                      <SelectValue placeholder="აირჩიეთ კატეგორია (არასავალდებულო)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sea">ზღვასთან დღიური ქირაობა</SelectItem>
                      <SelectItem value="mountains">მთაში დღიური ქირაობა</SelectItem>
                      <SelectItem value="villa">დღიური ვილები</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 თუ არ აირჩევთ კონკრეტულ კატეგორიას, ქონება ჩაირთვება ზოგად "დღიური ქირაობა" კატეგორიაში
            </p>
          </div>
        </div>
      )}

      {/* Project Selection - Only show for developers */}
      {user?.role === 'developer' && (
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <Label className="text-base font-semibold text-foreground flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <span>პროექტთან დაკავშირება</span>
              <span className="text-sm font-normal text-muted-foreground">(არასავალდებულო)</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1 ml-11">აირჩიეთ პროექტი რომელთანაც უნდა დაკავშირდეს ეს განცხადება</p>
          </div>
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors">
                      <SelectValue placeholder={projectsLoading ? "იტვირთება..." : "აირჩიეთ პროექტი (არასავალდებულო)"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {projectsLoading ? (
                        <SelectItem value="loading" disabled>იტვირთება...</SelectItem>
                      ) : (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.projectName} - {project.city.nameGeorgian}, {project.street}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 თუ აირჩევთ პროექტს, ეს განცხადება ასევე გამოჩნდება პროექტის გვერდზე როგორც დაკავშირებული ქონება
            </p>
          </div>
        </div>
      )}
      
      {/* Location */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <Label className="text-base font-semibold text-foreground flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span>მდებარეობა</span>
            <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1 ml-11">ქონების ზუსტი მისამართი</p>
        </div>
        
        <div className="space-y-6">
          {/* City */}
          <div>
            <Label htmlFor="city" className="text-sm font-medium text-foreground mb-3 block">აირჩიე ქალაქი</Label>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="city" className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors">
                        <SelectValue placeholder={citiesLoading ? "იტვირთება..." : "აირჩიეთ ქალაქი"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {citiesLoading ? (
                          <SelectItem value="loading" disabled>იტვირთება...</SelectItem>
                        ) : (
                          cities.map((city) => (
                            <SelectItem key={city.code} value={city.code}>
                              {city.nameGeorgian}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* District/Area - Only show if city has areas */}
          {areas.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="district" className="text-base font-semibold text-foreground">
                    უბანი / რაიონი
                  </Label>
                  <p className="text-sm text-muted-foreground">აირჩიეთ უბანი (არასავალდებულო)</p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <SelectTrigger id="district" className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors">
                          <SelectValue placeholder={areasLoading ? "იტვირთება..." : "აირჩიეთ უბანი"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {areasLoading ? (
                            <SelectItem value="loading" disabled>იტვირთება...</SelectItem>
                          ) : (
                            areas.map((area) => (
                              <SelectItem key={area.id} value={area.id.toString()}>
                                {area.nameKa}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {/* Street and Number - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="street" className="text-sm font-medium text-foreground mb-3 block">ჩაწერეთ ქუჩა</Label>
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        id="street" 
                        placeholder="ქუჩის დასახელება" 
                        className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <Label htmlFor="street-number" className="text-sm font-medium text-foreground mb-3 block">ჩაწერეთ ქუჩის ნომერი</Label>
              <FormField
                control={form.control}
                name="streetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        id="street-number" 
                        placeholder="ქუჩის ნომერი" 
                        className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Cadastral Code */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <Label htmlFor="cadastral-code" className="text-base font-semibold text-foreground flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <span>საკადასტრო კოდი</span>
            <span className="text-sm font-normal text-muted-foreground">(არასავალდებულო)</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1 ml-11">ქონების საკადასტრო კოდი თუ ცნობილია</p>
        </div>
        <div>
          <FormField
            control={form.control}
            name="cadastralCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    id="cadastral-code" 
                    placeholder="მაგ: 01.10.14.009.088" 
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 საკადასტრო კოდი არის უნიკალური იდენტიფიკატორი, რომელიც გამოიყენება ქონების იურიდიული სტატუსის დასადგენად
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};