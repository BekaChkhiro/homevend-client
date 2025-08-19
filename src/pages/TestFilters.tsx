import { HeroSection } from "@/components/HeroSection";
import { AdvancedFiltersModal } from "@/components/AdvancedFiltersModal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TestFilters = () => {
  const defaultFilters = {
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
    bedrooms: "all",
    bathrooms: "all",
    rooms: "all",
    location: "",
    dailyRentalSubcategory: "all",
    totalFloors: "all",
    buildingStatus: "all",
    constructionYearMin: "",
    constructionYearMax: "",
    condition: "all",
    projectType: "all",
    ceilingHeightMin: "",
    ceilingHeightMax: "",
    buildingMaterial: "all",
    heating: "all",
    parking: "all",
    hotWater: "all",
    hasBalcony: false,
    hasPool: false,
    hasLivingRoom: false,
    hasLoggia: false,
    hasVeranda: false,
    hasYard: false,
    hasStorage: false,
    selectedFeatures: [],
    selectedAdvantages: [],
    selectedFurnitureAppliances: []
  };

  const basicFilters = {
    search: "თბილისი",
    transactionType: "იყიდება",
    propertyType: "ბინა",
    city: "თბილისი"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32">
        {/* Test HeroSection without onSearch - should navigate to /properties with URL filters */}
        <HeroSection />

        {/* Test content */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-6">URL-Based Filtering Test Page</h1>
            <p className="text-lg text-gray-600 mb-6">
              This page tests the URL-based filtering functionality for HeroSection and AdvancedFiltersModal.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">HeroSection Test</h2>
                <p className="text-gray-600 mb-4">
                  The HeroSection above should navigate to /properties with URL parameters when you search.
                  Try searching for a location or selecting filters, then click search.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">AdvancedFiltersModal Test</h2>
                <p className="text-gray-600 mb-4">
                  This modal should also navigate to /properties with advanced URL parameters.
                </p>
                <div className="flex gap-4">
                  <AdvancedFiltersModal
                    filters={defaultFilters}
                    basicFilters={basicFilters}
                  />
                  <p className="text-sm text-gray-500">
                    Click the filters button above to test advanced filtering
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-blue-50">
                <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>HeroSection search should navigate to /properties with query parameters</li>
                  <li>Popular location buttons should also navigate with filters</li>
                  <li>AdvancedFiltersModal should combine basic and advanced filters in URL</li>
                  <li>All filters should be reflected in the Properties page when navigating</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default TestFilters;