import { FileText, Mail, MessageSquare, TrendingUp, Target } from "lucide-react";
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
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Match Analysis</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-muted rounded-lg w-full md:w-32">
            <span className="text-3xl font-bold text-primary">{data.match_percentage}%</span>
            <span className="text-xs text-muted-foreground text-center mt-1">Initial Match</span>
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-semibold mb-2">Identified Skill Gaps to Address:</h3>
            {data.missing_skills.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {data.missing_skills.map((skill, index) => (
                  <li key={`${skill}-${index}`} className="text-sm text-card-foreground/80">
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-card-foreground/80">No significant skill gaps identified. Strong match!</p>
            )}
          </div>
        </div>
      </div>

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
