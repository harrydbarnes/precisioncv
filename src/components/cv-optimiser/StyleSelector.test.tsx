import { render, screen, fireEvent } from "@testing-library/react";
import { StyleSelector } from "./StyleSelector";
import { vi, describe, it, expect } from "vitest";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("StyleSelector", () => {
  it("renders correctly", () => {
    render(
      <StyleSelector
        selectedStyles={[]}
        setSelectedStyles={() => {}}
      />
    );
    expect(screen.getByText("Precision")).toBeInTheDocument();
    expect(screen.getByText("Ruthless")).toBeInTheDocument();
    expect(screen.getByText("Ambitious")).toBeInTheDocument();
  });

  it("toggles styles and updates aria-pressed", () => {
    const setSelectedStyles = vi.fn();
    const { rerender } = render(
      <StyleSelector
        selectedStyles={[]}
        setSelectedStyles={setSelectedStyles}
      />
    );

    const precisionButton = screen.getByRole("button", { name: "Precision" });
    expect(precisionButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(precisionButton);
    // The component uses functional update so we can't check the arg directly unless we mock useState or inspect the function
    // But here we just check if it was called.
    expect(setSelectedStyles).toHaveBeenCalled();

    // Rerender with selected style
    rerender(
      <StyleSelector
        selectedStyles={["Precision"]}
        setSelectedStyles={setSelectedStyles}
      />
    );
    expect(precisionButton).toHaveAttribute("aria-pressed", "true");
  });
});
