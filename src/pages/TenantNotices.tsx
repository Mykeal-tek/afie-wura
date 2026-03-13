import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
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

const TenantNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });
      setNotices(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Notices & Announcements</h1>
          <p className="text-muted-foreground font-body mt-1">Updates from your landlord</p>
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
    </TenantLayout>
  );
};

export default TenantNotices;
