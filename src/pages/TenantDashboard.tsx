import { Building2, CreditCard, MessageSquareWarning, Bell, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TenantLayout } from "@/components/TenantLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const statusColor: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-accent/10 text-accent border-accent/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Paid: "bg-success/10 text-success border-success/20",
  Completed: "bg-success/10 text-success border-success/20",
};

const statusIcon: Record<string, React.ElementType> = {
  Open: AlertCircle,
  "In Progress": Clock,
  Resolved: CheckCircle2,
};

export default function TenantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      // Get tenant record
      const { data: tenant } = await supabase
        .from("tenants")
        .select("*, properties(name)")
        .eq("user_id", user.id)
        .maybeSingle();
      setTenantInfo(tenant);

      // Get payments
      const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);
      setRecentPayments(payments || []);

      // Get complaints
      const { data: complaints } = await supabase
        .from("complaints")
        .select("*")
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentComplaints(complaints || []);

      // Get notices from landlord
      if (tenant?.landlord_id) {
        const { data: noticesData } = await supabase
          .from("notices")
          .select("*")
          .eq("landlord_id", tenant.landlord_id)
          .order("created_at", { ascending: false })
          .limit(3);
        setNotices(noticesData || []);
      }

      setLoading(false);
    };
    fetch();
  }, [user]);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Tenant";

  if (loading) {
    return (
      <TenantLayout>
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Tenant Portal</h1>
          <p className="text-muted-foreground font-body mt-1">Welcome back, {userName}</p>
        </div>

        {tenantInfo ? (
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground font-body">Your Property</p>
                  <p className="font-display font-bold text-xl mt-1">{tenantInfo.properties?.name || "—"} · {tenantInfo.unit || ""}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-muted-foreground font-body">Monthly Rent</p>
                  <p className="font-display font-bold text-2xl text-primary">GH₵ {tenantInfo.base_rent?.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={() => navigate("/tenant/payments")} className="bg-primary hover:bg-primary/90">
                  <CreditCard className="h-4 w-4 mr-2" /> Pay Rent Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card><CardContent className="p-6 text-center text-muted-foreground">You haven't been assigned to a property yet.</CardContent></Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentPayments.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground text-center">No payments yet.</p>
              ) : (
                <div className="divide-y">
                  {recentPayments.map((p) => (
                    <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{p.description || p.method}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-success flex items-center gap-1 justify-end">
                          <ArrowUpRight className="h-3 w-3" /> GH₵ {p.amount?.toLocaleString()}
                        </p>
                        <Badge variant="outline" className={`text-xs ${statusColor[p.status]}`}>{p.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-primary" /> My Complaints
              </CardTitle>
              <Button size="sm" variant="outline" className="border-primary text-primary" onClick={() => navigate("/tenant/complaints")}>
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {recentComplaints.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground text-center">No complaints yet.</p>
              ) : (
                <div className="divide-y">
                  {recentComplaints.map((c) => {
                    const StatusIcon = statusIcon[c.status] || AlertCircle;
                    return (
                      <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-4 w-4 ${c.status === "Open" ? "text-destructive" : c.status === "In Progress" ? "text-accent" : "text-success"}`} />
                          <div>
                            <p className="font-medium text-sm">{c.issue}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notices & Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notices.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted-foreground text-center">No notices yet.</p>
            ) : (
              <div className="divide-y">
                {notices.map((n) => (
                  <div key={n.id} className="px-5 py-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm">{n.title}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 ml-4">
                        {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 font-body">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  );
}
