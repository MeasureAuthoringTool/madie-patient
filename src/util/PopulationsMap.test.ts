import { PopulationType, GroupPopulation, DisplayPopulationValue, Measure, Group } from "@madie/madie-models";
import { triggerPopChanges} from "../util/PopulationsMap"

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
    populationBasis: "Boolean",
  },
];

it("return the input matches output with no changes", () => {
  const populationVal: DisplayPopulationValue = {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const stratVal1: DisplayPopulationValue = {
    id: "1",
    name: "strata-1",
    expected: true
  };
  const stratVal2: DisplayPopulationValue = {
    id: "2",
    name: "strata-2",
    expected: false
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(populationVal);
  const groupPop1: GroupPopulation = {
    groupId: "initialPopulation",
    populationBasis: "Boolean",
    scoring: "Cohort",
    populationValues: populationValues,
    stratificationValues: [stratVal1, stratVal2]
  };
  const groupPopulations: GroupPopulation[] = [groupPop1];
  const measure = {} as Measure;
  const group1 = {} as Group;
  
  const resultPops = triggerPopChanges(groupPopulations, groupPop1.groupId, {
      id: "1",
      name: PopulationType.INITIAL_POPULATION,
      expected: true,
      actual: undefined    
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
  const stratVal1: DisplayPopulationValue = {
    id: "1",
    name: "strata-1",
    expected: true
  };
  const stratVal2: DisplayPopulationValue = {
    id: "2",
    name: "strata-2",
    expected: false
  };
  const populationValues: DisplayPopulationValue[] = [];
  populationValues.push(populationVal);
  const groupPop1: GroupPopulation = {
    groupId: "initialPopulation",
    populationBasis: "Boolean",
    scoring: "Cohort",
    populationValues: populationValues,
    stratificationValues: [stratVal1, stratVal2]
  };
  const groupPopulations: GroupPopulation[] = [groupPop1];
  const measure = {} as Measure;
  const group1 = {} as Group;
  
  const resultPops = triggerPopChanges(groupPopulations, groupPop1.groupId, {
      id: "2",
      name: "strata-2",
      expected: true,
      actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Cohort",
    populationValues: populationValues,
    stratificationValues: [],
  };
  const groupPopulations: GroupPopulation[] = [group1];

  const resultPops = triggerPopChanges(groupPopulations, "WRONG_ID", {
    id:"1",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: undefined},
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);
  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: undefined    
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
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    id: "1",
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: undefined    
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

it("Removing and Adding the observations on clicking the measure population exclusion in continuous variable ", () => {
  const ipp: DisplayPopulationValue = {
    id: "",
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const msrpopl: DisplayPopulationValue = {
    id: "",
    name: PopulationType.MEASURE_POPULATION,
    expected: false,
    actual: false,
  };
  const msrpoplex: DisplayPopulationValue = {
    id: "",
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: false,
    actual: false,
  };
  const measureObserv: DisplayPopulationValue = {
    id: "",
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
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "",
      criteriaReference: "",
    },
    measureGroup
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
      PopulationType.MEASURE_OBSERVATION,
      "Continuous Variable"
    ).id
  ).toEqual("uuid-1");

  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.MEASURE_POPULATION_EXCLUSION,
      expected: false,
      actual: undefined,
      id: "",
      criteriaReference: "",
    },
    measureGroup
  );

  // expect(
  //   parsingTheExpectedResult(
  //     resultPops2[0].populationValues,
  //     PopulationType.MEASURE_OBSERVATION,
  //     "Continuous Variable"
  //   )
  // ).toEqual(false);
});

it("Removing the observations on clicking the numerator exclusion and denominator exclusion in Ratio", () => {
  const ipp: DisplayPopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
    id: "pid-1",
    criteriaReference: "",
  };
  const denom: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
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
    expected: true,
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
    populationBasis: "Boolean",
    scoring: "Ratio",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.DENOMINATOR_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "pid-3",
      criteriaReference: "",
    },
    measureGroup
  );

  expect(resultPops.length).toEqual(groupPopulations.length);
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
      PopulationType.DENOMINATOR,
      "Ratio"
    ).name
  ).toEqual(PopulationType.DENOMINATOR);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Ratio"
    ).id
  ).toEqual("moid-2");

  const resultPops2 = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.NUMERATOR_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "pid-5",
      criteriaReference: "",
    },
    measureGroup
  );

  expect(
    parsingTheExpectedResult(
      resultPops2[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Ratio"
    )
  ).toEqual(false);
});

it("Adding the observations on clicking the numerator exclusion and denominator exclusion in Ratio", () => {
  const ipp: DisplayPopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
    id: "pid-1",
    criteriaReference: "",
  };
  const denom: DisplayPopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
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
    populationBasis: "Boolean",
    scoring: "Ratio",
    populationValues: populationValues,
    stratificationValues: []
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    {
      name: PopulationType.NUMERATOR_EXCLUSION,
      expected: true,
      actual: undefined,
      id: "pid-5",
      criteriaReference: "undefined",
    },
    measureGroup
  );

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Ratio"
    ).id
  ).toEqual("uuid-2");
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

  expect(
    parsingTheExpectedResult(
      resultPops2[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Ratio"
    ).id
  ).toEqual("uuid-2");
});

function parsingTheExpectedResult(
  popVals: DisplayPopulationValue[],
  name: String,
  scoring: string
): any {
  let returnVal: boolean | number | DisplayPopulationValue = false;
  popVals.forEach((value: DisplayPopulationValue, index: number) => {
    if (value.name === name) {
      returnVal = scoring === "Proportion" ? value.expected : value;
    }
  });
  return returnVal;
}
 