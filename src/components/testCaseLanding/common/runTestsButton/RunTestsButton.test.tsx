import * as React from "react";
import RunTestsButton from "./RunTestsButton";
import { render, screen } from "@testing-library/react";
import {
  Measure,
  MeasureScoring,
  Model,
  PopulationType,
  AggregateFunctionType,
} from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

const onRunTests = jest.fn();
const measureWithNoObservNoStrats = {
  id: "testMeasureId",
  scoring: MeasureScoring.COHORT,
  model: Model.QDM_5_6,
  createdBy: "testUserOwner",
  patientBasis: true,
  groups: [
    {
      id: "test_groupId",
      scoring: MeasureScoring.COHORT,
      populations: [
        {
          id: "4f0a1989-205f-45df-a476-8e19999d21c7",
          name: PopulationType.INITIAL_POPULATION,
          definition: "IP",
        },
      ],
      populationBasis: "true",
    },
  ],
} as Measure;

const measureWithObservations = {
  id: "testMeasureId",
  scoring: MeasureScoring.COHORT,
  model: Model.QDM_5_6,
  createdBy: "testUserOwner",
  patientBasis: true,
  groups: [
    {
      id: "test_groupId",
      scoring: MeasureScoring.COHORT,
      populations: [
        {
          id: "4f0a1989-205f-45df-a476-8e19999d21c7",
          name: PopulationType.INITIAL_POPULATION,
          definition: "IP",
        },
      ],
      populationBasis: "true",
      measureObservations: [
        {
          id: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
          definition: "boolFunc",
          criteriaReference: "79349c30-791c-41c7-9463-81872a0dbed1",
          aggregateMethod: AggregateFunctionType.AVERAGE,
        },
      ],
    },
  ],
} as Measure;

const measureWithStratifications = {
  id: "testMeasureId",
  scoring: MeasureScoring.COHORT,
  model: Model.QDM_5_6,
  createdBy: "testUserOwner",
  patientBasis: true,
  groups: [
    {
      id: "test_groupId",
      scoring: MeasureScoring.COHORT,
      populations: [
        {
          id: "4f0a1989-205f-45df-a476-8e19999d21c7",
          name: PopulationType.INITIAL_POPULATION,
          definition: "IP",
        },
      ],
      populationBasis: "true",
      stratifications: [
        {
          id: "strata1",
          cqlDefinition: "strat1Def",
          association: PopulationType.INITIAL_POPULATION,
        },
        {
          id: "strata2",
          cqlDefinition: "strat2Def",
          association: PopulationType.INITIAL_POPULATION,
        },
      ],
    },
  ],
} as Measure;

jest.mock("@madie/madie-util", () => ({
  useFeatureFlags: () => {
    return { disableRunTestCaseWithObservStrat: true };
  },
}));

describe("RunTestsButton", () => {
  it("RunTestsButton should be enabled with no error, no observation and no stratification and disableRunTestCaseWithObservStrat is true", () => {
    render(
      <RunTestsButton
        hasErrors={false}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        measure={measureWithNoObservNoStrats}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", false);
  });

  it("RunTestsButton should be disabled with error", () => {
    render(
      <RunTestsButton
        hasErrors={true}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        measure={measureWithNoObservNoStrats}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", true);
  });

  it("RunTestsButton should be disabled when measure has observations", () => {
    render(
      <RunTestsButton
        hasErrors={false}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        measure={measureWithObservations}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", true);
  });

  it("RunTestsButton should be disabled when measure has stratifications", () => {
    render(
      <RunTestsButton
        hasErrors={false}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        measure={measureWithStratifications}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", true);
  });

  it("test click RunTestsButton execution is loading", () => {
    render(
      <RunTestsButton
        hasErrors={false}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        measure={measureWithNoObservNoStrats}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", false);

    userEvent.click(executeButton);
    expect(executeButton).toHaveProperty("disabled", true);
  });
});
