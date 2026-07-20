export type AiProvider =
  | "gemini"
  | "groq"
  | "openrouter"
  | "openai"
  | "anthropic"
  | "deepseek"
  | "mistral"
  | "ollama";

export type Channel =
  | "instagram"
  | "whatsapp"
  | "messenger"
  | "webchat"
  | "telegram"
  | "discord"
  | "email";

export type MessageSender = "customer" | "ai" | "owner";

export type DecisionRoute = "auto_reply" | "draft_approval" | "escalated_pending";

export type LeadTemperature = "hot" | "warm" | "cold";

export type LeadStatus =
  | "new"
  | "qualifying"
  | "qualified"
  | "in_discussion"
  | "meeting_booked"
  | "proposal_sent"
  | "closed_won"
  | "closed_lost";

export type KnowledgeCategory =
  | "sales"
  | "support"
  | "pricing"
  | "products"
  | "services"
  | "legal"
  | "hr"
  | "policies"
  | "faq"
  | "company";

export type LearningStatus = "pending" | "approved" | "rejected" | "merged";

export interface Conversation {
  id: string;
  channel: Channel;
  customerUsername: string;
  customerName: string;
  customerAvatar?: string;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
  tags: string[];
  leadScore: number;
  leadTemperature: LeadTemperature;
  aiSummary: string;
  assignedPersonalityId: string;
  status: "active" | "archived" | "starred" | "pending";
  internalNotes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  confidenceScore: number; // 0 - 100
  decisionRoute: DecisionRoute;
  tokensUsed?: number;
  latencyMs?: number;
  provider?: AiProvider;
  createdAt: string;
  isDraft?: boolean;
}

export interface Lead {
  id: string;
  instagramUsername: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  industry?: string;
  budgetRange?: string;
  timeline?: string;
  decisionMaker: boolean | "unknown";
  leadScore: number; // 0 - 100
  leadTemperature: LeadTemperature;
  status: LeadStatus;
  expectedValue: number;
  priority: "low" | "medium" | "high" | "vip";
  tags: string[];
  notes: string;
  aiSummary: string;
  conversationCount: number;
  lastContactAt: string;
  preferredPersonality?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  sourceType: "text" | "markdown" | "pdf" | "url";
  sourceUrl?: string;
  version: number;
  isActive: boolean;
  indexedAt: string;
  updatedAt: string;
}

export interface LearningItem {
  id: string;
  question: string;
  customerUsername: string;
  conversationId: string;
  aiSuggestion: string;
  ownerAnswer?: string;
  status: LearningStatus;
  createdAt: string;
  category: KnowledgeCategory;
}

export interface ManagedLink {
  id: string;
  key: string; // e.g. {{website}}, {{pricing}}
  title: string;
  url: string;
  description: string;
  clicks: number;
  updatedAt: string;
}

export interface ObjectionItem {
  id: string;
  category: "price" | "timeline" | "trust" | "competitor" | "support";
  objection: string;
  approvedStrategy: string;
  counterScript: string;
}

export interface AiPersonality {
  id: string;
  name: string;
  description: string;
  tone: string; // e.g. "Luxury", "Corporate", "Minimal", "Sales-Driven"
  greetingStyle: string;
  formality: "high" | "medium" | "casual";
  emojiUsage: "none" | "minimal" | "frequent";
  ctaStyle: string;
  isDefault?: boolean;
}

export interface AiLog {
  id: string;
  conversationId: string;
  customerUsername: string;
  prompt: string;
  knowledgeUsed: string[];
  confidenceScore: number;
  provider: AiProvider;
  model: string;
  tokensTotal: number;
  latencyMs: number;
  decisionRoute: DecisionRoute;
  ownerApproved?: boolean;
  replyText: string;
  error?: string;
  timestamp: string;
}

export interface SystemDiagnostics {
  instagramConnected: boolean;
  databaseHealthy: boolean;
  aiProviderConnected: boolean;
  webhookActive: boolean;
  deploymentHealthy: boolean;
  storageHealthy: boolean;
  knowledgeIndexedCount: number;
  notificationsWorking: boolean;
  missingKeys: string[];
}
