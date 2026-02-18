import setupPdfWorker from "./pdf-worker-setup";

const loadedScripts = new Set<string>();
const pendingScripts = new Map<string, Promise<void>>();

export const loadScript = (
  src: string,
  integrity?: string,
  crossorigin: string = "anonymous"
): Promise<void> => {
  if (loadedScripts.has(src)) return Promise.resolve();
  if (pendingScripts.has(src)) return pendingScripts.get(src)!;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    if (integrity) script.integrity = integrity;
    script.crossOrigin = crossorigin;

    script.onload = () => {
      loadedScripts.add(src);
      pendingScripts.delete(src);
      resolve();
    };

    script.onerror = () => {
      pendingScripts.delete(src);
      reject(new Error(`Failed to load script ${src}`));
    };

    document.head.appendChild(script);
  });

  pendingScripts.set(src, promise);
  return promise;
};

export const loadPdfJs = async (): Promise<void> => {
  if (typeof window !== "undefined" && window.pdfjsLib) return;

  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    "sha384-/1qUCSGwTur9vjf/z9lmu/eCUYbpOTgSjmpbMQZ1/CtX2v/WcAIKqRv+U1DUCG6e"
  );

  await setupPdfWorker();
};

export const loadMammoth = async (): Promise<void> => {
  if (typeof window !== "undefined" && window.mammoth) return;

  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
    "sha384-nFoSjZIoH3CCp8W639jJyQkuPHinJ2NHe7on1xvlUA7SuGfJAfvMldrsoAVm6ECz"
  );
};
