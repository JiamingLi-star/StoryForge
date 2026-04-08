import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

export async function POST(request: NextRequest) {
  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { results: generateFallbackResults() },
      { status: 200 }
    );
  }

  try {
    const { system, user } = await request.json();

    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("DeepSeek API error:", error);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const results = content
      .split("---")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateFallbackResults(): string[] {
  return [
    "顾临翻过废墙，听见身后脚步骤停。巷口忽然亮起命纹，黑衣人并未追上，而是在等他自己走进去。古卷在他胸口灼热跳动，仿佛在回应着那道命纹的召唤。",
    "他在破庙停下，古卷上的第一行字缓缓浮现：'以血为引，以命为契。' 沈鸢推门而入，神情比夜色更冷。她看了一眼古卷上的字迹，瞳孔微缩。",
    "黑衣追兵并未离去。他们在城门外布下封锁，只等顾临露面便以通缉罪名缉拿。而此刻在破庙地下，古卷正引导顾临的意识沉入一片混沌的记忆海洋。",
  ];
}
