import { TenantLayout } from "@/components/TenantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Palette, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

const colorThemes = [
  { name: "Ocean & Sand", primary: "174 62% 47%", accent: "36 80% 50%" },
  { name: "Teal Classic", primary: "170 55% 40%", accent: "45 85% 55%" },
  { name: "Emerald Green", primary: "152 55% 40%", accent: "38 80% 50%" },
  { name: "Royal Blue", primary: "220 65% 50%", accent: "200 60% 55%" },
  { name: "Ruby Red", primary: "0 65% 50%", accent: "15 80% 55%" },
];

const TenantSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState("Ocean & Sand");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const applyTheme = (theme: typeof colorThemes[0]) => {
    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--ring", theme.primary);
    setActiveTheme(theme.name);
    toast.success(`Theme changed to ${theme.name}`);
  };

  return (
    <TenantLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground font-body mt-1">Customize your experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Dark Mode</Label>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" /> Color Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colorThemes.map((theme) => (
                <Button
                  key={theme.name}
                  variant={activeTheme === theme.name ? "default" : "outline"}
                  className="h-auto py-3 flex-col gap-1"
                  onClick={() => applyTheme(theme)}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${theme.primary})` }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${theme.accent})` }} />
                  </div>
                  <span className="text-xs">{theme.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  );
};

export default TenantSettings;
