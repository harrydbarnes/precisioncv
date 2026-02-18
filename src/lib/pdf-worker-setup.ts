// Set up PDF.js worker with SRI
// This replaces the inline script in index.html to comply with CSP

const setupPdfWorker = async () => {
  if (typeof window !== "undefined" && window.pdfjsLib) {
    try {
      const workerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const integrity = 'sha384-SnzOobpRMLXZ52iJvZm/C0fYw0OQemTXzTjIsdsfMcrCtCEe9qgzxTd3RSklO5x2';

      const response = await fetch(workerUrl, { integrity });
      if (!response.ok) throw new Error(`Failed to fetch worker: ${response.status}`);

      const blob = await response.blob();
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to set up PDF.js worker with SRI:', error);
    }
  }
};

export default setupPdfWorker;
