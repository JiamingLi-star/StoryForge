"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Globe, Sparkles, User, ArrowLeft } from "lucide-react";
import { LanguageSwitcher, useT } from "@/lib/i18n";

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const basePath = `/project/${projectId}`;
  const t = useT();

  const NAV_ITEMS = [
    { href: "", label: t("nav.workspace"), icon: BookOpen },
    { href: "/events", label: t("nav.events"), icon: Sparkles },
    { href: "/characters", label: t("nav.characters"), icon: User },
    { href: "/world", label: t("nav.world"), icon: Globe },
    { href: "/timeline", label: t("nav.timeline"), icon: Clock },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-border bg-surface px-4 py-1.5 text-sm overflow-x-auto">
      <Link
        href="/dashboard"
        className="mr-3 flex items-center gap-1 text-muted hover:text-foreground transition shrink-0"
      >
        <ArrowLeft size={14} />
        {t("common.back")}
      </Link>
      <div className="h-4 w-px bg-border mr-2 shrink-0" />
      {NAV_ITEMS.map((item) => {
        const fullPath = `${basePath}${item.href}`;
        const isActive = pathname === fullPath;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={fullPath}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition shrink-0 ${
              isActive
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-foreground hover:bg-surface-2"
            }`}
          >
            <Icon size={13} />
            {item.label}
          </Link>
        );
      })}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <LanguageSwitcher />
        <div className="text-xs text-muted">StoryForge</div>
      </div>
    </div>
  );
}
