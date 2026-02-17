import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { extractTextFromUrl } from "./extract-text";

describe("extractTextFromUrl Security Tests", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("accepts valid HTTP URLs", async () => {
    const mockResponse = {
      ok: true,
      text: async () => "<html><body>Valid Content</body></html>",
    };
    (global.fetch as Mock).mockResolvedValue(mockResponse);

    const text = await extractTextFromUrl("http://example.com/job");
    expect(text).toBe("Valid Content");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("http%3A%2F%2Fexample.com%2Fjob")
    );
  });

  it("accepts valid HTTPS URLs", async () => {
    const mockResponse = {
      ok: true,
      text: async () => "<html><body>Secure Content</body></html>",
    };
    (global.fetch as Mock).mockResolvedValue(mockResponse);

    const text = await extractTextFromUrl("https://example.com/job");
    expect(text).toBe("Secure Content");
  });

  it("rejects invalid protocols (javascript:)", async () => {
    await expect(extractTextFromUrl("javascript:alert(1)")).rejects.toThrow(
      /Invalid URL protocol/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects invalid protocols (file:)", async () => {
    await expect(extractTextFromUrl("file:///etc/passwd")).rejects.toThrow(
      /Invalid URL protocol/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects loopback address (localhost)", async () => {
    await expect(extractTextFromUrl("http://localhost:3000")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects loopback address (127.0.0.1)", async () => {
    await expect(extractTextFromUrl("http://127.0.0.1:8080")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects loopback address (IPv6 ::1)", async () => {
    await expect(extractTextFromUrl("http://[::1]:8080")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects private IPv4 range (10.x.x.x)", async () => {
    await expect(extractTextFromUrl("http://10.0.0.1/admin")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects private IPv4 range (192.168.x.x)", async () => {
    await expect(extractTextFromUrl("http://192.168.1.1/config")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects private IPv4 range (172.16.x.x - 172.31.x.x)", async () => {
    await expect(extractTextFromUrl("http://172.16.0.1/dashboard")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    await expect(extractTextFromUrl("http://172.31.255.255/dashboard")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects private IPv6 range (fc00::/7)", async () => {
    await expect(extractTextFromUrl("http://[fd00::1]:80")).rejects.toThrow(
      /Access to local network resources is not allowed/i
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("allows domains starting with private IP prefixes (e.g. 10.media.tumblr.com)", async () => {
    const mockResponse = {
      ok: true,
      text: async () => "<html><body>Valid Content</body></html>",
    };
    (global.fetch as Mock).mockResolvedValue(mockResponse);

    const text = await extractTextFromUrl("http://10.media.tumblr.com/post");
    expect(text).toBe("Valid Content");
  });

  it("rejects invalid URLs", async () => {
    await expect(extractTextFromUrl("not-a-url")).rejects.toThrow(
      "The URL you entered is not valid"
    );
  });
});
