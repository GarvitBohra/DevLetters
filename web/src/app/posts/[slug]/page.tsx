import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, samplePosts } from "@/lib/sample-posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return samplePosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="pb-10 pt-14">
      <h1 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <div className="mb-9 flex flex-wrap gap-2.5 border-b border-border pb-5 text-sm text-muted">
        <span>{formatDate(post.date)}</span>
        {post.tags.map((t) => (
          <span key={t} className="text-accent">#{t}</span>
        ))}
      </div>

      <div className="font-serif text-[1.18rem] leading-[1.8]">
        {post.body.map((b, i) =>
          b.type === "h2" ? (
            <h2 key={i} className="mb-3 mt-9 text-3xl font-semibold leading-tight">{b.text}</h2>
          ) : b.type === "quote" ? (
            <blockquote key={i} className="my-6 border-l-[3px] border-accent pl-4 italic text-muted">{b.text}</blockquote>
          ) : (
            <p key={i} className="mb-5">{b.text}</p>
          ),
        )}
      </div>

      <Link href="/" className="mt-8 inline-block text-sm text-muted hover:text-text">← All posts</Link>
    </article>
  );
}
