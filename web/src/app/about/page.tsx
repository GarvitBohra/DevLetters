import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About DevLetters and how to write for it.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl pb-10 pt-14">
      <h1 className="mb-8 font-serif text-5xl font-medium leading-none tracking-tight sm:text-6xl">About DevLetters</h1>
      <div className="space-y-5 font-reading text-[1.2rem] leading-[1.8]">
        <p>
          DevLetters is a small, independent place for essays on writing and thinking clearly. It is built
          to be fast, readable and free of distractions.
        </p>
        <h2 className="pt-4 font-serif text-3xl font-medium">Write for us</h2>
        <p>
          We are inviting our first group of writers. <Link href="/signup" className="underline underline-offset-4">Create an account</Link>{" "}
          to set up your author page.
        </p>
        <h2 className="pt-4 font-serif text-3xl font-medium">Privacy</h2>
        <p>
          We store only what is needed to run your account: your email, your chosen handle and the profile
          details you add. No advertising or tracking.
        </p>
      </div>
    </article>
  );
}
