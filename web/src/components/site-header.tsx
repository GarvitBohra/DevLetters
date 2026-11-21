import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "./theme-toggle";

async function getHandle() {
  if (!isSupabaseConfigured) return { signedIn: false, handle: null as string | null };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, handle: null };
  const { data } = await supabase.from("profiles").select("handle").eq("id", user.id).maybeSingle();
  return { signedIn: true, handle: data?.handle ?? null };
}

const navLink = "text-[0.95rem] text-muted hover:text-text";

export async function SiteHeader() {
  const { signedIn, handle } = await getHandle();

  return (
    <header className="border-b border-border">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5">
        <Link href="/" aria-label="DevLetters home" className="font-serif text-3xl font-medium tracking-tight">
          Dev<span className="text-accent">Letters</span>
        </Link>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/" className={navLink}>Read</Link>
          <Link href="/news" className={navLink}>AI news</Link>
          <Link href="/chat" className={navLink}>AI chat</Link>
          <Link href="/about" className={navLink}>About</Link>
          {signedIn ? (
            <>
              {handle && <Link href={`/u/${handle}`} className={navLink}>Profile</Link>}
              <Link href="/settings" className={navLink}>Settings</Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className={navLink}>Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={navLink}>Log in</Link>
              <Link href="/signup" className="btn btn-primary !px-4 !py-1.5 !text-sm">Sign up</Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
