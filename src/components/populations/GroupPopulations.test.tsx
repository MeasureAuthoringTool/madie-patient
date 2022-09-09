import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import GroupPopulations from "./GroupPopulations";
import {
  GroupPopulation,
  PopulationType,
  MeasureScoring,
} from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

describe("Group Populations", () => {
  it("should render the populations", () => {
    const groupPopulations: GroupPopulation[] = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationValues: [
          {
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: false,
          },
          {
            name: PopulationType.MEASURE_POPULATION,
            expected: false,
            actual: false,
          },
          {
            name: PopulationType.MEASURE_POPULATION_EXCLUSION,
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
        executionRun
        groupPopulations={groupPopulations}
        onChange={handleChange}
        setChangedPopulation={setChangedPopulation}
      />
    );
    const g1MeasureName = screen.getByTestId("measure-group-1");
    expect(g1MeasureName).toBeInTheDocument();
    const g1ScoringName = screen.getByTestId("scoring-unit-1");
    expect(g1ScoringName).toBeInTheDocument();

    const ippRow = screen.getByRole("row", { name: "ipp" });
    expect(ippRow).toBeInTheDocument();
    const ippCell = within(ippRow).getByRole("cell", { name: "ipp" });
    expect(ippCell).toBeInTheDocument();
    const ippCbs = within(ippRow).getAllByRole("checkbox");
    expect(ippCbs[0]).not.toBeDisabled();
    expect(ippCbs[0]).toBeChecked();
    expect(ippCbs[1]).toBeDisabled();
    expect(ippCbs[1]).not.toBeChecked();

    const msrpoplRow = screen.getByTestId(
      "test-row-population-id-measurePopulationExclusion"
    );

    // test-row-population-id-measurePopulationExclusion
    expect(msrpoplRow).toBeInTheDocument();
    const msrpoplCell = within(msrpoplRow).getByText("msrpoplex");
    expect(msrpoplCell).toBeInTheDocument();
    const msrpopl = within(msrpoplRow).getAllByRole("checkbox");
    expect(msrpopl[0]).not.toBeDisabled();
    expect(msrpopl[1]).toBeDisabled();
    expect(msrpopl[0]).not.toBeChecked();
    expect(msrpopl[1]).not.toBeChecked();

    const msrpoplexRow = screen.getByRole("row", { name: "msrpoplex" });
    expect(msrpoplexRow).toBeInTheDocument();
    const msrpoplexCell = within(msrpoplexRow).getByRole("cell", {
      name: "msrpoplex",
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
    render(
      <GroupPopulations
        groupPopulations={null}
        onChange={jest.fn()}
        executionRun
      />
    );
    expect(
      screen.getByText(
        "No populations for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should handle undefined groupPopulation input", () => {
    render(
      <GroupPopulations
        groupPopulations={undefined}
        onChange={jest.fn()}
        executionRun
      />
    );
    expect(
      screen.getByText(
        "No populations for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should handle empty groupPopulation input", () => {
    render(
      <GroupPopulations
        groupPopulations={[]}
        onChange={jest.fn()}
        executionRun
      />
    );
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
            name: PopulationType.INITIAL_POPULATION,
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
        executionRun
        groupPopulations={groupPopulations}
        onChange={handleChange}
        setChangedPopulation={setChangedPopulation}
      />
    );

    const ippRow = screen.getByRole("row", { name: "ipp" });
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
            name: PopulationType.INITIAL_POPULATION,
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
        executionRun
        groupPopulations={groupPopulations}
        onChange={handleChange}
        setChangedPopulation={setChangedPopulation}
      />
    );

    const ippRow = screen.getByRole("row", { name: "ipp" });
    const ippCbs = within(ippRow).getAllByRole("checkbox");
    expect(ippCbs[0]).not.toBeDisabled();
    expect(ippCbs[0]).toBeChecked();
    expect(ippCbs[1]).toBeDisabled();
    expect(ippCbs[1]).toBeChecked();

    userEvent.click(ippCbs[0]);
    expect(handleChange).toHaveBeenNthCalledWith(
      1,
      [
        {
          groupId: "Group1_ID",
          scoring: MeasureScoring.CONTINUOUS_VARIABLE,
          populationValues: [
            {
              name: PopulationType.INITIAL_POPULATION,
              expected: false,
              actual: true,
            },
          ],
        },
      ],
      "Group1_ID",
      { actual: true, expected: false, name: "initialPopulation" }
    );

    userEvent.click(ippCbs[0]);
    expect(handleChange).toHaveBeenNthCalledWith(
      2,
      [
        {
          groupId: "Group1_ID",
          scoring: MeasureScoring.CONTINUOUS_VARIABLE,
          populationValues: [
            {
              name: PopulationType.INITIAL_POPULATION,
              expected: false,
              actual: true,
            },
          ],
        },
      ],
      "Group1_ID",
      { actual: true, expected: false, name: "initialPopulation" }
    );
  });

  it("should display empty on non run", () => {
    const groupPopulations: GroupPopulation[] = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationValues: [
          {
            name: PopulationType.INITIAL_POPULATION,
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
        executionRun={false}
        groupPopulations={groupPopulations}
        onChange={handleChange}
        setChangedPopulation={setChangedPopulation}
      />
    );

    const actualColumn = screen.getByTestId(
      "test-population-initialPopulation-actual"
    );
    expect(actualColumn).toBeInTheDocument();
  });
});
