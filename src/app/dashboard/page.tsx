"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CreateProjectModal } from "@/components/create-project-modal";
import { UserMenu } from "@/components/user-menu";
import type { Project } from "@/types";

const GENRE_COLORS: Record<string, string> = {
  "玄幻": "border-orange-500/30 text-orange-400",
  "修仙": "border-purple-500/30 text-purple-400",
  "都市": "border-blue-500/30 text-blue-400",
  "言情": "border-pink-500/30 text-pink-400",
  "悬疑": "border-emerald-500/30 text-emerald-400",
  "科幻": "border-cyan-500/30 text-cyan-400",
  "历史": "border-amber-500/30 text-amber-400",
  "其他": "border-zinc-500/30 text-zinc-400",
};

const GENRE_GRADIENTS: Record<string, string> = {
  "玄幻": "from-orange-900/40 to-zinc-900",
  "修仙": "from-purple-900/40 to-zinc-900",
  "都市": "from-blue-900/40 to-zinc-900",
  "言情": "from-pink-900/40 to-zinc-900",
  "悬疑": "from-emerald-900/40 to-zinc-900",
  "科幻": "from-cyan-900/40 to-zinc-900",
  "历史": "from-amber-900/40 to-zinc-900",
  "其他": "from-zinc-800/40 to-zinc-900",
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id: string) => {
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadProjects();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">StoryForge</Link>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">我的故事</h1>
            <p className="mt-2 text-sm text-muted">用事件驱动方式搭建故事骨架，再交给 AI 填充细节。</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            <Plus size={16} />
            新建故事
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-surface p-5">
                <div className="mb-4 h-28 rounded-lg bg-surface-2" />
                <div className="h-5 w-1/2 rounded bg-surface-2" />
                <div className="mt-2 h-4 w-full rounded bg-surface-2" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-6xl opacity-20">📖</div>
            <h2 className="text-xl font-semibold">还没有故事</h2>
            <p className="mt-2 text-sm text-muted">点击上方按钮，开始创作你的第一个故事。</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div className={`mb-4 h-28 rounded-lg bg-gradient-to-br ${GENRE_GRADIENTS[project.genre] ?? GENRE_GRADIENTS["其他"]}`} />
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-semibold">{project.title}</h2>
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${GENRE_COLORS[project.genre] ?? GENRE_COLORS["其他"]}`}>
                    {project.genre}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-muted">{project.synopsis}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/project/${project.id}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm transition hover:border-accent"
                  >
                    继续写作
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="rounded-lg p-1.5 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadProjects}
      />
    </div>
  );
}
