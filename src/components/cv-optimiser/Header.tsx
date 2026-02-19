import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, BrainCircuit } from "lucide-react";
import { ModelType } from "@/lib/types";

interface HeaderProps {
  selectedModel?: ModelType;
}

const modelInfo = {
  gemini: { label: "Powered by Gemini 2.5 Flash", icon: Sparkles },
  claude: { label: "Powered by Claude 3.5 Sonnet", icon: BrainCircuit },
  openai: { label: "Powered by GPT-4o", icon: Bot },
};

/** Hero header with app title and description */
const Header = ({ selectedModel = "gemini" }: HeaderProps) => {
  const info = modelInfo[selectedModel];
  const Icon = info.icon;

  return (
    <header className="relative overflow-hidden py-12 md:py-20">
      {/* Background glow effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          key={selectedModel} // Animate on change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon className="h-4 w-4" />
            {info.label}
          </div>
        </motion.div>

        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-hero-900">CV Spruce</span>
        </motion.h1>

        <motion.div
          className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>Meet Bruce, the CV Spruce agent.</p>
          <p className="mt-4 text-base md:text-lg">
            Choose <strong>Gemini</strong>, <strong>Claude</strong>, or <strong>ChatGPT</strong> to receive a tailored CV, cover letter,
            interview preparation, and industry insights, all generated in seconds.
          </p>
        </motion.div>
      </div>
    </header>
  );
};

export default memo(Header);
