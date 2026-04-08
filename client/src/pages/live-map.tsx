import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, Crosshair, Building2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SafeLocation } from "@shared/schema";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LAST_POS_KEY = "sentinel_last_position";

function getInitialView(): [number, number] {
  try {
    const saved = localStorage.getItem(LAST_POS_KEY);
    if (saved) {
      const { lat, lng } = JSON.parse(saved);
      return [lat, lng];
    }
  } catch {}
  return [-38.18, 175.36];
}

export default function LiveMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const accuracyRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const safeLayersRef = useRef<L.LayerGroup | null>(null);
  const nearbyLayersRef = useRef<L.LayerGroup | null>(null);
  const firstFixRef = useRef(true);

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"searching" | "found" | "error">("searching");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [showNearby, setShowNearby] = useState(false);

  const { data: safeLocations = [] } = useQuery<SafeLocation[]>({
    queryKey: ["/api/safe-locations"],
  });

  useEffect(() => {
    const up = () => setIsOffline(false);
    const down = () => setIsOffline(true);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView(getInitialView(), 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Draw safe zones
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (safeLayersRef.current) {
      safeLayersRef.current.clearLayers();
    } else {
      safeLayersRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }
    safeLocations.forEach((loc) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#00d4aa;width:12px;height:12px;border:2px solid #000;"></div>`,
        iconSize: [12, 12], iconAnchor: [6, 6],
      });
      L.marker([loc.latitude, loc.longitude], { icon })
        .addTo(safeLayersRef.current!)
        .bindPopup(`<b>${loc.name}</b><br/>${loc.address || ""}`);
      L.circle([loc.latitude, loc.longitude], {
        radius: loc.radiusMeters, color: "#00d4aa",
        fillColor: "#00d4aa", fillOpacity: 0.08, weight: 1,
      }).addTo(safeLayersRef.current!);
    });
  }, [safeLocations]);

  const userIcon = L.divIcon({
    className: "",
    html: `<div style="background:#00d4aa;width:18px;height:18px;border:3px solid #fff;box-shadow:0 0 20px rgba(0,212,170,0.8);"></div>`,
    iconSize: [18, 18], iconAnchor: [9, 9],
  });

  const startTracking = useCallback(() => {
    if (!navigator.geolocation || watchIdRef.current !== null) return;
    firstFixRef.current = true;
    setGpsStatus("searching");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        setPosition({ lat, lng });
        setAccuracy(acc);
        setGpsStatus("found");
        localStorage.setItem(LAST_POS_KEY, JSON.stringify({ lat, lng }));

        if (!mapInstanceRef.current) return;

        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstanceRef.current);
        } else {
          markerRef.current.setLatLng([lat, lng]);
        }

        if (!accuracyRef.current) {
          accuracyRef.current = L.circle([lat, lng], {
            radius: acc, color: "#00d4aa", fillColor: "#00d4aa",
            fillOpacity: 0.1, weight: 1, dashArray: "4",
          }).addTo(mapInstanceRef.current);
        } else {
          accuracyRef.current.setLatLng([lat, lng]);
          accuracyRef.current.setRadius(acc);
        }

        // First fix: snap to street level; after that preserve user zoom
        if (firstFixRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17);
          firstFixRef.current = false;
        } else {
          mapInstanceRef.current.panTo([lat, lng]);
        }
      },
      () => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        setGpsStatus("error");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
    );
  }, []);

  // Auto-start tracking once map is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) startTracking();
    }, 300);
    return () => clearTimeout(timer);
  }, [startTracking]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const centerOnMe = () => {
    if (position && mapInstanceRef.current) {
      mapInstanceRef.current.setView([position.lat, position.lng], 17);
    }
  };

  const findNearby = async () => {
    if (!position) return;
    setLoadingNearby(true);
    setShowNearby(true);
    try {
      const { lat, lng } = position;
      const query = `[out:json][timeout:10];(node["amenity"~"police|hospital|fire_station"](around:3000,${lat},${lng});node["amenity"="pharmacy"](around:2000,${lat},${lng}););out body 15;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      const places: NearbyPlace[] = data.elements
        .filter((el: any) => el.tags?.name)
        .map((el: any) => ({
          name: el.tags.name,
          type: el.tags.amenity || "place",
          lat: el.lat, lng: el.lon,
          distance: getDistance(lat, lng, el.lat, el.lon),
        }))
        .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
        .slice(0, 10);
      setNearbyPlaces(places);

      if (mapInstanceRef.current) {
        if (nearbyLayersRef.current) nearbyLayersRef.current.clearLayers();
        else nearbyLayersRef.current = L.layerGroup().addTo(mapInstanceRef.current);
        places.forEach((p) => {
          const color = getPlaceColor(p.type);
          const icon = L.divIcon({
            className: "",
            html: `<div style="background:${color};width:12px;height:12px;border:2px solid #000;"></div>`,
            iconSize: [12, 12], iconAnchor: [6, 6],
          });
          L.marker([p.lat, p.lng], { icon })
            .addTo(nearbyLayersRef.current!)
            .bindPopup(`<b>${p.name}</b><br/>${getPlaceLabel(p.type)}<br/>${formatDistance(p.distance)}`);
        });
      }
    } catch {
      setNearbyPlaces([]);
    }
    setLoadingNearby(false);
  };

  return (
    <div className="h-full flex flex-col relative">

      {/* Minimal top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1001] flex items-center justify-between px-3 py-2 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-cinzel text-sm text-foreground tracking-wider">LIVE MAP</span>
          {isOffline && <WifiOff className="w-3.5 h-3.5 text-blue-500 ml-1" />}
        </div>
        <div className="flex items-center gap-2">
          {gpsStatus === "searching" && (
            <span className="font-cinzel text-xs text-primary animate-pulse tracking-wider">FINDING YOU...</span>
          )}
          {gpsStatus === "found" && (
            <>
              <button
                onClick={centerOnMe}
                className="flex items-center gap-1.5 px-2 py-1 border border-border font-cinzel text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                data-testid="button-center"
              >
                <Crosshair className="w-3 h-3" /> CENTRE
              </button>
              {!isOffline && (
                <button
                  onClick={findNearby}
                  disabled={loadingNearby}
                  className="flex items-center gap-1.5 px-2 py-1 border border-primary font-cinzel text-xs text-primary hover:bg-primary/10 transition-colors"
                  data-testid="button-find-nearby"
                >
                  <Building2 className="w-3 h-3" />
                  {loadingNearby ? "SEARCHING..." : "FIND HELP NEARBY"}
                </button>
              )}
            </>
          )}
          {gpsStatus === "error" && (
            <button
              onClick={startTracking}
              className="flex items-center gap-1.5 px-2 py-1 border border-primary font-cinzel text-xs text-primary"
              data-testid="button-retry-gps"
            >
              <Navigation className="w-3 h-3" /> RETRY
            </button>
          )}
        </div>
      </div>

      {/* Full-screen map */}
      <div ref={mapRef} className="absolute inset-0" data-testid="map-container" />

      {/* GPS searching overlay */}
      {gpsStatus === "searching" && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
          <div className="bg-background/95 border-2 border-primary/40 px-6 py-4 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-cinzel text-primary text-sm tracking-wider">FINDING YOUR LOCATION</p>
            <p className="text-muted-foreground text-xs mt-1">This takes just a few seconds...</p>
          </div>
        </div>
      )}

      {/* GPS error overlay */}
      {gpsStatus === "error" && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
          <div className="bg-background/95 border-2 border-destructive/50 px-6 py-5 text-center max-w-xs pointer-events-auto">
            <p className="font-cinzel text-foreground text-sm tracking-wider mb-2">LOCATION NOT FOUND</p>
            <p className="text-muted-foreground text-xs mb-4">Please allow location access in your browser settings, then try again.</p>
            <Button onClick={startTracking} className="font-cinzel tracking-wider rounded-none text-xs">
              <Navigation className="w-3 h-3 mr-2" /> TRY AGAIN
            </Button>
          </div>
        </div>
      )}

      {/* You are here info bar */}
      {gpsStatus === "found" && position && (
        <div className="absolute bottom-0 left-0 right-0 z-[1001] bg-background/90 backdrop-blur border-t border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-primary animate-pulse" />
            <span className="font-cinzel text-xs text-primary tracking-wider">YOU ARE HERE</span>
            {accuracy !== null && (
              <span className="text-muted-foreground text-xs">· ±{accuracy.toFixed(0)}m accuracy</span>
            )}
          </div>
          <span className="text-muted-foreground text-[10px] font-mono">{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</span>
        </div>
      )}

      {/* Nearby places panel */}
      {showNearby && nearbyPlaces.length > 0 && (
        <div className="absolute top-12 right-0 z-[1001] w-60 max-h-[60vh] overflow-y-auto bg-background/95 backdrop-blur border-l border-b border-border">
          <div className="sticky top-0 bg-background/95 px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="font-cinzel text-xs text-primary tracking-wider">HELP NEARBY</span>
            <button onClick={() => setShowNearby(false)} className="text-muted-foreground text-xs hover:text-foreground">✕</button>
          </div>
          <div className="p-2 space-y-1">
            {nearbyPlaces.map((p, i) => (
              <button
                key={i}
                onClick={() => mapInstanceRef.current?.setView([p.lat, p.lng], 17)}
                className="w-full text-left p-2 border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                data-testid={`button-nearby-${i}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 shrink-0" style={{ backgroundColor: getPlaceColor(p.type) }} />
                  <div className="min-w-0">
                    <p className="text-xs font-cinzel text-foreground tracking-wide truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{getPlaceLabel(p.type)} · {formatDistance(p.distance)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface NearbyPlace { name: string; type: string; lat: number; lng: number; distance: number; }

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180, p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180, dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(m: number): string {
  return m < 1000 ? `${m.toFixed(0)}m away` : `${(m / 1000).toFixed(1)}km away`;
}

function getPlaceColor(type: string): string {
  switch (type) {
    case "police": return "#4f7ef8";
    case "hospital": return "#ff4444";
    case "fire_station": return "#ff8800";
    case "pharmacy": return "#44cc44";
    default: return "#cccc44";
  }
}

function getPlaceLabel(type: string): string {
  switch (type) {
    case "police": return "Police Station";
    case "hospital": return "Hospital";
    case "fire_station": return "Fire Station";
    case "pharmacy": return "Pharmacy";
    default: return "Public Place";
  }
}
