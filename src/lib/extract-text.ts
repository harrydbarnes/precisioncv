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

/** Extract text from a PDF file using pdf.js */
async function extractFromPdf(file: File): Promise<string> {
  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) {
    throw new Error("PDF.js library not loaded. Please refresh the page and try again.");
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
  const mammoth = window.mammoth;
  if (!mammoth) {
    throw new Error("Mammoth.js library not loaded. Please refresh the page and try again.");
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

  // Check for private IPv4 ranges:
  // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16 (Link-Local)
  // Ensure it looks like an IP address to avoid false positives on domains (e.g. 10.media.tumblr.com)
  const isIpV4 = /^[\d.]+$/.test(hostname);
  const isPrivateIp =
    isIpV4 &&
    (/^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      /^169\.254\./.test(hostname));

  // Check for IPv6 Unique Local Addresses (fc00::/7)
  // Covers fc00:: and fd00:: (ipv6 addresses in URLs are wrapped in [])
  const isUniqueLocalIpv6 = /^\[f[cd][0-9a-f]{2}:/i.test(hostname);

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]" ||
    hostname === "[::]" ||
    hostname.startsWith("127.") ||
    isPrivateIp ||
    isUniqueLocalIpv6
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
