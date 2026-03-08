import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface Props {
  password: string;
}

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character (!@#$...)", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function PasswordStrengthIndicator({ password }: Props) {
  const results = useMemo(() => rules.map((r) => ({ ...r, passed: r.test(password) })), [password]);
  const passedCount = results.filter((r) => r.passed).length;
  const strength = passedCount <= 1 ? "Weak" : passedCount <= 3 ? "Fair" : passedCount <= 4 ? "Good" : "Strong";
  const strengthColor =
    passedCount <= 1 ? "bg-destructive" : passedCount <= 3 ? "bg-gold" : passedCount <= 4 ? "bg-teal-light" : "bg-success";

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${strengthColor}`}
            style={{ width: `${(passedCount / rules.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{strength}</span>
      </div>
      <ul className="space-y-1">
        {results.map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-xs">
            {r.passed ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <X className="h-3 w-3 text-destructive" />
            )}
            <span className={r.passed ? "text-muted-foreground" : "text-destructive"}>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function isPasswordStrong(password: string): boolean {
  return rules.every((r) => r.test(password));
}
