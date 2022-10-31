import { CalculationService, ExecutionStatusType } from "./CalculationService";
import { officeVisitMeasure } from "./__mocks__/OfficeVisitMeasure";
import { officeVisitValueSet } from "./__mocks__/OfficeVisitValueSet";
import { officeVisitMeasureBundle } from "./__mocks__/OfficeVisitMeasureBundle";
import { testCaseOfficeVisit } from "./__mocks__/TestCaseOfficeVisit";
import { groupResults } from "./__mocks__/GroupExecutionResults";

import { DetailedPopulationGroupResult, EpisodeResults, ExecutionResult } from "fqm-execution/build/types/Calculator";
import { FinalResult, PopulationType as FqmPopulationType, Relevance } from "fqm-execution/build/types/Enums";
import {
  Group,
  GroupPopulation,
  MeasureGroupTypes,
  MeasureScoring,
  PopulationType,
  TestCase
} from "@madie/madie-models";

describe("CalculationService Tests", () => {
  let calculationService: CalculationService;

  beforeEach(() => {
    calculationService = new CalculationService();
  });

  const testCases: TestCase[] = [
    {
      id: "1",
      title: "testing",
      name: "testing",
      description: "description for test",
      json: "",
      executionStatus: "pass",
      groupPopulations: [],
      validResource: true,
      hapiOperationOutcome: undefined,
    },
    {
      id: "2",
      title: "testing",
      name: "testing",
      description: "description for test",
      json: "",
      executionStatus: "fail",
      groupPopulations: [],
      validResource: true,
      hapiOperationOutcome: undefined,
    },
  ] as unknown as TestCase[];

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

  it("should provide pass fail stats for test cases", () => {
    const output =
      calculationService.getPassingPercentageForTestCases(testCases);
    expect(output.passPercentage).toBe(50);
    expect(output.passFailRatio).toBe("1/2");
    expect(Object.keys(output).length).toBe(2);
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

  it("aggregates episode results for initial-population", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [
          {
            groupId: "group1",
            statementResults: [],
            episodeResults: [
              {
                episodeId: "1",
                populationResults: [
                  {
                    populationType: FqmPopulationType.IPP,
                    criteriaExpression: "ipp",
                    result: true,
                  },
                ],
              },
              {
                episodeId: "2",
                populationResults: [
                  {
                    populationType: FqmPopulationType.IPP,
                    criteriaExpression: "ipp",
                    result: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const output = calculationService.processEpisodeResults(executionResults);
    expect(output).toBeTruthy();
    expect(output).toEqual({
      P111: {
        group1: [
          {
            populationType: FqmPopulationType.IPP,
            define: "ipp",
            value: 2,
          },
        ],
      },
    });
  });

  it("handles undefined episode results", () => {
    const executionResults = undefined;

    const output = calculationService.processEpisodeResults(executionResults);
    expect(output).toBeTruthy();
    expect(output).toEqual({});
  });

  it("handles null episode results", () => {
    const executionResults = null;

    const output = calculationService.processEpisodeResults(executionResults);
    expect(output).toBeTruthy();
    expect(output).toEqual({});
  });

  it("aggregates episode results for multiple pops, multiple IPs", () => {
    const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] = [
      {
        patientId: "P111",
        detailedResults: [
          {
            groupId: "group1",
            statementResults: [],
            episodeResults: [
              {
                episodeId: "1",
                populationResults: [
                  {
                    populationType: FqmPopulationType.IPP,
                    criteriaExpression: "ipp",
                    result: true,
                  },
                  {
                    populationType: FqmPopulationType.IPP,
                    criteriaExpression: "ipp2",
                    result: false,
                  },
                  {
                    populationType: FqmPopulationType.DENOM,
                    criteriaExpression: "den",
                    result: false,
                  },
                  {
                    populationType: FqmPopulationType.NUMER,
                    criteriaExpression: "num",
                    result: true,
                  },
                ],
              },
              {
                episodeId: "2",
                populationResults: [
                  {
                    populationType: FqmPopulationType.IPP,
                    criteriaExpression: "ipp",
                    result: true,
                  },
                  {
                    populationType: FqmPopulationType.IPP,
                    criteriaExpression: "ipp2",
                    result: true,
                  },
                  {
                    populationType: FqmPopulationType.DENOM,
                    criteriaExpression: "den",
                    result: true,
                  },
                  {
                    populationType: FqmPopulationType.NUMER,
                    criteriaExpression: "num",
                    result: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const output = calculationService.processEpisodeResults(executionResults);
    expect(output).toBeTruthy();
    expect(output).toEqual({
      P111: {
        group1: [
          {
            populationType: FqmPopulationType.IPP,
            define: "ipp",
            value: 2,
          },
          {
            populationType: FqmPopulationType.IPP,
            define: "ipp2",
            value: 1,
          },
          {
            populationType: FqmPopulationType.DENOM,
            define: "den",
            value: 1,
          },
          {
            populationType: FqmPopulationType.NUMER,
            define: "num",
            value: 2,
          },
        ],
      },
    });
  });

  it("calculates overall coverage for a selected group when coverage info not available", () => {
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

  it("calculates overall coverage for a selected group when coverage info available", () => {
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

  it("test isClauseIgnored", () => {
    const clause = {};
    clause["raw"] = { name: "something" };
    expect(calculationService.isClauseIgnored(clause)).toBeFalsy();

    clause["final"] = "NA";
    expect(calculationService.isClauseIgnored(clause)).toBeTruthy();
    clause["raw"] = { name: "ValueSet" };
    expect(calculationService.isClauseIgnored(clause)).toBeTruthy();
  });

  describe("CalculationService.isValuePass", () => {
    it("should pass two blanks", () => {
      const output = calculationService.isValuePass("", "", false);
      expect(output).toBeTruthy();
    });

    it("should pass blank and undefined", () => {
      const output = calculationService.isValuePass("", undefined, false);
      expect(output).toBeTruthy();
    });

    it("should pass blank and zero", () => {
      const output = calculationService.isValuePass(0, "", false);
      expect(output).toBeTruthy();
    });

    it("should pass 1 string and 1 number", () => {
      const output = calculationService.isValuePass(1, "1", false);
      expect(output).toBeTruthy();
    });

    it("should pass 2 string and 2 number", () => {
      const output = calculationService.isValuePass(2, "2", false);
      expect(output).toBeTruthy();
    });

    it("should fail 2 string and 1 number", () => {
      const output = calculationService.isValuePass(1, "2", false);
      expect(output).toBeFalsy();
    });

    it("should pass blank and zero", () => {
      const output = calculationService.isValuePass(false, undefined, true);
      expect(output).toBeTruthy();
    });
  });

  describe("CalculationService.findPatientActualResult", () => {
    it("should return first result for matching population", () => {
      const popGroupResult: DetailedPopulationGroupResult = {
        groupId: "group1ID",
        statementResults: [],
        populationResults: [
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp1",
            result: true,
          },
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp2",
            result: false,
          },
          {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "den",
            result: true,
          },
          {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "num",
            result: false,
          },
        ],
      };
      const output = calculationService.findPatientActualResult(
        popGroupResult,
        PopulationType.INITIAL_POPULATION,
        0
      );
      expect(output).toBeTruthy();
      expect(output.populationType).toEqual(FqmPopulationType.IPP);
      expect(output.result).toEqual(true);
    });

    it("should return first result for matching population with no popCount", () => {
      const popGroupResult: DetailedPopulationGroupResult = {
        groupId: "group1ID",
        statementResults: [],
        populationResults: [
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp1",
            result: true,
          },
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp2",
            result: false,
          },
          {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "den",
            result: true,
          },
          {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "num",
            result: false,
          },
        ],
      };
      const output = calculationService.findPatientActualResult(
        popGroupResult,
        PopulationType.INITIAL_POPULATION,
        undefined
      );
      expect(output).toBeTruthy();
      expect(output.populationType).toEqual(FqmPopulationType.IPP);
      expect(output.result).toEqual(true);
    });

    it("should return result for second matching population", () => {
      const popGroupResult: DetailedPopulationGroupResult = {
        groupId: "group1ID",
        statementResults: [],
        populationResults: [
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp1",
            result: true,
          },
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp2",
            result: false,
          },
          {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "den",
            result: true,
          },
          {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "num",
            result: false,
          },
        ],
      };
      const output = calculationService.findPatientActualResult(
        popGroupResult,
        PopulationType.INITIAL_POPULATION,
        1
      );
      expect(output).toBeTruthy();
      expect(output.populationType).toEqual(FqmPopulationType.IPP);
      expect(output.result).toEqual(false);
    });

    it("should return result for second matching population", () => {
      const popGroupResult: DetailedPopulationGroupResult = {
        groupId: "group1ID",
        statementResults: [],
        populationResults: [
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp1",
            result: true,
          },
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp2",
            result: false,
          },
          {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "den",
            result: true,
          },
          {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "num",
            result: false,
          },
        ],
      };
      const output = calculationService.findPatientActualResult(
        popGroupResult,
        PopulationType.DENOMINATOR,
        0
      );
      expect(output).toBeTruthy();
      expect(output.populationType).toEqual(FqmPopulationType.DENOM);
      expect(output.criteriaExpression).toEqual("den");
      expect(output.result).toEqual(true);
    });
  });

  describe("CalculationService.isGroupPass", () => {
    it("should pass null group", () => {
      const output = calculationService.isGroupPass(null);
      expect(output).toEqual(true);
    });

    it("should pass undefined group", () => {
      const output = calculationService.isGroupPass(undefined);
      expect(output).toEqual(true);
    });

    it("should pass group with undefined populationValues", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.RATIO,
        populationBasis: "boolean",
        populationValues: undefined,
        stratificationValues: undefined,
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(true);
    });

    it("should pass group with empty populationValues and undefined stratifications", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.RATIO,
        populationBasis: "boolean",
        populationValues: [],
        stratificationValues: undefined,
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(true);
    });

    it("should pass group with empty populationValues and empty stratifications", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.RATIO,
        populationBasis: "boolean",
        populationValues: [],
        stratificationValues: [],
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(true);
    });

    it("should pass group with matching populations and empty stratifications for Cohort", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "1",
            expected: true,
            actual: true,
            criteriaReference: "ipp",
            name: PopulationType.INITIAL_POPULATION,
          },
        ],
        stratificationValues: [],
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(true);
    });

    it("should pass group with matching populations and empty stratifications for Ratio", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.RATIO,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "1",
            expected: true,
            actual: true,
            criteriaReference: "ipp",
            name: PopulationType.INITIAL_POPULATION,
          },
          {
            id: "1",
            expected: true,
            actual: true,
            criteriaReference: "den",
            name: PopulationType.DENOMINATOR,
          },
          {
            id: "1",
            expected: false,
            actual: false,
            criteriaReference: "num",
            name: PopulationType.NUMERATOR,
          },
        ],
        stratificationValues: [],
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(true);
    });

    it("should fail group with failing populations and empty stratifications for Ratio", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.RATIO,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "1",
            expected: true,
            actual: true,
            criteriaReference: "ipp",
            name: PopulationType.INITIAL_POPULATION,
          },
          {
            id: "1",
            expected: true,
            actual: true,
            criteriaReference: "den",
            name: PopulationType.DENOMINATOR,
          },
          {
            id: "1",
            expected: true,
            actual: false,
            criteriaReference: "num",
            name: PopulationType.NUMERATOR,
          },
        ],
        stratificationValues: [],
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(false);
    });

    it("should pass group with matching populations and matching stratifications for Cohort", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "1",
            expected: true,
            actual: true,
            criteriaReference: "ipp",
            name: PopulationType.INITIAL_POPULATION,
          },
        ],
        stratificationValues: [
          {
            id: "321",
            name: "strata-1 Initial Population",
            expected: true,
            actual: true,
          },
        ],
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(true);
    });

    it("should pass group with matching populations and failing stratifications for Cohort", () => {
      const groupPop: GroupPopulation = {
        groupId: "group1ID",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "1",
            expected: true,
            actual: true,
            criteriaReference: "ipp",
            name: PopulationType.INITIAL_POPULATION,
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
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(false);
    });
  });

  describe("CalculationService.findEpisodeObservationResult", () => {
    it("should return first denominator observation", () => {
      // This represents which of how many of this type of observation are present
      // e.g. this is the first of the DENOMINATOR_OBSERVATIONs present
      const observationTypeCount = 0;
      const episodeResults: EpisodeResults[] = [
        {
          episodeId: "1",
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "ipp",
              result: true,
            },
            {
              populationType: FqmPopulationType.DENOM,
              criteriaExpression: "den",
              result: true,
            },
            {
              populationType: FqmPopulationType.NUMER,
              criteriaExpression: "num",
              result: true,
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "denomFunc",
              result: true,
              observations: [4],
            },
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "numerFunc",
              result: true,
              observations: [18],
            },
          ],
        },
      ];
      const observationCriteriaExpression = "denomFunc";

      const output = calculationService.findEpisodeObservationResult(
        episodeResults,
        observationTypeCount,
        observationCriteriaExpression,
        PopulationType.DENOMINATOR_OBSERVATION
      );

      expect(output).toEqual(4);
    });

    it("should return numerator observation when Denon and Numer obs using different functions", () => {
      // This represents which of how many of this type of observation are present
      // e.g. this is the first of the DENOMINATOR_OBSERVATIONs present
      const observationTypeCount = 0;
      const episodeResults: EpisodeResults[] = [
        {
          episodeId: "1",
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "ipp",
              result: true,
            },
            {
              populationType: FqmPopulationType.DENOM,
              criteriaExpression: "den",
              result: true,
            },
            {
              populationType: FqmPopulationType.NUMER,
              criteriaExpression: "num",
              result: true,
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "denomFunc",
              result: true,
              observations: [4],
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "numerFunc",
              result: true,
              observations: [18],
            },
          ],
        },
      ];
      const observationCriteriaExpression = "numerFunc";

      const output = calculationService.findEpisodeObservationResult(
        episodeResults,
        observationTypeCount,
        observationCriteriaExpression,
        PopulationType.NUMERATOR_OBSERVATION
      );

      expect(output).toEqual(18);
    });

    it("should return numerator observation when Denon and Numer obs using same functions", () => {
      // TODO: update this is fqm-execution stops putting Numer observation in denom observation output
      // This represents which of how many of this type of observation are present
      // e.g. this is the first of the DENOMINATOR_OBSERVATIONs present
      const observationTypeCount = 0;
      const episodeResults: EpisodeResults[] = [
        {
          episodeId: "1",
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "ipp",
              result: true,
            },
            {
              populationType: FqmPopulationType.DENOM,
              criteriaExpression: "den",
              result: true,
            },
            {
              populationType: FqmPopulationType.NUMER,
              criteriaExpression: "num",
              result: true,
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "observationFunc",
              result: true,
              // fqm-execution currently just sticks observation result in first matching population
              observations: [4, 18],
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "observationFunc",
              result: false,
            },
          ],
        },
      ];
      const observationCriteriaExpression = "observationFunc";

      const output = calculationService.findEpisodeObservationResult(
        episodeResults,
        observationTypeCount,
        observationCriteriaExpression,
        PopulationType.NUMERATOR_OBSERVATION
      );

      expect(output).toEqual(18);
    });

    it("should return numerator observation when Denon and Numer obs using same functions and numer fails", () => {
      // TODO: update this is fqm-execution stops putting Numer observation in denom observation output
      // This represents which of how many of this type of observation are present
      // e.g. this is the first of the DENOMINATOR_OBSERVATIONs present
      const observationTypeCount = 0;
      const episodeResults: EpisodeResults[] = [
        {
          episodeId: "1",
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "ipp",
              result: true,
            },
            {
              populationType: FqmPopulationType.DENOM,
              criteriaExpression: "den",
              result: true,
            },
            {
              populationType: FqmPopulationType.NUMER,
              criteriaExpression: "num",
              result: false,
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "observationFunc",
              result: true,
              observations: [4],
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "observationFunc",
              result: false,
            },
          ],
        },
      ];
      const observationCriteriaExpression = "observationFunc";

      const output = calculationService.findEpisodeObservationResult(
        episodeResults,
        observationTypeCount,
        observationCriteriaExpression,
        PopulationType.NUMERATOR_OBSERVATION
      );

      expect(output).toEqual(null);
    });

    it("should return missing observation for observation count greater than number of episodes", () => {
      // This represents which of how many of this type of observation are present
      // e.g. this is the first of the DENOMINATOR_OBSERVATIONs present
      const observationTypeCount = 1;
      const episodeResults: EpisodeResults[] = [
        {
          episodeId: "1",
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "ipp",
              result: true,
            },
            {
              populationType: FqmPopulationType.DENOM,
              criteriaExpression: "den",
              result: true,
            },
            {
              populationType: FqmPopulationType.NUMER,
              criteriaExpression: "num",
              result: true,
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "denomFunc",
              result: true,
              observations: [4],
            },
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "numerFunc",
              result: true,
              observations: [18],
            },
          ],
        },
      ];
      const observationCriteriaExpression = "denomFunc";

      const output = calculationService.findEpisodeObservationResult(
        episodeResults,
        observationTypeCount,
        observationCriteriaExpression,
        PopulationType.DENOMINATOR_OBSERVATION
      );

      expect(output).toEqual(null);
    });
  });

  describe("CalculationService.processTestCaseResults", () => {
    it("should return test case results for Cohort, boolean popBasis and pass executionStatus", () => {
      const popGroupResults: DetailedPopulationGroupResult[] = [
        {
          groupId: "groupID",
          statementResults: [], //only needed for strats currently
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "boolIpp",
              result: true,
            },
          ],
        },
      ];
      const testCase: TestCase = {
        id: "TC1",
        name: "TestCase1",
        title: "TestCase1",
        description: "first",
        validResource: true,
        groupPopulations: [
          {
            groupId: "groupID",
            scoring: MeasureScoring.COHORT,
            populationBasis: "boolean",
            populationValues: [
              {
                id: "pop1ID",
                name: PopulationType.INITIAL_POPULATION,
                criteriaReference: "boolIpp",
                expected: true,
              },
            ],
            stratificationValues: [],
          },
        ],
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        executionStatus: "NA",
        series: undefined,
        hapiOperationOutcome: undefined,
      };
      const groups: Group[] = [
        {
          id: "groupID",
          scoring: MeasureScoring.COHORT,
          populationBasis: "boolean",
          populations: [
            {
              id: "pop1ID",
              name: PopulationType.INITIAL_POPULATION,
              definition: "boolIpp",
            },
          ],
          stratifications: [],
          measureObservations: [],
          measureGroupTypes: [MeasureGroupTypes.OUTCOME],
        },
      ];
      const output = calculationService.processTestCaseResults(
        testCase,
        groups,
        popGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
      const outputGroupPopulations = output.groupPopulations;
      expect(outputGroupPopulations).toBeTruthy();
      expect(outputGroupPopulations.length).toEqual(1);
      const group1PopVals = outputGroupPopulations[0].populationValues;
      expect(group1PopVals).toBeTruthy();
      expect(group1PopVals.length).toEqual(1);
      expect(group1PopVals[0]).toBeTruthy();
      expect(group1PopVals[0].expected).toBeTruthy();
      expect(group1PopVals[0].actual).toBeTruthy();
    });

    it("should return test case results for Cohort, boolean popBasis and fail execution status", () => {
      const popGroupResults: DetailedPopulationGroupResult[] = [
        {
          groupId: "groupID",
          statementResults: [], //only needed for strats currently
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "boolIpp",
              result: false,
            },
          ],
        },
      ];
      const testCase: TestCase = {
        id: "TC1",
        name: "TestCase1",
        title: "TestCase1",
        description: "first",
        validResource: true,
        groupPopulations: [
          {
            groupId: "groupID",
            scoring: MeasureScoring.COHORT,
            populationBasis: "boolean",
            populationValues: [
              {
                id: "pop1ID",
                name: PopulationType.INITIAL_POPULATION,
                criteriaReference: "boolIpp",
                expected: true,
              },
            ],
            stratificationValues: [],
          },
        ],
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        executionStatus: "NA",
        series: undefined,
        hapiOperationOutcome: undefined,
      };
      const groups: Group[] = [
        {
          id: "groupID",
          scoring: MeasureScoring.COHORT,
          populationBasis: "boolean",
          populations: [
            {
              id: "pop1ID",
              name: PopulationType.INITIAL_POPULATION,
              definition: "boolIpp",
            },
          ],
          stratifications: [],
          measureObservations: [],
          measureGroupTypes: [MeasureGroupTypes.OUTCOME],
        },
      ];
      const output = calculationService.processTestCaseResults(
        testCase,
        groups,
        popGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.FAIL);
      const outputGroupPopulations = output.groupPopulations;
      expect(outputGroupPopulations).toBeTruthy();
      expect(outputGroupPopulations.length).toEqual(1);
      const group1PopVals = outputGroupPopulations[0].populationValues;
      expect(group1PopVals).toBeTruthy();
      expect(group1PopVals.length).toEqual(1);
      expect(group1PopVals[0]).toBeTruthy();
      expect(group1PopVals[0].expected).toBeTruthy();
      expect(group1PopVals[0].actual).toBeFalsy();
    });

    it("should return test case results for cohort, boolean popBasis with stratification", () => {
      const popGroupResults: DetailedPopulationGroupResult[] = [
        {
          groupId: "groupID",
          statementResults: [
            {
              libraryName: "TestLib",
              raw: true,
              statementName: "strat1Def",
              final: FinalResult.TRUE,
              relevance: Relevance.TRUE,
            },
            {
              libraryName: "TestLib",
              raw: false,
              statementName: "strat2Def",
              final: FinalResult.TRUE,
              relevance: Relevance.TRUE,
            },
          ],
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "boolIpp",
              result: true,
            },
          ],
        },
      ];
      const testCase: TestCase = {
        id: "TC1",
        name: "TestCase1",
        title: "TestCase1",
        description: "first",
        validResource: true,
        groupPopulations: [
          {
            groupId: "groupID",
            scoring: MeasureScoring.COHORT,
            populationBasis: "boolean",
            populationValues: [
              {
                id: "pop1",
                name: PopulationType.INITIAL_POPULATION,
                expected: true,
              }
            ],
            stratificationValues: [
              {
                id: "strata1",
                name: "strata-1 Initial Population",
                expected: true,
              },
              {
                id: "strata2",
                name: "strata-2 Initial Population",
                expected: false,
              },
            ],
          },
        ],
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        executionStatus: "NA",
        series: undefined,
        hapiOperationOutcome: undefined,
      };
      const groups: Group[] = [
        {
          id: "groupID",
          scoring: MeasureScoring.COHORT,
          populationBasis: "boolean",
          populations: [
            {
              id: "pop1",
              name: PopulationType.INITIAL_POPULATION,
              definition: "boolIpp",
            },
          ],
          stratifications: [
            {
              id: "strat1",
              cqlDefinition: "strat1Def",
              association: PopulationType.INITIAL_POPULATION,
            },
            {
              id: "strat2",
              cqlDefinition: "strat2Def",
              association: PopulationType.INITIAL_POPULATION,
            },
          ],
          measureObservations: [],
          measureGroupTypes: [MeasureGroupTypes.OUTCOME],
        },
      ];
      const output = calculationService.processTestCaseResults(
        testCase,
        groups,
        popGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
      const outputGroupPopulations = output.groupPopulations;
      expect(outputGroupPopulations).toBeTruthy();
      expect(outputGroupPopulations.length).toEqual(1);
      const group1PopVals = outputGroupPopulations[0].populationValues;
      expect(group1PopVals).toBeTruthy();
      expect(group1PopVals.length).toEqual(1);
      expect(group1PopVals[0]).toBeTruthy();
      expect(group1PopVals[0].expected).toBeTruthy();
      expect(group1PopVals[0].actual).toBeTruthy();
      const group1StratVals = outputGroupPopulations[0].stratificationValues;
      expect(group1StratVals).toBeTruthy();
      expect(group1StratVals.length).toEqual(2);
      expect(group1StratVals[0].actual).toEqual(true);
      expect(group1StratVals[1].actual).toEqual(false);
    });
  });
});
