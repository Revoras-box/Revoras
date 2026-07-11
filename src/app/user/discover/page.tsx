"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useStudiosForMap } from "@/lib/hooks";
import type { MapStudiosResponse } from "@/lib/types";

// Dynamic import of Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
});

const filters = ["Near Me", "Open Now", "Top Rated", "VIP Only"];

export default function DiscoverPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Near Me");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<number | null>(null);
  const [hoveredStudio, setHoveredStudio] = useState<number | null>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
        },
        (err) => {
          console.log("Location access denied:", err.message);
          setLocationError("Location access denied");
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError("Geolocation not supported");
      setLocationLoading(false);
    }
  }, []);

  // Fetch studios for map
  const mapParams = useMemo(() => ({
    ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng }),
    radius: 25,
    limit: 30
  }), [userLocation]);

  const { data: mapData, loading, error, refetch } = useStudiosForMap(mapParams);
  const typedMapData = mapData as MapStudiosResponse | null;
  
  // Filter studios based on active filter and search
  const studios = useMemo(() => {
    if (!typedMapData?.studios) return [];
    
    let filtered = typedMapData.studios;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.city?.toLowerCase().includes(query) ||
        s.address?.toLowerCase().includes(query)
      );
    }
    
    // Apply active filter
    switch (activeFilter) {
      case "Open Now":
        filtered = filtered.filter(s => s.is_open);
        break;
      case "Top Rated":
        filtered = filtered.filter(s => (s.rating ?? 0) >= 4.5);
        break;
      case "Near Me":
        // Already sorted by distance from API
        break;
    }
    
    return filtered;
  }, [typedMapData?.studios, searchQuery, activeFilter]);

  // Helper to get status display
  const getStudioStatus = (studio: { is_open: boolean; next_open: string | null }) => {
    if (studio.is_open) return { text: "OPEN NOW", isOpen: true };
    return { text: studio.next_open ? `Opens ${studio.next_open}` : "CLOSED", isOpen: false };
  };

  // Recenter map to user location
  const handleCenterOnUser = useCallback(() => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
        },
        () => {
          setLocationError("Could not get location");
          setLocationLoading(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Navigate to studio page
  const handleViewStudio = useCallback((id: number) => {
    router.push(`/user/studio/${id}`);
  }, [router]);

  return (
    <main className="relative h-screen w-full pt-20 overflow-hidden flex">
      {/* Sidebar */}
      <aside className="w-[420px] h-full bg-surface z-20 flex flex-col shadow-2xl">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-black font-headline tracking-tighter mb-2 text-foreground">Curated Studios</h1>
          <p className="text-sm font-label uppercase tracking-widest text-secondary-foreground">
            {userLocation ? (
              <>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-green-400 text-sm icon-filled">location_on</span>
                  Near You • {studios.length} found
                </span>
              </>
            ) : locationLoading ? (
              "Getting your location..."
            ) : (
              "All Locations"
            )}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4">
          {loading || locationLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-surface rounded-xl h-32"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted">
              <span className="material-symbols-outlined text-4xl mb-2">error</span>
              <p>Failed to load studios</p>
              <button 
                onClick={() => refetch()} 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : studios.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p>No studios found</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-primary text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            studios.map((studio, index) => {
              const status = getStudioStatus(studio);
              const isSelected = selectedStudio === studio.id;
              const isHovered = hoveredStudio === studio.id;
              
              return (
                <Link
                  key={studio.id}
                  href={`/user/studio/${studio.id}`}
                  className={`block rounded-xl p-5 transition-all cursor-pointer group ${
                    isSelected || isHovered
                      ? "bg-surface border-l-4 border-primary scale-[1.02]"
                      : index === 0
                      ? "bg-surface border-l-4 border-primary/50"
                      : "bg-card hover:bg-surface border border-border/10"
                  }`}
                  onMouseEnter={() => setHoveredStudio(studio.id)}
                  onMouseLeave={() => setHoveredStudio(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedStudio(studio.id);
                  }}
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      className="w-24 h-24 object-cover rounded-lg shadow-lg"
                      src={studio.image_url || "/images/studio-placeholder.jpg"}
                      alt={studio.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">
                          {studio.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-label tracking-tighter whitespace-nowrap flex-shrink-0 ${
                            status.isOpen
                              ? "bg-green-900/30 text-green-400"
                              : "bg-surface text-muted"
                          }`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <p className="text-sm text-muted font-medium mt-1 truncate">
                        {studio.city}, {studio.state}
                      </p>
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-sm icon-filled">
                            star
                          </span>
                          <span className="text-xs font-label font-bold">{studio.rating || "New"}</span>
                        </div>
                        {studio.review_count > 0 && (
                          <span className="text-xs text-secondary-foreground">({studio.review_count} reviews)</span>
                        )}
                        {studio.distance_km !== undefined && (
                          <span className="text-xs text-primary font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">directions_walk</span>
                            {studio.distance_km < 1 
                              ? `${Math.round(studio.distance_km * 1000)}m` 
                              : `${studio.distance_km}km`
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {studio.amenities?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {studio.amenities.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-surface text-[10px] font-label text-muted rounded-full border border-border/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick action */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/user/studio/${studio.id}`);
                      }}
                      className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold text-center hover:bg-primary transition-colors"
                    >
                      View Studio
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/user/studio/${studio.id}?book=true`);
                      }}
                      className="flex-1 py-2 bg-transparent border border-primary text-primary rounded-lg text-xs font-bold text-center hover:bg-primary/10 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </aside>

      {/* Map Area */}
      <div className="flex-1 relative bg-background">
        {/* Leaflet Map */}
        <LeafletMap
          studios={studios}
          userLocation={userLocation}
          selectedStudio={selectedStudio}
          hoveredStudio={hoveredStudio}
          onStudioSelect={setSelectedStudio}
          onStudioHover={setHoveredStudio}
          onViewStudio={handleViewStudio}
        />

        {/* Search & Filters */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[600px] z-[1001] space-y-4">
          <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex items-center gap-4 border border-border/20">
            <div className="flex-1 flex items-center px-4 gap-3">
              <span className="material-symbols-outlined text-secondary-foreground">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-foreground font-body placeholder:text-secondary-foreground"
                placeholder="Search studios, barbers, or styles..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-secondary-foreground hover:text-foreground"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <div className="h-8 w-[1px] bg-border"></div>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-surface rounded-xl transition-colors text-foreground">
              <span className="material-symbols-outlined text-sm">tune</span>
              <span className="text-xs font-label uppercase tracking-widest">Filters</span>
            </button>
          </div>

          <div className="flex justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-1.5 rounded-full text-xs font-label uppercase tracking-widest font-medium transition-colors flex items-center gap-2 ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    : "bg-surface/80 backdrop-blur-xl text-foreground border border-border/30 hover:bg-primary/10"
                }`}
              >
                {filter === "Near Me" && (
                  <span className="material-symbols-outlined text-sm icon-filled">
                    near_me
                  </span>
                )}
                {filter === "Open Now" && (
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>
                )}
                {filter === "Top Rated" && (
                  <span className="material-symbols-outlined text-sm icon-filled">
                    star
                  </span>
                )}
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Location Error Banner */}
        {locationError && !userLocation && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[1001]">
            <div className="bg-amber-900/80 backdrop-blur-sm text-amber-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">warning</span>
              {locationError}
              <button 
                onClick={handleCenterOnUser}
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Studios count badge */}
        <div className="absolute bottom-12 left-12 z-[1000] bg-surface/90 backdrop-blur-xl border border-border/30 rounded-xl px-4 py-3">
          <div className="text-xs text-muted font-label uppercase tracking-widest">Studios nearby</div>
          <div className="text-2xl font-headline font-bold text-primary">{studios.length}</div>
        </div>
      </div>
    </main>
  );
}
