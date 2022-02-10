import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCasePopulation from "./TestCasePopulation";

describe("TestCasePopulation component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population", async () => {
    const testCasePopulation = {
      id: "k1",
      title: "IPP",
      expected: true,
      actual: true,
    };
    render(
      <MemoryRouter>
        <TestCasePopulation population={testCasePopulation} />
      </MemoryRouter>
    );
    const row = screen.getByTestId(
      `test-row-population-id-${testCasePopulation.id}`
    );
    const columns = row.querySelectorAll("TD");
    expect(columns[1]).toHaveTextContent("IPP");
    const buttons = await screen.findAllByRole("checkbox");
    expect(buttons).toHaveLength(3);
  });
});
