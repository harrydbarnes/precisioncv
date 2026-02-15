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
import { TailorStyle } from "@/lib/gemini-api";
import { cn } from "@/lib/utils";

interface TailorSectionProps {
  keywords: string;
  setKeywords: (value: string) => void;
  selectedStyles: TailorStyle[];
  setSelectedStyles: (value: TailorStyle[]) => void;
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

const TailorSection = ({ keywords, setKeywords, selectedStyles, setSelectedStyles }: TailorSectionProps) => {
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
        <div className="flex flex-wrap gap-3">
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
                  className="pl-4 pr-1 py-2 h-full flex items-center justify-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
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
    </motion.div>
  );
};

// Memoized to prevent re-renders when parent state changes (e.g. typing in job spec)
export default memo(TailorSection);
