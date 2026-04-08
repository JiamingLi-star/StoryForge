"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Genre } from "@/types";

const GENRE_OPTIONS: Genre[] = ["玄幻", "修仙", "都市", "言情", "悬疑", "科幻", "历史", "其他"];
const PERIOD_OPTIONS = ["现代", "古代", "未来", "架空"];

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateProjectModal({ open, onClose, onCreated }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<Genre>("玄幻");
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
            <p className="text-xs text-muted uppercase tracking-wider">New Story</p>
            <h3 className="text-xl font-bold text-foreground">创建写作项目</h3>
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
              <span className="text-sm text-muted">故事标题</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 transition"
                placeholder="例如：苍穹裂痕"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">一句话简介</span>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 transition"
                placeholder="描述故事的核心冲突和看点"
              />
            </label>
            <div className="space-y-1.5">
              <p className="text-sm text-muted">题材类型</p>
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
              <span className="text-sm text-muted">世界观简述</span>
              <textarea
                value={worldBrief}
                onChange={(e) => setWorldBrief(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 transition"
                placeholder="简述故事发生的时代、秩序和关键规则（可稍后补充）"
              />
            </label>
            <div className="space-y-1.5">
              <p className="text-sm text-muted">时代设定</p>
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
              上一步
            </button>
          )}
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!title.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              下一步
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              disabled={submitting}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {submitting ? "创建中..." : "创建故事"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
