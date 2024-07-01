import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulationList from "./TestCasePopulationList";
import { MeasureScoring, PopulationType } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

describe("TestCasePopulationList component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population list", () => {
    const testCasePopulations = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        expected: true,
        actual: true,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        expected: true,
        actual: true,
      },
    ];
    render(
      <MemoryRouter>
        <TestCasePopulationList
          populationBasis="boolean"
          populations={testCasePopulations}
          content="population"
          groupIndex={0}
          scoring="Proportion"
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableHeaders = table.querySelectorAll("thead th");
    expect(tableHeaders[1]).toHaveTextContent("Population");
    expect(tableHeaders[2]).toHaveTextContent("Expected");
    expect(tableHeaders[3]).toHaveTextContent("Actual");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("Initial Population");

    expect(tableRows[1]).toHaveTextContent("Denominator");

    const ippCb = screen.getByTestId(
      "test-population-initialPopulation-expected"
    );
    expect(ippCb).toBeInTheDocument();
    userEvent.click(ippCb);
  });

  it("should handle changes for the test case population", async () => {
    const testCasePopulations = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        expected: true,
        actual: true,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        expected: true,
        actual: true,
      },
      {
        id: "3",
        name: PopulationType.MEASURE_OBSERVATION,
        expected: true,
        actual: true,
      },
    ];
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          onChange={handleChange}
          disableExpected={false}
          populationBasis="true"
          content="population"
          groupIndex={0}
          scoring="Proportion"
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("Initial Population");
    expect(tableRows[1]).toHaveTextContent("Denominator");
    expect(tableRows[2]).toHaveTextContent("Measure Observation");

    const ippCb = screen.getByTestId(
      "test-population-initialPopulation-expected"
    );
    expect(ippCb).toBeInTheDocument();
    userEvent.click(ippCb);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });

  it("should handle stratification changes for the test case population", async () => {
    const testCasePopulations = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        expected: true,
        actual: true,
      },
    ];
    const testCaseStratification = {
      id: "1",
      name: "Strata-1 Initial Population",
      expected: true,
      actual: true,
    };
    const handleChange = jest.fn();
    const handleStratificationChange = jest.fn();

    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          stratification={testCaseStratification}
          stratResult={testCaseStratification}
          onChange={handleChange}
          onStratificationChange={handleStratificationChange}
          disableExpected={false}
          populationBasis="true"
          content="population"
          groupIndex={0}
          scoring="Proportion"
        />
      </MemoryRouter>
    );

    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[1]).toHaveTextContent("Initial Population");

    const ippCb = screen.getByTestId(
      "test-population-Strata-1 Initial Population-expected-0"
    );
    expect(ippCb).toBeInTheDocument();
    userEvent.click(ippCb);
    await waitFor(() => {
      expect(handleStratificationChange).toHaveBeenCalled();
    });
  });

  it("should handle stratification changes for the test case population with executionRun", async () => {
    const testCasePopulations = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        expected: true,
        actual: true,
      },
    ];
    const testCaseStratification = {
      id: "1",
      name: "Strata-1 Initial Population",
      expected: true,
      actual: true,
    };
    const handleChange = jest.fn();
    const handleStratificationChange = jest.fn();

    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          stratification={testCaseStratification}
          stratResult={testCaseStratification}
          onChange={handleChange}
          onStratificationChange={handleStratificationChange}
          disableExpected={false}
          populationBasis="true"
          content="population"
          groupIndex={0}
          scoring="Proportion"
          isTestCaseExecuted={true}
        />
      </MemoryRouter>
    );

    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[1]).toHaveTextContent("Initial Population");

    const ippCb = screen.getByTestId(
      "test-population-Strata-1 Initial Population-expected-0"
    );
    expect(ippCb).toBeInTheDocument();
    userEvent.click(ippCb);
    await waitFor(() => {
      expect(handleStratificationChange).toHaveBeenCalled();
    });
  });

  it("should render ratio observations", async () => {
    const testCasePopulations = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        expected: 2,
        actual: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        expected: 1,
        actual: 1,
      },
      {
        id: "4",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 1,
        actual: 1,
      },
      {
        id: "5",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 2,
        actual: 2,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        expected: 1,
        actual: 1,
      },
      {
        id: "6",
        name: PopulationType.NUMERATOR_OBSERVATION,
        expected: 1,
        actual: 1,
      },
      {
        id: "7",
        name: PopulationType.INITIAL_POPULATION,
        expected: 1,
        actual: 1,
      },
    ];
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          onChange={handleChange}
          disableExpected={false}
          populationBasis="boolean"
          content="ratio"
          groupIndex={0}
          scoring={MeasureScoring.RATIO}
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("Initial Population");
    expect(tableRows[1]).toHaveTextContent("Denominator");
    expect(tableRows[2]).toHaveTextContent("Denominator Observation 1");
    expect(tableRows[3]).toHaveTextContent("Denominator Observation 2");
    expect(tableRows[4]).toHaveTextContent("Numerator");
    expect(tableRows[5]).toHaveTextContent("Numerator Observation");
  });

  it("should render ratio observations with two IP's", async () => {
    const testCasePopulations = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        expected: 2,
        actual: 2,
      },
      {
        id: "9",
        name: PopulationType.INITIAL_POPULATION,
        expected: 2,
        actual: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        expected: 1,
        actual: 1,
      },
      {
        id: "4",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 1,
        actual: 1,
      },
      {
        id: "5",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 2,
        actual: 2,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        expected: 1,
        actual: 1,
      },
      {
        id: "6",
        name: PopulationType.NUMERATOR_OBSERVATION,
        expected: 1,
        actual: 1,
      },
      {
        id: "7",
        name: PopulationType.NUMERATOR_OBSERVATION,
        expected: 1,
        actual: 1,
      },
    ];
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          onChange={handleChange}
          disableExpected={false}
          populationBasis="boolean"
          content="ratio"
          groupIndex={0}
          scoring={MeasureScoring.RATIO}
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("Initial Population 1");
    expect(tableRows[1]).toHaveTextContent("Initial Population 2");
    expect(tableRows[2]).toHaveTextContent("Denominator");
    expect(tableRows[3]).toHaveTextContent("Denominator Observation 1");
    expect(tableRows[4]).toHaveTextContent("Denominator Observation 2");
    expect(tableRows[5]).toHaveTextContent("Numerator");
    expect(tableRows[6]).toHaveTextContent("Numerator Observation 1");
    expect(tableRows[7]).toHaveTextContent("Numerator Observation 2");
  });

  it("should render CV observations", async () => {
    const testCasePopulations = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        expected: 2,
        actual: 2,
      },
      {
        id: "2",
        name: PopulationType.MEASURE_POPULATION,
        expected: 1,
        actual: 1,
      },
      {
        id: "4",
        name: PopulationType.MEASURE_POPULATION_OBSERVATION,
        expected: 1,
        actual: 1,
      },
      {
        id: "5",
        name: PopulationType.MEASURE_POPULATION_OBSERVATION,
        expected: 2,
        actual: 2,
      },
    ];
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          onChange={handleChange}
          disableExpected={false}
          populationBasis="boolean"
          content="ratio"
          groupIndex={0}
          scoring={MeasureScoring.CONTINUOUS_VARIABLE}
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("Initial Population");
    expect(tableRows[1]).toHaveTextContent("Measure Population");
    expect(tableRows[2]).toHaveTextContent("Measure Observation 1");
    expect(tableRows[3]).toHaveTextContent("Measure Observation 2");
  });
});
