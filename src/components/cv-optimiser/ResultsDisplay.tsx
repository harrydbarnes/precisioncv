import { FileText, Mail, MessageSquare, TrendingUp } from "lucide-react";
import OutputCard from "./OutputCard";
import type { GeminiResponse } from "@/lib/gemini-api";

interface ResultsDisplayProps {
  data: GeminiResponse;
}

/** Renders the four output sections as expressive Material cards */
const ResultsDisplay = ({ data }: ResultsDisplayProps) => {
  // Format interview Q&As as readable text for copy
  const qnaCopyText = data.interview_qna
    .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
    .join("\n\n");

  // Format industry updates as readable text for copy
  const updatesCopyText = data.industry_updates
    .map((item, i) => `${i + 1}. ${item}`)
    .join("\n\n");

  return (
    <div className="space-y-6">
      <OutputCard
        title="Tailored CV"
        icon={<FileText className="h-5 w-5" />}
        content={data.tailored_cv}
        copyText={data.tailored_cv}
        index={0}
      />

      <OutputCard
        title="Cover Letter"
        icon={<Mail className="h-5 w-5" />}
        content={data.cover_letter}
        copyText={data.cover_letter}
        index={1}
      />

      <OutputCard
        title="Interview Q&amp;As"
        icon={<MessageSquare className="h-5 w-5" />}
        content={
          <div className="space-y-5">
            {data.interview_qna.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <p className="font-semibold text-foreground">
                  Q{i + 1}: {item.question}
                </p>
                <p className="text-card-foreground/80 pl-4 border-l-2 border-primary/30">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        }
        copyText={qnaCopyText}
        index={2}
      />

      <OutputCard
        title="Industry Updates"
        icon={<TrendingUp className="h-5 w-5" />}
        content={
          <ol className="list-decimal space-y-3 pl-5">
            {data.industry_updates.map((item, i) => (
              <li key={i} className="text-card-foreground/80">
                {item}
              </li>
            ))}
          </ol>
        }
        copyText={updatesCopyText}
        index={3}
      />
    </div>
  );
};

export default ResultsDisplay;
