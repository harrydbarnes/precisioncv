import { memo } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TailorStyle, CoverLetterStyle, ApiWorkload } from "@/lib/gemini-api";
import { cn } from "@/lib/utils";

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

const styles: { id: TailorStyle; label: string; description: string }[] = [
  {
    id: "Precision",
    label: "Precision",
    description: "Updates precisely to match what is on job spec key words and required experience",
  },
  {
    id: "Ruthless",
    label: "Ruthless",
    description: "Helps cut down on crap",
  },
  {
    id: "Ambitious",
    label: "Ambitious",
    description: "Helps push the boundaries of your CV",
  },
];

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
  { id: "Short", label: "Quick Email (Short)" },
  { id: "Middle", label: "Formal Letter (Medium)" },
  { id: "Long", label: "Detailed Letter (Long)" },
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
  const toggleStyle = (id: TailorStyle) => {
    if (selectedStyles.includes(id)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== id));
    } else {
      setSelectedStyles([...selectedStyles, id]);
    }
  };

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
        {/* Mobile-friendly: horizontal scroll on small screens, flex-wrap on larger */}
        <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0 scrollbar-hide">
          {styles.map((s) => {
            const isSelected = selectedStyles.includes(s.id);
            return (
              <div
                key={s.id}
                data-testid={`style-option-${s.id}`}
                className={cn(
                  buttonVariants({ variant: isSelected ? "default" : "outline" }),
                  "gap-0 p-0 overflow-hidden transition-all duration-200 shrink-0",
                  isSelected
                    ? "bg-hero-500 text-hero-800 hover:bg-hero-600 border-hero-500 ring-2 ring-hero-500 ring-offset-2"
                    : "hover:bg-hero-100/50 hover:text-hero-800 hover:border-hero-500"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleStyle(s.id)}
                  className="pl-4 pr-1 py-2 h-full flex items-center justify-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring whitespace-nowrap"
                >
                  {s.label}
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "pl-1 pr-3 py-2 h-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
                        isSelected ? "hover:bg-hero-800/10" : "hover:bg-accent"
                      )}
                      aria-label={`${s.label} description`}
                    >
                      <Info className="h-4 w-4 opacity-70" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    className="w-auto max-w-[90vw] p-2 text-xs bg-tooltip-blue border-tooltip-blue text-white shadow-none"
                  >
                    <p>{s.description}</p>
                  </PopoverContent>
                </Popover>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Cover Letter Style</Label>
          <Select
            value={coverLetterStyle}
            onValueChange={(v) => setCoverLetterStyle(v as CoverLetterStyle)}
            disabled={apiWorkload === "Minimal"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {coverLetterOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {apiWorkload === "Minimal" && (
            <p className="text-xs text-muted-foreground">Disabled in Minimal mode.</p>
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
                    <div key={opt.id} className="grid grid-cols-[60px_1fr] gap-2">
                      <span className="font-bold">{opt.label}:</span>
                      <span>{opt.description}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Select value={apiWorkload} onValueChange={(v) => setApiWorkload(v as ApiWorkload)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select workload" />
            </SelectTrigger>
            <SelectContent>
              {workloadOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TailorSection);
