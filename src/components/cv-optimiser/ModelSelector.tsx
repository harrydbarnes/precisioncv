import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelType } from "@/lib/types";
import { MODEL_LABELS } from "@/lib/constants";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const models: { id: ModelType; label: string; icon: React.ReactNode }[] = [
  { id: "gemini", label: MODEL_LABELS.gemini, icon: <Sparkles className="h-4 w-4" /> },
  { id: "claude", label: MODEL_LABELS.claude, icon: <BrainCircuit className="h-4 w-4" /> },
  { id: "openai", label: MODEL_LABELS.openai, icon: <Bot className="h-4 w-4" /> },
];

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex items-center rounded-full border border-border bg-muted/30 p-1 shadow-sm">
        {models.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              aria-label={`Select ${model.label} model`}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeModel"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {model.icon}
                {model.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ModelSelector);
