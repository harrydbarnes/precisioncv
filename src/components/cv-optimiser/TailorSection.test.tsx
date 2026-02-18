import { render, screen, fireEvent } from "@testing-library/react";
import TailorSection from "./TailorSection";
import { vi, describe, it, expect, beforeAll } from "vitest";
import { TailorStyle } from "@/lib/gemini-api";

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
    const setCoverLetterStyle = vi.fn();
    const setApiWorkload = vi.fn();
    const selectedStyles: TailorStyle[] = ["Precision"]; // 'Precision' is selected

    render(
      <TailorSection
        keywords=""
        setKeywords={setKeywords}
        selectedStyles={selectedStyles}
        setSelectedStyles={setSelectedStyles}
        coverLetterStyle="Middle"
        setCoverLetterStyle={setCoverLetterStyle}
        apiWorkload="Normal"
        setApiWorkload={setApiWorkload}
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

  it("calls setCoverLetterStyle when a cover letter style is selected", () => {
    const setCoverLetterStyle = vi.fn();

    render(
      <TailorSection
        keywords=""
        setKeywords={vi.fn()}
        selectedStyles={[]}
        setSelectedStyles={vi.fn()}
        coverLetterStyle="Middle"
        setCoverLetterStyle={setCoverLetterStyle}
        apiWorkload="Normal"
        setApiWorkload={vi.fn()}
      />
    );

    const quickOption = screen.getByRole("tab", { name: "Quick" });
    fireEvent.click(quickOption);
    expect(setCoverLetterStyle).toHaveBeenCalledWith("Short");
  });

  it("calls setApiWorkload when an API workload is selected", () => {
    const setApiWorkload = vi.fn();

    render(
      <TailorSection
        keywords=""
        setKeywords={vi.fn()}
        selectedStyles={[]}
        setSelectedStyles={vi.fn()}
        coverLetterStyle="Middle"
        setCoverLetterStyle={vi.fn()}
        apiWorkload="Normal"
        setApiWorkload={setApiWorkload}
      />
    );

    const reducedOption = screen.getByRole("tab", { name: "Reduced" });
    fireEvent.click(reducedOption);
    expect(setApiWorkload).toHaveBeenCalledWith("Reduced");
  });
});
