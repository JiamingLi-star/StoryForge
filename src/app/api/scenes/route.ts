import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  }
  const scene = store.getScene(eventId);
  return NextResponse.json(scene ?? { content: "" });
}

export async function PUT(request: NextRequest) {
  const { eventId, content } = await request.json();
  store.upsertScene(eventId, content);
  return NextResponse.json({ success: true });
}
