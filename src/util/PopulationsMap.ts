import {
  PopulationType,
  GroupPopulation,
  Group,
  PopulationExpectedValue,
  DisplayPopulationValue,
  MeasureObservation,
  DisplayStratificationValue,
  StratificationExpectedValue,
  MeasureScoring,
  TestCase,
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
  changedStratification: DisplayStratificationValue
) => {
  let stratificationMap = {};
  populationCritiera.stratificationValues?.forEach(
    (value: StratificationExpectedValue) => {
      stratificationMap[value.id] = value;
      if (
        !_.isUndefined(changedStratification) &&
        value.id === changedStratification.id
      ) {
        stratificationMap[value.id].expected = changedStratification.expected;
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

    const [newPopBucket, denomBucket, numerBucket, msrPopBucket]: [
      PopulationExpectedValue[],
      PopulationExpectedValue[],
      PopulationExpectedValue[],
      PopulationExpectedValue[]
    ] = addObservations(
      expectedObservationsPerPop,
      populationBucket,
      nonExcludedPopType
    );
    const denomIdx =
      populationBucket.findIndex(
        (value) => value.name === PopulationType.DENOMINATOR
      ) + 1;

    newPopBucket.splice(denomIdx, 0, ...denomBucket);

    const numerIdx =
      newPopBucket.findIndex(
        (value) => value.name === PopulationType.NUMERATOR
      ) + 1;

    newPopBucket.splice(numerIdx, 0, ...numerBucket);
    const msrPpIdx =
      populationBucket.findIndex(
        (value) => value.name === PopulationType.MEASURE_POPULATION
      ) + 1;
    newPopBucket.splice(msrPpIdx, 0, ...msrPopBucket);
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
  popType: PopulationType
): [
  PopulationExpectedValue[],
  PopulationExpectedValue[],
  PopulationExpectedValue[],
  PopulationExpectedValue[]
] {
  let denominatorBucket: PopulationExpectedValue[] = populationBucket.filter(
    (value) => value.name == PopulationType.DENOMINATOR_OBSERVATION
  );
  let numeratorBucket: PopulationExpectedValue[] = populationBucket.filter(
    (value) => value.name == PopulationType.NUMERATOR_OBSERVATION
  );
  let measurePopulationObservationBucket: PopulationExpectedValue[] =
    populationBucket.filter(
      (value) => value.name == PopulationType.MEASURE_POPULATION_OBSERVATION
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
    let obvType: PopulationType = <PopulationType>(
      String(popType).concat("Observation")
    );
    if (value.name === popType) {
      //if we need to add observations?
      if (popType === PopulationType.DENOMINATOR) {
        denominatorBucket = modifyBucket(
          denominatorBucket,
          expectedObservationsPerPop,
          obvType,
          popType,
          value
        );
      } else if (popType === PopulationType.NUMERATOR) {
        numeratorBucket = modifyBucket(
          numeratorBucket,
          expectedObservationsPerPop,
          obvType,
          popType,
          value
        );
      } else if (popType === PopulationType.MEASURE_POPULATION) {
        measurePopulationObservationBucket = modifyBucket(
          measurePopulationObservationBucket,
          expectedObservationsPerPop,
          obvType,
          popType,
          value
        );
      }

      //return the new array and mutated copy of the original
    }
  });

  return [
    tempPopBucket,
    denominatorBucket,
    numeratorBucket,
    measurePopulationObservationBucket,
  ];
}
function modifyBucket(
  observationBucket: PopulationExpectedValue[],
  expectedObservationsPerPop: number,
  obvType: PopulationType,
  popType: PopulationType,
  value: PopulationExpectedValue
): PopulationExpectedValue[] {
  const existingObvLen: number = observationBucket.length;
  if (expectedObservationsPerPop > existingObvLen) {
    let addObservations = expectedObservationsPerPop - existingObvLen;
    for (let i = 0; i < addObservations; i++) {
      observationBucket.push({
        name: obvType,
        expected: 0,
        id: String(popType) + "Observation" + (i + existingObvLen),
        criteriaReference: value.id,
      } as unknown as PopulationExpectedValue);
    }
    //or remove observations
  } else if (expectedObservationsPerPop < existingObvLen) {
    let removeObservations = existingObvLen - expectedObservationsPerPop;
    for (let i = 0; i < removeObservations; i++) {
      observationBucket.pop();
    }
  }
  return observationBucket;
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

export const mapExistingTestCasePopulations = (
  existingTestCasePC,
  group: Group
) => {
  const isBooleanOrPatientBasis =
    group.populationBasis === "true" || group.populationBasis === "boolean";
  const isScoringRatio = existingTestCasePC?.scoring === MeasureScoring.RATIO;
  const hasPopulationValues =
    existingTestCasePC?.populationValues &&
    existingTestCasePC.populationValues.length > 0;

  if (
    isScoringRatio &&
    hasPopulationValues &&
    group?.measureObservations?.length > 0
  ) {
    if (isBooleanOrPatientBasis) {
      return addDefaultObservationsForPatientBasedPopulations(
        existingTestCasePC,
        group
      );
    } else {
      return addDefaultObservationsForEpisodeBasedPopulations(
        existingTestCasePC,
        group
      );
    }
  }
  return { ...existingTestCasePC };
};

const countObservations = (
  expectedRelatedPopulationValue,
  expectedRelatedPopulationExclusionValue
) => {
  if (
    expectedRelatedPopulationValue &&
    expectedRelatedPopulationExclusionValue
  ) {
    const observationsCount = Math.max(
      expectedRelatedPopulationValue - expectedRelatedPopulationExclusionValue,
      0
    );
    return observationsCount;
  }
  return expectedRelatedPopulationValue;
};

const findObservation = (name, group) =>
  group.measureObservations.find(
    (observation) =>
      observation.criteriaReference ===
      group.populations.find((popVal) => popVal.name === name)?.id
  );

const addDefaultObservationsForEpisodeBasedPopulations = (
  existingTestCasePC,
  group
) => {
  const findPopulation = (name) =>
    existingTestCasePC.populationValues.find(
      (popVal) => popVal.name === name && popVal.expected > 0
    );

  const addObservation = (
    name,
    relatedPopulation,
    relatedPopulationExclusion
  ) => {
    const observationName = `${name}Observation`;
    const isObservationPresent = existingTestCasePC.populationValues.find(
      (popVal) => popVal.name === observationName
    );

    if (!isObservationPresent) {
      const observationsCount = countObservations(
        relatedPopulation?.expected,
        relatedPopulationExclusion?.expected
      );
      if (observationsCount) {
        const defaultObservations = Array.from(
          { length: observationsCount },
          (_, i) => ({
            name: observationName,
            expected: 0,
            actual: null,
            id: `${observationName}${i}`,
            criteriaReference: relatedPopulation?.id,
          })
        );

        const populationIndex = existingTestCasePC.populationValues.findIndex(
          (item) => item.name === name
        );
        if (populationIndex !== -1) {
          existingTestCasePC.populationValues.splice(
            populationIndex + 1,
            0,
            ...defaultObservations
          );
        }
      }
    }
  };

  const denominatorExpectedHasValue = findPopulation("denominator");
  const denominatorExclusionExpectedHasValue = findPopulation(
    "denominatorExclusion"
  );
  const numeratorExpectedHasValue = findPopulation("numerator");
  const numeratorExclusionExpectedHasValue =
    findPopulation("numeratorExclusion");

  if (denominatorExpectedHasValue) {
    const denominatorObservation = findObservation("denominator", group);

    if (denominatorObservation) {
      addObservation(
        "denominator",
        denominatorExpectedHasValue,
        denominatorExclusionExpectedHasValue
      );
    }
  }

  if (numeratorExpectedHasValue) {
    const numeratorObservation = findObservation("numerator", group);
    if (numeratorObservation) {
      addObservation(
        "numerator",
        numeratorExpectedHasValue,
        numeratorExclusionExpectedHasValue
      );
    }
  }
  return { ...existingTestCasePC };
};

const addDefaultObservationsForPatientBasedPopulations = (
  existingTestCasePC,
  group: Group
) => {
  const findPopulation = (name, expected) =>
    existingTestCasePC.populationValues.find(
      (popVal) => popVal.name === name && popVal.expected === expected
    );

  const addObservation = (name, criteriaRefId) => {
    const observationName = `${name}Observation`;
    const isObservationPresent = existingTestCasePC.populationValues.find(
      (popVal) => popVal.name === observationName
    );

    if (!isObservationPresent) {
      const defaultObservation = {
        name: observationName,
        expected: 0,
        actual: null,
        id: `${observationName}0`,
        criteriaReference: criteriaRefId,
      };

      const populationIndex = existingTestCasePC.populationValues.findIndex(
        (item) => item.name === name
      );
      if (populationIndex !== -1) {
        existingTestCasePC.populationValues.splice(
          populationIndex + 1,
          0,
          defaultObservation
        );
      }
    }
  };

  const denominatorExpectedTrue = findPopulation("denominator", true);
  const denominatorExclusionExpectedTrue = findPopulation(
    "denominatorExclusion",
    true
  );
  const numeratorExpectedTrue = findPopulation("numerator", true);
  const numeratorExclusionExpectedTrue = findPopulation(
    "numeratorExclusion",
    true
  );

  if (denominatorExpectedTrue && !denominatorExclusionExpectedTrue) {
    const denominatorObservation = findObservation("denominator", group);

    if (denominatorObservation) {
      addObservation("denominator", denominatorExpectedTrue.id);
    }
  }

  if (numeratorExpectedTrue && !numeratorExclusionExpectedTrue) {
    const numeratorObservation = findObservation("numerator", group);

    if (numeratorObservation) {
      addObservation("numerator", numeratorExpectedTrue.id);
    }
  }
  return { ...existingTestCasePC };
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
