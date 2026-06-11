"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Plus, Save, Trash2, X, Layers } from "lucide-react";
import { ProjectNav } from "@/components/project-nav";
import { useT } from "@/lib/i18n";
import type { WorldSetting } from "@/types";

export default function WorldPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useT();
  const [projectId, setProjectId] = useState("");
  const [settings, setSettings] = useState<WorldSetting[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: "", name: "", description: "" });
  const [isNew, setIsNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    params.then((p) => setProjectId(p.id));
  }, [params]);

  const loadSettings = useCallback(async () => {
    if (!projectId) return;
    const res = await fetch(`/api/world?projectId=${projectId}`);
    setSettings(await res.json());
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    fetch(`/api/world?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSettings(data);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const categories = useMemo(() => {
    const cats = new Set(settings.map((s) => s.category));
    return Array.from(cats).sort();
  }, [settings]);

  const filteredSettings = useMemo(() => {
    if (filterCategory === "all") return settings;
    return settings.filter((s) => s.category === filterCategory);
  }, [settings, filterCategory]);

  const selectSetting = (setting: WorldSetting) => {
    setSelectedId(setting.id);
    setIsNew(false);
    setForm({ category: setting.category, name: setting.name, description: setting.description });
  };

  const startNew = () => {
    setSelectedId(null);
    setIsNew(true);
    setForm({ category: "", name: "", description: "" });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (isNew) {
      await fetch("/api/world", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, ...form }),
      });
    } else if (selectedId) {
      await fetch("/api/world", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, ...form }),
      });
    }
    setIsNew(false);
    setSelectedId(null);
    loadSettings();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/world", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (selectedId === id) {
      setSelectedId(null);
      setForm({ category: "", name: "", description: "" });
    }
    loadSettings();
  };

  const editing = isNew || selectedId !== null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProjectNav projectId={projectId} />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("world.title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("world.subtitle")}</p>
          </div>
          <button type="button" onClick={startNew} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition">
            <Plus size={14} />
            {t("world.newSetting")}
          </button>
        </div>

        {categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setFilterCategory("all")} className={`rounded-full px-3 py-1 text-xs font-medium transition ${filterCategory === "all" ? "bg-accent text-white" : "bg-surface-2 text-muted hover:text-foreground"}`}>
              {t("common.all")}
            </button>
            {categories.map((cat) => (
              <button key={cat} type="button" onClick={() => setFilterCategory(cat)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${filterCategory === cat ? "bg-accent text-white" : "bg-surface-2 text-muted hover:text-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredSettings.map((ws) => (
              <article key={ws.id} onClick={() => selectSetting(ws)} className={`group cursor-pointer rounded-xl border p-4 transition hover:-translate-y-0.5 ${selectedId === ws.id ? "border-accent bg-accent/5" : "border-border bg-surface"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent"><Layers size={16} /></div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{ws.name}</h3>
                      <span className="text-xs text-muted">{ws.category}</span>
                    </div>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(ws.id); }} className="rounded p-1 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"><Trash2 size={14} /></button>
                </div>
                <p className="mt-3 text-sm text-muted line-clamp-3">{ws.description}</p>
              </article>
            ))}
            {filteredSettings.length === 0 && (
              <p className="col-span-2 py-12 text-center text-sm text-muted">
                {settings.length === 0 ? t("world.emptyAll") : t("world.emptyCategory")}
              </p>
            )}
          </div>

          {editing && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{isNew ? t("world.newSettingForm") : t("world.editSettingForm")}</h2>
                <button type="button" onClick={() => { setSelectedId(null); setIsNew(false); }} className="rounded p-1 text-muted hover:text-foreground"><X size={14} /></button>
              </div>
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("world.category")}</span>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder={t("world.categoryPlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("world.name")}</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("world.descLabel")}</span>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} placeholder={t("world.descPlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <button type="button" onClick={handleSave} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover transition">
                  <Save size={14} />
                  {isNew ? t("common.create") : t("world.saveChanges")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
