import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  propertyId: number;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  className,
  size = "sm",
  variant = "ghost"
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsToggling(true);
      const wasAdded = await toggleFavorite(propertyId);
      
      toast({
        title: wasAdded ? "დაემატა ფავორიტებში" : "წაიშალა ფავორიტებიდან",
        description: wasAdded 
          ? "განცხადება დაემატა თქვენს ფავორიტებში" 
          : "განცხადება წაიშალა ფავორიტებიდან"
      });
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast({
          title: "საჭიროა ავტორიზაცია",
          description: "ფავორიტებში დასამატებლად გთხოვთ შეხვიდეთ სისტემაში",
          variant: "destructive"
        });
      } else if (error.response?.status === 409) {
        // Property already in favorites - this shouldn't happen with proper state management
        toast({
          title: "უკვე დამატებულია",
          description: "ეს განცხადება უკვე თქვენს ფავორიტებშია",
          variant: "destructive"
        });
      } else {
        toast({
          title: "შეცდომა",
          description: "ფავორიტების განახლებისას მოხდა შეცდომა",
          variant: "destructive"
        });
      }
    } finally {
      setIsToggling(false);
    }
  };

  const isPropertyFavorite = isFavorite(propertyId);

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "h-8 w-8 p-0 bg-white/80 hover:bg-white transition-colors",
        className
      )}
      onClick={handleToggleFavorite}
      disabled={isToggling}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={cn(
            "h-4 w-4 transition-colors",
            isPropertyFavorite 
              ? "fill-red-500 text-red-500" 
              : "text-gray-600 hover:text-red-500"
          )} 
        />
      )}
    </Button>
  );
};