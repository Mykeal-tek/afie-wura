import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CreditCard, Smartphone, Banknote, Download, Printer, Filter } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: number;
  amount: string;
  method: string;
  reference: string;
  date: string;
  status: string;
  description: string;
}

const initialPayments: Payment[] = [
  { id: 1, amount: "GH₵ 1,200", method: "Mobile Money", reference: "MOMO-2026030501", date: "2026-03-05", status: "Completed", description: "March 2026 Rent" },
  { id: 2, amount: "GH₵ 1,200", method: "Mobile Money", reference: "MOMO-2026020301", date: "2026-02-03", status: "Completed", description: "February 2026 Rent" },
  { id: 3, amount: "GH₵ 1,200", method: "Bank Card", reference: "CARD-2026010501", date: "2026-01-05", status: "Completed", description: "January 2026 Rent" },
  { id: 4, amount: "GH₵ 1,200", method: "Cash", reference: "CASH-2025120801", date: "2025-12-08", status: "Completed", description: "December 2025 Rent" },
];

const methodIcon: Record<string, React.ElementType> = {
  "Mobile Money": Smartphone,
  "Bank Card": CreditCard,
  "Cash": Banknote,
};

const statusColor: Record<string, string> = {
  Completed: "bg-success/10 text-success border-success/20",
  Processing: "bg-primary/10 text-primary border-primary/20",
  Failed: "bg-destructive/10 text-destructive border-destructive/20",
};

// Landlord payment details (provided by landlord)
const landlordPaymentDetails = {
  momoNumber: "024 555 0000",
  momoName: "Kofi Mensah",
  momoNetwork: "MTN MoMo",
  bankName: "GCB Bank",
  bankAccount: "1234567890",
  bankBranch: "Accra Main",
};

const TenantPayments = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [payOpen, setPayOpen] = useState(false);
  const [payTab, setPayTab] = useState("momo");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const filteredPayments = payments.filter((p) => {
    if (filterFrom && p.date < filterFrom) return false;
    if (filterTo && p.date > filterTo) return false;
    return true;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handlePay = (method: string) => {
    const newPayment: Payment = {
      id: Date.now(),
      amount: "GH₵ 1,200",
      method: method === "momo" ? "Mobile Money" : "Bank Card",
      reference: `${method.toUpperCase()}-${Date.now().toString().slice(-10)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      description: "Rent Payment",
    };
    setPayments((prev) => [newPayment, ...prev]);
    toast.success("Payment initiated! Processing...");
    setPayOpen(false);
    setTimeout(() => {
      setPayments((prev) => prev.map((p) => p.id === newPayment.id ? { ...p, status: "Completed" } : p));
      toast.success("Payment completed successfully!");
    }, 3000);
  };

  const downloadCSV = () => {
    const headers = "Date,Description,Amount,Method,Reference,Status\n";
    const rows = filteredPayments.map((p) =>
      `${formatDate(p.date)},${p.description},${p.amount},${p.method},${p.reference},${p.status}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-payments.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Payment history downloaded!");
  };

  const handlePrint = () => {
    const printContent = `
      <html><head><title>Payment History - Kwame Asante</title>
      <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}h1{font-size:18px}p{color:#666;font-size:14px}</style></head>
      <body><h1>Afie Wura - Payment History</h1><p>Tenant: Kwame Asante · Adabraka Flats - Unit 3</p>
      <table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Method</th><th>Reference</th><th>Status</th></tr></thead>
      <tbody>${filteredPayments.map((p) => `<tr><td>${formatDate(p.date)}</td><td>${p.description}</td><td>${p.amount}</td><td>${p.method}</td><td>${p.reference}</td><td>${p.status}</td></tr>`).join("")}</tbody></table></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

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

        {/* Rent Due Card */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Rent Due</p>
                <p className="font-display font-bold text-2xl text-primary">GH₵ 1,200</p>
                <p className="text-sm text-muted-foreground mt-1">Due: Apr 1, 2026</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 self-start">Current: Paid</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Filter & Actions */}
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-1.5">
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History Table */}
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
                    <th className="text-left p-4 font-medium hidden md:table-cell">Reference</th>
                    <th className="text-left p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => {
                    const Icon = methodIcon[p.method] || Banknote;
                    return (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-4 text-muted-foreground">{formatDate(p.date)}</td>
                        <td className="p-4 font-medium">{p.description}</td>
                        <td className="p-4 font-semibold">{p.amount}</td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-muted-foreground" /> {p.method}</span>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell font-mono text-xs">{p.reference}</td>
                        <td className="p-4"><Badge variant="outline" className={statusColor[p.status]}>{p.status}</Badge></td>
                      </tr>
                    );
                  })}
                  {filteredPayments.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No payments found for the selected period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Make Payment Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Make Rent Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium">Amount Due: <span className="text-primary font-bold">GH₵ 1,200</span></p>
                <p className="text-xs text-muted-foreground mt-1">Property: Adabraka Flats - Unit 3</p>
              </CardContent>
            </Card>

            <Tabs value={payTab} onValueChange={setPayTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="momo" className="gap-1.5"><Smartphone className="h-4 w-4" /> MoMo</TabsTrigger>
                <TabsTrigger value="card" className="gap-1.5"><CreditCard className="h-4 w-4" /> Card</TabsTrigger>
              </TabsList>
              <TabsContent value="momo" className="space-y-3 mt-3">
                <Card className="bg-muted/30">
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold mb-1">Landlord's MoMo Details</p>
                    <p className="text-sm">{landlordPaymentDetails.momoNetwork}: <strong>{landlordPaymentDetails.momoNumber}</strong></p>
                    <p className="text-sm">Name: {landlordPaymentDetails.momoName}</p>
                  </CardContent>
                </Card>
                <Button className="w-full" onClick={() => handlePay("momo")}>
                  <Smartphone className="h-4 w-4 mr-2" /> Pay GH₵ 1,200 via MoMo
                </Button>
              </TabsContent>
              <TabsContent value="card" className="space-y-3 mt-3">
                <Card className="bg-muted/30">
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold mb-1">Bank Details</p>
                    <p className="text-sm">Bank: {landlordPaymentDetails.bankName}</p>
                    <p className="text-sm">Account: <strong>{landlordPaymentDetails.bankAccount}</strong></p>
                    <p className="text-sm">Branch: {landlordPaymentDetails.bankBranch}</p>
                  </CardContent>
                </Card>
                <Button className="w-full" onClick={() => handlePay("card")}>
                  <CreditCard className="h-4 w-4 mr-2" /> Pay GH₵ 1,200 via Card
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
