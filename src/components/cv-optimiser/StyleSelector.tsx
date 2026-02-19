import { memo, useCallback } from "react";
import { Info } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TailorStyle } from "@/lib/gemini-api";
import { cn } from "@/lib/utils";

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

export const StyleSelector = memo(({
  selectedStyles,
  setSelectedStyles,
}: {
  selectedStyles: TailorStyle[];
  setSelectedStyles: (value: TailorStyle[]) => void;
}) => {
  const toggleStyle = useCallback((id: TailorStyle) => {
    setSelectedStyles(prevStyles =>
      prevStyles.includes(id)
        ? prevStyles.filter(s => s !== id)
        : [...prevStyles, id]
    );
  }, [setSelectedStyles]);

  return (
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
                : "hover:bg-background hover:text-foreground hover:border-input [@media(hover:hover)]:hover:bg-hero-100/50 [@media(hover:hover)]:hover:text-hero-800 [@media(hover:hover)]:hover:border-hero-500"
            )}
          >
            <button
              type="button"
              onClick={() => toggleStyle(s.id)}
              aria-pressed={isSelected}
              className={cn(
                "flex h-full items-center justify-center whitespace-nowrap px-3 py-1 text-xs font-medium focus:outline-none sm:px-4 sm:py-2 sm:text-sm",
                isSelected
                  ? "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                  : "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              )}
            >
              {s.label}
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "pl-1 pr-3 py-2 h-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    isSelected ? "[@media(hover:hover)]:hover:bg-hero-800/10" : "[@media(hover:hover)]:hover:bg-accent"
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
  );
});
