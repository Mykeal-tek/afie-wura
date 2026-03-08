import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, BedDouble, Users, Home, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Property {
  id: number;
  name: string;
  location: string;
  units: number;
  occupied: number;
  type: string;
  image: string;
  features: string[];
  isCurrent?: boolean;
}

const mockProperties: Property[] = [
  {
    id: 1, name: "Adabraka Flats", location: "Adabraka, Accra",
    units: 10, occupied: 8, type: "Apartment Block",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
    features: ["Self Contain", "Tiled Floor", "Water Tank"],
    isCurrent: true,
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

const TenantProperties = () => {
  const [requestOpen, setRequestOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleRequest = (property: Property) => {
    setSelectedProperty(property);
    setRequestOpen(true);
  };

  const submitRequest = () => {
    toast.success(`Request to move to ${selectedProperty?.name} submitted! Your landlord will review it.`);
    setRequestOpen(false);
    setSelectedProperty(null);
  };

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Properties</h1>
          <p className="text-muted-foreground font-body mt-1">View your current property and available options</p>
        </div>

        {/* Current Property */}
        <div>
          <h2 className="text-lg font-display font-semibold mb-3 flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" /> Your Current Property
          </h2>
          {mockProperties.filter(p => p.isCurrent).map((property) => (
            <Card key={property.id} className="border-2 border-primary/30 bg-primary/5">
              <div className="flex flex-col md:flex-row overflow-hidden">
                <div className="relative h-48 md:h-auto md:w-72 overflow-hidden">
                  <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 left-3 bg-primary">Current</Badge>
                </div>
                <CardContent className="p-5 flex-1">
                  <h3 className="font-display font-semibold text-xl">{property.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {property.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm mt-3">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <BedDouble className="h-4 w-4" /> {property.units} units
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" /> {property.occupied} occupied
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {property.features.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs font-normal">{f}</Badge>
                    ))}
                  </div>
                  <Badge className="mt-3">{property.type}</Badge>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Available Properties */}
        <div>
          <h2 className="text-lg font-display font-semibold mb-3 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" /> Available Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {mockProperties.filter(p => !p.isCurrent).map((property) => (
              <Card key={property.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <Badge className="absolute top-3 left-3 bg-primary/90">{property.type}</Badge>
                  {property.occupied < property.units && (
                    <Badge className="absolute top-3 right-3 bg-success">{property.units - property.occupied} Available</Badge>
                  )}
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
                      <Badge key={f} variant="secondary" className="text-xs font-normal">{f}</Badge>
                    ))}
                  </div>
                  {property.occupied < property.units && (
                    <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/5" onClick={() => handleRequest(property)}>
                      <ArrowRightLeft className="h-4 w-4 mr-2" /> Request to Move
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Request Property Change</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You are requesting to move from <strong>Adabraka Flats - Unit 3</strong> to <strong>{selectedProperty?.name}</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              Your landlord will review this request and get back to you.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRequestOpen(false)}>Cancel</Button>
              <Button onClick={submitRequest}>Submit Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TenantLayout>
  );
};

export default TenantProperties;
