import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Sidebar } from "./components/Sidebar";
import { PropertyFormProvider } from "./contexts/PropertyFormContext";

const DashboardContent = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // თუ მომხმარებელი არ არის ავტორიზებული, გადავამისამართოთ შესვლის გვერდზე
  useEffect(() => {
    // მხოლოდ მას შემდეგ რაც ავთენტიკაციის ჩატვირთვა დასრულდება
    if (!isLoading) {
      if (!user) {
        navigate("/login");
        return;
      }

      // თუ /dashboard-ზე ვართ, გადავამისამართოთ დეფოლტ გვერდზე
      if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
        navigate("/dashboard/my-properties", { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  // ჩატვირთვის დროს ან როცა მომხმარებელი არ არის, დაბრუნდეს ჩატვირთვის ინდიკატორი
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">იტვირთება...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  console.log("Dashboard rendering, location:", location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ძირითადი ჰედერი */}
      <Header />

      {/* მთავარი კონტენტი */}
      <div className="flex-1 container mx-auto flex pt-20 md:pt-24 lg:pt-32 pb-6 lg:pb-6 px-3 sm:px-4">
        {/* მენიუ სიდებარი - ფიქსირებული */}
        <div className="flex-shrink-0">
          <Sidebar user={user} />
        </div>

        {/* კონტენტის ნაწილი */}
        <div className="flex-1 bg-white rounded-lg border p-6 min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <PropertyFormProvider>
      <DashboardContent />
    </PropertyFormProvider>
  );
};

export default Dashboard;
