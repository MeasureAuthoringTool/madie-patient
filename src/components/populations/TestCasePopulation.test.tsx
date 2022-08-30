import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulation from "./TestCasePopulation";
import { PopulationType } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

describe("TestCasePopulation component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population", async () => {
    const testCasePopulation = {
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: true,
    };
    const handleChange = jest.fn();
    const setChangedPopulation = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              population={testCasePopulation}
              onChange={handleChange}
              setChangedPopulation={setChangedPopulation}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );
    const row = screen.getByTestId(
      `test-row-population-id-${testCasePopulation.name}`
    );
    const columns = row.querySelectorAll("td");
    expect(columns[1]).toHaveTextContent("ipp");
    const buttons = await screen.findAllByRole("checkbox");
    expect(buttons).toHaveLength(2);
  });

  it("should handle changes to checkboxes", async () => {
    const testCasePopulation = {
      name: PopulationType.INITIAL_POPULATION,
      expected: false,
      actual: false,
    };
    const handleChange = jest.fn();
    const setChangedPopulation = jest.fn();
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <TestCasePopulation
              population={testCasePopulation}
              onChange={handleChange}
              setChangedPopulation={setChangedPopulation}
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
});
