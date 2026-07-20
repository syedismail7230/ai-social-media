import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-6 text-xs leading-relaxed text-foreground">
      <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: July 20, 2026</p>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">1. Overview</h2>
        <p className="text-muted-foreground">
          Zawr AI Business Assistant ("we", "our", "us") respects your privacy and is committed to protecting the personal data collected through our Instagram DM messaging platform and AI services.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">2. Data We Collect</h2>
        <p className="text-muted-foreground">
          When you interact with our Instagram messaging services, we may collect your Instagram handle, display name, direct messages, and lead status information necessary to provide automated customer support and consultative sales guidance.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">3. Use of Information</h2>
        <p className="text-muted-foreground">
          We use collected information solely to process customer inquiries, provide zero-hallucination AI responses, qualify sales leads, and manage appointment bookings. We do not sell or share customer data with unauthorized third parties.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">4. Data Deletion Requests</h2>
        <p className="text-muted-foreground">
          You may request the deletion of your conversation data at any time by contacting our support team at <span className="font-mono text-foreground">marketing@zawrindustries.com</span>.
        </p>
      </section>
    </div>
  );
}
