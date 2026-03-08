import { Building2, Users, CreditCard, MessageSquareWarning, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentPayments = [
  { tenant: "Kwame Asante", property: "Adabraka Flats - Unit 3", amount: "GH₵ 1,200", date: "Mar 5, 2026", method: "Mobile Money" },
  { tenant: "Ama Serwaa", property: "East Legon Villa - Unit 1", amount: "GH₵ 3,500", date: "Mar 3, 2026", method: "Bank Card" },
  { tenant: "Yaw Mensah", property: "Adabraka Flats - Unit 7", amount: "GH₵ 1,200", date: "Mar 1, 2026", method: "Cash" },
  { tenant: "Abena Owusu", property: "Osu Apartments - Unit 2", amount: "GH₵ 2,000", date: "Feb 28, 2026", method: "Mobile Money" },
];

const recentComplaints = [
  { tenant: "Kwame Asante", issue: "Water leakage in kitchen", status: "Open", date: "Mar 7, 2026" },
  { tenant: "Ama Serwaa", issue: "Broken door lock", status: "In Progress", date: "Mar 4, 2026" },
  { tenant: "Yaw Mensah", issue: "Electricity fluctuation", status: "Resolved", date: "Feb 25, 2026" },
];

const statusColor: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Welcome back, Landlord</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Properties" value={12} icon={Building2} trend="+2 this month" trendUp />
          <StatCard title="Active Tenants" value={34} icon={Users} trend="+5 this month" trendUp />
          <StatCard title="Revenue (Mar)" value="GH₵ 42,800" icon={CreditCard} trend="+12% vs Feb" trendUp />
          <StatCard title="Open Complaints" value={3} icon={MessageSquareWarning} trend="-2 vs last week" trendUp />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentPayments.map((p, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{p.tenant}</p>
                      <p className="text-xs text-muted-foreground">{p.property}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-success flex items-center gap-1 justify-end">
                        <ArrowUpRight className="h-3 w-3" /> {p.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.method} · {p.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Complaints</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentComplaints.map((c, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{c.tenant}</p>
                      <p className="text-xs text-muted-foreground">{c.issue}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={statusColor[c.status]}>
                        {c.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
