"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Bot,
  Flame,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialConversations, initialLearningQueue, initialLeads } from "@/lib/store/mock-data";

export default function DashboardPage() {
  const [learningCount] = useState(initialLearningQueue.length);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time overview of Instagram AI Business Assistant, RAG confidence, and lead sales pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sandbox">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Test in AI Sandbox
            </Button>
          </Link>
          <Link href="/inbox">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Open Inbox (2 Unread)
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Notification Alert for Unknown Questions */}
      {learningCount > 0 && (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center shrink-0">
              <HelpCircle className="h-5 w-5 text-neutral-200" />
            </div>
            <div>
              <div className="text-sm font-semibold flex items-center gap-2">
                <span>{learningCount} Unknown Questions Pending Owner Guidance</span>
                <Badge variant="outline" className="text-[10px]">Human-in-the-Loop</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI encountered inquiries below 80% confidence. Answer once to train the Knowledge Base automatically.
              </p>
            </div>
          </div>
          <Link href="/learning-queue">
            <Button size="sm" className="whitespace-nowrap shrink-0">
              Review Learning Queue
            </Button>
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total IG Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">1,420</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">+18.4%</span> vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High-Intent Hot Leads</CardTitle>
            <Flame className="h-4 w-4 text-neutral-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">24</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">94 Avg Lead Score</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg RAG Confidence</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">96.4%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span>Zero-Hallucination Active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lead Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">34.2%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">$20,400 Pipeline</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Activity & Top Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Instagram Conversations (2 columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Instagram DM Activity</CardTitle>
              <CardDescription>Live incoming messages and AI routing decisions</CardDescription>
            </div>
            <Link href="/inbox">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {initialConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-neutral-800 text-white font-semibold flex items-center justify-center shrink-0 font-mono text-xs">
                    @{conv.customerUsername.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{conv.customerName}</span>
                      <span className="text-xs text-muted-foreground">@{conv.customerUsername}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessageText}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={conv.leadTemperature === "hot" ? "default" : "outline"}>
                    Score: {conv.leadScore}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Priority Lead Pipeline Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Qualified Lead Highlights</CardTitle>
            <CardDescription>High-value prospects identified by AI Sales Agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {initialLeads.map((lead) => (
              <div key={lead.id} className="p-3 rounded-lg border border-border bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{lead.name}</span>
                  <Badge variant={lead.priority === "vip" ? "default" : "outline"} className="text-[10px]">
                    {lead.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{lead.company || lead.industry}</div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40 font-mono">
                  <span className="text-muted-foreground">{lead.budgetRange}</span>
                  <span className="font-bold text-foreground">${lead.expectedValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
            <Link href="/crm" className="block pt-2">
              <Button variant="outline" className="w-full text-xs">
                Open CRM Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
