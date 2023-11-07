import {
  PopulationType,
  GroupPopulation,
  DisplayPopulationValue,
  DisplayStratificationValue,
  Measure,
  Group,
  MeasureScoring,
} from "@madie/madie-models";
import {
  triggerPopChanges,
  getValueFromBoolOrNum,
  mapExistingTestCasePopulations,
} from "../util/PopulationsMap";

let measureGroup = [
  {
    id: "shrug",
    measureName: "the measure for testing",
    cql: "",
    elmJson: "",
    createdBy: "testuser@example.com",
    measureObservations: [
      {
        id: "uuid-1",
        definition: "fun",
        criteriaReference: "pid-2",
      },
      {
        id: "uuid-2",
        definition: "fun",
        criteriaReference: "pid-4",
      },
    ],
    scoring: "Ratio",
    populationBasis: "boolean",
  },
];
let measureGroup2 = [
  {
    id: "shrug",
    measureName: "the measure for testing",
    cql: "",
    elmJson: "",
    createdBy: "testuser@example.com",
    measureObservations: [
      {
        id: "uuid-1",
        definition: "fun",
        criteriaReference: "pid-2",
      },
      {
        id: "uuid-2",
        definition: "fun",
        criteriaReference: "pid-4",
      },
    ],
    scoring: "Ratio",
    populationBasis: "Encounter",
  },
];
it("shall return array of populationexpectvalues with no observations if denomr expected are zero", () => {
  const populationVal: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.DENOMINATOR,
    expected: 0,
    actual: undefined,
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(populationVal);

  const groupPop1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues,
    stratificationValues: [],
  };

  const groupPopulations: GroupPopulation[] = [groupPop1];

  const resultPops = triggerPopChanges(
    groupPopulations,
    groupPop1.groupId,
    {
      id: "1",
      name: PopulationType.DENOMINATOR,
      expected: 0,
      actual: undefined,
    },
    measureGroup
  );
  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual(
    PopulationType.DENOMINATOR
  );
});

it("shall return array of populationexpectvalues with no observations if numer expected are zero", () => {
  const ippPopulationVal: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: undefined,
  };

  const denomPopulationVal: DisplayPopulationValue = {
    id: "2",
    name: PopulationType.DENOMINATOR,
    expected: 0,
    actual: undefined,
  };
  const numerPopulationVal: DisplayPopulationValue = {
    id: "3",
    name: PopulationType.NUMERATOR,
    expected: 0,
    actual: undefined,
  };
  const numerObservValue: DisplayPopulationValue = {
    id: "o-3",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: 0,
    actual: undefined,
    criteriaReference: "3",
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ippPopulationVal);
  populationValues.push(denomPopulationVal);
  populationValues.push(numerPopulationVal);
  populationValues.push(numerObservValue);

  const groupPop1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues,
    stratificationValues: [],
  };

  const groupPopulations: GroupPopulation[] = [groupPop1];

  const resultPops = triggerPopChanges(
    groupPopulations,
    groupPop1.groupId,
    {
      id: "1",
      name: PopulationType.NUMERATOR,
      expected: 0,
      actual: undefined,
    },
    measureGroup
  );
  expect(resultPops[0].populationValues.length).toEqual(3);

  expect(resultPops[0].populationValues[0].name).toEqual(
    PopulationType.INITIAL_POPULATION
  );
  expect(resultPops[0].populationValues[1].name).toEqual(
    PopulationType.DENOMINATOR
  );
  expect(resultPops[0].populationValues[2].name).toEqual(
    PopulationType.NUMERATOR
  );
});
it("Does number | boolean => number correctly; true returns 1", () => {
  const rows = getValueFromBoolOrNum(true);
  expect(rows).toEqual(1);
});
it("Does number | boolean => number correctly; false returns 0 ", () => {
  const rows = getValueFromBoolOrNum(false);
  expect(rows).toEqual(0);
});
it("Does number | boolean => number correctly; number > 1 returns number", () => {
  const rows = getValueFromBoolOrNum(3);
  expect(rows).toEqual(3);
});

it("shall not add an observation if denominator expected value changes from 0 to 1, but no observation exists", () => {
  const ippPopulationVal: DisplayPopulationValue = {
    id: "3",
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: undefined,
  };

  const denomPopulationVal: DisplayPopulationValue = {
    id: "2",
    name: PopulationType.DENOMINATOR,
    expected: 0,
    actual: undefined,
  };

  const denomObservValue: DisplayPopulationValue = {
    id: "o-3",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: 1,
    actual: undefined,
    criteriaReference: "2",
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ippPopulationVal);
  populationValues.push(denomPopulationVal);
  populationValues.push(denomObservValue);

  const groupPop1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues,
    stratificationValues: [],
  };

  const groupPopulations: GroupPopulation[] = [groupPop1];

  const resultPops: GroupPopulation[] = triggerPopChanges(
    groupPopulations,
    groupPop1.groupId,
    {
      id: "1",
      name: PopulationType.DENOMINATOR,
      expected: 1,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops[0].populationValues.length).toEqual(2);
});

