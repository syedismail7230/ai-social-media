import { Lead, LeadTemperature, ObjectionItem } from "@/types";
import { initialObjections } from "@/lib/store/mock-data";

export interface QualificationAnalysis {
  leadScore: number;
  leadTemperature: LeadTemperature;
  buyingIntent: "High" | "Medium" | "Low";
  budgetRangeDetected?: string;
  timelineDetected?: string;
  detectedObjection?: ObjectionItem;
  suggestedNextAction: string;
}

export class SalesAgent {
  static analyzeLead(
    messageContent: string,
    existingLead?: Partial<Lead>
  ): QualificationAnalysis {
    const text = messageContent.toLowerCase();
    
    let score = existingLead?.leadScore || 50;
    let intent: "High" | "Medium" | "Low" = "Medium";
    let temperature: LeadTemperature = "warm";
    let budgetDetected: string | undefined = undefined;
    let timelineDetected: string | undefined = undefined;

    // Buying Intent signals
    if (text.includes("price") || text.includes("cost") || text.includes("pricing") || text.includes("package")) {
      score += 15;
    }
    if (text.includes("agency") || text.includes("multi-account") || text.includes("enterprise") || text.includes("scale")) {
      score += 20;
      budgetDetected = "$4,500 - $10,000/mo";
    }
    if (text.includes("immediate") || text.includes("today") || text.includes("asap") || text.includes("this week")) {
      score += 15;
      timelineDetected = "Immediate";
    }
    if (text.includes("book") || text.includes("meeting") || text.includes("call") || text.includes("demo")) {
      score += 25;
      intent = "High";
    }

    // Lead score calculation
    score = Math.min(99, Math.max(20, score));

    if (score >= 85) {
      intent = "High";
      temperature = "hot";
    } else if (score >= 60) {
      intent = "Medium";
      temperature = "warm";
    } else {
      intent = "Low";
      temperature = "cold";
    }

    // Objection check
    let detectedObjection: ObjectionItem | undefined = undefined;
    for (const obj of initialObjections) {
      if (text.includes(obj.category) || text.includes("expensive") || text.includes("robotic")) {
        detectedObjection = obj;
        break;
      }
    }

    let suggestedNextAction = "Guide lead to book an executive strategy call via {{meeting}}.";
    if (detectedObjection) {
      suggestedNextAction = `Handle objection (${detectedObjection.category}) using approved counter script.`;
    } else if (temperature === "hot") {
      suggestedNextAction = "Send direct booking link {{meeting}} and request budget confirmation.";
    }

    return {
      leadScore: score,
      leadTemperature: temperature,
      buyingIntent: intent,
      budgetRangeDetected: budgetDetected,
      timelineDetected,
      detectedObjection,
      suggestedNextAction,
    };
  }
}
