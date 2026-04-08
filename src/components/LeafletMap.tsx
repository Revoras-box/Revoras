"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Studio {
  id: number;
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
  is_open: boolean;
  distance_km?: number;
  image_url?: string | null;
}

interface LeafletMapProps {
  studios: Studio[];
  userLocation: { lat: number; lng: number } | null;
  selectedStudio: number | null;
  hoveredStudio: number | null;
  onStudioSelect: (id: number | null) => void;
  onStudioHover: (id: number | null) => void;
  onViewStudio?: (id: number) => void;
}

// Custom icon for studios
const createStudioIcon = (isOpen: boolean, isActive: boolean) => {
  const color = isOpen ? "#E5C487" : "#6b7280";
  const scale = isActive ? 1.3 : 1;
  const shadowSize = isActive ? 20 : 0;
  
  return L.divIcon({
    className: "custom-studio-marker",
    html: `
      <div style="
        width: ${28 * scale}px;
        height: ${28 * scale}px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 ${shadowSize}px ${color}80, 0 2px 8px rgba(0,0,0,0.4);
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="${14 * scale}" height="${14 * scale}" viewBox="0 0 24 24" fill="${isOpen ? '#402d00' : '#fff'}">
          <path d="M9.5 17.5L5.75 13.75L4.5 15L9.5 20L20 9.5L18.75 8.25L9.5 17.5Z"/>
          <path d="M19 3L13 9L10 6L8.59 7.41L13 11.83L20.41 4.41L19 3Z"/>
        </svg>
      </div>
    `,
    iconSize: [28 * scale, 28 * scale],
    iconAnchor: [14 * scale, 14 * scale],
    popupAnchor: [0, -14 * scale],
  });
};

