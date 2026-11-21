"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = ["Give me five blog post ideas about productivity", "Explain how the internet works, simply", "Help me improve this sentence"];

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const next: Message[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", text: res.ok ? data.text : data.error || "Something went wrong." }]);
    } catch {
      setMessages([...next, { role: "assistant", text: "Network error. Please try again." }]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <div>
      <div className="min-h-64 space-y-4 border border-border p-4" aria-live="polite">
        {messages.length === 0 && (
          <div>
            <p className="mb-3 text-muted">Ask me anything. Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)} className="btn btn-ghost text-sm">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={`inline-block max-w-full whitespace-pre-wrap px-4 py-2.5 text-left ${
                m.role === "user" ? "bg-accent text-accent-ink" : "border border-border"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {busy && <p className="text-muted">Thinking…</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={2000}
          placeholder="Type a message…"
          aria-label="Your message"
          className="field-input"
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