it("shall remove an observation if denominator_exclusion is added, and an observation exists", () => {
  const ippPopulationVal: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: undefined,
  };

  const denomPopulationVal: DisplayPopulationValue = {
    id: "pid-2",
    name: PopulationType.DENOMINATOR,
    expected: 2,
    actual: undefined,
  };
  const denomExclusion: DisplayPopulationValue = {
    id: "3",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: 1,
    actual: undefined,
  };

  const denomObservValue: DisplayPopulationValue = {
    id: "o-3",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: 1,
    actual: undefined,
    criteriaReference: "2",
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ippPopulationVal);
  populationValues.push(denomPopulationVal);
  populationValues.push(denomExclusion);
  populationValues.push(denomObservValue);

  const groupPop1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues,
    stratificationValues: [],
  };

  const groupPopulations: GroupPopulation[] = [groupPop1];
  let myMeasureGroup = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          id: "uuid-1",
          definition: "fun",
          criteriaReference: "pid-2",
        },
      ],
      scoring: "Ratio",
      populationBasis: "Encounter",
    },
  ];
  const resultPops: GroupPopulation[] = triggerPopChanges(
    groupPopulations,
    groupPop1.groupId,
    {
      id: "3",
      name: PopulationType.DENOMINATOR_EXCLUSION,
      expected: 1,
      actual: undefined,
    },
    myMeasureGroup
  );

  expect(resultPops[0].populationValues.length).toEqual(4);
});

it("shall add an observation if numerator expected value changes from 0 to 1, and an observation exists", () => {
  const ippPopulationVal: DisplayPopulationValue = {
    id: "pid-1",
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: undefined,
  };

  const denomPopulationVal: DisplayPopulationValue = {
    id: "pid-2",
    name: PopulationType.DENOMINATOR,
    expected: 0,
    actual: undefined,
  };

  const numerPopulationVal: DisplayPopulationValue = {
    id: "pid-3",
    name: PopulationType.NUMERATOR,
    expected: 1,
    actual: undefined,
  };

  const numerObservValue: DisplayPopulationValue = {
    id: "o-3",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: 1,
    actual: undefined,
    criteriaReference: "pid-3",
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ippPopulationVal);
  populationValues.push(denomPopulationVal);
  populationValues.push(numerPopulationVal);
  populationValues.push(numerObservValue);

  const groupPop1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues,
    stratificationValues: [],
  };

  const groupPopulations: GroupPopulation[] = [groupPop1];
  const measureGroup3 = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          id: "uuid-2",
          definition: "fun",
          criteriaReference: "pid-3",
        },
      ],
      scoring: "Ratio",
      populationBasis: "Encounter",
    },
  ];
  const resultPops: GroupPopulation[] = triggerPopChanges(
    groupPopulations,
    groupPop1.groupId,
    {
      id: "pid-3",
      name: PopulationType.NUMERATOR,
      expected: 1,
      actual: undefined,
    },
    measureGroup3
  );

  expect(resultPops[0].populationValues.length).toEqual(4);

  expect(resultPops[0].populationValues[0].name).toEqual(
    PopulationType.INITIAL_POPULATION
  );
  expect(resultPops[0].populationValues[1].name).toEqual(
    PopulationType.DENOMINATOR
  );
  expect(resultPops[0].populationValues[2].name).toEqual(
    PopulationType.NUMERATOR
  );
  expect(resultPops[0].populationValues[3].name).toEqual(
    PopulationType.NUMERATOR_OBSERVATION
  );
  expect(resultPops[0].populationValues[3].id).toEqual("numeratorObservation0");
});

it("shall add an observation if measure population for CV group changes from 0 to 1", () => {
  const initialPopulation: DisplayPopulationValue = {
    id: "pid-1",
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: undefined,
  };

  const measurePopulation: DisplayPopulationValue = {
    id: "pid-2",
    name: PopulationType.MEASURE_POPULATION,
    expected: 1,
    actual: undefined,
  };

  const measureObservation: DisplayPopulationValue = {
    id: "o-3",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: 1,
    actual: undefined,
    criteriaReference: "pid-2",
  };

  const populationValues: DisplayPopulationValue[] = [
    initialPopulation,
    measurePopulation,
    measureObservation,
  ];

  const testCaseGroup: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: MeasureScoring.CONTINUOUS_VARIABLE,
    populationValues,
    stratificationValues: [],
  };

  const testCaseGroups: GroupPopulation[] = [testCaseGroup];
  const measureGroup = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "test-user",
      measureObservations: [
        {
          id: "uuid-2",
          definition: "fun",
          criteriaReference: "pid-2",
        },
      ],
      scoring: MeasureScoring.CONTINUOUS_VARIABLE,
      populationBasis: "Encounter",
    },
  ];
  const resultPops: GroupPopulation[] = triggerPopChanges(
    testCaseGroups,
    testCaseGroup.groupId,
    {
      id: "pid-3",
      name: PopulationType.MEASURE_POPULATION,
      expected: 1,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops[0].populationValues.length).toEqual(3);

  expect(resultPops[0].populationValues[0].name).toEqual(
    PopulationType.INITIAL_POPULATION
  );
  expect(resultPops[0].populationValues[1].name).toEqual(
    PopulationType.MEASURE_POPULATION
  );
  expect(resultPops[0].populationValues[2].name).toEqual(
    PopulationType.MEASURE_POPULATION_OBSERVATION
  );
});

