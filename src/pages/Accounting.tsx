import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";

const monthlyData = [
  { month: "Jan", inflow: 38000, outflow: 12000 },
  { month: "Feb", inflow: 41000, outflow: 9500 },
  { month: "Mar", inflow: 42800, outflow: 11200 },
];

const recentTransactions = [
  { description: "Rent - Kwame Asante", type: "inflow", amount: "GH₵ 1,200", date: "Mar 5", category: "Rent" },
  { description: "Rent - Ama Serwaa", type: "inflow", amount: "GH₵ 3,500", date: "Mar 3", category: "Rent" },
  { description: "Plumber - Kitchen repair", type: "outflow", amount: "GH₵ 450", date: "Mar 3", category: "Maintenance" },
  { description: "Rent - Yaw Mensah", type: "inflow", amount: "GH₵ 1,200", date: "Mar 1", category: "Rent" },
  { description: "Security service", type: "outflow", amount: "GH₵ 800", date: "Feb 28", category: "Security" },
  { description: "Rent - Abena Owusu", type: "inflow", amount: "GH₵ 2,000", date: "Feb 28", category: "Rent" },
  { description: "ECG Bill - Adabraka Flats", type: "outflow", amount: "GH₵ 1,200", date: "Feb 25", category: "Utilities" },
  { description: "Painting - Unit 5", type: "outflow", amount: "GH₵ 600", date: "Feb 20", category: "Maintenance" },
];

const Accounting = () => {
  const currentMonth = monthlyData[monthlyData.length - 1];
  const netIncome = currentMonth.inflow - currentMonth.outflow;

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
          <StatCard title="Total Transactions" value={recentTransactions.length} icon={Receipt} />
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

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentTransactions.map((t, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
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
                    {t.type === "inflow" ? "+" : "-"}{t.amount}
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
