import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GenerateButtonProps {
  loading: boolean;
  missingRequirements: string[];
  onGenerate: () => void;
}

const GenerateButton = ({ loading, missingRequirements, onGenerate }: GenerateButtonProps) => {
  const isDisabled = missingRequirements.length > 0 || loading;
  const showPopover = missingRequirements.length > 0 && !loading;

  const button = (
    <Button
      onClick={onGenerate}
      disabled={isDisabled}
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
  );

  if (showPopover) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full cursor-not-allowed">{button}</div>
        </PopoverTrigger>
        <PopoverContent className="bg-destructive-tooltip border-destructive-tooltip text-white w-auto max-w-[calc(100vw-2rem)] p-2 shadow-none break-words">
          <p>Please provide: {missingRequirements.join(", ")}</p>
        </PopoverContent>
      </Popover>
    );
  }

  return button;
};

export default GenerateButton;
