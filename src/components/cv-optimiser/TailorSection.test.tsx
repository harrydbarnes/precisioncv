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
    const selectedStyles: any = ["Precision"]; // 'Precision' is selected

    render(
      <TailorSection
        keywords=""
        setKeywords={setKeywords}
        selectedStyles={selectedStyles}
        setSelectedStyles={setSelectedStyles}
      />
    );

    // Find the containers by data-testid
    const precisionContainer = screen.getByTestId("style-option-Precision");
    const ruthlessContainer = screen.getByTestId("style-option-Ruthless");

    expect(precisionContainer).toBeInTheDocument();
    expect(ruthlessContainer).toBeInTheDocument();

    // The selected container (Precision) SHOULD have the prominent style (bg-hero-500)
    expect(precisionContainer).toHaveClass("bg-hero-500");

    // The unselected container (Ruthless) SHOULD NOT have the prominent style
    expect(ruthlessContainer).not.toHaveClass("bg-hero-500");
  });
});
