"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, SlidersHorizontal, LayoutGrid, List as ListIcon, Sparkles, TrendingUp, Star, Clock } from "lucide-react";
import { Container, Input, Select, Chip, Button, BusinessCard, CardSkeleton, EmptyState, ErrorState, Pagination } from "@/components/ui";
import { useBusinesses, useCategories } from "@/lib/hooks";
import { useFavoriteState } from "@/lib/favorites";
import { businessToCardProps } from "@/components/user/sections/utils";
import DiscoveryRail from "@/components/user/sections/DiscoveryRail";
import { FilterDrawer, FilterControls, EMPTY_FILTERS, countActiveFilters, type AdvancedFilters } from "@/components/user/sections/FilterDrawer";
import { CategoryIcon } from "@/lib/category-icons";

// Free-text searches the hero surfaces as one-tap chips. These are plain
// keyword searches (they fill the search box), distinct from the category
// pills below, which set the structured categoryId filter.
const TRENDING_SEARCHES = ["Haircut", "Beard trim", "Spa", "Massage", "Facial", "Manicure", "Hair color"];

// Curated rails shown in the idle "browse" state (no search/filter/category,
// default sort) — a magazine-style landing instead of a flat recommended grid.
const BROWSE_RAILS = [
  { key: "trending", title: "Trending now", Icon: TrendingUp, params: { sortBy: "trending" } },
  { key: "rating", title: "Top rated", Icon: Star, params: { sortBy: "rating" } },
  { key: "newest", title: "New on Revoras", Icon: Clock, params: { sortBy: "newest" } },
] as const;

