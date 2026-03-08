import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Send, MessageCircle, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: number;
  sender: "landlord" | "tenant";
  text: string;
  time: string;
}

interface Complaint {
  id: number;
  issue: string;
  description: string;
  status: string;
  date: string;
  priority: string;
  messages: Message[];
}

const initialComplaints: Complaint[] = [
  {
    id: 1, issue: "Water leakage in kitchen",
    description: "There is a persistent water leakage under the kitchen sink. The floor gets wet and slippery.",
    status: "Open", date: "Mar 7, 2026", priority: "High",
    messages: [
      { id: 1, sender: "tenant", text: "The water is leaking again under the kitchen sink.", time: "Mar 7, 10:30 AM" },
      { id: 2, sender: "landlord", text: "I'll send a plumber tomorrow morning. Sorry for the inconvenience.", time: "Mar 7, 11:15 AM" },
    ],
  },
  {
    id: 2, issue: "Broken door lock",
    description: "The main door lock is broken and cannot be locked properly from outside.",
    status: "In Progress", date: "Feb 20, 2026", priority: "High",
    messages: [
      { id: 1, sender: "tenant", text: "The front door lock is broken. I can't lock it from outside.", time: "Feb 20, 9:00 AM" },
      { id: 2, sender: "landlord", text: "A locksmith has been contacted. They will come on Monday.", time: "Feb 20, 2:00 PM" },
    ],
  },
  {
    id: 3, issue: "Electricity fluctuation",
    description: "Power keeps going off and on. It is affecting my appliances.",
    status: "Resolved", date: "Jan 15, 2026", priority: "Medium",
    messages: [],
  },
];

const statusColor: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Resolved: "bg-success/10 text-success border-success/20",
  "Not Done": "bg-muted text-muted-foreground border-muted",
};

const statusIcon: Record<string, React.ElementType> = {
  Open: AlertCircle,
  "In Progress": Clock,
  Resolved: CheckCircle2,
  "Not Done": XCircle,
};

const TenantComplaints = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [newOpen, setNewOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const openChat = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    setChatOpen(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeComplaint) return;
    const msg: Message = {
      id: Date.now(),
      sender: "tenant",
      text: newMessage.trim(),
      time: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
    };
    setComplaints((prev) =>
      prev.map((c) => c.id === activeComplaint.id ? { ...c, messages: [...c.messages, msg] } : c)
    );
    setActiveComplaint((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
    setNewMessage("");
  };

  const submitComplaint = () => {
    const errs: Record<string, boolean> = {};
    if (!newIssue.trim()) errs.issue = true;
    if (!newDescription.trim()) errs.description = true;
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const complaint: Complaint = {
      id: Date.now(),
      issue: newIssue.trim(),
      description: newDescription.trim(),
      status: "Open",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      priority: "Medium",
      messages: [],
    };
    setComplaints((prev) => [complaint, ...prev]);
    toast.success("Complaint submitted successfully!");
    setNewOpen(false);
    setNewIssue("");
    setNewDescription("");
    setErrors({});
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

        <div className="space-y-4">
          {complaints.map((c) => {
            const StatusIcon = statusIcon[c.status] || AlertCircle;
            return (
              <Card key={c.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <StatusIcon className={`h-5 w-5 mt-0.5 shrink-0 ${c.status === "Open" ? "text-destructive" : c.status === "In Progress" ? "text-primary" : c.status === "Resolved" ? "text-success" : "text-muted-foreground"}`} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{c.issue}</h3>
                          <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                        </div>
                        <p className="text-sm mt-1 text-muted-foreground">{c.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">Submitted: {c.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => openChat(c)}>
                      <MessageCircle className="h-4 w-4" /> Chat
                      {c.messages.length > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">{c.messages.length}</Badge>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {complaints.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No complaints yet. Click "Lodge Complaint" to submit one.
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Complaint Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Lodge a Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Issue Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. Water leakage in bathroom"
                value={newIssue}
                onChange={(e) => { setNewIssue(e.target.value); setErrors((p) => ({ ...p, issue: false })); }}
                className={errors.issue ? "border-destructive" : ""}
              />
              {errors.issue && <p className="text-xs text-destructive">Please enter the issue title</p>}
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea
                placeholder="Describe the issue in detail..."
                rows={4}
                value={newDescription}
                onChange={(e) => { setNewDescription(e.target.value); setErrors((p) => ({ ...p, description: false })); }}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-xs text-destructive">Please provide a description</p>}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
              <Button onClick={submitComplaint}>Submit Complaint</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Chat — {activeComplaint?.issue}</DialogTitle>
            <p className="text-xs text-muted-foreground">Status: {activeComplaint?.status}</p>
          </DialogHeader>
          <ScrollArea className="h-72 border rounded-lg p-3 bg-muted/30">
            {activeComplaint?.messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start the conversation.</p>
            )}
            <div className="space-y-3">
              {activeComplaint?.messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "tenant" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender === "tenant" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                    <p className="text-[10px] font-semibold mb-0.5">{m.sender === "tenant" ? "You" : "Landlord"}</p>
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sender === "tenant" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
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
    </TenantLayout>
  );
};

export default TenantComplaints;
