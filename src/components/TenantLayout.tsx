import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TenantSidebar } from "@/components/TenantSidebar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TenantSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b px-4 bg-card shrink-0">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
            <Badge variant="outline" className="gap-1.5 border-accent/30 bg-accent/5 text-accent-foreground font-medium">
              <User className="h-3.5 w-3.5" />
              Tenant
            </Badge>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}