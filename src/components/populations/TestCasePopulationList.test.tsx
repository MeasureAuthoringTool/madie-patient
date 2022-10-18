import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulationList, {
  determineGroupResult,
} from "./TestCasePopulationList";
import { DisplayPopulationValue, PopulationType } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

describe("TestCasePopulationPopulation component", () => {
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
          populationBasis="Boolean"
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
    expect(tableRows[0]).toHaveTextContent("ipp");
    // expect(
    //   screen.getByTestId(`test-population-icon-${testCasePopulations[0].name}`)
    // ).toBeInTheDocument();

    expect(tableRows[1]).toHaveTextContent("denom");
    // expect(
    //   screen.getByTestId(`test-population-icon-${testCasePopulations[1].name}`)
    // ).toBeInTheDocument();

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
          populationBasis="Boolean"
          content="population"
          i={0}
          scoring="Proportion"
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("ipp");
    expect(tableRows[1]).toHaveTextContent("denom");
    expect(tableRows[2]).toHaveTextContent("observ");

    const ippCb = screen.getByTestId(
      "test-population-initialPopulation-expected"
    );
    expect(ippCb).toBeInTheDocument();
    userEvent.click(ippCb);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
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
        id: "3",
        name: PopulationType.NUMERATOR,
        expected: 1,
        actual: 1,
      },
      {
        id: "4",
        name: "measureObservation",
        expected: 1,
        actual: 1,
      },
      {
        id: "5",
        name: "measureObservation",
        expected: 2,
        actual: 2,
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
          populationBasis="Boolean"
          content="ratio"
          i={0}
          scoring="Ratio"
        />
      </MemoryRouter>
    );
    const table = screen.getByTestId("test-case-population-list-tbl");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent("ipp");
    expect(tableRows[1]).toHaveTextContent("denom");
    expect(tableRows[2]).toHaveTextContent("num");
    expect(tableRows[3]).toHaveTextContent("observ");
    expect(tableRows[4]).toHaveTextContent("observ");
  });
});

describe("determineGroupResult", () => {
  it("should return initial for missing executionRun input", () => {
    const output = determineGroupResult("Boolean", [], undefined);
    expect(output).toEqual("initial");
  });

  it("should return initial for null executionRun input", () => {
    const output = determineGroupResult("Boolean", [], null);
    expect(output).toEqual("initial");
  });

  it("should return initial for false executionRun input", () => {
    const output = determineGroupResult("Boolean", [], false);
    expect(output).toEqual("initial");
  });

  it("should return pass for empty populations for boolean PopBasis", () => {
    const output = determineGroupResult("Boolean", [], true);
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
