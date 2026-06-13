"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

type Translations = Record<string, string>;

const zh: Translations = {
  // Common
  "common.back": "\u8fd4\u56de",
  "common.save": "\u4fdd\u5b58",
  "common.cancel": "\u53d6\u6d88",
  "common.create": "\u521b\u5efa",
  "common.delete": "\u5220\u9664",
  "common.loading": "\u52a0\u8f7d中...",
  "common.add": "\u6dfb\u52a0",
  "common.close": "\u5173\u95ed",
  "common.all": "\u5168\u90e8",
  "common.chars": "\u5b57",

  // Landing
  "landing.login": "\u767b\u5f55",
  "landing.getStarted": "\u514d\u8d39\u5f00\u59cb",
  "landing.tagline": "AI辅助文学创造",
  "landing.heroTitle1": "\u7528\u4e8b\u4ef6\u9a71\u52a8\uff0c",
  "landing.heroTitle2": "\u5199\u51fa\u4f60\u7684\u6545\u4e8b",
  "landing.heroDesc": "\u5148\u642d\u5efa\u5173\u952e\u4e8b\u4ef6\u9aa8\u67b6\uff0c\u518d\u8ba9 AI \u5e2e\u4f60\u8865\u9f50\u5267\u60c5\u3001\u4eba\u7269\u548c\u4e16\u754c\u89c2\u3002\u66f4\u53ef\u63a7\u3001\u66f4\u8fde\u7eed\u3001\u66f4\u9002\u5408中\u6587\u521b\u4f5c\u8005\u7684\u5168\u65b0\u5199\u4f5c\u65b9\u5f0f\u3002",
  "landing.startWriting": "\u7acb\u5373\u5f00\u59cb\u521b\u4f5c",
  "landing.previewWorkspace": "\u9884\u89c8\u5de5\u4f5c\u53f0",
  "landing.previewLabel": "\u4e8b\u4ef6\u65f6\u95f4\u7ebf\u9884\u89c8",
  "landing.previewHint": "\u9009\u62e9\u4efb\u610f\u4e8b\u4ef6\u8fdb\u5165 AI \u8f85\u52a9\u5199\u4f5c\u6d41\u7a0b\u3002",
  "landing.feature1Title": "\u4e8b\u4ef6\u9a71\u52a8\u521b\u4f5c",
  "landing.feature1Desc": "\u50cf\u7535\u5f71\u7f16\u5267\u4e00\u6837\uff0c\u5148\u5217\u51fa\u5173\u952e\u4e8b\u4ef6\u8282\u62cd\uff0c\u518d\u9010\u4e2a\u5c55\u5f00\u4e3a\u5b8c\u6574\u573a\u666f\u3002\u907f\u514d\u5199\u5230\u4e00\u534a\u5361\u58f3\u3002",
  "landing.feature2Title": "AI \u591a\u6a21\u5f0f\u8f85\u52a9",
  "landing.feature2Desc": "\u7eed\u5199\u3001\u6269\u5199\u3001\u6539\u5199\u3001\u5361\u58f3\u6551\u63f4\uff0c\u56db\u79cd\u6a21\u5f0f\u8986\u76d6\u521b\u4f5c\u5168\u6d41\u7a0b\uff0cAI \u51fa\u5019\u9009\u4f60\u6765\u9009\u3002",
  "landing.feature3Title": "\u4eba\u7269\u4e0e\u4e16\u754c\u89c2\u8bb0\u5fc6",
  "landing.feature3Desc": "\u7edf\u4e00\u7ba1\u7406\u8bbe\u5b9a\uff0cAI \u5199\u4f5c\u65f6\u81ea\u52a8\u53c2\u8003\u5df2\u6709\u4eba\u7269\u548c\u4e16\u754c\u89c2\uff0c\u964d\u4f4e\u524d\u540e\u77db\u76fe\u3002",
  "landing.ctaTitle": "\u51c6\u5907\u597d\u5f00\u59cb\u4e86\u5417\uff1f",
  "landing.ctaDesc": "\u65e0\u9700\u4fe1\u7528\u5361\uff0c\u514d\u8d39\u521b\u5efa\u4f60\u7684\u7b2c\u4e00\u4e2a\u6545\u4e8b\u9879\u76ee\u3002",
  "landing.ctaButton": "\u5f00\u59cb\u521b\u4f5c",
  "landing.footer": "\u4e3a中\u6587\u5c0f\u8bf4\u4f5c\u5bb6\u800c\u751f\u3002",

  // Login
  "login.registerTitle": "\u6ce8\u518c StoryForge",
  "login.loginTitle": "\u767b\u5f55 StoryForge",
  "login.registerDesc": "\u521b\u5efa\u8d26\u53f7\uff0c\u5f00\u59cb\u4f60\u7684\u6545\u4e8b\u521b\u4f5c\u4e4b\u65c5\u3002",
  "login.loginDesc": "\u767b\u5f55\u540e\u7ee7\u7eed\u4f60\u7684\u6545\u4e8b\u521b\u4f5c\u3002",
  "login.username": "\u7528\u6237\u540d",
  "login.email": "\u90ae\u7bb1",
  "login.password": "\u5bc6\u7801",
  "login.createAccount": "\u521b\u5efa\u8d26\u53f7",
  "login.loginBtn": "\u767b\u5f55",
  "login.hasAccount": "\u5df2\u6709\u8d26\u53f7\uff1f",
  "login.noAccount": "\u8fd8\u6ca1\u6709\u8d26\u53f7\uff1f",
  "login.goLogin": "\u53bb\u767b\u5f55",
  "login.register": "\u6ce8\u518c",

  // Dashboard
  "dashboard.myStories": "\u6211\u7684\u6545\u4e8b",
  "dashboard.subtitle": "\u7528\u4e8b\u4ef6\u9a71\u52a8\u65b9\u5f0f\u642d\u5efa\u6545\u4e8b\u9aa8\u67b6\uff0c\u518d\u4ea4\u7ed9 AI \u586b\u5145\u7ec6\u8282\u3002",
  "dashboard.newStory": "\u65b0\u5efa\u6545\u4e8b",
  "dashboard.noStories": "\u8fd8\u6ca1\u6709\u6545\u4e8b",
  "dashboard.noStoriesHint": "\u70b9\u51fb\u4e0a\u65b9\u6309\u94ae\uff0c\u5f00\u59cb\u521b\u4f5c\u4f60\u7684\u7b2c\u4e00\u4e2a\u6545\u4e8b\u3002",
  "dashboard.continueWriting": "\u7ee7\u7eed\u5199\u4f5c",

  // Create Project Modal
  "modal.newStory": "\u65b0\u5efa\u6545\u4e8b",
  "modal.createProject": "\u521b\u5efa\u5199\u4f5c\u9879\u76ee",
  "modal.storyTitle": "\u6545\u4e8b\u6807\u9898",
  "modal.titlePlaceholder": "\u4f8b\u5982\uff1a\u82cd\u7a79\u88c2\u75d5",
  "modal.synopsis": "\u4e00\u53e5\u8bdd\u7b80\u4ecb",
  "modal.synopsisPlaceholder": "\u63cf\u8ff0\u6545\u4e8b\u7684\u6838\u5fc3\u51b2\u7a81\u548c\u770b\u70b9",
  "modal.genre": "\u9898\u6750\u7c7b\u578b",
  "modal.worldBrief": "\u4e16\u754c\u89c2\u7b80\u8ff0",
  "modal.worldBriefPlaceholder": "\u7b80\u8ff0\u6545\u4e8b\u53d1\u751f\u7684\u65f6\u4ee3\u3001\u79e9\u5e8f\u548c\u5173\u952e\u89c4\u5219\uff08\u53ef\u7a0d\u540e\u8865\u5145\uff09",
  "modal.era": "\u65f6\u4ee3\u8bbe\u5b9a",
  "modal.prevStep": "\u4e0a\u4e00\u6b65",
  "modal.nextStep": "\u4e0b\u4e00\u6b65",
  "modal.creating": "\u521b\u5efa中...",
  "modal.createStory": "\u521b\u5efa\u6545\u4e8b",

  // Project Nav
  "nav.workspace": "\u5de5\u4f5c\u53f0",
  "nav.events": "\u4e8b\u4ef6",
  "nav.characters": "\u4eba\u7269",
  "nav.world": "\u4e16\u754c\u89c2",
  "nav.timeline": "\u65f6\u95f4\u7ebf",

  // User Menu
  "menu.theme": "\u4e3b\u9898",
  "menu.auto": "\u81ea\u52a8",
  "menu.account": "\u8d26\u53f7\u8be6\u60c5",
  "menu.settings": "\u8bbe\u7f6e",
  "menu.language": "\u8bed\u8a00",

  // Workspace
  "ws.eventTimeline": "\u6545\u4e8b\u4e8b\u4ef6\u7ebf",
  "ws.characterMgmt": "\u4eba\u7269\u7ba1\u7406",
  "ws.worldSettings": "\u4e16\u754c\u89c2\u8bbe\u5b9a",
  "ws.selectEvent": "\u9009\u62e9\u4e00\u4e2a\u4e8b\u4ef6\u5f00\u59cb\u5199\u4f5c",
  "ws.selectEventHint": "\u4ece\u5de6\u4fa7\u9762\u677f\u9009\u62e9\u4e00\u4e2a\u4e8b\u4ef6\u5f00\u59cb\u5199\u4f5c\u3002",
  "ws.addFirstEvent": "\u70b9\u51fb + \u6dfb\u52a0\u4f60\u7684\u7b2c\u4e00\u4e2a\u4e8b\u4ef6\u3002",
  "ws.aiSuggestEvent": "AI \u63a8\u8350\u4e0b\u4e00\u4e2a\u4e8b\u4ef6",
  "ws.eventTitle": "\u4e8b\u4ef6\u6807\u9898",
  "ws.whoInvolved": "\u6d89\u53ca\u4eba\u7269",
  "ws.where": "\u5730\u70b9",
  "ws.whatHappened": "\u53d1\u751f\u4e86\u4ec0\u4e48",
  "ws.consequence": "\u540e\u679c",
  "ws.editingChar": "\u7f16\u8f91\u4eba\u7269",
  "ws.addChar": "\u6dfb\u52a0\u4eba\u7269",
  "ws.charName": "\u540d\u79f0",
  "ws.charRole": "\u89d2\u8272\uff08\u4e3b\u89d2 / \u914d\u89d2 / \u53cd\u6d3e\uff09",
  "ws.charPersonality": "\u6027\u683c\u7279\u70b9",
  "ws.charBackground": "\u80cc\u666f\u6545\u4e8b",
  "ws.editingWorld": "\u7f16\u8f91\u4e16\u754c\u89c2\u8bbe\u5b9a",
  "ws.addWorld": "\u6dfb\u52a0\u4e16\u754c\u89c2\u8bbe\u5b9a",
  "ws.worldName": "\u540d\u79f0",
  "ws.worldCategory": "\u5206\u7c7b\uff08\u5730\u7406 / \u52bf\u529b / \u529b\u91cf\u4f53\u7cfb\uff09",
  "ws.worldDesc": "\u63cf\u8ff0",
  "ws.save": "\u4fdd\u5b58",
  "ws.history": "\u5386\u53f2",
  "ws.export": "\u5bfc\u51fa",
  "ws.saving": "\u4fdd\u5b58中...",
  "ws.saved": "\u5df2\u4fdd\u5b58",
  "ws.unsaved": "\u672a\u4fdd\u5b58",
  "ws.historyVersions": "\u5386\u53f2\u7248\u672c",
  "ws.noHistory": "\u6682\u65e0\u5386\u53f2\u8bb0\u5f55\u3002",
  "ws.restore": "\u6062\u590d",
  "ws.eventInfo": "\u4e8b\u4ef6\uff1a",
  "ws.at": "\u5728",
  "ws.result": "\u7ed3\u679c\uff1a",
  "ws.editorPlaceholder": "\u5f00\u59cb\u4e3a\u201c{title}\u201d\u5199\u4f5c...",
  "ws.defaultPlaceholder": "\u5f00\u59cb\u5199\u4f5c\uff0c\u6216\u4f7f\u7528\u53f3\u4fa7\u7684 AI \u52a9\u624b...",
  "ws.unsavedWarning": "\u5f53\u524d\u5185\u5bb9\u5c1a\u672a\u4fdd\u5b58\uff0c\u786e\u5b9a\u79bb\u5f00\u5f53\u524d\u9875\u9762\u5417\uff1f",

  // AI Panel
  "ai.title": "AI \u5199\u4f5c\u52a9\u624b",
  "ai.model": "\u6a21\u578b",
  "ai.tokenUsage": "Token \u7528\u91cf",
  "ai.lastRequest": "\u672c\u6b21",
  "ai.used": "\u5df2\u7528",
  "ai.remaining": "\u5269\u4f59",
  "ai.usageBreakdown": "\u8f93\u5165 {prompt} / \u8f93\u51fa {completion}",
  "ai.outputLength": "\u8f93\u51fa\u957f\u5ea6",
  "ai.lengthAuto": "\u6a21\u578b\u81ea\u7531",
  "ai.lengthCustom": "\u81ea\u5b9a\u4e49",
  "ai.targetChars": "\u76ee\u6807",
  "ai.lengthAutoHint": "\u4e0d\u9650\u5b9a\u5b57\u6570\uff0c\u8ba9\u6a21\u578b\u6839\u636e\u5267\u60c5\u9700\u8981\u81ea\u7136\u51b3\u5b9a\u957f\u5ea6\u3002",
  "ai.continue": "\u7eed\u5199",
  "ai.expand": "\u6269\u5199",
  "ai.rewrite": "\u6539\u5199",
  "ai.unstuck": "\u5361\u58f3\u4e86",
  "ai.continueDesc": "\u4e3a\u4f60\u7684\u5f53\u524d\u6587\u672c\u751f\u6210\u591a\u4e2a\u7eed\u5199\u65b9\u6848\u3002",
  "ai.expandDesc": "\u5c06\u7b80\u77ed\u6bb5\u843d\u6269\u5199\u4e3a\u4e30\u5bcc\u3001\u7ec6\u8154\u7684\u5199\u4f5c\u3002",
  "ai.rewriteDesc": "\u7528\u4e0d\u540c\u98ce\u683c\u6539\u5199\uff1a\u6587\u5b66\u3001\u53e3\u8bed\u3001\u7cbe\u7ec3\u3002",
  "ai.unstuckDesc": "\u63cf\u8ff0\u4f60\u7684\u95ee\u9898\uff0c\u83b7\u53d6 3 \u4e2a\u521b\u610f\u65b9\u5411\u5efa\u8bae\u3002",
  "ai.unstuckPlaceholder": "\u4f8b\u5982\uff1a\u4e3b\u89d2\u521a\u901a\u8fc7\u8bd5\u70bc\uff0c\u4f46\u6211\u4e0d\u77e5\u9053\u600e\u6837\u81ea\u7136\u5730\u5f15\u51fa\u53cd\u6d3e...",
  "ai.generating": "\u751f\u6210中...",
  "ai.getIdeas": "\u83b7\u53d6\u7075\u611f",
  "ai.generate": "\u751f\u6210",
  "ai.results": "\u7ed3\u679c",
  "ai.applyToEditor": "\u5e94\u7528\u5230\u7f16\u8f91\u5668",
  "ai.appliedToEditor": "\u5df2\u5e94\u7528\u5230\u7f16\u8f91\u5668",
  "ai.appliedNotice": "\u5df2\u6dfb\u52a0\u5230\u7f16\u8f91\u5668",
  "ai.genFailed": "AI \u751f\u6210\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002",
  "ai.suggestFailed": "\u4e8b\u4ef6\u63a8\u8350\u5931\u8d25\u3002",

  // Characters Page
  "chars.title": "\u4eba\u7269\u7ba1\u7406",
  "chars.subtitle": "\u7ba1\u7406\u6545\u4e8b中\u7684\u6240\u6709\u4eba\u7269\u3002\u70b9\u51fb\u5361\u7247\u8fdb\u884c\u7f16\u8f91\u3002",
  "chars.newChar": "\u65b0\u5efa\u4eba\u7269",
  "chars.newCharForm": "\u65b0\u5efa\u4eba\u7269",
  "chars.editCharForm": "\u7f16\u8f91\u4eba\u7269",
  "chars.empty": "\u6682\u65e0\u4eba\u7269\u3002\u70b9\u51fb\u201c\u65b0\u5efa\u4eba\u7269\u201d\u521b\u5efa\u4e00\u4e2a\u3002",
  "chars.name": "\u540d\u79f0 *",
  "chars.role": "\u89d2\u8272",
  "chars.rolePlaceholder": "\u4f8b\u5982\uff1a\u4e3b\u89d2\u3001\u53cd\u6d3e\u3001\u5bfc\u5e08",
  "chars.personality": "\u6027\u683c",
  "chars.personalityPlaceholder": "\u6838\u5fc3\u6027\u683c\u7279\u5f81",
  "chars.background": "\u80cc\u666f",
  "chars.backgroundPlaceholder": "\u80cc\u666f\u6545\u4e8b\u548c\u7ecf\u5386",
  "chars.appearance": "\u5916\u8c8c",
  "chars.appearancePlaceholder": "\u5916\u8c8c\u63cf\u8ff0",
  "chars.description": "\u8865\u5145\u8bf4\u660e",
  "chars.descriptionPlaceholder": "\u5176\u4ed6\u5907\u6ce8",
  "chars.saveChanges": "\u4fdd\u5b58\u4fee\u6539",

  // Events Page
  "events.title": "\u4e8b\u4ef6\u7ba1\u7406",
  "events.subtitle": "\u7ba1\u7406\u6240\u6709\u6545\u4e8b\u4e8b\u4ef6\u3002\u4e8b\u4ef6\u63a8\u52a8\u53d9\u4e8b\u524d\u8fdb\u3002",
  "events.newEvent": "\u65b0\u5efa\u4e8b\u4ef6",
  "events.newEventForm": "\u65b0\u5efa\u4e8b\u4ef6",
  "events.editEventForm": "\u7f16\u8f91\u4e8b\u4ef6",
  "events.empty": "\u6682\u65e0\u4e8b\u4ef6\u3002\u70b9\u51fb\u201c\u65b0\u5efa\u4e8b\u4ef6\u201d\u521b\u5efa\u4e00\u4e2a\u3002",
  "events.titleLabel": "\u6807\u9898 *",
  "events.who": "\u4eba\u7269",
  "events.whoPlaceholder": "\u6d89\u53ca\u7684\u4eba\u7269",
  "events.where": "\u5730\u70b9",
  "events.wherePlaceholder": "\u5730\u70b9",
  "events.whatHappened": "\u53d1\u751f\u4e86\u4ec0\u4e48",
  "events.whatPlaceholder": "\u63cf\u8ff0\u8fd9\u4e2a\u4e8b\u4ef6中\u53d1\u751f\u7684\u4e8b\u60c5",
  "events.consequence": "\u540e\u679c",
  "events.consequencePlaceholder": "\u8fd9\u4e2a\u4e8b\u4ef6\u5bfc\u81f4\u7684\u7ed3\u679c",
  "events.saveChanges": "\u4fdd\u5b58\u4fee\u6539",

  // World Page
  "world.title": "\u4e16\u754c\u89c2\u8bbe\u5b9a",
  "world.subtitle": "\u6784\u5efa\u4f60\u7684\u4e16\u754c\uff1a\u529b\u91cf\u4f53\u7cfb\u3001\u5730\u7406\u3001\u52bf\u529b\u3001\u6587\u5316\u7b49\u3002",
  "world.newSetting": "\u65b0\u5efa\u8bbe\u5b9a",
  "world.newSettingForm": "\u65b0\u5efa\u8bbe\u5b9a",
  "world.editSettingForm": "\u7f16\u8f91\u8bbe\u5b9a",
  "world.emptyAll": "\u6682\u65e0\u4e16\u754c\u89c2\u8bbe\u5b9a\u3002\u70b9\u51fb\u201c\u65b0\u5efa\u8bbe\u5b9a\u201d\u521b\u5efa\u4e00\u4e2a\u3002",
  "world.emptyCategory": "\u8be5\u5206\u7c7b\u4e0b\u6ca1\u6709\u8bbe\u5b9a\u3002",
  "world.category": "\u5206\u7c7b",
  "world.categoryPlaceholder": "\u4f8b\u5982\uff1a\u5730\u7406\u3001\u529b\u91cf\u4f53\u7cfb\u3001\u52bf\u529b",
  "world.name": "\u540d\u79f0 *",
  "world.descLabel": "\u63cf\u8ff0",
  "world.descPlaceholder": "\u8be6\u7ec6\u63cf\u8ff0\u8fd9\u4e2a\u4e16\u754c\u5143\u7d20",
  "world.saveChanges": "\u4fdd\u5b58\u4fee\u6539",

  // Timeline Page
  "timeline.title": "\u65f6\u95f4\u7ebf",
  "timeline.subtitle": "\u6309\u65f6\u95f4\u987a\u5e8f\u53ef\u89c6\u5316\u5c55\u793a\u6240\u6709\u6545\u4e8b\u4e8b\u4ef6\u53ca\u4eba\u7269\u5173\u8054\u3002",
  "timeline.empty": "\u6682\u65e0\u4e8b\u4ef6\u3002\u5728\u4e8b\u4ef6\u9875\u6216\u5de5\u4f5c\u53f0\u6dfb\u52a0\u4e8b\u4ef6\u540e\u53ef\u67e5\u770b\u65f6\u95f4\u7ebf\u3002",
  "timeline.location": "\u5730\u70b9\uff1a",
  "timeline.consequence": "\u540e\u679c\uff1a",
  "timeline.involved": "\u53c2\u4e0e\u4eba\u7269\uff1a",
  "timeline.charAppearances": "\u4eba\u7269\u51fa\u573a\u7edf\u8ba1",

  // Account Page
  "account.title": "\u8d26\u53f7\u8be6\u60c5",
  "account.backToDashboard": "\u8fd4\u56de\u4e3b\u9875",
  "account.displayName": "\u663e\u793a\u540d\u79f0",
  "account.email": "\u90ae\u7bb1",
  "account.saveProfile": "\u4fdd\u5b58\u8d44\u6599",

  // Settings Page
  "settings.title": "\u8bbe\u7f6e",
  "settings.backToDashboard": "\u8fd4\u56de\u4e3b\u9875",
  "settings.writingPrefs": "\u5199\u4f5c\u504f\u597d",
  "settings.writingPrefsDesc": "\u63a7\u5236\u5199\u4f5c\u5de5\u4f5c\u53f0\u7684\u9ed8\u8ba4\u884c\u4e3a\u3002",
  "settings.autoSave": "\u8f93\u5165\u65f6\u81ea\u52a8\u4fdd\u5b58",
  "settings.showAI": "\u9ed8\u8ba4\u663e\u793a AI \u5efa\u8bae\u9762\u677f",
  "settings.save": "\u4fdd\u5b58\u8bbe\u7f6e",

  // 404 / Error / Loading
  "notFound.title": "\u9875\u9762\u672a\u627e\u5230",
  "notFound.desc": "\u4f60\u8bbf\u95ee\u7684\u9875\u9762\u4e0d\u5b58\u5728\u3002",
  "notFound.backHome": "\u8fd4\u56de\u9996\u9875",
  "error.title": "\u51fa\u9519\u4e86",
  "error.tryAgain": "\u91cd\u8bd5",
};

