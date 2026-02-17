import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Index from "./Index";
import { vi, describe, it, expect, beforeEach } from "vitest";

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
vi.mock("@/hooks/use-debounce", () => ({
  useDebounce: (value: any) => value,
}));

describe("Index API Key Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("loads API key from localStorage if save preference is true", () => {
    // Setup: key saved in localStorage
    localStorage.setItem("save-gemini-key", "true");
    localStorage.setItem("gemini-key", "test-key-123");

    render(<Index />);

    const input = screen.getByTestId("key-input") as HTMLInputElement;
    // Current behavior: fails because it looks at sessionStorage
    expect(input.value).toBe("test-key-123");
  });

  it("saves API key to localStorage when save preference is true", async () => {
    // Setup: preference true
    localStorage.setItem("save-gemini-key", "true");
    render(<Index />);
    const input = screen.getByTestId("key-input") as HTMLInputElement;

    // Simulate typing
    fireEvent.change(input, { target: { value: "new-key-456" } });

    // Expect localStorage to be updated
    await waitFor(() => {
        expect(localStorage.getItem("gemini-key")).toBe("new-key-456");
    });
  });

  it("removes API key from localStorage when save preference is toggled off", async () => {
      // Setup: saved key
      localStorage.setItem("save-gemini-key", "true");
      localStorage.setItem("gemini-key", "key-to-remove");

      render(<Index />);

      const toggle = screen.getByTestId("save-toggle");

      // Toggle off
      fireEvent.click(toggle);

      await waitFor(() => {
          expect(localStorage.getItem("gemini-key")).toBeNull();
      });
  });
});
