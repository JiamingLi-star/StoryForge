import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 text-sm">
        <Link href="/dashboard" className="text-muted hover:text-foreground transition">
          &larr; 返回项目列表
        </Link>
        <span className="text-xs text-muted">StoryForge Workspace</span>
      </div>
      <WorkspaceShell projectId={id} />
    </div>
  );
}
