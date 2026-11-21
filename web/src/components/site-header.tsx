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

export async function SiteHeader() {
  const { signedIn, handle } = await getHandle();

  return (
    <header className="border-b border-border">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-serif text-lg font-semibold sm:gap-2.5 sm:text-xl" aria-label="DevLetters home">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-base text-accent-ink">D</span>
          DevLetters
        </Link>

        <nav aria-label="Main" className="flex items-center gap-3 text-sm sm:gap-5">
          <Link href="/" className="hidden text-muted hover:text-text sm:inline">Read</Link>
          <Link href="/chat" className="hidden text-muted hover:text-text sm:inline">AI chat</Link>
          <Link href="/about" className="hidden text-muted hover:text-text sm:inline">About</Link>
          {signedIn ? (
            <>
              {handle && (
                <Link href={`/u/${handle}`} className="hidden text-muted hover:text-text sm:inline">Profile</Link>
              )}
              <Link href="/settings" className="text-muted hover:text-text">Settings</Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-muted hover:text-text">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-text">Log in</Link>
              <Link href="/signup" className="btn btn-primary !px-4 !py-1.5 !text-sm">Sign up</Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
