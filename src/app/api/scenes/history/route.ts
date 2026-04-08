import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  }
  const history = store.getSceneHistory(eventId);
  return NextResponse.json(history);
}

export async function POST(request: NextRequest) {
  const { eventId, historyId } = await request.json();
  if (!eventId || !historyId) {
    return NextResponse.json({ error: "eventId and historyId required" }, { status: 400 });
  }
  store.restoreSceneFromHistory(eventId, historyId);
  return NextResponse.json({ success: true });
}
