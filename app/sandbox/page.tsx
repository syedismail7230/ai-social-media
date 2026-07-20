"use client";

import React, { useState } from "react";
import { PlaySquare, Sparkles, ShieldCheck, AlertCircle, Bot, Code, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialPersonalities, initialKnowledge } from "@/lib/store/mock-data";
import { RagEngine, RagResult } from "@/lib/ai/rag-engine";

export default function SandboxPage() {
  const [testPrompt, setTestPrompt] = useState("What are your agency pricing tiers and refund policy?");
  const [selectedPersonalityId, setSelectedPersonalityId] = useState(initialPersonalities[0].id);
  const [result, setResult] = useState<RagResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    if (!testPrompt.trim()) return;
    setIsSimulating(true);

    setTimeout(() => {
      const activePers =
        initialPersonalities.find((p) => p.id === selectedPersonalityId) ||
        initialPersonalities[0];

      const res = RagEngine.evaluateQuery(testPrompt, activePers, initialKnowledge);
      setResult(res);
      setIsSimulating(false);
    }, 300);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive AI Sandbox Simulator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Simulate Instagram DM questions live. Inspect RAG vector matching, confidence score thresholds, and decision flows.
          </p>
        </div>
        <Button onClick={handleRunSimulation} disabled={isSimulating} className="gap-2">
          {isSimulating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PlaySquare className="h-4 w-4" />}
          Run Simulation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input Configuration */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Simulation Input & Personality</CardTitle>
            <CardDescription>Test any scenario before publishing to live Instagram DMs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Select AI Personality</label>
              <select
                value={selectedPersonalityId}
                onChange={(e) => setSelectedPersonalityId(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-foreground font-sans"
              >
                {initialPersonalities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.tone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Test Customer DM Message</label>
              <textarea
                rows={4}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Type any test question..."
                className="w-full bg-muted/50 border border-border rounded-md p-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[10px] uppercase font-mono text-muted-foreground block mb-2">Sample Quick Presets:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "What is your pricing tier?",
                  "Do you offer refund guarantees?",
                  "Do you support custom Shopify Plus extensions?",
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setTestPrompt(preset);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded bg-muted/60 hover:bg-muted border border-border text-foreground transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Execution Results */}
        <Card className="bg-neutral-950 border-neutral-800 text-neutral-100 flex flex-col justify-between">
          <CardHeader className="border-b border-neutral-900 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-neutral-200">
                <Bot className="h-4 w-4 text-emerald-400" />
                Live Execution Trace & Output
              </CardTitle>
              {result && (
                <Badge
                  variant={result.confidenceScore >= 95 ? "default" : "outline"}
                  className="font-mono text-xs"
                >
                  {result.confidenceScore}% Confidence
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4 font-mono text-xs flex-1">
            {result ? (
              <>
                <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                  <span className="text-[10px] uppercase text-neutral-500 block">Routing Decision</span>
                  <div className="text-emerald-400 font-bold text-sm uppercase">{result.decisionRoute}</div>
                  <span className="text-[10px] text-neutral-400">
                    {result.decisionRoute === "auto_reply"
                      ? "Confidence >= 95%: Automatic DM response sent directly."
                      : result.decisionRoute === "draft_approval"
                      ? "Confidence 80-94%: Saved as draft for 1-click owner approval."
                      : "Confidence < 80%: Unknown question routed to Owner Learning Queue."}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-neutral-500 block">Generated DM Response</span>
                  <div className="p-3 rounded bg-neutral-900 border border-neutral-800 text-neutral-100 leading-relaxed font-sans text-xs">
                    {result.replyText}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-neutral-500 block">Knowledge Sources Matched</span>
                  <div className="text-neutral-400 text-[11px]">
                    {result.knowledgeUsed.length > 0
                      ? result.knowledgeUsed.join(", ")
                      : "None (Zero-Hallucination Guard active)"}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500 text-center py-12">
                Click "Run Simulation" to inspect RAG response calculation
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
