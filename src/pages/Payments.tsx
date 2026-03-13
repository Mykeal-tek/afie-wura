import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, CreditCard, Banknote, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const methodIcon: Record<string, React.ElementType> = {
  "Mobile Money": Smartphone,
  "Bank Card": CreditCard,
  "Cash": Banknote,
};

const statusColor: Record<string, string> = {
  Completed: "bg-success/10 text-success border-success/20",
  Pending: "bg-primary/10 text-primary border-primary/20",
  Failed: "bg-destructive/10 text-destructive border-destructive/20",
  Processing: "bg-accent text-accent-foreground border-accent/20",
};

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordOpen, setRecordOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);

  const fetchPayments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false });

    // Get tenant names
    const withNames = await Promise.all(
      (data || []).map(async (p: any) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", p.tenant_id)
          .maybeSingle();
        return { ...p, tenant_name: profile?.full_name || "Unknown" };
      })
    );
    setPayments(withNames);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
    if (user) {
      supabase.from("tenants").select("id, user_id").eq("landlord_id", user.id).then(async ({ data }) => {
        const withNames = await Promise.all(
          (data || []).map(async (t: any) => {
            const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", t.user_id).maybeSingle();
            return { ...t, name: profile?.full_name || "Unknown" };
          })
        );
        setTenants(withNames);
      });
    }
  }, [user]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const tenantUserId = formData.get("tenant") as string;
    if (!tenantUserId || !user) return;

    setSaving(true);
    const methodMap: Record<string, string> = { momo: "Mobile Money", card: "Bank Card", cash: "Cash" };
    const { error } = await supabase.from("payments").insert({
      tenant_id: tenantUserId,
      landlord_id: user.id,
      amount: parseFloat(formData.get("amount") as string) || 0,
      method: methodMap[formData.get("method") as string] || "Cash",
      reference: (formData.get("reference") as string) || "",
      status: "Completed",
      description: (formData.get("description") as string) || "",
    });
    setSaving(false);

    if (error) {
      toast.error("Failed to record payment");
      return;
    }
    toast.success("Payment recorded!");
    setRecordOpen(false);
    fetchPayments();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Payments</h1>
            <p className="text-muted-foreground font-body mt-1">Track rent payments across all properties</p>
          </div>
          <Button onClick={() => setRecordOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Record Payment
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Tenant</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium hidden sm:table-cell">Method</th>
                      <th className="text-left p-4 font-medium hidden lg:table-cell">Reference</th>
                      <th className="text-left p-4 font-medium hidden sm:table-cell">Date</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No payments yet.</td></tr>
                    ) : payments.map((p) => {
                      const Icon = methodIcon[p.method] || Banknote;
                      return (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-4 font-medium">{p.tenant_name}</td>
                          <td className="p-4 font-semibold">GH₵ {p.amount?.toLocaleString()}</td>
                          <td className="p-4 hidden sm:table-cell">
                            <span className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-muted-foreground" /> {p.method}</span>
                          </td>
                          <td className="p-4 text-muted-foreground hidden lg:table-cell font-mono text-xs">{p.reference || "—"}</td>
                          <td className="p-4 text-muted-foreground hidden sm:table-cell">
                            {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="p-4"><Badge variant="outline" className={statusColor[p.status]}>{p.status}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Record Payment</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleRecordPayment}>
            <div className="space-y-2">
              <Label>Tenant</Label>
              <Select name="tenant">
                <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.user_id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (GH₵)</Label>
                <Input name="amount" type="number" placeholder="e.g. 1200" />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select name="method">
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momo">Mobile Money</SelectItem>
                    <SelectItem value="card">Bank Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reference / Transaction ID</Label>
              <Input name="reference" placeholder="e.g. MOMO-2026030501" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input name="description" placeholder="e.g. March 2026 Rent" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setRecordOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Record Payment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;
