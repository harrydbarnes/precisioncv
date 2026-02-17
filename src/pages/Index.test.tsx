import { render, screen, fireEvent, act } from "@testing-library/react";
import Index from "./Index";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock dependencies
vi.mock("@/components/cv-optimiser/Header", () => ({ default: () => <div data-testid="header" /> }));
vi.mock("@/components/cv-optimiser/ApiKeyInput", () => ({
  default: ({ value, onChange, saveKey, onSaveKeyChange }: any) => (
    <div data-testid="api-key-input">
      <input
        data-testid="key-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button data-testid="save-toggle" onClick={() => onSaveKeyChange(!saveKey)}>
        Toggle Save
      </button>
      <span data-testid="save-status">{saveKey ? "Saved" : "Not Saved"}</span>
    </div>
  ),
}));
vi.mock("@/components/cv-optimiser/FileUpload", () => ({ default: () => <div /> }));
vi.mock("@/components/cv-optimiser/JobSpecInput", () => ({ default: () => <div /> }));
vi.mock("@/components/cv-optimiser/TailorSection", () => ({ default: () => <div /> }));
vi.mock("@/components/cv-optimiser/GenerateButton", () => ({ default: () => <div /> }));
vi.mock("@/components/cv-optimiser/ResultsDisplay", () => ({ default: () => <div /> }));
vi.mock("@/components/Footer", () => ({ default: () => <div /> }));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn(), dismiss: vi.fn(), toasts: [] }),
}));
// REMOVED: Mock for useDebounce to allow real timer testing

describe("Index API Key Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("loads API key from localStorage if save preference is true", () => {
    // Setup: key saved in localStorage
    localStorage.setItem("save-gemini-key", "true");
    localStorage.setItem("gemini-key", "test-key-123");

    render(<Index />);

    const input = screen.getByTestId("key-input") as HTMLInputElement;
    expect(input.value).toBe("test-key-123");
  });

  it("saves API key to localStorage when save preference is true after debounce", () => {
    // Setup: preference true
    localStorage.setItem("save-gemini-key", "true");
    render(<Index />);
    const input = screen.getByTestId("key-input") as HTMLInputElement;

    // Simulate typing
    fireEvent.change(input, { target: { value: "new-key-456" } });

    // Should NOT be saved immediately (debounce 500ms)
    expect(localStorage.getItem("gemini-key")).not.toBe("new-key-456");

    // Fast-forward time
    act(() => {
        vi.advanceTimersByTime(500);
    });

    // Expect localStorage to be updated immediately after timer fires and effect runs
    expect(localStorage.getItem("gemini-key")).toBe("new-key-456");
  });

  it("saves API key to sessionStorage when save preference is false (default)", () => {
     render(<Index />);
     const input = screen.getByTestId("key-input") as HTMLInputElement;

     // Simulate typing
     fireEvent.change(input, { target: { value: "session-only-key" } });

     // Fast-forward time
     act(() => {
         vi.advanceTimersByTime(500);
     });

     expect(sessionStorage.getItem("gemini-key")).toBe("session-only-key");
     expect(localStorage.getItem("gemini-key")).toBeNull();
  });

  it("removes API key from localStorage when save preference is toggled off", () => {
      // Setup: saved key in local
      localStorage.setItem("save-gemini-key", "true");
      localStorage.setItem("gemini-key", "key-to-move");

      render(<Index />);

      // Ensure it loaded correctly
      const input = screen.getByTestId("key-input") as HTMLInputElement;
      expect(input.value).toBe("key-to-move");

      const toggle = screen.getByTestId("save-toggle");

      // Toggle off
      fireEvent.click(toggle);

      // Effect runs immediately on preference change
      expect(localStorage.getItem("gemini-key")).toBeNull();
      expect(sessionStorage.getItem("gemini-key")).toBe("key-to-move");
  });
});
