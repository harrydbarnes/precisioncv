import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GenerateButton from "./GenerateButton";

// Mock ResizeObserver for Popover/Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("GenerateButton", () => {
  it("renders 'Generate' when not loading", () => {
    render(<GenerateButton loading={false} missingRequirements={[]} onGenerate={() => {}} />);
    expect(screen.getByText("Generate")).toBeInTheDocument();
    expect(screen.queryByText("Generating...")).not.toBeInTheDocument();
  });

  it("renders 'Generating...' when loading", () => {
    render(<GenerateButton loading={true} missingRequirements={[]} onGenerate={() => {}} />);
    expect(screen.getByText("Generating...")).toBeInTheDocument();
    expect(screen.queryByText("Generate")).not.toBeInTheDocument();
  });

  it("is disabled when loading", () => {
    render(<GenerateButton loading={true} missingRequirements={[]} onGenerate={() => {}} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when there are missing requirements", () => {
    render(<GenerateButton loading={false} missingRequirements={["API Key"]} onGenerate={() => {}} />);
    // The button inside the popover trigger is disabled
    // But Radix PopoverTrigger might change how it's rendered.
    // However, our code wraps the disabled button in a div which is the trigger.
    // We should find the button itself.
    const button = screen.getByRole("button", { name: "Generate" });
    expect(button).toBeDisabled();
  });

  it("calls onGenerate when clicked and enabled", () => {
    const onGenerate = vi.fn();
    render(<GenerateButton loading={false} missingRequirements={[]} onGenerate={onGenerate} />);
    fireEvent.click(screen.getByText("Generate"));
    expect(onGenerate).toHaveBeenCalledTimes(1);
  });
});
