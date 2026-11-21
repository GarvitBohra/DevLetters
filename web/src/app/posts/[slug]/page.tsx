import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plate, TECH_VARIANTS } from "@/components/plate";
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

  const index = samplePosts.findIndex((p) => p.slug === slug);

  return (
    <article className="pb-10 pt-12">
      <h1 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-tight text-balance sm:text-5xl">
        {post.title}
      </h1>
      <p className="mb-8 text-muted">
        {formatDate(post.date)} · {post.tags.map((t) => `#${t}`).join(" ")}
      </p>

      <Plate
        variant={index === 0 ? "chip" : TECH_VARIANTS[(index * 2 + 2) % TECH_VARIANTS.length]}
        seed={7 + index * 13}
        className="mb-10 aspect-[2/1] w-full"
      />

      <div className="font-reading text-[1.25rem] leading-[1.85]">
        {post.body.map((b, i) =>
          b.type === "h2" ? (
            <h2 key={i} className="mb-3 mt-10 font-serif text-3xl font-medium leading-tight">{b.text}</h2>
          ) : b.type === "quote" ? (
            <blockquote key={i} className="my-8 border-l-4 border-accent pl-5 italic text-muted">{b.text}</blockquote>
          ) : (
            <p key={i} className="mb-6">{b.text}</p>
          ),
        )}
      </div>

      <Link href="/" className="mt-6 inline-block text-muted hover:text-text">← All stories</Link>
    </article>
  );
}
