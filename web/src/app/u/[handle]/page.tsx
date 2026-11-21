import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SetupNotice } from "@/components/notice";
import { HANDLE_RE } from "@/lib/auth-helpers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ handle: string }> };

async function getProfile(handle: string) {
  if (!isSupabaseConfigured || !HANDLE_RE.test(handle)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("handle, display_name, bio, created_at")
    .eq("handle", handle)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfile(handle);
  if (!profile) return {};
  return {
    title: profile.display_name || `@${profile.handle}`,
    description: profile.bio || `Articles by @${profile.handle} on Pagewise.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { handle } = await params;

  if (!isSupabaseConfigured) {
    return (
      <section className="py-16">
        <SetupNotice />
      </section>
    );
  }

  const profile = await getProfile(handle);
  if (!profile) notFound();

  const joined = new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" });

  return (
    <section className="pb-10 pt-16">
      <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-accent font-serif text-2xl text-accent-ink">
        {(profile.display_name || profile.handle).charAt(0).toUpperCase()}
      </div>
      <h1 className="font-serif text-4xl font-medium tracking-tight">{profile.display_name || `@${profile.handle}`}</h1>
      <p className="text-muted">@{profile.handle} · Joined {joined}</p>
      {profile.bio && <p className="mt-5 max-w-xl text-lg">{profile.bio}</p>}

      <div className="mt-10 border-t border-border pt-6">
        <h2 className="mb-2 text-sm uppercase tracking-widest text-muted">Articles</h2>
        <p className="text-muted">No articles yet. Publishing arrives in the next milestone.</p>
      </div>

      <Link href="/" className="mt-8 inline-block text-sm text-muted hover:text-text">← Back to posts</Link>
    </section>
  );
}
