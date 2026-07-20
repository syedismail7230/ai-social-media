import {
  Conversation,
  Message,
  Lead,
  KnowledgeItem,
  LearningItem,
  ManagedLink,
  ObjectionItem,
  AiPersonality,
  AiLog,
  SystemDiagnostics,
} from "@/types";

export const initialPersonalities: AiPersonality[] = [
  {
    id: "p1",
    name: "Luxury & Exclusive",
    description: "Refined, sophisticated, highly courteous tone designed for high-ticket clients.",
    tone: "Polished, elite, respectful",
    greetingStyle: "Welcome to Zawr. It is a pleasure to assist you.",
    formality: "high",
    emojiUsage: "none",
    ctaStyle: "Invite to an exclusive private strategy session via {{meeting}}",
    isDefault: true,
  },
  {
    id: "p2",
    name: "Consultative Sales",
    description: "Proactive, value-driven sales agent focused on identifying customer needs.",
    tone: "Persuasive, authoritative, helpful",
    greetingStyle: "Hi! Thanks for reaching out to Zawr. How can we assist your business today?",
    formality: "medium",
    emojiUsage: "minimal",
    ctaStyle: "Direct recommendation to book a consultation at {{meeting}}",
  },
  {
    id: "p3",
    name: "Minimal & Direct",
    description: "Crisp, concise, Vercel-inspired clarity with zero fluff.",
    tone: "Direct, precise, efficient",
    greetingStyle: "Hello. How can Zawr assist your team?",
    formality: "medium",
    emojiUsage: "none",
    ctaStyle: "Schedule at {{meeting}}",
  },
];

export const initialManagedLinks: ManagedLink[] = [
  {
    id: "l1",
    key: "{{website}}",
    title: "Official Website",
    url: "https://zawr.ai",
    description: "Main company homepage",
    clicks: 0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "l2",
    key: "{{pricing}}",
    title: "Pricing & Plans",
    url: "https://zawr.ai/pricing",
    description: "Complete service tier breakdown",
    clicks: 0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "l3",
    key: "{{meeting}}",
    title: "Executive Strategy Session",
    url: "https://cal.com/zawr/strategy-session",
    description: "Direct booking calendar link",
    clicks: 0,
    updatedAt: new Date().toISOString(),
  },
];

// Clean 100% Real-Time Stores (0 Mock Data)
export const initialKnowledge: KnowledgeItem[] = [];
export const initialObjections: ObjectionItem[] = [];
export const initialLeads: Lead[] = [];
export const initialConversations: Conversation[] = [];
export const initialMessages: Record<string, Message[]> = {};
export const initialLearningQueue: LearningItem[] = [];
export const initialLogs: AiLog[] = [];

export const initialDiagnostics: SystemDiagnostics = {
  instagramConnected: true,
  databaseHealthy: true,
  aiProviderConnected: true,
  webhookActive: true,
  deploymentHealthy: true,
  storageHealthy: true,
  knowledgeIndexedCount: 0,
  notificationsWorking: true,
  missingKeys: [],
};