it("return the input matches output with no changes", () => {
  const populationVal: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const stratVal1: DisplayStratificationValue = {
    id: "1",
    name: "strata-1",
    expected: true,
  };
  const stratVal2: DisplayStratificationValue = {
    id: "2",
    name: "strata-2",
    expected: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(populationVal);
  const groupPop1: GroupPopulation = {
    groupId: "initialPopulation",
    populationBasis: "boolean",
    scoring: "Cohort",
    populationValues: populationValues,
    stratificationValues: [stratVal1, stratVal2],
  };
  const groupPopulations: GroupPopulation[] = [groupPop1];
  const measure = {} as Measure;
  const group1 = {} as Group;

  const resultPops = triggerPopChanges(
    groupPopulations,
    groupPop1.groupId,
    {
      id: "1",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
  expect(resultPops[0].stratificationValues[0].name).toEqual("strata-1");
  expect(resultPops[0].stratificationValues[0].expected).toBeTruthy();

  expect(resultPops[0].stratificationValues[1].name).toEqual("strata-2");
  expect(resultPops[0].stratificationValues[1].expected).toBeFalsy();
});

it("return the input matches output with strat expected change", () => {
  const populationVal: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const stratVal1: DisplayStratificationValue = {
    id: "1",
    name: "strata-1",
    expected: true,
  };
  const stratVal2: DisplayStratificationValue = {
    id: "2",
    name: "strata-2",
    expected: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(populationVal);
  const groupPop1: GroupPopulation = {
    groupId: "initialPopulation",
    populationBasis: "boolean",
    scoring: "Cohort",
    populationValues: populationValues,
    stratificationValues: [stratVal1, stratVal2],
  };
  const groupPopulations: GroupPopulation[] = [groupPop1];
  const measure = {} as Measure;
  const group1 = {} as Group;

  const resultPops = triggerPopChanges(
    groupPopulations,
    groupPop1.groupId,
    {
      id: "2",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
  expect(resultPops[0].stratificationValues[0].name).toEqual("strata-1");
  expect(resultPops[0].stratificationValues[0].expected).toBeTruthy();

  expect(resultPops[0].stratificationValues[1].name).toEqual("strata-2");
  expect(resultPops[0].stratificationValues[1].expected).toBeTruthy();
});

it("return the input matches output with no changes if targetId not found", () => {
  const populationVal: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(populationVal);
  const group1: GroupPopulation = {
    groupId: "initialPopulation",
    populationBasis: "boolean",
    scoring: "Cohort",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [group1];

  const resultPops = triggerPopChanges(
    groupPopulations,
    "WRONG_ID",
    {
      id: "1",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
});

it("return the input with IPP changed to Expected because Denom is Expected", () => {
  const ipp: DisplayPopulationValue = {
    id: "ipp",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "denom",
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "denomExcep",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "denomExclu",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "numer",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "numerExclu",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);
  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.DENOMINATOR,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected because Denom Exception is Expected", () => {
  const ipp: DisplayPopulationValue = {
    id: "ipp",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "denom",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "denomExcep",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "denomExclu",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "numer",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "numerExclu",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.DENOMINATOR_EXCEPTION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected because Numer is Expected", () => {
  const ipp: DisplayPopulationValue = {
    id: "ipp",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "denom",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "denomExcep",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "denomExclu",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "numer",
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "numerExclu",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.NUMERATOR,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Numer is Unchecked", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.NUMERATOR,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Denom Exception is checked", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.DENOMINATOR_EXCEPTION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Denom Exclusion is checked", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.DENOMINATOR_EXCLUSION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected and Numer Expected when Numer Exclusion is checked", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.NUMERATOR_EXCLUSION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("when Denom is unchecked, then Numer, Denom Exclusion, Denom Exception, Numerator Exclusion should also be uncheked", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.DENOMINATOR,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCLUSION,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCEPTION,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR_EXCLUSION,
      "Proportion"
    )
  ).toBeFalsy();
});

it("when IPP is unchecked then rest of populations expected values should also be unchecked", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: DisplayPopulationValue = {
    id: "",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "1",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeFalsy();
});

it("CV Bool  MsrPop = true; MsrPopEx; true; 1 Measure Observation: should result in 0 MeasurePopulationObservation results ", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const msrpopl: DisplayPopulationValue = {
    id: "MSRPOP",
    name: PopulationType.MEASURE_POPULATION,
    expected: true,
    actual: false,
  };
  const msrpoplex: DisplayPopulationValue = {
    id: "MSRPOPEXCL",
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: true,
    actual: false,
  };
  const measureObserv: DisplayPopulationValue = {
    id: "MSROBV",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: true,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(msrpopl);
  populationValues.push(msrpoplex);
  populationValues.push(measureObserv);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Continuous Variable",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  let measureGroup4 = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          id: "MSROBV",
          expected: 0,
          actual: 0,
          criteriaReference: "MSRPOP",
        },
      ],
      scoring: "Continuous Variable",
      populationBasis: "Boolean",
    },
  ];

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "MSRPOPEXCL",
      criteriaReference: "",
    },
    measureGroup4
  );

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Continuous Variable"
    ).name
  ).toEqual(PopulationType.INITIAL_POPULATION);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_POPULATION_OBSERVATION,
      "Continuous Variable"
    )
  ).toBeFalsy();
});

