import {
  DisplayPopulationValue,
  Group,
  GroupPopulation,
  MeasureObservation,
  PopulationExpectedValue,
  PopulationType,
} from "@madie/madie-models";

import _, { remove } from "lodash";

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

export function triggerPopChanges(
  groupPopulations: GroupPopulation[],
  changedGroupId: string,
  changedTarget: DisplayPopulationValue,
  measureGroups
): GroupPopulation[] {
  let returnPops: GroupPopulation[] = [...groupPopulations];

  // Find the modified Group/Population Criteria
  const targetGroup = returnPops.find(
    (groupPop) => groupPop.groupId === changedGroupId
  );

  if (_.isNil(targetGroup)) {
    return groupPopulations;
  }

  const changedPopulationName: PopulationType =
    changedTarget.name as PopulationType;

  const expectedValue = targetGroup.populationValues.find(
    (population) => population.name === changedPopulationName
  )?.expected;

  let stratMap = buildStratificationMap(targetGroup, changedTarget);
  let popMap = buildPopulationMap(targetGroup);

  addRemoveObservationsForPopulationCritieria(
    targetGroup,
    changedPopulationName,
    changedGroupId,
    measureGroups
  );
  if (targetGroup.scoring === "Proportion") {
    //denominator
    if (changedPopulationName === "denominator") {
      if (expectedValue === true) {
        popMap[PopulationType.INITIAL_POPULATION].expected = true;
      }

      if (expectedValue === false) {
        popMap[PopulationType.NUMERATOR].expected = false;
        popMap[PopulationType.DENOMINATOR_EXCLUSION] !== undefined &&
          (popMap[PopulationType.DENOMINATOR_EXCLUSION].expected = false);
        popMap[PopulationType.DENOMINATOR_EXCEPTION] !== undefined &&
          (popMap[PopulationType.DENOMINATOR_EXCEPTION].expected = false);
        popMap[PopulationType.NUMERATOR_EXCLUSION] !== undefined &&
          (popMap[PopulationType.NUMERATOR_EXCLUSION].expected = false);
      }
    }

    //numerator
    if (changedPopulationName === "numerator") {
      if (expectedValue === true) {
        popMap[PopulationType.INITIAL_POPULATION].expected = true;
        popMap[PopulationType.DENOMINATOR].expected = true;
      }
      if (expectedValue === false) {
        popMap[PopulationType.NUMERATOR_EXCLUSION] !== undefined &&
          (popMap[PopulationType.NUMERATOR_EXCLUSION].expected = false);
      }
    }

    //Denom Exclusion
    if (changedPopulationName === "denominatorExclusion") {
      if (expectedValue === true) {
        popMap[PopulationType.INITIAL_POPULATION].expected = true;
        popMap[PopulationType.DENOMINATOR].expected = true;
      }
    }
    //Denom Exception
    if (changedPopulationName === "denominatorException") {
      if (expectedValue === true) {
        popMap[PopulationType.INITIAL_POPULATION].expected = true;
        popMap[PopulationType.DENOMINATOR].expected = true;
      }
    }

    //Numer Exclusion
    if (changedPopulationName === "numeratorExclusion") {
      if (expectedValue === true) {
        popMap[PopulationType.INITIAL_POPULATION].expected = true;
        popMap[PopulationType.DENOMINATOR].expected = true;
        popMap[PopulationType.NUMERATOR].expected = true;
      }
    }

    //initialPopulation
    if (
      changedPopulationName === "initialPopulation" &&
      expectedValue === false
    ) {
      popMap[PopulationType.DENOMINATOR].expected = false;
      popMap[PopulationType.NUMERATOR].expected = false;
      popMap[PopulationType.DENOMINATOR_EXCLUSION] !== undefined &&
        (popMap[PopulationType.DENOMINATOR_EXCLUSION].expected = false);
      popMap[PopulationType.DENOMINATOR_EXCEPTION] !== undefined &&
        (popMap[PopulationType.DENOMINATOR_EXCEPTION].expected = false);
      popMap[PopulationType.NUMERATOR_EXCLUSION] !== undefined &&
        (popMap[PopulationType.NUMERATOR_EXCLUSION].expected = false);
    }
  }
  return returnPops;
}

