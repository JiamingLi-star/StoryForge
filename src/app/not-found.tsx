"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const t = useT();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">{t("notFound.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("notFound.desc")}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition"
        >
          {t("notFound.backHome")}
        </Link>
      </div>
    </div>
  );
}
