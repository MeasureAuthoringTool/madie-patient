import React from "react";
import { render, screen, within } from "@testing-library/react";
import GroupPopulations from "./GroupPopulations";
import { GroupPopulation } from "../../models/TestCase";
import { MeasurePopulation } from "../../models/MeasurePopulation";
import userEvent from "@testing-library/user-event";
import { MeasureScoring } from "../../models/MeasureScoring";

describe("Group Populations", () => {
  it("should render the populations", () => {
    const groupPopulations: GroupPopulation[] = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationValues: [
          {
            name: MeasurePopulation.INITIAL_POPULATION,
            expected: true,
            actual: false,
          },
          {
            name: MeasurePopulation.MEASURE_POPULATION,
            expected: false,
            actual: false,
          },
          {
            name: MeasurePopulation.MEASURE_POPULATION_EXCLUSION,
            expected: false,
            actual: false,
          },
        ],
      },
    ];
    const handleChange = jest.fn();
    const setChangedPopulation = jest.fn();
    render(
      <GroupPopulations
        disableActual={true}
        groupPopulations={groupPopulations}
        onChange={handleChange}
        setChangedPopulation={setChangedPopulation}
      />
    );

    const populationValuesLabel = screen.getByText(
      "Group 1 (Continuous Variable) Population Values"
    );
    expect(populationValuesLabel).toBeInTheDocument();

    const ippRow = screen.getByRole("row", { name: "IPP" });
    expect(ippRow).toBeInTheDocument();
    const ippCell = within(ippRow).getByRole("cell", { name: "IPP" });
    expect(ippCell).toBeInTheDocument();
    const ippCbs = within(ippRow).getAllByRole("checkbox");
    expect(ippCbs[0]).not.toBeDisabled();
    expect(ippCbs[0]).toBeChecked();
    expect(ippCbs[1]).toBeDisabled();
    expect(ippCbs[1]).not.toBeChecked();

    const msrpoplRow = screen.getByRole("row", { name: "MSRPOPL" });
    expect(msrpoplRow).toBeInTheDocument();
    const msrpoplCell = within(msrpoplRow).getByRole("cell", {
      name: "MSRPOPL",
    });
    expect(msrpoplCell).toBeInTheDocument();
    const msrpopl = within(msrpoplRow).getAllByRole("checkbox");
    expect(msrpopl[0]).not.toBeDisabled();
    expect(msrpopl[1]).toBeDisabled();
    expect(msrpopl[0]).not.toBeChecked();
    expect(msrpopl[1]).not.toBeChecked();

    const msrpoplexRow = screen.getByRole("row", { name: "MSRPOPLEX" });
    expect(msrpoplexRow).toBeInTheDocument();
    const msrpoplexCell = within(msrpoplexRow).getByRole("cell", {
      name: "MSRPOPLEX",
    });
    expect(msrpoplexCell).toBeInTheDocument();
    const msrpoplexCbs = within(msrpoplexRow).getAllByRole("checkbox");
    expect(msrpoplexCbs[0]).not.toBeDisabled();
    expect(msrpoplexCbs[1]).toBeDisabled();
    expect(msrpoplexCbs[0]).not.toBeChecked();
    expect(msrpoplexCbs[1]).not.toBeChecked();

    const allCheckboxes = screen.getAllByRole("checkbox");
    expect(allCheckboxes).toHaveLength(6);
  });

  it("should handle null groupPopulation input", () => {
    render(<GroupPopulations groupPopulations={null} onChange={jest.fn()} />);
    expect(
      screen.getByText(
        "No populations for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should handle undefined groupPopulation input", () => {
    render(
      <GroupPopulations groupPopulations={undefined} onChange={jest.fn()} />
    );
    expect(
      screen.getByText(
        "No populations for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should handle empty groupPopulation input", () => {
    render(<GroupPopulations groupPopulations={[]} onChange={jest.fn()} />);
    expect(
      screen.getByText(
        "No populations for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should render the populations with both checkboxes disabled", () => {
    const groupPopulations: GroupPopulation[] = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.COHORT,
        populationValues: [
          {
            name: MeasurePopulation.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ],
      },
    ];
    const handleChange = jest.fn();
    const setChangedPopulation = jest.fn();
    render(
      <GroupPopulations
        disableActual={true}
        disableExpected={true}
        groupPopulations={groupPopulations}
        onChange={handleChange}
        setChangedPopulation={setChangedPopulation}
      />
    );

    const ippRow = screen.getByRole("row", { name: "IPP" });
    const ippCbs = within(ippRow).getAllByRole("checkbox");
    expect(ippCbs[0]).toBeDisabled();
    expect(ippCbs[0]).toBeChecked();
    expect(ippCbs[1]).toBeDisabled();
    expect(ippCbs[1]).toBeChecked();
  });

  it("should handle checkbox changes", () => {
    const groupPopulations: GroupPopulation[] = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationValues: [
          {
            name: MeasurePopulation.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ],
      },
    ];
    const handleChange = jest.fn();
    const setChangedPopulation = jest.fn();
    render(
      <GroupPopulations
        groupPopulations={groupPopulations}
        onChange={handleChange}
        setChangedPopulation={setChangedPopulation}
      />
    );

    const ippRow = screen.getByRole("row", { name: "IPP" });
    const ippCbs = within(ippRow).getAllByRole("checkbox");
    expect(ippCbs[0]).not.toBeDisabled();
    expect(ippCbs[0]).toBeChecked();
    expect(ippCbs[1]).not.toBeDisabled();
    expect(ippCbs[1]).toBeChecked();

    userEvent.click(ippCbs[0]);
    expect(handleChange).toHaveBeenCalledWith([
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationValues: [
          {
            name: MeasurePopulation.INITIAL_POPULATION,
            expected: false,
            actual: true,
          },
        ],
      },
    ]);

    userEvent.click(ippCbs[1]);
    expect(handleChange).toHaveBeenCalledWith([
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationValues: [
          {
            name: MeasurePopulation.INITIAL_POPULATION,
            expected: false,
            actual: false,
          },
        ],
      },
    ]);
  });
});
