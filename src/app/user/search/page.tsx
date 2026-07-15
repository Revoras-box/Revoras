"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Container, Input, Select, Checkbox, Chip, Button, BusinessCard, CardSkeleton, EmptyState, ErrorState, Pagination } from "@/components/ui";
import { useBusinesses, useCategories } from "@/lib/hooks";
import { useFavoriteState } from "@/lib/favorites";
import { businessToCardProps } from "@/components/user/sections/utils";
import { FilterDrawer, EMPTY_FILTERS, countActiveFilters, type AdvancedFilters } from "@/components/user/sections/FilterDrawer";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "distance", label: "Nearest" },
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "reviews", label: "Most reviewed" },
  { value: "priceLow", label: "Price: Low to high" },
  { value: "priceHigh", label: "Price: High to low" },
  { value: "fastestResponse", label: "Fastest response" },
  { value: "name", label: "Name (A-Z)" },
];

const csvParam = (v: string | null): string[] => (v ? v.split(",").filter(Boolean) : []);

const filtersFromParams = (searchParams: URLSearchParams): AdvancedFilters => ({
  minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
  priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
  priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
  serviceCategoryId: searchParams.get("serviceCategoryId") ?? undefined,
  amenities: csvParam(searchParams.get("amenities")),
  paymentMethods: csvParam(searchParams.get("paymentMethods")),
  languages: csvParam(searchParams.get("languages")),
  accessibility: csvParam(searchParams.get("accessibility")),
  verifiedOnly: searchParams.get("verifiedOnly") === "true",
  premiumOnly: searchParams.get("premiumOnly") === "true",
  featuredOnly: searchParams.get("featuredOnly") === "true",
  hasOffers: searchParams.get("hasOffers") === "true",
  openToday: searchParams.get("openToday") === "true",
});

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavoriteState();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [sortBy, setSortBy] = useState(searchParams.get("categoryId") ? "rating" : searchParams.get("sortBy") ?? "recommended");
  const [openNow, setOpenNow] = useState(searchParams.get("openNow") === "true");
  const [filters, setFilters] = useState<AdvancedFilters>(() => filtersFromParams(searchParams));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>();

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation(undefined),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => setPage(1), [search, categoryId, sortBy, openNow, filters]);

  const { data: categoriesData } = useCategories("business");
  const categoryOptions = useMemo(
    () => [{ value: "", label: "All categories" }, ...(categoriesData?.categories ?? []).map((c) => ({ value: c.id, label: c.name }))],
    [categoriesData]
  );
  const { data: serviceCategoriesData } = useCategories("service");
  const serviceCategoryName = (id: string) => serviceCategoriesData?.categories.find((c) => c.id === id)?.name ?? id;

  const effectiveSortBy = sortBy === "distance" && !location ? "rating" : sortBy;
  const params = useMemo(() => {
    const p: Record<string, string> = { page: String(page), limit: "20", sortBy: effectiveSortBy };
    if (search.trim()) p.search = search.trim();
    if (categoryId) p.categoryId = categoryId;
    if (effectiveSortBy === "distance" && location) {
      p.lat = String(location.lat);
      p.lng = String(location.lng);
    }
    if (openNow) p.openNow = "true";
    if (filters.openToday) p.openToday = "true";
    if (filters.minRating != null) p.minRating = String(filters.minRating);
    if (filters.priceMin != null) p.priceMin = String(filters.priceMin);
    if (filters.priceMax != null) p.priceMax = String(filters.priceMax);
    if (filters.serviceCategoryId) p.serviceCategoryId = filters.serviceCategoryId;
    if (filters.amenities.length) p.amenities = filters.amenities.join(",");
    if (filters.paymentMethods.length) p.paymentMethods = filters.paymentMethods.join(",");
    if (filters.languages.length) p.languages = filters.languages.join(",");
    if (filters.accessibility.length) p.accessibility = filters.accessibility.join(",");
    if (filters.verifiedOnly) p.verifiedOnly = "true";
    if (filters.premiumOnly) p.premiumOnly = "true";
    if (filters.featuredOnly) p.featuredOnly = "true";
    if (filters.hasOffers) p.hasOffers = "true";
    return p;
  }, [page, search, categoryId, effectiveSortBy, location, openNow, filters]);

  // URL-synced filters: every search/filter/sort change replaces the URL (not
  // push - typing in the search box shouldn't spam browser history) so the
  // current view is always shareable/bookmarkable and survives a refresh.
  useEffect(() => {
    const qs = new URLSearchParams(params);
    qs.delete("page");
    qs.delete("limit");
    router.replace(qs.toString() ? `/user/search?${qs.toString()}` : "/user/search", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const { data, loading, error, refetch } = useBusinesses(params);
  const businesses = data?.businesses ?? [];
  const pagination = data?.pagination;
  const activeFilterCount = countActiveFilters(filters);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  // One removable chip per active facet - lets a filter be lifted right from
  // the results view, not just from inside the drawer (Fresha/Booksy pattern).
  const appliedChips: { key: string; label: string; onRemove: () => void }[] = [
    ...(filters.minRating != null ? [{ key: "minRating", label: `${filters.minRating}+ ★`, onRemove: () => setFilters((f) => ({ ...f, minRating: undefined })) }] : []),
    ...(filters.priceMin != null || filters.priceMax != null
      ? [
          {
            key: "price",
            label: `₹${filters.priceMin ?? 0}${filters.priceMax != null ? `–₹${filters.priceMax}` : "+"}`,
            onRemove: () => setFilters((f) => ({ ...f, priceMin: undefined, priceMax: undefined })),
          },
        ]
      : []),
    ...(filters.serviceCategoryId
      ? [{ key: "serviceCategoryId", label: serviceCategoryName(filters.serviceCategoryId), onRemove: () => setFilters((f) => ({ ...f, serviceCategoryId: undefined })) }]
      : []),
    ...(filters.verifiedOnly ? [{ key: "verifiedOnly", label: "Verified only", onRemove: () => setFilters((f) => ({ ...f, verifiedOnly: false })) }] : []),
    ...(filters.premiumOnly ? [{ key: "premiumOnly", label: "Premium only", onRemove: () => setFilters((f) => ({ ...f, premiumOnly: false })) }] : []),
    ...(filters.featuredOnly ? [{ key: "featuredOnly", label: "Featured only", onRemove: () => setFilters((f) => ({ ...f, featuredOnly: false })) }] : []),
    ...(filters.hasOffers ? [{ key: "hasOffers", label: "Has offers", onRemove: () => setFilters((f) => ({ ...f, hasOffers: false })) }] : []),
    ...(filters.openToday ? [{ key: "openToday", label: "Open today", onRemove: () => setFilters((f) => ({ ...f, openToday: false })) }] : []),
    ...filters.amenities.map((a) => ({ key: `amenity-${a}`, label: a, onRemove: () => setFilters((f) => ({ ...f, amenities: f.amenities.filter((x) => x !== a) })) })),
    ...filters.accessibility.map((a) => ({ key: `access-${a}`, label: a, onRemove: () => setFilters((f) => ({ ...f, accessibility: f.accessibility.filter((x) => x !== a) })) })),
    ...filters.paymentMethods.map((a) => ({ key: `pay-${a}`, label: a, onRemove: () => setFilters((f) => ({ ...f, paymentMethods: f.paymentMethods.filter((x) => x !== a) })) })),
    ...filters.languages.map((a) => ({ key: `lang-${a}`, label: a, onRemove: () => setFilters((f) => ({ ...f, languages: f.languages.filter((x) => x !== a) })) })),
  ];

  return (
    <Container className="flex flex-col gap-6 py-8">
      <div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">Search</h1>
        <p className="mt-1 text-sm text-muted">Find the right studio or professional.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <Input
            leadingIcon={<SearchIcon size={18} />}
            placeholder="Search studios, services, or professionals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
        </div>
        <Select
          options={categoryOptions}
          value={categoryId}
          onValueChange={setCategoryId}
          placeholder="Category"
          className="md:w-48"
        />
        <Select options={SORT_OPTIONS} value={sortBy} onValueChange={setSortBy} className="md:w-44" />
        <Button intent="outline" onClick={() => setFiltersOpen(true)} className="shrink-0">
          <SlidersHorizontal size={16} /> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </Button>
      </div>

      <Checkbox label="Open now" checked={openNow} onCheckedChange={setOpenNow} />

      {appliedChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {appliedChips.map((c) => (
            <Chip key={c.key} onRemove={c.onRemove}>
              {c.label}
            </Chip>
          ))}
          <button className="text-sm font-medium text-primary hover:underline" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      ) : null}

      <FilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        value={filters}
        onChange={setFilters}
        onClear={clearFilters}
        resultCount={pagination?.total}
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState description={error} onRetry={refetch} />
      ) : businesses.length === 0 ? (
        <EmptyState
          title="No studios found"
          description={
            openNow || activeFilterCount > 0
              ? "No studios match these filters. Try removing one or two."
              : "Try a different search, category, or sort order."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                {...businessToCardProps(business)}
                isFavorite={isFavorite(business.id)}
                onFavoriteToggle={() => toggleFavorite(business.id)}
                onClick={() => router.push(`/user/business/${business.id}`)}
              />
            ))}
          </div>
          {pagination ? <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} /> : null}
        </>
      )}
    </Container>
  );
}

function SearchPageFallback() {
  return <Container className="py-8 text-sm text-muted">Loading search...</Container>;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
