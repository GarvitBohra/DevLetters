import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// POST only, so a link or image on another site cannot sign you out.
export async function POST(request: NextRequest) {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  // 303 turns the POST into a GET on the home page.
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
