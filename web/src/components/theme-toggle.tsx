"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("devletters.theme", next);
    } catch {
      // Storage can be blocked; the theme still changes for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light/dark theme"
      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-base text-muted hover:border-text hover:text-text"
    >
      ◐
    </button>
  );
}
