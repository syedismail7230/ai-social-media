import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-6 text-xs leading-relaxed text-foreground">
      <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: July 20, 2026</p>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By accessing and using Zawr AI Business Assistant services, you agree to comply with these Terms of Service and Meta Platform Policies.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">2. Service Usage</h2>
        <p className="text-muted-foreground">
          Zawr provides automated AI messaging, lead qualification, and customer support interfaces for Instagram and other channels.
        </p>
      </section>
    </div>
  );
}
