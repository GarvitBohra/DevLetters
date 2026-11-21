"use server";

import { redirect } from "next/navigation";
import { getOrigin, HANDLE_RE, safeNext } from "@/lib/auth-helpers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function back(path: string, key: "error" | "message", text: string, next?: string): never {
  const q = new URLSearchParams({ [key]: text });
  if (next && next !== "/") q.set("next", next);
  redirect(`${path}?${q.toString()}`);
}

export async function login(formData: FormData) {
  const next = safeNext(formData.get("next"));
  if (!isSupabaseConfigured) back("/login", "error", "Login is not set up yet.", next);

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) back("/login", "error", "Enter your email and password.", next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) back("/login", "error", "Incorrect email or password.", next);

  redirect(next);
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured) back("/signup", "error", "Sign-up is not set up yet.");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const handle = String(formData.get("handle") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 60);

  if (!HANDLE_RE.test(handle)) {
    back("/signup", "error", "Handle must be 3-30 characters: lowercase letters, numbers or underscores.");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) back("/signup", "error", "Enter a valid email address.");
  if (password.length < 8) back("/signup", "error", "Password must be at least 8 characters.");

  const supabase = await createClient();

  // Friendly handle check (the database also enforces uniqueness).
  const { data: taken } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle();
  if (taken) back("/signup", "error", "That handle is already taken.");

  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { handle, display_name: displayName },
      emailRedirectTo: `${origin}/auth/callback?next=/settings`,
    },
  });
  if (error) back("/signup", "error", "Could not create the account. Try a different email or a stronger password.");

  // No session means email confirmation is required.
  if (!data.session) {
    back("/login", "message", "Check your email to confirm your account, then log in.");
  }
  redirect("/settings");
}

export async function updateProfile(formData: FormData) {
  if (!isSupabaseConfigured) back("/settings", "error", "Profiles are not set up yet.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");

  const handle = String(formData.get("handle") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!HANDLE_RE.test(handle)) back("/settings", "error", "Handle must be 3-30 characters: lowercase letters, numbers or underscores.");
  if (displayName.length > 60) back("/settings", "error", "Display name is limited to 60 characters.");
  if (bio.length > 300) back("/settings", "error", "Bio is limited to 300 characters.");

  const { error } = await supabase
    .from("profiles")
    .update({ handle, display_name: displayName, bio })
    .eq("id", user.id);

  if (error) {
    back("/settings", "error", error.code === "23505" ? "That handle is already taken." : "Could not save your profile.");
  }
  redirect("/settings?message=Profile%20saved.");
}