it("CV Bool  MsrPop = true; MsrPopEx; true; 0 Measure Observation: Change MsrPopEx to false -> should add Measure Observation ", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const msrpopl: DisplayPopulationValue = {
    id: "MSRPOP",
    name: PopulationType.MEASURE_POPULATION,
    expected: true,
    actual: false,
  };
  const msrpoplex: DisplayPopulationValue = {
    id: "MSRPOPEXCL",
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: true,
    actual: false,
  };
  const measureObserv: DisplayPopulationValue = {
    id: "MSROBV",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: true,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(msrpopl);
  populationValues.push(msrpoplex);
  populationValues.push(measureObserv);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Continuous Variable",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  let measureGroup4 = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          id: "MSROBV",
          expected: 0,
          actual: 0,
          criteriaReference: "MSRPOP",
        },
      ],
      scoring: "Continuous Variable",
      populationBasis: "Boolean",
    },
  ];

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "MSRPOPEXCL",
      criteriaReference: "",
    },
    measureGroup4
  );

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Continuous Variable"
    ).name
  ).toEqual(PopulationType.INITIAL_POPULATION);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_POPULATION_OBSERVATION,
      "Continuous Variable"
    )
  ).toBeFalsy();

  msrpoplex.expected = false;
  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: false,
      actual: undefined,
      id: "MSRPOPEXCL",
      criteriaReference: "",
    },
    measureGroup4
  );
  expect(
    parsingTheExpectedResult(
      resultPops2[0].populationValues,
      PopulationType.MEASURE_POPULATION,
      "Continuous Variable"
    ).name
  ).toEqual(PopulationType.MEASURE_POPULATION);

  expect(resultPops2[0].populationValues[2].name).toEqual(
    PopulationType.MEASURE_POPULATION_OBSERVATION
  );
});

it("CV Bool  MsrPop = true; MsrPopEx; false; 1 Measure Observation: Change MsrPopEx to true -> should remove Measure Observation ", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const msrpopl: DisplayPopulationValue = {
    id: "MSRPOP",
    name: PopulationType.MEASURE_POPULATION,
    expected: true,
    actual: false,
  };
  const msrpoplex: DisplayPopulationValue = {
    id: "MSRPOPEXCL",
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: false,
    actual: false,
  };
  const measureObserv: DisplayPopulationValue = {
    id: "MSROBV",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: true,
    actual: false,
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(msrpopl);
  populationValues.push(msrpoplex);
  populationValues.push(measureObserv);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Continuous Variable",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  let measureGroup4 = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          id: "MSROBV",
          expected: 0,
          actual: 0,
          criteriaReference: "MSRPOP",
        },
      ],
      scoring: "Continuous Variable",
      populationBasis: "Boolean",
    },
  ];

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: false,
      actual: undefined,
      id: "MSRPOPEXCL",
      criteriaReference: "",
    },
    measureGroup4
  );
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Continuous Variable"
    ).name
  ).toEqual(PopulationType.INITIAL_POPULATION);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_POPULATION_OBSERVATION,
      "Continuous Variable"
    )
  ).toBeTruthy();

  msrpoplex.expected = true;
  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "MSRPOPEXCL",
      criteriaReference: "",
    },
    measureGroup4
  );
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_POPULATION,
      "Continuous Variable"
    ).name
  ).toEqual(PopulationType.MEASURE_POPULATION);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_POPULATION_OBSERVATION,
      "Continuous Variable"
    )
  ).toBeFalsy();
});

