import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Pagewise and how to write for it.",
};

export default function AboutPage() {
  return (
    <article className="pb-10 pt-14">
      <h1 className="mb-6 font-serif text-4xl font-medium tracking-tight sm:text-5xl">About Pagewise</h1>
      <div className="space-y-5 font-serif text-[1.18rem] leading-[1.8]">
        <p>
          Pagewise is a small, independent place for essays on writing and thinking clearly. It is built
          to be fast, readable and free of distractions.
        </p>
        <h2 className="pt-4 text-3xl font-semibold">Write for us</h2>
        <p>
          We are inviting our first group of writers. <Link href="/signup" className="text-accent underline">Create an account</Link>{" "}
          to set up your author page.
        </p>
        <h2 className="pt-4 text-3xl font-semibold">Privacy</h2>
        <p>
          We store only what is needed to run your account: your email, your chosen handle and the profile
          details you add. No advertising or tracking.
        </p>
      </div>
    </article>
  );
}
