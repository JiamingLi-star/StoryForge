"use client";

import { useT } from "@/lib/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-danger">!</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">{t("error.title")}</h1>
        <p className="mt-2 text-sm text-muted">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition"
        >
          {t("error.tryAgain")}
        </button>
      </div>
    </div>
  );
}
