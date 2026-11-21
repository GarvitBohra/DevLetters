import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border py-6 text-sm text-muted">
      <div className="wrap flex flex-wrap justify-between gap-4">
        <span>© 2026 DevLetters</span>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/about" className="hover:text-text">About</Link>
          <Link href="/signup" className="hover:text-text">Write for us</Link>
        </nav>
      </div>
    </footer>
  );
}
