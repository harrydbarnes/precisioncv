import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { extractTextFromUrl, extractTextFromFile } from "./extract-text";
import * as lazyLoad from "./lazy-load";

vi.mock("./lazy-load", () => ({
  loadPdfJs: vi.fn(),
  loadMammoth: vi.fn(),
}));

describe("extractTextFromFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore window properties
    // @ts-ignore
    delete global.window.pdfjsLib;
    // @ts-ignore
    delete global.window.mammoth;
  });

  it("extracts text from PDF (lazy loads pdf.js)", async () => {
    const file = new File(["dummy pdf content"], "test.pdf", { type: "application/pdf" });
    file.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(10));

    // Mock pdfjsLib
    const mockPdf = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: "PDF Content" }],
        }),
      }),
    };

    (global.window as any).pdfjsLib = {
      getDocument: vi.fn().mockReturnValue({
        promise: Promise.resolve(mockPdf),
      }),
    };

    const text = await extractTextFromFile(file);

    expect(lazyLoad.loadPdfJs).toHaveBeenCalled();
    expect(text).toBe("PDF Content");
  });

  it("extracts text from DOCX (lazy loads mammoth.js)", async () => {
    const file = new File(["dummy docx content"], "test.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    file.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(10));

    // Mock mammoth
    (global.window as any).mammoth = {
      extractRawText: vi.fn().mockResolvedValue({ value: "DOCX Content" }),
    };

    const text = await extractTextFromFile(file);

    expect(lazyLoad.loadMammoth).toHaveBeenCalled();
    expect(text).toBe("DOCX Content");
  });

  it("extracts text from TXT (no lazy load)", async () => {
    const file = new File(["TXT Content"], "test.txt", { type: "text/plain" });
    file.text = vi.fn().mockResolvedValue("TXT Content");

    const text = await extractTextFromFile(file);

    expect(lazyLoad.loadPdfJs).not.toHaveBeenCalled();
    expect(lazyLoad.loadMammoth).not.toHaveBeenCalled();
    expect(text).toBe("TXT Content");
  });
});

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
