"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Moon, Settings, Sun, UserCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

type ThemeMode = "dark" | "light" | "system";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    root.dataset.theme = prefersLight ? "light" : "dark";
    return;
  }
  root.dataset.theme = mode;
}

export function UserMenu() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme-mode") as ThemeMode | null) ?? "dark";
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const stored = (localStorage.getItem("theme-mode") as ThemeMode | null) ?? "dark";
      if (stored === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const changeTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem("theme-mode", mode);
    applyTheme(mode);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-2 py-1 text-xs font-medium text-foreground transition hover:border-accent/60"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-accent">
          A
        </span>
        <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-2xl">
          <div className="px-2 py-2">
            <p className="text-sm font-medium text-foreground">Arthur</p>
            <p className="text-xs text-muted">writer@example.com</p>
          </div>

          <div className="my-1 border-t border-border" />

          <p className="px-2 py-1 text-[11px] uppercase tracking-wide text-muted">{t("menu.theme")}</p>
          <div className="mb-1 grid grid-cols-3 gap-1 px-1">
            <button
              type="button"
              onClick={() => changeTheme("dark")}
              className={`inline-flex items-center justify-center rounded-md px-2 py-1.5 text-xs ${
                themeMode === "dark" ? "bg-accent/20 text-accent" : "text-muted hover:bg-surface-2"
              }`}
            >
              <Moon size={12} />
            </button>
            <button
              type="button"
              onClick={() => changeTheme("light")}
              className={`inline-flex items-center justify-center rounded-md px-2 py-1.5 text-xs ${
                themeMode === "light" ? "bg-accent/20 text-accent" : "text-muted hover:bg-surface-2"
              }`}
            >
              <Sun size={12} />
            </button>
            <button
              type="button"
              onClick={() => changeTheme("system")}
              className={`inline-flex items-center justify-center rounded-md px-2 py-1.5 text-xs ${
                themeMode === "system" ? "bg-accent/20 text-accent" : "text-muted hover:bg-surface-2"
              }`}
            >
              {t("menu.auto")}
            </button>
          </div>

          <div className="my-1 border-t border-border" />

          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition hover:bg-surface-2"
          >
            <UserCircle size={14} />
            {t("menu.account")}
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition hover:bg-surface-2"
          >
            <Settings size={14} />
            {t("menu.settings")}
          </Link>
        </div>
      )}
    </div>
  );
}
