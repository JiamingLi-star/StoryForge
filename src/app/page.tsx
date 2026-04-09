"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Workflow, BookOpenText } from "lucide-react";
import { LanguageSwitcher, useT } from "@/lib/i18n";

export default function Home() {
  const t = useT();

  return (
    <div className="app-shell min-h-screen text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <p className="text-lg font-semibold tracking-tight">StoryForge</p>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground/30 transition">
            {t("landing.login")}
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            {t("landing.getStarted")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-14">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
              <Sparkles size={12} />
              {t("landing.tagline")}
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              {t("landing.heroTitle1")}
              <br />
              <span className="text-accent">{t("landing.heroTitle2")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              {t("landing.heroDesc")}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition"
              >
                {t("landing.startWriting")}
                <ArrowRight size={14} />
              </Link>
              <Link href="/project/project-1" className="rounded-lg border border-border px-5 py-2.5 text-sm hover:border-foreground/30 transition">
                {t("landing.previewWorkspace")}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl">
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <p className="text-sm text-muted">{t("landing.previewLabel")}</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5 font-medium">1. 边城夜袭</li>
                <li className="rounded-lg border border-border px-3 py-2.5 text-muted">2. 初见天书</li>
                <li className="rounded-lg border border-border px-3 py-2.5 text-muted">3. 宗门试炼</li>
              </ul>
            </div>
            <p className="mt-4 text-sm text-muted">
              {t("landing.previewHint")}
            </p>
          </div>
        </section>

        <section className="mt-24 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent/50">
            <Workflow size={20} className="text-accent" />
            <h3 className="mt-3 font-semibold">{t("landing.feature1Title")}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t("landing.feature1Desc")}
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent/50">
            <Sparkles size={20} className="text-accent" />
            <h3 className="mt-3 font-semibold">{t("landing.feature2Title")}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t("landing.feature2Desc")}
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent/50">
            <BookOpenText size={20} className="text-accent" />
            <h3 className="mt-3 font-semibold">{t("landing.feature3Title")}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t("landing.feature3Desc")}
            </p>
          </article>
        </section>

        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold">{t("landing.ctaTitle")}</h2>
          <p className="mt-3 text-muted">{t("landing.ctaDesc")}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            {t("landing.ctaButton")}
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        StoryForge &copy; 2026. {t("landing.footer")}
      </footer>
    </div>
  );
}
