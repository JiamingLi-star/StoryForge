import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Page Not Found</h1>
        <p className="mt-2 text-sm text-muted">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