it("Ratio Non Bool: Removing the observations on clicking the numerator exclusion and denominator exclusion in Ratio", () => {
  const ipp: DisplayPopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: false,
    id: "pid-1",
    criteriaReference: "",
  };
  const denom: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: 1,
    actual: false,
    id: "pid-2",
    criteriaReference: "",
  };

  let denomExclu: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: 0,
    actual: false,
    id: "pid-3",
    criteriaReference: "",
  };
  const numer: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: 0,
    actual: false,
    id: "pid-4",
    criteriaReference: "",
  };
  const numerExclu: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: 0,
    actual: false,
    id: "pid-5",
    criteriaReference: "",
  };
  const measureObserv1: DisplayPopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: false,
    actual: false,
    id: "moid-1",
    criteriaReference: "pid-2",
  };
  const measureObserv2: DisplayPopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: false,
    actual: false,
    id: "moid-2",
    criteriaReference: "pid-4",
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);
  populationValues.push(measureObserv1);
  populationValues.push(measureObserv2);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  let measureGroup4 = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          expected: false,
          actual: false,
          id: "moid-1",
          criteriaReference: "pid-2",
        },
        {
          expected: false,
          actual: false,
          id: "moid-2",
          criteriaReference: "pid-4",
        },
      ],
      scoring: "Ratio",
      populationBasis: "Encounter",
    },
  ];

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.DENOMINATOR,
      expected: 1,
      actual: undefined,
      id: "pid-2",
      criteriaReference: "",
    },
    measureGroup4
  );

  expect(resultPops[0].populationValues.length).toEqual(6);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Ratio"
    ).name
  ).toEqual(PopulationType.INITIAL_POPULATION);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_OBSERVATION,
      "Ratio"
    ).name
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Ratio"
    ).expected
  ).toEqual(1);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCLUSION,
      "Ratio"
    ).expected
  ).toEqual(0);

  denomExclu.expected = 1;

  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.DENOMINATOR_EXCLUSION,
      expected: denomExclu.expected,
      actual: undefined,
      id: "pid-3",
      criteriaReference: "",
    },
    measureGroup4
  );

  expect(resultPops[0].populationValues.length).toEqual(5);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_OBSERVATION,
      "Ratio"
    ).name
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Ratio"
    ).expected
  ).toEqual(1);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCLUSION,
      "Ratio"
    ).expected
  ).toEqual(1);
});

it("Ratio Bool: Adding the observations on clicking the numerator exclusion and denominator exclusion in Ratio", () => {
  const ipp: DisplayPopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
    id: "pid-1",
    criteriaReference: "",
  };
  const denom: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
    id: "pid-2",
    criteriaReference: "",
  };

  const denomExclu: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
    id: "pid-3",
    criteriaReference: "",
  };
  const numer: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
    id: "pid-4",
    criteriaReference: "",
  };
  const numerExclu: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
    id: "pid-5",
    criteriaReference: "",
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Ratio",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  let measureGroup1 = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          id: "uuid-1",
          definition: "fun",
          criteriaReference: "pid-2",
        },
        {
          id: "uuid-2",
          definition: "fun",
          criteriaReference: "pid-4",
        },
      ],
      scoring: "Ratio",
      populationBasis: "Boolean",
    },
  ];

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.DENOMINATOR_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "pid-3",
      criteriaReference: undefined,
    },
    measureGroup1
  );

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_OBSERVATION,
      "Ratio"
    ).id
  ).toBeFalsy;

  denomExclu.expected = false;
  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.DENOMINATOR_EXCLUSION,
      expected: false,
      actual: undefined,
      id: "pid-2",
      criteriaReference: "undefined",
    },
    measureGroup
  );

  expect(resultPops2[0].populationValues[2].id).toEqual(
    "denominatorObservation0"
  );
});

it("Ratio NonBool Denom = 1; Denom Exclusion = 0; 1 Measure Observation; should result in a single DenomObservation result", () => {
  const ipp: DisplayPopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: false,
    id: "pid-1",
    criteriaReference: "",
  };
  const denom: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: 1,
    actual: false,
    id: "pid-2",
    criteriaReference: "",
  };

  const denomExclu: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: 0,
    actual: false,
    id: "pid-3",
    criteriaReference: "",
  };
  const numer: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: 0,
    actual: false,
    id: "pid-4",
    criteriaReference: "",
  };
  const numerExclu: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: 0,
    actual: false,
    id: "pid-5",
    criteriaReference: "",
  };

  const denomObv1: DisplayPopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: false,
    actual: false,
    id: "moid-1",
    criteriaReference: "pid-2",
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);
  populationValues.push(denomObv1);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);
  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.DENOMINATOR,
      expected: 1,
      actual: false,
      id: "pid-2",
      criteriaReference: "",
    },
    measureGroup2
  );
  //Key is the index of the value and is appended to the end of the observation ID
  expect(resultPops2[0].populationValues[2].id).toEqual(
    "denominatorObservation0"
  );

  expect(
    findObservationByCriteriaReference(resultPops2[0].populationValues, "pid-4")
      ?.id
  ).toBeUndefined();
});

