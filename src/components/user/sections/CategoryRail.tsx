"use client";

import { useRouter } from "next/navigation";
import { CategoryChip, Skeleton } from "@/components/ui";
import { useCategories } from "@/lib/hooks";

export default function CategoryRail() {
  const router = useRouter();
  const { data, loading } = useCategories("business");
  const categories = data?.categories ?? [];

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          onClick={() => router.push(`/user/search?categoryId=${category.id}`)}
        >
          {category.name}
        </CategoryChip>
      ))}
    </div>
  );
}
