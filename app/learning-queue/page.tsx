"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Bot,
  User,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LearningItem } from "@/types";

export default function LearningQueuePage() {
  const [queue, setQueue] = useState<LearningItem[]>([]);
  const [ownerAnswers, setOwnerAnswers] = useState<Record<string, string>>({});
  const [approvedCount, setApprovedCount] = useState(0);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/learning-queue");
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (item: LearningItem) => {
    const finalAnswer = ownerAnswers[item.id] || item.aiSuggestion;

    await fetch("/api/learning-queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve",
        id: item.id,
        ownerAnswer: finalAnswer,
      }),
    });

    setApprovedCount(approvedCount + 1);
    fetchQueue();
  };

  const handleReject = async (id: string) => {
    await fetch("/api/learning-queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reject",
        id,
      }),
    });

    fetchQueue();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Learning Queue (Human-in-the-Loop)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Questions below 80% confidence are held here for owner approval. Approving trains the Knowledge Base automatically.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="outline" className="px-3 py-1">
            {queue.length} Pending
          </Badge>
          <Badge variant="default" className="px-3 py-1">
            {approvedCount} Trained Today
          </Badge>
        </div>
      </div>

      {queue.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold">Learning Queue Complete!</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            No pending questions require your input. The AI is operating with 96.4% confidence across all active Instagram threads.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <Card key={item.id} className="border-neutral-800 bg-neutral-950">
              <CardHeader className="pb-3 border-b border-neutral-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <User className="h-3.5 w-3.5" />
                    <span>Customer: @{item.customerUsername}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">Low RAG Confidence</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <CardTitle className="text-base text-neutral-100 mt-2 font-sans font-semibold">
                  "{item.question}"
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                    <Bot className="h-4 w-4 text-emerald-400" />
                    <span>AI Draft Suggestion</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                    {item.aiSuggestion}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-200 block">
                    Owner Refined Answer (Will be saved to Knowledge Base & sent to customer)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Refine or replace the answer above..."
                    value={ownerAnswers[item.id] ?? item.aiSuggestion}
                    onChange={(e) =>
                      setOwnerAnswers({ ...ownerAnswers, [item.id]: e.target.value })
                    }
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-xs text-neutral-100 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(item.id)}
                    className="gap-1 text-xs"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject Question
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(item)}
                      className="gap-2 bg-neutral-100 text-neutral-900 hover:bg-white text-xs font-semibold"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Approve & Train Knowledge Base
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
