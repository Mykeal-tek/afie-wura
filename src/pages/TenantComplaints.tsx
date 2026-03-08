import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Plus, Send, MessageCircle, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const statusColor: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

const statusIcon: Record<string, React.ElementType> = {
  Open: AlertCircle,
  "In Progress": Clock,
  Resolved: CheckCircle2,
};

const TenantComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchComplaints = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("complaints")
      .select("*")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false });
    setComplaints(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, [user]);

  const openChat = async (complaint: any) => {
    setActiveComplaint(complaint);
    setChatOpen(true);
    const { data } = await supabase
      .from("complaint_messages")
      .select("*")
      .eq("complaint_id", complaint.id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeComplaint || !user) return;
    await supabase.from("complaint_messages").insert({
      complaint_id: activeComplaint.id,
      sender_id: user.id,
      sender_role: "tenant" as const,
      text: newMessage.trim(),
    });
    setNewMessage("");
    const { data } = await supabase
      .from("complaint_messages")
      .select("*")
      .eq("complaint_id", activeComplaint.id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const submitComplaint = async () => {
    if (!newIssue.trim() || !newDescription.trim() || !user) {
      toast.error("Please fill in all fields");
      return;
    }
    // Get tenant's landlord
    const { data: tenant } = await supabase
      .from("tenants")
      .select("landlord_id, property_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!tenant?.landlord_id) {
      toast.error("You're not assigned to a landlord yet");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("complaints").insert({
      tenant_id: user.id,
      landlord_id: tenant.landlord_id,
      property_id: tenant.property_id,
      issue: newIssue.trim(),
      description: newDescription.trim(),
    });
    setSaving(false);

    if (error) {
      toast.error("Failed to submit complaint");
      return;
    }
    toast.success("Complaint submitted!");
    setNewOpen(false);
    setNewIssue("");
    setNewDescription("");
    fetchComplaints();
  };

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">My Complaints</h1>
            <p className="text-muted-foreground font-body mt-1">Lodge and track your complaints</p>
          </div>
          <Button onClick={() => setNewOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Lodge Complaint
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : complaints.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No complaints yet.</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => {
              const StatusIcon = statusIcon[c.status] || AlertCircle;
              return (
                <Card key={c.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <StatusIcon className={`h-5 w-5 mt-0.5 shrink-0 ${c.status === "Open" ? "text-destructive" : c.status === "In Progress" ? "text-primary" : "text-success"}`} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{c.issue}</h3>
                            <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                          </div>
                          {c.description && <p className="text-sm mt-1 text-muted-foreground">{c.description}</p>}
                          <p className="text-xs text-muted-foreground mt-2">
                            Submitted: {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => openChat(c)}>
                        <MessageCircle className="h-4 w-4" /> Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">Lodge a Complaint</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Issue Title <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Water leakage in bathroom" value={newIssue} onChange={(e) => setNewIssue(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Describe the issue..." rows={4} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
              <Button onClick={submitComplaint} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit Complaint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Chat — {activeComplaint?.issue}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-72 border rounded-lg p-3 bg-muted/30">
            {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>}
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_role === "tenant" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender_role === "tenant" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                    <p className="text-[10px] font-semibold mb-0.5">{m.sender_role === "tenant" ? "You" : "Landlord"}</p>
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sender_role === "tenant" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(m.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
            <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </TenantLayout>
  );
};

export default TenantComplaints;
