"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { ProjectNav } from "@/components/project-nav";
import { useT } from "@/lib/i18n";
import type { Character } from "@/types";

export default function CharactersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useT();
  const [projectId, setProjectId] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    personality: "",
    background: "",
    description: "",
    appearance: "",
  });
  const [isNew, setIsNew] = useState(false);
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    params.then((p) => setProjectId(p.id));
  }, [params]);

  const loadCharacters = useCallback(async () => {
    if (!projectId) return;
    const res = await fetch(`/api/characters?projectId=${projectId}`);
    setCharacters(await res.json());
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    fetch(`/api/characters?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCharacters(data);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const selectCharacter = (character: Character) => {
    setSelectedId(character.id);
    setIsNew(false);
    setForm({
      name: character.name,
      role: character.role,
      personality: character.personality,
      background: character.background,
      description: character.description,
      appearance: character.appearance,
    });
  };

  const startNew = () => {
    setSelectedId(null);
    setIsNew(true);
    setForm({ name: "", role: "", personality: "", background: "", description: "", appearance: "" });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (isNew) {
      await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, ...form }),
      });
    } else if (selectedId) {
      await fetch("/api/characters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, ...form }),
      });
    }
    setIsNew(false);
    setSelectedId(null);
    loadCharacters();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/characters", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (selectedId === id) {
      setSelectedId(null);
      setForm({ name: "", role: "", personality: "", background: "", description: "", appearance: "" });
    }
    loadCharacters();
  };

  const editing = isNew || selectedId !== null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProjectNav projectId={projectId} />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("chars.title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("chars.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            <Plus size={14} />
            {t("chars.newChar")}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {characters.map((c) => (
              <article
                key={c.id}
                onClick={() => selectCharacter(c)}
                className={`group cursor-pointer rounded-xl border p-4 transition hover:-translate-y-0.5 ${
                  selectedId === c.id ? "border-accent bg-accent/5" : "border-border bg-surface"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                      {c.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs text-muted">{c.role}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(c.id);
                    }}
                    className="rounded p-1 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted">{c.personality}</p>
                {c.background && (
                  <p className="mt-1 text-xs text-muted line-clamp-2">{c.background}</p>
                )}
              </article>
            ))}
            {characters.length === 0 && (
              <p className="col-span-2 py-12 text-center text-sm text-muted">
                {t("chars.empty")}
              </p>
            )}
          </div>

          {editing && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  {isNew ? t("chars.newCharForm") : t("chars.editCharForm")}
                </h2>
                <button
                  type="button"
                  onClick={() => { setSelectedId(null); setIsNew(false); }}
                  className="rounded p-1 text-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("chars.name")}</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("chars.role")}</span>
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder={t("chars.rolePlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("chars.personality")}</span>
                  <input value={form.personality} onChange={(e) => setForm({ ...form, personality: e.target.value })} placeholder={t("chars.personalityPlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("chars.background")}</span>
                  <textarea value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })} rows={3} placeholder={t("chars.backgroundPlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("chars.appearance")}</span>
                  <textarea value={form.appearance} onChange={(e) => setForm({ ...form, appearance: e.target.value })} rows={2} placeholder={t("chars.appearancePlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted">{t("chars.description")}</span>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder={t("chars.descriptionPlaceholder")} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1" />
                </label>
                <button type="button" onClick={handleSave} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover transition">
                  <Save size={14} />
                  {isNew ? t("common.create") : t("chars.saveChanges")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
