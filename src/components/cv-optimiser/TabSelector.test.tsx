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

    const infoButton = screen.getByLabelText("Information about Option 1");
    expect(infoButton).toBeDisabled();
    expect(infoButton).toHaveClass("disabled:pointer-events-none");
    expect(infoButton).toHaveClass("disabled:opacity-50");
  });
});
