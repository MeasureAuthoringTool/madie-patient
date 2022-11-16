import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseComponent from "./TestCase";

describe("TestCase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCase = {
    id: "ID1",
    title: "TEST IPP",
    description: "TEST DESCRIPTION",
    series: "TEST SERIES",
    executionStatus: "pass",
  };

  it("should render test case population table not opened", async () => {
    const table = document.createElement("table");
    render(
      <tbody>
        <MemoryRouter>
          <TestCaseComponent testCase={testCase} canEdit={true} />
        </MemoryRouter>
      </tbody>,
      { container: document.body.appendChild(table) }
    );

    const rows = await screen.findByTestId(`test-case-row-${testCase.id}`);
    const columns = rows.querySelectorAll("td");
    expect(columns[0]).toHaveTextContent("Pass");
    expect(columns[1]).toHaveTextContent(testCase.series);
    expect(columns[2]).toHaveTextContent(testCase.title);
    expect(columns[3]).toHaveTextContent(testCase.description);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("Select");
  });
});
