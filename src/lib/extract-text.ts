/* Utility functions for extracting text from uploaded files.
 * Uses pdf.js and mammoth.js loaded via CDN (available on window).
 * All processing happens client-side in the browser.
 */

declare global {
  interface Window {
    pdfjsLib: any;
    mammoth: any;
  }
}

/**
 * CORS Proxy URL for fetching external content.
 * WARNING: This uses a public proxy service (CodeTabs).
 * This exposes the requested URL and potentially the content to the third-party service.
 * It is used here for demonstration/client-side-only purposes.
 *
 * SECURITY: In a production environment, this should be replaced with a secure,
 * self-hosted backend proxy to prevent SSRF risks and ensure data privacy.
 * Do NOT use this with sensitive internal URLs or PII.
 */
const CORS_PROXY_URL = "https://api.codetabs.com/v1/proxy?quest=";

// Constants for external libraries
const PDFJS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_INTEGRITY = "sha384-/1qUCSGwTur9vjf/z9lmu/eCUYbpOTgSjmpbMQZ1/CtX2v/WcAIKqRv+U1DUCG6e";
const PDFJS_WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const PDFJS_WORKER_INTEGRITY = "sha384-SnzOobpRMLXZ52iJvZm/C0fYw0OQemTXzTjIsdsfMcrCtCEe9qgzxTd3RSklO5x2";

const MAMMOTH_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
const MAMMOTH_INTEGRITY = "sha384-nFoSjZIoH3CCp8W639jJyQkuPHinJ2NHe7on1xvlUA7SuGfJAfvMldrsoAVm6ECz";

// Helper to load external scripts dynamically
const loadScript = (src: string, integrity?: string, crossorigin: string = "anonymous"): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    if (integrity) script.integrity = integrity;
    if (crossorigin) script.crossOrigin = crossorigin;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

let pdfJsLoadingPromise: Promise<void> | null = null;
let mammothLoadingPromise: Promise<void> | null = null;

async function loadPdfJs() {
  if (window.pdfjsLib) return;

  if (!pdfJsLoadingPromise) {
    pdfJsLoadingPromise = (async () => {
      await loadScript(PDFJS_SRC, PDFJS_INTEGRITY);

      if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        try {
          const response = await fetch(PDFJS_WORKER_SRC, { integrity: PDFJS_WORKER_INTEGRITY });
          if (!response.ok) throw new Error(`Failed to fetch worker: ${response.status}`);
          const blob = await response.blob();
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
        } catch (error) {
          console.error('Failed to set up PDF.js worker with SRI:', error);
        }
      }
    })();
  }
  return pdfJsLoadingPromise;
}

async function loadMammoth() {
  if (window.mammoth) return;

  if (!mammothLoadingPromise) {
    mammothLoadingPromise = loadScript(MAMMOTH_SRC, MAMMOTH_INTEGRITY);
  }
  return mammothLoadingPromise;
}

/** Extract text from a PDF file using pdf.js */
async function extractFromPdf(file: File): Promise<string> {
  await loadPdfJs();
  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) {
    throw new Error("PDF.js library failed to load. Please try again.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

/** Extract text from a DOCX file using mammoth.js */
async function extractFromDocx(file: File): Promise<string> {
  await loadMammoth();
  const mammoth = window.mammoth;
  if (!mammoth) {
    throw new Error("Mammoth.js library failed to load. Please try again.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/** Extract text from a plain text file */
async function extractFromTxt(file: File): Promise<string> {
  return await file.text();
}

/** Extract text from a file based on its extension */
export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    return extractFromPdf(file);
  } else if (name.endsWith(".docx")) {
    return extractFromDocx(file);
  } else if (name.endsWith(".txt")) {
    return extractFromTxt(file);
  }

  throw new Error(
    `Unsupported file type: "${file.name}". Please upload a .pdf, .docx, or .txt file.`
  );
}

/** Fetch text content from a URL via a CORS proxy */
export async function extractTextFromUrl(url: string): Promise<string> {
  if (!url.trim()) {
    throw new Error("Please enter a valid URL.");
  }

  // Validate the URL format and protocol
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("The URL you entered is not valid. Please check and try again.");
  }

  // STRICT SECURITY CHECK: Protocol must be http or https
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error(
      `Invalid URL protocol: "${parsedUrl.protocol}". Only HTTP and HTTPS are allowed.`
    );
  }

  // STRICT SECURITY CHECK: Block loopback/local addresses to prevent SSRF via proxy
  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "169.254.169.254" ||
    hostname === "[::1]" ||
    hostname === "[::]" ||
    hostname.startsWith("127.")
  ) {
    throw new Error("Access to local network resources is not allowed.");
  }

  const proxyUrl = `${CORS_PROXY_URL}${encodeURIComponent(url)}`;

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(
      `Could not fetch the URL. The page may be restricted or unavailable (status: ${response.status}).`
    );
  }

  const html = await response.text();

  // Basic HTML to text extraction: strip tags and decode entities
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Remove script and style elements
  doc.querySelectorAll("script, style, nav, footer, header").forEach((el) => el.remove());

  const text = doc.body?.textContent || "";

  // Clean up whitespace
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();

  if (!cleaned) {
    throw new Error(
      "No readable text could be extracted from the URL. Try pasting the content directly instead."
    );
  }

  return cleaned;
}