it("Ratio NonBool Adding / removing Denom & Num ; ", () => {
  const ipp: DisplayPopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: 1,
    actual: false,
    id: "pid-1",
    criteriaReference: "",
  };
  const denom: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: 1,
    actual: false,
    id: "pid-2",
    criteriaReference: "",
  };

  const denomExclu: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: 0,
    actual: false,
    id: "pid-3",
    criteriaReference: "",
  };
  const numer: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: 0,
    actual: false,
    id: "pid-4",
    criteriaReference: "",
  };
  const numerExclu: DisplayPopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: 0,
    actual: false,
    id: "pid-5",
    criteriaReference: "",
  };

  const denomObv1: DisplayPopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: false,
    actual: false,
    id: "moid-1",
    criteriaReference: "pid-2",
  };

  const numerObv1: DisplayPopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: false,
    actual: false,
    id: "moid-2",
    criteriaReference: "pid-4",
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);
  populationValues.push(denomObv1);
  populationValues.push(numerObv1);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Ratio",
    populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);
  //First change to denom expected should result in 1 denom observation in the 3rd place
  const resultPops1 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.DENOMINATOR,
      expected: 1,
      actual: false,
      id: "pid-2",
      criteriaReference: "",
    },
    measureGroup2
  );
  //Key is the index of the value and is appended to the end of the observation ID

  expect(resultPops1[0].populationValues[2].id).toEqual(
    "denominatorObservation0"
  );
  expect(
    findObservationByCriteriaReference(resultPops1[0].populationValues, "pid-4")
      ?.id
  ).toBeUndefined(); //<-- means there is no Numer Observation

  //Let's update Numerator so that we get a Numerator Observation
  numer.expected = 1;
  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.NUMERATOR,
      expected: 1,
      actual: false,
      id: "pid-4",
      criteriaReference: "",
    },
    measureGroup2
  );

  expect(resultPops1[0].populationValues[2].id).toEqual(
    "denominatorObservation0"
  );
  expect(resultPops1[0].populationValues[5].id).toEqual(
    "numeratorObservation0"
  );
});

it("CV NonBool MsrPop = 2; MsrPopEx; 0; 1 Measure Observation; should result in 2 MeasurePopulationObservation results", () => {
  const ipp: DisplayPopulationValue = {
    id: "IPP",
    name: PopulationType.INITIAL_POPULATION,
    expected: 0,
    actual: 0,
  };
  const msrpopl: DisplayPopulationValue = {
    id: "MSRPOP",
    name: PopulationType.MEASURE_POPULATION,
    expected: 2,
    actual: 0,
  };
  const msrpoplex: DisplayPopulationValue = {
    id: "MSRPOPEXCL",
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: 0,
    actual: 0,
  };
  const measureObserv: DisplayPopulationValue = {
    id: "MSROBV",
    name: PopulationType.MEASURE_OBSERVATION,
    expected: 0,
    actual: 0,
    criteriaReference: "MSRPOP",
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(msrpopl);
  populationValues.push(msrpoplex);
  populationValues.push(measureObserv);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Encounter",
    scoring: "Continuous Variable",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);
  groupPopulations[0].populationValues[2].expected = 0;
  let measureGroup4 = [
    {
      id: "shrug",
      measureName: "the measure for testing",
      cql: "",
      elmJson: "",
      createdBy: "testuser@example.com",
      measureObservations: [
        {
          id: "MSROBV",
          expected: 0,
          actual: 0,
          criteriaReference: "MSRPOP",
        },
      ],
      scoring: "Continuous Variable",
      populationBasis: "Encounter",
    },
  ];
  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: 0,
      actual: undefined,
      id: "MSRPOPEXCL",
    },
    measureGroup4
  );

  expect(resultPops[0].populationValues.length).toEqual(5);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Continuous Variable"
    ).name
  ).toEqual(PopulationType.INITIAL_POPULATION);
  expect(resultPops[0].populationValues[2].name).toEqual(
    PopulationType.MEASURE_POPULATION_OBSERVATION
  );
  expect(resultPops[0].populationValues[3].name).toEqual(
    PopulationType.MEASURE_POPULATION_OBSERVATION
  );

  groupPopulations[0].populationValues[2].expected = 2;

  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: 2,
      actual: undefined,
      id: "shrug",
      criteriaReference: "",
    },
    measureGroup4
  );
  expect(
    parsingTheExpectedResult(
      resultPops2[0].populationValues,
      PopulationType.MEASURE_POPULATION_OBSERVATION,
      "Continuous Variable"
    )
  ).toBeFalsy;
});

