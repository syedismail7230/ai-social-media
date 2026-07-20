import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import {
  Conversation,
  Message,
  Lead,
  KnowledgeItem,
  LearningItem,
  ManagedLink,
  AiPersonality,
  AiLog,
} from "@/types";
import {
  initialConversations,
  initialMessages,
  initialLeads,
  initialKnowledge,
  initialLearningQueue,
  initialManagedLinks,
  initialPersonalities,
  initialLogs,
} from "@/lib/store/mock-data";

const DB_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "db.json");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_ZN6EU5mXVHeB@ep-raspy-bonus-aw92sg93-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);

let tablesInitialized = false;

async function initNeonTables() {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        channel TEXT NOT NULL,
        customer_username TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_avatar TEXT,
        last_message_text TEXT NOT NULL,
        last_message_at TEXT NOT NULL,
        unread_count INT DEFAULT 0,
        tags TEXT[],
        lead_score INT DEFAULT 50,
        lead_temperature TEXT DEFAULT 'warm',
        ai_summary TEXT,
        assigned_personality_id TEXT,
        status TEXT DEFAULT 'active'
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        confidence_score INT DEFAULT 100,
        decision_route TEXT DEFAULT 'auto_reply',
        tokens_used INT,
        latency_ms INT,
        provider TEXT,
        created_at TEXT NOT NULL
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS knowledge_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        source_type TEXT DEFAULT 'text',
        version INT DEFAULT 1,
        is_active BOOLEAN DEFAULT TRUE,
        indexed_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS learning_queue (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        customer_username TEXT NOT NULL,
        conversation_id TEXT NOT NULL,
        ai_suggestion TEXT NOT NULL,
        owner_answer TEXT,
        status TEXT DEFAULT 'pending',
        category TEXT DEFAULT 'services',
        created_at TEXT NOT NULL
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS managed_links (
        id TEXT PRIMARY KEY,
        key TEXT NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        clicks INT DEFAULT 0,
        updated_at TEXT NOT NULL
      );
    `;
    tablesInitialized = true;
  } catch (err) {
    console.error("Neon DB table initialization check failed:", err);
  }
}

interface DbData {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  leads: Lead[];
  knowledge: KnowledgeItem[];
  learningQueue: LearningItem[];
  managedLinks: ManagedLink[];
  personalities: AiPersonality[];
  logs: AiLog[];
}

function getInitialData(): DbData {
  return {
    conversations: initialConversations,
    messages: initialMessages,
    leads: initialLeads,
    knowledge: initialKnowledge,
    learningQueue: initialLearningQueue,
    managedLinks: initialManagedLinks,
    personalities: initialPersonalities,
    logs: initialLogs,
  };
}

export class Repository {
  private static ensureDb(): DbData {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (!fs.existsSync(DB_FILE)) {
        const init = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), "utf-8");
        return init;
      }
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      return getInitialData();
    }
  }

  private static saveDb(data: DbData) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to persist database file", e);
    }
  }

  // Conversations
  static getConversations(): Conversation[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.conversations;
  }

  static addConversation(conv: Conversation): Conversation {
    initNeonTables();
    const db = this.ensureDb();
    db.conversations = [conv, ...db.conversations];
    this.saveDb(db);
    return conv;
  }

  // Messages
  static getMessages(conversationId: string): Message[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.messages[conversationId] || [];
  }

  static addMessage(msg: Message): Message {
    initNeonTables();
    const db = this.ensureDb();
    const list = db.messages[msg.conversationId] || [];
    db.messages[msg.conversationId] = [...list, msg];

    const convIndex = db.conversations.findIndex((c) => c.id === msg.conversationId);
    if (convIndex !== -1) {
      db.conversations[convIndex].lastMessageText = msg.content;
      db.conversations[convIndex].lastMessageAt = msg.createdAt;
    }

    this.saveDb(db);
    return msg;
  }

  // Leads
  static getLeads(): Lead[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.leads;
  }

  static addLead(lead: Lead): Lead {
    initNeonTables();
    const db = this.ensureDb();
    db.leads = [lead, ...db.leads];
    this.saveDb(db);
    return lead;
  }

  static updateLead(id: string, updates: Partial<Lead>): Lead | null {
    initNeonTables();
    const db = this.ensureDb();
    const index = db.leads.findIndex((l) => l.id === id);
    if (index === -1) return null;
    db.leads[index] = { ...db.leads[index], ...updates };
    this.saveDb(db);
    return db.leads[index];
  }

  // Knowledge
  static getKnowledge(): KnowledgeItem[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.knowledge;
  }

  static addKnowledge(item: KnowledgeItem): KnowledgeItem {
    initNeonTables();
    const db = this.ensureDb();
    db.knowledge = [item, ...db.knowledge];
    this.saveDb(db);
    return item;
  }

  // Learning Queue
  static getLearningQueue(): LearningItem[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.learningQueue;
  }

  static approveLearningItem(id: string, ownerAnswer: string): KnowledgeItem | null {
    initNeonTables();
    const db = this.ensureDb();
    const index = db.learningQueue.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const item = db.learningQueue[index];
    db.learningQueue.splice(index, 1);

    const newKnowledge: KnowledgeItem = {
      id: `k-auto-${Date.now()}`,
      title: `Learned: ${item.question}`,
      category: item.category || "services",
      content: ownerAnswer,
      sourceType: "text",
      version: 1,
      isActive: true,
      indexedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.knowledge = [newKnowledge, ...db.knowledge];
    this.saveDb(db);
    return newKnowledge;
  }

  static rejectLearningItem(id: string): boolean {
    initNeonTables();
    const db = this.ensureDb();
    const index = db.learningQueue.findIndex((item) => item.id === id);
    if (index === -1) return false;
    db.learningQueue.splice(index, 1);
    this.saveDb(db);
    return true;
  }

  // Managed Links
  static getManagedLinks(): ManagedLink[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.managedLinks;
  }

  static addManagedLink(link: ManagedLink): ManagedLink {
    initNeonTables();
    const db = this.ensureDb();
    db.managedLinks = [link, ...db.managedLinks];
    this.saveDb(db);
    return link;
  }

  // Personalities
  static getPersonalities(): AiPersonality[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.personalities;
  }

  static addPersonality(p: AiPersonality): AiPersonality {
    initNeonTables();
    const db = this.ensureDb();
    db.personalities = [p, ...db.personalities];
    this.saveDb(db);
    return p;
  }

  // Logs
  static getLogs(): AiLog[] {
    initNeonTables();
    const db = this.ensureDb();
    return db.logs;
  }

  static addLog(log: AiLog): AiLog {
    initNeonTables();
    const db = this.ensureDb();
    db.logs = [log, ...db.logs];
    this.saveDb(db);
    return log;
  }
}
