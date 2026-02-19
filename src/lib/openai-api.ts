import {
  TailorStyle,
  CoverLetterStyle,
  ApiWorkload,
  AiResponse
} from "./types";
import { validateAiResponse } from "./validation-utils";
import { generateSystemInstruction, generateUserPrompt } from "./prompt-utils";
import { DEFAULT_TEMPERATURE } from "./constants";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function callOpenAiApi(
  apiKey: string,
  cvText: string,
  jobSpecText: string,
  keywords: string = "",
  styles: TailorStyle[] = ["Precision"],
  coverLetterStyle: CoverLetterStyle = "Middle",
  apiWorkload: ApiWorkload = "Normal"
): Promise<AiResponse> {
  if (!apiKey.trim()) {
    throw new Error("Please enter your OpenAI API key.");
  }
  if (!cvText.trim()) {
    throw new Error("No CV text found. Please upload your CV first.");
  }
  if (!jobSpecText.trim()) {
    throw new Error("No job specification provided. Please add the job spec before generating.");
  }

  const systemInstruction = generateSystemInstruction(apiWorkload, coverLetterStyle);
  const userPrompt = generateUserPrompt(cvText, jobSpecText, keywords, styles);

  const requestBody = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt }
    ],
    temperature: DEFAULT_TEMPERATURE,
    response_format: { type: "json_object" }
  };

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
     const errorText = await response.text().catch(() => "");
     if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid or unauthorised API key. Please check your OpenAI API key.");
     }
     if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
     }
     throw new Error(`OpenAI API error (${response.status}): ${errorText || "Unknown error"}`);
  }

  const data = await response.json();
  const textContent = data?.choices?.[0]?.message?.content;

  if (!textContent) {
    console.error("OpenAI API unexpected response:", data);
    throw new Error("The API returned an empty response. Check console for details.");
  }

  try {
    const parsed = JSON.parse(textContent);
    return validateAiResponse(parsed, apiWorkload);
  } catch (e) {
     if (e instanceof SyntaxError) {
       throw new Error("The API response could not be parsed as JSON.");
     }
     if (e instanceof Error) {
        throw e; // Rethrow validation errors
     }
     throw new Error("An unknown error occurred while parsing the response.");
  }
}
