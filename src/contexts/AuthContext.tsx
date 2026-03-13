import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: "landlord" | "tenant" | "admin" | null;
  loading: boolean;
  roleLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  roleLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<"landlord" | "tenant" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  const fetchRole = async (userId: string): Promise<"landlord" | "tenant" | "admin" | null> => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    const r = (data?.role as "landlord" | "tenant" | "admin" | null) ?? null;
    setRole(r);
    setRoleLoading(false);
    return r;
  };

  const assignPendingRole = async (userId: string, userMeta: any) => {
    const pendingRole = localStorage.getItem("pending_role") as "landlord" | "tenant" | null;
    if (!pendingRole) return;
    localStorage.removeItem("pending_role");

    // Insert role
    await supabase.from("user_roles").insert({ user_id: userId, role: pendingRole });

    // Insert profile if not exists
    const fullName = userMeta?.full_name || userMeta?.name || "";
    const email = userMeta?.email || "";
    await supabase.from("profiles").upsert(
      { user_id: userId, full_name: fullName, email },
      { onConflict: "user_id" }
    );

    setRole(pendingRole);
    setRoleLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setRoleLoading(true);
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            const existingRole = await fetchRole(session.user.id);
            if (!existingRole) {
              await assignPendingRole(session.user.id, session.user.user_metadata);
            }
          }, 0);
        } else {
          setRole(null);
          setRoleLoading(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const existingRole = await fetchRole(session.user.id);
        if (!existingRole) {
          await assignPendingRole(session.user.id, session.user.user_metadata);
        }
      } else {
        setRoleLoading(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, roleLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
