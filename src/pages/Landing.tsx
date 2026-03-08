import { Building2, Shield, CreditCard, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Building2, title: "Property Management", desc: "Track all your properties, units, and tenants in one place" },
  { icon: CreditCard, title: "Easy Payments", desc: "Accept Mobile Money, bank cards, and cash — all tracked automatically" },
  { icon: Bell, title: "Notices & Complaints", desc: "Communicate with tenants seamlessly through notices and complaint tracking" },
  { icon: Shield, title: "Accounting", desc: "Full financial overview with inflow, outflow, and payment history" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">A</span>
            </div>
            <span className="font-display text-xl font-bold text-primary">Afie Wura</span>
          </div>
          <Button onClick={() => navigate("/role-select")} className="bg-primary hover:bg-primary/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="max-w-3xl mx-auto animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
            Property Management,{" "}
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            The all-in-one platform for landlords and tenants in Ghana. Manage properties, collect rent via MoMo, and stay connected — all from your phone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/role-select")} className="bg-primary hover:bg-primary/90 text-lg px-8">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary text-primary hover:bg-primary/5">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
          Everything You Need
        </h2>
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

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto font-body">
            Join landlords across Ghana who trust Afie Wura to manage their properties efficiently.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/role-select")} className="text-lg px-8">
            Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm font-body">
          © 2026 Afie Wura. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
