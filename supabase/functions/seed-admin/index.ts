import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const adminEmail = "super@admin.com";
    const adminPassword = "Superadmin1!";

    // Check if admin already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u: any) => u.email === adminEmail);

    if (existing) {
      // Check if role exists
      const { data: roleExists } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", existing.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleExists) {
        await supabase.from("user_roles").insert({ user_id: existing.id, role: "admin" });
      }

      return new Response(
        JSON.stringify({ success: true, message: "Admin already exists", email: adminEmail }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: "Super Admin" },
    });

    if (createError) throw createError;

    // Assign admin role
    await supabase.from("user_roles").insert({ user_id: newUser.user.id, role: "admin" });

    // Create profile
    await supabase.from("profiles").insert({
      user_id: newUser.user.id,
      full_name: "Super Admin",
      email: adminEmail,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Admin created", email: adminEmail }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
