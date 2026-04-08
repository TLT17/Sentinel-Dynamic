import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserPreference } from "@shared/schema";
import sigilPath from "@assets/image_1772723503197.png";

const languages = [
  { code: "en", native: "English", label: "English" },
  { code: "es", native: "Español", label: "Spanish" },
  { code: "fr", native: "Français", label: "French" },
  { code: "de", native: "Deutsch", label: "German" },
  { code: "it", native: "Italiano", label: "Italian" },
  { code: "pt", native: "Português", label: "Portuguese" },
  { code: "zh", native: "中文", label: "Chinese" },
  { code: "ja", native: "日本語", label: "Japanese" },
  { code: "ko", native: "한국어", label: "Korean" },
  { code: "ar", native: "العربية", label: "Arabic" },
  { code: "hi", native: "हिन्दी", label: "Hindi" },
  { code: "ms", native: "Bahasa Melayu", label: "Malay" },
];

export default function LanguageSelectPage() {
  const [, setLocation] = useLocation();

  const { data: preferences } = useQuery<UserPreference[]>({
    queryKey: ["/api/preferences"],
  });

  const selectMutation = useMutation({
    mutationFn: async (langCode: string) => {
      if (preferences?.[0]) {
        const res = await apiRequest("PATCH", `/api/preferences/${preferences[0].id}`, { language: langCode });
        return res.json();
      }
      const res = await apiRequest("POST", "/api/preferences", {
        language: langCode,
        systemArmed: false,
        voiceSensitivity: 0.7,
        decoyMode: true,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      setLocation("/welcome");
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-36 h-36 mx-auto mb-6" style={{ background: "#0d0d0d" }}>
          <img
            src={sigilPath}
            alt="Sentinel Dynamic Sigil"
            className="w-full h-full object-contain"
            style={{ filter: "invert(1) sepia(1) saturate(3) hue-rotate(140deg) brightness(0.9) contrast(1.4)", mixBlendMode: "screen" }}
            data-testid="img-sigil"
          />
        </div>
        <h1 className="font-cinzel text-3xl md:text-4xl text-foreground tracking-[0.2em] mb-3" data-testid="text-app-title">
          SENTINEL DYNAMIC
        </h1>
        <p className="font-cinzel text-primary tracking-[0.3em] text-sm" data-testid="text-select-language">
          SELECT YOUR LANGUAGE
        </p>
      </motion.div>

      <div className="w-full max-w-lg">
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => selectMutation.mutate(lang.code)}
              disabled={selectMutation.isPending}
              className="bg-card border-2 border-border p-4 text-left hover-elevate transition-all flex items-center gap-3"
              data-testid={`button-lang-${lang.code}`}
            >
              <Globe className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-cinzel text-foreground tracking-wide text-base leading-tight">
                  {lang.native}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {lang.label}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
