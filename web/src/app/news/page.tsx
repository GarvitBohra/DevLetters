import type { Metadata } from "next";
import { getTopAiNews } from "@/lib/ai-news";

export const metadata: Metadata = {
  title: "AI news",
  description: "The top 10 AI stories of the day, picked from what developers are reading and discussing.",
};

// Rebuild at most every 30 minutes.
export const revalidate = 1800;

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours < 48 ? `${hours} h ago` : `${Math.round(hours / 24)} days ago`;
}

export default async function NewsPage() {
  const { items, windowHours } = await getTopAiNews(10);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <section className="mx-auto max-w-2xl py-16">
      <p className="mb-1 text-sm uppercase tracking-widest text-muted">{today}</p>
      <h1 className="mb-2 font-serif text-4xl font-medium tracking-tight">Top 10 AI news</h1>
      <p className="mb-8 text-muted">
        The most-discussed AI stories {windowHours === 24 ? "of the last 24 hours" : "of the last few days (a quiet day)"}, ranked by votes on Hacker News. Updated every 30 minutes.
      </p>

      {items.length === 0 ? (
        <p className="rounded-lg border border-border p-4 text-muted">Could not load the news right now. Please try again in a few minutes.</p>
      ) : (
        <ol className="divide-y divide-border border-y border-border">
          {items.map((item, i) => (
            <li key={item.id} className="flex gap-4 py-4">
              <span className="w-7 shrink-0 font-serif text-2xl text-accent">{i + 1}</span>
              <div className="min-w-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium leading-snug hover:text-accent">
                  {item.title}
                </a>
                <p className="mt-1 text-sm text-muted">
                  {item.host} · {item.points} points ·{" "}
                  <a href={item.discussion} target="_blank" rel="noopener noreferrer" className="underline hover:text-text">
                    {item.comments} comments
                  </a>{" "}
                  · {timeAgo(item.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
