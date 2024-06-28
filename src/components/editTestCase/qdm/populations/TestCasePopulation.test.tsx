import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulation from "./TestCasePopulation";
import { PopulationType } from "@madie/madie-models";

const error = jest.fn();

describe("TestCasePopulation component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population", async () => {
    const testCasePopulation = {
      id: "1234",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: true,
    };
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              isTestCaseExecuted
              population={testCasePopulation}
              populationResult={testCasePopulation}
              onChange={handleChange}
              populationBasis="true"
              error={error}
              measureObservationsCount={0}
              initialPopulationCount={1}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );
    const row = screen.getByTestId(
      `test-row-population-id-${testCasePopulation.name}`
    );
    const columns = row.querySelectorAll("td");
    expect(columns[1]).toHaveTextContent("Initial Population");
    const buttons = await screen.findAllByRole("checkbox");
    expect(buttons).toHaveLength(2);
  });

  it("should render test case population strat", async () => {
    const testCasePopulation = {
      id: "1234",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: true,
    };
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              isTestCaseExecuted
              population={testCasePopulation}
              populationResult={testCasePopulation}
              strat
              onChange={handleChange}
              populationBasis="true"
              error={error}
              i={0}
              measureObservationsCount={0}
              initialPopulationCount={1}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );
    const row = screen.getByTestId(
      `strat-test-row-population-id-${testCasePopulation.name}-0`
    );
    expect(row).toBeInTheDocument();
    const columns = row.querySelectorAll("td");
    expect(columns[1]).toHaveTextContent("Initial Population");
    const buttons = await screen.findAllByRole("checkbox");
    expect(buttons).toHaveLength(2);
  });

  it("should render test case population strat with error", async () => {
    const testCasePopulation = {
      id: "1234",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: true,
    };
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              isTestCaseExecuted
              population={testCasePopulation}
              populationResult={testCasePopulation}
              strat
              onChange={handleChange}
              populationBasis="true"
              error={{ expected: "expected?" }}
              i={0}
              measureObservationsCount={0}
              initialPopulationCount={1}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );
    const row = screen.getByTestId(
      `strat-test-row-population-id-${testCasePopulation.name}-0`
    );
    expect(row).toBeInTheDocument();
    expect(
      screen.getByTestId("initialPopulation-error-helper-text")
    ).toBeInTheDocument();
    // const buttons = await screen.findAllByRole("checkbox");
    // expect(buttons).toHaveLength(2);
  });

  it("should handle changes to checkboxes", async () => {
    const testCasePopulation = {
      id: "1234",
      name: PopulationType.INITIAL_POPULATION,
      expected: false,
      actual: false,
    };
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              isTestCaseExecuted
              population={testCasePopulation}
              populationResult={testCasePopulation}
              onChange={handleChange}
              populationBasis="true"
              error={error}
              measureObservationsCount={0}
              initialPopulationCount={1}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );
    const ippExpected = screen.getByTestId(
      "test-population-initialPopulation-expected"
    );
    const ippActual = screen.getByTestId(
      "test-population-initialPopulation-actual"
    );
    expect(ippExpected).toBeInTheDocument();
    expect(ippActual).toBeInTheDocument();
    expect(ippExpected).not.toBeChecked();
    expect(ippActual).not.toBeChecked();
    // actuall will always be disabled.
    // userEvent.click(ippActual);
    // expect(handleChange).toBeCalledWith({
    //   name: PopulationType.INITIAL_POPULATION,
    //   expected: false,
    //   actual: true,
    // });
  });

  it("Should display CV populationNameTemplate as Measure Observation 1 when measureObservationsCount is bigger than 0", async () => {
    const testCasePopulation = {
      id: "1",
      name: PopulationType.MEASURE_POPULATION_OBSERVATION,
      expected: true,
      actual: false,
    };
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              isTestCaseExecuted
              population={testCasePopulation}
              onChange={handleChange}
              populationBasis="true"
              error={error}
              measureObservationsCount={1}
              initialPopulationCount={1}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );

    const row = screen.getByTestId(
      `test-row-population-id-${testCasePopulation.name}`
    );
    const columns = row.querySelectorAll("td");
    expect(columns[1]).toHaveTextContent("Measure Observation 1");
  });

  it("Should display CV populationNameTemplate as Measure Observation 1 when measureObservationsCount is not bigger than 0", async () => {
    const testCasePopulation = {
      id: "1",
      name: PopulationType.MEASURE_POPULATION_OBSERVATION,
      expected: true,
      actual: false,
    };
    const handleChange = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              isTestCaseExecuted
              population={testCasePopulation}
              onChange={handleChange}
              populationBasis="true"
              error={error}
              measureObservationsCount={0}
              initialPopulationCount={1}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );

    const row = screen.getByTestId(
      `test-row-population-id-${testCasePopulation.name}`
    );
    const columns = row.querySelectorAll("td");
    expect(columns[1]).toHaveTextContent("Measure Observation");
  });
});
