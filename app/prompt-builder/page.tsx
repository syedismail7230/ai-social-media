"use client";

import React, { useState } from "react";
import { Sliders, Plus, Check, ShieldAlert, Sparkles, MessageSquare, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialPersonalities, initialObjections } from "@/lib/store/mock-data";
import { AiPersonality, ObjectionItem } from "@/types";

export default function PromptBuilderPage() {
  const [personalities, setPersonalities] = useState<AiPersonality[]>(initialPersonalities);
  const [activeId, setActiveId] = useState<string>("p1");
  const [objections, setObjections] = useState<ObjectionItem[]>(initialObjections);

  // Form state
  const activePersonality = personalities.find((p) => p.id === activeId) || personalities[0];
  const [companyIdentity, setCompanyIdentity] = useState("Zawr Industries - Enterprise AI Business Automation & Sales Platform");
  const [forbiddenTopics, setForbiddenTopics] = useState("Never discuss competitor pricing without proof. Never fabricate custom discounts.");
  const [ctaStyle, setCtaStyle] = useState("Guide high-intent prospects to book executive strategy session via {{meeting}}.");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompt & Personality Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure unlimited AI personalities, tone rules, forbidden topics, and objection handling scripts.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Personality
        </Button>
      </div>

      {/* AI Personalities Switcher Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {personalities.map((pers) => {
          const isSelected = pers.id === activeId;
          return (
            <Card
              key={pers.id}
              onClick={() => setActiveId(pers.id)}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-foreground bg-muted/40 ring-1 ring-foreground"
                  : "hover:border-border/80"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{pers.name}</CardTitle>
                  {isSelected && <Badge variant="default" className="text-[10px]">ACTIVE</Badge>}
                </div>
                <CardDescription className="text-xs">{pers.tone}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <p className="line-clamp-2">{pers.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Visual Prompt Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Prompt Configuration Fields (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">System Identity & Behavior Rules</CardTitle>
              <CardDescription>Rules applied to all AI generated Instagram DMs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Company Identity & Mission</label>
                <textarea
                  rows={3}
                  value={companyIdentity}
                  onChange={(e) => setCompanyIdentity(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-md p-3 font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Greeting Style</label>
                <input
                  type="text"
                  value={activePersonality.greetingStyle}
                  className="w-full bg-muted/50 border border-border rounded-md p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Forbidden Topics & Safeguards</label>
                <textarea
                  rows={2}
                  value={forbiddenTopics}
                  onChange={(e) => setForbiddenTopics(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-md p-3 font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Call To Action (CTA) Style</label>
                <input
                  type="text"
                  value={ctaStyle}
                  onChange={(e) => setCtaStyle(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-md p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm">Save Prompt System Rules</Button>
              </div>
            </CardContent>
          </Card>

          {/* Objection Handling Library */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Approved Objection Library</CardTitle>
              <CardDescription>Pre-approved counter scripts for price, trust, and timeline hesitation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {objections.map((obj) => (
                <div key={obj.id} className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="capitalize text-foreground font-mono">Category: {obj.category}</span>
                    <Badge variant="outline" className="text-[10px]">APPROVED</Badge>
                  </div>
                  <p className="text-muted-foreground font-medium">Objection: "{obj.objection}"</p>
                  <p className="text-foreground bg-card p-2.5 rounded border border-border/60 font-mono">
                    Script: {obj.counterScript}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Prompt Preview */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bot className="h-4 w-4 text-emerald-400" />
              Compiled System System Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
{`[SYSTEM PROMPT]
You are Zawr AI Assistant.
Tone: ${activePersonality.tone}
Formality: ${activePersonality.formality}
Greeting: ${activePersonality.greetingStyle}
Rules:
- Zero hallucination policy
- Never invent pricing or policies
- Call to Action: ${ctaStyle}
- Variables: {{website}}, {{pricing}}, {{meeting}}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
