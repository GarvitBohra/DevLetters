// Top AI stories of the day, from the free Hacker News search API (no key needed).

export type NewsItem = {
  id: string;
  title: string;
  url: string; // the article
  discussion: string; // Hacker News thread
  points: number;
  comments: number;
  author: string;
  createdAt: string;
  host: string;
};

type Hit = {
  objectID: string;
  title?: string;
  url?: string | null;
  points?: number;
  num_comments?: number;
  author?: string;
  created_at?: string;
};

const QUERIES = ["AI", "LLM", "OpenAI", "Anthropic", "Gemini", "machine learning", "neural network"];

async function search(query: string, since: number): Promise<Hit[]> {
  const url =
    `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=30` +
    `&query=${encodeURIComponent(query)}&numericFilters=${encodeURIComponent(`created_at_i>${since},points>5`)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    return ((await res.json()).hits ?? []) as Hit[];
  } catch {
    return [];
  }
}

function toItem(h: Hit): NewsItem | null {
  if (!h.title) return null;
  const discussion = `https://news.ycombinator.com/item?id=${h.objectID}`;
  const link = h.url && /^https?:\/\//.test(h.url) ? h.url : discussion;
  let host = "news.ycombinator.com";
  try {
    host = new URL(link).hostname.replace(/^www\./, "");
  } catch {}
  return {
    id: h.objectID,
    title: h.title,
    url: link,
    discussion,
    points: h.points ?? 0,
    comments: h.num_comments ?? 0,
    author: h.author ?? "",
    createdAt: h.created_at ?? "",
    host,
  };
}

// AI-related words, so a loose search match (e.g. "AI" inside another word) is filtered out.
const AI_WORDS = /\b(ai|a\.i\.|llms?|gpt\S*|openai|anthropic|claude|gemini|deepmind|chatbots?|machine learning|neural|diffusion|copilot|agents?|mistral|llama|nvidia|transformers?|model|models)\b/i;

export async function getTopAiNews(limit = 10): Promise<{ items: NewsItem[]; windowHours: number }> {
  for (const hours of [24, 72]) {
    const since = Math.floor(Date.now() / 1000) - hours * 3600;
    const results = await Promise.all(QUERIES.map((q) => search(q, since)));
    const seen = new Map<string, NewsItem>();
    for (const h of results.flat()) {
      if (seen.has(h.objectID) || !h.title || !AI_WORDS.test(h.title)) continue;
      const item = toItem(h);
      if (item) seen.set(h.objectID, item);
    }
    const items = [...seen.values()].sort((a, b) => b.points - a.points).slice(0, limit);
    if (items.length >= limit || hours === 72) return { items, windowHours: hours };
  }
  return { items: [], windowHours: 72 };
}
