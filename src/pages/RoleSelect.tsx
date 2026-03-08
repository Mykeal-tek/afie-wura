import { Building2, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const roles = [
  {
    id: "landlord",
    title: "I'm a Landlord",
    desc: "Manage properties, tenants, payments, and accounting",
    icon: Building2,
    path: "/login?role=landlord",
  },
  {
    id: "tenant",
    title: "I'm a Tenant",
    desc: "View rent, make payments, submit complaints, and get notices",
    icon: User,
    path: "/login?role=tenant",
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Button>

        <div className="text-center mb-10 animate-fade-in">
          <img src={logo} alt="Afie Wura" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold">Welcome to Afie Wura</h1>
          <p className="text-muted-foreground mt-2 font-body">How would you like to use the platform?</p>
        </div>

        <div className="grid gap-4">
          {roles.map((role, i) => (
            <Card
              key={role.id}
              onClick={() => navigate(role.path)}
              className="cursor-pointer border-2 hover:border-primary transition-all hover:shadow-lg animate-fade-in group"
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            >
              <CardContent className="p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <role.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display font-semibold text-lg">{role.title}</h2>
                  <p className="text-muted-foreground text-sm font-body mt-1">{role.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
