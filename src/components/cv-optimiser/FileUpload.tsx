import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { extractTextFromFile } from "@/lib/extract-text";

interface FileUploadProps {
  label: string;
  description?: string;
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

/** Drag-and-drop file upload with text extraction */
const FileUpload = ({ label, description, onTextExtracted, onError }: FileUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setExtracting(true);
      try {
        const text = await extractTextFromFile(file);
        onTextExtracted(text);
      } catch (err: any) {
        onError(err.message || "Failed to extract text from the file.");
        setFileName(null);
      } finally {
        setExtracting(false);
      }
    },
    [onTextExtracted, onError]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setFileName(null);
    onTextExtracted("");
  };

  return (
    <div>
      <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <FileText className="h-4 w-4 text-primary" />
        {label}
      </Label>
      {description && (
        <p className="mb-2 text-xs text-muted-foreground">{description}</p>
      )}

      {fileName ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3"
        >
          {extracting ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <FileText className="h-5 w-5 text-primary" />
          )}
          <span className="flex-1 truncate text-sm font-medium">{fileName}</span>
          {!extracting && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      ) : (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-300 ${
            dragOver
              ? "border-primary bg-primary/10 neon-glow"
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Drop a file here or click to browse
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            Accepts .pdf, .docx, .txt
          </span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleInputChange}
          />
        </label>
      )}
    </div>
  );
};

export default FileUpload;
