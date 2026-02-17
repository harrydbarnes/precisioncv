import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function usePersistentApiKey() {
  const [saveKey, setSaveKey] = useState(() => {
    if (typeof window === "undefined") {
      return false; // Default to false for security
    }
    // Only true if explicitly set to "true"
    return localStorage.getItem("save-gemini-key") === "true";
  });

  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined") return "";

    // Check for existing key in either storage to handle migration or persistence
    // Prioritise based on current preference, but allow fallback during init
    if (localStorage.getItem("save-gemini-key") === "true") {
      return localStorage.getItem("gemini-key") || sessionStorage.getItem("gemini-key") || "";
    }
    return sessionStorage.getItem("gemini-key") || localStorage.getItem("gemini-key") || "";
  });

  const debouncedApiKey = useDebounce(apiKey, 500);

  useEffect(() => {
    localStorage.setItem("save-gemini-key", String(saveKey));
  }, [saveKey]);

  useEffect(() => {
    const targetStorage = saveKey ? localStorage : sessionStorage;
    const otherStorage = saveKey ? sessionStorage : localStorage;

    if (debouncedApiKey) {
      targetStorage.setItem("gemini-key", debouncedApiKey);
    } else {
      targetStorage.removeItem("gemini-key");
    }

    // Always clear the other storage to avoid confusion and ensure strict separation
    otherStorage.removeItem("gemini-key");
  }, [debouncedApiKey, saveKey]);

  return { apiKey, setApiKey, saveKey, setSaveKey };
}
