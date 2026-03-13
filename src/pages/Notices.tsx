import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const typeIcon: Record<string, React.ElementType> = {
  Announcement: Megaphone,
  Notice: Info,
  Alert: AlertTriangle,
};

const typeColor: Record<string, string> = {
  Announcement: "bg-primary/10 text-primary",
  Notice: "bg-success/10 text-success",
  Alert: "bg-destructive/10 text-destructive",
};

const Notices = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [property, setProperty] = useState("");
  const [message, setMessage] = useState("");
  const [properties, setProperties] = useState<any[]>([]);

  const fetchNotices = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notices")
      .select("*")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false });
    setNotices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
    if (user) {
      supabase.from("properties").select("id, name").eq("landlord_id", user.id).then(({ data }) => {
        setProperties(data || []);
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type || !user) {
      toast.error("Title and type are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("notices").insert({
      landlord_id: user.id,
      title: title.trim(),
      type,
      property: property || "All Properties",
      message: message.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to create notice");
      return;
    }
    toast.success("Notice sent!");
    setDialogOpen(false);
    setTitle(""); setType(""); setProperty(""); setMessage("");
    fetchNotices();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Notices & Announcements</h1>
            <p className="text-muted-foreground font-body mt-1">Send notices to your tenants</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Notice
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : notices.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No notices yet.</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => {
              const Icon = typeIcon[notice.type] || Info;
              return (
                <Card key={notice.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColor[notice.type] || typeColor.Notice}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{notice.title}</h3>
                          <Badge className={typeColor[notice.type] || typeColor.Notice}>{notice.type}</Badge>
                        </div>
                        <p className="text-sm mt-1">{notice.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notice.property} · {new Date(notice.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">New Notice</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. Rent Due Reminder" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Notice">Notice</SelectItem>
                    <SelectItem value="Alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property</Label>
                <Select value={property} onValueChange={setProperty}>
                  <SelectTrigger><SelectValue placeholder="All Properties" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Properties">All Properties</SelectItem>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Write your notice here..." rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Notice
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Notices;
