import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseComponent from "./TestCase";

describe("TestCase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case status as executed", async () => {
    const testCase = {
      id: "ID1",
      title: "TEST IPP",
      description: "TEST DESCRIPTION",
      series: "TEST SERIES",
      executionStatus: "pass",
    };
    render(
      <MemoryRouter>
        <TestCaseComponent
          testCase={testCase}
          children={null}
          setActiveItem={null}
          activeItem={null}
          index={testCase.id}
          isExecuteButtonClicked={true}
        />
      </MemoryRouter>
    );
    const row = screen.getByTestId(`test-case-row-${testCase.id}`);
    const columns = row.querySelectorAll("TD");
    expect(columns[0]).toHaveTextContent("TEST IPP");
    expect(columns[1]).toHaveTextContent("TEST SERIES");
    expect(columns[2]).toHaveTextContent("pass");
    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("pass");
    expect(buttons[1]).toHaveTextContent("Edit");
  });

  it("should render test case status as not executed", async () => {
    const testCase = {
      id: "ID1",
      title: "TEST IPP",
      description: "TEST DESCRIPTION",
      series: "TEST SERIES",
      executionStatus: "NA",
    };
    render(
      <MemoryRouter>
        <TestCaseComponent
          testCase={testCase}
          children={null}
          setActiveItem={null}
          activeItem={null}
          index={testCase.id}
          isExecuteButtonClicked={false}
        />
      </MemoryRouter>
    );
    const row = screen.getByTestId(`test-case-row-${testCase.id}`);
    const columns = row.querySelectorAll("td");
    expect(columns[0]).toHaveTextContent("TEST IPP");
    expect(columns[1]).toHaveTextContent("TEST SERIES");
    expect(columns[2]).toHaveTextContent("NA");
    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("Edit");
  });
});
