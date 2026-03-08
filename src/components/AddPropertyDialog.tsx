import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultPropertyTypes = [
  "Apartment Block", "Villa", "Townhouse", "Single Room", "Detached House", "Semi-Detached", "Compound House",
];

export function AddPropertyDialog({ open, onOpenChange }: Props) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [units, setUnits] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTypes = [...defaultPropertyTypes, ...customTypes];
  const filteredTypes = allTypes.filter((t) => t.toLowerCase().includes(typeSearch.toLowerCase()));
  const showAddCustom = typeSearch.length > 0 && !allTypes.some((t) => t.toLowerCase() === typeSearch.toLowerCase());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Property name is required";
    if (!location.trim()) errs.location = "Location is required";
    if (!typeValue) errs.type = "Property type is required";
    if (!units.trim()) errs.units = "Number of units is required";
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
    toast.success("Property added successfully!");
    handleClose(false);
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setTypeValue("");
      setTypeSearch("");
      setName("");
      setLocation("");
      setUnits("");
      setErrors({});
      setSubmitted(false);
    }
    onOpenChange(val);
  };

  const fieldError = (field: string) => submitted && errors[field] ? errors[field] : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Property</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Property Name <span className="text-destructive">*</span></Label>
            <Input id="name" placeholder="e.g. Adabraka Flats" value={name} onChange={(e) => setName(e.target.value)} className={fieldError("name") ? "border-destructive" : ""} />
            {fieldError("name") && <p className="text-xs text-destructive">{fieldError("name")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
            <Input id="location" placeholder="e.g. Adabraka, Accra" value={location} onChange={(e) => setLocation(e.target.value)} className={fieldError("location") ? "border-destructive" : ""} />
            {fieldError("location") && <p className="text-xs text-destructive">{fieldError("location")}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Type <span className="text-destructive">*</span></Label>
              <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={typeOpen} className={`w-full justify-between font-normal ${fieldError("type") ? "border-destructive" : ""}`}>
                    {typeValue || "Select or type..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search or add type..." value={typeSearch} onValueChange={setTypeSearch} />
                    <CommandList>
                      <CommandEmpty>{showAddCustom ? null : "No types found."}</CommandEmpty>
                      <CommandGroup>
                        {filteredTypes.map((t) => (
                          <CommandItem key={t} value={t} onSelect={() => { setTypeValue(t); setTypeOpen(false); setTypeSearch(""); }}>
                            {t}
                          </CommandItem>
                        ))}
                        {showAddCustom && (
                          <CommandItem value={typeSearch} onSelect={() => { const newType = typeSearch.trim(); setCustomTypes((prev) => [...prev, newType]); setTypeValue(newType); setTypeOpen(false); setTypeSearch(""); }}>
                            <span className="text-primary">+ Add "{typeSearch}"</span>
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {fieldError("type") && <p className="text-xs text-destructive">{fieldError("type")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="units">Number of Units <span className="text-destructive">*</span></Label>
              <Input id="units" type="number" placeholder="e.g. 10" value={units} onChange={(e) => setUnits(e.target.value)} className={fieldError("units") ? "border-destructive" : ""} />
              {fieldError("units") && <p className="text-xs text-destructive">{fieldError("units")}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Key Features</Label>
            <Input id="features" placeholder="e.g. Self Contain, Tiled Floor, Water Tank" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the property..." rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                  <img src={img.preview} alt={`Property ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-foreground/70 text-background rounded-full p-0.5 hover:bg-foreground/90">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-lg border-2 border-dashed border-input flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Add Photo</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
            <Button type="submit">Add Property</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
