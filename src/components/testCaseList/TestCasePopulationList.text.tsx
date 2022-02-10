import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulationList from "./TestCasePopulationList";

describe("TestCasePopulationPopulation component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population list", () => {
    const testCasePopulationsIds = ["k1", "k2"];
    const testCasePopulations = [
      {
        id: "k1",
        title: "IPP",
        expected: true,
        actual: true,
      },
      {
        id: "k2",
        title: "DENOM",
        expected: true,
        actual: true,
      },
    ];
    render(
      <MemoryRouter>
        <TestCasePopulationList />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableHeaders = table.querySelectorAll("thead th");
    expect(tableHeaders[1]).toHaveTextContent("Population");
    expect(tableHeaders[2]).toHaveTextContent("Expected");
    expect(tableHeaders[2]).toHaveTextContent("Actual");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("IPP");
    expect(
      screen.getByTestId(`test-checkbox-id-${testCasePopulationsIds[0]}`)
    ).toBeInTheDocument();

    expect(tableRows[1]).toHaveTextContent("DENOM");
    expect(
      screen.getByTestId(`test-checkbox-id-${testCasePopulationsIds[0]}`)
    ).toBeInTheDocument();
  });
});
