import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AddTenantDialog } from "@/components/AddTenantDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Pending: "bg-primary/10 text-primary border-primary/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

const Tenants = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tenants")
      .select("*, profiles!tenants_user_id_fkey(full_name, phone, email), properties!tenants_property_id_fkey(name)")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback: fetch without joins
      const { data: fallbackData } = await supabase
        .from("tenants")
        .select("*")
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });
      setTenants(fallbackData || []);
    } else {
      setTenants(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTenants();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Tenants</h1>
            <p className="text-muted-foreground font-body mt-1">Manage your tenants</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Tenant
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tenants.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No tenants yet. Click "Add Tenant" to add your first one.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tenants.map((tenant) => {
              const profile = tenant.profiles;
              const property = tenant.properties;
              const name = profile?.full_name || "Unknown Tenant";
              const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
              return (
                <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-11 w-11 bg-primary/10">
                        <AvatarFallback className="bg-primary/10 text-primary font-display font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{name}</h3>
                          <Badge variant="outline" className={statusColor[tenant.status] || statusColor.Pending}>{tenant.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{property?.name || "—"} · {tenant.unit || "—"}</p>
                        <p className="text-sm font-semibold text-primary mt-1">GH₵ {tenant.base_rent?.toLocaleString()}/mo</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {profile?.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{profile.phone}</span>}
                          {profile?.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{profile.email}</span>}
                        </div>
                        {tenant.move_in && <p className="text-xs text-muted-foreground mt-1">Move-in: {new Date(tenant.move_in).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddTenantDialog open={dialogOpen} onOpenChange={setDialogOpen} onTenantAdded={fetchTenants} />
    </DashboardLayout>
  );
};

export default Tenants;
