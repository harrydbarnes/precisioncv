import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileUpload from "./FileUpload";
import { TooltipProvider } from "@/components/ui/tooltip";
import { describe, it, expect, vi } from "vitest";

// Mock Tooltip components to avoid issues with Radix UI in test environment if needed
// But since we are using vitest with jsdom, it should be fine.
// However, Radix Tooltip often requires ResizeObserver which might be missing.
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("FileUpload Accessibility", () => {
  it("should have accessible clear button when file is selected", async () => {
    render(
      <TooltipProvider>
        <FileUpload
          label="Test Upload"
          onTextExtracted={() => {}}
          onError={() => {}}
          fileName="test-file.pdf"
        />
      </TooltipProvider>
    );

    const clearButton = screen.getByLabelText("Remove file");
    expect(clearButton).toBeInTheDocument();

    // Check if tooltip content is present in the DOM (might be hidden)
    // Radix tooltip content is usually not in DOM until triggered.
  });

  it("should have accessible dropdown trigger and delete button for saved CVs", async () => {
    const user = userEvent.setup();
    const savedCVs = [
      { name: "My CV", content: "test", date: 123 },
    ];

    render(
      <TooltipProvider>
        <FileUpload
          label="Test Upload"
          onTextExtracted={() => {}}
          onError={() => {}}
          savedCVs={savedCVs}
        />
      </TooltipProvider>
    );

    const dropdownTrigger = screen.getByLabelText("Select saved CV");
    expect(dropdownTrigger).toBeInTheDocument();

    await user.click(dropdownTrigger);

    const deleteButton = screen.getByLabelText("Delete My CV");
    expect(deleteButton).toBeInTheDocument();
  });
});
