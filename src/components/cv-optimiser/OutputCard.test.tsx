import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OutputCard from "./OutputCard";

// Mock ResizeObserver for Popover/Radix UI/Framer Motion
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("OutputCard", () => {
  it("renders diff with accessible labels for screen readers", () => {
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

    // We expect "Removed: Original" and "Added: Modified" text to be present (hidden or visible)
    // Using getAllByText with exact: false allows finding substrings
    const removedLabels = screen.queryAllByText(/Removed:/i);
    const addedLabels = screen.queryAllByText(/Added:/i);

    // This should fail initially as these labels are not implemented
    expect(removedLabels.length).toBeGreaterThan(0);
    expect(addedLabels.length).toBeGreaterThan(0);
  });
});
