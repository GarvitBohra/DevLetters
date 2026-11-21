import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// The Gemini key stays on the server. It is never sent to the browser.
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

const SYSTEM_PROMPT = `You are the DevLetters AI assistant, a friendly and helpful general-purpose chat assistant.
Help with questions, writing, editing, brainstorming, explanations and coding. Be clear and concise.
You do not have live internet access, so say so if asked about very recent events. Do not invent facts; say when you are not sure.
Do not give medical, legal or financial advice as if you were a professional.`;

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

// Very small in-memory limiter (per server instance): 10 requests per minute per user.
const hits = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 10;
}

type ChatMessage = { role: "user" | "assistant"; text: string };

export async function POST(request: Request) {
  if (!apiKey) {
    return Response.json({ error: "The chatbot is not set up yet (missing GEMINI_API_KEY)." }, { status: 503 });
  }

  // Only signed-in users can use it, so strangers cannot burn through the API quota.
  if (!isSupabaseConfigured) {
    return Response.json({ error: "Accounts are not set up yet." }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Please log in to use the AI chat." }, { status: 401 });
  }
  if (limited(user.id)) {
    return Response.json({ error: "Too many messages. Wait a minute and try again." }, { status: 429 });
  }

  let messages: ChatMessage[];
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const cleaned = messages
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text.slice(0, MAX_CHARS) }] }));

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return Response.json({ error: "Type a message first." }, { status: 400 });
  }

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: cleaned,
  });

  // Retry once on a temporary overload (503).
  let res: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: payload,
        signal: AbortSignal.timeout(25_000),
      });
    } catch {
      res = null;
    }
    if (res && res.status !== 503) break;
    await new Promise((r) => setTimeout(r, 1500));
  }

  if (!res || !res.ok) {
    console.error("Gemini error", res?.status, res ? (await res.text()).slice(0, 500) : "no response");
    const busy = res?.status === 429 || res?.status === 503;
    return Response.json(
      { error: busy ? "The AI service is busy or out of quota. Try again in a minute." : "The assistant is unavailable right now. Try again later." },
      { status: 502 },
    );
  }

  const data = await res.json();
  const text: string = (data?.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();

  return Response.json({ text: text || "I could not come up with an answer. Try rephrasing." });
}
