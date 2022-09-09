import { triggerPopChanges } from "./PopulationsMap";
import {
  PopulationType,
  GroupPopulation,
  PopulationValue,
} from "@madie/madie-models";

it("return the input matches output with no changes", () => {
  const populationVal: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(populationVal);
  const group1: GroupPopulation = {
    groupId: "initialPopulation",
    scoring: "Cohort",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [group1];

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "initialPopulation"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
});

it("return the input matches output with no changes if targetId not found", () => {
  const populationVal: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(populationVal);
  const group1: GroupPopulation = {
    groupId: "initialPopulation",
    scoring: "Cohort",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [group1];

  const resultPops = triggerPopChanges(
    groupPopulations,
    "WRONG_ID",
    "initialPopulation"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
});

it("return the input with IPP changed to Expected because Denom is Expected", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);
  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "denominator"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected because Denom Exception is Expected", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "denominatorException"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected because Numer is Expected", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "numerator"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Numer is Unchecked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "numerator"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Denom Exception is checked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "denominatorException"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Denom Exclusion is checked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "denominatorExclusion"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected and Numer Expected when Numer Exclusion is checked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "numeratorExclusion"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR
    )
  ).toBeTruthy();
});

it("when Denom is unchecked, then Numer, Denom Exclusion, Denom Exception, Numerator Exclusion should also be uncheked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "denominator"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCLUSION
    )
  ).toBeFalsy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCEPTION
    )
  ).toBeFalsy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR
    )
  ).toBeFalsy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR_EXCLUSION
    )
  ).toBeFalsy();
});

it("when IPP is unchecked then rest of populations expected values should also be unchecked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(
    groupPopulations,
    group1.groupId,
    "initialPopulation"
  );

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR
    )
  ).toBeFalsy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR
    )
  ).toBeFalsy();
});

function findExpectedForName(
  popVals: PopulationValue[],
  name: String
): Boolean {
  let returnVal: boolean = false;
  popVals.forEach((value: PopulationValue, index: number) => {
    if (value.name === name) {
      returnVal = value.expected;
    }
  });
  return returnVal;
}
