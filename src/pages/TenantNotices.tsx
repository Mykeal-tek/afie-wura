import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, AlertTriangle, Info } from "lucide-react";

const mockNotices = [
  { id: 1, title: "Water Supply Maintenance", type: "Announcement", message: "There will be a scheduled water maintenance on March 15th from 8am to 4pm. Please store water accordingly.", date: "Mar 8, 2026", property: "All Properties" },
  { id: 2, title: "Rent Due Reminder", type: "Notice", message: "This is a reminder that rent for March 2026 is due by March 10th. Please make payment on time.", date: "Mar 5, 2026", property: "Adabraka Flats" },
  { id: 3, title: "Security Alert", type: "Alert", message: "There have been reports of suspicious activity in the area. Please ensure all doors and windows are properly locked at night.", date: "Mar 2, 2026", property: "East Legon Villa" },
  { id: 4, title: "Community Meeting", type: "Announcement", message: "All tenants meeting on Mar 20 at 6 PM in the courtyard.", date: "Feb 25, 2026", property: "All Properties" },
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

const TenantNotices = () => {
  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Notices & Announcements</h1>
          <p className="text-muted-foreground font-body mt-1">Updates from your landlord</p>
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
    </TenantLayout>
  );
};

export default TenantNotices;
