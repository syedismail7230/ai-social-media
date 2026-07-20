"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  HelpCircle,
  Sliders,
  Link as LinkIcon,
  PlaySquare,
  BarChart3,
  Stethoscope,
  Settings,
  FileText,
  DollarSign,
  Bot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox", label: "Inbox", icon: MessageSquare, badge: "2" },
  { href: "/crm", label: "CRM & Sales", icon: Users, badge: "Hot" },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/learning-queue", label: "Learning Queue", icon: HelpCircle, badge: "2" },
  { href: "/prompt-builder", label: "Prompt Builder", icon: Sliders },
  { href: "/links", label: "Managed Links", icon: LinkIcon },
  { href: "/sandbox", label: "AI Sandbox", icon: PlaySquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/costs", label: "Cost Tracker", icon: DollarSign },
  { href: "/diagnostics", label: "Diagnostics", icon: Stethoscope },
  { href: "/logs", label: "AI Telemetry Logs", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
          <div className="h-8 w-8 rounded-md bg-foreground text-background flex items-center justify-center font-mono text-sm font-extrabold">
            Z
          </div>
          <span>ZAWR AI</span>
        </Link>
        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5">
          v1.0
        </Badge>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Platform Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? "bg-background text-foreground"
                      : "bg-muted-foreground/20 text-foreground"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Active AI Provider Status Box */}
      <div className="p-4 border-t border-border bg-muted/40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
            <Bot className="h-4 w-4 text-neutral-200" />
          </div>
          <div className="flex flex-col text-xs overflow-hidden">
            <span className="font-semibold truncate">Google Gemini 1.5</span>
            <span className="text-[10px] text-muted-foreground truncate">Zero-Hallucination RAG</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
