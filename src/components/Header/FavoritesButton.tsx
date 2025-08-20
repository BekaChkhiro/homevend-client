import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export const FavoritesButton = () => {
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();

  return (
    <Button variant="ghost" size="sm" className="hover:bg-primary/5 hover:text-primary relative p-1.5 min-w-0 flex-shrink-0" asChild>
      <Link to={isAuthenticated ? "/dashboard/favorites" : "/login"} className="flex items-center">
        <Heart className="h-4 w-4" />
        <span className="sr-only">ვიშლისთი</span>
        {isAuthenticated && favorites.size > 0 && (
          <div className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {favorites.size > 9 ? '9+' : favorites.size}
          </div>
        )}
      </Link>
    </Button>
  );
};