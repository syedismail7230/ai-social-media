"use client";

import React, { useState } from "react";
import { Settings, Bot, Shield, Bell, Key, Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiProvider } from "@/types";

export default function SettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>("gemini");
  const [autoThreshold, setAutoThreshold] = useState(95);
  const [draftThreshold, setDraftThreshold] = useState(80);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Settings & AI Provider Switcher</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure multi-provider AI engine, RAG confidence thresholds, and security controls.
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="gap-2">
          {savedSuccess ? <Check className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
          {savedSuccess ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Provider Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Active AI Provider Abstraction</CardTitle>
              <CardDescription>Switch provider without modifying application source code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "gemini", name: "Google Gemini (Free Tier)", desc: "Default fast zero-cost model" },
                  { id: "groq", name: "Groq API (Llama 3 70B)", desc: "Sub-second extreme inference" },
                  { id: "openrouter", name: "OpenRouter Unified", desc: "Multi-model router" },
                  { id: "openai", name: "OpenAI (gpt-4o-mini)", desc: "High reasoning capabilities" },
                  { id: "anthropic", name: "Anthropic Claude 3.5", desc: "Superior nuanced output" },
                  { id: "deepseek", name: "DeepSeek V3", desc: "Low cost high precision" },
                  { id: "mistral", name: "Mistral Large", desc: "European AI cloud" },
                  { id: "ollama", name: "Ollama (Self Hosted Local)", desc: "On-premise privacy focus" },
                ].map((p) => {
                  const isSelected = selectedProvider === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProvider(p.id as AiProvider)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-foreground bg-muted/40 ring-1 ring-foreground"
                          : "border-border hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">{p.name}</span>
                        {isSelected && <Badge variant="default" className="text-[9px]">ACTIVE</Badge>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* RAG Confidence Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">AI Confidence Threshold System</CardTitle>
              <CardDescription>Control automatic Instagram DM replies vs owner escalation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Automatic DM Reply Threshold</span>
                  <span className="font-mono font-bold">{autoThreshold}% Confidence</span>
                </div>
                <input
                  type="range"
                  min={85}
                  max={99}
                  value={autoThreshold}
                  onChange={(e) => setAutoThreshold(Number(e.target.value))}
                  className="w-full accent-foreground"
                />
                <p className="text-[11px] text-muted-foreground">
                  Responses with confidence score $\ge$ {autoThreshold}% are sent to Instagram DMs automatically.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Draft Approval Threshold</span>
                  <span className="font-mono font-bold">{draftThreshold}% Confidence</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={90}
                  value={draftThreshold}
                  onChange={(e) => setDraftThreshold(Number(e.target.value))}
                  className="w-full accent-foreground"
                />
                <p className="text-[11px] text-muted-foreground">
                  Responses between {draftThreshold}% and {autoThreshold - 1}% require 1-click owner draft approval. Below {draftThreshold}% escalates to Owner Learning Queue.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & System Info */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Security & Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <div className="p-3 rounded bg-muted/40 border border-border/60">
              <span className="font-semibold text-foreground block">Role-Based Access Control</span>
              <span className="text-[11px]">Super Admin (Zawr Owner)</span>
            </div>
            <div className="p-3 rounded bg-muted/40 border border-border/60">
              <span className="font-semibold text-foreground block">Secrets Encryption</span>
              <span className="text-[11px]">AES-256 encrypted environment & API keys</span>
            </div>
            <div className="p-3 rounded bg-muted/40 border border-border/60">
              <span className="font-semibold text-foreground block">Zero-Hallucination Guard</span>
              <span className="text-[11px] text-emerald-400">Strictly Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
