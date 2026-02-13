import { describe, it, expect, vi, afterEach } from 'vitest';
import { callGeminiApi } from '@/lib/gemini-api';

// Mock global fetch
global.fetch = vi.fn();

describe('callGeminiApi', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should pass the API key in the x-goog-api-key header and NOT in the URL', async () => {
    const apiKey = 'test-api-key-12345';
    const cvText = 'Test CV Content';
    const jobSpecText = 'Test Job Spec Content';

    // Mock successful response
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  tailored_cv: 'Optimised CV',
                  cover_letter: 'Cover Letter',
                  interview_qna: [],
                  industry_updates: [],
                }),
              },
            ],
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      text: async () => '',
    });

    try {
      await callGeminiApi(apiKey, cvText, jobSpecText);
    } catch (error) {
      // Ignore errors related to response parsing if any, focus on the fetch call
      console.error(error);
    }

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const callArgs = (global.fetch as any).mock.calls[0];
    const url = callArgs[0];
    const options = callArgs[1];

    // Security Check 1: API Key should NOT be in the URL query string
    expect(url).not.toContain(`key=${apiKey}`);

    // Security Check 2: API Key SHOULD be in the headers
    expect(options.headers).toBeDefined();
    // Headers can be Headers object or plain object. Assuming plain object here as used in fetch call.
    expect(options.headers['x-goog-api-key']).toBe(apiKey);
  });
});
