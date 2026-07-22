"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import { businessApi, type GeocodeResult } from "@/lib/business/api";
import { useDebouncedValue } from "@/lib/business/useDebouncedValue";
import { Input } from "@/components/ui/Input";

export interface LocationValue {
  lat: number | null;
  lng: number | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

interface LocationPickerProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  /** Seeds the search box with the address the owner already typed in Basics. */
  initialQuery?: string;
}

// Geographic centre of India, used only when we have no pin and no idea where
// the owner is yet. As soon as a search result is chosen or an existing pin
// exists, we fly to it.
const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const INDIA_ZOOM = 5;
const PLACED_ZOOM = 16;

/**
 * Phase 4A. The shared address-and-pin picker behind both the onboarding
 * Location step and the profile location editor - one component so the two
 * can never drift apart.
 *
 * Two ways to set a location, and they stay in sync:
 *   - type an address -> forward geocode -> pick a result -> pin flies there;
 *   - drag the pin -> reverse geocode on drop -> address fields follow it.
 *
 * Reverse geocoding fires on `dragend` only, never on every pointer move -
 * that's one request per drag, matching the "Search this area", not
 * "auto-fetch" philosophy the whole map feature is built on, and it keeps us
 * inside the provider's 1 req/sec budget.
 *
 * Leaflet is loaded via dynamic import inside an effect because it touches
 * `window` on import and would break SSR otherwise. Its CSS is already pulled
 * in globally by the root layout.
 */
export function LocationPicker({ value, onChange, initialQuery }: LocationPickerProps) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  // onChange changes identity every render; hold the latest in a ref so the
  // Leaflet event handlers (bound once, at map init) always call the current
  // one without needing the map torn down and rebuilt on every keystroke.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [query, setQuery] = useState(initialQuery ?? "");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 400);

  // --- Map lifecycle: init once, tear down on unmount ---
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      leafletRef.current = L;

      const start: [number, number] =
        value.lat != null && value.lng != null ? [value.lat, value.lng] : INDIA_CENTER;
      const startZoom = value.lat != null && value.lng != null ? PLACED_ZOOM : INDIA_ZOOM;

      const map = L.map(mapEl.current, { center: start, zoom: startZoom, zoomControl: true });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // A tap anywhere on the map drops/moves the pin too - some owners find
      // that faster than dragging, and it reverse-geocodes the same way.
      map.on("click", (e: any) => {
        placeMarker(e.latlng.lat, e.latlng.lng);
        reverseLookup(e.latlng.lat, e.latlng.lng);
      });

      if (value.lat != null && value.lng != null) {
        placeMarker(value.lat, value.lng);
      }

      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // Intentionally run once: the map manages its own state after init, and
    // rebuilding it on prop changes would fight the user mid-interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goldPin = () => {
    const L = leafletRef.current;
    return L.divIcon({
      className: "location-picker-pin",
      html: `<div style="
        width:30px;height:30px;transform:translateY(-6px);
        background:var(--color-primary,#C8A96E);
        border:3px solid #fff;border-radius:50% 50% 50% 0;
        rotate:-45deg;box-shadow:0 6px 16px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 24],
    });
  };

  const placeMarker = (lat: number, lng: number) => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { icon: goldPin(), draggable: true }).addTo(map);
      // One reverse lookup per drag, on drop - not a stream during the drag.
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        reverseLookup(p.lat, p.lng);
      });
      markerRef.current = marker;
    }
    map.flyTo([lat, lng], Math.max(map.getZoom(), PLACED_ZOOM), { duration: 0.6 });
  };

  const reverseLookup = async (lat: number, lng: number) => {
    // Emit the coordinates immediately - the pin's position is the source of
    // truth for lat/lng even if the address lookup then fails or lags.
    onChangeRef.current({ ...value, lat, lng });
    setReverseLoading(true);
    setSearchError(null);
    try {
      const { result } = await businessApi.geocodeReverse(lat, lng);
      if (result) {
        onChangeRef.current({
          lat,
          lng,
          address: result.address.line1 || result.displayName,
          city: result.address.city,
          state: result.address.state,
          country: result.address.country,
          zipCode: result.address.zipCode,
        });
      }
    } catch {
      // A failed reverse lookup is non-fatal: the pin still holds valid
      // coordinates, so the owner can save. Only the auto-filled address text
      // is missing, which they can type.
      setSearchError("Couldn't look up the address for that spot — the pin location is still saved.");
    } finally {
      setReverseLoading(false);
    }
  };

  // --- Forward search ---
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setSearchError(null);
    businessApi
      .geocodeSearch(debouncedQuery.trim(), 5)
      .then(({ results }) => {
        if (cancelled) return;
        setResults(results);
        setOpen(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setResults([]);
        // The backend degrades provider outages to a 503 with a usable
        // message; surface it so the owner knows to drag the pin instead.
        setSearchError(
          err?.status === 503
            ? "Address search is temporarily unavailable — drop the pin on the map instead."
            : "Couldn't search that address. Try again, or place the pin manually.",
        );
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const selectResult = (r: GeocodeResult) => {
    setQuery(r.displayName);
    setResults([]);
    setOpen(false);
    setSearchError(null);
    placeMarker(r.lat, r.lng);
    onChange({
      lat: r.lat,
      lng: r.lng,
      address: r.address.line1 || r.displayName,
      city: r.address.city,
      state: r.address.state,
      country: r.address.country,
      zipCode: r.address.zipCode,
    });
  };

  const hasPin = value.lat != null && value.lng != null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Input
          label="Search for your address"
          placeholder="Street, area, city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          leadingIcon={<Search size={16} />}
          trailingIcon={searching ? <Loader2 size={16} className="animate-spin" /> : undefined}
          hint="Pick a result, then drag the pin to the exact spot."
        />

        {open && results.length > 0 && (
          <ul className="absolute z-[var(--z-popover,1000)] mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface shadow-floating">
            {results.map((r, i) => (
              <li key={`${r.lat},${r.lng},${i}`}>
                <button
                  type="button"
                  onClick={() => selectResult(r)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm text-on-surface hover:bg-surface-container-low"
                >
                  <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                  <span className="min-w-0">{r.displayName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {searchError && <p className="text-xs text-error">{searchError}</p>}

      <div className="relative overflow-hidden rounded-2xl border border-border">
        <div ref={mapEl} className="h-72 w-full sm:h-96" />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-low">
            <Loader2 className="animate-spin text-muted" />
          </div>
        )}
        {reverseLoading && (
          <div className="absolute bottom-3 left-3 z-[var(--z-popover,1000)] flex items-center gap-2 rounded-full bg-surface/95 px-3 py-1.5 text-xs text-muted shadow-floating backdrop-blur">
            <Loader2 size={13} className="animate-spin" /> Finding address…
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">
          {hasPin ? (
            <span className="inline-flex items-center gap-1.5 text-on-surface">
              <MapPin size={13} className="text-primary" />
              {value.lat!.toFixed(5)}, {value.lng!.toFixed(5)}
            </span>
          ) : (
            "No location set — search above or tap the map."
          )}
        </span>
        <span className="text-muted">© OpenStreetMap contributors</span>
      </div>
    </div>
  );
}
