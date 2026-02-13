import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileUpload from "./FileUpload";
import { describe, it, expect } from "vitest";

describe("FileUpload", () => {
  it("should have an accessible file input that is focusable", async () => {
    // Setup userEvent
    const user = userEvent.setup();

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

    // Simulate user tabbing to the input element.
    // Since it's the first focusable element rendered in this test, one tab should reach it.
    await user.tab();

    // Verify that the input element has received focus. This confirms it's part
    // of the tab order and accessible via keyboard.
    expect(input).toHaveFocus();
  });
});
