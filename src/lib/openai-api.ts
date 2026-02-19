import {
  TailorStyle,
  CoverLetterStyle,
  ApiWorkload,
  IndustryUpdate,
  AiResponse
} from "./types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isQnaArray = (
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

const isIndustryUpdateArray = (
  value: unknown
): value is IndustryUpdate[] =>
  Array.isArray(value) &&
  value.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).update === "string"
  );

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

  const styleInstructions: Record<TailorStyle, string> = {
    Precision: "Optimise the CV to precisely match the job specification keywords and required experience.",
    Ruthless: "Cut down on irrelevant details and keep the CV concise and impactful.",
    Ambitious: "Push the boundaries of the candidate's experience to highlight potential and transferrable skills.",
  };

  const selectedStylesInstructions = styles
    .map((s) => `${s}: ${styleInstructions[s]}`)
    .join("\n");

  const coverLetterInstructions: Record<CoverLetterStyle, string> = {
    Short: "A quick, concise email introduction.",
    Middle: "A standard formal cover letter.",
    Long: "An expanded, detailed cover letter highlighting extensive alignment.",
  };

  let systemInstruction = `You are Bruce, the CV Spruce agent, an expert career advisor and executive recruiter. You will be provided with a candidate's current CV and a target Job Specification. Your task is to analyse both inputs and output a structured JSON object.

Format requirements:
'match_percentage': An integer from 0 to 100 representing how well the original CV aligns with the job specification.
'matching_highlights': An array of 2 to 3 brief bullet points highlighting positive aspects of the candidate's existing experience relevant to the job.
'missing_skills': An array of up to 5 key skills or requirements from the job specification that the candidate lacks.
'tailored_cv': A string containing the rewritten CV in clean Markdown format. Optimise the candidate's experience and skills to closely align with the job specification.
Ensure all text uses UK English spelling.`;

  if (apiWorkload !== "Minimal") {
    systemInstruction += `\n'cover_letter': A string containing a ${coverLetterInstructions[coverLetterStyle]} in Markdown format.`;
  }

  if (apiWorkload === "Normal") {
    systemInstruction += `\n'interview_qna': An array of exactly 5 objects (each with a 'question' and 'answer' string), focusing on technical and behavioural aspects relevant to the job.`;
    systemInstruction += `\n'industry_updates': An array of exactly 5 objects (each with 'update' string and optional 'source' string) detailing recent trends or news pertaining to the industry. If possible, provide a source link.`;
  }

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
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
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
    throw new Error("The API returned an empty response.");
  }

  try {
    const parsed: AiResponse = JSON.parse(textContent);

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
