"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Plus, ExternalLink, MousePointerClick, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ManagedLink } from "@/types";

export default function ManagedLinksPage() {
  const [links, setLinks] = useState<ManagedLink[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [newKey, setNewKey] = useState("{{support}}");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLinks();
    const interval = setInterval(fetchLinks, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const item: Partial<ManagedLink> = {
      id: `l-${Date.now()}`,
      key: newKey,
      title: newTitle,
      url: newUrl,
      description: newDesc,
      clicks: 0,
      updatedAt: new Date().toISOString(),
    };

    await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    fetchLinks();
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Managed Link & Variable Repository</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Central repository for managed URLs. AI must always use these variables instead of hardcoding links.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Managed Link Variable
        </Button>
      </div>

      {/* Grid of Managed Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Card key={link.id} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="font-mono text-xs px-2 py-0.5">
                  {link.key}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  <span>{link.clicks} clicks</span>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold mt-2">{link.title}</CardTitle>
              <CardDescription className="text-xs">{link.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="p-2.5 rounded bg-muted/40 border border-border/60 flex items-center justify-between font-mono text-xs truncate">
                <span className="truncate text-muted-foreground">{link.url}</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 hover:text-foreground shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal to Add Managed Link */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Managed Link Variable"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Variable Tag (Key)</label>
            <input
              type="text"
              placeholder="e.g. {{custom_brochure}}"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Creator Alliance Onboarding Form"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Target URL</label>
            <input
              type="url"
              placeholder="https://zawr.ai/onboarding"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Description</label>
            <input
              type="text"
              placeholder="Short description for owner reference"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLink}>Save Variable to DB</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
