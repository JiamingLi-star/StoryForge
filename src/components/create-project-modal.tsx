"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Genre } from "@/types";

const GENRE_OPTIONS: Genre[] = ["\u7384\u5e7b", "\u4fee\u4ed9", "\u90fd\u5e02", "\u8a00\u60c5", "\u60ac\u7591", "\u79d1\u5e7b", "\u5386\u53f2", "\u5176\u4ed6"];
const PERIOD_OPTIONS = ["\u73b0\u4ee3", "\u53e4\u4ee3", "\u672a\u6765", "\u67b6\u7a7a"];

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateProjectModal({ open, onClose, onCreated }: CreateProjectModalProps) {
  const t = useT();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<Genre>("\u7384\u5e7b");
  const [synopsis, setSynopsis] = useState("");
  const [worldBrief, setWorldBrief] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, genre, synopsis, world_brief: worldBrief }),
    });
    setSubmitting(false);
    setStep(1);
    setTitle("");
    setSynopsis("");
    setWorldBrief("");
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">{t("modal.newStory")}</p>
            <h3 className="text-xl font-bold text-foreground">{t("modal.createProject")}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border p-2 text-muted transition hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full transition-colors ${item <= step ? "bg-accent" : "bg-surface-2"}`}
            />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">{t("modal.storyTitle")}</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 transition"
                placeholder={t("modal.titlePlaceholder")}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">{t("modal.synopsis")}</span>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 transition"
                placeholder={t("modal.synopsisPlaceholder")}
              />
            </label>
            <div className="space-y-1.5">
              <p className="text-sm text-muted">{t("modal.genre")}</p>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    className={`rounded-full border px-3 py-1 text-sm transition ${
                      genre === g ? "border-accent bg-accent/20 text-accent" : "border-border bg-surface-2 text-foreground hover:border-accent/50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">{t("modal.worldBrief")}</span>
              <textarea
                value={worldBrief}
                onChange={(e) => setWorldBrief(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 transition"
                placeholder={t("modal.worldBriefPlaceholder")}
              />
            </label>
            <div className="space-y-1.5">
              <p className="text-sm text-muted">{t("modal.era")}</p>
              <div className="flex gap-2">
                {PERIOD_OPTIONS.map((period) => (
                  <button
                    key={period}
                    type="button"
                    className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm text-foreground transition hover:border-accent/50"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-surface-2"
            >
              {t("modal.prevStep")}
            </button>
          )}
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!title.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {t("modal.nextStep")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              disabled={submitting}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {submitting ? t("modal.creating") : t("modal.createStory")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
