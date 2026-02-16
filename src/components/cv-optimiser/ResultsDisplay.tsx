import { memo } from "react";
import { FileText, Mail, MessageSquare, TrendingUp, Target, ExternalLink } from "lucide-react";
import OutputCard from "./OutputCard";
import type { GeminiResponse } from "@/lib/gemini-api";

interface ResultsDisplayProps {
  data: GeminiResponse;
  originalCvText: string;
}

/** Renders the output sections as expressive Material cards */
const ResultsDisplay = ({ data, originalCvText }: ResultsDisplayProps) => {
  // Format interview Q&As as readable text for copy
  const qnaCopyText = data.interview_qna
    ?.map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
    .join("\n\n") || "";

  // Format industry updates as readable text for copy
  const updatesCopyText = data.industry_updates
    ?.map((item, i) => `${i + 1}. ${item.update}${item.source ? ` (Source: ${item.source})` : ""}`)
    .join("\n\n") || "";

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Match Analysis</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-muted rounded-lg w-full md:w-32 h-fit">
            <span className="text-3xl font-bold text-primary">{data.match_percentage}%</span>
            <span className="text-xs text-muted-foreground text-center mt-1">Initial Match</span>
          </div>

          <div className="flex-grow space-y-6">
            {/* Positives Section */}
            {data.matching_highlights && data.matching_highlights.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Key Strengths (Positives)
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {data.matching_highlights.map((highlight, index) => (
                    <li key={`pos-${index}`} className="text-sm text-card-foreground/80">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Identified Skill Gaps to Address
              </h3>
              {data.missing_skills.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {data.missing_skills.map((skill, index) => (
                    <li key={`gap-${index}`} className="text-sm text-card-foreground/80">
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
      </div>

      <OutputCard
        title="Tailored CV"
        icon={<FileText className="h-5 w-5" />}
        content={data.tailored_cv}
        copyText={data.tailored_cv}
        index={0}
        // Pass original text for diffing.
        // Note: Comparing raw extracted text with markdown output might be noisy,
        // but it provides the requested functionality.
        originalText={originalCvText}
      />

      {data.cover_letter && (
        <OutputCard
          title="Cover Letter"
          icon={<Mail className="h-5 w-5" />}
          content={data.cover_letter}
          copyText={data.cover_letter}
          index={1}
        />
      )}

      {data.interview_qna && (
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
      )}

      {data.industry_updates && (
        <OutputCard
          title="Industry Updates"
          icon={<TrendingUp className="h-5 w-5" />}
          content={
            <ol className="list-decimal space-y-3 pl-5">
              {data.industry_updates.map((item, i) => (
                <li key={i} className="text-card-foreground/80">
                  <span>{item.update}</span>
                  {item.source && (
                    <a
                      href={item.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center text-xs text-primary hover:underline gap-0.5"
                    >
                      Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          }
          copyText={updatesCopyText}
          index={3}
        />
      )}
    </div>
  );
};

export default memo(ResultsDisplay);
