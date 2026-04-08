import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const projects = store.getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const project = store.createProject(data);
  return NextResponse.json(project, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  store.deleteProject(id);
  return NextResponse.json({ success: true });
}
