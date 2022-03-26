import { MeasureScoring } from "../models/MeasureScoring";
import { MeasurePopulation } from "../models/MeasurePopulation";

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
  scoring: MeasureScoring
): MeasurePopulation[] {
  return POPULATION_MAP[scoring];
}

export function getFhirMeasurePopulationCode(population: string) {
  for (const [code, pop] of Object.entries(FHIR_POPULATION_CODES)) {
    if (population === pop) {
      return code;
    }
  }
}
