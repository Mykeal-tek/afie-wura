import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Palette, Bell, User, Shield } from "lucide-react";
import { toast } from "sonner";

const colorThemes = [
  { value: "default", label: "Ocean & Sand", primary: "20 90% 48%", accent: "47 100% 96%" },
  { value: "teal", label: "Teal Classic", primary: "178 82% 25%", accent: "42 60% 97%" },
  { value: "emerald", label: "Emerald Green", primary: "160 84% 39%", accent: "140 50% 95%" },
  { value: "royal", label: "Royal Blue", primary: "225 73% 57%", accent: "220 50% 95%" },
  { value: "ruby", label: "Ruby Red", primary: "0 72% 50%", accent: "0 50% 96%" },
];

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@afiewura.com", phone: "024 555 0000" });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const applyTheme = (themeValue: string) => {
    setSelectedTheme(themeValue);
    const theme = colorThemes.find((t) => t.value === themeValue);
    if (theme) {
      document.documentElement.style.setProperty("--primary", theme.primary);
      document.documentElement.style.setProperty("--accent", theme.accent);
      document.documentElement.style.setProperty("--ring", theme.primary);
    }
    toast.success(`Theme changed to ${theme?.label}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground font-body mt-1">Manage your preferences and account</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Palette className="h-5 w-5 text-primary" /> Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                  <div>
                    <Label className="text-sm font-medium">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-1 gap-2">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => applyTheme(theme.value)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                        selectedTheme === theme.value ? "border-primary bg-primary/5" : "border-input"
                      }`}
                    >
                      <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: `hsl(${theme.primary})` }}
                      />
                      <span className="text-sm font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <User className="h-5 w-5 text-primary" /> Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Full Name</Label>
                  <Input
                    id="settings-name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input
                    id="settings-email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-phone">Phone Number</Label>
                  <Input
                    id="settings-phone"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full">Save Profile</Button>
              </form>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </CardTitle>
              <CardDescription>Choose how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email" as const, label: "Email Notifications", desc: "Receive updates via email" },
                { key: "sms" as const, label: "SMS Notifications", desc: "Get text messages for urgent items" },
                { key: "push" as const, label: "Push Notifications", desc: "Browser push notifications" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(val) => setNotifications((n) => ({ ...n, [item.key]: val }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Shield className="h-5 w-5 text-primary" /> Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-pw">Current Password</Label>
                <Input id="current-pw" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pw">New Password</Label>
                <Input id="new-pw" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pw">Confirm New Password</Label>
                <Input id="confirm-pw" type="password" placeholder="••••••••" />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.success("Password updated successfully!")}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
