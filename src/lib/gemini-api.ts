/* Client-side Gemini 2.5 Flash API integration.
 * The user provides their own API key, which is stored only in the browser session.
 * No backend is required; calls go directly to the Gemini API.
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_INSTRUCTION = `You are an expert career advisor and executive recruiter. You will be provided with a candidate's current CV and a target Job Specification. Your task is to analyse both inputs and output a structured JSON object.

Format requirements:
'match_percentage': An integer from 0 to 100 representing how well the original CV aligns with the job specification.
'missing_skills': An array of up to 5 key skills or requirements from the job specification that the candidate lacks.
'tailored_cv': A string containing the rewritten CV in clean Markdown format. Optimise the candidate's experience and skills to closely align with the job specification.
'cover_letter': A string containing a professional, concise email introduction or cover letter in Markdown format tailored to the role.
'interview_qna': An array of exactly 5 objects (each with a 'question' and 'answer' string), focusing on technical and behavioural aspects relevant to the job.
'industry_updates': An array of exactly 5 strings detailing recent trends or news pertaining to the industry.

Ensure all text uses UK English spelling.`;

export interface GeminiResponse {
  match_percentage: number;
  missing_skills: string[];
  tailored_cv: string;
  cover_letter: string;
  interview_qna: Array<{ question: string; answer: string }>;
  industry_updates: string[];
}

export type TailorStyle = "Precision" | "Ruthless" | "Ambitious";

export async function callGeminiApi(
  apiKey: string,
  cvText: string,
  jobSpecText: string,
  keywords: string = "",
  styles: TailorStyle[] = ["Precision"]
): Promise<GeminiResponse> {
  if (!apiKey.trim()) {
    throw new Error("Please enter your Gemini API key.");
  }
  if (!cvText.trim()) {
    throw new Error("No CV text found. Please upload your CV first.");
  }
  if (!jobSpecText.trim()) {
    throw new Error("No job specification provided. Please add the job spec before generating.");
  }

  const styleInstructions: Record<TailorStyle, string> = {
    Precision: "Optimise the CV to precisely match the job specification keywords and required experience.",
    Ruthless: "Cut down on irrelevant details and keep the CV concise and impactful.",
    Ambitious: "Push the boundaries of the candidate's experience to highlight potential and transferrable skills.",
  };

  const selectedStylesInstructions = styles
    .map((s) => `${s}: ${styleInstructions[s]}`)
    .join("\n");

  const userPrompt = `Below is a candidate's CV and a job specification. Please process them according to the system instructions.
### CANDIDATE CV ###
${cvText.replace(/###/g, "# # #")}
### END CANDIDATE CV ###

### JOB SPECIFICATION ###
${jobSpecText.replace(/###/g, "# # #")}
### END JOB SPECIFICATION ###

### ADDITIONAL KEYWORDS ###
${keywords.replace(/###/g, "# # #")}
### END ADDITIONAL KEYWORDS ###

### STYLE INSTRUCTIONS ###
The user has selected the following style(s):
${selectedStylesInstructions}
### END STYLE INSTRUCTIONS ###`;

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
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
      responseSchema: {
        type: "OBJECT",
        properties: {
          match_percentage: { type: "INTEGER" },
          missing_skills: { type: "ARRAY", items: { type: "STRING" } },
          tailored_cv: { type: "STRING" },
          cover_letter: { type: "STRING" },
          interview_qna: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                answer: { type: "STRING" }
              }
            }
          },
          industry_updates: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["match_percentage", "missing_skills", "tailored_cv", "cover_letter", "interview_qna", "industry_updates"]
      }
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

    const parsed: GeminiResponse = JSON.parse(cleaned);

    // Validate the structure
    if (
      parsed.match_percentage === undefined ||
      !parsed.missing_skills ||
      !parsed.tailored_cv ||
      !parsed.cover_letter ||
      !parsed.interview_qna ||
      !parsed.industry_updates
    ) {
      throw new Error("Missing required fields in the response.");
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
