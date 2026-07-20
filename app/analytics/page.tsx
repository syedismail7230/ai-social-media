"use client";

import React from "react";
import { BarChart3, TrendingUp, Bot, Clock, DollarSign, ArrowUpRight, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Analytics & Telemetry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Performance metrics, response latency, zero-hallucination accuracy, and lead conversion analytics.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Messages Handled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">1,420</div>
            <p className="text-xs text-muted-foreground mt-1">98.2% Auto-Resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg AI Response Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-400">480 ms</div>
            <p className="text-xs text-muted-foreground mt-1">Google Gemini 1.5 Flash</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Confidence Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">96.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Zero Hallucinations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Lead Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">34.2%</div>
            <p className="text-xs text-muted-foreground mt-1">24 Qualified Deals</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Most Shared Managed Links</CardTitle>
            <CardDescription>Clicks generated via AI DM variable replacement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            {[
              { label: "{{website}} - Official Site", clicks: 1420 },
              { label: "{{pricing}} - Plans & Packages", clicks: 890 },
              { label: "{{portfolio}} - Case Studies", clicks: 610 },
              { label: "{{meeting}} - Executive Strategy Call", clicks: 430 },
            ].map((link) => (
              <div key={link.label} className="flex items-center justify-between p-2.5 rounded border border-border bg-muted/20">
                <span>{link.label}</span>
                <span className="font-bold">{link.clicks} clicks</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Asked Customer Topics</CardTitle>
            <CardDescription>Most frequent inquiries handled by RAG engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            {[
              { topic: "Agency Multi-Account Pricing", share: "42%" },
              { topic: "Custom CRM & Webhook Integration", share: "28%" },
              { topic: "14-Day Performance Guarantee", share: "18%" },
              { topic: "Creator Alliance Revenue Share", share: "12%" },
            ].map((t) => (
              <div key={t.topic} className="flex items-center justify-between p-2.5 rounded border border-border bg-muted/20">
                <span>{t.topic}</span>
                <Badge variant="outline">{t.share}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
