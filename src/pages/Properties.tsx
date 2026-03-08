import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, BedDouble, Users } from "lucide-react";
import { useState } from "react";
import { AddPropertyDialog } from "@/components/AddPropertyDialog";

interface Property {
  id: number;
  name: string;
  location: string;
  units: number;
  occupied: number;
  type: string;
  image: string;
  features: string[];
}

const mockProperties: Property[] = [
  {
    id: 1, name: "Adabraka Flats", location: "Adabraka, Accra",
    units: 10, occupied: 8, type: "Apartment Block",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
    features: ["Self Contain", "Tiled Floor", "Water Tank"],
  },
  {
    id: 2, name: "East Legon Villa", location: "East Legon, Accra",
    units: 4, occupied: 3, type: "Villa",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
    features: ["3 Bedroom", "Swimming Pool", "Garage", "Garden"],
  },
  {
    id: 3, name: "Osu Apartments", location: "Osu, Accra",
    units: 6, occupied: 6, type: "Apartment Block",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
    features: ["Single Room", "Shared Kitchen", "Gated"],
  },
  {
    id: 4, name: "Tema Community 25", location: "Tema, Greater Accra",
    units: 8, occupied: 5, type: "Townhouse",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=250&fit=crop",
    features: ["2 Bedroom", "Self Contain", "Parking"],
  },
];

const Properties = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mockProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={property.image}
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
                  {property.features.map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs font-normal">
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AddPropertyDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  );
};

export default Properties;