const buildStratificationMap = (
  populationCritiera: GroupPopulation,
  changedPopulation: DisplayPopulationValue
) => {
  let stratificationMap = {};
  populationCritiera.stratificationValues?.forEach(
    (value: PopulationExpectedValue) => {
      stratificationMap[value.name] = value;

      if (
        !_.isUndefined(changedPopulation) &&
        value.name === changedPopulation.name
      ) {
        stratificationMap[value.name].expected = changedPopulation.expected;
      }
    }
  );
  return stratificationMap;
};

const buildPopulationMap = (populationCritiera: GroupPopulation) => {
  let popMap = {};
  populationCritiera.populationValues.forEach(
    (value: PopulationExpectedValue) => {
      popMap[value.name] = value;
    }
  );
  return popMap;
};

function addRemoveObservationsForPopulationCritieria(
  targetPopulationCriteria: GroupPopulation,
  changedPopulationName: PopulationType,
  changedGroupId: string,
  measureGroups: Group[]
) {
  if (
    changedPopulationName === PopulationType.NUMERATOR_EXCLUSION ||
    changedPopulationName === PopulationType.NUMERATOR ||
    changedPopulationName === PopulationType.DENOMINATOR_EXCLUSION ||
    changedPopulationName === PopulationType.DENOMINATOR ||
    changedPopulationName === PopulationType.MEASURE_POPULATION ||
    changedPopulationName === PopulationType.MEASURE_POPULATION_EXCLUSION
  ) {
    //for denom add observations 1 * expectedValue

    let expectedPopType = defineExpectedPopulationType(changedPopulationName);

    const expectedObservationsPerPop = countObservationsPerType(
      targetPopulationCriteria.populationValues,
      measureGroups,
      changedGroupId,
      expectedPopType
    );

    let populationBucket: PopulationExpectedValue[] =
      targetPopulationCriteria.populationValues.filter(
        (value) => value.name != PopulationType.MEASURE_OBSERVATION
      );

    const [nonExcludedPopType, excludedPopType]: [
      PopulationType,
      PopulationType
    ] = determinePopType(expectedPopType);
    const index =
      populationBucket.findIndex((value) => value.name === nonExcludedPopType) +
      1;
    const [newPopBucket, tempBucket]: [
      PopulationExpectedValue[],
      PopulationExpectedValue[]
    ] = addObservations(
      expectedObservationsPerPop,
      populationBucket,
      nonExcludedPopType,
      index
    );

    newPopBucket.splice(index, 0, ...tempBucket);

    targetPopulationCriteria.populationValues = [...newPopBucket];
  }
}

function defineExpectedPopulationType(changedPopulationName: PopulationType) {
  let expectedPopType: PopulationType = undefined;
  switch (String(changedPopulationName)) {
    case String(PopulationType.DENOMINATOR_EXCLUSION): {
      expectedPopType = PopulationType.DENOMINATOR;
      break;
    }
    case String(PopulationType.NUMERATOR_EXCLUSION): {
      expectedPopType = PopulationType.NUMERATOR;
      break;
    }
    default:
      expectedPopType = changedPopulationName;
  }

  return expectedPopType;
}

