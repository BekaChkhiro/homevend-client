import { Card, CardContent } from "@/components/ui/card";

export const PropertyDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col xl:flex-row gap-4 md:gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 xl:w-2/3">
          {/* Property Images Skeleton */}
          <div className="mb-4 md:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 animate-pulse">
              <div className="sm:col-span-2">
                <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 rounded-lg"></div>
              <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Property Info Skeleton */}
          <Card className="mb-4 md:mb-6">
            <CardContent className="p-4 md:p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Title skeleton */}
                  <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
                  {/* Address skeleton */}
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  {/* Badges skeleton */}
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Price skeleton */}
              <div className="h-10 md:h-12 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

              {/* Property stats skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center sm:justify-start bg-gray-50 rounded-lg p-2 sm:bg-transparent sm:p-0">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-8 mr-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>

              {/* Required Fields Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-300">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Property Structure Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-40"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-300">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Building Information Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-36"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-300">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Infrastructure Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-300">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Special Spaces Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-44"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-300">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-6 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-28"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="h-4 bg-gray-200 rounded mx-auto" style={{ width: `${60 + Math.random() * 40}px` }}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Advantages Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="h-4 bg-gray-200 rounded mx-auto" style={{ width: `${50 + Math.random() * 50}px` }}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Furniture & Appliances Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-36"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="h-4 bg-gray-200 rounded mx-auto" style={{ width: `${40 + Math.random() * 60}px` }}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags Section Skeleton */}
              <Card className="mb-4 md:mb-6 bg-white shadow-sm border border-gray-300">
                <CardContent className="p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-6 bg-gray-300 rounded-full" style={{ width: `${60 + Math.random() * 40}px` }}></div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description Section Skeleton */}
              <div className="mb-4 md:mb-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ad Banner Skeleton */}
          <div className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          <div className="sticky space-y-4 md:space-y-6" style={{top:"8rem"}}>
            {/* Contact Card Skeleton */}
            <Card className="mb-4 md:mb-6 overflow-hidden border border-gray-300">
              <div className="bg-gray-300 p-3 md:p-4 animate-pulse">
                <div className="h-6 bg-gray-400 rounded w-2/3 mx-auto"></div>
              </div>
              <CardContent className="p-4 md:p-6 animate-pulse">
                <div className="flex items-center mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full mr-3 md:mr-4"></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                
                {/* Project info skeleton */}
                <div className="mb-4 md:mb-6 bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-300 rounded-lg"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-3 bg-blue-200 rounded w-32 mb-1"></div>
                      <div className="h-4 bg-blue-300 rounded w-full mb-1"></div>
                      <div className="h-3 bg-blue-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="h-12 bg-gray-300 rounded w-full"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>

            {/* Ad Banner Skeleton */}
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

{/* Similar Properties Carousel Skeleton */}
export const SimilarPropertiesSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4 md:mb-6"></div>
      <div className="relative">
        {/* Carousel skeleton */}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
              <Card className="overflow-hidden border border-gray-300">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gray-200"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
                <CardContent className="p-3 md:p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="flex items-center mb-2">
                    <div className="h-3 w-3 bg-gray-200 rounded mr-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center">
                        <div className="h-3 w-3 bg-gray-200 rounded mr-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-6"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-300 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Carousel arrows skeleton */}
        <div className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 hidden sm:block">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
        <div className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 hidden sm:block">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Mobile dots skeleton */}
        <div className="flex sm:hidden justify-center gap-2 mt-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};