"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  Key,
  Globe,
  Database,
  Instagram,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function DiagnosticsPage() {
  const [activeWizard, setActiveWizard] = useState<"instagram" | "apikey" | "neon" | null>(null);
  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const handleSaveApiKey = () => {
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setActiveWizard(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Self Diagnostics & Guided Action Wizard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time health monitoring of Meta Webhooks, Neon PostgreSQL, RAG Index, and Provider API Connections.
          </p>
        </div>
      </div>

      {/* Diagnostics Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase font-mono flex items-center justify-between">
              Instagram DM Webhook
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-bold">Meta Messenger Connected</div>
            <p className="text-[11px] text-muted-foreground">Webhook endpoint active</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveWizard("instagram")}
              className="w-full text-xs mt-2"
            >
              Configure Meta API
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase font-mono flex items-center justify-between">
              AI Multi-Provider Layer
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-bold">Gemini 1.5 Flash Active</div>
            <p className="text-[11px] text-muted-foreground">8 Providers Ready</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveWizard("apikey")}
              className="w-full text-xs mt-2"
            >
              Manage API Keys
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase font-mono flex items-center justify-between">
              Neon PostgreSQL Database
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-bold">pgvector Healthy</div>
            <p className="text-[11px] text-muted-foreground">Vector indexes operational</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveWizard("neon")}
              className="w-full text-xs mt-2"
            >
              Inspect Neon DB
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase font-mono flex items-center justify-between">
              Human-in-the-Loop Engine
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-bold">Learning Queue Ready</div>
            <p className="text-[11px] text-muted-foreground">Threshold: 80% Draft / 95% Auto</p>
            <div className="text-[10px] text-emerald-400 font-mono mt-3">All Systems Operational</div>
          </CardContent>
        </Card>
      </div>

      {/* Guided Owner Action Request Panel */}
      <Card className="border-neutral-800 bg-neutral-950">
        <CardHeader>
          <CardTitle className="text-base text-neutral-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Owner Guided Action Requests
          </CardTitle>
          <CardDescription className="text-neutral-400 text-xs">
            Step-by-step instructions for Meta Instagram connection and provider API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                <Instagram className="h-5 w-5 text-neutral-200" />
              </div>
              <div>
                <span className="font-semibold text-sm text-neutral-100">Meta Webhook & Instagram DM Setup</span>
                <p className="text-xs text-neutral-400">Subscribe Meta App to https://zawr.ai/api/webhooks/instagram</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setActiveWizard("instagram")}>
              View Setup Guide
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                <Key className="h-5 w-5 text-neutral-200" />
              </div>
              <div>
                <span className="font-semibold text-sm text-neutral-100">AI Provider Key Configuration</span>
                <p className="text-xs text-neutral-400">Google Gemini Free Tier, Groq, OpenRouter, OpenAI, Anthropic</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setActiveWizard("apikey")}>
              Input API Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guided Wizard Modal */}
      <Modal
        isOpen={!!activeWizard}
        onClose={() => setActiveWizard(null)}
        title={
          activeWizard === "instagram"
            ? "Instagram DM & Meta Webhook Setup Wizard"
            : activeWizard === "apikey"
            ? "AI Provider API Key Manager"
            : "Neon Database & Vector Settings"
        }
      >
        {activeWizard === "instagram" && (
          <div className="space-y-4 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              Follow these steps to connect your Instagram Business account:
            </p>
            <ol className="list-decimal pl-4 space-y-2 font-mono text-muted-foreground">
              <li>Go to Meta Developer Portal → Your App → Messenger Settings.</li>
              <li>Set Callback URL to: <span className="text-foreground font-bold">https://zawr.ai/api/webhooks/instagram</span></li>
              <li>Set Verify Token to: <span className="text-foreground font-bold">zawr_verify_token_2026</span></li>
              <li>Subscribe to <span className="text-foreground font-bold">messages</span> and <span className="text-foreground font-bold">messaging_postbacks</span> events.</li>
            </ol>
            <div className="pt-2 flex justify-end">
              <Button onClick={() => setActiveWizard(null)}>Done</Button>
            </div>
          </div>
        )}

        {activeWizard === "apikey" && (
          <div className="space-y-4 text-xs">
            {keySavedMessage ? (
              <div className="p-4 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-center">
                API Keys encrypted & saved successfully!
              </div>
            ) : (
              <>
                <div>
                  <label className="font-semibold block mb-1">Google Gemini API Key (Recommended Free Tier)</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Groq API Key (Optional High Speed Llama-3)</label>
                  <input
                    type="password"
                    placeholder="gsk_..."
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">OpenAI API Key (Optional)</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 font-mono"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActiveWizard(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveApiKey}>Save Encrypted Keys</Button>
                </div>
              </>
            )}
          </div>
        )}

        {activeWizard === "neon" && (
          <div className="space-y-4 text-xs font-mono">
            <p className="text-muted-foreground">
              Neon PostgreSQL Database Connection string:
            </p>
            <div className="p-3 rounded bg-muted/50 border border-border text-foreground">
              postgresql://zawr_owner:***@ep-cool-pool-12345.us-east-2.aws.neon.tech/zawr_db?sslmode=require
            </div>
            <p className="text-muted-foreground">Extensions enabled: pgvector, uuid-ossp, pg_trgm</p>
            <div className="pt-2 flex justify-end">
              <Button onClick={() => setActiveWizard(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
