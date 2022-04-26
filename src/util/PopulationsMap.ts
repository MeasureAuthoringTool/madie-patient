import { MeasureScoring } from "../models/MeasureScoring";
import { MeasurePopulation } from "../models/MeasurePopulation";
import { GroupPopulation, PopulationValue } from "../models/TestCase";
import GroupPopulations from "../components/populations/GroupPopulations";

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

const FHIR_POPULATION_CODES = {
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

export function getPopulationsForScoring(
  scoring: MeasureScoring | string
): MeasurePopulation[] {
  return POPULATION_MAP[scoring];
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

export function triggerPopChanges(groupPopulations: GroupPopulation[]) {
  let returnPop: GroupPopulation[] = [];
  returnPop.push(groupPopulations[0]);
  let myMap = {};

  //iterate through
  groupPopulations[0].populationValues.forEach((value: PopulationValue) => {
    myMap[value.name] = value;
  });

  if (
    myMap[MeasurePopulation.DENOMINATOR] != null &&
    myMap[MeasurePopulation.DENOMINATOR].expected == true
  ) {
    // Since Denominator is TRUE... set InitialPopulation to TRUE too
    myMap[MeasurePopulation.INITIAL_POPULATION].expected = true;
  }
  if (
    myMap[MeasurePopulation.DENOMINATOR_EXCEPTION] != null &&
    myMap[MeasurePopulation.DENOMINATOR_EXCEPTION].expected == true
  ) {
    // Since Denominotor Exception is true, then IPP & Denom should also be true
    myMap[MeasurePopulation.INITIAL_POPULATION].expected = true;
    myMap[MeasurePopulation.DENOMINATOR].expected = true;
  }

  //for every item in Map, create a returnPop[0].push with that value //returnPop.push(groupPopulations[0]);
  Object.keys(myMap).forEach((key: MeasurePopulation) => {
    returnPop[0].populationValues.push(myMap[key]);
  });

  return returnPop;
}
