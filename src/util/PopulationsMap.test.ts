import { triggerPopChanges } from "./PopulationsMap";
import { GroupPopulation, PopulationValue } from "../models/TestCase";
import { MeasurePopulation } from "../models/MeasurePopulation";

it("return the input matches output with no changes", () => {
  const populationVal: PopulationValue = {
    name: MeasurePopulation.INITIAL_POPULATION,
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
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations);

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
});

it("return the input with IPP changed to Expected because Denom is Expected", () => {
  const ipp: PopulationValue = {
    name: MeasurePopulation.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: MeasurePopulation.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: MeasurePopulation.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: MeasurePopulation.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: MeasurePopulation.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: MeasurePopulation.NUMERATOR_EXCLUSION,
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
    scoring: "Cohort",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations);

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      MeasurePopulation.INITIAL_POPULATION
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected because Denom Exception is Expected", () => {
  const ipp: PopulationValue = {
    name: MeasurePopulation.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: MeasurePopulation.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: MeasurePopulation.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: MeasurePopulation.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: MeasurePopulation.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: MeasurePopulation.NUMERATOR_EXCLUSION,
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
    scoring: "Cohort",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations);

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      MeasurePopulation.INITIAL_POPULATION
    )
  ).toBeTruthy();
  expect(
    findExpectedForName(
      resultPops[0].populationValues,
      MeasurePopulation.DENOMINATOR
    )
  ).toBeTruthy();
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