function addObservations(
  expectedObservationsPerPop: number,
  populationBucket: PopulationExpectedValue[],
  popType: PopulationType,
  index: number
): [PopulationExpectedValue[], PopulationExpectedValue[]] {
  const observationBucket: PopulationExpectedValue[] = populationBucket.filter(
    (value) =>
      value.name == PopulationType.MEASURE_POPULATION_OBSERVATION ||
      value.name == PopulationType.DENOMINATOR_OBSERVATION ||
      value.name == PopulationType.NUMERATOR_OBSERVATION
  );

  const tempPopBucket: PopulationExpectedValue[] = populationBucket.filter(
    (value) =>
      value.name != PopulationType.MEASURE_POPULATION_OBSERVATION &&
      value.name != PopulationType.DENOMINATOR_OBSERVATION &&
      value.name != PopulationType.NUMERATOR_OBSERVATION
  );
  //so observationBucket has original observations that came from a Population ist
  // and tempPopBucket is just non-observation populations
  populationBucket.forEach((value) => {
    let obvType: PopulationType =
      value.name === PopulationType.MEASURE_POPULATION
        ? PopulationType.MEASURE_OBSERVATION
        : (`${popType}Observation` as PopulationType);
    if (value.name === popType) {
      //if we need to add observations?
      if (expectedObservationsPerPop > observationBucket.length) {
        let addObservations =
          expectedObservationsPerPop - observationBucket.length;
        for (let i = 0; i < addObservations; i++) {
          observationBucket.push({
            name: obvType,
            expected: 0,
            id: `${obvType}${index + i}`,
            criteriaReference: value.id,
          } as unknown as PopulationExpectedValue);
        }
        //or remove observations
      } else if (expectedObservationsPerPop < observationBucket.length) {
        let removeObservations =
          observationBucket.length - expectedObservationsPerPop;
        for (let i = 0; i < removeObservations; i++) {
          observationBucket.pop();
        }
      }
      //return the new array and mutated copy of the original
    }
  });

  return [tempPopBucket, observationBucket];
}
function determinePopType(
  popType: PopulationType
): [PopulationType, PopulationType] {
  let retPopType: PopulationType;
  let retPopTypeExclusion: PopulationType;
  if (
    popType === PopulationType.DENOMINATOR_EXCLUSION ||
    popType === PopulationType.NUMERATOR_EXCLUSION ||
    popType === PopulationType.MEASURE_POPULATION_EXCLUSION
  ) {
    retPopTypeExclusion = popType;
    retPopType = <PopulationType>(
      String(retPopTypeExclusion).replace("Exclusion", "")
    );
  } else {
    retPopTypeExclusion = <PopulationType>String(popType).concat("Exclusion");
    retPopType = popType;
  }
  return [retPopType, retPopTypeExclusion];
}
function countObservationsPerType(
  targetPopulationCriteria: PopulationExpectedValue[],
  measureGroups: Group[],
  changedGroupId: string,
  changedPopType: PopulationType
): number {
  const [popType, popTypeExclusion] = determinePopType(changedPopType);

  const count: number | boolean = targetPopulationCriteria.find(
    (value) => value.name === popType
  ).expected;

  let countNbr: number = getValueFromBoolOrNum(count);
  const exclusions: number | boolean = targetPopulationCriteria.find(
    (value) => {
      return value.name === popTypeExclusion;
    }
  )?.expected;

  let exclusionNbr: number = getValueFromBoolOrNum(exclusions);

  countNbr = countNbr - exclusionNbr;
  countNbr = countNbr < 0 ? 0 : countNbr;
  //if we expect 2 results for the denom, then we should get two expected results per observation

  const id = targetPopulationCriteria.find(
    (value) => value.name === popType
  ).id;

  const observations: MeasureObservation[] = measureGroups
    .find((group) => group.id === changedGroupId)
    .measureObservations?.filter((observation) => {
      return observation.criteriaReference === id;
    });
  return countNbr * (observations === undefined ? 0 : observations.length);
}
export function getValueFromBoolOrNum(count: boolean | number): number {
  let result: number;
  if (typeof count === "boolean" || count === undefined) {
    result = count ? 1 : 0;
  } else {
    result = count;
  }
  return result;
}
// filtering out populations for those that have definitions added.
export function getPopulationTypesForScoring(group: Group) {
  const populationTypesForScoring: any = group.populations
    .filter(
      (population) =>
        !_.isNil(population.definition) && !_.isEmpty(population.definition)
    )
    .map((population) => ({
      name: population.name,
      id: population.id,
      criteriaReference: undefined,
    }));

  return populationTypesForScoring;
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
