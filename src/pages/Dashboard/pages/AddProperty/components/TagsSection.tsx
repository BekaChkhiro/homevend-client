import React, { useState, useEffect } from "react";
import { FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Lock, Globe, TrendingUp, Accessibility, Check, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

// Tags will be defined inside the component to access translation function

export const TagsSection = () => {
  const { t } = useTranslation('userDashboard');
  const form = useFormContext();
  const tags = form.watch("tags");
  
  const defaultTags = [
    { id: "luxury", label: t('addPropertyForm.tags.luxury'), icon: <TrendingUp className="h-4 w-4" /> },
    { id: "new", label: t('addPropertyForm.tags.new'), icon: <Globe className="h-4 w-4" /> },
    { id: "code-door", label: t('addPropertyForm.tags.codeDoor'), icon: <Lock className="h-4 w-4" /> },
    { id: "airbnb-booking", label: t('addPropertyForm.tags.airbnbBooking'), icon: <Globe className="h-4 w-4" /> },
    { id: "investment", label: t('addPropertyForm.tags.investment'), icon: <TrendingUp className="h-4 w-4" /> },
    { id: "disability-friendly", label: t('addPropertyForm.tags.disabilityFriendly'), icon: <Accessibility className="h-4 w-4" /> }
  ];
  
  const [availableTags] = useState(defaultTags); // Use default tags for now
  
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <Tag className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">{t('addPropertyForm.tags.title')}</h3>
      </div>

      <div className="rounded-md border border-border p-5">
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTags.map((tag) => (
                  <FormField
                    key={tag.id}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      const isChecked = tags?.includes(tag.id) || false;
                      
                      return (
                        <FormItem>
                          <button 
                            type="button"
                            className="flex items-center space-x-3 p-4 rounded-lg border border-input hover:bg-accent transition-colors cursor-pointer w-full text-left"
                            onClick={() => {
                              const updatedTags = !isChecked
                                ? [...(tags || []), tag.id]
                                : (tags || []).filter((value) => value !== tag.id);
                              field.onChange(updatedTags);
                            }}
                          >
                            <div className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${isChecked ? 'bg-primary text-primary-foreground' : 'bg-background'} transition-colors`}>
                              {isChecked && <Check className="h-3 w-3" />}
                            </div>
                            <span className="flex items-center gap-2 text-sm font-medium leading-none">
                              <span className="text-muted-foreground">{tag.icon}</span>
                              {tag.label}
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