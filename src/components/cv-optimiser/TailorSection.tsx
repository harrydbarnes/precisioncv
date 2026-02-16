import { memo } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
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
  { id: "Short", label: "Quick (Short)" },
  { id: "Middle", label: "Formal (Medium)" },
  { id: "Long", label: "Detailed (Long)" },
];

const TabSelector = ({
  options,
  value,
  onChange,
  disabled,
  layoutId,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: any) => void;
  disabled?: boolean;
  layoutId: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-3 gap-1 rounded-lg bg-muted p-1 text-muted-foreground",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative z-10 flex flex-col items-center justify-center rounded-md px-2 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:text-sm",
              isSelected
                ? "text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 z-0 rounded-md bg-background shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 text-center leading-tight">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

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
        {/* Mobile-friendly: smaller buttons on mobile to fit one row */}
        <div className="flex flex-wrap gap-2">
          {styles.map((s) => {
            const isSelected = selectedStyles.includes(s.id);
            return (
              <div
                key={s.id}
                data-testid={`style-option-${s.id}`}
                className={cn(
                  buttonVariants({ variant: isSelected ? "default" : "outline" }),
                  "gap-0 p-0 overflow-hidden transition-all duration-200",
                  isSelected
                    ? "bg-hero-500 text-hero-800 hover:bg-hero-600 border-hero-500 ring-2 ring-hero-500 ring-offset-2"
                    : "hover:bg-hero-100/50 hover:text-hero-800 hover:border-hero-500"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleStyle(s.id)}
                  className="flex h-full items-center justify-center whitespace-nowrap px-3 py-1 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring sm:px-4 sm:py-2 sm:text-sm"
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
          <TabSelector
            options={coverLetterOptions}
            value={coverLetterStyle}
            onChange={(v) => setCoverLetterStyle(v as CoverLetterStyle)}
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
            onChange={(v) => setApiWorkload(v as ApiWorkload)}
            layoutId="api-workload"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TailorSection);
