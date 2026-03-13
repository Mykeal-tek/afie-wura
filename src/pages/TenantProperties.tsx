import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Users, Home, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const TenantProperties = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [otherProperties, setOtherProperties] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      // Get tenant's assigned property
      const { data: tenant } = await supabase
        .from("tenants")
        .select("property_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Get all viewable properties
      const { data: allProps } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (tenant?.property_id && allProps) {
        setCurrentProperty(allProps.find((p: any) => p.id === tenant.property_id) || null);
        setOtherProperties(allProps.filter((p: any) => p.id !== tenant.property_id));
      } else {
        setOtherProperties(allProps || []);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const defaultImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop";

  if (loading) {
    return <TenantLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></TenantLayout>;
  }

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Properties</h1>
          <p className="text-muted-foreground font-body mt-1">View your current property and available options</p>
        </div>

        {currentProperty && (
          <div>
            <h2 className="text-lg font-display font-semibold mb-3 flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" /> Your Current Property
            </h2>
            <Card className="border-2 border-primary/30 bg-primary/5">
              <div className="flex flex-col md:flex-row overflow-hidden">
                <div className="relative h-48 md:h-auto md:w-72 overflow-hidden">
                  <img src={currentProperty.images?.[0] || defaultImage} alt={currentProperty.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 left-3 bg-primary">Current</Badge>
                </div>
                <CardContent className="p-5 flex-1">
                  <h3 className="font-display font-semibold text-xl">{currentProperty.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {currentProperty.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm mt-3">
                    <span className="flex items-center gap-1 text-muted-foreground"><BedDouble className="h-4 w-4" /> {currentProperty.units} units</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" /> {currentProperty.occupied} occupied</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(currentProperty.features || []).map((f: string) => (
                      <Badge key={f} variant="secondary" className="text-xs font-normal">{f}</Badge>
                    ))}
                  </div>
                  <Badge className="mt-3">{currentProperty.type}</Badge>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {otherProperties.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-semibold mb-3">Other Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {otherProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-44 overflow-hidden">
                    <img src={property.images?.[0] || defaultImage} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <Badge className="absolute top-3 left-3 bg-primary/90">{property.type}</Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-display font-semibold text-lg">{property.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {property.location}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground"><BedDouble className="h-4 w-4" /> {property.units} units</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" /> {property.occupied} occupied</span>
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
          </div>
        )}

        {!currentProperty && otherProperties.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No properties available yet.</CardContent></Card>
        )}
      </div>
    </TenantLayout>
  );
};

export default TenantProperties;
