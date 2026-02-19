import { ApiWorkload, CoverLetterStyle, TailorStyle } from "./types";

const styleInstructions: Record<TailorStyle, string> = {
  Precision: "Optimise the CV to precisely match the job specification keywords and required experience.",
  Ruthless: "Cut down on irrelevant details and keep the CV concise and impactful.",
  Ambitious: "Push the boundaries of the candidate's experience to highlight potential and transferrable skills.",
};

const coverLetterInstructions: Record<CoverLetterStyle, string> = {
  Short: "A quick, concise email introduction.",
  Middle: "A standard formal cover letter.",
  Long: "An expanded, detailed cover letter highlighting extensive alignment.",
  };

export function generateSystemInstruction(
  apiWorkload: ApiWorkload,
  coverLetterStyle: CoverLetterStyle
): string {
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

  return systemInstruction;
}

export function generateUserPrompt(
  cvText: string,
  jobSpecText: string,
  keywords: string,
  styles: TailorStyle[]
): string {
  const selectedStylesInstructions = styles
    .map((s) => `${s}: ${styleInstructions[s]}`)
    .join("\n");

  return `Below is a candidate's CV and a job specification. Please process them according to the system instructions.
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
}