function parsingTheExpectedResult(
  popVals: DisplayPopulationValue[],
  name: String,
  scoring: string
): any {
  let returnVal: boolean | number | DisplayPopulationValue = false;
  popVals.forEach((value: DisplayPopulationValue) => {
    if (value.name === name) {
      returnVal = scoring === "Proportion" ? value.expected : value;
    }
  });

  return returnVal;
}

function findObservationByCriteriaReference(
  popVals: DisplayPopulationValue[],
  id: string
): any {
  let returnVal: boolean | number | DisplayPopulationValue = false;
  popVals.forEach((value: DisplayPopulationValue, index: number) => {
    if (value.criteriaReference === id) {
      returnVal = value;
    }
  });
  return returnVal;
}

it("test proportion scoring with denominatorExclusion as changedPopulationName, when expectedValue is false, expected value for INITIAL_POPULATION and DENOMINATOR are both false", () => {
  const ipp: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "2",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "3",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "4",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExclu);
  populationValues.push(numer);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "3",
      name: PopulationType.DENOMINATOR_EXCLUSION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeFalsy();
});

it("test proportion scoring with denominatorException as changedPopulationName, when expectedValue is false, expected value for INITIAL_POPULATION and DENOMINATOR are both false", () => {
  const ipp: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "2",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExclu: DisplayPopulationValue = {
    id: "3",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "4",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExclu);
  populationValues.push(numer);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "3",
      name: PopulationType.DENOMINATOR_EXCEPTION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeFalsy();
});

