import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, BedDouble, Users, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { AddPropertyDialog } from "@/components/AddPropertyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Properties = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load properties");
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const defaultImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Properties</h1>
            <p className="text-muted-foreground font-body mt-1">Manage your rental properties</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Property
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No properties yet. Click "Add Property" to create your first one.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={property.images?.[0] || defaultImage}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90">{property.type}</Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-display font-semibold text-lg">{property.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {property.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <BedDouble className="h-4 w-4" /> {property.units} units
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" /> {property.occupied} occupied
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(property.features || []).map((f: string) => (
                      <Badge key={f} variant="secondary" className="text-xs font-normal">{f}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddPropertyDialog open={dialogOpen} onOpenChange={setDialogOpen} onPropertyAdded={fetchProperties} />
    </DashboardLayout>
  );
};

export default Properties;
