import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, Receipt, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const formatAmount = (n: number) => `GH₵ ${n.toLocaleString()}`;

const Accounting = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("all");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("payments")
        .select("*")
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });

      const withNames = await Promise.all(
        (data || []).map(async (p: any) => {
          const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", p.tenant_id).maybeSingle();
          return { ...p, tenant_name: profile?.full_name || "Unknown" };
        })
      );
      setPayments(withNames);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const filteredPayments = useMemo(() => {
    return payments.filter((t) => {
      const date = t.created_at?.split("T")[0];
      const matchDate = (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
      return matchDate;
    });
  }, [payments, fromDate, toDate]);

  const totalInflow = filteredPayments
    .filter((p) => p.status === "Completed")
    .reduce((s, p) => s + (p.amount || 0), 0);

  const downloadCSV = () => {
    const header = "Date,Tenant,Amount,Method,Reference,Status\n";
    const rows = filteredPayments
      .map((t) => `${t.created_at?.split("T")[0]},"${t.tenant_name}",${t.amount},${t.method},${t.reference || ""},${t.status}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <DashboardLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Accounting</h1>
          <p className="text-muted-foreground font-body mt-1">Financial overview and transaction history</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Revenue" value={formatAmount(totalInflow)} icon={TrendingUp} />
          <StatCard title="Total Transactions" value={filteredPayments.length} icon={Receipt} />
          <StatCard title="Completed" value={filteredPayments.filter(p => p.status === "Completed").length} icon={Wallet} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" /> Financial Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="space-y-1 flex-1">
                <Label className="text-xs">From</Label>
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs">To</Label>
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-1.5">
                <Download className="h-4 w-4" /> CSV
              </Button>
            </div>

            <div className="rounded-lg bg-success/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="font-bold text-success">{formatAmount(totalInflow)}</p>
            </div>

            <div className="divide-y max-h-80 overflow-auto">
              {filteredPayments.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No transactions for selected period.</p>
              )}
              {filteredPayments.map((t) => (
                <div key={t.id} className="px-2 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-success/10">
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.tenant_name} — {t.description || t.method}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-success">+{formatAmount(t.amount || 0)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Accounting;
