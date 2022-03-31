import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TruncateTextComponent from "./TruncateText";

describe("TruncateText component", () => {
  it("should render original value", () => {
    const description = "TestDescription";
    const name = "title";
    const testCaseId = "testcaseid";

    const { container, getByText } = render(
      <MemoryRouter>
        <TruncateTextComponent
          text={description}
          maxLength={60}
          name={name}
          dataTestId={`test-case-title-${testCaseId}`}
        />
      </MemoryRouter>
    );

    expect(container).toBeTruthy();
    expect(getByText(description)).toBeInTheDocument();
  });

  it("should render truncated value", async () => {
    const description =
      "TestDescriptionTestDescriptionTestDescriptionTestDescriptionTestDescription";
    const name = "series";
    const testCaseId = "testcaseid";

    const { container } = render(
      <MemoryRouter>
        <TruncateTextComponent
          text={description}
          maxLength={60}
          name={name}
          dataTestId={`test-case-series-${testCaseId}`}
        />
      </MemoryRouter>
    );

    expect(container).toBeTruthy();
    const button = await screen.findByTestId(
      "test-case-series-testcaseid-button"
    );
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(description.substring(0, 60));

    fireEvent.mouseMove(button);
    expect(
      screen.getByRole("button", {
        name: description,
        hidden: true,
      })
    ).toBeVisible();
  });
});
