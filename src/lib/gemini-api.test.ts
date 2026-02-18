import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { callGeminiApi, GeminiResponse } from "./gemini-api";

describe("callGeminiApi", () => {
  const originalFetch = global.fetch;
  const mockApiKey = "test-api-key";
  const mockCvText = "Sample CV Text";
  const mockJobSpec = "Sample Job Spec";

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const createMockResponse = (data: any) => ({
    ok: true,
    json: async () => ({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify(data),
              },
            ],
          },
        },
      ],
    }),
  });

  const validResponseBase = {
    match_percentage: 85,
    matching_highlights: ["Highlight 1", "Highlight 2"],
    missing_skills: ["Skill 1", "Skill 2"],
    tailored_cv: "# Tailored CV",
  };

  it("should successfully generate content with Normal workload", async () => {
    const mockData: GeminiResponse = {
      ...validResponseBase,
      cover_letter: "# Cover Letter",
      interview_qna: [
        { question: "Q1", answer: "A1" },
        { question: "Q2", answer: "A2" },
        { question: "Q3", answer: "A3" },
        { question: "Q4", answer: "A4" },
        { question: "Q5", answer: "A5" },
      ],
      industry_updates: [
        { update: "Update 1", source: "Source 1" },
        { update: "Update 2" },
        { update: "Update 3" },
        { update: "Update 4" },
        { update: "Update 5" },
      ],
    };

    (global.fetch as Mock).mockResolvedValue(createMockResponse(mockData));

    const result = await callGeminiApi(
      mockApiKey,
      mockCvText,
      mockJobSpec,
      "",
      ["Precision"],
      "Middle",
      "Normal"
    );

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("generativelanguage.googleapis.com"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-goog-api-key": mockApiKey,
        }),
      })
    );
  });

  it("should successfully generate content with Reduced workload", async () => {
    const mockData: GeminiResponse = {
      ...validResponseBase,
      cover_letter: "# Cover Letter",
    };

    (global.fetch as Mock).mockResolvedValue(createMockResponse(mockData));

    const result = await callGeminiApi(
      mockApiKey,
      mockCvText,
      mockJobSpec,
      "",
      ["Precision"],
      "Middle",
      "Reduced"
    );

    expect(result).toEqual(mockData);
    expect(result.interview_qna).toBeUndefined();
    expect(result.industry_updates).toBeUndefined();
  });

  it("should successfully generate content with Minimal workload", async () => {
    const mockData: GeminiResponse = {
      ...validResponseBase,
    };

    (global.fetch as Mock).mockResolvedValue(createMockResponse(mockData));

    const result = await callGeminiApi(
      mockApiKey,
      mockCvText,
      mockJobSpec,
      "",
      ["Precision"],
      "Middle",
      "Minimal"
    );

    expect(result).toEqual(mockData);
    expect(result.cover_letter).toBeUndefined();
    expect(result.interview_qna).toBeUndefined();
    expect(result.industry_updates).toBeUndefined();
  });

  it("should throw error if API key is missing", async () => {
    await expect(
      callGeminiApi("", mockCvText, mockJobSpec)
    ).rejects.toThrow("Please enter your Gemini API key.");
  });

  it("should throw error if CV text is missing", async () => {
    await expect(
      callGeminiApi(mockApiKey, "", mockJobSpec)
    ).rejects.toThrow("No CV text found");
  });

  it("should throw error if Job Spec is missing", async () => {
    await expect(
      callGeminiApi(mockApiKey, mockCvText, "")
    ).rejects.toThrow("No job specification provided");
  });

  it("should handle 401 Unauthorized error", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    await expect(
      callGeminiApi(mockApiKey, mockCvText, mockJobSpec)
    ).rejects.toThrow("Invalid or unauthorised API key");
  });

  it("should handle 429 Rate Limit error", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "Too Many Requests",
    });

    await expect(
      callGeminiApi(mockApiKey, mockCvText, mockJobSpec)
    ).rejects.toThrow("Rate limit exceeded");
  });

  it("should handle generic API errors", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(
      callGeminiApi(mockApiKey, mockCvText, mockJobSpec)
    ).rejects.toThrow("Gemini API error (500)");
  });

  it("should throw error if response is empty", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [] }),
    });

    await expect(
      callGeminiApi(mockApiKey, mockCvText, mockJobSpec)
    ).rejects.toThrow("The API returned an empty response");
  });

  it("should throw error if JSON parsing fails", async () => {
    (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
            candidates: [
                { content: { parts: [{ text: "Invalid JSON" }] } }
            ]
        })
    });

    await expect(
      callGeminiApi(mockApiKey, mockCvText, mockJobSpec)
    ).rejects.toThrow("The API response could not be parsed");
  });

  it("should validate missing fields in response", async () => {
      const invalidData = {
          match_percentage: 85
          // Missing other required fields
      };

      (global.fetch as Mock).mockResolvedValue(createMockResponse(invalidData));

      await expect(
          callGeminiApi(mockApiKey, mockCvText, mockJobSpec)
      ).rejects.toThrow("The API response is missing required fields");
  });
});
