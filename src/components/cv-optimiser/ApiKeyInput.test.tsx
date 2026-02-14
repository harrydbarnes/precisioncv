import { render, screen } from "@testing-library/react";
import ApiKeyInput from "./ApiKeyInput";
import { TooltipProvider } from "@/components/ui/tooltip";

describe("ApiKeyInput", () => {
  it("renders an accessible button for the API key help tooltip", () => {
    render(
      <TooltipProvider>
        <ApiKeyInput
          value=""
          onChange={() => {}}
          saveKey={false}
          onSaveKeyChange={() => {}}
        />
      </TooltipProvider>
    );

    // Verify that the help icon is wrapped in an accessible button
    const helpButton = screen.getByRole("button", {
      name: /where to find your api key/i,
    });
    expect(helpButton).toBeInTheDocument();
  });
});
