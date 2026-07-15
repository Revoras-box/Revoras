"use client";

import Link from "next/link";
import { Layers, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";

// Phase 2.2 (Discovery Curation System) - the admin entry point for editorial
// control over the customer discovery homepage: Collections (curated,
// filter-driven lists) and Featured Businesses (a ranking nudge + badge).
export default function CurationHubPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Marketplace Curation</h1>
      <p className="text-sm text-muted mb-8">Shape what customers see on the discovery homepage.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/curation/collections">
          <Card className="flex h-full flex-col gap-3 transition-colors hover:border-primary/40">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers size={22} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Collections</h2>
              <p className="mt-1 text-sm text-muted">
                Curated, filter-driven lists like &quot;Best Barbers in Jammu&quot; or &quot;Bridal Specialists&quot;.
                Manually pin businesses or let filters auto-fill the rest.
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              Manage collections <ArrowRight size={14} />
            </span>
          </Card>
        </Link>

        <Link href="/admin/curation/featured">
          <Card className="flex h-full flex-col gap-3 transition-colors hover:border-primary/40">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles size={22} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Featured Businesses</h2>
              <p className="mt-1 text-sm text-muted">
                Give a business a modest ranking boost and a &quot;Featured&quot; badge, with optional priority,
                scheduling, and regional targeting.
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              Manage featured <ArrowRight size={14} />
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
