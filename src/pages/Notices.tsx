import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockNotices = [
  { id: 1, title: "Water Supply Maintenance", type: "Announcement", message: "There will be a scheduled water maintenance on March 15th from 8am to 4pm. Please store water accordingly.", date: "Mar 8, 2026", property: "All Properties" },
  { id: 2, title: "Rent Due Reminder", type: "Notice", message: "This is a reminder that rent for March 2026 is due by March 10th. Please make payment on time.", date: "Mar 5, 2026", property: "Adabraka Flats" },
  { id: 3, title: "Security Alert", type: "Alert", message: "There have been reports of suspicious activity in the area. Please ensure all doors and windows are properly locked at night.", date: "Mar 2, 2026", property: "East Legon Villa" },
];

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
  const [dialogOpen, setDialogOpen] = useState(false);

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

        <div className="space-y-4">
          {mockNotices.map((notice) => {
            const Icon = typeIcon[notice.type];
            return (
              <Card key={notice.id}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColor[notice.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{notice.title}</h3>
                        <Badge className={typeColor[notice.type]}>{notice.type}</Badge>
                      </div>
                      <p className="text-sm mt-1">{notice.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notice.property} · {notice.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">New Notice</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. Rent Due Reminder" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="notice">Notice</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="adabraka">Adabraka Flats</SelectItem>
                    <SelectItem value="eastlegon">East Legon Villa</SelectItem>
                    <SelectItem value="osu">Osu Apartments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Write your notice here..." rows={4} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Send Notice</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Notices;
