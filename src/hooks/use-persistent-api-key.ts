import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function usePersistentApiKey() {
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined") return "";
    const shouldSave = localStorage.getItem("save-gemini-key") !== "false";
    if (shouldSave) {
      return localStorage.getItem("gemini-key") || sessionStorage.getItem("gemini-key") || "";
    }
    return sessionStorage.getItem("gemini-key") || "";
  });

  const [saveKey, setSaveKey] = useState(() => {
    if (typeof window === "undefined") {
      return true; // Default to true on the server
    }
    return localStorage.getItem("save-gemini-key") !== "false";
  });

  const debouncedApiKey = useDebounce(apiKey, 500);

  useEffect(() => {
    localStorage.setItem("save-gemini-key", String(saveKey));
  }, [saveKey]);

  useEffect(() => {
    if (saveKey && debouncedApiKey) {
      localStorage.setItem("gemini-key", debouncedApiKey);
    } else {
      localStorage.removeItem("gemini-key");
    }
    // always clear session storage to avoid confusion/duplication
    sessionStorage.removeItem("gemini-key");
  }, [debouncedApiKey, saveKey]);

  return { apiKey, setApiKey, saveKey, setSaveKey };
}
