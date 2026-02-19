import { IndustryUpdate, AiResponse, ApiWorkload } from "./types";

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const isQnaArray = (
  value: unknown
): value is Array<{ question: string; answer: string }> =>
  Array.isArray(value) &&
  value.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).question === "string" &&
      typeof (item as Record<string, unknown>).answer === "string"
  );

export const isIndustryUpdateArray = (
  value: unknown
): value is IndustryUpdate[] =>
  Array.isArray(value) &&
  value.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).update === "string"
  );

export function validateAiResponse(parsed: any, apiWorkload: ApiWorkload): AiResponse {
  if (
    !parsed ||
    typeof parsed.match_percentage !== "number" ||
    !isStringArray(parsed.matching_highlights) ||
    !isStringArray(parsed.missing_skills) ||
    typeof parsed.tailored_cv !== "string"
  ) {
    throw new Error(
      "The API response is missing required fields (Match, CV)."
    );
  }

  if (apiWorkload !== "Minimal") {
    if (typeof parsed.cover_letter !== "string") {
      throw new Error("The API response is missing the Cover Letter.");
    }
  }

  if (apiWorkload === "Normal") {
    if (!isQnaArray(parsed.interview_qna) || !isIndustryUpdateArray(parsed.industry_updates)) {
      throw new Error("The API response is missing Q&A or Industry Updates.");
    }
  }

  return parsed as AiResponse;
}
