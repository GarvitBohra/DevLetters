import type { Metadata } from "next";
import Link from "next/link";
import { Notice, SetupNotice } from "@/components/notice";
import { PasswordInput } from "@/components/password-input";
import { safeNext } from "@/lib/auth-helpers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { login } from "../actions";

export const metadata: Metadata = { title: "Log in" };

type Props = { searchParams: Promise<{ error?: string; message?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error, message, next } = await searchParams;

  // Dev-only convenience: prefill a test account from .env.local.
  // Never active in production builds, so no credentials reach real visitors.
  const isDev = process.env.NODE_ENV === "development";
  const devEmail = isDev ? process.env.DEV_LOGIN_EMAIL : undefined;
  const devPassword = isDev ? process.env.DEV_LOGIN_PASSWORD : undefined;

  return (
    <section className="mx-auto max-w-md py-16">
      <h1 className="mb-6 font-serif text-4xl font-medium tracking-tight">Log in</h1>
      {!isSupabaseConfigured && <SetupNotice />}
      {error && <Notice kind="error">{error}</Notice>}
      {message && <Notice kind="info">{message}</Notice>}

      <form action={login} className="space-y-4">
        <input type="hidden" name="next" value={safeNext(next)} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
          <input name="email" type="email" autoComplete="email" required defaultValue={devEmail} className="field-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Password</span>
          <PasswordInput name="password" autoComplete="current-password" defaultValue={devPassword} />
        </label>
        <button type="submit" className="btn btn-primary w-full">Log in</button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here? <Link href="/signup" className="text-accent underline">Create an account</Link>
      </p>
    </section>
  );
}
