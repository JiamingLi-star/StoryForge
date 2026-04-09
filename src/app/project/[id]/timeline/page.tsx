"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { ProjectNav } from "@/components/project-nav";
import { useT } from "@/lib/i18n";
import type { StoryEvent, Character } from "@/types";

type RelNode = {
  event: StoryEvent;
  characters: string[];
};

export default function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useT();
  const [projectId, setProjectId] = useState("");
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    params.then((p) => setProjectId(p.id));
  }, [params]);

  const loadData = useCallback(async () => {
    if (!projectId) return;
    const [evRes, chRes] = await Promise.all([
      fetch(`/api/events?projectId=${projectId}`),
      fetch(`/api/characters?projectId=${projectId}`),
    ]);
    setEvents(await evRes.json());
    setCharacters(await chRes.json());
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const nodes: RelNode[] = useMemo(() => {
    return events.map((ev) => {
      const chars = characters
        .filter((c) => ev.who.includes(c.name))
        .map((c) => c.name);
      return { event: ev, characters: chars };
    });
  }, [events, characters]);

  const allCharNames = useMemo(
    () => characters.map((c) => c.name),
    [characters]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProjectNav projectId={projectId} />

      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("timeline.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("timeline.subtitle")}</p>
        </div>

        {nodes.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">{t("timeline.empty")}</p>
        ) : (
          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-0">
              {nodes.map((node, idx) => {
                const isExpanded = expandedId === node.event.id;
                return (
                  <div key={node.event.id} className="relative pl-14">
                    <div className="absolute left-[16px] top-5 flex h-[14px] w-[14px] items-center justify-center">
                      <div className="h-3 w-3 rounded-full border-2 border-accent bg-background" />
                    </div>
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : node.event.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition hover:-translate-y-0.5 mb-4 ${isExpanded ? "border-accent bg-accent/5" : "border-border bg-surface"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">{idx + 1}</span>
                        <h3 className="font-semibold">{node.event.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-muted">{node.event.what_happened}</p>
                      {node.characters.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {node.characters.map((name) => (
                            <span key={name} className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">{name}</span>
                          ))}
                        </div>
                      )}
                      {isExpanded && (
                        <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                          {node.event.where && <div><span className="text-muted">{t("timeline.location")}</span>{node.event.where}</div>}
                          {node.event.consequence && <div><span className="text-muted">{t("timeline.consequence")}</span>{node.event.consequence}</div>}
                          {node.event.who && <div><span className="text-muted">{t("timeline.involved")}</span>{node.event.who}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {allCharNames.length > 0 && (
          <div className="mt-10 rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold">{t("timeline.charAppearances")}</h2>
            <div className="space-y-2">
              {allCharNames.map((name) => {
                const count = nodes.filter((n) => n.characters.includes(name)).length;
                const pct = nodes.length > 0 ? (count / nodes.length) * 100 : 0;
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-sm truncate">{name}</span>
                    <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted w-16 text-right">{count}/{nodes.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
