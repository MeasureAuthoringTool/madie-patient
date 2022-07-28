import {
  PopulationType,
  GroupPopulation,
  Group,
  PopulationExpectedValue,
} from "@madie/madie-models";
import _ from "lodash";

const POPULATION_MAP = {
  Ratio: [
    PopulationType.INITIAL_POPULATION,
    PopulationType.NUMERATOR,
    PopulationType.NUMERATOR_EXCLUSION,
    PopulationType.DENOMINATOR,
    PopulationType.DENOMINATOR_EXCLUSION,
  ],
  Proportion: [
    PopulationType.INITIAL_POPULATION,
    PopulationType.NUMERATOR,
    PopulationType.NUMERATOR_EXCLUSION,
    PopulationType.DENOMINATOR,
    PopulationType.DENOMINATOR_EXCLUSION,
    PopulationType.DENOMINATOR_EXCEPTION,
  ],
  "Continuous Variable": [
    PopulationType.INITIAL_POPULATION,
    PopulationType.MEASURE_POPULATION,
    PopulationType.MEASURE_POPULATION_EXCLUSION,
  ],
  Cohort: [PopulationType.INITIAL_POPULATION],
};

export const FHIR_POPULATION_CODES = {
  "initial-population": PopulationType.INITIAL_POPULATION,
  numerator: PopulationType.NUMERATOR,
  "numerator-exclusion": PopulationType.NUMERATOR_EXCLUSION,
  denominator: PopulationType.DENOMINATOR,
  "denominator-exclusion": PopulationType.DENOMINATOR_EXCLUSION,
  "denominator-exception": PopulationType.DENOMINATOR_EXCEPTION,
  "measure-population": PopulationType.MEASURE_POPULATION,
  "measure-population-exclusion": PopulationType.MEASURE_POPULATION_EXCLUSION,
  "measure-observation": PopulationType.MEASURE_OBSERVATION,
};

// filtering out populations for those that have definitions added.
export function getPopulationTypesForScoring(group: Group): PopulationType[] {
  return group.populations
    .filter(
      (population) =>
        !_.isNil(population.definition) && !_.isEmpty(population.definition)
    )
    .map((population) => population.name);
}

// for every MeasurePopulation value
// this method returns its equivalent fqm-execution PopulationResult identifier.
export function getFhirMeasurePopulationCode(population: string) {
  for (const [code, pop] of Object.entries(FHIR_POPULATION_CODES)) {
    if (population === pop) {
      return code;
    }
  }
}

export function triggerPopChanges(
  groupPopulations: GroupPopulation[],
  changedPopulation
) {
  let returnPop: GroupPopulation[] = [];
  const expectedValue = groupPopulations[0]?.populationValues.filter(
    (population) => population.name === changedPopulation
  )[0]?.expected;
  returnPop.push(groupPopulations[0]);
  let myMap = {};

  //iterate through
  groupPopulations[0].populationValues.forEach(
    (value: PopulationExpectedValue) => {
      myMap[value.name] = value;
    }
  );

  if (groupPopulations[0].scoring === "Proportion") {
    //denominator
    if (changedPopulation === "denominator") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
      }

      if (expectedValue === false) {
        myMap[PopulationType.NUMERATOR].expected = false;
        myMap[PopulationType.DENOMINATOR_EXCLUSION] !== undefined &&
          (myMap[PopulationType.DENOMINATOR_EXCLUSION].expected = false);
        myMap[PopulationType.DENOMINATOR_EXCEPTION] !== undefined &&
          (myMap[PopulationType.DENOMINATOR_EXCEPTION].expected = false);
        myMap[PopulationType.NUMERATOR_EXCLUSION] !== undefined &&
          (myMap[PopulationType.NUMERATOR_EXCLUSION].expected = false);
      }
    }

    //numerator
    if (changedPopulation === "numerator") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
        myMap[PopulationType.DENOMINATOR].expected = true;
      }
      if (expectedValue === false) {
        myMap[PopulationType.NUMERATOR_EXCLUSION] !== undefined &&
          (myMap[PopulationType.NUMERATOR_EXCLUSION].expected = false);
      }
    }

    //Denom Exclusion
    if (changedPopulation === "denominatorExclusion") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
        myMap[PopulationType.DENOMINATOR].expected = true;
      }
    }
    //Denom Exception
    if (changedPopulation === "denominatorException") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
        myMap[PopulationType.DENOMINATOR].expected = true;
      }
    }

    //Numer Exclusion
    if (changedPopulation === "numeratorExclusion") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
        myMap[PopulationType.DENOMINATOR].expected = true;
        myMap[PopulationType.NUMERATOR].expected = true;
      }
    }

    //initialPopulation
    if (changedPopulation === "initialPopulation" && expectedValue === false) {
      myMap[PopulationType.DENOMINATOR].expected = false;
      myMap[PopulationType.NUMERATOR].expected = false;
      myMap[PopulationType.DENOMINATOR_EXCLUSION] !== undefined &&
        (myMap[PopulationType.DENOMINATOR_EXCLUSION].expected = false);
      myMap[PopulationType.DENOMINATOR_EXCEPTION] !== undefined &&
        (myMap[PopulationType.DENOMINATOR_EXCEPTION].expected = false);
      myMap[PopulationType.NUMERATOR_EXCLUSION] !== undefined &&
        (myMap[PopulationType.NUMERATOR_EXCLUSION].expected = false);
    }
  }

  return returnPop;
}
