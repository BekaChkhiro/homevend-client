import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  title,
}) => {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const handlePrevious = () => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
        <DialogContent
          className="max-w-4xl w-[90vw] max-h-[85vh] border bg-white shadow-2xl p-0 overflow-hidden rounded-xl"
          onPointerDownOutside={onClose}
        >
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-800 border-0"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Image Counter */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-md">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main Image Container */}
          <div className="relative w-full bg-gray-100 flex items-center justify-center" style={{ height: "70vh", maxHeight: "600px" }}>
            <img
              src={images[currentIndex]}
              alt={`${title || "Property"} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-opacity duration-300"
              style={{ animation: "fadeIn 0.3s ease-in-out" }}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-800 border-0 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-800 border-0 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="bg-white border-t border-gray-200 p-3 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onIndexChange(index)}
                    className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all border-2 ${
                      index === currentIndex
                        ? "border-primary opacity-100 ring-2 ring-primary/30"
                        : "border-gray-200 opacity-60 hover:opacity-100 hover:border-primary/50"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </DialogPortal>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </Dialog>
  );
};
