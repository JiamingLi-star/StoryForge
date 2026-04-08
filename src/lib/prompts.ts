import type { StoryEvent, Character, WorldSetting, AIMode } from "@/types";

type PromptContext = {
  projectTitle: string;
  genre: string;
  synopsis: string;
  worldBrief: string;
  characters: Character[];
  events: StoryEvent[];
  worldSettings: WorldSetting[];
  currentEvent?: StoryEvent;
  currentContent: string;
  selectedText?: string;
  userQuestion?: string;
};

function buildContextBlock(ctx: PromptContext): string {
  const charBlock = ctx.characters
    .map((c) => `- ${c.name}(${c.role}): ${c.personality}. ${c.background}`)
    .join("\n");

  const eventBlock = ctx.events
    .map((e, i) => `${i + 1}. [${e.title}] ${e.who} at ${e.where}: ${e.what_happened} -> ${e.consequence}`)
    .join("\n");

  const worldBlock = ctx.worldSettings
    .map((w) => `- [${w.category}] ${w.name}: ${w.description}`)
    .join("\n");

  return `## Story: "${ctx.projectTitle}" (${ctx.genre})
Synopsis: ${ctx.synopsis}
World: ${ctx.worldBrief}

## Characters
${charBlock || "None defined yet."}

## Event Timeline
${eventBlock || "No events yet."}

## World Settings
${worldBlock || "No world settings yet."}`;
}

export function buildPrompt(mode: AIMode, ctx: PromptContext): { system: string; user: string } {
  const contextBlock = buildContextBlock(ctx);

  const systemBase = `You are a professional Chinese fiction writing assistant. You write in natural, literary Chinese. Follow the story's established tone and style. Always stay consistent with existing characters and world settings. Never break the fourth wall. Output only the creative text itself, no commentary or meta-discussion.`;

  switch (mode) {
    case "continue": {
      return {
        system: `${systemBase}\n\n${contextBlock}`,
        user: `Continue the following passage naturally. Write 200-400 characters of compelling narrative that advances the current event "${ctx.currentEvent?.title ?? ""}". Provide exactly 3 different continuation options, separated by "---".\n\nCurrent text:\n${ctx.currentContent}`,
      };
    }
    case "expand": {
      return {
        system: `${systemBase}\n\n${contextBlock}`,
        user: `Expand the following brief passage into a rich, detailed scene with sensory descriptions, dialogue, and character interiority. Keep the meaning but add depth. Output 300-600 characters.\n\nText to expand:\n${ctx.selectedText ?? ctx.currentContent}`,
      };
    }
    case "rewrite": {
      return {
        system: `${systemBase}\n\n${contextBlock}`,
        user: `Rewrite the following passage in 3 different styles: 1) More formal/literary, 2) More colloquial/vivid, 3) More concise/tight. Separate each version with "---".\n\nText to rewrite:\n${ctx.selectedText ?? ctx.currentContent}`,
      };
    }
    case "unstuck": {
      return {
        system: `${systemBase}\n\n${contextBlock}`,
        user: `The writer is stuck at this point in the story. Current event: "${ctx.currentEvent?.title ?? "unknown"}". Their question/problem: "${ctx.userQuestion ?? "I don't know what should happen next."}"\n\nProvide 3 creative suggestions for how to proceed. Each suggestion should be 2-3 sentences describing a possible direction. Separate with "---".`,
      };
    }
  }
}

export function buildEventSuggestionPrompt(ctx: PromptContext): { system: string; user: string } {
  const contextBlock = buildContextBlock(ctx);
  return {
    system: `You are a professional Chinese fiction story architect. Based on the existing story events and world, suggest the next logical event. Output in Chinese.`,
    user: `${contextBlock}\n\nBased on the existing timeline, suggest 3 possible next events. For each, provide:\nTitle: [event title]\nWho: [characters involved]\nWhere: [location]\nWhat: [what happens]\nConsequence: [what this leads to]\n\nSeparate each suggestion with "---".`,
  };
}
