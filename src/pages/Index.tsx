import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/cv-optimiser/Header";
import ApiKeyInput from "@/components/cv-optimiser/ApiKeyInput";
import FileUpload from "@/components/cv-optimiser/FileUpload";
import JobSpecInput from "@/components/cv-optimiser/JobSpecInput";
import LoadingSkeleton from "@/components/cv-optimiser/LoadingSkeleton";
import ResultsDisplay from "@/components/cv-optimiser/ResultsDisplay";
import TailorSection, { TailorStyle } from "@/components/cv-optimiser/TailorSection";
import Footer from "@/components/Footer";
import { callGeminiApi, type GeminiResponse } from "@/lib/gemini-api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("gemini-key") || "");
  const [saveKey, setSaveKey] = useState(true);
  const [cvText, setCvText] = useState("");
  const [jobSpecText, setJobSpecText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState<TailorStyle>("Precision");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Persist API key in session storage
  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
    if (saveKey && key) {
      sessionStorage.setItem("gemini-key", key);
    } else {
      sessionStorage.removeItem("gemini-key");
    }
  }, [saveKey]);

  const handleSaveKeyChange = useCallback((save: boolean) => {
    setSaveKey(save);
    if (save && apiKey) {
      sessionStorage.setItem("gemini-key", apiKey);
    } else {
      sessionStorage.removeItem("gemini-key");
    }
  }, [apiKey]);

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
      const data = await callGeminiApi(apiKey, cvText, jobSpecText, keywords, style);
      setResults(data);
      toast({ title: "Success", description: "Your optimised content is ready." });
    } catch (err: any) {
      handleError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = apiKey.trim() && cvText.trim() && jobSpecText.trim() && !loading;

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
            onChange={handleApiKeyChange}
            saveKey={saveKey}
            onSaveKeyChange={handleSaveKeyChange}
          />

          <FileUpload
            label="Upload Your CV"
            description="Upload your current CV to be optimised for the target role."
            onTextExtracted={setCvText}
            onError={handleError}
          />

          <JobSpecInput value={jobSpecText} onChange={setJobSpecText} onError={handleError} />

          <TailorSection
            keywords={keywords}
            setKeywords={setKeywords}
            style={style}
            setStyle={setStyle}
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
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            size="lg"
            className="w-full gap-2 text-base font-semibold bg-hero-500 text-hero-800 transition-all duration-300 hover:bg-hero-600 disabled:opacity-50"
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