// Custom icon for user location
const userIcon = L.divIcon({
  className: "custom-user-marker",
  html: `
    <div style="position: relative; width: 20px; height: 20px;">
      <div style="
        position: absolute;
        width: 32px;
        height: 32px;
        top: -6px;
        left: -6px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
      <div style="
        position: relative;
        width: 16px;
        height: 16px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        margin: 2px;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function LeafletMap({
  studios,
  userLocation,
  selectedStudio,
  hoveredStudio,
  onStudioSelect,
  onStudioHover,
  onViewStudio,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultCenter: [number, number] = userLocation 
      ? [userLocation.lat, userLocation.lng] 
      : [28.6139, 77.2090]; // Default to Delhi

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark theme map tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Add attribution in corner
    L.control.attribution({
      position: "bottomleft",
      prefix: false,
    }).addAttribution('&copy; <a href="https://carto.com/">CARTO</a>').addTo(map);

    mapRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    
    mapRef.current.setView([userLocation.lat, userLocation.lng], 14, {
      animate: true,
      duration: 1,
    });
  }, [userLocation]);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      })
        .addTo(mapRef.current)
        .bindPopup("<b>You are here</b>", {
          className: "custom-popup",
        });
    }
  }, [userLocation]);

  // Handle studio popup creation
  const createPopupContent = useCallback((studio: Studio) => {
    return `
      <div style="
        background: #1a1a1a;
        border-radius: 12px;
        padding: 12px;
        min-width: 180px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <h3 style="
          color: #E5C487;
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 8px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        ">${studio.name}</h3>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="color: #E5C487;">★</span>
          <span style="color: white; font-size: 12px;">${studio.rating || "New"}</span>
          ${studio.distance_km !== undefined ? `
            <span style="color: #6b7280;">•</span>
            <span style="color: #9ca3af; font-size: 12px;">${studio.distance_km < 1 ? `${Math.round(studio.distance_km * 1000)}m` : `${studio.distance_km}km`}</span>
          ` : ""}
        </div>
        <span style="
          font-size: 11px;
          color: ${studio.is_open ? "#4ade80" : "#9ca3af"};
        ">${studio.is_open ? "Open Now" : "Closed"}</span>
        <button 
          onclick="window.dispatchEvent(new CustomEvent('viewStudio', { detail: ${studio.id} }))"
          style="
            display: block;
            width: 100%;
            margin-top: 10px;
            padding: 8px;
            background: #E5C487;
            color: #1a1a1a;
            border: none;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          "
        >View Details</button>
      </div>
    `;
  }, []);

  // Listen for viewStudio events from popup
  useEffect(() => {
    const handleViewStudio = (e: CustomEvent<number>) => {
      if (onViewStudio) {
        onViewStudio(e.detail);
      }
    };

    window.addEventListener("viewStudio", handleViewStudio as EventListener);
    return () => {
      window.removeEventListener("viewStudio", handleViewStudio as EventListener);
    };
  }, [onViewStudio]);

  // Update studio markers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove old markers that are no longer in studios list
    markersRef.current.forEach((marker, id) => {
      if (!studios.find(s => s.id === id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    // Add/update markers
    studios.forEach((studio) => {
      if (!studio.lat || !studio.lng) return;

      const isActive = selectedStudio === studio.id || hoveredStudio === studio.id;
      const icon = createStudioIcon(studio.is_open, isActive);
      
      let marker = markersRef.current.get(studio.id);
      
      if (marker) {
        // Update existing marker
        marker.setIcon(icon);
        if (isActive) {
          marker.setZIndexOffset(500);
        } else {
          marker.setZIndexOffset(0);
        }
      } else {
        // Create new marker
        marker = L.marker([studio.lat, studio.lng], { icon })
          .addTo(map)
          .bindPopup(createPopupContent(studio), {
            className: "custom-popup",
            closeButton: false,
            offset: [0, -10],
          });

        marker.on("click", () => {
          onStudioSelect(studio.id);
        });

        marker.on("mouseover", () => {
          onStudioHover(studio.id);
        });

        marker.on("mouseout", () => {
          onStudioHover(null);
        });

        markersRef.current.set(studio.id, marker);
      }
    });
  }, [studios, selectedStudio, hoveredStudio, onStudioSelect, onStudioHover, createPopupContent]);

  // Open popup when studio is selected
  useEffect(() => {
    if (!mapRef.current || !selectedStudio) return;

    const marker = markersRef.current.get(selectedStudio);
    if (marker) {
      marker.openPopup();
      
      const studio = studios.find(s => s.id === selectedStudio);
      if (studio && studio.lat && studio.lng) {
        mapRef.current.setView([studio.lat, studio.lng], mapRef.current.getZoom(), {
          animate: true,
        });
      }
    }
  }, [selectedStudio, studios]);

  // Public methods via ref
  const handleCenterOnUser = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 14, {
        animate: true,
      });
    }
  }, [userLocation]);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Custom Map Controls */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-3 z-[1000]">
        <button
          onClick={handleCenterOnUser}
          className="w-12 h-12 bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#4D463A]/30 rounded-xl flex items-center justify-center hover:bg-[#E5C487] hover:text-[#402d00] transition-all text-white"
          title="Center on my location"
        >
          <span className={`material-symbols-outlined ${userLocation ? "icon-filled" : ""}`}>
            my_location
          </span>
        </button>
        <div className="flex flex-col bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#4D463A]/30 rounded-xl divide-y divide-[#4D463A]/20">
          <button 
            onClick={handleZoomIn}
            className="w-12 h-12 flex items-center justify-center hover:bg-[#E5C487]/20 transition-all text-white"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-12 h-12 flex items-center justify-center hover:bg-[#E5C487]/20 transition-all text-white"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
      </div>
      
      {/* Styles for popups */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: #1a1a1a;
        }
        .custom-studio-marker,
        .custom-user-marker {
          background: transparent;
          border: none;
        }
        .leaflet-container {
          background: #0a0a0a;
          font-family: inherit;
        }
        .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.5) !important;
          color: #666 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #888 !important;
        }
      `}</style>
    </div>
  );
}
