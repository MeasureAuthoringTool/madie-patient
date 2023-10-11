import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulationList, {
  determineGroupResult,
  determineGroupResultStratification,
} from "./TestCasePopulationList";
import {
  DisplayPopulationValue,
  DisplayStratificationValue,
  MeasureScoring,
  PopulationType,
} from "@madie/madie-models";
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
          i={0}
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
    const setChangedPopulation = jest.fn();
    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          onChange={handleChange}
          disableExpected={false}
          populationBasis="true"
          content="population"
          i={0}
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
    const testCaseStratifications = [
      {
        id: "1",
        name: "Strata-1 Initial Population",
        expected: true,
        actual: true,
      },
    ];
    const handleChange = jest.fn();
    const handleStratificationChange = jest.fn();

    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          stratifications={testCaseStratifications}
          onChange={handleChange}
          onStratificationChange={handleStratificationChange}
          disableExpected={false}
          populationBasis="true"
          content="population"
          i={0}
          scoring="Proportion"
        />
      </MemoryRouter>
    );

    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("Initial Population");

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
    const testCaseStratifications = [
      {
        id: "1",
        name: "Strata-1 Initial Population",
        expected: true,
        actual: true,
      },
    ];
    const handleChange = jest.fn();
    const handleStratificationChange = jest.fn();

    render(
      <MemoryRouter>
        <TestCasePopulationList
          populations={testCasePopulations}
          stratifications={testCaseStratifications}
          onChange={handleChange}
          onStratificationChange={handleStratificationChange}
          disableExpected={false}
          populationBasis="true"
          content="population"
          i={0}
          scoring="Proportion"
          executionRun={true}
        />
      </MemoryRouter>
    );

    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("Initial Population");

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
          i={0}
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
        name: PopulationType.INITIAL_POPULATION + " " + 1,
        expected: 2,
        actual: 2,
      },
      {
        id: "9",
        name: PopulationType.INITIAL_POPULATION + " " + 2,
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
          i={0}
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
          i={0}
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

describe("determineGroupResult", () => {
  it("should return initial for missing executionRun input", () => {
    const output = determineGroupResult("boolean", [], undefined);
    expect(output).toEqual("initial");
  });

  it("should return initial for null executionRun input", () => {
    const output = determineGroupResult("boolean", [], null);
    expect(output).toEqual("initial");
  });

  it("should return initial for false executionRun input", () => {
    const output = determineGroupResult("boolean", [], false);
    expect(output).toEqual("initial");
  });

  it("should return pass for empty populations for boolean PopBasis", () => {
    const output = determineGroupResult("boolean", [], true);
    expect(output).toEqual("pass");
  });

  it("should return pass for empty populations for non-boolean PopBasis", () => {
    const output = determineGroupResult("Encounter", [], true);
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (true) for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: true,
        expected: true,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: true,
        expected: true,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: true,
        expected: true,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (false) for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: false,
        expected: false,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: false,
        expected: false,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (false) for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: false,
        expected: undefined,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: false,
        expected: undefined,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("pass");
  });

  it("should return fail for non-matching populations values for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: true,
        expected: false,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: false,
        expected: undefined,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("fail");
  });

  it("should return fail for non-matching populations values for boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: true,
        expected: true,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: false,
        expected: false,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: true,
        expected: false,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("fail");
  });

  it("should return pass for matching populations values for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: 0,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 1,
        expected: 1,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (undefined) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: undefined,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 0,
        expected: undefined,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("pass");
  });

  it("should return pass for matching populations values (empty) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: null,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 0,
        expected: "" as any,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("pass");
  });

  it("should return fail for matching populations values (zero) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 0,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("fail");
  });

  it("should return fail for matching populations values (undefined) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 1,
        expected: undefined,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("fail");
  });

  it("should return fail for matching populations values (empty) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 1,
        expected: "" as any,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("fail");
  });

  it("should return pass for matching populations values (empty) for non-boolean PopBasis", () => {
    const populations: DisplayPopulationValue[] = [
      {
        id: "1",
        name: PopulationType.INITIAL_POPULATION,
        actual: 2,
        expected: 2,
      },
      {
        id: "2",
        name: PopulationType.DENOMINATOR,
        actual: 0,
        expected: null,
      },
      {
        id: "3",
        name: PopulationType.NUMERATOR,
        actual: 1,
        expected: 1,
      },
      {
        id: "4",
        name: PopulationType.DENOMINATOR_EXCLUSION,
        actual: "" as any,
        expected: undefined,
      },
    ];
    const output = determineGroupResult("Encounter", populations, true);
    expect(output).toEqual("pass");
  });
});
