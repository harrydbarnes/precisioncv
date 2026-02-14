import { render, screen } from "@testing-library/react";
import TailorSection from "./TailorSection";
import { vi, describe, it, expect, beforeAll } from "vitest";

describe("TailorSection", () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("renders with correct selected styles", () => {
    const setKeywords = vi.fn();
    const setSelectedStyles = vi.fn();
    const selectedStyles = ["Precision"]; // 'Precision' is selected

    render(
      <TailorSection
        keywords=""
        setKeywords={setKeywords}
        selectedStyles={selectedStyles as any}
        setSelectedStyles={setSelectedStyles}
      />
    );

    // Find the 'Precision' button
    const precisionButton = screen.getByText("Precision").closest("button");
    const ruthlessButton = screen.getByText("Ruthless").closest("button");

    expect(precisionButton).toBeInTheDocument();
    expect(ruthlessButton).toBeInTheDocument();

    // The selected button (Precision) SHOULD have the prominent style (bg-hero-500)
    // Currently (bugged), it does NOT have it.
    // So this assertion is expected to FAIL until the bug is fixed.
    expect(precisionButton).toHaveClass("bg-hero-500");

    // The unselected button (Ruthless) SHOULD NOT have the prominent style
    // Currently (bugged), it HAS it.
    expect(ruthlessButton).not.toHaveClass("bg-hero-500");
  });
});
