import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulationList from "./TestCasePopulationList";
import { PopulationType } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

describe("TestCasePopulationPopulation component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population list", () => {
    const testCasePopulations = [
      {
        name: PopulationType.INITIAL_POPULATION,
        expected: true,
        actual: true,
      },
      {
        name: PopulationType.DENOMINATOR,
        expected: true,
        actual: true,
      },
    ];
    render(
      <MemoryRouter>
        <TestCasePopulationList populations={testCasePopulations} />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableHeaders = table.querySelectorAll("thead th");
    expect(tableHeaders[1]).toHaveTextContent("Population");
    expect(tableHeaders[2]).toHaveTextContent("Expected");
    expect(tableHeaders[3]).toHaveTextContent("Actual");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("IPP");
    expect(
      screen.getByTestId(`test-population-icon-${testCasePopulations[0].name}`)
    ).toBeInTheDocument();

    expect(tableRows[1]).toHaveTextContent("DENOM");
    expect(
      screen.getByTestId(`test-population-icon-${testCasePopulations[1].name}`)
    ).toBeInTheDocument();

    const ippCb = screen.getByTestId(
      "test-population-initialPopulation-expected"
    );
    expect(ippCb).toBeInTheDocument();
    userEvent.click(ippCb);
  });

  it("should handle changes for the test case population", async () => {
    const testCasePopulations = [
      {
        name: PopulationType.INITIAL_POPULATION,
        expected: true,
        actual: true,
      },
      {
        name: PopulationType.DENOMINATOR,
        expected: true,
        actual: true,
      },
    ];
    const handleChange = jest.fn();
    const setChangedPopulation = jest.fn();
    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          onChange={handleChange}
          disableExpected={false}
          setChangedPopulation={setChangedPopulation}
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("IPP");
    expect(tableRows[1]).toHaveTextContent("DENOM");

    const ippCb = screen.getByTestId(
      "test-population-initialPopulation-expected"
    );
    expect(ippCb).toBeInTheDocument();
    userEvent.click(ippCb);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
