import * as React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import GroupPopulations from "./GroupPopulations";
import {
  GroupPopulation,
  PopulationType,
  MeasureScoring,
} from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

const errors = jest.fn();

jest.mock("formik", () => ({
  useField: jest.fn(),
  useFormikContext: jest
    .fn()
    .mockReturnValue({ isValidating: false, setFieldValue: () => {} }),
}));

describe("Group Populations", () => {
  let testCaseGroups: GroupPopulation[];
  beforeEach(() => {
    testCaseGroups = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.COHORT,
        populationBasis: "true",
        populationValues: [
          {
            id: "123",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: false,
          },
        ],
        stratificationValues: [
          {
            id: "321",
            name: "strata-1 Initial Population",
            expected: true,
            actual: false,
          },
        ],
      },
    ];
  });

  it("should render the populations", () => {
    const groupPopulations: GroupPopulation[] = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationBasis: "true",
        stratificationValues: [],
        populationValues: [
          {
            id: "1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: false,
            criteriaReference: null,
          },
          {
            id: "2",
            name: PopulationType.MEASURE_POPULATION,
            expected: false,
            actual: false,
            criteriaReference: null,
          },
          {
            id: "3",
            name: PopulationType.MEASURE_POPULATION_EXCLUSION,
            expected: false,
            actual: false,
            criteriaReference: null,
          },
        ],
      },
    ];
    const handleChange = jest.fn();
    render(
      <GroupPopulations
        disableExpected={false}
        isTestCaseExecuted={true}
        groupPopulations={groupPopulations}
        testCaseResults={groupPopulations}
        onChange={handleChange}
        errors={errors}
      />
    );
    const g1MeasureName = screen.getByTestId("measure-group-1");
    expect(g1MeasureName).toBeInTheDocument();
    const g1ScoringName = screen.getByTestId("measure-group-1-scoring-unit-1");
    expect(g1ScoringName).toBeInTheDocument();

    const ippRow = screen.getByRole("row", { name: "Initial Population" });
    expect(ippRow).toBeInTheDocument();
    const ippCell = within(ippRow).getByRole("cell", {
      name: "Initial Population",
    });
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
    const msrpoplCell = within(msrpoplRow).getByText(
      "Measure Population Exclusion"
    );
    expect(msrpoplCell).toBeInTheDocument();
    const msrpopl = within(msrpoplRow).getAllByRole("checkbox");
    expect(msrpopl[0]).not.toBeDisabled();
    expect(msrpopl[1]).toBeDisabled();
    expect(msrpopl[0]).not.toBeChecked();
    expect(msrpopl[1]).not.toBeChecked();

    const msrpoplexRow = screen.getByRole("row", {
      name: "Measure Population Exclusion",
    });
    expect(msrpoplexRow).toBeInTheDocument();
    const msrpoplexCell = within(msrpoplexRow).getByRole("cell", {
      name: "Measure Population Exclusion",
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
        disableExpected={false}
        isTestCaseExecuted={true}
        testCaseResults={[]}
        groupPopulations={[]}
        onChange={jest.fn()}
        errors={errors}
      />
    );
    expect(
      screen.getByText(
        "No data for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should handle undefined groupPopulation input", () => {
    render(
      <GroupPopulations
        disableExpected={false}
        isTestCaseExecuted={true}
        testCaseResults={[]}
        groupPopulations={undefined}
        onChange={jest.fn()}
        errors={errors}
      />
    );
    expect(
      screen.getByText(
        "No data for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should handle empty groupPopulation input", () => {
    render(
      <GroupPopulations
        disableExpected={false}
        isTestCaseExecuted={true}
        testCaseResults={[]}
        groupPopulations={[]}
        onChange={jest.fn()}
        errors={errors}
      />
    );
    expect(
      screen.getByText(
        "No data for current scoring. Please make sure at least one measure group has been created."
      )
    ).toBeInTheDocument();
  });

  it("should render the populations with both checkboxes disabled", () => {
    const handleChange = jest.fn();
    render(
      <GroupPopulations
        disableExpected={true}
        isTestCaseExecuted={true}
        groupPopulations={testCaseGroups}
        testCaseResults={testCaseGroups}
        onChange={handleChange}
        errors={errors}
      />
    );

    const ippRow = screen.getByRole("row", { name: "Initial Population" });
    const ippCbs = within(ippRow).getAllByRole("checkbox");
    expect(ippCbs[0]).toBeDisabled();
    expect(ippCbs[0]).toBeChecked();
    expect(ippCbs[1]).toBeDisabled();
    expect(ippCbs[1]).not.toBeChecked();
  });

  it("should handle checkbox changes", () => {
    testCaseGroups[0].scoring = MeasureScoring.CONTINUOUS_VARIABLE;
    const handleChange = jest.fn();
    const updatedTestCaseGroups = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationBasis: "true",
        populationValues: [
          {
            id: "123",
            name: PopulationType.INITIAL_POPULATION,
            expected: false,
            actual: false,
          },
        ],
        stratificationValues: [
          {
            id: "321",
            name: "strata-1 Initial Population",
            expected: true,
            actual: false,
          },
        ],
      },
    ];
    render(
      <GroupPopulations
        disableExpected={false}
        isTestCaseExecuted={true}
        testCaseResults={testCaseGroups}
        groupPopulations={testCaseGroups}
        onChange={handleChange}
        errors={errors}
      />
    );

    const ippRow = screen.getByRole("row", { name: "Initial Population" });
    const ippCbs = within(ippRow).getAllByRole("checkbox");
    expect(ippCbs[0]).not.toBeDisabled();
    expect(ippCbs[0]).toBeChecked();
    expect(ippCbs[1]).toBeDisabled();
    expect(ippCbs[1]).not.toBeChecked();

    userEvent.click(ippCbs[0]);
    expect(handleChange).toHaveBeenNthCalledWith(
      1,
      updatedTestCaseGroups,
      "Group1_ID",
      { actual: false, expected: false, id: "123", name: "initialPopulation" }
    );
  });

  it("should display empty on non run", () => {
    const handleChange = jest.fn();
    render(
      <GroupPopulations
        disableExpected={false}
        isTestCaseExecuted={false}
        testCaseResults={testCaseGroups}
        groupPopulations={testCaseGroups}
        onChange={handleChange}
        errors={errors}
      />
    );
    const actualColumn = screen.queryByTestId(
      "test-population-initialPopulation-actual-0"
    );
    expect(actualColumn).not.toBeInTheDocument();
  });

  it("should not display stratifications", () => {
    const groupPopulations: GroupPopulation[] = [
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.COHORT,
        populationBasis: "true",
        populationValues: [
          {
            id: "1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: false,
            criteriaReference: "",
          },
        ],
        stratificationValues: [],
      },
    ];
    const handleChange = jest.fn();
    render(
      <GroupPopulations
        disableExpected={false}
        isTestCaseExecuted={false}
        testCaseResults={[]}
        groupPopulations={groupPopulations}
        onChange={handleChange}
        errors={errors}
      />
    );

    const strat = screen.queryByTestId("measure-group-1-stratifications");
    expect(strat).not.toBeInTheDocument();
  });

  it("test trigger stratification change", async () => {
    const handleChange = jest.fn();
    render(
      <GroupPopulations
        disableExpected={false}
        isTestCaseExecuted={false}
        testCaseResults={testCaseGroups}
        groupPopulations={testCaseGroups}
        onChange={handleChange}
        errors={errors}
      />
    );

    const strat1Input = screen.getByTestId(
      "test-population-strata-1 Initial Population-expected-0"
    ) as HTMLInputElement;
    expect(strat1Input).toBeInTheDocument();
    expect(strat1Input.checked).toBe(true);

    fireEvent.change(strat1Input, { target: { value: "false" } });
  });
});
