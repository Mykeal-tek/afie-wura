import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/tenant" element={<TenantDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
