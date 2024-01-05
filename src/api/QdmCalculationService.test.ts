import cqmMeasure from "../mockdata/qdm/CMS108/cqm_measure.json";
import patientJson from "../mockdata/qdm/testCasePatient.json";
import qdmCalculationService, {
  CqmExecutionPatientResultsByPopulationSet,
  QdmCalculationService,
} from "./QdmCalculationService";
import {
  Group,
  GroupPopulation,
  Measure,
  MeasureScoring,
  PopulationExpectedValue,
  PopulationType,
  Stratification,
  TestCase,
} from "@madie/madie-models";
import { ExecutionStatusType } from "./CalculationService";
import {
  CV_EPISODE_WITH_OBS_RESULTS,
  CV_EPISODE_WITH_STRAT_OBS_RESULTS,
  CV_PATIENT_WITH_OBS_RESULTS,
  RATIO_EPISODEBASED_WITH_OBS_RESULTS,
  RATIO_PATIENTBASED_WITH_OBS_RESULTS,
} from "./__mocks__/QdmTestCaseProcessingScenarios";

const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

let actualCalculationResults = {
  IPP: 1,
  DENOM: 1,
  DENEX: 0,
  NUMER: 1,
  NUMEX: 0,
  observation_values: [10, 12],
  state: "complete",
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("QDM CalculationService Tests", () => {
  let calculationService: QdmCalculationService;

  beforeEach(() => {
    calculationService = new QdmCalculationService();
  });

  it("basic test case execution with mock data", async () => {
    window.localStorage.setItem("madieDebug", "true");
    const qdmCalculationResults =
      await calculationService.calculateQdmTestCases(cqmMeasure, [patientJson]);
    expect(qdmCalculationResults).toBeTruthy();
    expect(Object.keys(qdmCalculationResults).length).toBe(1);
    expect(qdmCalculationResults["648c6a89f48905000012a680"]).toBeTruthy();
    expect(
      Object.keys(qdmCalculationResults["648c6a89f48905000012a680"]).length
    ).toBe(1);
    expect(
      qdmCalculationResults["648c6a89f48905000012a680"]["PopulationSet_1"]
    ).toBeTruthy();
  });

  it("should handle mapping QDM measure group to test case group", () => {
    const measure: Measure = {
      scoring: MeasureScoring.COHORT,
      patientBasis: true,
    } as unknown as Measure;

    const measureGroup: Group = {
      id: "Group1",
      populations: [
        {
          id: "g1pop1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "foo1",
        },
      ],
      measureGroupTypes: [],
    } as unknown as Group;

    const output = calculationService.mapMeasureGroup(measure, measureGroup);
    expect(output).toBeTruthy();
    expect(output.groupId).toEqual("Group1");
    expect(output.populationBasis).toBeTruthy();
    expect(output.populationValues).toBeTruthy();
    expect(output.populationValues.length).toEqual(1);
    expect(output.scoring).toEqual(MeasureScoring.COHORT);
  });

  it("test mapping QDM measure group to test case group with stratifications", () => {
    const measure: Measure = {
      scoring: MeasureScoring.COHORT,
      patientBasis: true,
    } as unknown as Measure;

    const measureGroup: Group = {
      id: "Group1",
      populations: [
        {
          id: "g1pop1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "foo1",
        },
      ],
      stratifications: [
        {
          id: "strat1",
          description: "strat1 description",
          cqlDefinition: "cql definition",
        },
      ],
      measureGroupTypes: [],
    } as unknown as Group;

    const output = calculationService.mapMeasureGroup(measure, measureGroup);

    expect(output).toBeTruthy();
    expect(output.groupId).toEqual("Group1");
    expect(output.populationBasis).toBeTruthy();
    expect(output.populationValues).toBeTruthy();
    expect(output.populationValues.length).toEqual(1);
    expect(output.scoring).toEqual(MeasureScoring.COHORT);
    expect(output.stratificationValues.length).toEqual(1);
    expect(output.stratificationValues[0].name).toEqual("Strata-1 ");
    expect(output.stratificationValues[0].expected).toEqual(false);
    expect(output.stratificationValues[0].actual).toEqual(false);
    expect(output.stratificationValues[0].id).toEqual("strat1");
  });

  it("test mapping QDM measure group to test case group with stratifications and non patient-based", () => {
    const measure: Measure = {
      scoring: MeasureScoring.COHORT,
      patientBasis: false,
    } as unknown as Measure;

    const measureGroup: Group = {
      id: "Group1",
      populations: [
        {
          id: "g1pop1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "foo1",
        },
      ],
      stratifications: [
        {
          id: "strat1",
          description: "strat1 description",
          association: "Episode of Care",
          cqlDefinition: "cql definition",
        },
      ],
      measureGroupTypes: [],
    } as unknown as Group;

    const output = calculationService.mapMeasureGroup(measure, measureGroup);

    expect(output).toBeTruthy();
    expect(output.groupId).toEqual("Group1");
    expect(output.populationBasis).toBeTruthy();
    expect(output.populationValues).toBeTruthy();
    expect(output.populationValues.length).toEqual(1);
    expect(output.scoring).toEqual(MeasureScoring.COHORT);
    expect(output.stratificationValues.length).toEqual(1);
    expect(output.stratificationValues[0].name).toEqual(
      "Strata-1 Episode Of Care"
    );
    expect(output.stratificationValues[0].expected).toEqual(null);
    expect(output.stratificationValues[0].actual).toEqual(null);
    expect(output.stratificationValues[0].id).toEqual("strat1");
  });

  describe("isValuePass", () => {
    it("should return true for patientBasis true", () => {
      const output = calculationService.isValuePass(true, true, true);
      expect(output).toEqual(true);
    });

    it("should return false for patientBasis true", () => {
      const output = calculationService.isValuePass(true, false, true);
      expect(output).toEqual(false);
    });

    it("should return false for missing expected value for patientBasis true", () => {
      const output = calculationService.isValuePass(true, undefined, true);
      expect(output).toEqual(false);
    });

    it("should return true for patientBasis false", () => {
      const output = calculationService.isValuePass(3, 3, false);
      expect(output).toEqual(true);
    });

    it("should return true expected string for patientBasis false", () => {
      const output = calculationService.isValuePass(3, "3", false);
      expect(output).toEqual(true);
    });

    it("should return false for patientBasis false", () => {
      const output = calculationService.isValuePass(3, 2, false);
      expect(output).toEqual(false);
    });

    it("should return false expected string for patientBasis false", () => {
      const output = calculationService.isValuePass(3, "2", false);
      expect(output).toEqual(false);
    });

    it("should return true for missing expected value for patientBasis false", () => {
      const output = calculationService.isValuePass(0, undefined, false);
      expect(output).toEqual(true);
    });

    it("should return false for missing expected value for patientBasis false", () => {
      const output = calculationService.isValuePass(2, undefined, false);
      expect(output).toEqual(false);
    });

    it("test non patient-based and undefined expected value", () => {
      const output = calculationService.isValuePass(null, undefined, false);
      expect(output).toEqual(true);
    });
  });

  describe("CalculationService.isGroupPass", () => {
    it("should pass null group", () => {
      const output = calculationService.isGroupPass(null, true);
      expect(output).toEqual(true);
    });

    it("should pass undefined group", () => {
      const output = calculationService.isGroupPass(undefined, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
      expect(output).toEqual(true);
    });

    it("should fail group with matching populations and failing stratifications for Cohort", () => {
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
      const output = calculationService.isGroupPass(groupPop, true);
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
      const output = calculationService.isGroupPass(groupPop, true);
      expect(output).toEqual(false);
    });
  });

  describe("processTestCaseResults", () => {
    let measureGroups: Group[];
    let measure: Measure;

    beforeEach(() => {
      measureGroups = [
        {
          id: "Group1",
          populations: [
            {
              id: "g1pop1",
              name: PopulationType.INITIAL_POPULATION,
              definition: "foo1",
            },
            {
              id: "g1pop2",
              name: PopulationType.DENOMINATOR,
              definition: "foo3",
            },
            {
              id: "g1pop3",
              name: PopulationType.DENOMINATOR_EXCLUSION,
              definition: "foo7",
            },
            {
              id: "g1pop4",
              name: PopulationType.NUMERATOR,
              definition: "foo2",
            },
            {
              id: "g1pop5",
              name: PopulationType.NUMERATOR_EXCLUSION,
              definition: "foo12",
            },
          ],
          measureGroupTypes: [],
        },
      ];

      measure = {
        scoring: MeasureScoring.PROPORTION,
        patientBasis: true,
        groups: [
          {
            id: "Group1",
            populations: [
              {
                id: "g1pop1",
                name: PopulationType.INITIAL_POPULATION,
                definition: "foo1",
              },
              {
                id: "g1pop2",
                name: PopulationType.DENOMINATOR,
                definition: "foo3",
              },
              {
                id: "g1pop3",
                name: PopulationType.DENOMINATOR_EXCLUSION,
                definition: "foo7",
              },
              {
                id: "g1pop4",
                name: PopulationType.NUMERATOR,
                definition: "foo2",
              },
              {
                id: "g1pop5",
                name: PopulationType.NUMERATOR_EXCLUSION,
                definition: "foo12",
              },
            ],
            measureGroupTypes: [],
          },
          {
            id: "Group2",
            populations: [
              {
                id: "g2pop1",
                name: PopulationType.INITIAL_POPULATION,
                definition: "foo1",
              },
            ],
            measureGroupTypes: [],
          },
        ],
      } as Measure;
    });

    it("should return input for null testCase", () => {
      const testCase: TestCase = null;
      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {};

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).toBeFalsy();
    });

    it("should return input for undefined testCase", () => {
      const testCase: TestCase = undefined;
      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {};

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).toBeFalsy();
    });

    it("test undefined Patient Basis should return non patient-based result", () => {
      const testCase: TestCase = {
        id: "tc1",
        name: "Test IPP",
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        description: "Test IPP",
        title: "WhenAllGood",
        series: "IPP_Pass",
        validResource: true,
        hapiOperationOutcome: null,
        json: "{}",
        executionStatus: null,
        patientId: "patient-1a",
        groupPopulations: [
          {
            groupId: "Group1",
            scoring: MeasureScoring.COHORT,
            populationValues: [
              {
                name: PopulationType.INITIAL_POPULATION,
                expected: 2,
              },
            ] as PopulationExpectedValue[],
          },
        ] as GroupPopulation[],
      };
      measure.scoring = MeasureScoring.COHORT;
      measure.patientBasis = undefined;
      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {
          Group1: {
            IPP: 1,
          },
        };

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).not.toBeFalsy();
      expect(output.groupPopulations.length).toBe(1);
      expect(output.groupPopulations[0].populationValues[0].expected).toBe(2);
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(1);
    });

    it("should return testCase with updated actual values passing patientBasis", () => {
      const testCase: TestCase = {
        id: "tc1",
        name: "Test IPP",
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        description: "Test IPP",
        title: "WhenAllGood",
        series: "IPP_Pass",
        validResource: true,
        hapiOperationOutcome: null,
        json: "{}",
        executionStatus: null,
        patientId: "patient-1a",
        groupPopulations: [
          {
            groupId: "Group1",
            scoring: MeasureScoring.PROPORTION,
            populationValues: [
              {
                name: PopulationType.INITIAL_POPULATION,
                expected: true,
              },
              {
                name: PopulationType.DENOMINATOR,
                expected: true,
              },
              {
                name: PopulationType.NUMERATOR,
                expected: false,
              },
            ] as PopulationExpectedValue[],
            stratificationValues: [
              {
                id: "Strat1ID",
                name: "Strata-1",
                expected: true,
              },
              {
                id: "Strat2ID",
                name: "Strata-2",
                expected: true,
              },
            ],
          },
        ] as GroupPopulation[],
      };

      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {
          Group1: {
            IPP: 1,
            DENOM: 1,
            NUMER: 1,
          },
          PopulationSet_1_Stratification_1: {
            IPP: 1,
            DENOM: 1,
            NUMBER: 1,
            STRAT: 1,
          },
          PopulationSet_1_Stratification_2: {
            IPP: 1,
            DENOM: 1,
            NUMBER: 1,
            STRAT: 1,
          },
        };

      const groupStrats: Stratification[] = [
        { cqlDefinition: "foo1", id: "Strata1ID" },
        { cqlDefinition: "foo3", id: "Strata2ID" },
      ];

      measure.patientBasis = true;
      measure.groups[0].populationBasis = "true";

      measureGroups[0].stratifications = [...groupStrats];
      measure.groups[0].stratifications = [...groupStrats];

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();
      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(3);
      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        "initialPopulation"
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(true);
      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        "denominator"
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(true);
      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        "numerator"
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(true);
      expect(output.groupPopulations[0].stratificationValues[0].expected).toBe(
        true
      );
      expect(output.groupPopulations[0].stratificationValues[0].actual).toBe(
        true
      );
      expect(output.groupPopulations[0].stratificationValues[1].expected).toBe(
        true
      );
      expect(output.groupPopulations[0].stratificationValues[1].actual).toBe(
        true
      );
    });

    it("should return testCase with updated actual values passing non-patientBasis", () => {
      const testCase: TestCase = {
        id: "tc1",
        name: "Test IPP",
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        description: "Test IPP",
        title: "WhenAllGood",
        series: "IPP_Pass",
        validResource: true,
        hapiOperationOutcome: null,
        json: "{}",
        executionStatus: null,
        patientId: "patient-1a",
        groupPopulations: [
          {
            groupId: "Group1",
            scoring: MeasureScoring.PROPORTION,
            populationValues: [
              {
                name: PopulationType.INITIAL_POPULATION,
                expected: 2,
              },
              {
                name: PopulationType.DENOMINATOR,
                expected: 1,
              },
              {
                name: PopulationType.NUMERATOR,
                expected: 0,
              },
            ] as PopulationExpectedValue[],
          },
        ] as GroupPopulation[],
      };
      measure.scoring = MeasureScoring.PROPORTION;
      measure.patientBasis = false;

      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {
          Group1: {
            IPP: 2,
            DENOM: 1,
            NUMER: 0,
          },
        };

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();
      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(3);
      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        "initialPopulation"
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(2);
      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        "denominator"
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(1);
      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        "numerator"
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(0);
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
    });

    it("should return testCase with updated actual values passing non-patientBasis denex", () => {
      const testCase: TestCase = {
        id: "tc1",
        name: "Test IPP",
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        description: "Test IPP",
        title: "WhenAllGood",
        series: "IPP_Pass",
        validResource: true,
        hapiOperationOutcome: null,
        json: "{}",
        executionStatus: null,
        patientId: "patient-1a",
        groupPopulations: [
          {
            groupId: "Group1",
            scoring: MeasureScoring.PROPORTION,
            populationValues: [
              {
                name: PopulationType.INITIAL_POPULATION,
                expected: 2,
              },
              {
                name: PopulationType.DENOMINATOR,
                expected: 1,
              },
              {
                name: PopulationType.DENOMINATOR_EXCLUSION,
                expected: 1,
              },
              {
                name: PopulationType.NUMERATOR,
                expected: 0,
              },
              {
                name: PopulationType.NUMERATOR_EXCLUSION,
                expected: 0,
              },
            ] as PopulationExpectedValue[],
          },
        ] as GroupPopulation[],
      };
      measure.scoring = MeasureScoring.PROPORTION;
      measure.patientBasis = false;

      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {
          Group1: {
            IPP: 2,
            DENOM: 1,
            DENEX: 1,
            NUMER: 0,
            NUMEX: 0,
          },
        };

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();
      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(5);

      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(2);

      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        PopulationType.DENOMINATOR
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(1);

      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        PopulationType.DENOMINATOR_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(1);

      expect(output.groupPopulations[0].populationValues[3].name).toEqual(
        PopulationType.NUMERATOR
      );
      expect(output.groupPopulations[0].populationValues[3].actual).toBe(0);

      expect(output.groupPopulations[0].populationValues[4].name).toEqual(
        PopulationType.NUMERATOR_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[4].actual).toBe(0);
      expect(output.groupPopulations[0].populationValues[4].expected).toBe(0);
      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
    });

    it("should return testCase with updated actual values failing non-patientBasis", () => {
      const testCase: TestCase = {
        id: "tc1",
        name: "Test IPP",
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        description: "Test IPP",
        title: "WhenAllGood",
        series: "IPP_Pass",
        validResource: true,
        hapiOperationOutcome: null,
        json: "{}",
        executionStatus: null,
        patientId: "patient-1a",
        groupPopulations: [
          {
            groupId: "Group1",
            scoring: MeasureScoring.PROPORTION,
            populationValues: [
              {
                name: "initialPopulation",
                expected: 2,
              },
              {
                name: "denominator",
                expected: 1,
              },
              {
                name: "numerator",
                expected: 0,
              },
            ] as PopulationExpectedValue[],
          },
        ] as GroupPopulation[],
      };
      measure.scoring = MeasureScoring.PROPORTION;
      measure.patientBasis = false;

      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {
          Group1: {
            IPP: 2,
            DENOM: 2,
            NUMER: 1,
          },
        };

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();
      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(3);
      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        "initialPopulation"
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(2);
      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        "denominator"
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(2);
      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        "numerator"
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(1);
      expect(output.executionStatus).toEqual(ExecutionStatusType.FAIL);
    });

    it("should return testCase with mapped group and updated actual values failing non-patientBasis", () => {
      const testCase: TestCase = {
        id: "tc1",
        name: "Test IPP",
        createdAt: "",
        createdBy: "",
        lastModifiedAt: "",
        lastModifiedBy: "",
        description: "Test IPP",
        title: "WhenAllGood",
        series: "IPP_Pass",
        validResource: true,
        hapiOperationOutcome: null,
        json: "{}",
        executionStatus: null,
        patientId: "patient-1a",
        groupPopulations: null,
      };
      measure.scoring = MeasureScoring.PROPORTION;
      measure.patientBasis = false;

      const populationGroupResults: CqmExecutionPatientResultsByPopulationSet =
        {
          Group1: {
            IPP: 2,
            DENOM: 2,
            NUMER: 1,
          },
        };

      const output = calculationService.processTestCaseResults(
        testCase,
        measureGroups,
        measure,
        populationGroupResults
      );
      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();
      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(5);

      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(2);

      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        PopulationType.DENOMINATOR
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(2);

      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        PopulationType.DENOMINATOR_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(
        undefined
      );
      expect(
        output.groupPopulations[0].populationValues[2].expected
      ).toBeFalsy();

      expect(output.groupPopulations[0].populationValues[3].name).toEqual(
        PopulationType.NUMERATOR
      );
      expect(output.groupPopulations[0].populationValues[3].actual).toBe(1);

      expect(output.groupPopulations[0].populationValues[4].name).toEqual(
        PopulationType.NUMERATOR_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[4].actual).toBe(
        undefined
      );
      expect(
        output.groupPopulations[0].populationValues[4].expected
      ).toBeFalsy();
      expect(output.executionStatus).toEqual(ExecutionStatusType.FAIL);
    });

    it("should return testCase with actual values passing for patientBasis CV", () => {
      const output = calculationService.processTestCaseResults(
        CV_PATIENT_WITH_OBS_RESULTS.testCase,
        CV_PATIENT_WITH_OBS_RESULTS.measureGroups,
        CV_PATIENT_WITH_OBS_RESULTS.measure,
        CV_PATIENT_WITH_OBS_RESULTS.patientResults
      );

      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();

      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(4);

      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(true);

      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        PopulationType.MEASURE_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(true);

      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        PopulationType.MEASURE_POPULATION_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[2].expected).toBe(
        null
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(false);

      expect(output.groupPopulations[0].populationValues[3].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(output.groupPopulations[0].populationValues[3].actual).toBe(22);

      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
    });

    it("should return testCase with actual values passing for episode CV", () => {
      const output = calculationService.processTestCaseResults(
        CV_EPISODE_WITH_OBS_RESULTS.testCase,
        CV_EPISODE_WITH_OBS_RESULTS.measureGroups,
        CV_EPISODE_WITH_OBS_RESULTS.measure,
        CV_EPISODE_WITH_OBS_RESULTS.patientResults
      );

      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();

      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(4);

      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(3);

      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        PopulationType.MEASURE_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(3);

      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        PopulationType.MEASURE_OBSERVATION
      );
      expect(output.groupPopulations[0].populationValues[2].expected).toBe(6);
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(6);

      expect(output.groupPopulations[0].populationValues[3].name).toEqual(
        PopulationType.MEASURE_POPULATION_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[3].actual).toBe(2);

      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
    });

    it("should return testCase with actual values passing for patientBasis Ratio", () => {
      const output = calculationService.processTestCaseResults(
        RATIO_PATIENTBASED_WITH_OBS_RESULTS.testCase,
        RATIO_PATIENTBASED_WITH_OBS_RESULTS.measureGroups,
        RATIO_PATIENTBASED_WITH_OBS_RESULTS.measure,
        RATIO_PATIENTBASED_WITH_OBS_RESULTS.patientResults
      );
      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();

      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(5);

      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(true);

      expect(output.groupPopulations[0].populationValues[1].actual).toBe(true);

      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        PopulationType.DENOMINATOR
      );

      expect(output.groupPopulations[0].populationValues[4].name).toEqual(
        PopulationType.NUMERATOR_OBSERVATION
      );

      expect(output.groupPopulations[0].populationValues[4].actual).toBe(12);
    });

    it("should return testCase with actual values passing for episode Ratio", () => {
      const output = calculationService.processTestCaseResults(
        {
          ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.testCase,
          groupPopulations: [
            {
              ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.testCase
                .groupPopulations[0],
            },
            {
              ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.testCase
                .groupPopulations[1],
            },
          ],
        },
        [
          { ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.measureGroups[0] },
          { ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.measureGroups[1] },
        ],
        {
          ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.measure,
          groups: [
            { ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.measure.groups[0] },
            { ...RATIO_EPISODEBASED_WITH_OBS_RESULTS.measure.groups[1] },
          ],
        },
        RATIO_EPISODEBASED_WITH_OBS_RESULTS.patientResults
      );

      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();
      expect(output.groupPopulations.length).toEqual(2);

      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(7);
      expect(output.groupPopulations[1].populationValues).toBeTruthy();
      expect(output.groupPopulations[1].populationValues.length).toEqual(6);

      expect(output.groupPopulations[0].populationValues[0]).toBeTruthy();
      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        PopulationType.DENOMINATOR
      );
      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        PopulationType.DENOMINATOR_OBSERVATION
      );
      expect(output.groupPopulations[0].populationValues[3].name).toEqual(
        PopulationType.DENOMINATOR_OBSERVATION
      );
      expect(output.groupPopulations[0].populationValues[4].name).toEqual(
        PopulationType.DENOMINATOR_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[5].name).toEqual(
        PopulationType.NUMERATOR
      );
      expect(output.groupPopulations[0].populationValues[6].name).toEqual(
        PopulationType.NUMERATOR_OBSERVATION
      );

      expect(output.executionStatus).toEqual(ExecutionStatusType.PASS);
    });

    it("should return testCase with actual values failing for episode Ratio", () => {
      const output = calculationService.processTestCaseResults(
        RATIO_EPISODEBASED_WITH_OBS_RESULTS.testCase,
        RATIO_EPISODEBASED_WITH_OBS_RESULTS.measureGroups,
        RATIO_EPISODEBASED_WITH_OBS_RESULTS.measure,
        RATIO_EPISODEBASED_WITH_OBS_RESULTS.patientResults
      );

      expect(output).toBeTruthy();
      expect(output.groupPopulations).toBeTruthy();
      expect(output.groupPopulations.length).toEqual(3);

      expect(output.groupPopulations[0].populationValues).toBeTruthy();
      expect(output.groupPopulations[0].populationValues.length).toEqual(7);
      expect(output.groupPopulations[1].populationValues).toBeTruthy();
      expect(output.groupPopulations[1].populationValues.length).toEqual(6);
      expect(output.groupPopulations[2].populationValues).toBeTruthy();
      expect(output.groupPopulations[2].populationValues.length).toEqual(10);

      expect(output.groupPopulations[2].populationValues[0]).toBeTruthy();
      expect(output.groupPopulations[2].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[2].populationValues[1].name).toEqual(
        PopulationType.DENOMINATOR
      );
      expect(output.groupPopulations[2].populationValues[2].name).toEqual(
        PopulationType.DENOMINATOR_OBSERVATION
      );
      expect(output.groupPopulations[2].populationValues[3].name).toEqual(
        PopulationType.DENOMINATOR_OBSERVATION
      );
      expect(output.groupPopulations[2].populationValues[4].name).toEqual(
        PopulationType.DENOMINATOR_OBSERVATION
      );
      expect(output.groupPopulations[2].populationValues[5].name).toEqual(
        PopulationType.DENOMINATOR_OBSERVATION
      );
      expect(output.groupPopulations[2].populationValues[6].name).toEqual(
        PopulationType.NUMERATOR
      );
      expect(output.groupPopulations[2].populationValues[7].name).toEqual(
        PopulationType.NUMERATOR_OBSERVATION
      );
      expect(output.groupPopulations[2].populationValues[8].name).toEqual(
        PopulationType.NUMERATOR_OBSERVATION
      );
      expect(output.groupPopulations[2].populationValues[9].name).toEqual(
        PopulationType.NUMERATOR_OBSERVATION
      );
      expect(output.groupPopulations[2].populationValues[9].expected).toEqual(
        0
      );
      expect(output.groupPopulations[2].populationValues[9].actual).toEqual(6);

      expect(output.executionStatus).toEqual(ExecutionStatusType.FAIL);
    });

    it("Should return testCase with actual values passing for CV episode based measure with Stratifications", () => {
      const output = calculationService.processTestCaseResults(
        CV_EPISODE_WITH_STRAT_OBS_RESULTS.testCase,
        CV_EPISODE_WITH_STRAT_OBS_RESULTS.measureGroups,
        CV_EPISODE_WITH_STRAT_OBS_RESULTS.measure,
        CV_EPISODE_WITH_STRAT_OBS_RESULTS.patientResults
      );

      expect(output).toBeTruthy();
      expect(output.groupPopulations[0].populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[0].actual).toEqual(2);
      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        PopulationType.MEASURE_POPULATION
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toEqual(2);
      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toEqual(60);
      expect(output.groupPopulations[0].populationValues[3].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(output.groupPopulations[0].populationValues[3].actual).toEqual(5);
      expect(output.groupPopulations[0].populationValues[4].name).toEqual(
        PopulationType.MEASURE_POPULATION_EXCLUSION
      );
      expect(output.groupPopulations[0].populationValues[4].actual).toEqual(0);

      // verify stratification values
      const strat1 = output.groupPopulations[0].stratificationValues[0];
      expect(strat1.name).toEqual("Strata-1");
      expect(strat1.actual).toEqual(1);
      expect(strat1.populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(strat1.populationValues[0].actual).toEqual(1);
      expect(strat1.populationValues[1].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(strat1.populationValues[1].actual).toEqual(60);
      expect(strat1.populationValues[2].name).toEqual(
        PopulationType.MEASURE_POPULATION
      );
      expect(strat1.populationValues[2].actual).toEqual(1);
      expect(strat1.populationValues[3].name).toEqual(
        PopulationType.MEASURE_POPULATION_EXCLUSION
      );
      expect(strat1.populationValues[3].actual).toEqual(0);

      const strat2 = output.groupPopulations[0].stratificationValues[1];
      expect(strat2.name).toEqual("Strata-2");
      expect(strat2.actual).toEqual(1);
      expect(strat2.populationValues[0].name).toEqual(
        PopulationType.INITIAL_POPULATION
      );
      expect(strat2.populationValues[0].actual).toEqual(1);
      expect(strat2.populationValues[1].name).toEqual(
        PopulationType.MEASURE_POPULATION_OBSERVATION
      );
      expect(strat2.populationValues[1].actual).toEqual(5);
      expect(strat2.populationValues[2].name).toEqual(
        PopulationType.MEASURE_POPULATION
      );
      expect(strat2.populationValues[2].actual).toEqual(1);
      expect(strat2.populationValues[3].name).toEqual(
        PopulationType.MEASURE_POPULATION_EXCLUSION
      );
      expect(strat2.populationValues[3].actual).toEqual(0);
    });
  });

  describe("getEpisodeObservationResult", () => {
    it("should return undefined for no episode results", () => {
      const population = {
        id: "pop1",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 2,
      } as unknown as PopulationExpectedValue;
      const episodeResults = {};

      const output = calculationService.getEpisodeObservationResult(
        population,
        episodeResults,
        0
      );

      expect(output).toBeFalsy();
    });

    it("should return first observation result for denominator obs", () => {
      const population = {
        id: "pop1",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 2,
      } as unknown as PopulationExpectedValue;
      const episodeResults = {
        "6540f0cad9f99000000a50d5": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [2, 5],
        },
        "654275f7fb870d00005a0a35": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [],
        },
      };

      const output = calculationService.getEpisodeObservationResult(
        population,
        episodeResults,
        0
      );

      expect(output).toEqual(2);
    });

    it("should return second observation result for denominator obs", () => {
      const population = {
        id: "pop1",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 2,
      } as unknown as PopulationExpectedValue;
      const episodeResults = {
        "6540f0cad9f99000000a50d5": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [2, 5],
        },
        "654275f7fb870d00005a0a35": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [3, 8],
        },
      };

      const output = calculationService.getEpisodeObservationResult(
        population,
        episodeResults,
        1
      );

      expect(output).toEqual(3);
    });

    it("should skip first observation result for denex", () => {
      const population = {
        id: "pop1",
        name: PopulationType.DENOMINATOR_OBSERVATION,
        expected: 2,
      } as unknown as PopulationExpectedValue;
      const episodeResults = {
        "6540f0cad9f99000000a50d5": {
          IPP: 1,
          DENOM: 1,
          DENEX: 1,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [0, 5],
        },
        "654275f7fb870d00005a0a35": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [3, 8],
        },
      };

      const output = calculationService.getEpisodeObservationResult(
        population,
        episodeResults,
        0
      );

      expect(output).toEqual(3);
    });

    it("should return first numerator for numerator obs", () => {
      const population = {
        id: "pop1",
        name: PopulationType.NUMERATOR_OBSERVATION,
        expected: 2,
      } as unknown as PopulationExpectedValue;
      const episodeResults = {
        "6540f0cad9f99000000a50d5": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [2, 5],
        },
        "654275f7fb870d00005a0a35": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [3, 8],
        },
      };

      const output = calculationService.getEpisodeObservationResult(
        population,
        episodeResults,
        0
      );

      expect(output).toEqual(5);
    });

    it("should return first numerator for numerator obs without denom obs", () => {
      const population = {
        id: "pop1",
        name: PopulationType.NUMERATOR_OBSERVATION,
        expected: 2,
      } as unknown as PopulationExpectedValue;
      const episodeResults = {
        "6540f0cad9f99000000a50d5": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [5],
        },
        "654275f7fb870d00005a0a35": {
          IPP: 1,
          DENOM: 1,
          DENEX: 0,
          NUMER: 1,
          NUMEX: 0,
          observation_values: [8],
        },
      };

      const output = calculationService.getEpisodeObservationResult(
        population,
        episodeResults,
        0
      );

      expect(output).toEqual(5);
    });
  });

  describe("mapPatientBasedObservations", () => {
    it("mapping QDM patient based observation actual results when denom is 1 and denex is 0", () => {
      const populationGroup = {
        id: "denominatorObservation0",
        name: "denominatorObservation",
        expected: "10",
      };
      const denominatorObservationActualValue =
        calculationService.mapPatientBasedObservations(
          populationGroup,
          actualCalculationResults
        );
      expect(denominatorObservationActualValue).toBe(10);
    });

    it("mapping QDM patient based observation actual results when (denom is 1 and denex is 1) or when denom is 0", () => {
      const populationGroup = {
        id: "denominatorObservation0",
        name: "denominatorObservation",
        expected: "10",
      };

      actualCalculationResults.DENEX = 1;
      const denominatorObservationActualValueWithExclusion =
        calculationService.mapPatientBasedObservations(
          populationGroup,
          actualCalculationResults
        );
      expect(denominatorObservationActualValueWithExclusion).toBe("NA");

      actualCalculationResults.DENOM = 1;
      const denominatorObservationActualValue =
        calculationService.mapPatientBasedObservations(
          populationGroup,
          actualCalculationResults
        );
      expect(denominatorObservationActualValue).toBe("NA");
    });

    it("mapping QDM patient based observation actual results when numer is 1 and numex is 0", () => {
      const populationGroup = {
        id: "numeratorObservation0",
        name: "numeratorObservation",
        expected: "12",
      };

      const numeratorObservationActualValue =
        calculationService.mapPatientBasedObservations(
          populationGroup,
          actualCalculationResults
        );
      expect(numeratorObservationActualValue).toBe(12);
    });

    it("mapping QDM patient based observation actual results when (numer is 1 and numex is 1) or when numer is 0", () => {
      const populationGroup = {
        id: "numeratorObservation0",
        name: "numeratorObservation",
        expected: "12",
      };

      actualCalculationResults.NUMEX = 1;
      const numeratorObservationActualValueWithExclusion =
        calculationService.mapPatientBasedObservations(
          populationGroup,
          actualCalculationResults
        );
      expect(numeratorObservationActualValueWithExclusion).toBe("NA");

      actualCalculationResults.NUMER = 1;
      const numeratorObservationActualValue =
        calculationService.mapPatientBasedObservations(
          populationGroup,
          actualCalculationResults
        );
      expect(numeratorObservationActualValue).toBe("NA");
    });
  });

  describe("hook", () => {
    it("should return an instance of the service when hook is called", () => {
      const calc = qdmCalculationService();
      expect(calc).toBeTruthy();
    });
  });
});
