import Link from "next/link";
import { formatDate, samplePosts } from "@/lib/sample-posts";

export default function Home() {
  return (
    <>
      <section className="pb-10 pt-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Essays on writing and clear thinking
        </p>
        <h1 className="mb-5 font-serif text-5xl font-medium leading-[1.06] tracking-tight text-balance sm:text-6xl">
          A quiet place to <em className="text-accent">read</em> and write.
        </h1>
        <p className="mb-8 max-w-xl text-lg text-muted">
          Short, practical pieces you can use the same day. No noise, no feed to scroll.
        </p>
        <Link href="/signup" className="btn btn-primary">Start writing</Link>
      </section>

      <div className="flex items-baseline justify-between border-b border-border pb-2.5 text-sm uppercase tracking-widest text-muted">
        <span>Latest posts</span>
        <span>{samplePosts.length} posts</span>
      </div>

      {samplePosts.map((post) => (
        <Link key={post.slug} href={`/posts/${post.slug}`} className="group block border-b border-border py-7">
          <div className="flex flex-wrap gap-2.5 text-sm text-muted">
            <span>{formatDate(post.date)}</span>
            {post.tags.map((t) => (
              <span key={t} className="text-accent">#{t}</span>
            ))}
          </div>
          <h2 className="my-1.5 font-serif text-3xl font-medium leading-tight group-hover:text-accent">
            {post.title}
          </h2>
          <p className="text-muted">{post.excerpt}</p>
        </Link>
      ))}
    </>
  );
}
