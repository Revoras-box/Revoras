"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Search } from "lucide-react";

const locations = [
  {
    id: "classic-cuts",
    name: "Classic Cuts Studio",
    area: "Lower Manhattan",
    description: "Lower Manhattan's premier grooming lounge featuring bespoke hair design and classic straight-razor finishes.",
    rating: 4.9,
    activeBarbers: 8,
    status: "Open Now",
    coords: [40.7128, -74.006] as [number, number],
  },
  {
    id: "fade-room",
    name: "The Fade Room",
    area: "Midtown East",
    description: "Modern precision and urban style. Specializing in technical fades and artisanal beard sculpting.",
    rating: 4.8,
    activeBarbers: 6,
    status: "Open Now",
    coords: [40.7549, -73.9840] as [number, number],
  },
  {
    id: "obsidian-parlor",
    name: "Obsidian Parlor",
    area: "Upper West Side",
    description: "The pinnacle of luxury. Private suites and executive grooming services for the discerning professional.",
    rating: 4.9,
    activeBarbers: 10,
    status: "Open Now",
    coords: [40.7870, -73.9754] as [number, number],
  },
];

export default function LocationsPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let map: any = null;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      
      const mapContainer = document.getElementById("map") as HTMLDivElement | null;
      if (!mapContainer || (mapContainer as any)._leaflet_id) return;

      map = L.map("map", {
        center: [40.7549, -73.9840],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

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

      locations.forEach((location, index) => {
        const marker = L.marker(location.coords, { icon: customIcon }).addTo(map);
        
        marker.on("click", () => {
          setSelectedIndex(index);
        });

        marker.bindTooltip(location.name, {
          direction: "top",
          offset: [0, -15],
          className: "custom-tooltip",
        });
      });

      setMapLoaded(true);
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-black">
      <Navbar />

      {/* Left Map Section */}
      <div className="flex-1 relative">
        <div id="map" className="w-full h-full min-h-125" />

        {!mapLoaded && (
          <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading map...</p>
            </div>
          </div>
        )}

        {/* Bottom Floating Badge */}
        <div className="absolute bottom-6 left-6 bg-[#111]/90 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 z-1000">
          <div className="flex -space-x-2">
            <img className="w-8 h-8 rounded-full border border-black"
              src="https://i.pravatar.cc/40?img=1" />
            <img className="w-8 h-8 rounded-full border border-black"
              src="https://i.pravatar.cc/40?img=2" />
          </div>

          <div className="text-sm">
            <span className="text-[#C8A96E] font-semibold">
              124 Barbers
            </span>
            <span className="text-gray-400 ml-2">
              Active in Manhattan
            </span>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-105 pt-25 bg-[#0b0b0b] border-l border-white/5 p-8 overflow-y-auto">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold">
            Find a Studio
          </h2>

          <p className="text-gray-400">
            Premium grooming concierge at your fingertips.
          </p>

          {/* Search */}
          <div className="bg-[#111] rounded-xl px-4 py-3 flex items-center gap-3">
            <Search className="text-gray-400" size={18} />
            <input
              className="bg-transparent outline-none w-full text-white placeholder-gray-500"
              placeholder="Find a different city..."
            />
          </div>
        </div>

        {/* Location Cards */}
        <div className="space-y-6">
          {locations.map((location, index) => (
            <div
              key={location.id}
              onClick={() => setSelectedIndex(index)}
              className={`bg-[#111] rounded-2xl p-6 space-y-4 border cursor-pointer transition-all ${
                selectedIndex === index
                  ? "border-[#C8A96E] shadow-lg shadow-[#C8A96E]/10"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {location.name}
                </h3>

                <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                  LIVE
                </span>
              </div>

              <div className="text-sm text-gray-400">
                ⭐ {location.rating} • {location.area}
              </div>

              <p className="text-gray-500 text-sm line-clamp-2">
                {location.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  {location.activeBarbers} barbers available
                </span>
                <Link 
                  href="/login"
                  className="bg-[#C8A96E] text-black text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#d4b87a] transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
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
