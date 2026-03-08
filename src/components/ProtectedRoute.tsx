import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: "landlord" | "tenant" }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/role-select" replace />;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === "tenant" ? "/tenant" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