it("test proportion scoring with numeratorExclusion as changedPopulationName, when expectedValue is false, expected value for INITIAL_POPULATION and DENOMINATOR and NUMERATOR are all false", () => {
  const ipp: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: DisplayPopulationValue = {
    id: "2",
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const numer: DisplayPopulationValue = {
    id: "3",
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numExclu: DisplayPopulationValue = {
    id: "4",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };

  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(numer);
  populationValues.push(numExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      id: "3",
      name: PopulationType.NUMERATOR_EXCLUSION,
      expected: true,
      actual: undefined,
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR,
      "Proportion"
    )
  ).toBeFalsy();
});

it("add defaults observations for Patient based testcases when loading the test case", () => {
  const testCase = {
    groupId: "654955e5cda7fe554f6ba792",
    scoring: MeasureScoring.RATIO,
    populationBasis: "true",
    populationValues: [
      {
        id: "2c1b199a-ba0f-4932-bf19-65c58968e3d5",
        criteriaReference: null,
        name: PopulationType.INITIAL_POPULATION,
        expected: true,
        actual: false,
      },
      {
        id: "735bdb59-0923-444f-b912-f61837b6f57c",
        criteriaReference: null,
        name: PopulationType.DENOMINATOR,
        expected: true,
        actual: false,
      },
      {
        id: "c9a5915a-cdea-43f0-bab0-af5e3b63d261",
        criteriaReference: null,
        name: PopulationType.NUMERATOR,
        expected: true,
        actual: false,
      },
    ],
    stratificationValues: [],
  };

  const ratioGroup = {
    id: "654955f6cda7fe554f6ba793",
    scoring: MeasureScoring.RATIO,
    populations: [
      {
        id: "545eaef1-b058-4d35-9073-c5584edaf746",
        name: PopulationType.INITIAL_POPULATION,
        definition: "Initial Population",
        associationType: null,
        description: "",
      },
      {
        id: "72637712-fd6f-4289-a031-6eab4d901dac",
        name: PopulationType.DENOMINATOR,
        definition: "Denominator",
        associationType: null,
        description: "",
      },
      {
        id: "ef08c1d8-edad-416f-a0d0-dd976ca0a82f",
        name: PopulationType.DENOMINATOR_EXCLUSION,
        definition: "Denonimator Exclusion",
        associationType: null,
        description: "",
      },
      {
        id: "7674b5e2-5629-4ab3-9d0b-a4e7a1cf1df4",
        name: PopulationType.NUMERATOR,
        definition: "Numerator",
        associationType: null,
        description: "",
      },
      {
        id: "e2d29b07-42f6-4b44-af3b-3f9879d6fb4c",
        name: PopulationType.NUMERATOR_EXCLUSION,
        definition: "Numerator",
        associationType: null,
        description: "",
      },
    ],
    measureObservations: [
      {
        id: "8cb5dd6f-b263-4755-851d-9b6c44975569",
        definition: PopulationType.DENOMINATOR_OBSERVATION,
        description: null,
        criteriaReference: "72637712-fd6f-4289-a031-6eab4d901dac",
        aggregateMethod: "Average",
      },
      {
        id: "ee3c1f30-a7ac-4952-b208-85ae61cdaca0",
        definition: PopulationType.NUMERATOR_OBSERVATION,
        description: null,
        criteriaReference: "7674b5e2-5629-4ab3-9d0b-a4e7a1cf1df4",
        aggregateMethod: "Maximum",
      },
    ],
    groupDescription: "",
    improvementNotation: "",
    rateAggregation: "",
    measureGroupTypes: null,
    scoringUnit: "",
    stratifications: [],
    populationBasis: "true",
  };

  expect(testCase.populationValues.length).toBe(3);

  const updatedTestCase = mapExistingTestCasePopulations(testCase, ratioGroup);
  expect(updatedTestCase.populationValues.length).toBe(5);
  expect(updatedTestCase.populationValues[2].name).toBe(
    "denominatorObservation"
  );
  expect(updatedTestCase.populationValues[4].name).toBe("numeratorObservation");
});

it("add defaults observations for Episode based testcases when loading the test case", () => {
  const testCase = {
    groupId: "654a77facda7fe554f6ba799",
    scoring: "Ratio",
    populationBasis: "false",
    populationValues: [
      {
        id: "65dc5880-0161-476a-a3eb-888ddf47c636",
        criteriaReference: null,
        name: "initialPopulation",
        expected: "1",
        actual: null,
      },
      {
        id: "c1af4146-b8a0-4e33-8eac-eba5daa07d2d",
        criteriaReference: null,
        name: "denominator",
        expected: "6",
        actual: null,
      },
      {
        id: "c826a547-d457-47f1-a6cb-13b46ded0f48",
        criteriaReference: null,
        name: "denominatorExclusion",
        expected: "2",
        actual: null,
      },
      {
        id: "b6c3659b-4dfa-4f07-864b-44562e0d2b2a",
        criteriaReference: null,
        name: "numerator",
        expected: "4",
        actual: null,
      },
      {
        id: "numeratorObservation0",
        criteriaReference: "b6c3659b-4dfa-4f07-864b-44562e0d2b2a",
        name: "numeratorObservation",
        expected: 0,
        actual: null,
      },
      {
        id: "061eec61-a363-4f9e-9999-0f62fc8a615f",
        criteriaReference: null,
        name: "numeratorExclusion",
        expected: "3",
        actual: null,
      },
    ],
    stratificationValues: [],
  };

  const ratioGroup = {
    id: "654955f6cda7fe554f6ba793",
    scoring: MeasureScoring.RATIO,
    populations: [
      {
        id: "545eaef1-b058-4d35-9073-c5584edaf746",
        name: PopulationType.INITIAL_POPULATION,
        definition: "Initial Population",
        associationType: null,
        description: "",
      },
      {
        id: "72637712-fd6f-4289-a031-6eab4d901dac",
        name: PopulationType.DENOMINATOR,
        definition: "Denominator",
        associationType: null,
        description: "",
      },
      {
        id: "ef08c1d8-edad-416f-a0d0-dd976ca0a82f",
        name: PopulationType.DENOMINATOR_EXCLUSION,
        definition: "Denonimator Exclusion",
        associationType: null,
        description: "",
      },
      {
        id: "7674b5e2-5629-4ab3-9d0b-a4e7a1cf1df4",
        name: PopulationType.NUMERATOR,
        definition: "Numerator",
        associationType: null,
        description: "",
      },
      {
        id: "e2d29b07-42f6-4b44-af3b-3f9879d6fb4c",
        name: PopulationType.NUMERATOR_EXCLUSION,
        definition: "Numerator",
        associationType: null,
        description: "",
      },
    ],
    measureObservations: [
      {
        id: "8cb5dd6f-b263-4755-851d-9b6c44975569",
        definition: PopulationType.DENOMINATOR_OBSERVATION,
        description: null,
        criteriaReference: "72637712-fd6f-4289-a031-6eab4d901dac",
        aggregateMethod: "Average",
      },
      {
        id: "ee3c1f30-a7ac-4952-b208-85ae61cdaca0",
        definition: PopulationType.NUMERATOR_OBSERVATION,
        description: null,
        criteriaReference: "7674b5e2-5629-4ab3-9d0b-a4e7a1cf1df4",
        aggregateMethod: "Maximum",
      },
    ],
    groupDescription: "",
    improvementNotation: "",
    rateAggregation: "",
    measureGroupTypes: null,
    scoringUnit: "",
    stratifications: [],
    populationBasis: "false",
  };

  expect(testCase.populationValues.length).toBe(6);
  const updatedTestCase = mapExistingTestCasePopulations(testCase, ratioGroup);
  expect(updatedTestCase.populationValues.length).toBe(10);
  expect(updatedTestCase.populationValues[2].id).toBe(
    "denominatorObservation0"
  );
  expect(updatedTestCase.populationValues[4].id).toBe(
    "denominatorObservation2"
  );
  expect(updatedTestCase.populationValues[8].id).toBe("numeratorObservation0");
});
