// Temporary sample articles. Replaced by database posts in weeks 3-5.

export type Block = { type: "h2" | "p" | "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  excerpt: string;
  body: Block[];
};

export const samplePosts: Post[] = [
  {
    slug: "welcome",
    title: "Welcome to Pagewise",
    date: "2026-11-21",
    tags: ["meta"],
    excerpt: "Why this blog exists, who it is for, and what you can expect to read here.",
    body: [
      { type: "p", text: "Pagewise is a quiet place to read and write. No feeds built to keep you scrolling, no noise, just good writing." },
      { type: "h2", text: "Why this exists" },
      { type: "p", text: "Most blogging platforms are crowded. This one is small on purpose, so writers can publish without distraction and readers can find work worth their time." },
      { type: "quote", text: "Good writing is mostly rewriting." },
    ],
  },
  {
    slug: "small-habits",
    title: "Small habits that make writing easier",
    date: "2026-11-18",
    tags: ["writing", "habits"],
    excerpt: "You don't need a perfect idea to start. You need a small, regular habit.",
    body: [
      { type: "p", text: "You don't need a perfect idea to begin. You need a small, regular habit." },
      { type: "h2", text: "Write badly first" },
      { type: "p", text: "The first draft only has to exist. Editing is where it gets good. You cannot improve a blank page." },
      { type: "h2", text: "Pick a fixed time" },
      { type: "p", text: "Ten minutes at the same time each day beats a three-hour session once a month." },
    ],
  },
  {
    slug: "edit-like-a-reader",
    title: "How to edit your own writing like a reader",
    date: "2026-11-15",
    tags: ["writing", "editing"],
    excerpt: "A simple three-pass method for turning a rough draft into something people finish reading.",
    body: [
      { type: "p", text: "Writing and editing are different jobs. When you edit, you are the first reader, and you are impatient." },
      { type: "h2", text: "Pass one: the big picture" },
      { type: "p", text: "Read the whole draft without fixing anything. What is this piece trying to say, in one sentence? Cut anything that doesn't help say it." },
      { type: "h2", text: "Pass two: the sentences" },
      { type: "p", text: "Replace vague words with specific ones, delete filler, and read it aloud. Fix every place you stumble." },
      { type: "h2", text: "Pass three: the details" },
      { type: "p", text: "Last, check spelling, names, numbers and links." },
    ],
  },
];

export function getPost(slug: string) {
  return samplePosts.find((p) => p.slug === slug);
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
