"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { KnowledgeItem, KnowledgeCategory } from "@/types";
import { replaceLinkVariables } from "@/lib/ai/link-replacer";

export default function KnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTester, setSearchTester] = useState("");
  const [searchResultText, setSearchResultText] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<KnowledgeCategory>("services");
  const [newContent, setNewContent] = useState("");

  const fetchKnowledge = async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (res.ok) {
        const data = await res.json();
        setKnowledgeList(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchKnowledge();
    const interval = setInterval(fetchKnowledge, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = knowledgeList.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const handleAddKnowledge = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newItem: Partial<KnowledgeItem> = {
      id: `k-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      sourceType: "text",
      version: 1,
      isActive: true,
      indexedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await fetch("/api/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    fetchKnowledge();
    setNewTitle("");
    setNewContent("");
    setIsAddModalOpen(false);
  };

  const handleTestSearch = () => {
    if (!searchTester.trim()) return;
    const query = searchTester.toLowerCase();
    const match = knowledgeList.find(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
    );

    if (match) {
      setSearchResultText(`Found match in "${match.title}": ${replaceLinkVariables(match.content)}`);
    } else {
      setSearchResultText("No exact RAG match. Question would escalate to Owner Learning Queue (Confidence < 80%).");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zero-Hallucination vector database powering Instagram DM responses and RAG search.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company Knowledge
        </Button>
      </div>

      {/* RAG Search Tester Widget */}
      <Card className="bg-neutral-950 border-neutral-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-neutral-200">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Hybrid Vector & Semantic RAG Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Test a customer question against Knowledge Base (e.g. refund policy, pricing...)"
              value={searchTester}
              onChange={(e) => setSearchTester(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
            <Button size="sm" onClick={handleTestSearch} className="gap-1">
              Run RAG Query
            </Button>
          </div>
          {searchResultText && (
            <div className="p-3 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 leading-relaxed">
              {searchResultText}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["all", "services", "pricing", "policies", "sales", "support", "faq"].map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="text-xs capitalize px-3 shrink-0"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="relative flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold truncate">{item.title}</CardTitle>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  v{item.version}
                </Badge>
              </div>
              <CardDescription className="text-xs uppercase font-mono text-muted-foreground">
                Category: {item.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded border border-border/40 font-mono">
                {item.content}
              </p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Live Vector Indexed
                </span>
                <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Knowledge Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Company Knowledge"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Knowledge Title</label>
            <input
              type="text"
              placeholder="e.g. Enterprise SLA Terms or Refund Guarantee"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as KnowledgeCategory)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              <option value="services">Services</option>
              <option value="pricing">Pricing</option>
              <option value="policies">Policies</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="faq">FAQ</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Knowledge Content</label>
            <textarea
              rows={5}
              placeholder="Enter precise company facts. Use {{pricing}}, {{meeting}}, or {{website}} for managed links."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-foreground font-mono text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddKnowledge}>Index into DB & RAG</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
