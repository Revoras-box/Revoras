"use client";

import { Drawer, Button, Chip, Input, Select, Checkbox, Divider } from "@/components/ui";
import { useCategories } from "@/lib/hooks";

/**
 * Phase 2.1 (Advanced Filters). All fields here map 1:1 to
 * discovery.validator.js's query params - kept as a flat object so the search
 * page can spread it straight into useBusinesses' params (after stringifying).
 *
 * amenities/paymentMethods/languages/accessibility are free text the business
 * owner typed into a comma-separated field (see business/settings ProfileTab) -
 * these preset chips mirror that screen's own placeholder examples ("WiFi,
 * Parking, AC" etc.) so they have the best chance of matching real data, but
 * a business that entered something else in different words won't match.
 */
export interface AdvancedFilters {
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  serviceCategoryId?: string;
  amenities: string[];
  paymentMethods: string[];
  languages: string[];
  accessibility: string[];
  verifiedOnly: boolean;
  premiumOnly: boolean;
  featuredOnly: boolean;
  openToday: boolean;
  hasOffers: boolean;
}

export const EMPTY_FILTERS: AdvancedFilters = {
  amenities: [],
  paymentMethods: [],
  languages: [],
  accessibility: [],
  verifiedOnly: false,
  premiumOnly: false,
  featuredOnly: false,
  openToday: false,
  hasOffers: false,
};

export function countActiveFilters(f: AdvancedFilters): number {
  let n = f.amenities.length + f.paymentMethods.length + f.languages.length + f.accessibility.length;
  if (f.minRating != null) n += 1;
  if (f.priceMin != null || f.priceMax != null) n += 1;
  if (f.serviceCategoryId) n += 1;
  if (f.verifiedOnly) n += 1;
  if (f.premiumOnly) n += 1;
  if (f.featuredOnly) n += 1;
  if (f.openToday) n += 1;
  if (f.hasOffers) n += 1;
  return n;
}

const RATING_OPTIONS = [4.5, 4, 3.5, 3];
const AMENITY_OPTIONS = ["WiFi", "Parking", "AC"];
const ACCESSIBILITY_OPTIONS = ["Wheelchair accessible", "Accessible parking"];
const PAYMENT_METHOD_OPTIONS = ["Cash", "Card", "UPI"];
const LANGUAGE_OPTIONS = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Gujarati", "Kannada"];

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function ChipGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip key={opt} selected={selected.includes(opt)} onClick={() => onToggle(opt)} type="button">
          {opt}
        </Chip>
      ))}
    </div>
  );
}

/**
 * The filter controls, shared by the desktop sticky sidebar and the mobile
 * bottom-sheet (FilterDrawer). Pure controls — no surrounding chrome — so both
 * hosts render exactly the same fields and stay in sync automatically.
 */
export function FilterControls({ value, onChange }: { value: AdvancedFilters; onChange: (next: AdvancedFilters) => void }) {
  const { data: serviceCategoriesData } = useCategories("service");
  const serviceCategoryOptions = [
    { value: "", label: "Any service" },
    ...(serviceCategoriesData?.categories ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];

  const patch = (p: Partial<AdvancedFilters>) => onChange({ ...value, ...p });

  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Availability</div>
          <Checkbox label="Open today" checked={value.openToday} onCheckedChange={(v) => patch({ openToday: v })} />
          <Checkbox label="Has offers" checked={value.hasOffers} onCheckedChange={(v) => patch({ hasOffers: v })} />
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Minimum rating</div>
          <div className="flex flex-wrap gap-2">
            {RATING_OPTIONS.map((r) => (
              <Chip
                key={r}
                type="button"
                selected={value.minRating === r}
                onClick={() => patch({ minRating: value.minRating === r ? undefined : r })}
              >
                {r}+ ★
              </Chip>
            ))}
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Price range (₹)</div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={value.priceMin ?? ""}
              onChange={(e) => patch({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
            />
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={value.priceMax ?? ""}
              onChange={(e) => patch({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Trust</div>
          <Checkbox label="Verified only" checked={value.verifiedOnly} onCheckedChange={(v) => patch({ verifiedOnly: v })} />
          <Checkbox label="Premium only" checked={value.premiumOnly} onCheckedChange={(v) => patch({ premiumOnly: v })} />
          <Checkbox label="Featured only" checked={value.featuredOnly} onCheckedChange={(v) => patch({ featuredOnly: v })} />
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Service type</div>
          <Select
            options={serviceCategoryOptions}
            value={value.serviceCategoryId ?? ""}
            onValueChange={(v) => patch({ serviceCategoryId: v || undefined })}
          />
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Amenities</div>
          <ChipGroup options={AMENITY_OPTIONS} selected={value.amenities} onToggle={(v) => patch({ amenities: toggle(value.amenities, v) })} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Accessibility</div>
          <ChipGroup
            options={ACCESSIBILITY_OPTIONS}
            selected={value.accessibility}
            onToggle={(v) => patch({ accessibility: toggle(value.accessibility, v) })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Payment methods</div>
          <ChipGroup
            options={PAYMENT_METHOD_OPTIONS}
            selected={value.paymentMethods}
            onToggle={(v) => patch({ paymentMethods: toggle(value.paymentMethods, v) })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-on-surface">Languages</div>
          <ChipGroup options={LANGUAGE_OPTIONS} selected={value.languages} onToggle={(v) => patch({ languages: toggle(value.languages, v) })} />
        </div>
    </div>
  );
}

export interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AdvancedFilters;
  onChange: (next: AdvancedFilters) => void;
  onClear: () => void;
  resultCount?: number;
}

/** Mobile bottom-sheet host for FilterControls (desktop uses the sticky sidebar). */
export function FilterDrawer({ open, onOpenChange, value, onChange, onClear, resultCount }: FilterDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      description="Narrow down studios to exactly what you need."
      side="bottom"
      footer={
        <>
          <Button intent="ghost" onClick={onClear}>
            Clear all
          </Button>
          <Button onClick={() => onOpenChange(false)}>{resultCount != null ? `Show ${resultCount} results` : "Apply"}</Button>
        </>
      }
    >
      <FilterControls value={value} onChange={onChange} />
    </Drawer>
  );
}
