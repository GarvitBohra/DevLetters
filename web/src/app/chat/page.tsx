import type { Metadata } from "next";
import Link from "next/link";
import { AiChat } from "@/components/ai-chat";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "AI chat" };

export default async function ChatPage() {
  let signedIn = false;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    signedIn = !!user;
  }

  return (
    <section className="mx-auto max-w-2xl py-16">
      <h1 className="mb-2 font-serif text-4xl font-medium tracking-tight">AI chat</h1>
      <p className="mb-8 text-muted">Ask anything: get help with writing, editing, ideas, explanations or code. It has no live internet access, so it won&apos;t know very recent events.</p>
      {signedIn ? (
        <AiChat />
      ) : (
        <p>
          <Link href="/login?next=/chat" className="text-accent underline">Log in</Link> to use the AI chat.
        </p>
      )}
    </section>
  );
}
