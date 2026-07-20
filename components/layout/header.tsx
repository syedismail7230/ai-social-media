"use client";

import React, { useState, useEffect } from "react";
import { Search, Moon, Sun, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads, knowledge, conversations... (Ctrl+K)"
            className="w-full bg-muted/60 border border-border rounded-md pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          />
        </div>
      </div>

      {/* Right Topbar Actions */}
      <div className="flex items-center gap-4">
        {/* System Health Status Pill */}
        <Link href="/diagnostics" className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/30 text-xs hover:border-foreground/40 transition-all">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">All Systems Operational</span>
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Owner Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-7 w-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center font-mono">
            OW
          </div>
          <div className="flex flex-col text-xs">
            <span className="font-semibold leading-tight">Zawr Owner</span>
            <span className="text-[10px] text-muted-foreground">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
