"use client";

import Link from "next/link";
import { LanguageSwitcher, useT } from "@/lib/i18n";

export default function SettingsPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">{t("settings.title")}</h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
              {t("settings.backToDashboard")}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <section>
            <h2 className="text-base font-medium">{t("settings.writingPrefs")}</h2>
            <p className="mt-1 text-sm text-muted">{t("settings.writingPrefsDesc")}</p>
          </section>

          <label className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3">
            <span className="text-sm">{t("settings.autoSave")}</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--accent)]" />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3">
            <span className="text-sm">{t("settings.showAI")}</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--accent)]" />
          </label>

          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">
            {t("settings.save")}
          </button>
        </div>
      </main>
    </div>
  );
}
