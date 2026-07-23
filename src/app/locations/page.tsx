"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Search } from "lucide-react";
import { useBusinesses } from "@/lib/hooks";
import type { Business } from "@/lib/types";

function ratingOf(b: Business): string | null {
  // `rating` arrives as a pg decimal, which the driver hands back as a string.
  const n = b.rating ? Number(b.rating) : 0;
  return n > 0 ? n.toFixed(1) : null;
}

export default function LocationsPage() {
  const { data, loading } = useBusinesses({ limit: "20" });
  const businesses = (data?.businesses ?? []).filter((b) => b.lat != null && b.lng != null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Map init runs once on mount, independent of business data arriving later.
  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      const mapContainer = document.getElementById("map") as HTMLDivElement | null;
      if (!mapContainer || (mapContainer as any)._leaflet_id || cancelled) return;

      const map = L.map("map", {
        center: [40.7549, -73.984],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setMapLoaded(true);
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Markers are re-synced whenever the real business list changes.
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    let disposed = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (disposed || !mapRef.current) return;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: #C8A96E;
            border-radius: 50%;
            border: 3px solid #050505;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          "></div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      businesses.forEach((business, index) => {
        const marker = L.marker([business.lat as number, business.lng as number], { icon: customIcon }).addTo(mapRef.current);

        marker.on("click", () => {
          setSelectedIndex(index);
        });

        marker.bindTooltip(business.name, {
          direction: "top",
          offset: [0, -15],
          className: "custom-tooltip",
        });

        markersRef.current.push(marker);
      });

      if (businesses.length > 0) {
        const bounds = L.latLngBounds(businesses.map((b) => [b.lat as number, b.lng as number]));
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    })();

    return () => {
      disposed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, JSON.stringify(businesses.map((b) => b.id))]);

  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />

      {/* Left Map Section */}
      <div className="flex-1 relative">
        <div id="map" className="w-full h-full min-h-125" />

        {!mapLoaded && (
          <div className="absolute inset-0 bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted">Loading map...</p>
            </div>
          </div>
        )}

        {/* Bottom Floating Badge */}
        {!loading && (
          <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 z-1000">
            <div className="text-sm">
              <span className="text-primary font-semibold">
                {businesses.length}
              </span>
              <span className="text-muted ml-2">
                {businesses.length === 1 ? "Studio Found" : "Studios Found"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-105 pt-25 bg-background border-l border-border p-8 overflow-y-auto">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold">
            Find a Studio
          </h2>

          <p className="text-muted">
            Premium grooming concierge at your fingertips.
          </p>

          {/* Search */}
          <div className="bg-background rounded-xl px-4 py-3 flex items-center gap-3">
            <Search className="text-muted" size={18} />
            <input
              className="bg-transparent outline-none w-full text-foreground placeholder:text-secondary-foreground"
              placeholder="Find a different city..."
            />
          </div>
        </div>

        {/* Location Cards */}
        <div className="space-y-6">
          {loading && (
            <p className="text-muted text-sm">Loading studios...</p>
          )}

          {!loading && businesses.length === 0 && (
            <p className="text-muted text-sm">No studios found yet. Check back soon.</p>
          )}

          {businesses.map((business, index) => {
            const rating = ratingOf(business);
            return (
              <div
                key={business.id}
                onClick={() => setSelectedIndex(index)}
                className={`bg-background rounded-2xl p-6 space-y-4 border cursor-pointer transition-all ${
                  selectedIndex === index
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    {business.name}
                  </h3>
                </div>

                <div className="text-sm text-muted">
                  {rating && <>⭐ {rating} • </>}
                  {business.city ?? business.address}
                </div>

                <p className="text-secondary-foreground text-sm line-clamp-2">
                  {business.address}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-secondary-foreground">
                    {business.category_name ?? "Studio"}
                  </span>
                  <Link
                    href={`/user/business/${business.id}`}
                    className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Studio
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

        #map {
          width: 100%;
          height: 100%;
          background: #0a0a0a;
        }

        .custom-tooltip {
          background: #111 !important;
          border: 1px solid rgba(200, 169, 110, 0.3) !important;
          color: white !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          font-size: 12px !important;
        }

        .custom-tooltip::before {
          border-top-color: rgba(200, 169, 110, 0.3) !important;
        }

        .leaflet-container {
          background: #0a0a0a !important;
          font-family: inherit !important;
        }
      `}</style>
    </div>
  );
}
