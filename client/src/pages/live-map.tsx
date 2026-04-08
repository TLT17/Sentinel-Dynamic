import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Navigation, Crosshair, Shield, Wifi, WifiOff, Hospital, Building2, ShieldCheck, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SentinelFooter from "@/components/sentinel-footer";
import type { SafeLocation } from "@shared/schema";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LiveMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const accuracyRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const safeLayersRef = useRef<L.LayerGroup | null>(null);
  const nearbyLayersRef = useRef<L.LayerGroup | null>(null);

  const LAST_POS_KEY = "sentinel_last_position";

  const getInitialView = (): [number, number] => {
    try {
      const saved = localStorage.getItem(LAST_POS_KEY);
      if (saved) {
        const { lat, lng } = JSON.parse(saved);
        return [lat, lng];
      }
    } catch {}
    return [-38.18, 175.36]; // Otorohanga, NZ — central fallback
  };

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [heading, setHeading] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  const { data: safeLocations = [] } = useQuery<SafeLocation[]>({
    queryKey: ["/api/safe-locations"],
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initialView = getInitialView();

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(initialView, 16);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      subdomains: "abcd",
    }).addTo(map);

    mapInstanceRef.current = map;

    // Auto-start tracking as soon as the map is ready
    setTimeout(() => {
      if (mapInstanceRef.current) startTracking();
    }, 400);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (safeLayersRef.current) {
      safeLayersRef.current.clearLayers();
    } else {
      safeLayersRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    safeLocations.forEach((loc) => {
      const safeIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background:#00d4aa;width:12px;height:12px;border:2px solid #0d0d0d;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      L.marker([loc.latitude, loc.longitude], { icon: safeIcon })
        .addTo(safeLayersRef.current!)
        .bindPopup(`<div style="color:#000;font-family:Cinzel,serif;font-size:12px;"><b>${loc.name}</b><br/>${loc.address || ""}<br/>Safe zone: ${loc.radiusMeters}m around this spot</div>`);

      L.circle([loc.latitude, loc.longitude], {
        radius: loc.radiusMeters,
        color: "#00d4aa",
        fillColor: "#00d4aa",
        fillOpacity: 0.08,
        weight: 1,
      }).addTo(safeLayersRef.current!);
    });
  }, [safeLocations]);

  const searchNearbyPlaces = async (lat: number, lng: number) => {
    setLoadingNearby(true);
    try {
      const query = `[out:json][timeout:10];(node["amenity"~"police|hospital|fire_station"](around:3000,${lat},${lng});node["amenity"="pharmacy"](around:2000,${lat},${lng});node["shop"~"convenience|supermarket"](around:1500,${lat},${lng}););out body 20;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();

      const places: NearbyPlace[] = data.elements
        .filter((el: any) => el.tags?.name)
        .map((el: any) => ({
          name: el.tags.name,
          type: el.tags.amenity || el.tags.shop || "place",
          lat: el.lat,
          lng: el.lon,
          distance: getDistance(lat, lng, el.lat, el.lon),
        }))
        .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
        .slice(0, 15);

      setNearbyPlaces(places);

      if (mapInstanceRef.current) {
        if (nearbyLayersRef.current) {
          nearbyLayersRef.current.clearLayers();
        } else {
          nearbyLayersRef.current = L.layerGroup().addTo(mapInstanceRef.current);
        }

        places.forEach((place) => {
          const color = getPlaceColor(place.type);
          const icon = L.divIcon({
            className: "custom-div-icon",
            html: `<div style="background:${color};width:10px;height:10px;border:2px solid #0d0d0d;"></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          });

          L.marker([place.lat, place.lng], { icon })
            .addTo(nearbyLayersRef.current!)
            .bindPopup(`<div style="color:#000;font-family:Cinzel,serif;font-size:11px;"><b>${place.name}</b><br/>${getPlaceLabel(place.type)}<br/>${formatDistance(place.distance)}</div>`);
        });
      }
    } catch {
      setNearbyPlaces([]);
    }
    setLoadingNearby(false);
  };

  const startTracking = () => {
    if (!navigator.geolocation) return;

    setIsTracking(true);

    const userIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background:#00d4aa;width:16px;height:16px;border:3px solid #fff;border-radius:0;box-shadow:0 0 20px rgba(0,212,170,0.6);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc, heading: h, speed: s } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setAccuracy(acc);
        localStorage.setItem(LAST_POS_KEY, JSON.stringify({ lat: latitude, lng: longitude }));
        if (h !== null) setHeading(h);
        if (s !== null) setSpeed(s);

        if (mapInstanceRef.current) {
          const isFirstFix = !markerRef.current;

          if (!markerRef.current) {
            markerRef.current = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapInstanceRef.current);
          } else {
            markerRef.current.setLatLng([latitude, longitude]);
          }

          if (!accuracyRef.current) {
            accuracyRef.current = L.circle([latitude, longitude], {
              radius: acc,
              color: "#00d4aa",
              fillColor: "#00d4aa",
              fillOpacity: 0.1,
              weight: 1,
              dashArray: "4",
            }).addTo(mapInstanceRef.current);
          } else {
            accuracyRef.current.setLatLng([latitude, longitude]);
            accuracyRef.current.setRadius(acc);
          }

          // On first fix zoom to street level, afterwards preserve user's zoom
          const zoom = isFirstFix ? 17 : mapInstanceRef.current.getZoom();
          mapInstanceRef.current.setView([latitude, longitude], zoom);
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  const centerOnUser = () => {
    if (position && mapInstanceRef.current) {
      mapInstanceRef.current.setView([position.lat, position.lng], 16);
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const nearestSafeLocation = position
    ? safeLocations.reduce<{ location: SafeLocation | null; distance: number }>(
        (nearest, loc) => {
          const d = getDistance(position.lat, position.lng, loc.latitude, loc.longitude);
          return d < nearest.distance ? { location: loc, distance: d } : nearest;
        },
        { location: null, distance: Infinity }
      )
    : null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-cinzel text-lg text-foreground tracking-[0.15em] flex items-center gap-2" data-testid="text-map-title">
              <MapPin className="w-5 h-5 text-primary" />
              LIVE MAP
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">See where you are and find safe places nearby</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              {isOffline ? (
                <Badge variant="outline" className="font-cinzel text-[10px] tracking-wider text-blue-500 border-blue-500/30">
                  <WifiOff className="w-3 h-3 mr-1" />OFFLINE
                </Badge>
              ) : (
                <Badge variant="outline" className="font-cinzel text-[10px] tracking-wider text-primary border-primary/30">
                  <Wifi className="w-3 h-3 mr-1" />ONLINE
                </Badge>
              )}
            </div>
            <Button
              onClick={() => setShowHelp(!showHelp)}
              size="sm"
              variant="ghost"
              className="font-cinzel text-xs tracking-wider rounded-none text-muted-foreground"
              data-testid="button-map-help"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            {!isTracking ? (
              <Button
                onClick={startTracking}
                size="sm"
                className="font-cinzel text-xs tracking-wider rounded-none"
                data-testid="button-start-tracking"
              >
                <Navigation className="w-3 h-3 mr-1.5" />
                FIND ME
              </Button>
            ) : (
              <>
                <Button
                  onClick={centerOnUser}
                  size="sm"
                  variant="outline"
                  className="font-cinzel text-xs tracking-wider rounded-none"
                  data-testid="button-center"
                >
                  <Crosshair className="w-3 h-3 mr-1.5" />
                  CENTER
                </Button>
                {position && !isOffline && (
                  <Button
                    onClick={() => searchNearbyPlaces(position.lat, position.lng)}
                    size="sm"
                    variant="outline"
                    className="font-cinzel text-xs tracking-wider rounded-none border-primary/50 text-primary"
                    disabled={loadingNearby}
                    data-testid="button-find-nearby"
                  >
                    <Building2 className="w-3 h-3 mr-1.5" />
                    {loadingNearby ? "SEARCHING..." : "FIND HELP NEARBY"}
                  </Button>
                )}
                <Button
                  onClick={stopTracking}
                  size="sm"
                  variant="outline"
                  className="font-cinzel text-xs tracking-wider rounded-none border-destructive text-destructive"
                  data-testid="button-stop-tracking"
                >
                  STOP
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {showHelp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-border bg-card p-4"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start gap-3 mb-3">
              <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <h3 className="font-cinzel text-sm text-foreground tracking-wider">HOW TO USE THIS MAP</h3>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground pl-8">
              <p><span className="text-primary font-cinzel">FIND ME</span> — Tap this to show your current location on the map. The app uses your phone's GPS.</p>
              <p><span className="text-primary font-cinzel">FIND HELP NEARBY</span> — Shows police stations, hospitals, and other public places near you. Helpful if you need to find somewhere safe quickly.</p>
              <p><span className="text-primary font-cinzel">GREEN SQUARES</span> — These are your saved safe locations (places you've added like Home or Work).</p>
              <p><span className="text-primary font-cinzel">CENTER</span> — Moves the map back to where you are if you've scrolled away.</p>
              <p className="text-muted-foreground/70 pt-1">Your location stays on your phone. It is only shared with your contacts when an alert is triggered.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" data-testid="map-container" />

        {nearbyPlaces.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-3 right-3 z-[1000] w-64 max-h-[50vh] overflow-y-auto bg-card/95 backdrop-blur border-2 border-border"
          >
            <div className="p-3 border-b border-border sticky top-0 bg-card/95 backdrop-blur">
              <h3 className="font-cinzel text-xs text-primary tracking-wider">PLACES NEAR YOU</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Tap any place to see it on the map</p>
            </div>
            <div className="p-2 space-y-1">
              {nearbyPlaces.map((place, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([place.lat, place.lng], 17);
                    }
                  }}
                  className="w-full text-left p-2 hover-elevate transition-all border border-border/50"
                  data-testid={`button-nearby-place-${i}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1.5 shrink-0" style={{ backgroundColor: getPlaceColor(place.type) }} />
                    <div className="min-w-0">
                      <p className="text-foreground text-xs font-cinzel tracking-wide truncate">{place.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{getPlaceLabel(place.type)}</span>
                        <span className="text-[10px] text-primary">{formatDistance(place.distance)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {position && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 z-[1000] bg-card/95 backdrop-blur border-2 border-border p-3"
            style={{ maxWidth: nearbyPlaces.length > 0 ? "calc(100% - 18rem)" : undefined }}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary animate-pulse" />
                  <span className="font-cinzel text-xs text-primary tracking-wider">YOU ARE HERE</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </p>
                {accuracy !== null && (
                  <p className="text-[10px] text-muted-foreground">
                    Accurate to {accuracy.toFixed(0)} metres
                    {speed !== null && speed > 0 && ` · Moving at ${(speed * 3.6).toFixed(1)} km/h`}
                    {heading !== null && ` · Heading ${getCompassDirection(heading)}`}
                  </p>
                )}
              </div>
              {nearestSafeLocation?.location && (
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-cinzel tracking-wider">NEAREST SAFE PLACE</p>
                  <p className="text-xs text-primary font-cinzel">{nearestSafeLocation.location.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatDistance(nearestSafeLocation.distance)}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!isTracking && !position && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
            <div className="bg-card/90 backdrop-blur border-2 border-border p-8 text-center pointer-events-auto max-w-sm mx-4">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-cinzel text-foreground tracking-wider mb-2">FIND YOUR LOCATION</h2>
              <p className="text-muted-foreground text-xs mb-2">
                Tap the button below to see where you are on the map.
              </p>
              <p className="text-muted-foreground/60 text-[10px] mb-6">
                Once your location shows, you can search for police stations, hospitals, and other safe places near you.
              </p>
              <Button
                onClick={startTracking}
                className="font-cinzel tracking-wider rounded-none"
                data-testid="button-enable-tracking"
              >
                <Navigation className="w-4 h-4 mr-2" />
                FIND ME
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface NearbyPlace {
  name: string;
  type: string;
  lat: number;
  lng: number;
  distance: number;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters.toFixed(0)}m away`;
  return `${(meters / 1000).toFixed(1)}km away`;
}

function getPlaceColor(type: string): string {
  switch (type) {
    case "police": return "#4488ff";
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
    case "convenience": return "Shop";
    case "supermarket": return "Supermarket";
    default: return "Public Place";
  }
}

function getCompassDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}
