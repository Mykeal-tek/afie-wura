import { Building2, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-display font-bold text-2xl">A</span>
          </div>
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
