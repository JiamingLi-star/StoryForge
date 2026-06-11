"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Bot,
  Check,
  Download,
  FileClock,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  WandSparkles,
  User,
  Globe,
  Pencil,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { WritingEditor } from "@/components/editor/writing-editor";
import { buildPrompt, buildEventSuggestionPrompt } from "@/lib/prompts";
import { useT } from "@/lib/i18n";
import type { StoryEvent, Character, WorldSetting, Project, AIMode, SceneHistory } from "@/types";

type LeftTab = "events" | "characters" | "world";

function SortableEventCard({
  event,
  active,
  onSelect,
  onDelete,
}: {
  event: StoryEvent;
  active: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: event.id,
  });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group rounded-lg border p-3 transition ${
        active ? "border-accent bg-accent/5" : "border-border bg-surface-2 hover:border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={() => onSelect(event.id)} className="flex-1 text-left">
          <h4 className="text-sm font-medium">{event.title}</h4>
          <p className="mt-1 text-xs text-muted line-clamp-2">{event.what_happened}</p>
        </button>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="rounded p-1 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
          >
            <Trash2 size={12} />
          </button>
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-1 text-muted hover:text-foreground"
          >
            <GripVertical size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function WorkspaceShell({ projectId }: { projectId: string }) {
  const t = useT();
  const [project, setProject] = useState<Project | null>(null);
  const [leftTab, setLeftTab] = useState<LeftTab>("events");
  const [aiTab, setAiTab] = useState<AIMode>("continue");
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worldSettings, setWorldSettings] = useState<WorldSetting[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [editorContent, setEditorContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiError, setAiError] = useState("");
  const [unstuckQuestion, setUnstuckQuestion] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [sceneHistory, setSceneHistory] = useState<SceneHistory[]>([]);

  const [showNewEvent, setShowNewEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventWho, setNewEventWho] = useState("");
  const [newEventWhere, setNewEventWhere] = useState("");
  const [newEventWhat, setNewEventWhat] = useState("");
  const [newEventConsequence, setNewEventConsequence] = useState("");

  const [showNewChar, setShowNewChar] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [newCharName, setNewCharName] = useState("");
  const [newCharRole, setNewCharRole] = useState("");
  const [newCharPersonality, setNewCharPersonality] = useState("");
  const [newCharBackground, setNewCharBackground] = useState("");

  const [showNewWorld, setShowNewWorld] = useState(false);
  const [editingWorldId, setEditingWorldId] = useState<string | null>(null);
  const [newWorldName, setNewWorldName] = useState("");
  const [newWorldCategory, setNewWorldCategory] = useState("");
  const [newWorldDesc, setNewWorldDesc] = useState("");

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId),
    [events, selectedEventId]
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const loadAll = useCallback(async () => {
    const [projRes, eventsRes, charsRes, worldRes] = await Promise.all([
      fetch(`/api/projects`),
      fetch(`/api/events?projectId=${projectId}`),
      fetch(`/api/characters?projectId=${projectId}`),
      fetch(`/api/world?projectId=${projectId}`),
    ]);
    const projects = await projRes.json();
    const proj = Array.isArray(projects) ? projects.find((p: Project) => p.id === projectId) : null;
    setProject(proj ?? null);
    const evts: StoryEvent[] = await eventsRes.json();
    setEvents(evts);
    setCharacters(await charsRes.json());
    setWorldSettings(await worldRes.json());
    if (evts.length > 0 && !selectedEventId) {
      setSelectedEventId(evts[0].id);
    }
  }, [projectId, selectedEventId]);

  const loadAllRef = useRef(loadAll);
  useEffect(() => { loadAllRef.current = loadAll; }, [loadAll]);
  useEffect(() => { loadAllRef.current(); }, [projectId]);

  useEffect(() => {
    if (!selectedEventId) return;
    fetch(`/api/scenes?eventId=${selectedEventId}`)
      .then((r) => r.json())
      .then((data) => {
        setEditorContent(data.content ?? "");
        setSaved(true);
      });
  }, [selectedEventId]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (saved || saving) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saved, saving]);

  useEffect(() => {
    const handleDocumentNavigation = (event: MouseEvent) => {
      if (saved || saving) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const confirmLeave = window.confirm(t("ws.unsavedWarning"));
      if (!confirmLeave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", handleDocumentNavigation, true);
    return () => document.removeEventListener("click", handleDocumentNavigation, true);
  }, [saved, saving, t]);

  const loadHistory = useCallback(async () => {
    if (!selectedEventId) return;
    const res = await fetch(`/api/scenes/history?eventId=${selectedEventId}`);
    const versions = await res.json();
    setSceneHistory(versions);
  }, [selectedEventId]);

  const saveScene = useCallback(async (content: string) => {
    if (!selectedEventId) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/scenes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: selectedEventId, content }),
    });
    setSaving(false);
    setSaved(true);
    if (showHistoryPanel) {
      await loadHistory();
    }
  }, [loadHistory, selectedEventId, showHistoryPanel]);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEditorUpdate = useCallback((html: string) => {
    setEditorContent(html);
    setSaved(false);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveScene(html), 1500);
  }, [saveScene]);

  const getPlainTextFromHtml = useCallback((html: string) => {
    if (typeof window === "undefined") return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return (doc.body.textContent ?? "").trim();
  }, []);

  const getMarkdownFromHtml = useCallback((html: string) => {
    const plain = getPlainTextFromHtml(html);
    return plain
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n\n");
  }, [getPlainTextFromHtml]);

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, []);

  const buildExportFilename = useCallback((ext: string) => {
    const safeTitle = (project?.title ?? "story").replace(/[\\/:*?"<>|]/g, "_");
    const safeEvent = (selectedEvent?.title ?? "scene").replace(/[\\/:*?"<>|]/g, "_");
    return `${safeTitle}-${safeEvent}.${ext}`;
  }, [project?.title, selectedEvent?.title]);

  const handleExport = useCallback((format: "word" | "pdf" | "txt" | "md") => {
    const html = editorContent || "<p></p>";
    const text = getPlainTextFromHtml(html);
    const markdown = getMarkdownFromHtml(html);

    if (format === "word") {
      const wordHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;
      downloadBlob(
        new Blob([wordHtml], { type: "application/msword;charset=utf-8" }),
        buildExportFilename("doc")
      );
      return;
    }

    if (format === "pdf") {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const lines = doc.splitTextToSize(text || " ", 500);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(lines, 40, 60);
      doc.save(buildExportFilename("pdf"));
      return;
    }

    if (format === "txt") {
      downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), buildExportFilename("txt"));
      return;
    }

    downloadBlob(new Blob([markdown], { type: "text/markdown;charset=utf-8" }), buildExportFilename("md"));
  }, [buildExportFilename, downloadBlob, editorContent, getMarkdownFromHtml, getPlainTextFromHtml]);

  const handleManualSave = useCallback(async () => {
    await saveScene(editorContent);
  }, [editorContent, saveScene]);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }
    let cancelled = false;
    fetch(`/api/scenes/history?eventId=${selectedEventId}`)
      .then((res) => res.json())
      .then((versions) => {
        if (!cancelled) setSceneHistory(versions);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedEventId]);

  const toggleHistoryPanel = useCallback(() => {
    setShowHistoryPanel((value) => {
      const nextValue = !value;
      if (nextValue) {
        void loadHistory();
      }
      return nextValue;
    });
  }, [loadHistory]);

  const handleRestoreHistory = useCallback(async (historyId: string) => {
    if (!selectedEventId) return;
    await fetch("/api/scenes/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: selectedEventId, historyId }),
    });
    const res = await fetch(`/api/scenes?eventId=${selectedEventId}`);
    const scene = await res.json();
    setEditorContent(scene.content ?? "");
    setSaved(true);
    loadHistory();
  }, [loadHistory, selectedEventId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = events.findIndex((e) => e.id === active.id);
    const newIndex = events.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(events, oldIndex, newIndex);
    setEvents(reordered);
    fetch("/api/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: active.id, sort_order: newIndex }),
    });
  };

  const handleGenerate = async () => {
    if (!project) return;
    setGenerating(true);
    setAiResults([]);
    setAiError("");

    const ctx = {
      projectTitle: project.title,
      genre: project.genre,
      synopsis: project.synopsis,
      worldBrief: project.world_brief,
      characters,
      events,
      worldSettings,
      currentEvent: selectedEvent,
      currentContent: editorContent,
      selectedText: "",
      userQuestion: unstuckQuestion,
    };

    const { system, user } = buildPrompt(aiTab, ctx);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, user }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setAiError(data.error ?? t("ai.genFailed"));
        return;
      }
      const results = data.results ?? [];
      if (results.length === 0) {
        setAiError(t("ai.genFailed"));
        return;
      }
      setAiResults(results);
    } catch {
      setAiError(t("ai.genFailed"));
    } finally {
      setGenerating(false);
    }
  };

  const handleSuggestEvent = async () => {
    if (!project) return;
    setGenerating(true);
    setAiResults([]);
    setAiError("");
    const ctx = {
      projectTitle: project.title,
      genre: project.genre,
      synopsis: project.synopsis,
      worldBrief: project.world_brief,
      characters,
      events,
      worldSettings,
      currentEvent: selectedEvent,
      currentContent: editorContent,
    };
    const { system, user } = buildEventSuggestionPrompt(ctx);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, user }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setAiError(data.error ?? t("ai.suggestFailed"));
        return;
      }
      const results = data.results ?? [];
      if (results.length === 0) {
        setAiError(t("ai.suggestFailed"));
        return;
      }
      setAiResults(results);
    } catch {
      setAiError(t("ai.suggestFailed"));
    } finally {
      setGenerating(false);
    }
  };

  const applyResult = (text: string) => {
    const newContent = editorContent
      ? `${editorContent}<p>${text}</p>`
      : `<p>${text}</p>`;
    setEditorContent(newContent);
    saveScene(newContent);
  };

  const handleCreateEvent = async () => {
    if (!newEventTitle.trim()) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        title: newEventTitle,
        who: newEventWho,
        where: newEventWhere,
        what_happened: newEventWhat,
        consequence: newEventConsequence,
        sort_order: events.length,
      }),
    });
    setShowNewEvent(false);
    setNewEventTitle("");
    setNewEventWho("");
    setNewEventWhere("");
    setNewEventWhat("");
    setNewEventConsequence("");
    loadAll();
  };

  const handleDeleteEvent = async (id: string) => {
    await fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (selectedEventId === id) setSelectedEventId("");
    loadAll();
  };

  const resetCharacterForm = () => {
    setEditingCharacterId(null);
    setNewCharName("");
    setNewCharRole("");
    setNewCharPersonality("");
    setNewCharBackground("");
  };

  const startEditCharacter = (character: Character) => {
    setShowNewChar(true);
    setEditingCharacterId(character.id);
    setNewCharName(character.name);
    setNewCharRole(character.role);
    setNewCharPersonality(character.personality);
    setNewCharBackground(character.background);
  };

  const handleSubmitCharacter = async () => {
    if (!newCharName.trim()) return;
    if (editingCharacterId) {
      await fetch("/api/characters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCharacterId,
          name: newCharName,
          role: newCharRole,
          personality: newCharPersonality,
          background: newCharBackground,
        }),
      });
    } else {
      await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          name: newCharName,
          role: newCharRole,
          description: "",
          personality: newCharPersonality,
          background: newCharBackground,
          appearance: "",
        }),
      });
    }
    setShowNewChar(false);
    resetCharacterForm();
    loadAll();
  };

  const handleDeleteCharacter = async (id: string) => {
    await fetch("/api/characters", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadAll();
  };

  const resetWorldForm = () => {
    setEditingWorldId(null);
    setNewWorldName("");
    setNewWorldCategory("");
    setNewWorldDesc("");
  };

  const startEditWorld = (setting: WorldSetting) => {
    setShowNewWorld(true);
    setEditingWorldId(setting.id);
    setNewWorldName(setting.name);
    setNewWorldCategory(setting.category);
    setNewWorldDesc(setting.description);
  };

  const handleSubmitWorld = async () => {
    if (!newWorldName.trim()) return;
    if (editingWorldId) {
      await fetch("/api/world", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingWorldId,
          name: newWorldName,
          category: newWorldCategory,
          description: newWorldDesc,
        }),
      });
    } else {
      await fetch("/api/world", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          name: newWorldName,
          category: newWorldCategory,
          description: newWorldDesc,
        }),
      });
    }
    setShowNewWorld(false);
    resetWorldForm();
    loadAll();
  };

  const handleDeleteWorld = async (id: string) => {
    await fetch("/api/world", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadAll();
  };

  const AI_TAB_LABELS: Record<AIMode, string> = {
    continue: t("ai.continue"),
    expand: t("ai.expand"),
    rewrite: t("ai.rewrite"),
    unstuck: t("ai.unstuck"),
  };

  const leftTabs: { key: LeftTab; label: string; icon: React.ReactNode }[] = [
    { key: "events", label: t("nav.events"), icon: <Sparkles size={14} /> },
    { key: "characters", label: t("nav.characters"), icon: <User size={14} /> },
    { key: "world", label: t("nav.world"), icon: <Globe size={14} /> },
  ];

  return (
    <div className="grid min-h-[calc(100vh-41px)] grid-cols-1 lg:grid-cols-[280px_1fr_340px]">
      {/* LEFT PANEL */}
      <aside className="border-r border-border bg-surface p-4 overflow-y-auto">
        <div className="mb-4 flex rounded-lg border border-border bg-surface-2 p-0.5 text-xs">
          {leftTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setLeftTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 transition ${
                leftTab === tab.key ? "bg-background text-foreground" : "text-muted"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {leftTab === "events" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{t("ws.eventTimeline")}</h3>
              <button
                type="button"
                onClick={() => setShowNewEvent(true)}
                className="rounded-md border border-border p-1 text-muted hover:text-foreground transition"
              >
                <Plus size={14} />
              </button>
            </div>

            {showNewEvent && (
              <div className="mb-3 space-y-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
                <input value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder={t("ws.eventTitle")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none ring-accent focus:ring-1" />
                <input value={newEventWho} onChange={(e) => setNewEventWho(e.target.value)} placeholder={t("ws.whoInvolved")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <input value={newEventWhere} onChange={(e) => setNewEventWhere(e.target.value)} placeholder={t("ws.where")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <input value={newEventWhat} onChange={(e) => setNewEventWhat(e.target.value)} placeholder={t("ws.whatHappened")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <input value={newEventConsequence} onChange={(e) => setNewEventConsequence(e.target.value)} placeholder={t("ws.consequence")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <div className="flex gap-2">
                  <button type="button" onClick={handleCreateEvent} className="rounded bg-accent px-2 py-1 text-xs text-white">{t("common.add")}</button>
                  <button type="button" onClick={() => setShowNewEvent(false)} className="rounded border border-border px-2 py-1 text-xs text-muted">{t("common.cancel")}</button>
                </div>
              </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {events.map((event) => (
                    <SortableEventCard
                      key={event.id}
                      event={event}
                      active={event.id === selectedEventId}
                      onSelect={setSelectedEventId}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {events.length === 0 && !showNewEvent && (
              <p className="mt-4 text-center text-xs text-muted">{t("ws.addFirstEvent")}</p>
            )}

            <button
              type="button"
              onClick={handleSuggestEvent}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent transition hover:bg-accent/20"
            >
              <Sparkles size={12} />
              {t("ws.aiSuggestEvent")}
            </button>
          </>
        )}

        {leftTab === "characters" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{t("ws.characterMgmt")}</h3>
              <button
                type="button"
                onClick={() => {
                  resetCharacterForm();
                  setShowNewChar(true);
                }}
                className="rounded-md border border-border p-1 text-muted hover:text-foreground transition"
              >
                <Plus size={14} />
              </button>
            </div>

            {showNewChar && (
              <div className="mb-3 space-y-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
                <p className="text-xs text-muted">
                  {editingCharacterId ? t("ws.editingChar") : t("ws.addChar")}
                </p>
                <input value={newCharName} onChange={(e) => setNewCharName(e.target.value)} placeholder={t("ws.charName")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none ring-accent focus:ring-1" />
                <input value={newCharRole} onChange={(e) => setNewCharRole(e.target.value)} placeholder={t("ws.charRole")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <input value={newCharPersonality} onChange={(e) => setNewCharPersonality(e.target.value)} placeholder={t("ws.charPersonality")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <input value={newCharBackground} onChange={(e) => setNewCharBackground(e.target.value)} placeholder={t("ws.charBackground")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <div className="flex gap-2">
                  <button type="button" onClick={handleSubmitCharacter} className="rounded bg-accent px-2 py-1 text-xs text-white">
                    {editingCharacterId ? t("common.save") : t("common.add")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewChar(false);
                      resetCharacterForm();
                    }}
                    className="rounded border border-border px-2 py-1 text-xs text-muted"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {characters.map((c) => (
                <article
                  key={c.id}
                  onClick={() => startEditCharacter(c)}
                  className={`group cursor-pointer rounded-lg border bg-surface-2 p-3 ${
                    editingCharacterId === c.id ? "border-accent" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-accent">
                        {c.name[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{c.name}</h4>
                        <p className="text-xs text-muted">{c.role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteCharacter(c.id);
                      }}
                      className="rounded p-1 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted">{c.personality}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {leftTab === "world" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{t("ws.worldSettings")}</h3>
              <button
                type="button"
                onClick={() => {
                  resetWorldForm();
                  setShowNewWorld(true);
                }}
                className="rounded-md border border-border p-1 text-muted hover:text-foreground transition"
              >
                <Plus size={14} />
              </button>
            </div>

            {showNewWorld && (
              <div className="mb-3 space-y-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
                <p className="text-xs text-muted">
                  {editingWorldId ? t("ws.editingWorld") : t("ws.addWorld")}
                </p>
                <input value={newWorldName} onChange={(e) => setNewWorldName(e.target.value)} placeholder={t("ws.worldName")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none ring-accent focus:ring-1" />
                <input value={newWorldCategory} onChange={(e) => setNewWorldCategory(e.target.value)} placeholder={t("ws.worldCategory")} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <textarea value={newWorldDesc} onChange={(e) => setNewWorldDesc(e.target.value)} placeholder={t("ws.worldDesc")} rows={3} className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none ring-accent focus:ring-1" />
                <div className="flex gap-2">
                  <button type="button" onClick={handleSubmitWorld} className="rounded bg-accent px-2 py-1 text-xs text-white">
                    {editingWorldId ? t("common.save") : t("common.add")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewWorld(false);
                      resetWorldForm();
                    }}
                    className="rounded border border-border px-2 py-1 text-xs text-muted"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {worldSettings.map((w) => (
                <article
                  key={w.id}
                  onClick={() => startEditWorld(w)}
                  className={`group cursor-pointer rounded-lg border bg-surface-2 p-3 ${
                    editingWorldId === w.id ? "border-accent" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{w.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted">{w.category}</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteWorld(w.id);
                        }}
                        className="rounded p-1 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted">{w.description}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* CENTER PANEL - EDITOR */}
      <main className="overflow-y-auto border-r border-border bg-background p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-xs text-muted">{project?.title ?? t("common.loading")}</p>
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <Pencil size={14} className="text-muted" />
              {selectedEvent?.title ?? t("ws.selectEvent")}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <button
              type="button"
              onClick={handleManualSave}
              disabled={!selectedEventId || saving}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground transition hover:border-accent disabled:opacity-50"
            >
              <Save size={12} />
              {t("ws.save")}
            </button>
            <button
              type="button"
              onClick={toggleHistoryPanel}
              disabled={!selectedEventId}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground transition hover:border-accent disabled:opacity-50"
            >
              <FileClock size={12} />
              {t("ws.history")}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu((value) => !value)}
                disabled={!selectedEventId}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground transition hover:border-accent disabled:opacity-50"
              >
                <Download size={12} />
                {t("ws.export")}
              </button>
              {showExportMenu && (
                <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-border bg-surface p-1 shadow-xl">
                  <button type="button" onClick={() => { handleExport("word"); setShowExportMenu(false); }} className="block w-full rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface-2">
                    Word (.doc)
                  </button>
                  <button type="button" onClick={() => { handleExport("pdf"); setShowExportMenu(false); }} className="block w-full rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface-2">
                    PDF (.pdf)
                  </button>
                  <button type="button" onClick={() => { handleExport("txt"); setShowExportMenu(false); }} className="block w-full rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface-2">
                    Text (.txt)
                  </button>
                  <button type="button" onClick={() => { handleExport("md"); setShowExportMenu(false); }} className="block w-full rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface-2">
                    Markdown (.md)
                  </button>
                </div>
              )}
            </div>
            <span className="inline-flex items-center gap-1">
              {saving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Check size={12} className={saved ? "text-success" : "text-muted"} />
              )}
              {saving ? t("ws.saving") : saved ? t("ws.saved") : t("ws.unsaved")}
            </span>
          </div>
        </div>

        {showHistoryPanel && (
          <div className="mb-4 rounded-lg border border-border bg-surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">{t("ws.historyVersions")}</p>
              <button type="button" onClick={() => setShowHistoryPanel(false)} className="text-xs text-muted hover:text-foreground">
                {t("common.close")}
              </button>
            </div>
            {sceneHistory.length === 0 ? (
              <p className="text-xs text-muted">{t("ws.noHistory")}</p>
            ) : (
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {sceneHistory.map((version) => (
                  <div key={version.id} className="flex items-center justify-between rounded border border-border bg-surface-2 px-2 py-2">
                    <div>
                      <p className="text-xs text-foreground">{new Date(version.created_at).toLocaleString()}</p>
                      <p className="max-w-[520px] truncate text-xs text-muted">{version.content.replace(/<[^>]+>/g, "").slice(0, 80)}</p>
                    </div>
                    <button type="button" onClick={() => handleRestoreHistory(version.id)} className="rounded border border-border px-2 py-1 text-xs text-foreground hover:border-accent">
                      {t("ws.restore")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedEvent ? (
          <>
            <div className="mb-4 rounded-lg border border-border bg-surface p-3 text-sm text-muted">
              <strong className="text-foreground">{t("ws.eventInfo")}</strong> {selectedEvent.who} {t("ws.at")} {selectedEvent.where} — {selectedEvent.what_happened}. {t("ws.result")} {selectedEvent.consequence}
            </div>
            <WritingEditor
              content={editorContent}
              onUpdate={handleEditorUpdate}
              placeholder={selectedEvent ? t("ws.editorPlaceholder", { title: selectedEvent.title }) : t("ws.defaultPlaceholder")}
            />
          </>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted">
            {t("ws.selectEventHint")}
          </div>
        )}
      </main>

      {/* RIGHT PANEL - AI */}
      <aside className="bg-surface p-4 overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-sm font-medium">
            <Bot size={16} className="text-accent" />
            {t("ai.title")}
          </h3>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">DeepSeek</span>
        </div>

        <div className="mb-4 flex rounded-lg border border-border bg-surface-2 p-0.5 text-xs">
          {(Object.keys(AI_TAB_LABELS) as AIMode[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setAiTab(tab); setAiResults([]); setAiError(""); }}
              className={`flex-1 rounded-md px-2 py-1.5 transition ${
                aiTab === tab ? "bg-background text-foreground" : "text-muted"
              }`}
            >
              {AI_TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <p className="mb-3 text-xs text-muted">
          {aiTab === "continue" && t("ai.continueDesc")}
          {aiTab === "expand" && t("ai.expandDesc")}
          {aiTab === "rewrite" && t("ai.rewriteDesc")}
          {aiTab === "unstuck" && t("ai.unstuckDesc")}
        </p>

        {aiTab === "unstuck" && (
          <textarea
            value={unstuckQuestion}
            onChange={(e) => setUnstuckQuestion(e.target.value)}
            rows={3}
            className="mb-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none ring-accent focus:ring-1 transition"
            placeholder={t("ai.unstuckPlaceholder")}
          />
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !selectedEvent}
          className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t("ai.generating")}
            </>
          ) : (
            <>
              <WandSparkles size={14} />
              {aiTab === "unstuck" ? t("ai.getIdeas") : t("ai.generate")}
            </>
          )}
        </button>

        {aiError && (
          <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm leading-6 text-danger">
            {aiError}
          </div>
        )}

        {aiResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">{t("ai.results")} ({aiResults.length})</p>
            {aiResults.map((result, i) => (
              <article key={i} className="rounded-lg border border-border bg-surface-2 p-3 transition hover:border-accent/30">
                <p className="text-sm leading-6 text-foreground/90">{result}</p>
                <button
                  type="button"
                  onClick={() => applyResult(result)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  <Plus size={10} />
                  {t("ai.applyToEditor")}
                </button>
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
