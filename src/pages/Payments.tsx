import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, CreditCard, Banknote } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const payments = [
  { id: 1, tenant: "Kwame Asante", property: "Adabraka Flats - Unit 3", amount: "GH₵ 1,200", method: "Mobile Money", reference: "MOMO-2026030501", date: "Mar 5, 2026", status: "Completed" },
  { id: 2, tenant: "Ama Serwaa", property: "East Legon Villa - Unit 1", amount: "GH₵ 3,500", method: "Bank Card", reference: "CARD-2026030301", date: "Mar 3, 2026", status: "Completed" },
  { id: 3, tenant: "Yaw Mensah", property: "Adabraka Flats - Unit 7", amount: "GH₵ 1,200", method: "Cash", reference: "CASH-2026030102", date: "Mar 1, 2026", status: "Completed" },
  { id: 4, tenant: "Abena Owusu", property: "Osu Apartments - Unit 2", amount: "GH₵ 2,000", method: "Mobile Money", reference: "MOMO-2026022801", date: "Feb 28, 2026", status: "Completed" },
  { id: 5, tenant: "Kofi Darko", property: "Tema Community 25 - Unit 4", amount: "GH₵ 1,800", method: "Mobile Money", reference: "—", date: "—", status: "Pending" },
];

const methodIcon: Record<string, React.ElementType> = {
  "Mobile Money": Smartphone,
  "Bank Card": CreditCard,
  "Cash": Banknote,
};

const statusColor: Record<string, string> = {
  Completed: "bg-success/10 text-success border-success/20",
  Pending: "bg-primary/10 text-primary border-primary/20",
  Failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const Payments = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Payments</h1>
            <p className="text-muted-foreground font-body mt-1">Track rent payments across all properties</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Record Payment
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Tenant</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Property</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium hidden sm:table-cell">Method</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Reference</th>
                    <th className="text-left p-4 font-medium hidden sm:table-cell">Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const Icon = methodIcon[p.method] || Banknote;
                    return (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-4 font-medium">{p.tenant}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{p.property}</td>
                        <td className="p-4 font-semibold">{p.amount}</td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="flex items-center gap-1.5">
                            <Icon className="h-4 w-4 text-muted-foreground" /> {p.method}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground hidden lg:table-cell font-mono text-xs">{p.reference}</td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{p.date}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={statusColor[p.status]}>{p.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Record Payment</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
            <div className="space-y-2">
              <Label>Tenant</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kwame">Kwame Asante</SelectItem>
                  <SelectItem value="ama">Ama Serwaa</SelectItem>
                  <SelectItem value="yaw">Yaw Mensah</SelectItem>
                  <SelectItem value="abena">Abena Owusu</SelectItem>
                  <SelectItem value="kofi">Kofi Darko</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (GH₵)</Label>
                <Input type="number" placeholder="e.g. 1200" />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momo">Mobile Money (MoMo)</SelectItem>
                    <SelectItem value="card">Bank Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reference / Transaction ID</Label>
              <Input placeholder="e.g. MOMO-2026030501" />
            </div>
            <div className="space-y-2">
              <Label>Payment Date</Label>
              <Input type="date" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Record Payment</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;
