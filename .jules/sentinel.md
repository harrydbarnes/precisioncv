## 2025-02-18 - Broken SRI Hash in Production Dependency
**Vulnerability:** The SRI hash for `pdf.worker.min.js` in `index.html` was incorrect, causing the browser to block the script and breaking PDF text extraction.
**Learning:** Hardcoded SRI hashes can become stale if the source file changes or if the hash was copied incorrectly. CDN files are generally immutable, so it likely was an initial copy-paste error.
**Prevention:** Verify SRI hashes by downloading the file and computing the hash locally before committing. Use automated tools to generate SRI hashes.

## 2025-02-18 - Content Security Policy for Vite/React App
**Vulnerability:** Missing CSP allowed potential XSS to load scripts from arbitrary domains.
**Learning:** Strict CSP (`script-src 'self'`) is difficult in development due to Vite's inline scripts. Allowing `'unsafe-inline'` for `script-src` and `style-src` while restricting domains (e.g., `https://cdnjs.cloudflare.com`) provides a balance between security and developer experience without complex build configurations.
**Prevention:** Implement CSP early. Use `'unsafe-inline'` cautiously but prefer it over no CSP.
