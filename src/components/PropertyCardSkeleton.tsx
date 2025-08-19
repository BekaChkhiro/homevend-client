export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gray-200">
        <div className="absolute top-3 left-3 bg-gray-300 rounded-full w-16 h-6"></div>
        <div className="absolute top-3 right-3 bg-gray-300 rounded-full w-8 h-8"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Title */}
        <div className="h-14 mb-3 flex flex-col justify-start gap-2">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Price */}
        <div className="h-8 bg-gray-300 rounded mb-4 w-1/2"></div>
        
        {/* Location */}
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Property details */}
        <div className="flex items-center justify-between text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};