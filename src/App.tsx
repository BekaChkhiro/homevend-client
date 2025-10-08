import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Eager load critical pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy load all other pages
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResendVerification = lazy(() => import("./pages/ResendVerification"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const Advertising = lazy(() => import("./pages/Advertising"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const Properties = lazy(() => import("./pages/Properties"));
const PriceStatistics = lazy(() => import("./pages/PriceStatistics"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Agencies = lazy(() => import("./pages/Agencies"));
const AgencyDetail = lazy(() => import("./pages/AgencyDetail"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Services = lazy(() => import("./pages/Services").then(module => ({ default: module.Services })));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Developers = lazy(() => import("./pages/Developers"));
const DeveloperDetail = lazy(() => import("./pages/DeveloperDetail"));
const AdminOverview = lazy(() => import("./pages/AdminDashboard/pages/Overview"));
const AdminUsers = lazy(() => import("./pages/AdminDashboard/pages/Users"));
const AdminListings = lazy(() => import("./pages/AdminDashboard/pages/Listings"));
const AdminProjects = lazy(() => import("./pages/AdminDashboard/pages/Projects"));
const AdminEditProject = lazy(() => import("./pages/AdminDashboard/pages/EditProject"));
const AdminAgencies = lazy(() => import("./pages/AdminDashboard/pages/Agencies"));
const AdminEditProperty = lazy(() => import("./pages/AdminDashboard/pages/EditProperty"));
const AdminEditUser = lazy(() => import("./pages/AdminDashboard/pages/EditUser"));
const AdminAdvertisements = lazy(() => import("./pages/AdminDashboard/pages/Advertisements"));
const AdminManageProjectProperties = lazy(() => import("./pages/AdminDashboard/components/AdminManageProjectProperties").then(module => ({ default: module.AdminManageProjectProperties })));
const AdminDistricts = lazy(() => import("./pages/AdminDashboard/pages/Districts"));
const AdminSettings = lazy(() => import("./pages/AdminDashboard/pages/Settings"));
const AdminServicePricing = lazy(() => import("./pages/AdminDashboard/pages/ServicePricing"));
const AdminTermsConditions = lazy(() => import("./pages/AdminDashboard/pages/TermsConditions"));
const AddProperty = lazy(() => import("./pages/Dashboard/pages/AddProperty").then(module => ({ default: module.AddProperty })));
const EditProperty = lazy(() => import("./pages/Dashboard/pages/EditProperty").then(module => ({ default: module.EditProperty })));
const AddProject = lazy(() => import("./pages/Dashboard/pages/AddProject").then(module => ({ default: module.AddProject })));
const EditProject = lazy(() => import("./pages/Dashboard/pages/EditProject").then(module => ({ default: module.EditProject })));
const MyProperties = lazy(() => import("./pages/Dashboard/components/MyProperties").then(module => ({ default: module.MyProperties })));
const MyProjects = lazy(() => import("./pages/Dashboard/components/MyProjects").then(module => ({ default: module.MyProjects })));
const ManageProjectProperties = lazy(() => import("./pages/Dashboard/components/ManageProjectProperties").then(module => ({ default: module.ManageProjectProperties })));
const Favorites = lazy(() => import("./pages/Dashboard/components/Favorites").then(module => ({ default: module.Favorites })));
const ProfilePage = lazy(() => import("./pages/Dashboard/components/ProfilePage").then(module => ({ default: module.ProfilePage })));
const BalancePage = lazy(() => import("./pages/Dashboard/components/BalancePage").then(module => ({ default: module.BalancePage })));
const UsersPage = lazy(() => import("./pages/Dashboard/pages/Users"));
const TestComponent = lazy(() => import("./pages/Dashboard/components/TestComponent").then(module => ({ default: module.TestComponent })));
const TestFilters = lazy(() => import("./pages/TestFilters"));
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { LanguageRoute } from "./components/LanguageRoute";
import { LanguageRedirect } from "./components/LanguageRedirect";

// Dashboard redirect component to preserve URL parameters
const DashboardRedirect = () => {
  const location = useLocation();
  const dashboardPath = location.pathname.replace('/dashboard', '');
  const fullPath = `/ge/dashboard${dashboardPath}${location.search}`;

  // Debug logging to see if Flitt redirects reach here
  console.log('🚨 DashboardRedirect triggered:', {
    originalPath: location.pathname,
    originalSearch: location.search,
    dashboardPath,
    fullPath,
    timestamp: new Date().toISOString()
  });

  // For payment callbacks, redirect immediately via window.location
  // This ensures the redirect happens even if React has issues
  if (location.search.includes('payment=') ||
      location.search.includes('status=') ||
      location.search.includes('order_status=')) {
    console.log('🔀 Payment callback detected, using window.location redirect');
    window.location.href = fullPath;
    return <div>Redirecting to payment success page...</div>;
  }

  return <Navigate to={fullPath} replace />;
};

const queryClient = new QueryClient();

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FavoritesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Language-based routes */}
            <Route path="/:lang" element={<LanguageRoute />}>
              <Route index element={<Home />} />
              <Route path="property/:id" element={<PropertyDetail />} />
              <Route path="properties" element={<Properties />} />
              <Route path="test-filters" element={<TestFilters />} />
              <Route path="price-statistics" element={<PriceStatistics />} />
              <Route path="services" element={<Services />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="agencies" element={<Agencies />} />
              <Route path="agencies/:id" element={<AgencyDetail />} />
              <Route path="developers" element={<Developers />} />
              <Route path="developers/:id" element={<DeveloperDetail />} />
              <Route path="user/:userId" element={<UserProfile />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="advertise" element={<Advertising />} />
              <Route path="terms" element={<TermsAndConditions />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="resend-verification" element={<ResendVerification />} />
              <Route path="dashboard" element={<Dashboard />}>
                <Route index element={<MyProperties />} />
                <Route path="test" element={<TestComponent />} />
                <Route path="add-property" element={<AddProperty />} />
                <Route path="add-project" element={<AddProject />} />
                <Route path="edit-project/:id" element={<EditProject />} />
                <Route path="edit-property/:id" element={<EditProperty />} />
                <Route path="my-properties" element={<MyProperties />} />
                <Route path="my-projects" element={<MyProjects />} />
                <Route path="projects/:projectId/manage-properties" element={<ManageProjectProperties />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="balance" element={<BalancePage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
              <Route path="admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }>
                <Route index element={<AdminOverview />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="edit-user/:id" element={<AdminEditUser />} />
                <Route path="listings" element={<AdminListings />} />
                <Route path="edit-property/:id" element={<AdminEditProperty />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="edit-project/:id" element={<AdminEditProject />} />
                <Route path="projects/:projectId/manage-properties" element={<AdminManageProjectProperties />} />
                <Route path="agencies" element={<AdminAgencies />} />
                <Route path="advertisements" element={<AdminAdvertisements />} />
                <Route path="districts" element={<AdminDistricts />} />
                <Route path="service-pricing" element={<AdminServicePricing />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="terms-conditions" element={<AdminTermsConditions />} />
              </Route>
            </Route>
            
            {/* Redirect root to default language */}
            <Route path="/" element={<LanguageRedirect />} />
            
            {/* Redirect dashboard routes without language prefix */}
            <Route path="/dashboard/*" element={<DashboardRedirect />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <MobileBottomNav />
        </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
