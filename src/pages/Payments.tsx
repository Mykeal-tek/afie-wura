import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, CreditCard, Banknote, Send } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Payment {
  id: number;
  tenant: string;
  property: string;
  amount: string;
  method: string;
  reference: string;
  date: string;
  status: string;
}

const initialPayments: Payment[] = [
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
  Processing: "bg-accent text-accent-foreground border-accent/20",
};

const Payments = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [recordOpen, setRecordOpen] = useState(false);
  const [initOpen, setInitOpen] = useState(false);
  const [initTab, setInitTab] = useState("momo");

  // Initialize transaction
  const [initTenant, setInitTenant] = useState("");
  const [initAmount, setInitAmount] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [momoNetwork, setMomoNetwork] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handleInitialize = (method: string) => {
    const newPayment: Payment = {
      id: Date.now(),
      tenant: initTenant || "Unknown Tenant",
      property: "—",
      amount: `GH₵ ${parseFloat(initAmount).toLocaleString()}`,
      method: method === "momo" ? "Mobile Money" : "Bank Card",
      reference: `${method.toUpperCase()}-${Date.now().toString().slice(-10)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Processing",
    };
    setPayments((prev) => [newPayment, ...prev]);
    toast.success(`${method === "momo" ? "MoMo" : "Card"} transaction initiated for GH₵ ${initAmount}`);
    setInitOpen(false);
    resetInitForm();
    // Simulate completion after 3 seconds
    setTimeout(() => {
      setPayments((prev) =>
        prev.map((p) => p.id === newPayment.id ? { ...p, status: "Completed" } : p)
      );
      toast.success("Transaction completed successfully!");
    }, 3000);
  };

  const resetInitForm = () => {
    setInitTenant("");
    setInitAmount("");
    setMomoNumber("");
    setMomoNetwork("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Payments</h1>
            <p className="text-muted-foreground font-body mt-1">Track rent payments across all properties</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setInitOpen(true)} className="gap-2">
              <Send className="h-4 w-4" /> Initialize Transaction
            </Button>
            <Button onClick={() => setRecordOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Record Payment
            </Button>
          </div>
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

      {/* Initialize Transaction Dialog */}
      <Dialog open={initOpen} onOpenChange={setInitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Initialize Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tenant</Label>
              <Select value={initTenant} onValueChange={setInitTenant}>
                <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kwame Asante">Kwame Asante</SelectItem>
                  <SelectItem value="Ama Serwaa">Ama Serwaa</SelectItem>
                  <SelectItem value="Yaw Mensah">Yaw Mensah</SelectItem>
                  <SelectItem value="Abena Owusu">Abena Owusu</SelectItem>
                  <SelectItem value="Kofi Darko">Kofi Darko</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (GH₵)</Label>
              <Input type="number" placeholder="e.g. 1200" value={initAmount} onChange={(e) => setInitAmount(e.target.value)} />
            </div>

            <Tabs value={initTab} onValueChange={setInitTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="momo" className="gap-1.5"><Smartphone className="h-4 w-4" /> MoMo</TabsTrigger>
                <TabsTrigger value="card" className="gap-1.5"><CreditCard className="h-4 w-4" /> Card</TabsTrigger>
              </TabsList>
              <TabsContent value="momo" className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input placeholder="e.g. 024 555 1234" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Network</Label>
                  <Select value={momoNetwork} onValueChange={setMomoNetwork}>
                    <SelectTrigger><SelectValue placeholder="Select network" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN MoMo</SelectItem>
                      <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                      <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => handleInitialize("momo")} disabled={!initTenant || !initAmount || !momoNumber || !momoNetwork}>
                  <Smartphone className="h-4 w-4 mr-2" /> Send MoMo Request
                </Button>
              </TabsContent>
              <TabsContent value="card" className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input placeholder="123" type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleInitialize("card")} disabled={!initTenant || !initAmount || !cardNumber || !cardExpiry || !cardCvv}>
                  <CreditCard className="h-4 w-4 mr-2" /> Charge Card
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Record Payment</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const methodMap: Record<string, string> = { momo: "Mobile Money", card: "Bank Card", cash: "Cash" };
            const newPayment: Payment = {
              id: Date.now(),
              tenant: formData.get("tenant") as string || "Unknown",
              property: "—",
              amount: `GH₵ ${parseFloat(formData.get("amount") as string || "0").toLocaleString()}`,
              method: methodMap[formData.get("method") as string] || "Cash",
              reference: formData.get("reference") as string || "—",
              date: new Date(formData.get("date") as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              status: "Completed",
            };
            setPayments((prev) => [newPayment, ...prev]);
            toast.success("Payment recorded successfully!");
            setRecordOpen(false);
          }}>
            <div className="space-y-2">
              <Label>Tenant</Label>
              <Select name="tenant">
                <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kwame Asante">Kwame Asante</SelectItem>
                  <SelectItem value="Ama Serwaa">Ama Serwaa</SelectItem>
                  <SelectItem value="Yaw Mensah">Yaw Mensah</SelectItem>
                  <SelectItem value="Abena Owusu">Abena Owusu</SelectItem>
                  <SelectItem value="Kofi Darko">Kofi Darko</SelectItem>
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
                    <SelectItem value="momo">Mobile Money (MoMo)</SelectItem>
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
              <Label>Payment Date</Label>
              <Input name="date" type="date" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setRecordOpen(false)}>Cancel</Button>
              <Button type="submit">Record Payment</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;
