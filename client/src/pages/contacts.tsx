import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Trash2, Phone, User, X, AlertTriangle, ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SentinelFooter from "@/components/sentinel-footer";
import type { EmergencyContact, InsertEmergencyContact } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const levelConfig: Record<number, { label: string; color: string }> = {
  1: { label: "Level 1 - Emergency Services", color: "#ff4444" },
  2: { label: "Level 2 - Trusted", color: "#3b82f6" },
  3: { label: "Level 3 - General", color: "#00d4aa" },
};

const EMERGENCY_NUMBERS: Record<string, { number: string; label: string }> = {
  NZ: { number: "111", label: "NZ Police / Fire / Ambulance" },
  AU: { number: "000", label: "Australia Emergency Services" },
  US: { number: "911", label: "US Emergency Services" },
  CA: { number: "911", label: "Canada Emergency Services" },
  GB: { number: "999", label: "UK Emergency Services" },
  IE: { number: "999", label: "Ireland Emergency Services" },
  IN: { number: "112", label: "India National Emergency" },
  ZA: { number: "10111", label: "South Africa Police / 10177 Ambulance" },
  JP: { number: "110", label: "Japan Police / 119 Fire & Ambulance" },
  CN: { number: "110", label: "China Police / 120 Ambulance" },
  BR: { number: "190", label: "Brazil Police / 192 Ambulance" },
  MX: { number: "911", label: "Mexico Emergency Services" },
  PH: { number: "911", label: "Philippines Emergency Services" },
  SG: { number: "999", label: "Singapore Emergency Services" },
  MY: { number: "999", label: "Malaysia Emergency Services" },
  DEFAULT: { number: "112", label: "International Emergency Number" },
};

function useLocalEmergencyNumber() {
  const [emergencyInfo, setEmergencyInfo] = useState<{ number: string; label: string; country: string } | null>(null);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    async function detect() {
      // Method 1: IP-based country detection (fastest, no GPS needed)
      try {
        const res = await fetch("https://api.country.is/", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const countryCode: string = (data.country ?? "").toUpperCase();
          if (countryCode && EMERGENCY_NUMBERS[countryCode]) {
            setEmergencyInfo({ ...EMERGENCY_NUMBERS[countryCode], country: countryCode });
            setDetecting(false);
            return;
          }
        }
      } catch { /* fall through */ }

      // Method 2: GPS + Nominatim reverse geocode
      try {
        let lat: number, lon: number;
        const saved = localStorage.getItem("sentinel_last_position");
        if (saved) {
          const pos = JSON.parse(saved);
          lat = pos[0]; lon = pos[1];
        } else {
          const geoPos = await new Promise<GeolocationPosition>((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 6000 })
          );
          lat = geoPos.coords.latitude;
          lon = geoPos.coords.longitude;
        }
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          { headers: { "User-Agent": "SentinelDynamic/1.0", "Accept-Language": "en" } }
        );
        const data = await res.json();
        const countryCode: string = (data.address?.country_code ?? "").toUpperCase();
        const info = EMERGENCY_NUMBERS[countryCode] ?? EMERGENCY_NUMBERS.DEFAULT;
        setEmergencyInfo({ ...info, country: data.address?.country ?? countryCode });
      } catch {
        setEmergencyInfo({ ...EMERGENCY_NUMBERS.DEFAULT, country: "" });
      } finally {
        setDetecting(false);
      }
    }
    detect();
  }, []);

  return { emergencyInfo, detecting };
}

