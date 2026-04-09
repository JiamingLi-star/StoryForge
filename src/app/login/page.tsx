"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher, useT } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition">&larr; {t("common.back")}</Link>
          <LanguageSwitcher />
        </div>
        <h1 className="mt-4 text-2xl font-bold">{isRegister ? t("login.registerTitle") : t("login.loginTitle")}</h1>
        <p className="mt-2 text-sm text-muted">
          {isRegister ? t("login.registerDesc") : t("login.loginDesc")}
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">{t("login.username")}</span>
              <input
                type="text"
                placeholder="Writer"
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2 transition"
              />
            </label>
          )}
          <label className="block space-y-1.5">
            <span className="text-sm text-muted">{t("login.email")}</span>
            <input
              type="email"
              placeholder="writer@example.com"
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2 transition"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-muted">{t("login.password")}</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2 transition"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            {isRegister ? t("login.createAccount") : t("login.loginBtn")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          {isRegister ? t("login.hasAccount") : t("login.noAccount")}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-accent hover:underline"
          >
            {isRegister ? t("login.goLogin") : t("login.register")}
          </button>
        </p>
      </main>
    </div>
  );
}
