"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Send,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
  Tag,
  Star,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  DollarSign,
  Calendar,
  Sparkles,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Conversation, Message, Lead } from "@/types";

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "active" | "pending">("all");

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (data.length && !activeConvId) {
          setActiveConvId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (convId: string) => {
    if (!convId) return;
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) setLeads(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchLeads();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
      if (activeConvId) fetchMessages(activeConvId);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const currentLead = leads.find((l) => l.instagramUsername === activeConv?.customerUsername);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerUsername.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTabFilter === "all") return matchesSearch;
    return matchesSearch && c.status === activeTabFilter;
  });

  const handleCreateNewThread = async () => {
    const username = prompt("Enter customer Instagram handle (e.g. alex_brand):");
    if (!username) return;

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      channel: "instagram",
      customerUsername: username.replace("@", ""),
      customerName: username.replace("@", ""),
      lastMessageText: "Conversation started",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      tags: ["New Lead"],
      leadScore: 50,
      leadTemperature: "warm",
      aiSummary: "New Instagram lead thread",
      assignedPersonalityId: "p1",
      status: "active",
    };

    await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConv),
    });

    fetchConversations();
    setActiveConvId(newConv.id);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConvId) return;
    const text = inputMessage;
    setInputMessage("");

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: activeConvId,
        sender: "owner",
        content: text,
      }),
    });

    fetchMessages(activeConvId);
    fetchConversations();
  };

  const handleSimulateCustomerMessage = async (promptText: string) => {
    if (!activeConvId) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: activeConvId,
        sender: "customer",
        content: promptText,
      }),
    });

    fetchMessages(activeConvId);
    fetchConversations();
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-xl border border-border bg-card overflow-hidden animate-in fade-in duration-200">
      {/* 1. Left Sidebar: Conversation List */}
      <div className="w-80 border-r border-border flex flex-col bg-muted/20">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold tracking-tight text-base flex items-center gap-2">
              Instagram DM Inbox
            </h2>
            <Button size="sm" variant="outline" onClick={handleCreateNewThread} className="text-xs h-7 gap-1">
              <Plus className="h-3 w-3" /> New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "active", "pending"] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTabFilter === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTabFilter(tab)}
                className="text-xs h-7 flex-1 capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center space-y-2 text-muted-foreground text-xs">
              <p>No active conversations in database.</p>
              <Button size="sm" variant="outline" onClick={handleCreateNewThread} className="text-xs mt-2 gap-1">
                <Plus className="h-3 w-3" /> Start DM Thread
              </Button>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected ? "bg-muted font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">
                        @{conv.customerUsername}
                      </span>
                      {conv.status === "pending" && (
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {conv.lastMessageText}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle Panel: Conversation Thread & Message Input */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <div className="h-14 px-6 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center font-mono text-xs font-bold">
                @{activeConv.customerUsername.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{activeConv.customerName}</span>
                  <span className="text-xs text-muted-foreground">@{activeConv.customerUsername}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Real-Time DB Active</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSimulateCustomerMessage("What are your pricing packages and refund policy?")}
                className="text-xs gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Simulate DM Question
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                No messages in thread yet. Type a message below or click "Simulate DM Question".
              </div>
            ) : (
              messages.map((msg) => {
                const isCustomer = msg.sender === "customer";
                const isAi = msg.sender === "ai";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isCustomer ? "items-start" : "items-end"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {msg.sender === "customer"
                          ? `@${activeConv.customerUsername}`
                          : msg.sender === "ai"
                          ? "Zawr AI Engine"
                          : "Owner"}
                      </span>

                      {isAi && (
                        <Badge
                          variant={
                            msg.confidenceScore >= 95
                              ? "default"
                              : msg.confidenceScore >= 80
                              ? "outline"
                              : "destructive"
                          }
                          className="text-[9px] gap-1 px-1.5"
                        >
                          {msg.confidenceScore >= 95 ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {msg.confidenceScore}% Confidence ({msg.decisionRoute})
                        </Badge>
                      )}
                    </div>

                    <div
                      className={`max-w-md rounded-lg p-3.5 text-xs leading-relaxed ${
                        isCustomer
                          ? "bg-muted text-foreground border border-border"
                          : isAi
                          ? "bg-neutral-900 text-neutral-100 border border-neutral-700"
                          : "bg-foreground text-background font-medium"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {isAi && msg.tokensUsed && (
                      <span className="text-[9px] text-muted-foreground font-mono mt-1">
                        {msg.latencyMs}ms • {msg.tokensUsed} tokens
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-border bg-card flex items-center gap-3">
            <input
              type="text"
              placeholder="Type response as Owner..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
            />
            <Button onClick={handleSendMessage} size="sm" className="gap-2">
              <Send className="h-3.5 w-3.5" />
              Send DM
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground text-xs space-y-3">
          <p>No conversation selected.</p>
          <Button size="sm" onClick={handleCreateNewThread} className="gap-1">
            <Plus className="h-4 w-4" /> Start First Real-Time DM Thread
          </Button>
        </div>
      )}

      {/* 3. Right Sidebar */}
      {activeConv && (
        <div className="w-80 border-l border-border bg-card p-5 overflow-y-auto space-y-6">
          <div>
            <h3 className="font-bold text-sm mb-1">Customer Memory & CRM</h3>
            <p className="text-xs text-muted-foreground">Persistent real-time profile</p>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Lead Qualification Score</span>
              <span className="font-mono font-bold text-sm">
                {currentLead?.leadScore || activeConv.leadScore}/100
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-foreground h-full rounded-full transition-all"
                style={{ width: `${currentLead?.leadScore || activeConv.leadScore}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
