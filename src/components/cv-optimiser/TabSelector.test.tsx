import { render, screen } from "@testing-library/react";
import { TabSelector } from "./TabSelector";
import { vi, describe, it, expect, beforeAll } from "vitest";

describe("TabSelector", () => {
  beforeAll(() => {
    // Mock ResizeObserver for Popover/Tooltip if needed
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("disables info button when component is disabled", () => {
    const options = [
      { id: "opt1", label: "Option 1", description: "Description 1" }
    ];
    const onChange = vi.fn();

    render(
      <TabSelector
        options={options}
        value="opt1"
        onChange={onChange}
        disabled={true}
        layoutId="test-layout"
      />
    );

    // Verify info button is functionally disabled
    const infoButton = screen.getByLabelText("Information about Option 1");
    expect(infoButton).toBeDisabled();

    // Verify main tab button is also disabled
    const mainButton = screen.getByRole('button', { name: 'Option 1' });
    expect(mainButton).toBeDisabled();

    // Verify parent container does not apply nested opacity
    const parent = screen.getByTestId("tab-selector");
    expect(parent).not.toHaveClass("opacity-50");
  });
});
