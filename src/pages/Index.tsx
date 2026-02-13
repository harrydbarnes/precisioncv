import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/cv-optimiser/Header";
import ApiKeyInput from "@/components/cv-optimiser/ApiKeyInput";
import FileUpload, { type SavedCV } from "@/components/cv-optimiser/FileUpload";
import JobSpecInput from "@/components/cv-optimiser/JobSpecInput";
import LoadingSkeleton from "@/components/cv-optimiser/LoadingSkeleton";
import ResultsDisplay from "@/components/cv-optimiser/ResultsDisplay";
import TailorSection from "@/components/cv-optimiser/TailorSection";
import Footer from "@/components/Footer";
import { callGeminiApi, type GeminiResponse, type TailorStyle } from "@/lib/gemini-api";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Index = () => {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("gemini-key") || "");
  const [saveKey, setSaveKey] = useState(() => {
    if (typeof window === "undefined") {
      return true; // Default to true on the server
    }
    return localStorage.getItem("save-gemini-key") !== "false";
  });
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("saved-cvs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [saveCV, setSaveCV] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("save-cv-pref") === "true";
  });
  const [cvText, setCvText] = useState("");
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [jobSpecText, setJobSpecText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [styles, setStyles] = useState<TailorStyle[]>(["Precision"]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Persist saveKey preference
  useEffect(() => {
    localStorage.setItem("save-gemini-key", String(saveKey));
  }, [saveKey]);

  // Persist API key in session storage
  useEffect(() => {
    if (saveKey && apiKey) {
      sessionStorage.setItem("gemini-key", apiKey);
    } else {
      sessionStorage.removeItem("gemini-key");
    }
  }, [apiKey, saveKey]);

  useEffect(() => {
    localStorage.setItem("save-cv-pref", String(saveCV));
    if (!saveCV) {
      localStorage.removeItem("saved-cvs");
      setSavedCVs([]);
    }
  }, [saveCV]);

  useEffect(() => {
    localStorage.setItem("saved-cvs", JSON.stringify(savedCVs));
  }, [savedCVs]);

  useEffect(() => {
    if (saveCV && savedCVs.length > 0 && !cvText && !currentFileName) {
      const sorted = [...savedCVs].sort((a, b) => b.date - a.date);
      const last = sorted[0];
      setCvText(last.content);
      setCurrentFileName(last.name);
    }
  }, []);

  // Memoized handlers to prevent child components (like FileUpload) from re-rendering
  // when unrelated state changes (e.g. typing in job spec)
  const handleCvExtracted = useCallback(
    (text: string, fileName: string) => {
      setCvText(text);
      setCurrentFileName(fileName || null);

      if (text && fileName && saveCV) {
        setSavedCVs((prev) => {
          const existingIndex = prev.findIndex((c) => c.name === fileName);
          const newCV = { name: fileName, content: text, date: Date.now() };
          if (existingIndex >= 0) {
            const newArr = [...prev];
            newArr[existingIndex] = newCV;
            return newArr;
          }
          return [...prev, newCV];
        });
      }
    },
    [saveCV]
  );

  const handleSelectCV = useCallback((cv: SavedCV) => {
    setCvText(cv.content);
    setCurrentFileName(cv.name);
  }, []);

  const handleDeleteCV = useCallback(
    (name: string) => {
      setSavedCVs((prev) => prev.filter((c) => c.name !== name));
      if (currentFileName === name) {
        setCvText("");
        setCurrentFileName(null);
      }
    },
    [currentFileName]
  );

  const handleError = useCallback(
    (message: string) => {
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    },
    [toast]
  );

  const handleGenerate = async () => {
    setError(null);
    setResults(null);
    setLoading(true);

    try {
      const data = await callGeminiApi(apiKey, cvText, jobSpecText, keywords, styles);
      setResults(data);
      toast({ title: "Success", description: "Your optimised content is ready." });
    } catch (err: any) {
      handleError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const missingRequirements: string[] = [];
  if (!apiKey.trim()) missingRequirements.push("Gemini API Key");
  if (!cvText.trim()) missingRequirements.push("CV Upload");
  if (!jobSpecText.trim()) missingRequirements.push("Job Specification");

  const canGenerate = missingRequirements.length === 0 && !loading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-3xl px-4 pb-20">
        {/* Input section */}
        <motion.section
          className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ApiKeyInput
            value={apiKey}
            onChange={setApiKey}
            saveKey={saveKey}
            onSaveKeyChange={setSaveKey}
          />

          <FileUpload
            label="Upload Your CV"
            description="Upload your current CV to be optimised for the target role."
            onTextExtracted={handleCvExtracted}
            onError={handleError}
            saveCV={saveCV}
            onSaveCVChange={setSaveCV}
            savedCVs={savedCVs}
            onSelectCV={handleSelectCV}
            onDeleteCV={handleDeleteCV}
            fileName={currentFileName}
          />

          <JobSpecInput value={jobSpecText} onChange={setJobSpecText} onError={handleError} />

          <TailorSection
            keywords={keywords}
            setKeywords={setKeywords}
            selectedStyles={styles}
            setSelectedStyles={setStyles}
          />

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full cursor-not-allowed">
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    size="lg"
                    className="w-full gap-2 text-base font-semibold bg-hero-500 text-hero-800 transition-all duration-300 hover:bg-hero-600 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {!canGenerate && (
                <TooltipContent className="bg-destructive-tooltip border-destructive-tooltip text-white">
                  <p>Please provide: {missingRequirements.join(", ")}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </motion.section>

        {/* Output section */}
        <section className="mt-10">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSkeleton />
              </motion.div>
            )}

            {results && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResultsDisplay data={results} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
