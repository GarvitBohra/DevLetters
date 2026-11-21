import Link from "next/link";
import { Plate, TECH_VARIANTS } from "@/components/plate";
import { getTopAiNews } from "@/lib/ai-news";
import { formatDate, samplePosts } from "@/lib/sample-posts";

export default async function Home() {
  const { items: briefing } = await getTopAiNews(5);

  return (
    <>
      <section className="pb-10 pt-14">
        <h1 className="mb-4 font-serif text-5xl font-medium leading-[1.08] tracking-tight text-balance sm:text-6xl">
          A quiet place to <em className="text-accent">read</em> and write.
        </h1>
        <p className="mb-7 max-w-xl text-xl text-muted">
          Short, considered pieces on writing, technology and clear thinking. No noise, no feed to scroll.
        </p>
        <Link href="/signup" className="btn btn-primary">Start writing</Link>
      </section>

      <div className="border-b border-border pb-2.5 text-muted">
        <span className="label">Latest stories</span>
      </div>

      {samplePosts.map((post, i) => (
        <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex gap-5 border-b border-border py-7">
          <Plate
            variant={i === 0 ? "chip" : TECH_VARIANTS[(i * 2 + 2) % TECH_VARIANTS.length]}
            seed={7 + i * 13}
            className="h-28 w-24 shrink-0 sm:h-32 sm:w-28"
          />
          <div className="min-w-0">
            <p className="text-sm text-muted">
              {formatDate(post.date)} · {post.tags.map((t) => `#${t}`).join(" ")}
            </p>
            <h2 className="my-1 font-serif text-2xl font-medium leading-tight group-hover:text-accent sm:text-3xl">
              {post.title}
            </h2>
            <p className="text-muted">{post.excerpt}</p>
          </div>
        </Link>
      ))}

      <section className="mt-14">
        <div className="mb-1 flex items-baseline justify-between border-b border-border pb-2.5 text-muted">
          <span className="label">Today in AI</span>
          <Link href="/news" className="text-sm hover:text-text">See all 10 →</Link>
        </div>
        <ol>
          {briefing.length === 0 ? (
            <li className="py-4 text-muted">The AI news is unavailable right now.</li>
          ) : (
            briefing.map((item, i) => (
              <li key={item.id} className="flex gap-4 border-b border-border py-4">
                <span className="w-6 shrink-0 font-serif text-xl text-accent">{i + 1}</span>
                <div className="min-w-0">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium leading-snug hover:text-accent">
                    {item.title}
                  </a>
                  <p className="text-sm text-muted">{item.host}</p>
                </div>
              </li>
            ))
          )}
        </ol>
      </section>
    </>
  );
}
