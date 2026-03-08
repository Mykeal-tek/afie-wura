import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { PasswordStrengthIndicator, isPasswordStrong } from "@/components/PasswordStrengthIndicator";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "landlord";
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.password) errs.password = "Password is required";
    else if (!isPasswordStrong(form.password)) errs.password = "Password does not meet requirements";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: form.fullName, phone: form.phone },
      },
    });
    
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (data.user) {
      // Insert role
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: role as "landlord" | "tenant" });
      // Insert profile
      await supabase.from("profiles").insert({
        user_id: data.user.id,
        full_name: form.fullName,
        phone: form.phone,
        email: form.email,
      });
    }

    setLoading(false);
    toast.success("Account created! Check your email to verify.");
    navigate(role === "tenant" ? "/tenant" : "/dashboard");
  };

  const handleGoogleSignup = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Google sign-up failed");
  };

  const handleAppleSignup = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Apple sign-up failed");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => navigate(`/login?role=${role}`)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
        </Button>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <img src={logo} alt="Afie Wura" className="h-14 w-14 mx-auto mb-2" />
            <CardTitle className="font-display text-2xl">
              {role === "tenant" ? "Tenant Sign Up" : "Landlord Sign Up"}
            </CardTitle>
            <CardDescription className="font-body">Create your Afie Wura account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                <Input id="fullName" placeholder="Kwame Asante" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={errors.fullName ? "border-destructive" : ""} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="phone" type="tel" placeholder="024 XXX XXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={errors.phone ? "border-destructive" : ""} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input id="password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} className={errors.password ? "border-destructive" : ""} />
                <PasswordStrengthIndicator password={form.password} />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className={errors.confirmPassword ? "border-destructive" : ""} />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Account
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full" onClick={handleAppleSignup}>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Continue with Apple
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6 font-body">
              Already have an account?{" "}
              <Link to={`/login?role=${role}`} className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
