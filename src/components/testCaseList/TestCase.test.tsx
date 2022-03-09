import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
          <TestCaseComponent testCase={testCase} />
        </MemoryRouter>
      </tbody>,
      { container: document.body.appendChild(table) }
    );

    const rows = screen.getByTestId(`test-case-row-${testCase.id}`);
    const columns = rows.querySelectorAll("td");
    expect(columns[1]).toHaveTextContent(testCase.title);
    expect(columns[2]).toHaveTextContent(testCase.series);
    expect(columns[3]).toHaveTextContent(testCase.executionStatus);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[1]).toHaveTextContent("Edit");

    expect(
      screen.getByTestId(`arrow-right-icon-${testCase.id}`)
    ).toBeInTheDocument();
  });

  it("should render test case population table opened", async () => {
    render(
      <MemoryRouter>
        <TestCaseComponent testCase={testCase} />
      </MemoryRouter>
    );

    const rows = screen.getByTestId(`test-case-row-${testCase.id}`);
    const columns = rows.querySelectorAll("td");

    expect(columns[1]).toHaveTextContent(testCase.title);
    expect(columns[2]).toHaveTextContent(testCase.series);
    expect(columns[3]).toHaveTextContent(testCase.executionStatus);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[1]).toHaveTextContent("Edit");

    await waitFor(() => {
      const openButton = screen.getByTestId(`open-button-${testCase.id}`);
      fireEvent.click(openButton);
      expect(
        screen.getByTestId(`arrow-up-icon-${testCase.id}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`test-case-population-row-${testCase.id}`)
      ).toBeInTheDocument();
    });
  });

  it("should render test case population table opened and closed", async () => {
    render(
      <MemoryRouter>
        <TestCaseComponent testCase={testCase} />
      </MemoryRouter>
    );
    const rows = screen.getByTestId(`test-case-row-${testCase.id}`);
    const columns = rows.querySelectorAll("td");
    expect(columns[1]).toHaveTextContent(testCase.title);
    expect(columns[2]).toHaveTextContent(testCase.series);
    expect(columns[3]).toHaveTextContent(testCase.executionStatus);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[1]).toHaveTextContent("Edit");

    await waitFor(() => {
      const openButton = screen.getByTestId(`open-button-${testCase.id}`);
      fireEvent.click(openButton);
      expect(
        screen.getByTestId(`arrow-up-icon-${testCase.id}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`test-case-population-row-${testCase.id}`)
      ).toBeInTheDocument();

      fireEvent.click(openButton);
      expect(
        screen.getByTestId(`arrow-right-icon-${testCase.id}`)
      ).toBeInTheDocument();
    });
  });
});
