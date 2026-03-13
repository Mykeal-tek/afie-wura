import { Building2, Users, CreditCard, MessageSquareWarning, ArrowUpRight, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const statusColor: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

const Index = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ properties: 0, tenants: 0, revenue: 0, complaints: 0 });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDashboard = async () => {
      const [propsRes, tenantsRes, paymentsRes, complaintsRes] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact" }).eq("landlord_id", user.id),
        supabase.from("tenants").select("id", { count: "exact" }).eq("landlord_id", user.id),
        supabase.from("payments").select("*").eq("landlord_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("complaints").select("*").eq("landlord_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);

      const totalRevenue = (paymentsRes.data || [])
        .filter((p: any) => p.status === "Completed")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      const openComplaints = (complaintsRes.data || []).filter((c: any) => c.status === "Open").length;

      setStats({
        properties: propsRes.count || 0,
        tenants: tenantsRes.count || 0,
        revenue: totalRevenue,
        complaints: openComplaints,
      });

      // Get tenant names for recent payments
      const paymentsWithNames = await Promise.all(
        (paymentsRes.data || []).map(async (p: any) => {
          const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", p.tenant_id).maybeSingle();
          return { ...p, tenant_name: profile?.full_name || "Unknown" };
        })
      );
      setRecentPayments(paymentsWithNames);

      const complaintsWithNames = await Promise.all(
        (complaintsRes.data || []).map(async (c: any) => {
          const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", c.tenant_id).maybeSingle();
          return { ...c, tenant_name: profile?.full_name || "Unknown" };
        })
      );
      setRecentComplaints(complaintsWithNames);

      setLoading(false);
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </DashboardLayout>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Landlord";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Welcome back, {userName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Properties" value={stats.properties} icon={Building2} />
          <StatCard title="Active Tenants" value={stats.tenants} icon={Users} />
          <StatCard title="Revenue" value={`GH₵ ${stats.revenue.toLocaleString()}`} icon={CreditCard} />
          <StatCard title="Open Complaints" value={stats.complaints} icon={MessageSquareWarning} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentPayments.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground text-center">No payments yet.</p>
              ) : (
                <div className="divide-y">
                  {recentPayments.map((p) => (
                    <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{p.tenant_name}</p>
                        <p className="text-xs text-muted-foreground">{p.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-success flex items-center gap-1 justify-end">
                          <ArrowUpRight className="h-3 w-3" /> GH₵ {p.amount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Complaints</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentComplaints.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground text-center">No complaints yet.</p>
              ) : (
                <div className="divide-y">
                  {recentComplaints.map((c) => (
                    <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{c.tenant_name}</p>
                        <p className="text-xs text-muted-foreground">{c.issue}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
