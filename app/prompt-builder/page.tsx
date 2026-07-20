"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Plus, Check, ShieldAlert, Sparkles, MessageSquare, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { AiPersonality, ObjectionItem } from "@/types";

export default function PromptBuilderPage() {
  const [personalities, setPersonalities] = useState<AiPersonality[]>([]);
  const [objections, setObjections] = useState<ObjectionItem[]>([]);
  const [activeId, setActiveId] = useState<string>("p1");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Personality form state
  const [newName, setNewName] = useState("");
  const [newTone, setNewTone] = useState("");
  const [newGreeting, setNewGreeting] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchData = async () => {
    try {
      const [pRes, oRes] = await Promise.all([
        fetch("/api/personalities"),
        fetch("/api/objections"),
      ]);
      if (pRes.ok) {
        const data = await pRes.json();
        setPersonalities(data);
        if (data.length && !activeId) setActiveId(data[0].id);
      }
      if (oRes.ok) setObjections(await oRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const activePersonality = personalities.find((p) => p.id === activeId) || personalities[0] || {
    id: "p1",
    name: "Luxury",
    tone: "Polished",
    greetingStyle: "Welcome to Zawr",
    formality: "high",
  };

  const handleCreatePersonality = async () => {
    if (!newName.trim()) return;

    const newP: Partial<AiPersonality> = {
      id: `p-${Date.now()}`,
      name: newName,
      tone: newTone || "Professional",
      greetingStyle: newGreeting || "Hello!",
      description: newDescription || "Custom user created personality",
      formality: "medium",
      emojiUsage: "minimal",
      ctaStyle: "Guide to {{meeting}}",
    };

    await fetch("/api/personalities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newP),
    });

    fetchData();
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompt & Personality Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time database configuration of AI personalities, system prompt rules, and objection handling scripts.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
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
        {/* Left: System Rules */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">System Identity & Behavior Rules</CardTitle>
              <CardDescription>Rules stored in database and applied to live Instagram DMs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Company Identity & Mission</label>
                <textarea
                  rows={3}
                  defaultValue="Zawr Industries - Enterprise AI Business Automation & Sales Platform"
                  className="w-full bg-muted/50 border border-border rounded-md p-3 font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Active Greeting Style</label>
                <input
                  type="text"
                  value={activePersonality.greetingStyle}
                  className="w-full bg-muted/50 border border-border rounded-md p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm">Save Rules to Database</Button>
              </div>
            </CardContent>
          </Card>

          {/* Objection Handling Library */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Approved Objection Library</CardTitle>
              <CardDescription>Live database objection handling counter scripts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {objections.map((obj) => (
                <div key={obj.id} className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="capitalize text-foreground font-mono">Category: {obj.category}</span>
                    <Badge variant="outline" className="text-[10px]">LIVE DB</Badge>
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

        {/* Right: Compiled Prompt Trace */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bot className="h-4 w-4 text-emerald-400" />
              Live Compiled Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
{`[LIVE DATABASE SYSTEM PROMPT]
Active Personality: ${activePersonality.name}
Tone: ${activePersonality.tone}
Formality: ${activePersonality.formality || "high"}
Greeting: ${activePersonality.greetingStyle}
Rules:
- Zero hallucination policy
- Never invent pricing or policies
- Managed variables: {{website}}, {{pricing}}, {{meeting}}`}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Add Personality Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New AI Personality"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Personality Name</label>
            <input
              type="text"
              placeholder="e.g. Startup Sales Growth"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Tone & Voice</label>
            <input
              type="text"
              placeholder="e.g. Energetic, authoritative, helpful"
              value={newTone}
              onChange={(e) => setNewTone(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Greeting Style</label>
            <input
              type="text"
              placeholder="e.g. Hey there! Ready to scale your brand with Zawr?"
              value={newGreeting}
              onChange={(e) => setNewGreeting(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePersonality}>Save Personality to DB</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
