"use client";

import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input, Button, Spinner } from "@/components/ui";
import { api } from "@/lib/api";

/**
 * Phase 2.2 (Discovery Curation System) - shared business search/pick UI for
 * Collections pinning and the Featured Manager. Reuses the existing
 * GET /api/admin/businesses (api.getAdminStudios) rather than a new endpoint.
 *
 * Note: AdminStudioSummary.id is typed `number` in lib/types.ts but the
 * runtime value is a UUID string (businesses.id has always been a UUID -
 * that type predates the Knex/UUID migration and was never updated). Coerced
 * to string here rather than trusting the stale declaration.
 */
export interface BusinessOption {
  id: string;
  name: string;
  city: string | null;
  approvalStatus: string;
}

export function BusinessSearchPicker({
  onSelect,
  excludeIds = [],
  placeholder = "Search businesses by name or city…",
}: {
  onSelect: (business: BusinessOption) => void;
  excludeIds?: string[];
  placeholder?: string;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<BusinessOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = search.trim();
    if (!query) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getAdminStudios({ search: query, limit: 8 });
        const options: BusinessOption[] = (res.studios || []).map((s) => ({
          id: String(s.id),
          name: s.name,
          city: s.city,
          approvalStatus: s.approval_status,
        }));
        setResults(options.filter((o) => !excludeIds.includes(o.id)));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-2">
      <Input
        leadingIcon={<Search size={16} />}
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="flex justify-center py-3">
          <Spinner size="sm" />
        </div>
      ) : results.length > 0 ? (
        <div className="flex flex-col gap-1 rounded-lg border border-border">
          {results.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border last:border-0">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-on-surface">{r.name}</div>
                <div className="text-xs text-muted">{r.city || "—"} · {r.approvalStatus}</div>
              </div>
              <Button
                size="sm"
                intent="outline"
                onClick={() => {
                  onSelect(r);
                  setSearch("");
                  setResults([]);
                }}
              >
                <Plus size={14} /> Add
              </Button>
            </div>
          ))}
        </div>
      ) : search.trim() ? (
        <p className="px-1 text-xs text-muted">No matches.</p>
      ) : null}
    </div>
  );
}
