import { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Globe, Loader2, AlertCircle, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "./FileUpload";
import { extractTextFromUrl } from "@/lib/extract-text";
import { TabSelector } from "./TabSelector";

interface JobSpecInputProps {
  value: string;
  onChange: (value: string) => void;
  onError: (error: string) => void;
  rememberJobSpec?: boolean;
  onRememberChange?: (checked: boolean) => void;
}

const containerAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
};

const tabContentAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const options = [
  { id: "text", label: "Paste Text" },
  { id: "file", label: "Upload File" },
  { id: "url", label: "From URL" },
];

/** Tabbed job specification input: text, file, or URL */
const JobSpecInput = ({
  value,
  onChange,
  onError,
  rememberJobSpec,
  onRememberChange,
}: JobSpecInputProps) => {
  const [activeTab, setActiveTab] = useState("text");
  const [url, setUrl] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const handleUrlFetch = useCallback(async () => {
    setFetchingUrl(true);
    try {
      const text = await extractTextFromUrl(url);
      onChange(text);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch content from the URL.";
      onError(message);
    } finally {
      setFetchingUrl(false);
    }
  }, [url, onChange, onError]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <motion.div {...containerAnimation}>
      <div className="mb-2 flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Briefcase className="h-4 w-4 text-primary" />
          Job Specification
        </Label>
        {onRememberChange && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-job-spec"
              checked={rememberJobSpec}
              onCheckedChange={(checked) => onRememberChange(checked as boolean)}
            />
            <label
              htmlFor="remember-job-spec"
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              Remember
            </label>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <TabSelector
          options={options}
          value={activeTab}
          onChange={setActiveTab}
          layoutId="job-spec-source"
        />

        <motion.div layout className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeTab === "text" && (
              <motion.div
                key="text"
                {...tabContentAnimation}
                className="relative w-full"
              >
                <Textarea
                  placeholder="Paste the job specification here..."
                  value={value}
                  onChange={handleTextChange}
                  className="min-h-[160px] transition-all duration-200 focus:neon-glow pr-8"
                />
                {value && (
                  <button
                    onClick={handleClear}
                    className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground bg-background/50 rounded-full transition-colors"
                    aria-label="Clear job specification"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            )}

            {activeTab === "file" && (
              <motion.div
                key="file"
                {...tabContentAnimation}
                className="w-full"
              >
                <FileUpload
                  label="Job Spec File"
                  onTextExtracted={onChange}
                  onError={onError}
                />
              </motion.div>
            )}

            {activeTab === "url" && (
              <motion.div
                key="url"
                {...tabContentAnimation}
                className="w-full"
              >
                <div className="space-y-3">
                  <Input
                    placeholder="https://example.com/job-posting"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="transition-all duration-200 focus:neon-glow"
                  />
                  <Button
                    onClick={handleUrlFetch}
                    disabled={!url.trim() || fetchingUrl}
                    variant="outline"
                    className="w-full"
                  >
                    {fetchingUrl ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Fetch Job Spec from URL
                      </>
                    )}
                  </Button>
                  {value && !fetchingUrl && (
                    <p className="text-xs text-primary">
                      Job specification text loaded successfully.
                    </p>
                  )}
                  <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                    <p>
                      Note: This feature uses a public proxy (codetabs). Do not use for sensitive internal documents.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(JobSpecInput);
