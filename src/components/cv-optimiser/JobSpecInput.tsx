import { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Globe, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FileUpload from "./FileUpload";
import { extractTextFromUrl } from "@/lib/extract-text";

interface JobSpecInputProps {
  value: string;
  onChange: (value: string) => void;
  onError: (error: string) => void;
}

const containerAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
};

const tabContentAnimation = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
  transition: { duration: 0.2 },
};

/** Tabbed job specification input: text, file, or URL */
const JobSpecInput = ({ value, onChange, onError }: JobSpecInputProps) => {
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

  return (
    <motion.div {...containerAnimation}>
      <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Briefcase className="h-4 w-4 text-primary" />
        Job Specification
      </Label>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-3 w-full grid grid-cols-3">
          <TabsTrigger
            value="text"
            className="text-xs sm:text-sm hover:bg-hero-100 hover:text-hero-800 transition-colors"
          >
            Paste Text
          </TabsTrigger>
          <TabsTrigger
            value="file"
            className="text-xs sm:text-sm hover:bg-hero-100 hover:text-hero-800 transition-colors"
          >
            Upload File
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="text-xs sm:text-sm hover:bg-hero-100 hover:text-hero-800 transition-colors"
          >
            From URL
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="text" key="text">
            <motion.div {...tabContentAnimation}>
              <Textarea
                placeholder="Paste the job specification here..."
                value={value}
                onChange={handleTextChange}
                className="min-h-[160px] transition-all duration-200 focus:neon-glow"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="file" key="file">
            <motion.div {...tabContentAnimation}>
              <FileUpload
                label="Job Spec File"
                onTextExtracted={onChange}
                onError={onError}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="url" key="url">
            <motion.div {...tabContentAnimation}>
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
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default memo(JobSpecInput);
