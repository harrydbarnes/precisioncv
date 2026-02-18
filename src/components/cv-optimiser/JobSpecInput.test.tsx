import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobSpecInput from "./JobSpecInput";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock FileUpload to simplify testing
vi.mock("./FileUpload", () => ({
  default: ({ label, onTextExtracted }: { label: string; onTextExtracted: (text: string) => void }) => (
    <div data-testid="file-upload">
      <p>{label}</p>
      <button onClick={() => onTextExtracted("File content extracted")}>
        Simulate Upload
      </button>
    </div>
  ),
}));

// Mock extractTextFromUrl
vi.mock("@/lib/extract-text", () => ({
  extractTextFromUrl: vi.fn().mockResolvedValue("URL content extracted"),
}));

describe("JobSpecInput", () => {
  const mockOnChange = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default Text tab active", () => {
    render(
      <JobSpecInput
        value=""
        onChange={mockOnChange}
        onError={mockOnError}
      />
    );

    // Textarea should be visible
    expect(screen.getByPlaceholderText("Paste the job specification here...")).toBeInTheDocument();

    // Check tabs are present
    expect(screen.getByRole("tab", { name: /Paste Text/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Upload File/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /From URL/i })).toBeInTheDocument();
  });

  it("switches to Upload File tab", async () => {
    render(
      <JobSpecInput
        value=""
        onChange={mockOnChange}
        onError={mockOnError}
      />
    );

    const fileTab = screen.getByRole("tab", { name: /Upload File/i });
    fireEvent.click(fileTab);

    await waitFor(() => {
      expect(screen.getByTestId("file-upload")).toBeInTheDocument();
    });

    // Check content of FileUpload
    expect(screen.getByText("Job Spec File")).toBeInTheDocument();
  });

  it("switches to From URL tab", async () => {
    render(
      <JobSpecInput
        value=""
        onChange={mockOnChange}
        onError={mockOnError}
      />
    );

    const urlTab = screen.getByRole("tab", { name: /From URL/i });
    fireEvent.click(urlTab);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("https://example.com/job-posting")).toBeInTheDocument();
    });
  });

  it("calls onChange when typing in text area", () => {
    render(
      <JobSpecInput
        value=""
        onChange={mockOnChange}
        onError={mockOnError}
      />
    );

    const textarea = screen.getByPlaceholderText("Paste the job specification here...");
    fireEvent.change(textarea, { target: { value: "New job spec" } });

    expect(mockOnChange).toHaveBeenCalledWith("New job spec");
  });
});
