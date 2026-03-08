import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const complaints = [
  { id: 1, tenant: "Kwame Asante", property: "Adabraka Flats - Unit 3", issue: "Water leakage in kitchen", description: "There is a persistent water leakage under the kitchen sink. The floor gets wet and slippery.", status: "Open", date: "Mar 7, 2026", priority: "High" },
  { id: 2, tenant: "Ama Serwaa", property: "East Legon Villa - Unit 1", issue: "Broken door lock", description: "The main door lock is broken and cannot be locked properly from outside.", status: "In Progress", date: "Mar 4, 2026", priority: "High" },
  { id: 3, tenant: "Yaw Mensah", property: "Adabraka Flats - Unit 7", issue: "Electricity fluctuation", description: "Power keeps going off and on. It is affecting my appliances.", status: "Resolved", date: "Feb 25, 2026", priority: "Medium" },
  { id: 4, tenant: "Kofi Darko", property: "Tema Community 25 - Unit 4", issue: "Pest control needed", description: "There are cockroaches and ants in the kitchen and bathroom areas.", status: "Open", date: "Mar 6, 2026", priority: "Low" },
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
                  <div className="shrink-0">
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
    </DashboardLayout>
  );
};

export default Complaints;
