import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Languages, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const DescriptionSection = () => {
  const { t } = useTranslation(['userDashboard', 'admin']);
  const { register, formState: { errors } } = useFormContext();

  // Calculate missing descriptions
  const missingDescriptions = [];
  if (errors.descriptionGeorgian) missingDescriptions.push('ქართული');
  if (errors.descriptionEnglish) missingDescriptions.push('ინგლისური');
  if (errors.descriptionRussian) missingDescriptions.push('რუსული');

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">
          {t('addPropertyForm.description.title')}
          <span className="text-red-500 ml-1">*</span>
        </h3>
      </div>

      <div className="rounded-md border border-border p-5">
        <Label className="block mb-4 font-medium flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span>{t('addPropertyForm.description.subtitle')}</span>
        </Label>

        <Tabs defaultValue="georgian" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="georgian" className={errors.descriptionGeorgian ? "text-red-600" : ""}>
              <span className="flex items-center gap-1">
                {t('addPropertyForm.description.georgian')} <span className="text-red-500">*</span>
                {errors.descriptionGeorgian && <AlertCircle className="h-3 w-3" />}
              </span>
            </TabsTrigger>
            <TabsTrigger value="english" className={errors.descriptionEnglish ? "text-red-600" : ""}>
              <span className="flex items-center gap-1">
                {t('addPropertyForm.description.english')} <span className="text-red-500">*</span>
                {errors.descriptionEnglish && <AlertCircle className="h-3 w-3" />}
              </span>
            </TabsTrigger>
            <TabsTrigger value="russian" className={errors.descriptionRussian ? "text-red-600" : ""}>
              <span className="flex items-center gap-1">
                {t('addPropertyForm.description.russian')} <span className="text-red-500">*</span>
                {errors.descriptionRussian && <AlertCircle className="h-3 w-3" />}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="georgian" className="space-y-4">
            <div>
              <Label htmlFor="descriptionGeorgian" className="text-sm mb-2 block">{t('addPropertyForm.description.georgianPlaceholder')}</Label>
              <Textarea 
                {...register("descriptionGeorgian")}
                id="descriptionGeorgian"
                placeholder={t('addPropertyForm.description.georgianPlaceholder')}
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
              <Label htmlFor="descriptionEnglish" className="text-sm mb-2 block">{t('addPropertyForm.description.english')}</Label>
              <Textarea 
                {...register("descriptionEnglish")}
                id="descriptionEnglish"
                placeholder={t('addPropertyForm.description.englishPlaceholder')}
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
              <Label htmlFor="descriptionRussian" className="text-sm mb-2 block">{t('addPropertyForm.description.russian')}</Label>
              <Textarea 
                {...register("descriptionRussian")}
                id="descriptionRussian"
                placeholder={t('addPropertyForm.description.russianPlaceholder')}
                className="min-h-[120px] border-input focus:ring-ring focus:ring-1"
                rows={6}
              />
              {errors.descriptionRussian && (
                <p className="text-sm text-red-600 mt-1">{errors.descriptionRussian.message as string}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 space-y-2">
          {missingDescriptions.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    გთხოვთ შეავსოთ შემდეგი დესქრიფშენები:
                  </p>
                  <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                    {missingDescriptions.map((desc, index) => (
                      <li key={index}>{desc} დესქრიფშენი</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            <span className="text-red-500">*</span> All three descriptions (Georgian, English, and Russian) are required
          </div>
          <div className="text-xs text-muted-foreground">
            💡 {t('addPropertyForm.description.tip')}
          </div>
        </div>
      </div>
    </div>
  );
};