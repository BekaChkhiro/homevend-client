import React from "react";
import { FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Wifi, Tv, Zap, Building, Truck, Droplets, Phone, Shield, DoorOpen, ChefHat, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FeaturesSection = () => {
  const { t } = useTranslation('userDashboard');
  const form = useFormContext();
  const features = form.watch("features");
  
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('addPropertyForm.features.title')}</h3>
      </div>

      <div className="rounded-md border border-border p-5">
        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "internet", label: t('addPropertyForm.features.internet'), icon: <Wifi className="h-4 w-4" /> },
                  { id: "tv", label: t('addPropertyForm.features.tv'), icon: <Tv className="h-4 w-4" /> },
                  { id: "gas", label: t('addPropertyForm.features.naturalGas'), icon: <Zap className="h-4 w-4" /> },
                  { id: "elevator", label: t('addPropertyForm.features.elevator'), icon: <Building className="h-4 w-4" /> },
                  { id: "cargo-elevator", label: "სატვირთო ლიფტი", icon: <Truck className="h-4 w-4" /> },
                  { id: "water", label: "წყალი", icon: <Droplets className="h-4 w-4" /> },
                  { id: "sewerage", label: "კანალიზაცია", icon: <Droplets className="h-4 w-4" /> },
                  { id: "electricity", label: "ელექტრო ენერგია", icon: <Zap className="h-4 w-4" /> },
                  { id: "phone", label: t('addPropertyForm.features.telephone'), icon: <Phone className="h-4 w-4" /> },
                  { id: "fenced", label: "შემოღობილი", icon: <Shield className="h-4 w-4" /> },
                  { id: "intercom", label: "ჭიშკარი", icon: <DoorOpen className="h-4 w-4" /> },
                  { id: "kitchen-appliances", label: "სამზარეულო + ტექნიკა", icon: <ChefHat className="h-4 w-4" /> }
                ].map((feature) => (
                  <FormField
                    key={feature.id}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      const isChecked = features?.includes(feature.id) || false;
                      
                      return (
                        <FormItem>
                          <button 
                            type="button"
                            className="flex items-center space-x-3 p-3 rounded-lg border border-input hover:bg-accent transition-colors cursor-pointer w-full text-left"
                            onClick={() => {
                              const updatedFeatures = !isChecked
                                ? [...(features || []), feature.id]
                                : (features || []).filter((value) => value !== feature.id);
                              field.onChange(updatedFeatures);
                            }}
                          >
                            <div className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${isChecked ? 'bg-primary text-primary-foreground' : 'bg-background'} transition-colors`}>
                              {isChecked && <Check className="h-3 w-3" />}
                            </div>
                            <span className="flex items-center gap-2 text-sm font-medium leading-none">
                              <span className="text-muted-foreground">{feature.icon}</span>
                              {feature.label}
                            </span>
                          </button>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};