import Link from "next/link";
import { ArrowRight, Sparkles, Workflow, BookOpenText } from "lucide-react";

export default function Home() {
  return (
    <div className="app-shell min-h-screen text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <p className="text-lg font-semibold tracking-tight">StoryForge</p>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground/30 transition">
            登录
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            免费开始
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-14">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
              <Sparkles size={12} />
              AI Chinese Fiction Writing
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              用事件驱动，
              <br />
              <span className="text-accent">写出你的故事</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              先搭建关键事件骨架，再让 AI 帮你补齐剧情、人物和世界观。
              更可控、更连续、更适合中文创作者的全新写作方式。
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition"
              >
                立即开始创作
                <ArrowRight size={14} />
              </Link>
              <Link href="/project/project-1" className="rounded-lg border border-border px-5 py-2.5 text-sm hover:border-foreground/30 transition">
                预览工作台
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl">
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <p className="text-sm text-muted">Event Timeline Preview</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5 font-medium">1. 边城夜袭</li>
                <li className="rounded-lg border border-border px-3 py-2.5 text-muted">2. 初见天书</li>
                <li className="rounded-lg border border-border px-3 py-2.5 text-muted">3. 宗门试炼</li>
              </ul>
            </div>
            <p className="mt-4 text-sm text-muted">
              Select any event to enter the AI-assisted writing flow.
            </p>
          </div>
        </section>

        <section className="mt-24 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent/50">
            <Workflow size={20} className="text-accent" />
            <h3 className="mt-3 font-semibold">事件驱动创作</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              像电影编剧一样，先列出关键事件节拍，再逐个展开为完整场景。避免写到一半卡壳。
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent/50">
            <Sparkles size={20} className="text-accent" />
            <h3 className="mt-3 font-semibold">AI 多模式辅助</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              续写、扩写、改写、卡壳救援，四种模式覆盖创作全流程，AI 出候选你来选。
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent/50">
            <BookOpenText size={20} className="text-accent" />
            <h3 className="mt-3 font-semibold">人物与世界观记忆</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              统一管理设定，AI 写作时自动参考已有人物和世界观，降低前后矛盾。
            </p>
          </article>
        </section>

        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold">准备好开始了吗？</h2>
          <p className="mt-3 text-muted">无需信用卡，免费创建你的第一个故事项目。</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            开始创作
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        StoryForge &copy; 2026. Built for Chinese fiction writers.
      </footer>
    </div>
  );
}
