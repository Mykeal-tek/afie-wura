import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Phone, Mail, Loader2, UserPlus, Copy, Check, Clock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AddTenantDialog } from "@/components/AddTenantDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Pending: "bg-primary/10 text-primary border-primary/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

const Tenants = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", property_id: "", unit: "", base_rent: "" });
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  const fetchTenants = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tenants")
      .select("*, profiles!tenants_user_id_fkey(full_name, phone, email), properties!tenants_property_id_fkey(name)")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      const { data: fallbackData } = await supabase
        .from("tenants")
        .select("*")
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });
      setTenants(fallbackData || []);
    } else {
      setTenants(data || []);
    }
    setLoading(false);
  };

  const fetchPendingInvites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("tenant_invites")
      .select("*, properties(name)")
      .eq("landlord_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setPendingInvites(data || []);
  };

  useEffect(() => {
    fetchTenants();
    fetchPendingInvites();
    if (user) {
      supabase.from("properties").select("id, name").eq("landlord_id", user.id).then(({ data }) => {
        setProperties(data || []);
      });
    }
  }, [user]);

  const handleInvite = async () => {
    if (!inviteForm.email.trim() || !user) {
      toast.error("Tenant email is required");
      return;
    }
    setInviting(true);
    const { data, error } = await supabase
      .from("tenant_invites")
      .insert({
        landlord_id: user.id,
        email: inviteForm.email.trim(),
        property_id: inviteForm.property_id || null,
        unit: inviteForm.unit || null,
        base_rent: parseFloat(inviteForm.base_rent) || 0,
      })
      .select("token")
      .single();

    setInviting(false);
    if (error) {
      toast.error("Failed to create invite");
      return;
    }
    const link = `${window.location.origin}${import.meta.env.BASE_URL}signup?invite=${data.token}&role=tenant`;
    setInviteLink(link);
    fetchPendingInvites();
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  const cancelInvite = async (inviteId: string) => {
    await supabase.from("tenant_invites").update({ status: "cancelled" }).eq("id", inviteId);
    fetchPendingInvites();
    toast.success("Invite cancelled");
  };

  const resetInviteDialog = () => {
    setInviteOpen(false);
    setInviteLink("");
    setCopied(false);
    setInviteForm({ email: "", property_id: "", unit: "", base_rent: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Tenants</h1>
            <p className="text-muted-foreground font-body mt-1">Manage your tenants</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setInviteOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" /> Invite Tenant
            </Button>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Tenant
            </Button>
          </div>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Pending Invites ({pendingInvites.length})
            </h2>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{invite.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {invite.properties?.name ? `${invite.properties.name}${invite.unit ? ` · ${invite.unit}` : ""}` : "No property assigned"}
                        {" · "}Expires {new Date(invite.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">Pending</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => cancelInvite(invite.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tenants Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tenants.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No tenants yet. Click "Invite Tenant" to send an invite link or "Add Tenant" to add one manually.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tenants.map((tenant) => {
              const profile = tenant.profiles;
              const property = tenant.properties;
              const name = profile?.full_name || "Unknown Tenant";
              const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
              return (
                <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-11 w-11 bg-primary/10">
                        <AvatarFallback className="bg-primary/10 text-primary font-display font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{name}</h3>
                          <Badge variant="outline" className={statusColor[tenant.status] || statusColor.Pending}>{tenant.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{property?.name || "—"} · {tenant.unit || "—"}</p>
                        <p className="text-sm font-semibold text-primary mt-1">GH₵ {tenant.base_rent?.toLocaleString()}/mo</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {profile?.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{profile.phone}</span>}
                          {profile?.email && <span className="flex items-center gap-1 truncate"><Mail className="h-3 w-3 shrink-0" />{profile.email}</span>}
                        </div>
                        {tenant.move_in && <p className="text-xs text-muted-foreground mt-1">Move-in: {new Date(tenant.move_in).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={resetInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Invite Tenant
            </DialogTitle>
          </DialogHeader>

          {inviteLink ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this link with your tenant. It expires in <span className="font-medium text-foreground">7 days</span>. When they sign up using this link, they'll be automatically connected to you and their property.
              </p>
              <div className="flex gap-2">
                <Input value={inviteLink} readOnly className="text-xs bg-muted/40 font-mono" />
                <Button size="icon" variant="outline" onClick={copyLink} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                You can also share via WhatsApp or SMS by copying the link above.
              </p>
              <Button className="w-full" variant="outline" onClick={resetInviteDialog}>Done</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tenant Email <span className="text-destructive">*</span></Label>
                <Input
                  type="email"
                  placeholder="tenant@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Property</Label>
                <Select value={inviteForm.property_id} onValueChange={(v) => setInviteForm(p => ({ ...p, property_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select property (optional)" /></SelectTrigger>
                  <SelectContent>
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input
                    placeholder="e.g. A1"
                    value={inviteForm.unit}
                    onChange={(e) => setInviteForm(p => ({ ...p, unit: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Rent (GH₵)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 1200"
                    value={inviteForm.base_rent}
                    onChange={(e) => setInviteForm(p => ({ ...p, base_rent: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1" onClick={resetInviteDialog}>Cancel</Button>
                <Button className="flex-1" onClick={handleInvite} disabled={inviting}>
                  {inviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Generate Invite Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddTenantDialog open={dialogOpen} onOpenChange={setDialogOpen} onTenantAdded={fetchTenants} />
    </DashboardLayout>
  );
};

export default Tenants;
