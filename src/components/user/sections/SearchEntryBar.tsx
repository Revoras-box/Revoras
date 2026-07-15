"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui";

export default function SearchEntryBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/user/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        leadingIcon={<Search size={18} />}
        placeholder="Search studios, services, or professionals..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
    </form>
  );
}
