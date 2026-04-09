"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Save, Trash2, X, GripVertical } from "lucide-react";
import { ProjectNav } from "@/components/project-nav";
import { useT } from "@/lib/i18n";
import type { StoryEvent } from "@/types";

export default function EventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useT();
  const [projectId, setProjectId] = useState("");
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    who: "",
    where: "",
    what_happened: "",
    consequence: "",
  });
  const [isNew, setIsNew] = useState(false);
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    params.then((p) => setProjectId(p.id));
  }, [params]);

  const loadEvents = useCallback(async () => {
    if (!projectId) return;
    const res = await fetch(`/api/events?projectId=${projectId}`);
    setEvents(await res.json());
  }, [projectId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const selectEvent = (event: StoryEvent) => {
    setSelectedId(event.id);
    setIsNew(false);
    setForm({
      title: event.title,
      who: event.who,
      where: event.where,
      what_happened: event.what_happened,
      consequence: event.consequence,
    });
  };

  const startNew = () => {
    setSelectedId(null);
    setIsNew(true);
    setForm({ title: "", who: "", where: "", what_happened: "", consequence: "" });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (isNew) {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          sort_order: events.length,
          ...form,
        }),
      });
    } else if (selectedId) {
      await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, ...form }),
      });
    }
    setIsNew(false);
    setSelectedId(null);
    loadEvents();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (selectedId === id) {
      setSelectedId(null);
      setForm({ title: "", who: "", where: "", what_happened: "", consequence: "" });
    }
    loadEvents();
  };

  const editing = isNew || selectedId !== null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProjectNav projectId={projectId} />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("events.title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("events.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            <Plus size={14} />
            {t("events.newEvent")}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-2">
            {events.map((ev, idx) => (
              <article
                key={ev.id}
                onClick={() => selectEvent(ev)}
                className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:-translate-y-0.5 ${
                  selectedId === ev.id ? "border-accent bg-accent/5" : "border-border bg-surface"
                }`}
              >
                <div className="mt-0.5 text-muted"><GripVertical size={14} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">{idx + 1}</span>
                    <h3 className="font-semibold truncate">{ev.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted line-clamp-1">{ev.what_happened}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                    {ev.who && <span className="rounded bg-surface-2 px-1.5 py-0.5">{ev.who}</span>}
                    {ev.where && <span className="rounded bg-surface-2 px-1.5 py-0.5">{ev.where}</span>}
                  </div>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }} className="rounded p-1 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </article>
            ))}
            {events.length === 0 && (
              <p className="py-12 text-center text-sm text-muted">{t("events.empty")}</p>
            )}
          </div>

          {editing && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{isNew ? t("events.newEventForm") : t("events.editEventForm")}</h2>
                <button type="button" onClick={() => { setSelectedId(null); setIsNew(false); }} className="rounded p-1 text-muted hover:text-foreground"><X size={14} /></button>
              </div>
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("events.titleLabel")}</span>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("events.who")}</span>
                  <input value={form.who} onChange={(e) => setForm({ ...form, who: e.target.value })} placeholder={t("events.whoPlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("events.where")}</span>
                  <input value={form.where} onChange={(e) => setForm({ ...form, where: e.target.value })} placeholder={t("events.wherePlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("events.whatHappened")}</span>
                  <textarea value={form.what_happened} onChange={(e) => setForm({ ...form, what_happened: e.target.value })} rows={3} placeholder={t("events.whatPlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("events.consequence")}</span>
                  <textarea value={form.consequence} onChange={(e) => setForm({ ...form, consequence: e.target.value })} rows={2} placeholder={t("events.consequencePlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <button type="button" onClick={handleSave} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover transition">
                  <Save size={14} />
                  {isNew ? t("common.create") : t("events.saveChanges")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
