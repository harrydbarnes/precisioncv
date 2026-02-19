import {
  TailorStyle,
  CoverLetterStyle,
  ApiWorkload,
  AiResponse
} from "./types";
import { isStringArray, isQnaArray, isIndustryUpdateArray } from "./validation-utils";
import { generateSystemInstruction, generateUserPrompt } from "./prompt-utils";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

export async function callClaudeApi(
  apiKey: string,
  cvText: string,
  jobSpecText: string,
  keywords: string = "",
  styles: TailorStyle[] = ["Precision"],
  coverLetterStyle: CoverLetterStyle = "Middle",
  apiWorkload: ApiWorkload = "Normal"
): Promise<AiResponse> {
  if (!apiKey.trim()) {
    throw new Error("Please enter your Claude API key.");
  }
  if (!cvText.trim()) {
    throw new Error("No CV text found. Please upload your CV first.");
  }
  if (!jobSpecText.trim()) {
    throw new Error("No job specification provided. Please add the job spec before generating.");
  }

  let systemInstruction = generateSystemInstruction(apiWorkload, coverLetterStyle);
  const userPrompt = generateUserPrompt(cvText, jobSpecText, keywords, styles);

  systemInstruction += "\n\nIMPORTANT: Output ONLY the raw JSON object. Do not include markdown formatting like ```json ... ``` or any other text.";

  const requestBody = {
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4096,
    system: systemInstruction,
    messages: [
      { role: "user", content: userPrompt }
    ]
  };

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerously-allow-browser": "true"
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
     const errorText = await response.text().catch(() => "");
     if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid or unauthorised API key. Please check your Claude API key.");
     }
     if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
     }
     throw new Error(`Claude API error (${response.status}): ${errorText || "Unknown error"}`);
  }

  const data = await response.json();
  const textContent = data?.content?.[0]?.text;

  if (!textContent) {
    throw new Error("The API returned an empty response.");
  }

  try {
    // Strip markdown just in case Claude adds it despite instructions
    const cleaned = textContent
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed: AiResponse = JSON.parse(cleaned);

    // Validation logic
    if (
      !parsed ||
      typeof parsed.match_percentage !== "number" ||
      !isStringArray(parsed.matching_highlights) ||
      !isStringArray(parsed.missing_skills) ||
      typeof parsed.tailored_cv !== "string"
    ) {
      throw new Error("The API response is missing required fields (Match, CV).");
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
  } catch (e) {
     if (e instanceof SyntaxError) {
       throw new Error("The API response could not be parsed as JSON.");
     }
     throw e;
  }
}
