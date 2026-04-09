import { ProjectNav } from "@/components/project-nav";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <ProjectNav projectId={id} />
      <WorkspaceShell projectId={id} />
    </div>
  );
}
