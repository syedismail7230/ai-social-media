import { DecisionRoute, KnowledgeItem, AiPersonality } from "@/types";
import { initialKnowledge } from "@/lib/store/mock-data";
import { replaceLinkVariables } from "./link-replacer";

export interface RagResult {
  replyText: string;
  confidenceScore: number;
  decisionRoute: DecisionRoute;
  knowledgeUsed: string[];
  matchedItems: KnowledgeItem[];
  isUnknownQuestion: boolean;
}

export class RagEngine {
  static evaluateQuery(
    userQuery: string,
    personality: AiPersonality,
    knowledgeBase: KnowledgeItem[] = initialKnowledge
  ): RagResult {
    const queryLower = userQuery.toLowerCase();
    
    // Keyword and semantic scoring simulation against Knowledge Base
    const matchedItems: KnowledgeItem[] = [];
    let highestScore = 0;

    for (const item of knowledgeBase) {
      if (!item.isActive) continue;

      let score = 0;
      const titleWords = item.title.toLowerCase().split(/\s+/);
      const contentWords = item.content.toLowerCase().split(/\s+/);

      // Score matching
      for (const word of titleWords) {
        if (word.length > 3 && queryLower.includes(word)) score += 35;
      }
      for (const word of contentWords) {
        if (word.length > 3 && queryLower.includes(word)) score += 15;
      }

      if (score > 30) {
        matchedItems.push(item);
        if (score > highestScore) highestScore = score;
      }
    }

    // Normalize confidence score between 40 and 99
    let confidenceScore = 0;
    if (matchedItems.length === 0) {
      confidenceScore = Math.min(65, Math.floor(Math.random() * 20) + 45); // Low confidence for unknown
    } else {
      confidenceScore = Math.min(99, 80 + Math.min(19, highestScore));
    }

    // Route decision calculation
    let decisionRoute: DecisionRoute = "auto_reply";
    let isUnknownQuestion = false;

    if (confidenceScore >= 95) {
      decisionRoute = "auto_reply";
    } else if (confidenceScore >= 80) {
      decisionRoute = "draft_approval";
    } else {
      decisionRoute = "escalated_pending";
      isUnknownQuestion = true;
    }

    // Build reply text or escalation placeholder
    let rawReply = "";
    if (isUnknownQuestion) {
      rawReply = `[Confidence: ${confidenceScore}% - Escalated to Owner Learning Queue. Waiting for owner approval.]`;
    } else {
      const bestMatch = matchedItems[0];
      const greeting = personality.greetingStyle ? `${personality.greetingStyle}\n\n` : "";
      const body = bestMatch
        ? `Regarding your inquiry: ${bestMatch.content}`
        : `Thank you for contacting Zawr. Let me confirm the exact details for your request.`;
      
      rawReply = `${greeting}${body}`;
    }

    // Apply managed link replacement
    const finalReply = replaceLinkVariables(rawReply);

    return {
      replyText: finalReply,
      confidenceScore,
      decisionRoute,
      knowledgeUsed: matchedItems.map((item) => item.title),
      matchedItems,
      isUnknownQuestion,
    };
  }
}
