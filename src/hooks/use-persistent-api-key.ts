import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function usePersistentApiKey(keyPrefix: string = "gemini") {
  const saveKeyName = `save-${keyPrefix}-key`;
  const keyName = `${keyPrefix}-key`;

  const [saveKey, setSaveKey] = useState(() => {
    if (typeof window === "undefined") {
      return false; // Default to false for security
    }
    // Only true if explicitly set to "true"
    return localStorage.getItem(saveKeyName) === "true";
  });

  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined") return "";

    // Check for existing key in either storage to handle migration or persistence
    // Prioritise based on current preference, but allow fallback during init
    if (localStorage.getItem(saveKeyName) === "true") {
      return localStorage.getItem(keyName) || sessionStorage.getItem(keyName) || "";
    }
    return sessionStorage.getItem(keyName) || localStorage.getItem(keyName) || "";
  });

  const debouncedApiKey = useDebounce(apiKey, 500);

  useEffect(() => {
    localStorage.setItem(saveKeyName, String(saveKey));
  }, [saveKey, saveKeyName]);

  useEffect(() => {
    const targetStorage = saveKey ? localStorage : sessionStorage;
    const otherStorage = saveKey ? sessionStorage : localStorage;

    if (debouncedApiKey) {
      targetStorage.setItem(keyName, debouncedApiKey);
    } else {
      targetStorage.removeItem(keyName);
    }

    // Always clear the other storage to avoid confusion and ensure strict separation
    otherStorage.removeItem(keyName);
  }, [debouncedApiKey, saveKey, keyName]);

  return { apiKey, setApiKey, saveKey, setSaveKey };
}
