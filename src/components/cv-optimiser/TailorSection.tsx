import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  { id: "Short", label: "Quick" },
  { id: "Middle", label: "Formal" },
  { id: "Long", label: "Detailed" },
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
          <Label className="text-sm font-semibold">API Workload</Label>
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
