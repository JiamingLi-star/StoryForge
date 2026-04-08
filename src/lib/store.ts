import type { Project, StoryEvent, Character, WorldSetting, Scene, SceneHistory } from "@/types";

let nextId = 100;
function genId() {
  return `local-${++nextId}`;
}

const DEMO_PROJECT: Project = {
  id: "project-1",
  user_id: "demo",
  title: "苍穹裂痕",
  genre: "玄幻",
  synopsis: "少年在边城发现禁忌天书，被迫卷入九州权力风暴。",
  world_brief: "九州大陆，修行者以命纹共鸣天地，分九阶。宗门长老会掌权。",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_PROJECTS: Project[] = [
  DEMO_PROJECT,
  {
    id: "project-2",
    user_id: "demo",
    title: "雾港疑云",
    genre: "悬疑",
    synopsis: "一场失踪案牵出旧城二十年前的沉船秘密。",
    world_brief: "现代港口城市，暗流涌动。",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "project-3",
    user_id: "demo",
    title: "星海归航",
    genre: "科幻",
    synopsis: "远征舰返航后，船员发现地球历史被悄然改写。",
    world_brief: "公元2400年，人类已殖民三个星系。",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEMO_EVENTS: StoryEvent[] = [
  {
    id: "event-1",
    project_id: "project-1",
    title: "边城夜袭",
    who: "顾临、黑市追兵",
    where: "离火边城",
    what_happened: "顾临在黑市交易中意外拿到古卷，遭追杀",
    consequence: "被迫带着古卷逃离边城",
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "event-2",
    project_id: "project-1",
    title: "初见天书",
    who: "顾临、师姐沈鸢",
    where: "破庙密室",
    what_happened: "古卷显化，天书认主并展示第一道命纹",
    consequence: "两人确认古卷与顾临血脉有关",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "event-3",
    project_id: "project-1",
    title: "宗门试炼",
    who: "顾临、各峰弟子",
    where: "青岳宗试炼场",
    what_happened: "顾临在试炼中暴露异常能力",
    consequence: "长老会注意到他并准备调查",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
];

const DEMO_CHARACTERS: Character[] = [
  {
    id: "char-1",
    project_id: "project-1",
    name: "顾临",
    role: "主角",
    description: "边城药铺学徒，真实身世不明",
    personality: "冷静、隐忍、重情义",
    background: "自幼被药铺老板收养，对自己的过去一无所知",
    appearance: "少年身形，目光深沉，左手腕有奇特印记",
  },
  {
    id: "char-2",
    project_id: "project-1",
    name: "沈鸢",
    role: "导师型伙伴",
    description: "青岳宗外门师姐，暗中调查宗门旧案",
    personality: "敏锐、克制、外冷内热",
    background: "宗门高层之后，因父母失踪而暗中追查真相",
    appearance: "清冷气质，常着素色长衫",
  },
  {
    id: "char-3",
    project_id: "project-1",
    name: "韩彻",
    role: "反派",
    description: "长老会执令使，奉命追查天书并清除线索",
    personality: "强势、偏执、手段狠辣",
    background: "长老会嫡系培养，对宗门秩序有极端信仰",
    appearance: "高大威严，右眼有一道旧伤疤",
  },
];

const DEMO_WORLD: WorldSetting[] = [
  {
    id: "ws-1",
    project_id: "project-1",
    category: "力量体系",
    name: "九州命纹体系",
    description: "修行者以命纹共鸣天地，分九阶，每阶需要对应仪式。",
  },
  {
    id: "ws-2",
    project_id: "project-1",
    category: "地理",
    name: "离火边城",
    description: "九州最南要塞，黑市繁荣，情报与走私交错。",
  },
  {
    id: "ws-3",
    project_id: "project-1",
    category: "势力",
    name: "长老会",
    description: "宗门上层治理机构，内部派系斗争长期激烈。",
  },
];

const DEMO_SCENES: Scene[] = [
  {
    id: "scene-1",
    event_id: "event-1",
    content: "顾临在边城雨夜奔逃，衣摆浸透泥水。他怀中的古卷却在发烫，像在引导他走向某个注定的方向。\n\n身后的追兵越来越近，靴底踩在石板上的声音像催命的鼓点。",
    sort_order: 0,
    updated_at: new Date().toISOString(),
  },
];

class LocalStore {
  projects: Project[] = [...DEMO_PROJECTS];
  events: StoryEvent[] = [...DEMO_EVENTS];
  characters: Character[] = [...DEMO_CHARACTERS];
  worldSettings: WorldSetting[] = [...DEMO_WORLD];
  scenes: Scene[] = [...DEMO_SCENES];
  sceneHistory: SceneHistory[] = DEMO_SCENES.map((scene) => ({
    id: genId(),
    event_id: scene.event_id,
    content: scene.content,
    created_at: scene.updated_at,
  }));

  getProjects(): Project[] {
    return this.projects;
  }

  getProject(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(data: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">): Project {
    const project: Project = {
      ...data,
      id: genId(),
      user_id: "demo",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.projects.push(project);
    return project;
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.events = this.events.filter((e) => e.project_id !== id);
    this.characters = this.characters.filter((c) => c.project_id !== id);
    this.worldSettings = this.worldSettings.filter((w) => w.project_id !== id);
  }

  getEvents(projectId: string): StoryEvent[] {
    return this.events.filter((e) => e.project_id === projectId).sort((a, b) => a.sort_order - b.sort_order);
  }

  createEvent(data: Omit<StoryEvent, "id" | "created_at">): StoryEvent {
    const event: StoryEvent = {
      ...data,
      id: genId(),
      created_at: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  }

  updateEvent(id: string, data: Partial<StoryEvent>) {
    this.events = this.events.map((e) => (e.id === id ? { ...e, ...data } : e));
  }

  deleteEvent(id: string) {
    this.events = this.events.filter((e) => e.id !== id);
    this.scenes = this.scenes.filter((s) => s.event_id !== id);
  }

  reorderEvents(projectId: string, orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      this.events = this.events.map((e) =>
        e.id === id ? { ...e, sort_order: index } : e
      );
    });
  }

  getCharacters(projectId: string): Character[] {
    return this.characters.filter((c) => c.project_id === projectId);
  }

  createCharacter(data: Omit<Character, "id">): Character {
    const character: Character = { ...data, id: genId() };
    this.characters.push(character);
    return character;
  }

  updateCharacter(id: string, data: Partial<Character>) {
    this.characters = this.characters.map((c) => (c.id === id ? { ...c, ...data } : c));
  }

  deleteCharacter(id: string) {
    this.characters = this.characters.filter((c) => c.id !== id);
  }

  getWorldSettings(projectId: string): WorldSetting[] {
    return this.worldSettings.filter((w) => w.project_id === projectId);
  }

  createWorldSetting(data: Omit<WorldSetting, "id">): WorldSetting {
    const setting: WorldSetting = { ...data, id: genId() };
    this.worldSettings.push(setting);
    return setting;
  }

  updateWorldSetting(id: string, data: Partial<WorldSetting>) {
    this.worldSettings = this.worldSettings.map((w) => (w.id === id ? { ...w, ...data } : w));
  }

  deleteWorldSetting(id: string) {
    this.worldSettings = this.worldSettings.filter((w) => w.id !== id);
  }

  getScene(eventId: string): Scene | undefined {
    return this.scenes.find((s) => s.event_id === eventId);
  }

  upsertScene(eventId: string, content: string) {
    const existing = this.scenes.find((s) => s.event_id === eventId);
    if (existing) {
      if (existing.content === content) return;
      this.scenes = this.scenes.map((s) =>
        s.event_id === eventId ? { ...s, content, updated_at: new Date().toISOString() } : s
      );
    } else {
      this.scenes.push({
        id: genId(),
        event_id: eventId,
        content,
        sort_order: 0,
        updated_at: new Date().toISOString(),
      });
    }

    this.sceneHistory.unshift({
      id: genId(),
      event_id: eventId,
      content,
      created_at: new Date().toISOString(),
    });
  }

  getSceneHistory(eventId: string): SceneHistory[] {
    return this.sceneHistory.filter((version) => version.event_id === eventId);
  }

  restoreSceneFromHistory(eventId: string, historyId: string) {
    const version = this.sceneHistory.find(
      (item) => item.event_id === eventId && item.id === historyId
    );
    if (!version) return;
    this.upsertScene(eventId, version.content);
  }
}

export const store = new LocalStore();
