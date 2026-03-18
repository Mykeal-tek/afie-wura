import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Complaints from "./pages/Complaints";
import Notices from "./pages/Notices";
import Payments from "./pages/Payments";
import Accounting from "./pages/Accounting";
import TenantDashboard from "./pages/TenantDashboard";
import TenantProperties from "./pages/TenantProperties";
import TenantComplaints from "./pages/TenantComplaints";
import TenantNotices from "./pages/TenantNotices";
import TenantPayments from "./pages/TenantPayments";
import TenantSettings from "./pages/TenantSettings";
import Settings from "./pages/Settings";
import Install from "./pages/Install";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/afie-wura">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/learn" element={<LearnMore />} />
            <Route path="/role-select" element={<RoleSelect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Landlord routes */}
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="landlord"><Index /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute requiredRole="landlord"><Properties /></ProtectedRoute>} />
            <Route path="/tenants" element={<ProtectedRoute requiredRole="landlord"><Tenants /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute requiredRole="landlord"><Complaints /></ProtectedRoute>} />
            <Route path="/notices" element={<ProtectedRoute requiredRole="landlord"><Notices /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute requiredRole="landlord"><Payments /></ProtectedRoute>} />
            <Route path="/accounting" element={<ProtectedRoute requiredRole="landlord"><Accounting /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requiredRole="landlord"><Settings /></ProtectedRoute>} />
            {/* Tenant routes */}
            <Route path="/tenant" element={<ProtectedRoute requiredRole="tenant"><TenantDashboard /></ProtectedRoute>} />
            <Route path="/tenant/properties" element={<ProtectedRoute requiredRole="tenant"><TenantProperties /></ProtectedRoute>} />
            <Route path="/tenant/complaints" element={<ProtectedRoute requiredRole="tenant"><TenantComplaints /></ProtectedRoute>} />
            <Route path="/tenant/notices" element={<ProtectedRoute requiredRole="tenant"><TenantNotices /></ProtectedRoute>} />
            <Route path="/tenant/payments" element={<ProtectedRoute requiredRole="tenant"><TenantPayments /></ProtectedRoute>} />
            <Route path="/tenant/settings" element={<ProtectedRoute requiredRole="tenant"><TenantSettings /></ProtectedRoute>} />
            <Route path="/install" element={<Install />} />
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
