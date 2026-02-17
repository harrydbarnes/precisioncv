import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TailorStyle, CoverLetterStyle, ApiWorkload } from "@/lib/gemini-api";
import { StyleSelector } from "./StyleSelector";
import { TabSelector } from "./TabSelector";

interface TailorSectionProps {
  keywords: string;
  setKeywords: (value: string) => void;
  selectedStyles: TailorStyle[];
  setSelectedStyles: (value: TailorStyle[]) => void;
  coverLetterStyle: CoverLetterStyle;
  setCoverLetterStyle: (value: CoverLetterStyle) => void;
  apiWorkload: ApiWorkload;
  setApiWorkload: (value: ApiWorkload) => void;
}

const workloadOptions: { id: ApiWorkload; label: string; description: string }[] = [
  {
    id: "Normal",
    label: "Normal",
    description: "Generates everything: Match Analysis, CV, Cover Letter, Q&A, and Industry Insights. Highest token usage.",
  },
  {
    id: "Reduced",
    label: "Reduced",
    description: "Generates Match Analysis, Tailored CV, and Cover Letter. Skips Q&A and Industry Insights to save tokens.",
  },
  {
    id: "Minimal",
    label: "Minimal",
    description: "Generates only Match Analysis and Tailored CV. Fastest and lowest token usage.",
  },
];

const coverLetterOptions: { id: CoverLetterStyle; label: string }[] = [
  { id: "Short", label: "Quick (Short)" },
  { id: "Middle", label: "Formal (Medium)" },
  { id: "Long", label: "Detailed (Long)" },
];

const TailorSection = ({
  keywords,
  setKeywords,
  selectedStyles,
  setSelectedStyles,
  coverLetterStyle,
  setCoverLetterStyle,
  apiWorkload,
  setApiWorkload
}: TailorSectionProps) => {
  const handleCoverLetterStyleChange = useCallback((v: string) => {
    setCoverLetterStyle(v as CoverLetterStyle);
  }, [setCoverLetterStyle]);

  const handleApiWorkloadChange = useCallback((v: string) => {
    setApiWorkload(v as ApiWorkload);
  }, [setApiWorkload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Keywords To Add</Label>
        <Textarea
          placeholder="Enter keywords to include in your CV..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="min-h-[100px] transition-all duration-200 focus:border-hero-500 focus:ring-hero-500"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Update Style</Label>
        {/* Mobile-friendly: smaller buttons on mobile to fit one row */}
        <StyleSelector
          selectedStyles={selectedStyles}
          setSelectedStyles={setSelectedStyles}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Cover Letter Style</Label>
          <TabSelector
            options={coverLetterOptions}
            value={coverLetterStyle}
            onChange={handleCoverLetterStyleChange}
            disabled={apiWorkload === "Minimal"}
            layoutId="cover-letter-style"
          />
          {apiWorkload === "Minimal" && (
            <p className="text-xs text-muted-foreground">
              Disabled in Minimal mode.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold">API Workload</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="API Workload Settings"
                >
                  <Info className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3 text-xs">
                <div className="space-y-2">
                  <h4 className="font-semibold">Workload Levels</h4>
                  {workloadOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="grid grid-cols-[60px_1fr] gap-2"
                    >
                      <span className="font-bold">{opt.label}:</span>
                      <span>{opt.description}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <TabSelector
            options={workloadOptions}
            value={apiWorkload}
            onChange={handleApiWorkloadChange}
            layoutId="api-workload"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TailorSection);
