"use client";

import React from "react";
import { DollarSign, Cpu, Layers, TrendingDown, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CostsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cost & Token Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time tracking of provider API costs, token consumption, and per-customer expenditure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Today's Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-400">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">Google Gemini Free Tier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Monthly Projected Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">$12.40</div>
            <p className="text-xs text-muted-foreground mt-1">Groq + Gemini Multi-tier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Tokens Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">1.84M</div>
            <p className="text-xs text-muted-foreground mt-1">1,420 Conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Cost Per Customer Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-400">$0.0087</div>
            <p className="text-xs text-muted-foreground mt-1">High Efficiency RAG</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Cost Breakdown By Provider</CardTitle>
          <CardDescription>Provider switching without application code modifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 font-mono text-xs">
          {[
            { name: "Google Gemini (Free Tier / Flash)", status: "Active", tokens: "1.2M", cost: "$0.00" },
            { name: "Groq Llama 3 70B API", status: "Available", tokens: "480k", cost: "$0.18" },
            { name: "OpenAI gpt-4o-mini", status: "Configured", tokens: "160k font-mono", cost: "$0.24" },
            { name: "Anthropic Claude 3.5 Sonnet", status: "Backup", tokens: "0", cost: "$0.00" },
            { name: "Ollama (Self Hosted Local)", status: "Local", tokens: "0", cost: "$0.00" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded border border-border bg-card">
              <div>
                <span className="font-semibold text-foreground">{item.name}</span>
                <div className="text-[10px] text-muted-foreground">{item.tokens} tokens processed</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={item.status === "Active" ? "default" : "outline"}>{item.status}</Badge>
                <span className="font-bold text-foreground">{item.cost}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
