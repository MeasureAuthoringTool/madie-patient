import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TruncateTextComponent from "./TruncateText";

describe("TruncateText component", () => {
  it("should render original value", () => {
    const description = "TestDescription";
    const name = "title";
    const testCaseId = "testcaseid";

    const tableRow = document.createElement("tr");
    const { container, getByText, getByTestId, getByTitle } = render(
      <MemoryRouter>
        <TruncateTextComponent
          text={description}
          maxLength={60}
          name={name}
          dataTestId={`test-case-title-${testCaseId}`}
        />
      </MemoryRouter>,
      { container: document.body.appendChild(tableRow) }
    );
    screen.debug();

    expect(container).toBeTruthy();
    expect(getByText(description)).toBeInTheDocument();
    expect(getByTestId("test-case-title-testcaseid")).toBeInTheDocument();
    expect(getByTitle(name)).toBeInTheDocument();
  });

  it("should render truncated value", async () => {
    const description =
      "TestDescriptionTestDescriptionTestDescriptionTestDescriptionTestDescription";
    const name = "series";
    const testCaseId = "testcaseid";

    const tableRow = document.createElement("tr");
    const { container } = render(
      <MemoryRouter>
        <TruncateTextComponent
          text={description}
          maxLength={60}
          name={name}
          dataTestId={`test-case-series-${testCaseId}`}
        />
      </MemoryRouter>,
      { container: document.body.appendChild(tableRow) }
    );

    expect(container).toBeTruthy();
    const button = screen.getByTestId("test-case-series-testcaseid");
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
