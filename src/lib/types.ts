export type TailorStyle = "Precision" | "Ruthless" | "Ambitious";
export type CoverLetterStyle = "Short" | "Middle" | "Long";
export type ApiWorkload = "Normal" | "Reduced" | "Minimal";

export type ModelType = "gemini" | "claude" | "openai";

export interface IndustryUpdate {
  update: string;
  source?: string;
}

export interface AiResponse {
  match_percentage: number;
  matching_highlights: string[];
  missing_skills: string[];
  tailored_cv: string;
  cover_letter?: string;
  interview_qna?: Array<{ question: string; answer: string }>;
  industry_updates?: IndustryUpdate[];
}
