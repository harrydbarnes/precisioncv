import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OutputCard from "./OutputCard";

// Mock ResizeObserver for Popover/Radix UI/Framer Motion
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("OutputCard", () => {
  it("renders diff with accessible labels for screen readers", async () => {
    const originalText = "Original content";
    const newText = "Modified content";

    render(
      <OutputCard
        title="Test Card"
        icon={<span>Icon</span>}
        content={newText}
        copyText={newText}
        index={0}
        originalText={originalText}
      />
    );

    // Find and click "Show Changes" button
    const toggleButton = screen.getByRole("button", { name: /Show Changes/i });
    fireEvent.click(toggleButton);

    // Verify accessible labels are present
    // diffWords("Original content", "Modified content") likely produces:
    // - "Original" (removed)
    // - "Modified" (added)
    // - " content" (common)

    // We expect "Removed: Original" and "Added: Modified" text to be present for screen readers.
    // By checking the parent element's text content, we can verify the full accessible string.
    // Wait for the async diff calculation to complete
    await waitFor(() => {
      const removedPart = screen.getByText("Original");
      expect(removedPart.parentElement).toHaveTextContent("Removed: Original");
    });

    const addedPart = screen.getByText("Modified");
    expect(addedPart.parentElement).toHaveTextContent("Added: Modified");
  });
});