// How many cards a browse rail asks for. 12 divides evenly by 6, 4, 3 and 2 —
// every column count the responsive grid produces — so a rail always ends on a
// full row. It doubles as the "is there enough to fill a rail" threshold.
const RAIL_SIZE = 12;

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
  const [view, setView] = useState<"grid" | "list">("grid");
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

  // The idle landing state: nothing has been searched, filtered, or re-sorted.
  // Here we show curated discovery rails rather than a flat 20-tile grid; the
  // moment the visitor engages any control we switch to real results.
  const isBrowseMode =
    !search.trim() && !categoryId && !openNow && activeFilterCount === 0 && sortBy === "recommended";

  /**
   * Are there enough studios for three differently-sorted rails to actually
   * differ? Each rail asks for 12, so anything at or below that is the same set
   * three times over — the headings promise a selection the data cannot make.
   *
   * `pagination.total` is already on hand: the results query runs in browse mode
   * too (its output is what the flat-grid branch renders), so this costs no
   * extra request.
   *
   * `null` means "not known yet", and is deliberately not folded into either
   * answer. Defaulting it to "enough" rendered all three rails on first paint
   * and then tore them down a moment later when the count arrived — three
   * headings appearing and vanishing. Browse mode waits for the count instead
   * and shows a skeleton, so the layout is chosen once.
   */
  const totalStudios = pagination?.total ?? null;
  const railsWouldRepeat = totalStudios == null ? null : totalStudios <= RAIL_SIZE;

  // Category pills mirror the header <Select> — both drive categoryId, so they
  // stay in sync. The "All" pill clears back to every category.
  const categoryPills = categoriesData?.categories ?? [];

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

  const totalCount = pagination?.total ?? businesses.length;
  const gridClass =
    view === "list" ? "flex flex-col gap-3" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <>
      {/*
        The page used to open with three stacked full-width bands offering three
        overlapping ways to narrow things: free-text chips labelled "Trending",
        a "Category" <Select>, and a row of category pills. The Select and the
        pills were driving the same `categoryId` off the same list — the old
        comment said as much — so one of them was pure duplication, and the
        trending chips looked identical to the category pills while doing
        something entirely different (filling the search box rather than
        filtering). Three lookalike controls, two meanings, ~340px of chrome
        before a single result.

        Now: a slim hero that says where you are, one sticky search row, and one
        row of category pills. Popular searches survive as underlined text links
        rather than pills, so they no longer read as a second set of filters.
      */}
      <div className="relative overflow-hidden border-b border-border bg-linear-to-br from-primary/12 via-surface-container to-accent/10">
        <div className="grainy-overlay absolute inset-0" />
        <Container width="full" className="max-w-[96rem] relative flex flex-col gap-2.5 py-6 sm:py-7">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            <Sparkles size={14} />
            Discover
          </div>
          <h1 className="max-w-xl font-headline text-2xl font-bold text-on-surface sm:text-3xl">
            Find your next great experience
          </h1>
          <p className="max-w-xl text-sm text-muted">
            Browse trusted salons, barbers, spas and beauty professionals — then book in a few taps.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-widest text-muted">Popular</span>
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearch(term)}
                className="text-on-surface underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Sticky compact search header. The Category <Select> that used to sit
          here is gone — the pill row below it sets the same value from the same
          list, and is easier to scan. */}
      <div className="sticky top-16 z-30 border-b border-border glass-nav">
        <Container width="full" className="max-w-[96rem] flex items-center gap-2 py-3">
          <div className="flex-1">
            <Input
              leadingIcon={<SearchIcon size={18} />}
              placeholder="Search studios, services, or professionals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
          </div>
          <Button intent="outline" onClick={() => setFiltersOpen(true)} className="shrink-0 lg:hidden">
            <SlidersHorizontal size={16} /> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>
        </Container>
      </div>

      {/* Scrollable category pills — a visual, browse-first way to set the
          category filter (mirrors the header Select). */}
      {categoryPills.length > 0 ? (
        <div className="border-b border-border bg-surface">
          <Container width="full" className="max-w-[96rem] py-3">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip type="button" selected={!categoryId} onClick={() => setCategoryId("")} className="shrink-0">
                All
              </Chip>
              {categoryPills.map((c) => (
                <Chip
                  key={c.id}
                  type="button"
                  selected={categoryId === c.id}
                  onClick={() => setCategoryId(categoryId === c.id ? "" : c.id)}
                  // Was `{c.icon}` — printing the stored Material Symbols
                  // ligature name as text. See lib/category-icons.
                  icon={<CategoryIcon icon={c.icon} />}
                  className="shrink-0"
                >
                  {c.name}
                </Chip>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      <Container width="full" className="max-w-[96rem] flex flex-col gap-5 py-6">
        {isBrowseMode && railsWouldRepeat === null ? (
          /* Count not in yet — hold the space rather than commit to a layout
             we may have to swap out a frame later. */
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 45%), 1fr))" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isBrowseMode && railsWouldRepeat === false ? (
          /* Idle browse mode — curated discovery rails instead of a flat grid. */
          <div className="flex flex-col gap-10">
            {BROWSE_RAILS.map(({ key, title, Icon, params: railParams }) => (
              <section key={key} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-headline text-xl font-semibold text-on-surface">
                    <Icon size={18} className="text-primary" />
                    {title}
                  </h2>
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => setSortBy(railParams.sortBy)}
                  >
                    See all
                  </button>
                </div>
                <DiscoveryRail params={railParams} emptyTitle="Nothing to show yet" count={RAIL_SIZE} />
              </section>
            ))}
          </div>
        ) : isBrowseMode ? (
          /*
            Too few studios for rails to mean anything, so one honest list.

            "Trending now", "Top rated" and "New on Revoras" are three sorts of
            the same table. That is a useful way to cut a large catalogue and a
            silly one to cut a small one: with two approved studios all three
            rails printed the same two cards, and the page read as though it were
            padding itself — the same shop three times under three headings that
            each implied a different selection.

            Below the threshold the honest thing is to show every studio once,
            with the sort control the rails were standing in for. The rails come
            back on their own as the marketplace fills up; nothing here needs
            changing when it does.
          */
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-headline text-xl font-semibold text-on-surface">
                  {loading ? "Loading studios…" : `${totalCount} ${totalCount === 1 ? "studio" : "studios"} on Revoras`}
                </h2>
                <p className="text-sm text-muted">Everything available right now — more are joining.</p>
              </div>
              <Select options={SORT_OPTIONS} value={sortBy} onValueChange={setSortBy} className="w-44" />
            </div>
            {loading ? (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 45%), 1fr))" }}>
                {[1, 2, 3, 4].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState description={error} onRetry={refetch} />
            ) : businesses.length === 0 ? (
              <EmptyState
                title="No studios listed yet"
                description="New salons, barbers and spas are being added — check back soon."
              />
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 45%), 1fr))" }}>
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
            )}
          </section>
        ) : (
        <>
        {/* Results header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-headline text-xl font-semibold text-on-surface">
              {loading ? "Searching…" : `${totalCount} ${totalCount === 1 ? "studio" : "studios"}`}
            </h1>
            <p className="text-sm text-muted">
              {search.trim() ? `for “${search.trim()}”` : "Find the right studio or professional."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select options={SORT_OPTIONS} value={sortBy} onValueChange={setSortBy} className="w-40" />
            <div className="hidden items-center rounded-full border border-border p-0.5 sm:flex">
              {([
                { key: "grid", Icon: LayoutGrid, label: "Grid view" },
                { key: "list", Icon: ListIcon, label: "List view" },
              ] as const).map(({ key, Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  aria-pressed={view === key}
                  onClick={() => setView(key)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    view === key ? "bg-primary text-primary-foreground" : "text-muted hover:text-on-surface"
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick toggle + applied filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <Chip type="button" selected={openNow} onClick={() => setOpenNow((v) => !v)}>
            Open now
          </Chip>
          {appliedChips.map((c) => (
            <Chip key={c.key} onRemove={c.onRemove}>
              {c.label}
            </Chip>
          ))}
          {appliedChips.length > 0 ? (
            <button className="text-sm font-medium text-primary hover:underline" onClick={clearFilters}>
              Clear all
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Desktop sticky filter sidebar */}
          <aside className="hidden shrink-0 lg:block lg:w-64">
            <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-headline text-base font-semibold text-on-surface">Filters</h2>
                {activeFilterCount > 0 ? (
                  <button className="text-sm font-medium text-primary hover:underline" onClick={clearFilters}>
                    Clear
                  </button>
                ) : null}
              </div>
              <FilterControls value={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className={gridClass}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState description={error} onRetry={refetch} />
            ) : businesses.length === 0 ? (
              <div className="flex flex-col gap-10">
                <EmptyState
                  title="No studios match your search"
                  description="Try widening things a little."
                  action={
                    <div className="flex flex-wrap justify-center gap-2">
                      {activeFilterCount > 0 ? (
                        <Button size="sm" onClick={clearFilters}>Clear filters</Button>
                      ) : null}
                      {openNow ? (
                        <Button intent="outline" size="sm" onClick={() => setOpenNow(false)}>Remove “Open now”</Button>
                      ) : null}
                      <Button intent="outline" size="sm" onClick={() => { setSearch(""); setCategoryId(""); setOpenNow(false); clearFilters(); }}>
                        Reset all
                      </Button>
                      <Button intent="outline" size="sm" asChild>
                        <Link href="/user">Browse nearby</Link>
                      </Button>
                    </div>
                  }
                />
                <section className="flex flex-col gap-4">
                  <h2 className="font-headline text-xl font-semibold text-on-surface">You may also like</h2>
                  <DiscoveryRail params={{ sortBy: "recommended" }} emptyTitle="Nothing to show yet" />
                </section>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className={gridClass}>
                  {businesses.map((business, i) => (
                    <div
                      key={business.id}
                      className="animate-fade-rise"
                      // Staggered entrance, capped so late cards don't lag — the
                      // grid settles in as a wave rather than all at once.
                      style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                    >
                      <BusinessCard
                        {...businessToCardProps(business)}
                        layout={view}
                        isFavorite={isFavorite(business.id)}
                        onFavoriteToggle={() => toggleFavorite(business.id)}
                        onClick={() => router.push(`/user/business/${business.id}`)}
                      />
                    </div>
                  ))}
                </div>
                {pagination ? <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} /> : null}
                {businesses.length < 4 ? (
                  <section className="flex flex-col gap-4">
                    <h2 className="font-headline text-xl font-semibold text-on-surface">You may also like</h2>
                    <DiscoveryRail params={{ sortBy: "recommended" }} emptyTitle="Nothing else to show" />
                  </section>
                ) : null}
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </Container>

      {/* Mobile bottom-sheet filters */}
      <FilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        value={filters}
        onChange={setFilters}
        onClear={clearFilters}
        resultCount={pagination?.total}
      />
    </>
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
