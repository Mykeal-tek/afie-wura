import { ArrowRight, Shield, CreditCard, Bell, Building2, Smartphone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import heroBuilding from "@/assets/hero-building.jpg";

const pillars = [
  { icon: Building2, title: "Manage Properties", desc: "Organize units, track occupancy, and keep photos and features in one view." },
  { icon: CreditCard, title: "Collect Payments", desc: "Record MoMo, card, bank, or cash payments with automated receipts." },
  { icon: Bell, title: "Stay Connected", desc: "Send notices, handle complaints, and keep everyone informed." },
  { icon: Shield, title: "Stay Compliant", desc: "Role-based access for admins, landlords, and tenants keeps data secure." },
  { icon: Smartphone, title: "Mobile Ready", desc: "Designed for quick actions on phone or desktop." },
  { icon: Users, title: "Scale Confidently", desc: "Built for multi-property landlords with clear accounting." },
];

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Afie Wura logo" className="h-12 w-12" />
            <span className="font-display text-2xl font-bold text-primary">Afie Wura</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
            <Button onClick={() => navigate("/role-select")} className="bg-primary hover:bg-primary/90">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={heroBuilding} alt="Apartments" className="w-full h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-primary-foreground">
              <p className="text-sm uppercase tracking-[0.2em] text-accent font-semibold">About Afie Wura</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 leading-tight">
                Everything you need to manage properties and keep tenants happy.
              </h1>
              <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 font-body">
                Purpose-built for Ghanaian landlords and tenants: MoMo-friendly payments, complaints tracking, notices, and clear accounting.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate("/role-select")}>
                  Start for Free
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Built for daily workflows</h2>
        <p className="text-center text-muted-foreground font-body mb-10 max-w-2xl mx-auto">
          Whether you manage one building or dozens, Afie Wura keeps rent collection, communications, and records tidy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div key={p.title} className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <p.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-muted-foreground font-body">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h3 className="text-3xl font-display font-bold mb-3">How it works</h3>
          <ol className="text-left space-y-4 font-body text-lg">
            <li>1. Pick a role (Landlord or Tenant) to tailor your dashboard.</li>
            <li>2. Landlords add properties, invite tenants, and set up payment tracking.</li>
            <li>3. Tenants pay rent, submit complaints, and receive notices in one place.</li>
            <li>4. Super Admins can manage subscriptions and integrations centrally.</li>
          </ol>
          <Button size="lg" variant="secondary" className="mt-8 text-base px-8" onClick={() => navigate("/role-select")}>
            Choose Your Role
          </Button>
        </div>
      </section>
    </div>
  );
}
