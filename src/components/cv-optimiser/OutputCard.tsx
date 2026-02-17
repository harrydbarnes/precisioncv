import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Diff from "diff";

interface OutputCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  copyText: string;
  index: number;
  originalText?: string;
}

/** Expressive Material card for displaying a section of the output */
const OutputCard = ({ title, icon, content, copyText, index, originalText }: OutputCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = copyText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderDiff = () => {
    if (!originalText) return content;

    // Use word diff for natural text comparison
    const diff = Diff.diffWords(originalText, copyText);

    return (
      <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed">
        {diff.map((part, i) => {
          const color = part.added
            ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
            : part.removed
              ? "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 line-through decoration-red-500"
              : "text-muted-foreground opacity-70";
          return (
            <span key={i} className={color}>
              {part.added && <span className="sr-only">Added: </span>}
              {part.removed && <span className="sr-only">Removed: </span>}
              {part.value}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:neon-glow hover:-translate-y-1">
        {/* Top accent border */}
        <div className="absolute left-0 right-0 top-0 h-1 gradient-neon" />

        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {originalText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDiff(!showDiff)}
                className="gap-2 text-xs transition-all duration-200"
              >
                {showDiff ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Hide Changes
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Show Changes
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-2 text-xs transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-secondary" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="text-sm leading-relaxed text-card-foreground/90 whitespace-pre-wrap">
          {showDiff ? renderDiff() : content}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutputCard;
