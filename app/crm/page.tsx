"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Flame,
  DollarSign,
  Plus,
  ArrowUpRight,
  UserCheck,
  TrendingUp,
  Tag,
  Building,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Lead } from "@/types";

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [tempFilter, setTempFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredLeads = leads.filter((l) => {
    const matches =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.instagramUsername.toLowerCase().includes(search.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(search.toLowerCase()));
    if (tempFilter === "all") return matches;
    return matches && l.leadTemperature === tempFilter;
  });

  const handleSaveLeadNotes = async () => {
    if (!selectedLead) return;
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedLead.id,
        notes: selectedLead.notes,
        leadScore: selectedLead.leadScore,
      }),
    });
    fetchLeads();
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart CRM & AI Sales Agent</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Automated Instagram lead qualification, lead scoring (0-100), intent detection, and deal pipeline.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setSelectedLead(leads[0])}>
          <Plus className="h-4 w-4" />
          Add Manual Lead
        </Button>
      </div>

      {/* Filter Bar & KPI Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads by name, handle, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["all", "hot", "warm", "cold"] as const).map((temp) => (
            <Button
              key={temp}
              variant={tempFilter === temp ? "default" : "outline"}
              size="sm"
              onClick={() => setTempFilter(temp)}
              className="text-xs uppercase font-mono px-3"
            >
              {temp}
            </Button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Qualified Sales Pipeline</CardTitle>
          <CardDescription>Click any row to open full memory profile & AI breakdown</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase text-[10px]">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Company & Industry</th>
                  <th className="p-4">Lead Score</th>
                  <th className="p-4">Temp</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Est Value</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{lead.name}</div>
                      <div className="text-[11px] text-muted-foreground">@{lead.instagramUsername}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{lead.company || "Independent"}</div>
                      <div className="text-[11px] text-muted-foreground">{lead.industry || "General"}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm">{lead.leadScore}</span>
                        <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-foreground h-full rounded-full"
                            style={{ width: `${lead.leadScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={lead.leadTemperature === "hot" ? "default" : "outline"} className="text-[10px] uppercase font-mono">
                        {lead.leadTemperature}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-muted text-foreground font-mono text-[10px] uppercase">
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold">
                      ${lead.expectedValue.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        Profile <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for viewing/editing Lead Details */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={`Lead Profile: ${selectedLead?.name || ""}`}
      >
        {selectedLead && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg border border-border bg-muted/30 flex justify-between items-center">
              <div>
                <span className="text-muted-foreground">Instagram Handle</span>
                <div className="font-bold text-sm">@{selectedLead.instagramUsername}</div>
              </div>
              <Badge variant="default" className="text-xs font-mono">
                Lead Score: {selectedLead.leadScore}/100
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded border border-border bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Email</span>
                <div className="font-medium mt-0.5">{selectedLead.email || "Not provided"}</div>
              </div>
              <div className="p-2.5 rounded border border-border bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Phone</span>
                <div className="font-medium mt-0.5">{selectedLead.phone || "Not provided"}</div>
              </div>
            </div>

            <div className="p-3 rounded border border-border bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-mono">AI Executive Summary</span>
              <p className="text-xs leading-relaxed">{selectedLead.aiSummary}</p>
            </div>

            <div className="p-3 rounded border border-border bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-mono">Internal Owner Notes</span>
              <textarea
                rows={3}
                value={selectedLead.notes}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, notes: e.target.value })
                }
                className="w-full bg-muted/50 border border-border rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLeadNotes}>Save Lead Memory to DB</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
