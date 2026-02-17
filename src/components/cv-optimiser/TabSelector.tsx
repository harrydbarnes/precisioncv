import { memo } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const TabSelector = memo(({
  options,
  value,
  onChange,
  disabled,
  layoutId,
}: {
  options: { id: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
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
          <div
            key={opt.id}
            className={cn(
              "relative z-10 flex items-center justify-center rounded-md text-xs font-medium transition-all sm:text-sm",
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
            <button
              type="button"
              onClick={() => onChange(opt.id)}
              disabled={disabled}
              className="relative z-10 flex flex-grow items-center justify-center rounded-md px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="text-center leading-tight">
                {opt.label}
              </span>
            </button>
            {opt.description && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Information about ${opt.label}`}
                    className="relative z-10 mr-1 flex items-center justify-center rounded-full p-0.5 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-3 w-3 opacity-70 sm:h-4 sm:w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-auto max-w-[90vw] bg-tooltip-blue p-2 text-xs text-white shadow-none border-tooltip-blue"
                >
                  <p>{opt.description}</p>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      })}
    </div>
  );
});
