import { Building2, User, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const roles = [
  {
    id: "landlord",
    title: "I'm a Landlord",
    desc: "Manage properties, tenants, payments, and accounting",
    icon: Building2,
    loginPath: "/login?role=landlord",
  },
  {
    id: "tenant",
    title: "I'm a Tenant",
    desc: "View rent, make payments, submit complaints, and get notices",
    icon: User,
    loginPath: "/login?role=tenant",
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [assigning, setAssigning] = useState(false);

  // If user already has a role, redirect them
  if (!loading && user && role) {
    navigate(role === "tenant" ? "/tenant" : "/dashboard", { replace: true });
    return null;
  }

  const handleRoleClick = async (selectedRole: string) => {
    if (user && !role) {
      // User is logged in but has no role — assign it now
      setAssigning(true);
      const { error } = await supabase.from("user_roles").insert({
        user_id: user.id,
        role: selectedRole as "landlord" | "tenant",
      });
      if (error) {
        toast.error("Failed to assign role. Please try again.");
        setAssigning(false);
        return;
      }
      // Also create profile if needed
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
      const email = user.user_metadata?.email || user.email || "";
      await supabase.from("profiles").upsert(
        { user_id: user.id, full_name: fullName, email },
        { onConflict: "user_id" }
      );
      toast.success("Role assigned!");
      navigate(selectedRole === "tenant" ? "/tenant" : "/dashboard", { replace: true });
      // Force reload to refresh role in context
      window.location.reload();
    } else {
      // Not logged in — go to login page
      navigate(`/login?role=${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Button>

        <div className="text-center mb-10 animate-fade-in">
          <img src={logo} alt="Afie Wura" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold">Welcome to Afie Wura</h1>
          <p className="text-muted-foreground mt-3 font-body text-lg">
            {user && !role ? "Choose your role to continue" : "How would you like to use the platform?"}
          </p>
        </div>

        {assigning ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {roles.map((r, i) => (
              <Card
                key={r.id}
                onClick={() => handleRoleClick(r.id)}
                className="cursor-pointer border-2 hover:border-primary transition-all hover:shadow-lg animate-fade-in group"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                <CardContent className="p-7 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <r.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-semibold text-xl">{r.title}</h2>
                    <p className="text-muted-foreground text-base font-body mt-2">{r.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-base text-muted-foreground">
            Are you a Super Admin?{' '}
            <Button variant="link" size="sm" onClick={() => navigate("/admin/login")}>Login here</Button>
          </p>
        </div>
      </div>
    </div>
  );
}
