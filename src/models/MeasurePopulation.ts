export enum MeasurePopulation {
  INITIAL_POPULATION = "initialPopulation",
  NUMERATOR = "numerator",
  NUMERATOR_EXCLUSION = "numeratorExclusion",
  DENOMINATOR = "denominator",
  DENOMINATOR_EXCLUSION = "denominatorExclusion",
  DENOMINATOR_EXCEPTION = "denominatorException",
  MEASURE_POPULATION = "measurePopulation",
  MEASURE_POPULATION_EXCLUSION = "measurePopulationExclusion",
  MEASURE_OBSERVATION = "measureObservation",
}

export type PopulationType = {
  [key in MeasurePopulation]?: string;
};

const PopulationCodeMap = {
  initialPopulation: "IPP",
  numerator: "NUMER",
  numeratorExclusion: "NUMEX",
  denominator: "DENOM",
  denominatorExclusion: "DENEX",
  denominatorException: "DENEXCEP",
  measurePopulation: "MSRPOPL",
  measurePopulationExclusion: "MSRPOPLEX",
};

export function getPopulationCode(
  measurePopulation: MeasurePopulation
): string {
  return PopulationCodeMap[measurePopulation];
}
