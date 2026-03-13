import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Smartphone, CreditCard, Plus, Trash2, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentDetail {
  id?: string;
  method: string;
  account_name: string;
  account_number: string;
  provider: string;
  is_active: boolean;
}

const momoProviders = ["MTN Mobile Money", "Vodafone Cash", "AirtelTigo Money"];

export default function PaymentDetailsSettings() {
  const { user } = useAuth();
  const [details, setDetails] = useState<PaymentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("payment_details")
      .select("*")
      .eq("landlord_id", user.id)
      .order("created_at")
      .then(({ data }) => {
        setDetails(data || []);
        setLoading(false);
      });
  }, [user]);

  const addDetail = (method: string) => {
    setDetails((prev) => [
      ...prev,
      { method, account_name: "", account_number: "", provider: method === "momo" ? momoProviders[0] : "", is_active: true },
    ]);
  };

  const updateDetail = (index: number, field: keyof PaymentDetail, value: any) => {
    setDetails((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const removeDetail = async (index: number) => {
    const detail = details[index];
    if (detail.id) {
      await supabase.from("payment_details").delete().eq("id", detail.id);
    }
    setDetails((prev) => prev.filter((_, i) => i !== index));
    toast.success("Payment method removed");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    for (const detail of details) {
      if (!detail.account_name.trim() || !detail.account_number.trim()) {
        toast.error("Please fill in all fields for each payment method");
        setSaving(false);
        return;
      }

      const payload = {
        landlord_id: user.id,
        method: detail.method,
        account_name: detail.account_name.trim(),
        account_number: detail.account_number.trim(),
        provider: detail.provider,
        is_active: detail.is_active,
      };

      if (detail.id) {
        await supabase.from("payment_details").update(payload).eq("id", detail.id);
      } else {
        const { data } = await supabase.from("payment_details").insert(payload).select().single();
        if (data) detail.id = data.id;
      }
    }

    setSaving(false);
    toast.success("Payment details saved!");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const momoDetails = details.filter((d) => d.method === "momo");
  const cardDetails = details.filter((d) => d.method === "card");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Wallet className="h-5 w-5 text-primary" /> Payment Details
        </CardTitle>
        <CardDescription>
          Add your payment accounts so tenants can see where to send payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mobile Money Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" /> Mobile Money
            </h3>
            <Button variant="outline" size="sm" onClick={() => addDetail("momo")} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add MoMo
            </Button>
          </div>
          {momoDetails.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No mobile money accounts added yet.</p>
          )}
          {momoDetails.map((detail) => {
            const idx = details.indexOf(detail);
            return (
              <div key={idx} className="rounded-lg border border-input p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={detail.is_active}
                      onCheckedChange={(val) => updateDetail(idx, "is_active", val)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {detail.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeDetail(idx)} className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Provider</Label>
                  <Select value={detail.provider} onValueChange={(val) => updateDetail(idx, "provider", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {momoProviders.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Account Name</Label>
                  <Input
                    placeholder="e.g. Kwame Mensah"
                    value={detail.account_name}
                    onChange={(e) => updateDetail(idx, "account_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Phone Number</Label>
                  <Input
                    placeholder="e.g. 024 123 4567"
                    value={detail.account_number}
                    onChange={(e) => updateDetail(idx, "account_number", e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Card / Bank Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Bank / Card
            </h3>
            <Button variant="outline" size="sm" onClick={() => addDetail("card")} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Bank
            </Button>
          </div>
          {cardDetails.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No bank/card accounts added yet.</p>
          )}
          {cardDetails.map((detail) => {
            const idx = details.indexOf(detail);
            return (
              <div key={idx} className="rounded-lg border border-input p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={detail.is_active}
                      onCheckedChange={(val) => updateDetail(idx, "is_active", val)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {detail.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeDetail(idx)} className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Bank Name</Label>
                  <Input
                    placeholder="e.g. GCB Bank"
                    value={detail.provider}
                    onChange={(e) => updateDetail(idx, "provider", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Account Name</Label>
                  <Input
                    placeholder="e.g. Kwame Mensah"
                    value={detail.account_name}
                    onChange={(e) => updateDetail(idx, "account_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Account Number</Label>
                  <Input
                    placeholder="e.g. 1234567890"
                    value={detail.account_number}
                    onChange={(e) => updateDetail(idx, "account_number", e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Payment Details
        </Button>
      </CardContent>
    </Card>
  );
}
