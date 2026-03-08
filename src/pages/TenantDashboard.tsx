import { Building2, CreditCard, MessageSquareWarning, Bell, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

const rentInfo = {
  property: "Adabraka Flats - Unit 3",
  landlord: "Mr. Kofi Mensah",
  monthlyRent: "GH₵ 1,200",
  nextDue: "Apr 1, 2026",
  status: "Paid",
};

const paymentHistory = [
  { month: "March 2026", amount: "GH₵ 1,200", date: "Mar 5, 2026", method: "Mobile Money", status: "Paid" },
  { month: "February 2026", amount: "GH₵ 1,200", date: "Feb 3, 2026", method: "Mobile Money", status: "Paid" },
  { month: "January 2026", amount: "GH₵ 1,200", date: "Jan 5, 2026", method: "Bank Card", status: "Paid" },
  { month: "December 2025", amount: "GH₵ 1,200", date: "Dec 8, 2025", method: "Cash", status: "Paid" },
];

const myComplaints = [
  { issue: "Water leakage in kitchen", status: "Open", date: "Mar 7, 2026" },
  { issue: "Broken door lock", status: "In Progress", date: "Feb 20, 2026" },
  { issue: "Electricity fluctuation", status: "Resolved", date: "Jan 15, 2026" },
];

const notices = [
  { title: "Water Supply Interruption", message: "Water supply will be interrupted on Mar 15 for maintenance.", date: "Mar 8, 2026" },
  { title: "Rent Increase Notice", message: "Effective May 1, rent will be adjusted to GH₵ 1,350.", date: "Mar 1, 2026" },
  { title: "Community Meeting", message: "All tenants meeting on Mar 20 at 6 PM in the courtyard.", date: "Feb 25, 2026" },
];

const statusColor: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-accent/10 text-accent border-accent/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Paid: "bg-success/10 text-success border-success/20",
};

const statusIcon: Record<string, React.ElementType> = {
  Open: AlertCircle,
  "In Progress": Clock,
  Resolved: CheckCircle2,
};

export default function TenantDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Tenant Portal</h1>
          <p className="text-muted-foreground font-body mt-1">Welcome back, Kwame Asante</p>
        </div>

        {/* Rent Summary */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-body">Your Property</p>
                <p className="font-display font-bold text-xl mt-1">{rentInfo.property}</p>
                <p className="text-sm text-muted-foreground mt-1">Landlord: {rentInfo.landlord}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground font-body">Monthly Rent</p>
                <p className="font-display font-bold text-2xl text-primary">{rentInfo.monthlyRent}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">Next due: {rentInfo.nextDue}</p>
                  <Badge variant="outline" className={statusColor[rentInfo.status]}>{rentInfo.status}</Badge>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button className="bg-primary hover:bg-primary/90">
                <CreditCard className="h-4 w-4 mr-2" /> Pay Rent Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {paymentHistory.map((p, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{p.month}</p>
                      <p className="text-xs text-muted-foreground">{p.method} · {p.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-success flex items-center gap-1 justify-end">
                        <ArrowUpRight className="h-3 w-3" /> {p.amount}
                      </p>
                      <Badge variant="outline" className={`text-xs ${statusColor[p.status]}`}>{p.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Complaints */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-primary" /> My Complaints
              </CardTitle>
              <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {myComplaints.map((c, i) => {
                  const StatusIcon = statusIcon[c.status];
                  return (
                    <div key={i} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-4 w-4 ${c.status === "Open" ? "text-destructive" : c.status === "In Progress" ? "text-accent" : "text-success"}`} />
                        <div>
                          <p className="font-medium text-sm">{c.issue}</p>
                          <p className="text-xs text-muted-foreground">{c.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notices & Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {notices.map((n, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm">{n.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">{n.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 font-body">{n.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
