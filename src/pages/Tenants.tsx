import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { AddTenantDialog } from "@/components/AddTenantDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockTenants = [
  { id: 1, name: "Kwame Asante", phone: "024 555 1234", email: "kwame@email.com", property: "Adabraka Flats", unit: "Unit 3", rent: "GH₵ 1,200/mo", status: "Paid", moveIn: "Jan 2025" },
  { id: 2, name: "Ama Serwaa", phone: "020 333 9876", email: "ama@email.com", property: "East Legon Villa", unit: "Unit 1", rent: "GH₵ 3,500/mo", status: "Paid", moveIn: "Mar 2024" },
  { id: 3, name: "Yaw Mensah", phone: "027 111 4567", email: "yaw@email.com", property: "Adabraka Flats", unit: "Unit 7", rent: "GH₵ 1,200/mo", status: "Overdue", moveIn: "Jun 2025" },
  { id: 4, name: "Abena Owusu", phone: "054 222 8901", email: "abena@email.com", property: "Osu Apartments", unit: "Unit 2", rent: "GH₵ 2,000/mo", status: "Paid", moveIn: "Sep 2024" },
  { id: 5, name: "Kofi Darko", phone: "026 777 3456", email: "kofi@email.com", property: "Tema Community 25", unit: "Unit 4", rent: "GH₵ 1,800/mo", status: "Pending", moveIn: "Nov 2025" },
];

const statusColor: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
  Pending: "bg-primary/10 text-primary border-primary/20",
};

const Tenants = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Tenants</h1>
            <p className="text-muted-foreground font-body mt-1">Manage your tenants</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Tenant
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-display font-semibold">
                      {tenant.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{tenant.name}</h3>
                      <Badge variant="outline" className={statusColor[tenant.status]}>{tenant.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tenant.property} · {tenant.unit}</p>
                    <p className="text-sm font-semibold text-primary mt-1">{tenant.rent}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{tenant.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{tenant.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Move-in: {tenant.moveIn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AddTenantDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  );
};

export default Tenants;
