import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { CreditCard, Smartphone, Banknote, Download, Printer, Filter, Loader2 } from "lucide-react";
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
  Processing: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-primary/10 text-primary border-primary/20",
  Failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const TenantPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [payTab, setPayTab] = useState("momo");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const fetchPayments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false });
    setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
    if (user) {
      supabase.from("tenants").select("*, properties(name)").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        setTenantInfo(data);
      });
    }
  }, [user]);

  const filteredPayments = payments.filter((p) => {
    const date = p.created_at?.split("T")[0];
    if (filterFrom && date < filterFrom) return false;
    if (filterTo && date > filterTo) return false;
    return true;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handlePay = async (method: string) => {
    if (!user || !tenantInfo) return;
    setSaving(true);
    const { error } = await supabase.from("payments").insert({
      tenant_id: user.id,
      landlord_id: tenantInfo.landlord_id,
      property_id: tenantInfo.property_id,
      amount: tenantInfo.base_rent || 0,
      method: method === "momo" ? "Mobile Money" : "Bank Card",
      status: "Completed",
      description: "Rent Payment",
    });
    setSaving(false);
    if (error) {
      toast.error("Payment failed");
      return;
    }
    toast.success("Payment recorded!");
    setPayOpen(false);
    fetchPayments();
  };

  const downloadCSV = () => {
    const headers = "Date,Description,Amount,Method,Reference,Status\n";
    const rows = filteredPayments.map((p) =>
      `${formatDate(p.created_at)},${p.description || ""},GH₵ ${p.amount},${p.method},${p.reference || ""},${p.status}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "my-payments.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <TenantLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></TenantLayout>;
  }

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">My Payments</h1>
            <p className="text-muted-foreground font-body mt-1">View and make rent payments</p>
          </div>
          <Button onClick={() => setPayOpen(true)} className="gap-2">
            <CreditCard className="h-4 w-4" /> Make Payment
          </Button>
        </div>

        {tenantInfo && (
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rent Amount</p>
                  <p className="font-display font-bold text-2xl text-primary">GH₵ {tenantInfo.base_rent?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">{tenantInfo.properties?.name || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <Label className="text-xs">From</Label>
                  <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To</Label>
                  <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="h-9" />
                </div>
                {(filterFrom || filterTo) && (
                  <Button variant="ghost" size="sm" onClick={() => { setFilterFrom(""); setFilterTo(""); }}>Clear</Button>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-1.5">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium hidden sm:table-cell">Method</th>
                    <th className="text-left p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No payments found.</td></tr>
                  ) : filteredPayments.map((p) => {
                    const Icon = methodIcon[p.method] || Banknote;
                    return (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-4 text-muted-foreground">{formatDate(p.created_at)}</td>
                        <td className="p-4 font-medium">{p.description || "Payment"}</td>
                        <td className="p-4 font-semibold">GH₵ {p.amount?.toLocaleString()}</td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-muted-foreground" /> {p.method}</span>
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
      </div>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">Make Rent Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {tenantInfo && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium">Amount: <span className="text-primary font-bold">GH₵ {tenantInfo.base_rent?.toLocaleString()}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">{tenantInfo.properties?.name}</p>
                </CardContent>
              </Card>
            )}
            <Tabs value={payTab} onValueChange={setPayTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="momo" className="gap-1.5"><Smartphone className="h-4 w-4" /> MoMo</TabsTrigger>
                <TabsTrigger value="card" className="gap-1.5"><CreditCard className="h-4 w-4" /> Card</TabsTrigger>
              </TabsList>
              <TabsContent value="momo" className="mt-3">
                <Button className="w-full" onClick={() => handlePay("momo")} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Smartphone className="h-4 w-4 mr-2" />}
                  Pay via MoMo
                </Button>
              </TabsContent>
              <TabsContent value="card" className="mt-3">
                <Button className="w-full" onClick={() => handlePay("card")} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CreditCard className="h-4 w-4 mr-2" />}
                  Pay via Card
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </TenantLayout>
  );
};

export default TenantPayments;
