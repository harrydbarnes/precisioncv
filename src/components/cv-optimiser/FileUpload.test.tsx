import { render, screen } from "@testing-library/react";
import FileUpload from "./FileUpload";
import { describe, it, expect } from "vitest";

describe("FileUpload", () => {
  it("should have an accessible file input and show focus styles", () => {
    // Render the component
    render(
      <FileUpload
        label="Test Upload"
        onTextExtracted={() => {}}
        onError={() => {}}
      />
    );

    // The input is wrapped in a label with text "Drop a file here or click to browse"
    const input = screen.getByLabelText(/Drop a file here/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("sr-only");
    expect(input).not.toHaveClass("hidden");

    // Verify focus behavior:
    // When the input is focused, the label (its parent/container) should have
    // the utility class that triggers the ring.
    input.focus();
    const container = input.closest("label");
    expect(container).toBeInTheDocument();

    // We check for the class that defines the focus ring
    expect(container).toHaveClass("focus-within:ring-2");
    expect(container).toHaveClass("focus-within:ring-ring");
  });
});
