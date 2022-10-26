import {
  PopulationType,
  GroupPopulation,
  Group,
  PopulationExpectedValue,
  DisplayPopulationValue,
  MeasureObservation,
} from "@madie/madie-models";

import _ from "lodash";

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

  addRemoveObservationsForNonBooleanPopulationCritieria(
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

function addRemoveObservationsForNonBooleanPopulationCritieria(
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

    let populationBucket: PopulationExpectedValue[] = [
      ...targetPopulationCriteria.populationValues,
    ];

    const index =
      populationBucket.findIndex((value) => value.name === expectedPopType) + 1;

    const tempBucket: PopulationExpectedValue[] = addObservations(
      expectedObservationsPerPop,
      populationBucket,
      expectedPopType,
      index
    );
    if (expectedPopType === PopulationType.DENOMINATOR) {
      populationBucket = [
        ...populationBucket.filter(
          (value) =>
            value.name != PopulationType.DENOMINATOR_OBSERVATION &&
            value.name != PopulationType.MEASURE_OBSERVATION
        ),
      ];
      populationBucket.splice(index, 0, ...tempBucket);
    } else {
      populationBucket = [
        ...populationBucket.filter(
          (value) =>
            value.name != PopulationType.NUMERATOR_OBSERVATION &&
            value.name != PopulationType.MEASURE_OBSERVATION
        ),
      ];
      populationBucket.splice(index, 0, ...tempBucket);
    }
    targetPopulationCriteria.populationValues = [...populationBucket];
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
): PopulationExpectedValue[] {
  const observationBucket: PopulationExpectedValue[] = [];

  if (expectedObservationsPerPop > 0) {
    populationBucket.forEach((value) => {
      if (value.name === popType) {
        for (let i = 0; i < expectedObservationsPerPop; i++) {
          let obvType: PopulationType = <PopulationType>(
            String(popType).concat("Observation")
          );

          observationBucket.push({
            name: obvType,
            expected: 0,
            id:
              String(popType).toLocaleLowerCase() + "Observation" + (index + i),
            criteriaReference: value.id,
          } as unknown as PopulationExpectedValue);
        }
      }
    });
  }
  return observationBucket;
}

function countObservationsPerType(
  targetPopulationCriteria: PopulationExpectedValue[],
  measureGroups: Group[],
  changedGroupId: string,
  expectedPopType: PopulationType
): number {
  //if changedPop == denominator exclusion or denominator get a sum of denominator.expected - denominator_exclusion.expected

  let id = "";
  let count: string;
  let countNbr: number;
  const popTypeExclusion: PopulationType = <PopulationType>(
    String(expectedPopType).concat("Exclusion")
  );

  id = targetPopulationCriteria.find(
    (value) => value.name === expectedPopType
  ).id;
  count = targetPopulationCriteria
    .find((value) => value.name === expectedPopType)
    .expected.toString();

  if (isNaN(parseInt(count))) {
    countNbr = count === "true" ? 1 : 0;
  } else {
    countNbr = parseInt(count);
  }
  const exclusions: number = targetPopulationCriteria.filter(
    (value) => value.name === popTypeExclusion
  ).length;
  countNbr = countNbr < 0 ? 0 : countNbr - exclusions;
  //if we expect 2 results for the denom, then we should get two expected results per observation
  const observations: MeasureObservation[] = measureGroups
    .find((group) => group.id === changedGroupId)
    .measureObservations?.filter(
      (observation) => observation.criteriaReference === id
    );
  return countNbr * (observations === undefined ? 0 : observations.length);
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

//@deprecated?
const getPopulationValues = (targetPopulationCriteria: GroupPopulation) => {
  // Checks if a value exists for the pop
  const numExIndex = targetPopulationCriteria.populationValues.findIndex(
    (prop) => {
      return prop.name === "numeratorExclusion";
    }
  );
  const numIndex = targetPopulationCriteria.populationValues.findIndex(
    (prop) => {
      return prop.name === "numerator";
    }
  );
  const denomExIndex = targetPopulationCriteria.populationValues.findIndex(
    (prop) => {
      return prop.name === "denominatorExclusion";
    }
  );
  const denomIndex = targetPopulationCriteria.populationValues.findIndex(
    (prop) => {
      return prop.name === "denominator";
    }
  );

  // Grabs the number within each population. If negative set it to zero
  return {
    num:
      Number(targetPopulationCriteria.populationValues[numIndex].expected) >= 0
        ? Number(targetPopulationCriteria.populationValues[numIndex].expected)
        : 0,
    numEx:
      targetPopulationCriteria.populationValues[numExIndex] &&
      Number(targetPopulationCriteria.populationValues[numExIndex].expected) >=
        0
        ? Number(targetPopulationCriteria.populationValues[numExIndex].expected)
        : 0,
    denom:
      Number(targetPopulationCriteria.populationValues[denomIndex].expected) >=
      0
        ? Number(targetPopulationCriteria.populationValues[denomIndex].expected)
        : 0,
    denomEx:
      targetPopulationCriteria.populationValues[denomExIndex] &&
      Number(
        targetPopulationCriteria.populationValues[denomExIndex].expected
      ) >= 0
        ? Number(
            targetPopulationCriteria.populationValues[denomExIndex].expected
          )
        : 0,
    numExIndex,
    denomExIndex,
  };
};

// for every MeasurePopulation value
// this method returns its equivalent fqm-execution PopulationResult identifier.
export function getFhirMeasurePopulationCode(population: string) {
  for (const [code, pop] of Object.entries(FHIR_POPULATION_CODES)) {
    if (population === pop) {
      return code;
    }
  }
}
