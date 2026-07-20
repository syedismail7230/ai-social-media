import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Zawr AI - Production AI Business Assistant for Instagram",
  description: "Autonomous Instagram DM management, zero-hallucination RAG, human-in-the-loop learning queue, smart CRM lead scoring, and multi-provider AI abstraction layer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground flex min-h-screen overflow-x-hidden antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
