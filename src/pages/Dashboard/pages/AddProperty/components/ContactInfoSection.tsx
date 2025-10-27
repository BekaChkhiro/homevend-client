import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { User, Phone } from "lucide-react";
import type { PropertyFormData } from "../types/propertyForm";
import { useTranslation } from "react-i18next";
import { sanitizePhoneInput } from "@/lib/validation";

export const ContactInfoSection = () => {
  const { t } = useTranslation(['userDashboard', 'admin']);
  const form = useFormContext<PropertyFormData>();
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('addPropertyForm.contact.title')}</h3>
      </div>

      <div className="rounded-md border border-border p-5 space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="contact-name" className="block mb-3 font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{t('addPropertyForm.contact.name')}</span>
          </Label>
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    id="contact-name" 
                    type="text" 
                    placeholder={t('addPropertyForm.contact.namePlaceholder')} 
                    className="border-input focus:ring-ring focus:ring-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="contact-phone" className="block mb-3 font-medium flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{t('addPropertyForm.contact.phone')}</span>
          </Label>
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+995 XXX XXX XXX"
                    minLength={9}
                    maxLength={20}
                    pattern="[+0-9]*"
                    className="border-input focus:ring-ring focus:ring-1"
                    {...field}
                    onChange={(e) => {
                      const sanitized = sanitizePhoneInput(e.target.value);
                      field.onChange(sanitized);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            {t('addPropertyForm.contact.phoneExample')}
          </div>
        </div>
      </div>
    </div>
  );
};