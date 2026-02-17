import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TabSelector = memo(({
  options,
  value,
  onChange,
  disabled,
  layoutId,
}: {
  options: { id: string; label: string }[];
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
});
