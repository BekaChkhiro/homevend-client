import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormActionsProps {
  onSubmit: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSubmit,
  isLoading = false,
  isEdit = false,
}) => {
  const { t } = useTranslation('userDashboard');
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-md border-t border-border/30 shadow-xl z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col items-center">
          {/* Main Submit Button */}
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isLoading}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] w-full h-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-lg">{t('addPropertyForm.formActions.saving')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white/10 rounded-full">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-lg">
                  {isEdit ? t('addPropertyForm.formActions.updateProperty') : t('addPropertyForm.formActions.addProperty')}
                </span>
              </div>
            )}
          </Button>

        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
};