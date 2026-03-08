import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTenantDialog({ open, onOpenChange }: Props) {
  const [baseRent, setBaseRent] = useState("");
  const [duration, setDuration] = useState("");

  const rentDue = useMemo(() => {
    const rent = parseFloat(baseRent) || 0;
    const months = parseInt(duration) || 0;
    return rent * months;
  }, [baseRent, duration]);

  const handleClose = (val: boolean) => {
    if (!val) {
      setBaseRent("");
      setDuration("");
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Tenant</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleClose(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="e.g. Kwame Asante" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="e.g. 024 555 1234" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="e.g. kwame@email.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="adabraka">Adabraka Flats</SelectItem>
                  <SelectItem value="eastlegon">East Legon Villa</SelectItem>
                  <SelectItem value="osu">Osu Apartments</SelectItem>
                  <SelectItem value="tema">Tema Community 25</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input placeholder="e.g. Unit 3" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Base Rent (GH₵)</Label>
              <Input
                type="number"
                placeholder="e.g. 1000"
                value={baseRent}
                onChange={(e) => setBaseRent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (Months)</Label>
              <Input
                type="number"
                placeholder="e.g. 6"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rent Due (GH₵)</Label>
              <div className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-semibold flex items-center">
                {rentDue > 0 ? `GH₵ ${rentDue.toLocaleString()}` : "—"}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Move-in Date</Label>
            <Input type="date" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
            <Button type="submit">Add Tenant</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
