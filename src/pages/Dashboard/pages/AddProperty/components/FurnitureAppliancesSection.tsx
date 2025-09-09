import React from "react";
import { FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Sofa, Bed, Table, ChefHat, Wind, Refrigerator, WashingMachine, Utensils, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FurnitureAppliancesSection = () => {
  const { t } = useTranslation(['userDashboard', 'admin']);
  const form = useFormContext();
  const furnitureAppliances = form.watch("furnitureAppliances");
  
  
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <Sofa className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('addPropertyForm.furniture.title')}</h3>
      </div>

      <div className="rounded-md border border-border p-5">
        <FormField
          control={form.control}
          name="furnitureAppliances"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "furniture", label: t('addPropertyForm.furniture.furnished'), icon: <Sofa className="h-4 w-4" /> },
                  { id: "bed", label: t('addPropertyForm.furniture.bed'), icon: <Bed className="h-4 w-4" /> },
                  { id: "sofa", label: t('addPropertyForm.furniture.sofa'), icon: <Sofa className="h-4 w-4" /> },
                  { id: "table", label: t('addPropertyForm.furniture.table'), icon: <Table className="h-4 w-4" /> },
                  { id: "chairs", label: t('addPropertyForm.furniture.chairs'), icon: <Table className="h-4 w-4" /> },
                  { id: "stove-gas", label: t('addPropertyForm.furniture.stove-gas'), icon: <ChefHat className="h-4 w-4" /> },
                  { id: "stove-electric", label: t('addPropertyForm.furniture.stove-electric'), icon: <ChefHat className="h-4 w-4" /> },
                  { id: "oven", label: t('addPropertyForm.furniture.oven'), icon: <ChefHat className="h-4 w-4" /> },
                  { id: "air-conditioner", label: t('addPropertyForm.furniture.air-conditioner'), icon: <Wind className="h-4 w-4" /> },
                  { id: "refrigerator", label: t('addPropertyForm.furniture.refrigerator'), icon: <Refrigerator className="h-4 w-4" /> },
                  { id: "washing-machine", label: t('addPropertyForm.furniture.washingMachine'), icon: <WashingMachine className="h-4 w-4" /> },
                  { id: "dishwasher", label: t('addPropertyForm.furniture.dishwasher'), icon: <Utensils className="h-4 w-4" /> }
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="furnitureAppliances"
                    render={({ field }) => {
                      // Use the watched value instead of field.value for more reliable updates
                      const isChecked = furnitureAppliances?.includes(item.id) || false;
                      
                      return (
                        <FormItem>
                          <button 
                            type="button"
                            className="flex items-center space-x-3 p-3 rounded-lg border border-input hover:bg-accent transition-colors cursor-pointer w-full text-left"
                            onClick={() => {
                              const updatedItems = !isChecked
                                ? [...(furnitureAppliances || []), item.id]
                                : (furnitureAppliances || []).filter((value) => value !== item.id);
                              field.onChange(updatedItems);
                            }}
                          >
                            <div className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${isChecked ? 'bg-primary text-primary-foreground' : 'bg-background'} transition-colors`}>
                              {isChecked && <Check className="h-3 w-3" />}
                            </div>
                            <span className="flex items-center gap-2 text-sm font-medium leading-none">
                              <span className="text-muted-foreground">{item.icon}</span>
                              {item.label}
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