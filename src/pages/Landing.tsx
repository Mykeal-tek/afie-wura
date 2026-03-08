import { Building2, Shield, CreditCard, Bell, ArrowRight, Smartphone, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import heroBuilding from "@/assets/hero-building.jpg";
import tenantHappy from "@/assets/tenant-happy.jpg";
import mobilePayment from "@/assets/mobile-payment.jpg";

const features = [
  { icon: Building2, title: "Property Management", desc: "Track all your properties, units, and tenants in one place" },
  { icon: CreditCard, title: "Easy Payments", desc: "Accept Mobile Money, bank cards, and cash — all tracked automatically" },
  { icon: Bell, title: "Notices & Complaints", desc: "Communicate with tenants seamlessly through notices and complaint tracking" },
  { icon: Shield, title: "Accounting", desc: "Full financial overview with inflow, outflow, and payment history" },
];

const stats = [
  { value: "500+", label: "Properties Managed" },
  { value: "2,000+", label: "Happy Tenants" },
  { value: "GH₵ 5M+", label: "Rent Collected" },
  { value: "98%", label: "On-time Payments" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Afie Wura logo" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-primary">Afie Wura</span>
          </div>
          <Button onClick={() => navigate("/role-select")} className="bg-primary hover:bg-primary/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero with image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBuilding} alt="Modern apartment building in Ghana" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-40">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight text-primary-foreground">
              Property Management,{" "}
              <span className="text-accent">Made Simple</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 font-body">
              The all-in-one platform for landlords and tenants in Ghana. Manage properties, collect rent via MoMo, and stay connected — all from your phone.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/role-select")} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-display font-bold">{s.value}</p>
                <p className="text-sm opacity-80 mt-1 font-body">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          Everything You Need
        </h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
          From rent collection to complaint management, Afie Wura handles it all.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm font-body">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Landlord section with image */}
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                For <span className="text-primary">Landlords</span>
              </h2>
              <p className="text-muted-foreground font-body mb-6">
                Manage your properties, track payments, and communicate with tenants — all from one dashboard.
              </p>
              <ul className="space-y-3">
                {["Add and manage multiple properties", "Track rent payments (MoMo, Card, Cash)", "Send notices and announcements", "View detailed accounting reports"].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-body">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 bg-primary hover:bg-primary/90" onClick={() => navigate("/role-select")}>
                Start as Landlord <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
              <img src={tenantHappy} alt="Landlord handing keys to happy tenants" className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Tenant section with image */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <img src={mobilePayment} alt="Mobile money payment on smartphone" className="w-full h-80 object-cover" />
            </div>
            <div className="order-1 lg:order-2 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                For <span className="text-accent">Tenants</span>
              </h2>
              <p className="text-muted-foreground font-body mb-6">
                Pay rent, submit complaints, and stay informed — right from your phone.
              </p>
              <ul className="space-y-3">
                {["Pay rent via Mobile Money or bank card", "Submit and track maintenance complaints", "Receive notices and announcements", "View your complete payment history"].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-body">
                    <ChevronRight className="h-4 w-4 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => navigate("/role-select")}>
                Start as Tenant <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Afie Wura" className="h-20 w-20 mx-auto mb-6 brightness-200" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto font-body">
            Join landlords and tenants across Ghana who trust Afie Wura to manage their properties efficiently.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/role-select")} className="text-lg px-8">
            Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Afie Wura" className="h-8 w-8" />
            <span className="font-display font-bold text-primary">Afie Wura</span>
          </div>
          <p className="text-muted-foreground text-sm font-body">
            © 2026 Afie Wura. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
