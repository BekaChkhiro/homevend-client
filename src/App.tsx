
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Advertising from "./pages/Advertising";
import TermsAndConditions from "./pages/TermsAndConditions";
import Properties from "./pages/Properties";
import PriceStatistics from "./pages/PriceStatistics";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Agencies from "./pages/Agencies";
import AgencyDetail from "./pages/AgencyDetail";
import UserProfile from "./pages/UserProfile";
import { Services } from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Developers from "./pages/Developers";
import DeveloperDetail from "./pages/DeveloperDetail";
import AdminOverview from "./pages/AdminDashboard/pages/Overview";
import AdminUsers from "./pages/AdminDashboard/pages/Users";
import AdminListings from "./pages/AdminDashboard/pages/Listings";
import AdminProjects from "./pages/AdminDashboard/pages/Projects";
import AdminEditProject from "./pages/AdminDashboard/pages/EditProject";
import AdminAgencies from "./pages/AdminDashboard/pages/Agencies";
import AdminEditProperty from "./pages/AdminDashboard/pages/EditProperty";
import AdminEditUser from "./pages/AdminDashboard/pages/EditUser";
import AdminAdvertisements from "./pages/AdminDashboard/pages/Advertisements";
import { AdminManageProjectProperties } from "./pages/AdminDashboard/components/AdminManageProjectProperties";
import AdminDistricts from "./pages/AdminDashboard/pages/Districts";
import AdminSettings from "./pages/AdminDashboard/pages/Settings";
import AdminServicePricing from "./pages/AdminDashboard/pages/ServicePricing";
import { AddProperty } from "./pages/Dashboard/pages/AddProperty";
import { EditProperty } from "./pages/Dashboard/pages/EditProperty";
import { AddProject } from "./pages/Dashboard/pages/AddProject";
import { EditProject } from "./pages/Dashboard/pages/EditProject";
import { MyProperties } from "./pages/Dashboard/components/MyProperties";
import { MyProjects } from "./pages/Dashboard/components/MyProjects";
import { ManageProjectProperties } from "./pages/Dashboard/components/ManageProjectProperties";
import { Favorites } from "./pages/Dashboard/components/Favorites";
import { ProfilePage } from "./pages/Dashboard/components/ProfilePage";
import { BalancePage } from "./pages/Dashboard/components/BalancePage";
import UsersPage from "./pages/Dashboard/pages/Users";
import { TestComponent } from "./pages/Dashboard/components/TestComponent";
import { SimpleAddProperty, SimpleMyProperties, SimpleFavorites, SimpleProfile, SimpleBalance } from "./pages/Dashboard/components/SimpleTest";
import TestFilters from "./pages/TestFilters";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { MobileBottomNav } from "./components/MobileBottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FavoritesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/test-filters" element={<TestFilters />} />
          <Route path="/price-statistics" element={<PriceStatistics />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/agencies/:id" element={<AgencyDetail />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/developers/:id" element={<DeveloperDetail />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/advertise" element={<Advertising />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}>
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
          <Route path="/admin" element={
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
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileBottomNav />
        </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
