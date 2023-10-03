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
  TestCase,
} from "@madie/madie-models";
import { ExecutionStatusType } from "./CalculationService";

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
      stratifications: [{ id: "strat1", description: "strat1 description" }],
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
      expect(output.groupPopulations[0].populationValues[0].actual).toBe(true);
      expect(output.groupPopulations[0].populationValues[1].name).toEqual(
        "denominator"
      );
      expect(output.groupPopulations[0].populationValues[1].actual).toBe(true);
      expect(output.groupPopulations[0].populationValues[2].name).toEqual(
        "numerator"
      );
      expect(output.groupPopulations[0].populationValues[2].actual).toBe(true);
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
  });

  describe("hook", () => {
    it("should return an instance of the service when hook is called", () => {
      const calc = qdmCalculationService();
      expect(calc).toBeTruthy();
    });
  });
});
