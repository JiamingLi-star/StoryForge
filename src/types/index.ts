export type Genre = "玄幻" | "修仙" | "都市" | "言情" | "悬疑" | "科幻" | "历史" | "其他";

export type Project = {
  id: string;
  user_id: string;
  title: string;
  genre: Genre;
  synopsis: string;
  world_brief: string;
  created_at: string;
  updated_at: string;
};

export type StoryEvent = {
  id: string;
  project_id: string;
  title: string;
  who: string;
  where: string;
  what_happened: string;
  consequence: string;
  sort_order: number;
  created_at: string;
};

export type Scene = {
  id: string;
  event_id: string;
  content: string;
  sort_order: number;
  updated_at: string;
};

export type SceneHistory = {
  id: string;
  event_id: string;
  content: string;
  created_at: string;
};

export type Character = {
  id: string;
  project_id: string;
  name: string;
  role: string;
  description: string;
  personality: string;
  background: string;
  appearance: string;
};

export type WorldSetting = {
  id: string;
  project_id: string;
  category: string;
  name: string;
  description: string;
};

export type AIMode = "continue" | "expand" | "rewrite" | "unstuck";
