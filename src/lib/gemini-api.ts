/* Client-side Gemini 2.5 Flash API integration.
 * The user provides their own API key, which is stored only in the browser session.
 * No backend is required; calls go directly to the Gemini API.
 */

import {
  TailorStyle,
  CoverLetterStyle,
  ApiWorkload,
  IndustryUpdate,
  AiResponse
} from "./types";
import { isStringArray, isQnaArray, isIndustryUpdateArray } from "./validation-utils";
import { generateSystemInstruction, generateUserPrompt } from "./prompt-utils";

// Re-export types for backward compatibility
export type GeminiResponse = AiResponse;
export type { TailorStyle, CoverLetterStyle, ApiWorkload, IndustryUpdate };

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function callGeminiApi(
  apiKey: string,
  cvText: string,
  jobSpecText: string,
  keywords: string = "",
  styles: TailorStyle[] = ["Precision"],
  coverLetterStyle: CoverLetterStyle = "Middle",
  apiWorkload: ApiWorkload = "Normal"
): Promise<AiResponse> {
  if (!apiKey.trim()) {
    throw new Error("Please enter your Gemini API key.");
  }
  if (!cvText.trim()) {
    throw new Error("No CV text found. Please upload your CV first.");
  }
  if (!jobSpecText.trim()) {
    throw new Error("No job specification provided. Please add the job spec before generating.");
  }

  const systemInstruction = generateSystemInstruction(apiWorkload, coverLetterStyle);
  const userPrompt = generateUserPrompt(cvText, jobSpecText, keywords, styles);

  let responseSchema: Record<string, any> = {
    type: "OBJECT",
    properties: {
      match_percentage: { type: "INTEGER" },
      matching_highlights: { type: "ARRAY", items: { type: "STRING" } },
      missing_skills: { type: "ARRAY", items: { type: "STRING" } },
      tailored_cv: { type: "STRING" },
    },
    required: ["match_percentage", "matching_highlights", "missing_skills", "tailored_cv"],
  };

  if (apiWorkload !== "Minimal") {
    responseSchema.properties.cover_letter = { type: "STRING" };
    responseSchema.required.push("cover_letter");
  }

  if (apiWorkload === "Normal") {
    responseSchema.properties.interview_qna = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          answer: { type: "STRING" },
        },
        required: ["question", "answer"],
      },
    };
    responseSchema.properties.industry_updates = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          update: { type: "STRING" },
          source: { type: "STRING" },
        },
        required: ["update"],
      },
    };
    responseSchema.required.push("interview_qna", "industry_updates");
  }

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  };

  // Use the x-goog-api-key header instead of query parameter to prevent key leakage in logs
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Invalid request. Please check your API key and try again.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Invalid or unauthorised API key. Please check your Gemini API key.");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    const errorText = await response.text().catch(() => "");
    throw new Error(`Gemini API error (${response.status}): ${errorText || "Unknown error"}`);
  }

  const data = await response.json();

  // Extract the text content from the Gemini response
  const textContent =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error(
      "The API returned an empty response. Please try again or check your inputs."
    );
  }

  // Parse the JSON from the response text
  try {
    // The response may contain markdown code fences, so strip them
    const cleaned = textContent
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed: AiResponse = JSON.parse(cleaned);

    // Validate the structure based on workload
    // Always check base fields
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

    return parsed;
  } catch (parseError) {
    if (parseError instanceof SyntaxError) {
      throw new Error(
        "The API response could not be parsed. This sometimes happens with complex inputs. Please try again."
      );
    }
    throw parseError;
  }
}