const en: Translations = {
  // Common
  "common.back": "Back",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.create": "Create",
  "common.delete": "Delete",
  "common.loading": "Loading...",
  "common.add": "Add",
  "common.close": "Close",
  "common.all": "All",
  "common.chars": "chars",

  // Landing
  "landing.login": "Login",
  "landing.getStarted": "Get Started Free",
  "landing.tagline": "AI-Assisted Literary Creation",
  "landing.heroTitle1": "Event-driven,",
  "landing.heroTitle2": "Write your story",
  "landing.heroDesc": "Build your key event skeleton first, then let AI help you fill in the plot, characters and world. A more controllable, continuous, and Chinese-writer-friendly creative method.",
  "landing.startWriting": "Start Writing Now",
  "landing.previewWorkspace": "Preview Workspace",
  "landing.previewLabel": "Event Timeline Preview",
  "landing.previewHint": "Select any event to enter the AI-assisted writing flow.",
  "landing.feature1Title": "Event-Driven Creation",
  "landing.feature1Desc": "Like a screenwriter, list key event beats first, then expand each into a full scene. No more getting stuck halfway.",
  "landing.feature2Title": "AI Multi-Mode Assist",
  "landing.feature2Desc": "Continue, expand, rewrite, rescue from blocks \u2014 four modes covering the full creative flow. AI proposes, you choose.",
  "landing.feature3Title": "Character & World Memory",
  "landing.feature3Desc": "Unified settings management. AI automatically references existing characters and world during writing, reducing contradictions.",
  "landing.ctaTitle": "Ready to get started?",
  "landing.ctaDesc": "No credit card required. Create your first story project for free.",
  "landing.ctaButton": "Start Writing",
  "landing.footer": "Built for Chinese fiction writers.",

  // Login
  "login.registerTitle": "Register StoryForge",
  "login.loginTitle": "Login StoryForge",
  "login.registerDesc": "Create an account and start your creative journey.",
  "login.loginDesc": "Login to continue your story.",
  "login.username": "Username",
  "login.email": "Email",
  "login.password": "Password",
  "login.createAccount": "Create Account",
  "login.loginBtn": "Login",
  "login.hasAccount": "Already have an account?",
  "login.noAccount": "Don\u2019t have an account?",
  "login.goLogin": "Login",
  "login.register": "Register",

  // Dashboard
  "dashboard.myStories": "My Stories",
  "dashboard.subtitle": "Build your story skeleton with events, then let AI fill in the details.",
  "dashboard.newStory": "New Story",
  "dashboard.noStories": "No stories yet",
  "dashboard.noStoriesHint": "Click the button above to create your first story.",
  "dashboard.continueWriting": "Continue Writing",

  // Create Project Modal
  "modal.newStory": "New Story",
  "modal.createProject": "Create Writing Project",
  "modal.storyTitle": "Story Title",
  "modal.titlePlaceholder": "e.g. The Rift",
  "modal.synopsis": "One-Line Synopsis",
  "modal.synopsisPlaceholder": "Describe the core conflict and appeal",
  "modal.genre": "Genre",
  "modal.worldBrief": "World Brief",
  "modal.worldBriefPlaceholder": "Describe the era, order and key rules (can be added later)",
  "modal.era": "Era Setting",
  "modal.prevStep": "Previous",
  "modal.nextStep": "Next",
  "modal.creating": "Creating...",
  "modal.createStory": "Create Story",

  // Project Nav
  "nav.workspace": "Workspace",
  "nav.events": "Events",
  "nav.characters": "Characters",
  "nav.world": "World",
  "nav.timeline": "Timeline",

  // User Menu
  "menu.theme": "Theme",
  "menu.auto": "Auto",
  "menu.account": "Account Details",
  "menu.settings": "Settings",
  "menu.language": "Language",

  // Workspace
  "ws.eventTimeline": "Event Timeline",
  "ws.characterMgmt": "Characters",
  "ws.worldSettings": "World Settings",
  "ws.selectEvent": "Select an event to start writing",
  "ws.selectEventHint": "Select an event from the left panel to begin writing.",
  "ws.addFirstEvent": "Click + to add your first event.",
  "ws.aiSuggestEvent": "AI Suggest Next Event",
  "ws.eventTitle": "Event title",
  "ws.whoInvolved": "Who is involved",
  "ws.where": "Where",
  "ws.whatHappened": "What happened",
  "ws.consequence": "Consequence",
  "ws.editingChar": "Editing character",
  "ws.addChar": "Add character",
  "ws.charName": "Name",
  "ws.charRole": "Role (Protagonist / Supporting / Antagonist)",
  "ws.charPersonality": "Personality traits",
  "ws.charBackground": "Background story",
  "ws.editingWorld": "Editing world setting",
  "ws.addWorld": "Add world setting",
  "ws.worldName": "Name",
  "ws.worldCategory": "Category (Geography / Faction / Power System)",
  "ws.worldDesc": "Description",
  "ws.save": "Save",
  "ws.history": "History",
  "ws.export": "Export",
  "ws.saving": "Saving...",
  "ws.saved": "Saved",
  "ws.unsaved": "Unsaved",
  "ws.historyVersions": "History Versions",
  "ws.noHistory": "No history yet.",
  "ws.restore": "Restore",
  "ws.eventInfo": "Event:",
  "ws.at": "at",
  "ws.result": "Result:",
  "ws.editorPlaceholder": "Start writing the scene for \"{title}\"...",
  "ws.defaultPlaceholder": "Start writing, or use the AI assistant on the right...",
  "ws.unsavedWarning": "You have unsaved changes. Are you sure you want to leave?",

  // AI Panel
  "ai.title": "AI Writing Assistant",
  "ai.model": "Model",
  "ai.tokenUsage": "Token usage",
  "ai.lastRequest": "Last",
  "ai.used": "Used",
  "ai.remaining": "Left",
  "ai.usageBreakdown": "Input {prompt} / output {completion}",
  "ai.outputLength": "Output length",
  "ai.lengthAuto": "Model decides",
  "ai.lengthCustom": "Custom",
  "ai.targetChars": "Target",
  "ai.lengthAutoHint": "Do not force a fixed length. Let the model choose a natural length for the story moment.",
  "ai.continue": "Continue",
  "ai.expand": "Expand",
  "ai.rewrite": "Rewrite",
  "ai.unstuck": "Stuck",
  "ai.continueDesc": "Generate multiple continuation options for your current text.",
  "ai.expandDesc": "Expand a brief passage into rich, detailed writing.",
  "ai.rewriteDesc": "Rewrite in different styles: literary, colloquial, and concise.",
  "ai.unstuckDesc": "Describe your problem and get 3 creative direction suggestions.",
  "ai.unstuckPlaceholder": "e.g. My protagonist just passed the trial, but I don\u2019t know how to naturally introduce the antagonist...",
  "ai.generating": "Generating...",
  "ai.getIdeas": "Get Ideas",
  "ai.generate": "Generate",
  "ai.results": "Results",
  "ai.applyToEditor": "Apply to editor",
  "ai.appliedToEditor": "Applied to editor",
  "ai.appliedNotice": "Added to editor",
  "ai.genFailed": "AI generation failed. Please try again.",
  "ai.suggestFailed": "Event suggestion failed.",

  // Characters Page
  "chars.title": "Characters",
  "chars.subtitle": "Manage all characters in this story. Click a card to edit.",
  "chars.newChar": "New Character",
  "chars.newCharForm": "New Character",
  "chars.editCharForm": "Edit Character",
  "chars.empty": "No characters yet. Click \"New Character\" to create one.",
  "chars.name": "Name *",
  "chars.role": "Role",
  "chars.rolePlaceholder": "e.g. Protagonist, Antagonist, Mentor",
  "chars.personality": "Personality",
  "chars.personalityPlaceholder": "Key personality traits",
  "chars.background": "Background",
  "chars.backgroundPlaceholder": "Backstory and history",
  "chars.appearance": "Appearance",
  "chars.appearancePlaceholder": "Physical description",
  "chars.description": "Description",
  "chars.descriptionPlaceholder": "Additional notes",
  "chars.saveChanges": "Save Changes",

  // Events Page
  "events.title": "Events",
  "events.subtitle": "Manage all story events. Events drive the narrative forward.",
  "events.newEvent": "New Event",
  "events.newEventForm": "New Event",
  "events.editEventForm": "Edit Event",
  "events.empty": "No events yet. Click \"New Event\" to create one.",
  "events.titleLabel": "Title *",
  "events.who": "Who",
  "events.whoPlaceholder": "Characters involved",
  "events.where": "Where",
  "events.wherePlaceholder": "Location",
  "events.whatHappened": "What Happened",
  "events.whatPlaceholder": "Describe what happens in this event",
  "events.consequence": "Consequence",
  "events.consequencePlaceholder": "What results from this event",
  "events.saveChanges": "Save Changes",

  // World Page
  "world.title": "World Settings",
  "world.subtitle": "Build your world: power systems, geography, factions, cultures, and more.",
  "world.newSetting": "New Setting",
  "world.newSettingForm": "New Setting",
  "world.editSettingForm": "Edit Setting",
  "world.emptyAll": "No world settings yet. Click \"New Setting\" to create one.",
  "world.emptyCategory": "No settings in this category.",
  "world.category": "Category",
  "world.categoryPlaceholder": "e.g. Geography, Power System, Faction",
  "world.name": "Name *",
  "world.descLabel": "Description",
  "world.descPlaceholder": "Detailed description of this world element",
  "world.saveChanges": "Save Changes",

  // Timeline Page
  "timeline.title": "Timeline",
  "timeline.subtitle": "A visual overview of all story events in chronological order with character connections.",
  "timeline.empty": "No events yet. Add events in the Events or Workspace pages to see the timeline.",
  "timeline.location": "Location: ",
  "timeline.consequence": "Consequence: ",
  "timeline.involved": "Involved: ",
  "timeline.charAppearances": "Character Appearances",

  // Account Page
  "account.title": "Account Details",
  "account.backToDashboard": "Back to Dashboard",
  "account.displayName": "Display Name",
  "account.email": "Email",
  "account.saveProfile": "Save Profile",

  // Settings Page
  "settings.title": "Settings",
  "settings.backToDashboard": "Back to Dashboard",
  "settings.writingPrefs": "Writing Preferences",
  "settings.writingPrefsDesc": "Control default behavior for your writing workspace.",
  "settings.autoSave": "Auto save while typing",
  "settings.showAI": "Show AI suggestions panel by default",
  "settings.save": "Save Settings",

  // 404 / Error / Loading
  "notFound.title": "Page Not Found",
  "notFound.desc": "The page you are looking for does not exist.",
  "notFound.backHome": "Back to Home",
  "error.title": "Something went wrong",
  "error.tryAgain": "Try again",
};

const dictionaries: Record<Locale, Translations> = { zh, en };

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextType>({
  locale: "zh",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "zh";
    return (localStorage.getItem("locale") as Locale | null) ?? "zh";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => {
      let text = dictionaries[locale][key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, v);
        }
      }
      return text;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  return useContext(I18nContext).t;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  return (
    <div className={`inline-flex rounded-md border border-border text-xs ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={`rounded-l-md px-2 py-1 transition ${
          locale === "zh" ? "bg-accent/20 text-accent" : "text-muted hover:bg-surface-2"
        }`}
      >
        中
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-r-md px-2 py-1 transition ${
          locale === "en" ? "bg-accent/20 text-accent" : "text-muted hover:bg-surface-2"
        }`}
      >
        EN
      </button>
    </div>
  );
}