export default function ContactsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", level: 3, relationship: "" });
  const { emergencyInfo, detecting } = useLocalEmergencyNumber();
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/contacts"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertEmergencyContact) => {
      const res = await apiRequest("POST", "/api/contacts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      resetForm();
      toast({ title: "Contact added" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertEmergencyContact> }) => {
      const res = await apiRequest("PATCH", `/api/contacts/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      resetForm();
      toast({ title: "Contact updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Contact removed" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", phone: "", level: 3, relationship: "" });
    setEditingContact(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      level: contact.level,
      relationship: contact.relationship || "",
    });
    setEditingContact(contact);
    setShowForm(true);
  };

  const grouped: Record<number, EmergencyContact[]> = {
    1: contacts.filter((c) => c.level === 1),
    2: contacts.filter((c) => c.level === 2),
    3: contacts.filter((c) => c.level === 3),
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em] flex items-center gap-3" data-testid="text-contacts-title">
                <Users className="w-6 h-6 text-primary" />
                EMERGENCY CONTACTS
              </h1>
              <Button
                onClick={() => setShowForm(true)}
                className="font-cinzel tracking-wider rounded-none px-6"
                data-testid="button-add-contact"
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD CONTACT
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
                  <form onSubmit={handleSubmit} className="bg-card border-2 border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-cinzel text-lg text-foreground tracking-wider">
                        {editingContact ? "EDIT CONTACT" : "NEW CONTACT"}
                      </h2>
                      <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground" data-testid="button-close-form">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">NAME</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Contact name"
                          className="rounded-none"
                          required
                          data-testid="input-contact-name"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">PHONE NUMBER</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="rounded-none"
                          required
                          data-testid="input-contact-phone"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">ALERT LEVEL</label>
                        <Select value={String(formData.level)} onValueChange={(v) => setFormData({ ...formData, level: Number(v) })}>
                          <SelectTrigger className="rounded-none" data-testid="select-contact-level">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(levelConfig).map(([l, c]) => (
                              <SelectItem key={l} value={l}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">RELATIONSHIP</label>
                        <Input
                          value={formData.relationship}
                          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                          placeholder="e.g., Sister, Friend"
                          className="rounded-none"
                          data-testid="input-contact-relationship"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="button" onClick={resetForm} variant="outline" className="rounded-none font-cinzel tracking-wider">
                        CANCEL
                      </Button>
                      <Button
                        type="submit"
                        className="font-cinzel tracking-wider rounded-none"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-submit-contact"
                      >
                        {editingContact ? "UPDATE" : "ADD"} CONTACT
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              [1, 2, 3].map((level) => {
                const isEmergencyLevel = level === 1;
                const userContacts = isEmergencyLevel
                  ? grouped[level].filter((c) => c.relationship?.toLowerCase() !== "emergency")
                  : grouped[level];

                return (
                  <div key={level} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3" style={{ backgroundColor: levelConfig[level].color }} />
                      <h2
                        className="font-cinzel text-lg tracking-wider"
                        style={{ color: levelConfig[level].color }}
                      >
                        {levelConfig[level].label.toUpperCase()}
                      </h2>
                      <span className="text-muted-foreground text-sm">
                        ({isEmergencyLevel ? userContacts.length + 1 : grouped[level].length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {isEmergencyLevel && (
                        <div
                          className="bg-destructive/10 border-2 border-destructive/50 p-4 flex items-center justify-between"
                          data-testid="card-emergency-services"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 border-2 border-destructive/50 flex items-center justify-center">
                              <ShieldAlert className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                              {detecting ? (
                                <Skeleton className="h-4 w-40 mb-1" />
                              ) : (
                                <p className="text-foreground font-cinzel tracking-wide">
                                  {emergencyInfo?.label ?? "Emergency Services"}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {detecting ? "Detecting..." : emergencyInfo?.number ?? "112"}
                                </span>
                                {emergencyInfo?.country && (
                                  <span className="text-xs">{emergencyInfo.country}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground/50">
                            <Lock className="w-4 h-4" />
                            <span className="font-cinzel text-[10px] tracking-wider">AUTO</span>
                          </div>
                        </div>
                      )}

                      {userContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="bg-card border-2 border-border p-4 flex items-center justify-between hover-elevate transition-all"
                          data-testid={`card-contact-${contact.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 border-2 border-border flex items-center justify-center">
                              <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-foreground font-cinzel tracking-wide">{contact.name}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {contact.phone}
                                </span>
                                {contact.relationship && <span>{contact.relationship}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleEdit(contact)}
                              variant="ghost"
                              className="text-muted-foreground rounded-none"
                              data-testid={`button-edit-contact-${contact.id}`}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => deleteMutation.mutate(contact.id)}
                              variant="ghost"
                              className="text-muted-foreground rounded-none"
                              data-testid={`button-delete-contact-${contact.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {!isEmergencyLevel && userContacts.length === 0 && (
                        <div className="border-2 border-dashed border-border p-6 text-center">
                          <p className="text-muted-foreground font-cinzel text-sm">No contacts at this level</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {!isLoading && grouped[1].length === 0 && (
              <div className="mt-6 p-4 border-2 border-destructive/50 bg-destructive/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="text-destructive font-cinzel text-sm tracking-wide">NO LEVEL 1 CONTACTS</p>
                    <p className="text-muted-foreground text-xs mt-1">Add at least one Level 1 contact for emergency situations</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <SentinelFooter />
      </div>
    </ScrollArea>
  );
}
