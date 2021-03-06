import {
  MeasurePopulation,
  GroupPopulation,
  Group,
  PopulationExpectedValue,
} from "@madie/madie-models";

const POPULATION_MAP = {
  Ratio: [
    MeasurePopulation.INITIAL_POPULATION,
    MeasurePopulation.NUMERATOR,
    MeasurePopulation.NUMERATOR_EXCLUSION,
    MeasurePopulation.DENOMINATOR,
    MeasurePopulation.DENOMINATOR_EXCLUSION,
  ],
  Proportion: [
    MeasurePopulation.INITIAL_POPULATION,
    MeasurePopulation.NUMERATOR,
    MeasurePopulation.NUMERATOR_EXCLUSION,
    MeasurePopulation.DENOMINATOR,
    MeasurePopulation.DENOMINATOR_EXCLUSION,
    MeasurePopulation.DENOMINATOR_EXCEPTION,
  ],
  "Continuous Variable": [
    MeasurePopulation.INITIAL_POPULATION,
    MeasurePopulation.MEASURE_POPULATION,
    MeasurePopulation.MEASURE_POPULATION_EXCLUSION,
  ],
  Cohort: [MeasurePopulation.INITIAL_POPULATION],
};

export const FHIR_POPULATION_CODES = {
  "initial-population": MeasurePopulation.INITIAL_POPULATION,
  numerator: MeasurePopulation.NUMERATOR,
  "numerator-exclusion": MeasurePopulation.NUMERATOR_EXCLUSION,
  denominator: MeasurePopulation.DENOMINATOR,
  "denominator-exclusion": MeasurePopulation.DENOMINATOR_EXCLUSION,
  "denominator-exception": MeasurePopulation.DENOMINATOR_EXCEPTION,
  "measure-population": MeasurePopulation.MEASURE_POPULATION,
  "measure-population-exclusion":
    MeasurePopulation.MEASURE_POPULATION_EXCLUSION,
  "measure-observation": MeasurePopulation.MEASURE_OBSERVATION,
};

// filtering out populations for those that have definitions added.
export function getPopulationsForScoring(group: Group): MeasurePopulation[] {
  return POPULATION_MAP[group.scoring].filter((population) =>
    group.population.hasOwnProperty(population)
  );
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
        myMap[MeasurePopulation.INITIAL_POPULATION].expected = true;
      }

      if (expectedValue === false) {
        myMap[MeasurePopulation.NUMERATOR].expected = false;
        myMap[MeasurePopulation.DENOMINATOR_EXCLUSION] !== undefined &&
          (myMap[MeasurePopulation.DENOMINATOR_EXCLUSION].expected = false);
        myMap[MeasurePopulation.DENOMINATOR_EXCEPTION] !== undefined &&
          (myMap[MeasurePopulation.DENOMINATOR_EXCEPTION].expected = false);
        myMap[MeasurePopulation.NUMERATOR_EXCLUSION] !== undefined &&
          (myMap[MeasurePopulation.NUMERATOR_EXCLUSION].expected = false);
      }
    }

    //numerator
    if (changedPopulation === "numerator") {
      if (expectedValue === true) {
        myMap[MeasurePopulation.INITIAL_POPULATION].expected = true;
        myMap[MeasurePopulation.DENOMINATOR].expected = true;
      }
      if (expectedValue === false) {
        myMap[MeasurePopulation.NUMERATOR_EXCLUSION] !== undefined &&
          (myMap[MeasurePopulation.NUMERATOR_EXCLUSION].expected = false);
      }
    }

    //Denom Exclusion
    if (changedPopulation === "denominatorExclusion") {
      if (expectedValue === true) {
        myMap[MeasurePopulation.INITIAL_POPULATION].expected = true;
        myMap[MeasurePopulation.DENOMINATOR].expected = true;
      }
    }
    //Denom Exception
    if (changedPopulation === "denominatorException") {
      if (expectedValue === true) {
        myMap[MeasurePopulation.INITIAL_POPULATION].expected = true;
        myMap[MeasurePopulation.DENOMINATOR].expected = true;
      }
    }

    //Numer Exclusion
    if (changedPopulation === "numeratorExclusion") {
      if (expectedValue === true) {
        myMap[MeasurePopulation.INITIAL_POPULATION].expected = true;
        myMap[MeasurePopulation.DENOMINATOR].expected = true;
        myMap[MeasurePopulation.NUMERATOR].expected = true;
      }
    }

    //initialPopulation
    if (changedPopulation === "initialPopulation" && expectedValue === false) {
      myMap[MeasurePopulation.DENOMINATOR].expected = false;
      myMap[MeasurePopulation.NUMERATOR].expected = false;
      myMap[MeasurePopulation.DENOMINATOR_EXCLUSION] !== undefined &&
        (myMap[MeasurePopulation.DENOMINATOR_EXCLUSION].expected = false);
      myMap[MeasurePopulation.DENOMINATOR_EXCEPTION] !== undefined &&
        (myMap[MeasurePopulation.DENOMINATOR_EXCEPTION].expected = false);
      myMap[MeasurePopulation.NUMERATOR_EXCLUSION] !== undefined &&
        (myMap[MeasurePopulation.NUMERATOR_EXCLUSION].expected = false);
    }
  }

  return returnPop;
}
