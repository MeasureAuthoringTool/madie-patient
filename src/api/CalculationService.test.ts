import { CalculationService } from "./CalculationService";
import { officeVisitMeasure } from "./__mocks__/OfficeVisitMeasure";
import { officeVisitValueSet } from "./__mocks__/OfficeVisitValueSet";
import { officeVisitMeasureBundle } from "./__mocks__/OfficeVisitMeasureBundle";
import { testCaseOfficeVisit } from "./__mocks__/TestCaseOfficeVisit";
import { groupResults } from "./__mocks__/GroupExecutionResults";

import {
  DetailedPopulationGroupResult,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import { FinalResult, Relevance } from "fqm-execution/build/types/Enums";

describe("CalculationService Tests", () => {
  let calculationService: CalculationService;

  beforeEach(() => {
    calculationService = new CalculationService();
  });

  it("IPP, denominator and numerator Pass test", async () => {
    const calculationResults = await calculationService.calculateTestCases(
      officeVisitMeasure,
      [testCaseOfficeVisit],
      officeVisitMeasureBundle,
      [officeVisitValueSet]
    );
    const expectedPopulationResults =
      calculationResults[0].detailedResults[0].populationResults;
    expect(expectedPopulationResults).toEqual([
      {
        criteriaExpression: "ipp",
        populationType: "initial-population",
        result: true,
      },
      {
        criteriaExpression: "denom",
        populationType: "denominator",
        result: true,
      },
      { criteriaExpression: "num", populationType: "numerator", result: true },
    ]);
  });

  it("should handle null raw results", () => {
    const output = calculationService.processRawResults(null);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(0);
  });

  it("should handle undefined raw results", () => {
    const output = calculationService.processRawResults(undefined);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(0);
  });

  it("should handle empty raw results", () => {
    const output = calculationService.processRawResults([]);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(0);
  });

  it("should handle empty detailed results", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [],
      },
    ];
    const output = calculationService.processRawResults(executionResults);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(1);
    expect(output["P111"]).toBeTruthy();
    expect(Object.keys(output["P111"]).length).toBe(0);
  });

  it("should handle undefined detailed results", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: undefined,
      },
    ];
    const output = calculationService.processRawResults(executionResults);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(1);
    expect(output["P111"]).toBeTruthy();
    expect(Object.keys(output["P111"]).length).toBe(0);
  });

  it("should handle undefined group statement results", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [
          {
            groupId: "group1",
            statementResults: undefined,
          },
        ],
      },
    ];
    const output = calculationService.processRawResults(executionResults);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(1);
    expect(output["P111"]).toBeTruthy();
    expect(Object.keys(output["P111"]).length).toBe(1);
    expect(output["P111"]["group1"]).toBeTruthy();
    expect(Object.keys(output["P111"]["group1"]).length).toBe(0);
  });

  it("should handle empty group statement results", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [
          {
            groupId: "group1",
            statementResults: [],
          },
        ],
      },
    ];
    const output = calculationService.processRawResults(executionResults);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(1);
    expect(output["P111"]).toBeTruthy();
    expect(Object.keys(output["P111"]).length).toBe(1);
    expect(output["P111"]["group1"]).toBeTruthy();
    expect(Object.keys(output["P111"]["group1"]).length).toBe(0);
  });

  it("should handle undefined raw group statement result", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [
          {
            groupId: "group1",
            statementResults: [
              {
                statementName: "ippDef",
                libraryName: "MeasureLib",
                raw: undefined,
                final: FinalResult.NA,
                relevance: Relevance.NA,
              },
            ],
          },
        ],
      },
    ];
    const output = calculationService.processRawResults(executionResults);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(1);
    expect(output["P111"]).toBeTruthy();
    expect(Object.keys(output["P111"]).length).toBe(1);
    expect(output["P111"]["group1"]).toBeTruthy();
    expect(Object.keys(output["P111"]["group1"]).length).toBe(1);
    expect(output["P111"]["group1"]["ippDef"]).toBe(0);
  });

  it("should handles array raw group statement results", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [
          {
            groupId: "group1",
            statementResults: [
              {
                statementName: "ippDef",
                libraryName: "MeasureLib",
                raw: [{}, {}],
                final: FinalResult.NA,
                relevance: Relevance.NA,
              },
              {
                statementName: "denomDef",
                libraryName: "MeasureLib",
                raw: [{}],
                final: FinalResult.NA,
                relevance: Relevance.NA,
              },
            ],
          },
        ],
      },
    ];
    const output = calculationService.processRawResults(executionResults);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(1);
    expect(output["P111"]).toBeTruthy();
    expect(Object.keys(output["P111"]).length).toBe(1);
    expect(output["P111"]["group1"]).toBeTruthy();
    expect(Object.keys(output["P111"]["group1"]).length).toBe(2);
    expect(output["P111"]["group1"]["ippDef"]).toBeTruthy();
    expect(output["P111"]["group1"]["ippDef"]).toBe(2);
    expect(output["P111"]["group1"]["denomDef"]).toBeTruthy();
    expect(output["P111"]["group1"]["denomDef"]).toBe(1);
  });

  it("should handles boolean raw group statement results", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [
          {
            groupId: "group1",
            statementResults: [
              {
                statementName: "ippDef",
                libraryName: "MeasureLib",
                raw: true,
                final: FinalResult.NA,
                relevance: Relevance.NA,
              },
              {
                statementName: "denomDef",
                libraryName: "MeasureLib",
                raw: false,
                final: FinalResult.NA,
                relevance: Relevance.NA,
              },
            ],
          },
        ],
      },
    ];
    const output = calculationService.processRawResults(executionResults);
    expect(output).toBeTruthy();
    expect(Object.keys(output).length).toBe(1);
    expect(output["P111"]).toBeTruthy();
    expect(Object.keys(output["P111"]).length).toBe(1);
    expect(output["P111"]["group1"]).toBeTruthy();
    expect(Object.keys(output["P111"]["group1"]).length).toBe(2);
    expect(output["P111"]["group1"]["ippDef"]).toBeTruthy();
    expect(output["P111"]["group1"]["denomDef"]).toBeFalsy();
  });

  it("calculates overall coverage for a selected group when no coverage info not available", () => {
    // No groups provided
    let overallCoverage = calculationService.getCoveragePercentageForGroup(
      "id-123",
      undefined
    );
    expect(overallCoverage).toBe(0);
    // Empty group Array
    overallCoverage = calculationService.getCoveragePercentageForGroup(
      "id-123",
      []
    );
    expect(overallCoverage).toBe(0);

    // selected group missing clauseResults
    overallCoverage = calculationService.getCoveragePercentageForGroup(
      "633dae976efe1b323e5bf3d3",
      groupResults
    );
    expect(overallCoverage).toBe(0);

    // selected group not present in groupResults
    overallCoverage = calculationService.getCoveragePercentageForGroup(
      "invalid-group-id",
      groupResults
    );
    expect(overallCoverage).toBe(0);
  });

  it("calculates overall coverage for a selected group when no coverage info available", () => {
    let overallCoverage = calculationService.getCoveragePercentageForGroup(
      "633dae796efe1b323e5bf3a8",
      groupResults
    );
    expect(overallCoverage).toBe(66);

    overallCoverage = calculationService.getCoveragePercentageForGroup(
      "633dae976efe1b323e5bf3a9",
      groupResults
    );
    expect(overallCoverage).toBe(83);
  });
});
