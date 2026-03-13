import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShieldCheck, Users, Building2, CreditCard, Bell, LogOut, Plus, Send } from "lucide-react";
import { format, addMonths } from "date-fns";
import { StatCard } from "@/components/StatCard";

interface UserWithRole {
  user_id: string;
  role: string;
  profile?: { full_name: string; email: string; phone: string };
  subscription?: { id: string; status: string; end_date: string; duration_months: number; amount: number };
}

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscription dialog state
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [subDuration, setSubDuration] = useState("1");
  const [subAmount, setSubAmount] = useState("");
  const [subPaymentMethod, setSubPaymentMethod] = useState("momo");
  const [subReference, setSubReference] = useState("");

  // Notification dialog
  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
  const [notifUserId, setNotifUserId] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifTypes, setNotifTypes] = useState<string[]>(["in_app"]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch all user roles
    const { data: roles } = await supabase.from("user_roles").select("*");
    // Fetch all profiles
    const { data: profiles } = await supabase.from("profiles").select("*");
    // Fetch all subscriptions
    const { data: subs } = await supabase.from("subscriptions").select("*");
    // Fetch properties
    const { data: props } = await supabase.from("properties").select("*");
    // Fetch payments
    const { data: pays } = await supabase.from("payments").select("*");
    // Fetch notifications
    const { data: notifs } = await supabase.from("subscription_notifications").select("*");

    const userList: UserWithRole[] = (roles || [])
      .filter((r: any) => r.role !== "admin")
      .map((r: any) => {
        const profile = (profiles || []).find((p: any) => p.user_id === r.user_id);
        const sub = (subs || []).find((s: any) => s.user_id === r.user_id && s.status === "active");
        return {
          user_id: r.user_id,
          role: r.role,
          profile: profile ? { full_name: profile.full_name, email: profile.email || "", phone: profile.phone || "" } : undefined,
          subscription: sub ? { id: sub.id, status: sub.status, end_date: sub.end_date, duration_months: sub.duration_months, amount: sub.amount } : undefined,
        };
      });

    setUsers(userList);
    setProperties(props || []);
    setPayments(pays || []);
    setNotifications(notifs || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const landlords = users.filter(u => u.role === "landlord");
  const tenants = users.filter(u => u.role === "tenant");

  const handleAddSubscription = async () => {
    if (!selectedUserId || !subAmount) {
      toast.error("Please fill all fields");
      return;
    }
    const startDate = new Date();
    const endDate = addMonths(startDate, parseInt(subDuration));

    const { error } = await supabase.from("subscriptions").insert({
      user_id: selectedUserId,
      duration_months: parseInt(subDuration),
      amount: parseFloat(subAmount),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      payment_method: subPaymentMethod,
      payment_reference: subReference,
      status: "active",
    });

    if (error) {
      toast.error("Failed to add subscription");
      return;
    }
    toast.success("Subscription added!");
    setSubDialogOpen(false);
    setSubAmount("");
    setSubReference("");
    fetchData();
  };

  const handleSendNotification = async () => {
    if (!notifUserId || !notifMessage || !notifTitle) {
      toast.error("Please fill all fields");
      return;
    }

    const user = users.find(u => u.user_id === notifUserId);
    
    // Create in-app notification
    for (const type of notifTypes) {
      await supabase.from("subscription_notifications").insert({
        user_id: notifUserId,
        type,
        title: notifTitle,
        message: notifMessage,
        sent: type === "in_app",
      });
    }

    toast.success("Notification(s) sent!");
    setNotifDialogOpen(false);
    setNotifMessage("");
    setNotifTitle("");
    fetchData();
  };

  const handleRevokeSubscription = async (subId: string) => {
    const { error } = await supabase.from("subscriptions").update({ status: "revoked" }).eq("id", subId);
    if (error) toast.error("Failed to revoke");
    else { toast.success("Subscription revoked"); fetchData(); }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Super Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Afie Wura Management</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Landlords" value={landlords.length} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Tenants" value={tenants.length} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Properties" value={properties.length} icon={<Building2 className="h-5 w-5" />} />
          <StatCard title="Active Subs" value={users.filter(u => u.subscription).length} icon={<CreditCard className="h-5 w-5" />} />
        </div>

        <Tabs defaultValue="landlords">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="landlords">Landlords</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Landlords Tab */}
          <TabsContent value="landlords">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Landlords</CardTitle>
                <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Subscription</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Subscription</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Landlord</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                          <SelectTrigger><SelectValue placeholder="Select landlord" /></SelectTrigger>
                          <SelectContent>
                            {landlords.map(l => (
                              <SelectItem key={l.user_id} value={l.user_id}>
                                {l.profile?.full_name || l.profile?.email || l.user_id.slice(0, 8)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duration (months)</Label>
                        <Select value={subDuration} onValueChange={setSubDuration}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 3, 6, 12].map(m => (
                              <SelectItem key={m} value={String(m)}>{m} month{m > 1 ? "s" : ""}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount (GHS)</Label>
                        <Input type="number" placeholder="0.00" value={subAmount} onChange={e => setSubAmount(e.target.value)} />
                      </div>
                      <div>
                        <Label>Payment Method</Label>
                        <Select value={subPaymentMethod} onValueChange={setSubPaymentMethod}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="momo">Mobile Money</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Payment Reference</Label>
                        <Input placeholder="Transaction ID" value={subReference} onChange={e => setSubReference(e.target.value)} />
                      </div>
                      <Button className="w-full" onClick={handleAddSubscription}>Add Subscription</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {landlords.map(l => (
                      <TableRow key={l.user_id}>
                        <TableCell className="font-medium">{l.profile?.full_name || "—"}</TableCell>
                        <TableCell>{l.profile?.email || "—"}</TableCell>
                        <TableCell>{l.profile?.phone || "—"}</TableCell>
                        <TableCell>
                          {l.subscription ? (
                            <Badge variant={l.subscription.status === "active" ? "default" : "secondary"}>
                              {l.subscription.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline">None</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {l.subscription ? format(new Date(l.subscription.end_date), "MMM dd, yyyy") : "—"}
                        </TableCell>
                        <TableCell className="space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setNotifUserId(l.user_id);
                            setNotifDialogOpen(true);
                          }}>
                            <Bell className="h-3 w-3" />
                          </Button>
                          {l.subscription && (
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRevokeSubscription(l.subscription!.id)}>
                              Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {landlords.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No landlords registered yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tenants Tab */}
          <TabsContent value="tenants">
            <Card>
              <CardHeader><CardTitle>Tenants</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map(t => (
                      <TableRow key={t.user_id}>
                        <TableCell className="font-medium">{t.profile?.full_name || "—"}</TableCell>
                        <TableCell>{t.profile?.email || "—"}</TableCell>
                        <TableCell>{t.profile?.phone || "—"}</TableCell>
                      </TableRow>
                    ))}
                    {tenants.length === 0 && (
                      <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No tenants registered yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader><CardTitle>All Subscriptions</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.subscription).map(u => (
                      <TableRow key={u.subscription!.id}>
                        <TableCell className="font-medium">{u.profile?.full_name || u.user_id.slice(0, 8)}</TableCell>
                        <TableCell>{u.subscription!.duration_months} mo</TableCell>
                        <TableCell>GHS {u.subscription!.amount}</TableCell>
                        <TableCell>{format(new Date(u.subscription!.end_date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(new Date(u.subscription!.end_date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={u.subscription!.status === "active" ? "default" : "secondary"}>
                            {u.subscription!.status}
                          </Badge>
                        </TableCell>
                        <TableCell>—</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Read</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((n: any) => {
                      const user = users.find(u => u.user_id === n.user_id);
                      return (
                        <TableRow key={n.id}>
                          <TableCell>{user?.profile?.full_name || n.user_id.slice(0, 8)}</TableCell>
                          <TableCell className="font-medium">{n.title}</TableCell>
                          <TableCell><Badge variant="outline">{n.type}</Badge></TableCell>
                          <TableCell className="max-w-[200px] truncate">{n.message}</TableCell>
                          <TableCell>{format(new Date(n.created_at), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{n.read ? "✓" : "—"}</TableCell>
                        </TableRow>
                      );
                    })}
                    {notifications.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No notifications sent yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Send Notification Dialog */}
      <Dialog open={notifDialogOpen} onOpenChange={setNotifDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send Notification</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Recipient</Label>
              <p className="text-sm text-muted-foreground">
                {users.find(u => u.user_id === notifUserId)?.profile?.full_name || "Selected user"}
              </p>
            </div>
            <div>
              <Label>Title</Label>
              <Input placeholder="Subscription Expiring" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} />
            </div>
            <div>
              <Label>Message</Label>
              <Input placeholder="Your subscription expires soon..." value={notifMessage} onChange={e => setNotifMessage(e.target.value)} />
            </div>
            <div>
              <Label>Channels</Label>
              <div className="flex gap-3 mt-1">
                {["in_app", "email", "sms"].map(type => (
                  <label key={type} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={notifTypes.includes(type)}
                      onChange={e => {
                        if (e.target.checked) setNotifTypes(prev => [...prev, type]);
                        else setNotifTypes(prev => prev.filter(t => t !== type));
                      }}
                    />
                    {type === "in_app" ? "In-App" : type === "email" ? "Email" : "SMS"}
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleSendNotification}>
              <Send className="h-4 w-4 mr-1" /> Send Notification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
