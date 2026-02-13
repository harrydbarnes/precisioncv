import { render, screen } from "@testing-library/react";
import FileUpload from "./FileUpload";
import { describe, it, expect } from "vitest";

describe("FileUpload", () => {
  it("should have an accessible file input", () => {
    // Render the component
    render(
      <FileUpload
        label="Test Upload"
        onTextExtracted={() => {}}
        onError={() => {}}
      />
    );

    // The input is wrapped in a label with text "Drop a file here or click to browse"
    // We use that text to find the input.
    const input = screen.getByLabelText(/Drop a file here/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("sr-only");
    expect(input).not.toHaveClass("hidden");
  });
});
