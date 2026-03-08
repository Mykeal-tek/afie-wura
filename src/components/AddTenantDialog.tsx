import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTenantDialog({ open, onOpenChange }: Props) {
  const [baseRent, setBaseRent] = useState("");
  const [duration, setDuration] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [property, setProperty] = useState("");
  const [unit, setUnit] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const rentDue = useMemo(() => {
    const rent = parseFloat(baseRent) || 0;
    const months = parseInt(duration) || 0;
    return rent * months;
  }, [baseRent, duration]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    if (!email.trim()) errs.email = "Email is required";
    if (!property) errs.property = "Please select a property";
    if (!unit.trim()) errs.unit = "Unit is required";
    if (!baseRent.trim()) errs.baseRent = "Base rent is required";
    if (!duration.trim()) errs.duration = "Duration is required";
    if (!moveIn) errs.moveIn = "Move-in date is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Tenant added successfully!");
    handleClose(false);
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setBaseRent(""); setDuration(""); setName(""); setPhone(""); setEmail("");
      setProperty(""); setUnit(""); setMoveIn(""); setErrors({}); setSubmitted(false);
    }
    onOpenChange(val);
  };

  const fieldError = (field: string) => submitted && errors[field] ? errors[field] : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Tenant</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Kwame Asante" value={name} onChange={(e) => setName(e.target.value)} className={fieldError("name") ? "border-destructive" : ""} />
              {fieldError("name") && <p className="text-xs text-destructive">{fieldError("name")}</p>}
            </div>
            <div className="space-y-2">
              <Label>Phone Number <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. 024 555 1234" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldError("phone") ? "border-destructive" : ""} />
              {fieldError("phone") && <p className="text-xs text-destructive">{fieldError("phone")}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email <span className="text-destructive">*</span></Label>
            <Input type="email" placeholder="e.g. kwame@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldError("email") ? "border-destructive" : ""} />
            {fieldError("email") && <p className="text-xs text-destructive">{fieldError("email")}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property <span className="text-destructive">*</span></Label>
              <Select value={property} onValueChange={setProperty}>
                <SelectTrigger className={fieldError("property") ? "border-destructive" : ""}><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="adabraka">Adabraka Flats</SelectItem>
                  <SelectItem value="eastlegon">East Legon Villa</SelectItem>
                  <SelectItem value="osu">Osu Apartments</SelectItem>
                  <SelectItem value="tema">Tema Community 25</SelectItem>
                </SelectContent>
              </Select>
              {fieldError("property") && <p className="text-xs text-destructive">{fieldError("property")}</p>}
            </div>
            <div className="space-y-2">
              <Label>Unit <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Unit 3" value={unit} onChange={(e) => setUnit(e.target.value)} className={fieldError("unit") ? "border-destructive" : ""} />
              {fieldError("unit") && <p className="text-xs text-destructive">{fieldError("unit")}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Base Rent (GH₵) <span className="text-destructive">*</span></Label>
              <Input type="number" placeholder="e.g. 1000" value={baseRent} onChange={(e) => setBaseRent(e.target.value)} className={fieldError("baseRent") ? "border-destructive" : ""} />
              {fieldError("baseRent") && <p className="text-xs text-destructive">{fieldError("baseRent")}</p>}
            </div>
            <div className="space-y-2">
              <Label>Duration (Months) <span className="text-destructive">*</span></Label>
              <Input type="number" placeholder="e.g. 6" value={duration} onChange={(e) => setDuration(e.target.value)} className={fieldError("duration") ? "border-destructive" : ""} />
              {fieldError("duration") && <p className="text-xs text-destructive">{fieldError("duration")}</p>}
            </div>
            <div className="space-y-2">
              <Label>Rent Due (GH₵)</Label>
              <div className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-semibold flex items-center">
                {rentDue > 0 ? `GH₵ ${rentDue.toLocaleString()}` : "—"}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Move-in Date <span className="text-destructive">*</span></Label>
            <Input type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} className={fieldError("moveIn") ? "border-destructive" : ""} />
            {fieldError("moveIn") && <p className="text-xs text-destructive">{fieldError("moveIn")}</p>}
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
