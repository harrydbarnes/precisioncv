import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileUpload from "./FileUpload";
import { describe, it, expect } from "vitest";

describe("FileUpload", () => {
  it("should have an accessible file input that is focusable", async () => {
    const user = userEvent.setup();

    render(
      <FileUpload
        label="Test Upload"
        onTextExtracted={() => {}}
        onError={() => {}}
        selectedModel="gemini"
      />
    );

    const input = screen.getByLabelText(/Drop a file here/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("sr-only");
    expect(input).not.toHaveClass("hidden");

    await user.tab();

    expect(input).toHaveFocus();
  });
});
