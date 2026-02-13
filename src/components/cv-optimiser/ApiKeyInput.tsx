import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

/** Password-masked input for the Gemini API key */
const ApiKeyInput = ({ value, onChange }: ApiKeyInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Label htmlFor="api-key" className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Key className="h-4 w-4 text-primary" />
        Gemini API Key
      </Label>
      <p className="mb-2 text-xs text-muted-foreground">
        Your key is stored only in this browser session and never sent to any server other than
        the Gemini API.
      </p>
      <div className="relative">
        <Input
          id="api-key"
          type={visible ? "text" : "password"}
          placeholder="Enter your Gemini API key"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10 transition-all duration-200 focus:neon-glow"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide API key" : "Show API key"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default ApiKeyInput;
