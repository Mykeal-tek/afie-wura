import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, Receipt, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";

const allTransactions = [
  { description: "Rent - Kwame Asante", type: "inflow", amount: 1200, date: "2026-03-05", category: "Rent" },
  { description: "Rent - Ama Serwaa", type: "inflow", amount: 3500, date: "2026-03-03", category: "Rent" },
  { description: "Plumber - Kitchen repair", type: "outflow", amount: 450, date: "2026-03-03", category: "Maintenance" },
  { description: "Rent - Yaw Mensah", type: "inflow", amount: 1200, date: "2026-03-01", category: "Rent" },
  { description: "Security service", type: "outflow", amount: 800, date: "2026-02-28", category: "Security" },
  { description: "Rent - Abena Owusu", type: "inflow", amount: 2000, date: "2026-02-28", category: "Rent" },
  { description: "ECG Bill - Adabraka Flats", type: "outflow", amount: 1200, date: "2026-02-25", category: "Utilities" },
  { description: "Painting - Unit 5", type: "outflow", amount: 600, date: "2026-02-20", category: "Maintenance" },
  { description: "Rent - Kofi Darko", type: "inflow", amount: 1800, date: "2026-02-15", category: "Rent" },
  { description: "Security upgrade", type: "outflow", amount: 2000, date: "2026-01-28", category: "Security" },
  { description: "Rent - Kwame Asante", type: "inflow", amount: 1200, date: "2026-01-05", category: "Rent" },
  { description: "Rent - Ama Serwaa", type: "inflow", amount: 3500, date: "2026-01-03", category: "Rent" },
];

const monthlyData = [
  { month: "Jan", inflow: 38000, outflow: 12000 },
  { month: "Feb", inflow: 41000, outflow: 9500 },
  { month: "Mar", inflow: 42800, outflow: 11200 },
];

const formatAmount = (n: number) => `GH₵ ${n.toLocaleString()}`;

const Accounting = () => {
  const currentMonth = monthlyData[monthlyData.length - 1];
  const netIncome = currentMonth.inflow - currentMonth.outflow;

  // Report filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("all");

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const matchDate = (!fromDate || t.date >= fromDate) && (!toDate || t.date <= toDate);
      const matchType = reportType === "all" || t.type === reportType;
      return matchDate && matchType;
    });
  }, [fromDate, toDate, reportType]);

  const reportInflow = filteredTransactions.filter((t) => t.type === "inflow").reduce((s, t) => s + t.amount, 0);
  const reportOutflow = filteredTransactions.filter((t) => t.type === "outflow").reduce((s, t) => s + t.amount, 0);
  const reportNet = reportInflow - reportOutflow;

  const downloadCSV = () => {
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = filteredTransactions
      .map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${fromDate || "start"}-to-${toDate || "end"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    // Generate a printable HTML report
    const html = `
      <html><head><title>Financial Report</title>
      <style>
        body { font-family: sans-serif; padding: 40px; }
        h1 { color: #0D7377; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
        th { background: #0D7377; color: white; }
        .summary { display: flex; gap: 40px; margin: 20px 0; }
        .summary div { padding: 12px; border-radius: 8px; background: #f5f5f5; }
      </style></head><body>
      <h1>Afie Wura — Financial Report</h1>
      <p>Period: ${fromDate || "All time"} to ${toDate || "Present"}</p>
      <div class="summary">
        <div><strong>Total Inflow:</strong> ${formatAmount(reportInflow)}</div>
        <div><strong>Total Outflow:</strong> ${formatAmount(reportOutflow)}</div>
        <div><strong>Net Income:</strong> ${formatAmount(reportNet)}</div>
      </div>
      <table>
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th></tr></thead>
        <tbody>
          ${filteredTransactions.map((t) => `<tr><td>${t.date}</td><td>${t.description}</td><td>${t.category}</td><td>${t.type}</td><td>GH₵ ${t.amount.toLocaleString()}</td></tr>`).join("")}
        </tbody>
      </table>
      </body></html>
    `;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Accounting</h1>
          <p className="text-muted-foreground font-body mt-1">Financial overview and transaction history</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Inflow (Mar)" value="GH₵ 42,800" icon={TrendingUp} trend="+4.4% vs Feb" trendUp />
          <StatCard title="Total Outflow (Mar)" value="GH₵ 11,200" icon={TrendingDown} trend="+17.9% vs Feb" trendUp={false} />
          <StatCard title="Net Income (Mar)" value={`GH₵ ${netIncome.toLocaleString()}`} icon={Wallet} trend="Healthy" trendUp />
          <StatCard title="Total Transactions" value={allTransactions.length} icon={Receipt} />
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {monthlyData.map((m) => (
            <Card key={m.month}>
              <CardContent className="p-5">
                <h3 className="font-display font-semibold text-lg mb-3">{m.month} 2026</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Inflow</span>
                    <span className="font-semibold text-success flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> GH₵ {m.inflow.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Outflow</span>
                    <span className="font-semibold text-destructive flex items-center gap-1">
                      <ArrowDownRight className="h-3 w-3" /> GH₵ {m.outflow.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-sm font-medium">Net</span>
                    <span className="font-bold text-primary">GH₵ {(m.inflow - m.outflow).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Financial Report */}
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
              <div className="space-y-1 flex-1">
                <Label className="text-xs">Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="inflow">Inflow Only</SelectItem>
                    <SelectItem value="outflow">Outflow Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-1.5">
                  <Download className="h-4 w-4" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPDF} className="gap-1.5">
                  <Download className="h-4 w-4" /> PDF
                </Button>
              </div>
            </div>

            {/* Report Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-success/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">Inflow</p>
                <p className="font-bold text-success">{formatAmount(reportInflow)}</p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">Outflow</p>
                <p className="font-bold text-destructive">{formatAmount(reportOutflow)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">Net</p>
                <p className="font-bold text-primary">{formatAmount(reportNet)}</p>
              </div>
            </div>

            {/* Filtered Transactions */}
            <div className="divide-y max-h-80 overflow-auto">
              {filteredTransactions.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No transactions for selected period.</p>
              )}
              {filteredTransactions.map((t, i) => (
                <div key={i} className="px-2 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === "inflow" ? "bg-success/10" : "bg-destructive/10"}`}>
                      {t.type === "inflow" ? (
                        <ArrowUpRight className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.category} · {t.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm ${t.type === "inflow" ? "text-success" : "text-destructive"}`}>
                    {t.type === "inflow" ? "+" : "-"}{formatAmount(t.amount)}
                  </span>
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
