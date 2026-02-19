import { useCallback, useState, memo } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Loader2, Trash2, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { extractTextFromFile } from "@/lib/extract-text";
import { ModelType } from "@/lib/types";
import { MODEL_PROVIDER_NAMES } from "@/lib/constants";

export interface SavedCV {
  name: string;
  content: string;
  date: number;
}

interface FileUploadProps {
  label: string;
  description?: string;
  onTextExtracted: (text: string, fileName: string) => void;
  onError: (error: string) => void;
  saveCV?: boolean;
  onSaveCVChange?: (checked: boolean) => void;
  savedCVs?: SavedCV[];
  onSelectCV?: (cv: SavedCV) => void;
  onDeleteCV?: (name: string) => void;
  fileName?: string | null;
  selectedModel: ModelType;
}

/** Drag-and-drop file upload with text extraction */
const FileUpload = ({
  label,
  description,
  onTextExtracted,
  onError,
  saveCV = false,
  onSaveCVChange,
  savedCVs = [],
  onSelectCV,
  onDeleteCV,
  fileName: externalFileName,
  selectedModel,
}: FileUploadProps) => {
  const [internalFileName, setInternalFileName] = useState<string | null>(null);
  const fileName = externalFileName !== undefined ? externalFileName : internalFileName;

  const [extracting, setExtracting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (externalFileName === undefined) setInternalFileName(file.name);
      setExtracting(true);
      try {
        const text = await extractTextFromFile(file);
        onTextExtracted(text, file.name);
      } catch (err: any) {
        onError(err.message || "Failed to extract text from the file.");
        if (externalFileName === undefined) setInternalFileName(null);
      } finally {
        setExtracting(false);
      }
    },
    [onTextExtracted, onError, externalFileName]
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
    if (externalFileName === undefined) setInternalFileName(null);
    onTextExtracted("", "");
  };

  const handleSelectCV = (value: string) => {
    const cv = savedCVs.find((c) => c.name === value);
    if (cv) {
      if (externalFileName === undefined) setInternalFileName(cv.name);
      onSelectCV?.(cv);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-primary" />
          {label}
        </Label>
        {onSaveCVChange && (
          <div className="flex items-center gap-2">
            <Label htmlFor="save-cv" className="text-xs cursor-pointer">
              Save CV
            </Label>
            <Switch
              id="save-cv"
              checked={saveCV}
              onCheckedChange={onSaveCVChange}
            />
          </div>
        )}
      </div>

      {description && (
        <p className="mb-2 text-xs text-muted-foreground">{description}</p>
      )}

      <p className="mb-2 text-xs text-muted-foreground">
        Your CV is stored locally in your browser. It is sent to the {MODEL_PROVIDER_NAMES[selectedModel]} API for processing but
        is not stored on our servers.
      </p>

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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={clear}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove file</p>
              </TooltipContent>
            </Tooltip>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {savedCVs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  aria-label="Select saved CV"
                >
                  <span className="truncate">Select a saved CV</span>
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {savedCVs.map((cv) => (
                  <DropdownMenuItem
                    key={cv.name}
                    className="flex items-center justify-between cursor-pointer"
                    onSelect={() => handleSelectCV(cv.name)}
                  >
                    <span className="truncate pr-8">{cv.name}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive shrink-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteId(cv.name);
                          }}
                          aria-label={`Delete ${cv.name}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete {cv.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${
              dragOver
                ? "border-hero-500 bg-hero-100/20"
                : "border-border hover:border-hero-500 hover:bg-hero-100/10"
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
              className="sr-only"
              onChange={handleInputChange}
            />
          </label>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved CV?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteId}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.stopPropagation();
                if (deleteId) onDeleteCV?.(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Memoized to prevent re-renders when parent state changes (e.g. typing in job spec)
export default memo(FileUpload);
