import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

const priorityColor: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-primary/10 text-primary",
  Low: "bg-muted text-muted-foreground",
};

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchComplaints = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("complaints")
      .select("*, profiles:tenant_id(full_name)")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      // Try to get tenant names from profiles
      const withNames = await Promise.all(
        (data || []).map(async (c: any) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", c.tenant_id)
            .maybeSingle();
          return { ...c, tenant_name: profile?.full_name || "Unknown Tenant" };
        })
      );
      setComplaints(withNames);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]);

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
    const { error } = await supabase.from("complaint_messages").insert({
      complaint_id: activeComplaint.id,
      sender_id: user.id,
      sender_role: "landlord" as const,
      text: newMessage.trim(),
    });
    if (error) {
      toast.error("Failed to send message");
      return;
    }
    setNewMessage("");
    // Refresh messages
    const { data } = await supabase
      .from("complaint_messages")
      .select("*")
      .eq("complaint_id", activeComplaint.id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const updateStatus = async (complaintId: string, status: string) => {
    const statusMap: Record<string, string> = { open: "Open", "in-progress": "In Progress", resolved: "Resolved" };
    await supabase.from("complaints").update({ status: statusMap[status] || status }).eq("id", complaintId);
    fetchComplaints();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Complaints</h1>
          <p className="text-muted-foreground font-body mt-1">View and manage tenant complaints</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : complaints.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No complaints yet.</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{c.issue}</h3>
                        <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                        <Badge className={priorityColor[c.priority]}>{c.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{c.tenant_name}</p>
                      {c.description && <p className="text-sm mt-2">{c.description}</p>}
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openChat(c)}>
                        <MessageCircle className="h-4 w-4" /> Chat
                      </Button>
                      <Select
                        defaultValue={c.status.toLowerCase().replace(" ", "-")}
                        onValueChange={(val) => updateStatus(c.id, val)}
                      >
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Chat — {activeComplaint?.issue}</DialogTitle>
            <p className="text-xs text-muted-foreground">{activeComplaint?.tenant_name}</p>
          </DialogHeader>
          <ScrollArea className="h-72 border rounded-lg p-3 bg-muted/30">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>
            )}
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_role === "landlord" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender_role === "landlord" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sender_role === "landlord" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(m.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
            <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Complaints;
