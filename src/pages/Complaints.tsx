import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  sender: "landlord" | "tenant";
  text: string;
  time: string;
}

interface Complaint {
  id: number;
  tenant: string;
  property: string;
  issue: string;
  description: string;
  status: string;
  date: string;
  priority: string;
  messages: Message[];
}

const initialComplaints: Complaint[] = [
  { id: 1, tenant: "Kwame Asante", property: "Adabraka Flats - Unit 3", issue: "Water leakage in kitchen", description: "There is a persistent water leakage under the kitchen sink. The floor gets wet and slippery.", status: "Open", date: "Mar 7, 2026", priority: "High", messages: [
    { id: 1, sender: "tenant", text: "The water is leaking again under the kitchen sink.", time: "Mar 7, 10:30 AM" },
    { id: 2, sender: "landlord", text: "I'll send a plumber tomorrow morning. Sorry for the inconvenience.", time: "Mar 7, 11:15 AM" },
  ]},
  { id: 2, tenant: "Ama Serwaa", property: "East Legon Villa - Unit 1", issue: "Broken door lock", description: "The main door lock is broken and cannot be locked properly from outside.", status: "In Progress", date: "Mar 4, 2026", priority: "High", messages: [
    { id: 1, sender: "tenant", text: "The front door lock is broken. I can't lock it from outside.", time: "Mar 4, 9:00 AM" },
  ]},
  { id: 3, tenant: "Yaw Mensah", property: "Adabraka Flats - Unit 7", issue: "Electricity fluctuation", description: "Power keeps going off and on. It is affecting my appliances.", status: "Resolved", date: "Feb 25, 2026", priority: "Medium", messages: [] },
  { id: 4, tenant: "Kofi Darko", property: "Tema Community 25 - Unit 4", issue: "Pest control needed", description: "There are cockroaches and ants in the kitchen and bathroom areas.", status: "Open", date: "Mar 6, 2026", priority: "Low", messages: [] },
];

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
  const [complaints, setComplaints] = useState(initialComplaints);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const openChat = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    setChatOpen(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeComplaint) return;
    const msg: Message = {
      id: Date.now(),
      sender: "landlord",
      text: newMessage.trim(),
      time: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
    };
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === activeComplaint.id
          ? { ...c, messages: [...c.messages, msg] }
          : c
      )
    );
    setActiveComplaint((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
    setNewMessage("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Complaints</h1>
          <p className="text-muted-foreground font-body mt-1">View and manage tenant complaints</p>
        </div>

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
                    <p className="text-sm text-muted-foreground mt-1">{c.tenant} · {c.property}</p>
                    <p className="text-sm mt-2">{c.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Submitted: {c.date}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => openChat(c)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat
                      {c.messages.length > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                          {c.messages.length}
                        </Badge>
                      )}
                    </Button>
                    <Select defaultValue={c.status.toLowerCase().replace(" ", "-")}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
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
      </div>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Chat — {activeComplaint?.issue}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">{activeComplaint?.tenant} · {activeComplaint?.property}</p>
          </DialogHeader>
          <ScrollArea className="h-72 border rounded-lg p-3 bg-muted/30">
            {activeComplaint?.messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start the conversation.</p>
            )}
            <div className="space-y-3">
              {activeComplaint?.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "landlord" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      m.sender === "landlord"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sender === "landlord" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
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
