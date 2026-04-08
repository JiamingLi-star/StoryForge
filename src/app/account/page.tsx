import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">Account Details</h1>
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-lg font-semibold text-accent">
              A
            </div>
            <div>
              <p className="text-lg font-medium">Arthur</p>
              <p className="text-sm text-muted">writer@example.com</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-muted">Display Name</span>
              <input
                defaultValue="Arthur"
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted">Email</span>
              <input
                defaultValue="writer@example.com"
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1"
              />
            </label>
          </div>

          <button className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">
            Save Profile
          </button>
        </div>
      </main>
    </div>
  );
}
