"use client";

import React, { useState } from "react";
import { FileText, ShieldCheck, AlertCircle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initialLogs } from "@/lib/store/mock-data";
import { AiLog } from "@/types";

export default function LogsPage() {
  const [logs] = useState<AiLog[]>(initialLogs);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.customerUsername.toLowerCase().includes(search.toLowerCase()) ||
      l.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Audit Logs & Telemetry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete records of prompts, knowledge sources used, confidence scores, latency, and tokens.
          </p>
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter logs by username or prompt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Execution Audit Log History</CardTitle>
          <CardDescription>Immutable trail of every AI decision & confidence score</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase text-[10px]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Prompt Context</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Provider / Model</th>
                  <th className="p-4">Tokens / Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      @{log.customerUsername}
                    </td>
                    <td className="p-4 max-w-xs truncate text-muted-foreground font-sans">
                      {log.prompt}
                    </td>
                    <td className="p-4 font-bold">
                      <Badge variant={log.confidenceScore >= 95 ? "default" : "outline"}>
                        {log.confidenceScore}%
                      </Badge>
                    </td>
                    <td className="p-4 uppercase">{log.decisionRoute}</td>
                    <td className="p-4 text-muted-foreground">
                      {log.provider} ({log.model})
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {log.tokensTotal} tok • {log.latencyMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
