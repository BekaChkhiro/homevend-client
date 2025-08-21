import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const MobilePagination = ({ currentPage, totalPages, onPageChange }: MobilePaginationProps) => {
  if (totalPages <= 1) return null;

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="h-10 px-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        წინა
      </Button>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          გვერდი {currentPage} / {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="h-10 px-4"
      >
        შემდეგი
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};