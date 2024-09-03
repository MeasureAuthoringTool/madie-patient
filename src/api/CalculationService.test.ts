import {
  CalculationService,
  ExecutionStatusType,
  PopulationEpisodeResult,
} from "./CalculationService";
import { officeVisitMeasure } from "./__mocks__/OfficeVisitMeasure";
import { officeVisitValueSet } from "./__mocks__/OfficeVisitValueSet";
import { officeVisitMeasureBundle } from "./__mocks__/OfficeVisitMeasureBundle";
import { testCaseOfficeVisit } from "./__mocks__/TestCaseOfficeVisit";
import { groupResults } from "./__mocks__/GroupExecutionResults";
import {
  ContinuousVariable_Encounter_Fail,
  ContinuousVariable_Encounter_Pass,
  ContinuousVariableBoolean,
  Ratio_Boolean_SingleIP_DenObs_NumObs_Pass,
  Ratio_Encounter_SingleIP_DenObs_NumObs_Pass,
} from "./__mocks__/TestCaseProcessingScenarios";

import {
  DetailedPopulationGroupResult,
  EpisodeResults,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import {
  FinalResult,
  PopulationType as FqmPopulationType,
  Relevance,
} from "fqm-execution/build/types/Enums";
import {
  Group,
  GroupPopulation,
  MeasureGroupTypes,
  MeasureScoring,
  PopulationType,
  TestCase,
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
      calculationResults.results[0].detailedResults[0].populationResults;
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

    it("should fail group with incorrect measure observations for Ratio", () => {
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
            id: "2",
            expected: true,
            actual: true,
            criteriaReference: "den",
            name: PopulationType.DENOMINATOR,
          },
          {
            id: "3",
            expected: "33" as any,
            actual: 44,
            criteriaReference: "denObs",
            name: PopulationType.DENOMINATOR_OBSERVATION,
          },
          {
            id: "4",
            expected: true,
            actual: true,
            criteriaReference: "num",
            name: PopulationType.NUMERATOR,
          },
          {
            id: "5",
            expected: true,
            actual: "true" as any,
            criteriaReference: "num",
            name: PopulationType.NUMERATOR_OBSERVATION,
          },
        ],
        stratificationValues: [],
      };
      const output = calculationService.isGroupPass(groupPop);
      expect(output).toEqual(false);
    });
  });

  describe("CalculationService.buildPatientResults", () => {
    it("should return truthy output for null input", () => {
      const output = calculationService.buildPatientResults(null);
      expect(output).toBeTruthy();
      expect(output?.populations).toBeTruthy();
      expect(Object.keys(output.populations)).toEqual([]);
      expect(output?.observations).toBeTruthy();
      expect(Object.keys(output.observations)).toEqual([]);
    });

    it("should return truthy output for undefined input", () => {
      const output = calculationService.buildPatientResults(undefined);
      expect(output).toBeTruthy();
      expect(output?.populations).toBeTruthy();
      expect(Object.keys(output.populations)).toEqual([]);
      expect(output?.observations).toBeTruthy();
      expect(Object.keys(output.observations)).toEqual([]);
    });

    it("should return truthy output for empty input", () => {
      const output = calculationService.buildPatientResults([]);
      expect(output).toBeTruthy();
      expect(output?.populations).toBeTruthy();
      expect(Object.keys(output.populations)).toEqual([]);
      expect(output?.observations).toBeTruthy();
      expect(Object.keys(output.observations)).toEqual([]);
    });

    it("should return correct patient results for CV", () => {
      const populationResults =
        ContinuousVariableBoolean.populationGroupResults[0].populationResults;
      const output = calculationService.buildPatientResults(populationResults);
      expect(output).toBeTruthy();
      const expected = {
        populations: {
          "79a67327-8a94-4ae0-a75b-b67c7d28a241": {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "boolIpp",
            result: true,
            populationId: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
          },
          "79349c30-791c-41c7-9463-81872a0dbed1": {
            populationType: FqmPopulationType.MSRPOPL,
            criteriaExpression: "boolDenom",
            result: true,
            populationId: "79349c30-791c-41c7-9463-81872a0dbed1",
          },
        },
        observations: {
          "79349c30-791c-41c7-9463-81872a0dbed1": {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "boolFunc",
            result: true,
            populationId: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
            criteriaReferenceId: "79349c30-791c-41c7-9463-81872a0dbed1",
            observations: [1],
          },
        },
      };
      expect(output).toEqual(expected);
    });

    it("should return correct patient results for Ratio with Observations", () => {
      const populationResults =
        Ratio_Boolean_SingleIP_DenObs_NumObs_Pass.populationGroupResults[0]
          .populationResults;
      const output = calculationService.buildPatientResults(populationResults);
      expect(output).toBeTruthy();
      const expected = {
        populations: {
          "3c710d76-d5d2-4dc0-a3fb-28fdac1055d0": {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "boolIpp",
            result: true,
            populationId: "3c710d76-d5d2-4dc0-a3fb-28fdac1055d0",
          },
          "760758ae-009f-49b2-b7a3-c9997ac3931d": {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "boolDenom",
            result: true,
            populationId: "760758ae-009f-49b2-b7a3-c9997ac3931d",
          },
          "77e217d6-03dd-41ca-a1c3-f679933f9dd7": {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "boolNum",
            result: true,
            populationId: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
          },
        },
        observations: {
          "77e217d6-03dd-41ca-a1c3-f679933f9dd7": {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "boolFunc2",
            result: true,
            populationId: "536dbb4e-9032-414c-b7e7-048f5c8fb4ab",
            criteriaReferenceId: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
            observations: [14],
          },
          "760758ae-009f-49b2-b7a3-c9997ac3931d": {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "boolFunc",
            result: true,
            populationId: "7cfae29e-e9cc-4958-89de-a9dde443186f",
            criteriaReferenceId: "760758ae-009f-49b2-b7a3-c9997ac3931d",
            observations: [1],
          },
        },
      };
      expect(output).toEqual(expected);
    });
  });

  describe("CalculationService.buildEpisodeResults", () => {
    it("should return correct episode results for Ratio Encounter Single IP with both DEN and NUM obs", () => {
      const episodeResults =
        Ratio_Encounter_SingleIP_DenObs_NumObs_Pass.populationGroupResults[0]
          .episodeResults;
      const output = calculationService.buildEpisodeResults(episodeResults);
      expect(output).toBeTruthy();
      const expected = {
        populations: {
          "8d8b74ce-a843-4039-ad94-acad42cac257": {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp",
            result: 2,
            populationId: "8d8b74ce-a843-4039-ad94-acad42cac257",
          },
          "abce9253-30f1-438c-b370-30a264791b21": {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "denom",
            result: 2,
            populationId: "abce9253-30f1-438c-b370-30a264791b21",
          },
          "e1542f9f-7c5b-40ea-9feb-2d920d343f39": {
            populationType: FqmPopulationType.DENEX,
            result: 0,
            populationId: "e1542f9f-7c5b-40ea-9feb-2d920d343f39",
          },
          "51122f75-851f-428c-938c-1d512da1fe7f": {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "num",
            result: 1,
            populationId: "51122f75-851f-428c-938c-1d512da1fe7f",
          },
          "2cf3f052-9ba0-450d-a80e-1a823de962f8": {
            populationType: FqmPopulationType.NUMEX,
            result: 0,
            populationId: "2cf3f052-9ba0-450d-a80e-1a823de962f8",
          },
        },
        observations: {
          "abce9253-30f1-438c-b370-30a264791b21": {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "daysObs",
            result: true,
            populationId: "c6a2203f-ab34-4f0f-899d-a73467440bbd",
            criteriaReferenceId: "abce9253-30f1-438c-b370-30a264791b21",
            observations: [1, 1],
          },
        },
      };
      expect(output).toEqual(expected);
    });

    it("should return correct episode results for CV Encounter", () => {
      const episodeResults =
        ContinuousVariable_Encounter_Pass.populationGroupResults[0]
          .episodeResults;
      const output = calculationService.buildEpisodeResults(episodeResults);
      expect(output).toBeTruthy();
      const expected = {
        populations: {
          "77b6063f-f7c8-45db-8d84-1f0d8e7993b5": {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp",
            result: 2,
            populationId: "77b6063f-f7c8-45db-8d84-1f0d8e7993b5",
          },
          "797c4d66-cfd3-4ced-a482-1d55d5cad85c": {
            populationType: FqmPopulationType.MSRPOPL,
            criteriaExpression: "mPop",
            result: 2,
            populationId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
          },
          "5edeebba-b888-4d92-a8b2-8568d78ceb86": {
            populationType: FqmPopulationType.MSRPOPLEX,
            result: 0,
            populationId: "5edeebba-b888-4d92-a8b2-8568d78ceb86",
          },
        },
        observations: {
          "797c4d66-cfd3-4ced-a482-1d55d5cad85c": {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "daysObs",
            result: true,
            populationId: "ff17cb94-c66e-4f70-a66d-52ace013d054",
            criteriaReferenceId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
            observations: [5, 1],
          },
        },
      };
      expect(output).toEqual(expected);
    });
  });

  describe("CalculationService.processTestCaseResults", () => {
    it("should return null for null testCase", () => {
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

      const output = calculationService.processTestCaseResults(
        null,
        groups,
        popGroupResults
      );
      expect(output).toEqual(null);
    });

    it("should return undefined for undefined testCase", () => {
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

      const output = calculationService.processTestCaseResults(
        undefined,
        groups,
        popGroupResults
      );
      expect(output).toEqual(undefined);
    });

    it("should return Pass executionStatus if groupPopulations are null but actual result is false", () => {
      const testCase: TestCase = {
        id: "TC1",
        name: "TestCase1",
        title: "TestCase1",
        description: "first",
        validResource: true,
        groupPopulations: null,
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

      const output = calculationService.processTestCaseResults(
        testCase,
        groups,
        popGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
    });

    it("should return Fail executionStatus if groupPopulations are empty and actual result is true", () => {
      const testCase: TestCase = {
        id: "TC1",
        name: "TestCase1",
        title: "TestCase1",
        description: "first",
        validResource: true,
        groupPopulations: [],
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

      const popGroupResults: DetailedPopulationGroupResult[] = [
        {
          groupId: "groupID",
          statementResults: [], //only needed for strats currently
          populationResults: [
            {
              populationId: "pop1ID",
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "boolIpp",
              result: true,
            },
          ],
        },
      ];

      const output = calculationService.processTestCaseResults(
        testCase,
        groups,
        popGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.FAIL);
    });

    it("should return Fail executionStatus for provided measure groups when no matching groups are found and actual result is true", () => {
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
          id: "groupID999",
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

      const popGroupResults: DetailedPopulationGroupResult[] = [
        {
          groupId: "groupID",
          statementResults: [], //only needed for strats currently
          populationResults: [
            {
              populationId: "popXID",
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "boolIpp",
              result: true,
            },
          ],
        },
        {
          groupId: "groupID999",
          statementResults: [], //only needed for strats currently
          populationResults: [
            {
              populationId: "pop1ID",
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "boolIpp",
              result: true,
            },
          ],
        },
      ];

      const output = calculationService.processTestCaseResults(
        testCase,
        groups,
        popGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.FAIL);
    });

    it("should return test case results for Cohort, boolean popBasis and pass executionStatus", () => {
      const popGroupResults: DetailedPopulationGroupResult[] = [
        {
          groupId: "groupID",
          statementResults: [], //only needed for strats currently
          populationResults: [
            {
              populationId: "pop1ID",
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
              populationId: "pop1",
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "boolIpp",
              result: true,
            },
          ],
          stratifierResults: [
            {
              strataCode: "stratcode1",
              result: true,
              appliesResult: true,
              strataId: "strata1",
            },
            {
              strataCode: "stratcode2",
              result: true,
              appliesResult: false,
              strataId: "strata2",
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
              },
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
          measureObservations: [],
          measureGroupTypes: [MeasureGroupTypes.OUTCOME],
        },
      ];
      const output = calculationService.processTestCaseResults(
        testCase,
        groups,
        popGroupResults
      );
      //fails
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

    it("should return test case results for continuous variable, boolean popBasis", () => {
      const output = calculationService.processTestCaseResults(
        ContinuousVariableBoolean.testCase,
        ContinuousVariableBoolean.measureGroups,
        ContinuousVariableBoolean.populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
      expect(output.groupPopulations.length).toEqual(1);
      const popVals = output.groupPopulations[0].populationValues;
      expect(popVals).toBeTruthy();
      expect(popVals.length).toEqual(3);
      expect(popVals[0].name).toEqual(PopulationType.INITIAL_POPULATION);
      expect(popVals[0].actual).toEqual(true);
      expect(popVals[1].name).toEqual(PopulationType.MEASURE_POPULATION);
      expect(popVals[1].actual).toEqual(true);
      expect(popVals[2].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(popVals[2].actual).toEqual(1);
    });

    it("should return test case results for continuous variable, boolean popBasis", () => {
      const output = calculationService.processTestCaseResults(
        ContinuousVariableBoolean.testCase,
        ContinuousVariableBoolean.measureGroups,
        ContinuousVariableBoolean.populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
      expect(output.groupPopulations.length).toEqual(1);
      const popVals = output.groupPopulations[0].populationValues;
      expect(popVals).toBeTruthy();
      expect(popVals.length).toEqual(3);
      expect(popVals[0].name).toEqual(PopulationType.INITIAL_POPULATION);
      expect(popVals[0].actual).toEqual(true);
      expect(popVals[1].name).toEqual(PopulationType.MEASURE_POPULATION);
      expect(popVals[1].actual).toEqual(true);
      expect(popVals[2].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(popVals[2].actual).toEqual(1);
    });

    it("should return test case results for continuous variable, Encounter popBasis", () => {
      const output = calculationService.processTestCaseResults(
        ContinuousVariable_Encounter_Pass.testCase,
        ContinuousVariable_Encounter_Pass.measureGroups,
        ContinuousVariable_Encounter_Pass.populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
      expect(output.groupPopulations.length).toEqual(1);
      const popVals = output.groupPopulations[0].populationValues;
      expect(popVals.length).toEqual(4);
      expect(popVals[0].name).toEqual(PopulationType.INITIAL_POPULATION);
      expect(popVals[0].actual).toEqual(2);
      expect(popVals[1].name).toEqual(PopulationType.MEASURE_POPULATION);
      expect(popVals[1].actual).toEqual(2);
      expect(popVals[2].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(popVals[2].actual).toEqual(5);
      expect(popVals[3].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(popVals[3].actual).toEqual(1);
    });

    it("should return test case fail results for continuous variable, Encounter popBasis", () => {
      // Todo: fill this in with ContinuousVariable_Encounter_Fail
      const output = calculationService.processTestCaseResults(
        ContinuousVariable_Encounter_Fail.testCase,
        ContinuousVariable_Encounter_Fail.measureGroups,
        ContinuousVariable_Encounter_Fail.populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.FAIL);
      expect(output.groupPopulations.length).toEqual(1);
      const popVals = output.groupPopulations[0].populationValues;
      expect(popVals.length).toEqual(5);
      expect(popVals[0].name).toEqual(PopulationType.INITIAL_POPULATION);
      expect(popVals[0].actual).toEqual(2);
      expect(popVals[1].name).toEqual(PopulationType.MEASURE_POPULATION);
      expect(popVals[1].actual).toEqual(2);
      expect(popVals[2].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(popVals[2].actual).toEqual(5);
      expect(popVals[3].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(popVals[3].actual).toEqual(1);
      expect(popVals[4].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(popVals[4].actual).toEqual(null);
    });
  });
});
