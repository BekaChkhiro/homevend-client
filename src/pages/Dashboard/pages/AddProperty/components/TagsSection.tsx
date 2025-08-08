import React from "react";
import { FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Lock, Globe, TrendingUp, Accessibility, Check } from "lucide-react";

export const TagsSection = () => {
  const form = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 border-b pb-3 mb-2">
        <Lock className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">ბეჯები</h3>
      </div>

      <div className="rounded-md border border-border p-5">
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "code-door", label: "კარი კოდით", icon: <Lock className="h-4 w-4" /> },
                  { id: "airbnb-booking", label: "Airbnb/Booking ექაუნთი", icon: <Globe className="h-4 w-4" /> },
                  { id: "investment", label: "საინვესტიციო", icon: <TrendingUp className="h-4 w-4" /> },
                  { id: "disability-friendly", label: "სსმპ", icon: <Accessibility className="h-4 w-4" /> }
                ].map((tag) => (
                  <FormField
                    key={tag.id}
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <button 
                          type="button"
                          className="flex items-center space-x-3 p-4 rounded-lg border border-input hover:bg-accent transition-colors cursor-pointer w-full text-left"
                          onClick={() => {
                            const isChecked = field.value?.includes(tag.id);
                            const updatedTags = !isChecked
                              ? [...(field.value || []), tag.id]
                              : (field.value || []).filter((value) => value !== tag.id);
                            field.onChange(updatedTags);
                          }}
                        >
                          <div className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${field.value?.includes(tag.id) ? 'bg-primary text-primary-foreground' : 'bg-background'} transition-colors`}>
                            {field.value?.includes(tag.id) && <Check className="h-3 w-3" />}
                          </div>
                          <span className="flex items-center gap-2 text-sm font-medium leading-none">
                            <span className="text-muted-foreground">{tag.icon}</span>
                            {tag.label}
                          </span>
                        </button>
                      </FormItem>
                    )}
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