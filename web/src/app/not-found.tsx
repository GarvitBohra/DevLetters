import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="mb-3 font-serif text-5xl font-medium">Page not found</h1>
      <p className="mb-6 text-muted">That page doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn btn-primary">Back to DevLetters</Link>
    </div>
  );
}
