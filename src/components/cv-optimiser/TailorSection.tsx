import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TailorStyle = "Precision" | "Ruthless" | "Ambitious";

interface TailorSectionProps {
  keywords: string;
  setKeywords: (value: string) => void;
  style: TailorStyle;
  setStyle: (value: TailorStyle) => void;
}

const styles: { id: TailorStyle; label: string; description: string }[] = [
  {
    id: "Precision",
    label: "Precision",
    description: "Updates precisely to match what is on job spec key words and required experience.",
  },
  {
    id: "Ruthless",
    label: "Ruthless",
    description: "Helps cut down on crap.",
  },
  {
    id: "Ambitious",
    label: "Ambitious",
    description: "Helps push the boundaries of your CV.",
  },
];

const TailorSection = ({ keywords, setKeywords, style, setStyle }: TailorSectionProps) => {
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
          <TooltipProvider>
            {styles.map((s) => (
              <Tooltip key={s.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={style === s.id ? "default" : "outline"}
                    onClick={() => setStyle(s.id)}
                    className={`gap-2 transition-all duration-200 ${
                      style === s.id
                        ? "bg-hero-500 text-hero-800 hover:bg-hero-600 border-hero-500"
                        : "hover:bg-hero-100/50 hover:text-hero-800 hover:border-hero-500"
                    }`}
                  >
                    {s.label}
                    <Info className="h-4 w-4 opacity-50" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{s.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
};

export default TailorSection;
