import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Notice, SetupNotice } from "@/components/notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "../(auth)/actions";

export const metadata: Metadata = { title: "Settings" };

type Props = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const { error, message } = await searchParams;

  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto max-w-md py-16">
        <h1 className="mb-6 font-serif text-4xl font-medium tracking-tight">Settings</h1>
        <SetupNotice />
      </section>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle, display_name, bio")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <section className="mx-auto max-w-md py-16">
      <h1 className="mb-2 font-serif text-4xl font-medium tracking-tight">Your profile</h1>
      <p className="mb-6 text-sm text-muted">Signed in as {user.email}</p>
      {error && <Notice kind="error">{error}</Notice>}
      {message && <Notice kind="info">{message}</Notice>}

      <form action={updateProfile} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Display name</span>
          <input name="display_name" maxLength={60} defaultValue={profile?.display_name ?? ""} className="field-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Handle</span>
          <input
            name="handle"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9_]{3,30}"
            title="3-30 characters: lowercase letters, numbers or underscores"
            defaultValue={profile?.handle ?? ""}
            className="field-input"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Bio</span>
          <textarea name="bio" maxLength={300} rows={4} defaultValue={profile?.bio ?? ""} className="field-input" />
          <span className="mt-1 block text-xs text-muted">Up to 300 characters.</span>
        </label>
        <button type="submit" className="btn btn-primary">Save profile</button>
      </form>
    </section>
  );
}
