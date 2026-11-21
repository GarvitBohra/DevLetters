import type { Metadata } from "next";
import Link from "next/link";
import { Notice, SetupNotice } from "@/components/notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signup } from "../actions";

export const metadata: Metadata = { title: "Sign up" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-md py-16">
      <h1 className="mb-2 font-serif text-4xl font-medium tracking-tight">Create your account</h1>
      <p className="mb-6 text-muted">Pick a handle for your author page. You can change it later.</p>
      {!isSupabaseConfigured && <SetupNotice />}
      {error && <Notice kind="error">{error}</Notice>}

      <form action={signup} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Display name</span>
          <input name="display_name" maxLength={60} autoComplete="name" className="field-input" />
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
            autoCapitalize="none"
            className="field-input"
            placeholder="yourname"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
          <input name="email" type="email" autoComplete="email" required className="field-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Password</span>
          <input name="password" type="password" minLength={8} autoComplete="new-password" required className="field-input" />
          <span className="mt-1 block text-xs text-muted">At least 8 characters.</span>
        </label>
        <button type="submit" className="btn btn-primary w-full">Create account</button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account? <Link href="/login" className="text-accent underline">Log in</Link>
      </p>
    </section>
  );
}
