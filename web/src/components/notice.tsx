export function Notice({ kind, children }: { kind: "error" | "info"; children: React.ReactNode }) {
  const color = kind === "error" ? "border-red-700/60 text-red-700 dark:text-red-400" : "border-border text-muted";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`mb-5 rounded-md border bg-bg2 px-4 py-3 text-sm ${color}`}>
      {children}
    </p>
  );
}

export function SetupNotice() {
  return (
    <Notice kind="info">
      Accounts are not connected yet. Add your Supabase keys to <code>web/.env.local</code> (see{" "}
      <code>.env.example</code>) and restart the server.
    </Notice>
  );
}
