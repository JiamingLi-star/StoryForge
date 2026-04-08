import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }
  const characters = store.getCharacters(projectId);
  return NextResponse.json(characters);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const character = store.createCharacter(data);
  return NextResponse.json(character, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  store.updateCharacter(id, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  store.deleteCharacter(id);
  return NextResponse.json({ success: true });
}
