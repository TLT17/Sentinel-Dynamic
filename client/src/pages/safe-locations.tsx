import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Home, Briefcase, X, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import SentinelFooter from "@/components/sentinel-footer";
import type { SafeLocation, InsertSafeLocation } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SafeLocationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState<InsertSafeLocation>({
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    radiusMeters: 100,
    autoDisarm: true,
  });
  const { toast } = useToast();

  const { data: locations = [], isLoading } = useQuery<SafeLocation[]>({
    queryKey: ["/api/safe-locations"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSafeLocation) => {
      const res = await apiRequest("POST", "/api/safe-locations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safe-locations"] });
      resetForm();
      toast({ title: "Location added" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSafeLocation> }) => {
      const res = await apiRequest("PATCH", `/api/safe-locations/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safe-locations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/safe-locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safe-locations"] });
      toast({ title: "Location removed" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", address: "", latitude: 0, longitude: 0, radiusMeters: 100, autoDisarm: true });
    setShowForm(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData((p) => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const getLocationIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("home")) return Home;
    if (lower.includes("work") || lower.includes("office")) return Briefcase;
    return MapPin;
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em] flex items-center gap-3" data-testid="text-locations-title">
                  <MapPin className="w-6 h-6 text-primary" />
                  SAFE LOCATIONS
                </h1>
                <p className="text-muted-foreground text-sm mt-2">Auto-disarm when you arrive at trusted places</p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="font-cinzel tracking-wider rounded-none px-6"
                data-testid="button-add-location"
              >
                <Plus className="w-4 h-4 mr-2" />ADD
              </Button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 overflow-hidden"
                >
                  <form
                    onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}
                    className="bg-card border-2 border-border p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-cinzel text-lg text-foreground tracking-wider">ADD SAFE LOCATION</h2>
                      <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground" data-testid="button-close-location-form">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">NAME</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Home, Work, Gym"
                          className="rounded-none"
                          required
                          data-testid="input-location-name"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">ADDRESS (OPTIONAL)</label>
                        <Input
                          value={formData.address || ""}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="123 Main Street"
                          className="rounded-none"
                          data-testid="input-location-address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">LATITUDE</label>
                          <Input
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                            className="rounded-none"
                            required
                            data-testid="input-latitude"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">LONGITUDE</label>
                          <Input
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                            className="rounded-none"
                            required
                            data-testid="input-longitude"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (currentLocation) setFormData((p) => ({ ...p, latitude: currentLocation.lat, longitude: currentLocation.lng }));
                        }}
                        className="w-full rounded-none font-cinzel tracking-wider"
                        data-testid="button-use-current-location"
                      >
                        <Navigation className="w-4 h-4 mr-2" />USE CURRENT LOCATION
                      </Button>
                      <div>
                        <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">RADIUS (METERS)</label>
                        <Input
                          type="number"
                          value={formData.radiusMeters}
                          onChange={(e) => setFormData({ ...formData, radiusMeters: parseInt(e.target.value) || 100 })}
                          className="rounded-none"
                          data-testid="input-radius"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-background border border-border">
                        <span className="text-foreground font-cinzel text-sm">AUTO-DISARM AT THIS LOCATION</span>
                        <Switch
                          checked={formData.autoDisarm ?? true}
                          onCheckedChange={(v) => setFormData({ ...formData, autoDisarm: v })}
                          data-testid="switch-auto-disarm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <Button type="button" onClick={resetForm} variant="outline" className="rounded-none font-cinzel tracking-wider">CANCEL</Button>
                      <Button type="submit" className="font-cinzel tracking-wider rounded-none" disabled={createMutation.isPending} data-testid="button-submit-location">
                        ADD LOCATION
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
            ) : locations.length === 0 ? (
              <div className="border-2 border-dashed border-border p-8 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-cinzel">No safe locations added</p>
              </div>
            ) : (
              <div className="space-y-3">
                {locations.map((location) => {
                  const Icon = getLocationIcon(location.name);
                  return (
                    <div key={location.id} className="bg-card border-2 border-border p-4" data-testid={`card-location-${location.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 border-2 border-primary/30 bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground font-cinzel tracking-wide">{location.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                            </p>
                            <p className="text-muted-foreground/60 text-xs mt-1">Radius: {location.radiusMeters}m</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-cinzel">AUTO-DISARM</p>
                            <Switch
                              checked={location.autoDisarm}
                              onCheckedChange={() =>
                                updateMutation.mutate({ id: location.id, data: { autoDisarm: !location.autoDisarm } })
                              }
                              data-testid={`switch-auto-disarm-${location.id}`}
                            />
                          </div>
                          <Button
                            onClick={() => deleteMutation.mutate(location.id)}
                            variant="ghost"
                            className="text-muted-foreground rounded-none"
                            data-testid={`button-delete-location-${location.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <SentinelFooter />
      </div>
    </ScrollArea>
  );
}
