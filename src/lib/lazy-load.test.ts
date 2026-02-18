import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to mock setupPdfWorker before importing lazy-load
vi.mock("./pdf-worker-setup", () => ({
  default: vi.fn(),
}));

// We'll import these dynamically to allow module reset if needed,
// but for now let's just use static imports and manage state carefully.
import { loadScript, loadPdfJs, loadMammoth } from "./lazy-load";
import setupPdfWorker from "./pdf-worker-setup";

describe("lazy-load", () => {
  let scriptElement: Partial<HTMLScriptElement>;

  beforeEach(() => {
    vi.clearAllMocks();

    scriptElement = {
      src: "",
      integrity: "",
      crossOrigin: "",
      onload: null,
      onerror: null,
    };

    vi.spyOn(document, "createElement").mockReturnValue(scriptElement as any);
    vi.spyOn(document.head, "appendChild").mockImplementation(() => scriptElement as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loadScript creates a script tag and resolves on load", async () => {
    const url = "https://example.com/script-1.js";
    const promise = loadScript(url, "sha-hash");

    expect(document.createElement).toHaveBeenCalledWith("script");
    expect(scriptElement.src).toBe(url);
    expect(scriptElement.integrity).toBe("sha-hash");
    expect(document.head.appendChild).toHaveBeenCalled();

    // Simulate onload
    if (scriptElement.onload) {
      // @ts-ignore
      scriptElement.onload(new Event("load"));
    }

    await expect(promise).resolves.toBeUndefined();
  });

  it("loadScript rejects on error", async () => {
    const url = "https://example.com/error.js";
    const promise = loadScript(url);

    // Simulate onerror
    if (scriptElement.onerror) {
      // @ts-ignore
      scriptElement.onerror(new Event("error"));
    }

    await expect(promise).rejects.toThrow(`Failed to load script ${url}`);
  });

  it("loadScript reuses pending promise", async () => {
    const url = "https://example.com/concurrent.js";
    const promise1 = loadScript(url);
    const promise2 = loadScript(url);

    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(promise1).toBe(promise2);

    if (scriptElement.onload) {
        // @ts-ignore
        scriptElement.onload(new Event("load"));
    }
    await promise1;
  });

  it("loadPdfJs loads PDF.js and calls setupPdfWorker", async () => {
    // Ensure window.pdfjsLib is undefined initially
    // @ts-ignore
    delete window.pdfjsLib;

    const promise = loadPdfJs();

    // Simulate script load
    if (scriptElement.onload) {
        // @ts-ignore
        scriptElement.onload(new Event("load"));
    }

    await promise;

    expect(document.createElement).toHaveBeenCalledWith("script");
    expect(scriptElement.src).toContain("pdf.min.js");
    expect(setupPdfWorker).toHaveBeenCalled();
  });

  it("loadMammoth loads Mammoth.js", async () => {
    // Ensure window.mammoth is undefined initially
    // @ts-ignore
    delete window.mammoth;

    const promise = loadMammoth();

    // Simulate script load
    if (scriptElement.onload) {
        // @ts-ignore
        scriptElement.onload(new Event("load"));
    }

    await promise;

    expect(document.createElement).toHaveBeenCalledWith("script");
    expect(scriptElement.src).toContain("mammoth.browser.min.js");
  });
});
