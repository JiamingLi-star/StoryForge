import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }
  const settings = store.getWorldSettings(projectId);
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const setting = store.createWorldSetting(data);
  return NextResponse.json(setting, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  store.updateWorldSetting(id, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  store.deleteWorldSetting(id);
  return NextResponse.json({ success: true });
}
