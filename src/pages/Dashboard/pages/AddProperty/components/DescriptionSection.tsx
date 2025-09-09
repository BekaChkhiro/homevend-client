import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Languages } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const DescriptionSection = () => {
  const { t } = useTranslation('userDashboard');
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('addPropertyForm.pricing.description')}</h3>
      </div>

      <div className="rounded-md border border-border p-5">
        <Label className="block mb-4 font-medium flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span>{t('addPropertyForm.pricing.descriptionInLanguages')}</span>
        </Label>

        <Tabs defaultValue="georgian" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="georgian">{t('addPropertyForm.pricing.georgian')}</TabsTrigger>
            <TabsTrigger value="english">{t('addPropertyForm.pricing.english')}</TabsTrigger>
            <TabsTrigger value="russian">{t('addPropertyForm.pricing.russian')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="georgian" className="space-y-4">
            <div>
              <Label htmlFor="descriptionGeorgian" className="text-sm mb-2 block">{t('addPropertyForm.pricing.descriptionInGeorgian')}</Label>
              <Textarea 
                {...register("descriptionGeorgian")}
                id="descriptionGeorgian"
                placeholder={t('addPropertyForm.pricing.descriptionPlaceholder')}
                className="min-h-[120px] border-input focus:ring-ring focus:ring-1"
                rows={6}
              />
              {errors.descriptionGeorgian && (
                <p className="text-sm text-red-600 mt-1">{errors.descriptionGeorgian.message as string}</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="english" className="space-y-4">
            <div>
              <Label htmlFor="descriptionEnglish" className="text-sm mb-2 block">Description in English</Label>
              <Textarea 
                {...register("descriptionEnglish")}
                id="descriptionEnglish"
                placeholder="Write a detailed description of the property in English..."
                className="min-h-[120px] border-input focus:ring-ring focus:ring-1"
                rows={6}
              />
              {errors.descriptionEnglish && (
                <p className="text-sm text-red-600 mt-1">{errors.descriptionEnglish.message as string}</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="russian" className="space-y-4">
            <div>
              <Label htmlFor="descriptionRussian" className="text-sm mb-2 block">Описание на русском</Label>
              <Textarea 
                {...register("descriptionRussian")}
                id="descriptionRussian"
                placeholder="Напишите подробное описание недвижимости на русском языке..."
                className="min-h-[120px] border-input focus:ring-ring focus:ring-1"
                rows={6}
              />
              {errors.descriptionRussian && (
                <p className="text-sm text-red-600 mt-1">{errors.descriptionRussian.message as string}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-muted-foreground">
          {t('addPropertyForm.pricing.descriptionHelp')}
        </div>
      </div>
    </div>
  );
};