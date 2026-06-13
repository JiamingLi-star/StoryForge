import { NextRequest, NextResponse } from "next/server";

const AI_API_KEY = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";
const AI_MODEL = process.env.AI_MODEL || "deepseek-chat";
const DEFAULT_ALLOWED_MODELS = ["agnes-2.0-flash", "agnes-1.5-flash", "deepseek-chat"];
const RESULT_LABEL_PATTERN =
  "(?:选项|方案|版本)\\s*[一二三四五六七八九十\\d]+|Option\\s*\\d+|Version\\s*\\d+|Candidate\\s*\\d+";
const RESULT_LABEL_PREFIX_RE = new RegExp(
  `^\\s*(?:#{1,6}\\s*)?(?:\\*\\*)?\\s*(?:${RESULT_LABEL_PATTERN})\\s*(?:[：:.)、\\-]\\s*)?(?:\\*\\*)?\\s*`,
  "i"
);
const RESULT_LABEL_SPLIT_RE = new RegExp(
  `(?:^|\\n)\\s*(?:#{1,6}\\s*)?(?:\\*\\*)?\\s*(?:${RESULT_LABEL_PATTERN})\\s*(?:[：:.)、\\-]\\s*)?(?:\\*\\*)?\\s*`,
  "gi"
);

function getChatCompletionsUrl(baseUrl: string) {
  const normalized = baseUrl.replace(/\/+$/, "");
  if (normalized.endsWith("/chat/completions")) return normalized;
  if (normalized.endsWith("/v1")) return `${normalized}/chat/completions`;
  return `${normalized}/v1/chat/completions`;
}

function getAllowedModels() {
  const configuredModels = process.env.AI_ALLOWED_MODELS?.split(",") ?? [];
  return new Set(
    [AI_MODEL, ...DEFAULT_ALLOWED_MODELS, ...configuredModels]
      .map((model) => model.trim())
      .filter(Boolean)
  );
}

function resolveModel(model: unknown) {
  const requestedModel = typeof model === "string" ? model.trim() : "";
  if (!requestedModel) return AI_MODEL;
  return getAllowedModels().has(requestedModel) ? requestedModel : AI_MODEL;
}

function cleanResultLabel(text: string) {
  return text.replace(RESULT_LABEL_PREFIX_RE, "").trim();
}

function parseAIResults(content: string) {
  const sections = content.includes("---")
    ? content.split("---")
    : content.split(RESULT_LABEL_SPLIT_RE);

  return sections
    .map(cleanResultLabel)
    .filter((section) => section.length > 0);
}

export async function POST(request: NextRequest) {
  if (!AI_API_KEY) {
    return NextResponse.json(
      { results: generateFallbackResults() },
      { status: 200 }
    );
  }

  try {
    const { system, user, model } = await request.json();
    const selectedModel = resolveModel(model);

    const response = await fetch(getChatCompletionsUrl(AI_BASE_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel,
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
      console.error("AI provider error:", error);
      return NextResponse.json(
        { error: "AI service is unavailable. Please check the API key, base URL, model, or provider quota." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const usage = data.usage
      ? {
          prompt_tokens: Number(data.usage.prompt_tokens ?? 0),
          completion_tokens: Number(data.usage.completion_tokens ?? 0),
          total_tokens: Number(data.usage.total_tokens ?? 0),
        }
      : null;
    const results = parseAIResults(content);

    return NextResponse.json({ results, usage, model: selectedModel });
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
