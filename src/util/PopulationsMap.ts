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

export function getPopulationsForScoring(
  scoring: MeasureScoring
): MeasurePopulation[] {
  return POPULATION_MAP[scoring];
}
