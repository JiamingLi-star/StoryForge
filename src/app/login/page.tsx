"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
        <Link href="/" className="text-sm text-muted hover:text-foreground transition">&larr; Back</Link>
        <h1 className="mt-4 text-2xl font-bold">{isRegister ? "注册 StoryForge" : "登录 StoryForge"}</h1>
        <p className="mt-2 text-sm text-muted">
          {isRegister ? "创建账号，开始你的故事创作之旅。" : "登录后继续你的故事创作。"}
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">用户名</span>
              <input
                type="text"
                placeholder="Writer"
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2 transition"
              />
            </label>
          )}
          <label className="block space-y-1.5">
            <span className="text-sm text-muted">邮箱</span>
            <input
              type="email"
              placeholder="writer@example.com"
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2 transition"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-muted">密码</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2 transition"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition"
          >
            {isRegister ? "创建账号" : "登录"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          {isRegister ? "已有账号？" : "还没有账号？"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-accent hover:underline"
          >
            {isRegister ? "去登录" : "注册"}
          </button>
        </p>
      </main>
    </div>
  );
}
