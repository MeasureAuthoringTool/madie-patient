import {
  PopulationType,
  GroupPopulation,
  Group,
  PopulationExpectedValue,
  DisplayPopulationValue,
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
) {
  let returnPops: GroupPopulation[] = [...groupPopulations];

  // Find the modified Group/Population Criteria
  const targetGroup = returnPops.find(
    (groupPop) => groupPop.groupId === changedGroupId
  );

  if (_.isNil(targetGroup)) {
    return groupPopulations;
  }

  const changedPopulationName = changedTarget?.name;
  const expectedValue = targetGroup.populationValues.find(
    (population) => population.name === changedPopulationName
  )?.expected;

  let stratMap = buildStratificationMap(targetGroup, changedTarget);
  let popMap = buildPopulationMap(targetGroup);

  addRemoveObservationsForBooleanBasedPopulationCriteria(
    targetGroup,
    measureGroups,
    changedPopulationName,
    expectedValue,
    changedGroupId
  );

  addRemoveObservationsForNonBooleanPopulationCritieria(
    targetGroup,
    changedPopulationName
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
  changedPopulationName: string
) {
  if (targetPopulationCriteria.populationBasis === "Boolean") return;

  if (
    targetPopulationCriteria.scoring === "Continuous Variable" &&
    (changedPopulationName === "measurePopulationExclusion" ||
      changedPopulationName === "measurePopulation")
  ) {
    const measurePopulation =
        Number(targetPopulationCriteria.populationValues[1].expected) >= 0
          ? Number(targetPopulationCriteria.populationValues[1].expected)
          : 0,
      //checks if the exclusion exists, if not, sets value to zero
      measurePopulationEx =
        targetPopulationCriteria.populationValues[2].name ===
          "measurePopulationExclusion" &&
        Number(targetPopulationCriteria.populationValues[2].expected) >= 0
          ? Number(targetPopulationCriteria.populationValues[2].expected)
          : 0;
    //catches potential negative, zeroing out if so
    const measurePopDif =
      measurePopulationEx < measurePopulation
        ? measurePopulation - measurePopulationEx
        : 0;
    const measaurePopulationLengnth = 3;

    if (
      targetPopulationCriteria.populationValues.length <
      measaurePopulationLengnth + measurePopDif
    ) {
      while (
        targetPopulationCriteria.populationValues.length <
        measaurePopulationLengnth + measurePopDif
      ) {
        targetPopulationCriteria.populationValues.push({
          name: PopulationType.MEASURE_OBSERVATION,
          expected: 0,
          id:
            `Observation` +
            (targetPopulationCriteria.populationValues.length -
              (measurePopulation - measurePopulationEx)),
          criteriaReference: undefined,
        });
      }
    } else if (
      targetPopulationCriteria.populationValues.length >
      measaurePopulationLengnth + measurePopDif
    ) {
      while (
        targetPopulationCriteria.populationValues.length >
        measaurePopulationLengnth + measurePopDif
      ) {
        targetPopulationCriteria.populationValues.pop();
      }
    }
    // handle non-boolean based Ratio
  } else if (
    targetPopulationCriteria.scoring === "Ratio" &&
    (changedPopulationName === "numeratorExclusion" ||
      changedPopulationName === "numerator" ||
      changedPopulationName === "denominatorExclusion" ||
      changedPopulationName === "denominator")
  ) {
    //check which fields are present and grab their indices
    const { num, numEx, denom, denomEx, numExIndex, denomExIndex } =
      getPopulationValues(targetPopulationCriteria);

    //headLength is the total length of the array before observations are put in
    // ipp, num, and denom are required and expected, hence headLength starts at 3.
    const headLength =
      3 + (numExIndex > -1 ? 1 : 0) + (denomExIndex > -1 ? 1 : 0);
    //total length of numerator and denominator observations
    const numObservationLen = num >= numEx ? num - numEx : 0;
    const denomObservationLen = denom >= denomEx ? denom - denomEx : 0;
    //target length of populationValues[]
    const newLen = headLength + denomObservationLen + numObservationLen;

    if (
      changedPopulationName === "numerator" ||
      changedPopulationName === "numeratorExclusion"
    ) {
      addRemoveNumeratorObservations(
        newLen,
        targetPopulationCriteria,
        headLength,
        denomObservationLen
      );
    } else {
      addRemoveDenominatorObservations(
        newLen,
        targetPopulationCriteria,
        numObservationLen,
        headLength
      );
    }
  }
}

function addRemoveNumeratorObservations(
  newLen: number,
  targetPopulationCriteria: GroupPopulation,
  headLength: number,
  denomLen: number
) {
  if (newLen > targetPopulationCriteria.populationValues.length) {
    while (targetPopulationCriteria.populationValues.length < newLen) {
      targetPopulationCriteria.populationValues.push({
        name: PopulationType.MEASURE_OBSERVATION,
        expected: 0,
        id:
          "numeratorObservation" +
          (targetPopulationCriteria.populationValues.length -
            headLength -
            denomLen +
            1),
        criteriaReference: null,
      });
    }
  } else if (newLen < targetPopulationCriteria.populationValues.length) {
    //numerator observation removal
    while (targetPopulationCriteria.populationValues.length > newLen) {
      targetPopulationCriteria.populationValues.pop();
    }
  }
}

function addRemoveDenominatorObservations(
  newLen: number,
  targetPopulationCriteria: GroupPopulation,
  numLen: number,
  headLength: number
) {
  if (newLen > targetPopulationCriteria.populationValues.length) {
    //insert point is before the numerator's observations
    let insertPoint = targetPopulationCriteria.populationValues.length - numLen;
    while (targetPopulationCriteria.populationValues.length < newLen) {
      targetPopulationCriteria.populationValues.splice(insertPoint, 0, {
        name: PopulationType.MEASURE_OBSERVATION,
        expected: 0,
        id:
          "denominatorObservation" +
          (targetPopulationCriteria.populationValues.length -
            headLength -
            numLen +
            1),
        criteriaReference: null,
      });
      insertPoint++;
    }
  } else if (newLen < targetPopulationCriteria.populationValues.length) {
    //denominator observation removal
    let delPoint =
      targetPopulationCriteria.populationValues.length - numLen - 1;
    while (targetPopulationCriteria.populationValues.length > newLen) {
      targetPopulationCriteria.populationValues.splice(delPoint, 1);
      delPoint--;
    }
  }
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
  if (group.measureObservations) {
    group.measureObservations.map((observation) => {
      populationTypesForScoring.push({
        name: PopulationType.MEASURE_OBSERVATION,
        id: observation.id,
        criteriaReference: observation.criteriaReference,
      });
    });
  }
  return populationTypesForScoring;
}

const addRemoveObservationsForBooleanBasedPopulationCriteria = (
  targetPopulationCriteria: GroupPopulation,
  measureGroups,
  changedPopulationName: string,
  expectedValue: boolean | number,
  changedGroupId: string
) => {
  if (targetPopulationCriteria.populationBasis !== "Boolean") {
    return;
  }

  // Modifying Observations for Boolean based CV
  if (
    targetPopulationCriteria.scoring === "Continuous Variable" &&
    changedPopulationName === "measurePopulationExclusion"
  ) {
    if (expectedValue) {
      // Remove Observation
      targetPopulationCriteria.populationValues =
        targetPopulationCriteria.populationValues.filter(
          (population) => population.name !== "measureObservation"
        );
    } else {
      // Add Observation
      const measureObservationId = measureGroups.find(
        (group) => group.id === changedGroupId
      ).measureObservations[0].id;
      targetPopulationCriteria.populationValues.push({
        name: PopulationType.MEASURE_OBSERVATION,
        expected: false,
        id: measureObservationId,
        criteriaReference: undefined,
      });
    }
  }

  // Modifying Observations for Boolean based Ratio
  if (
    targetPopulationCriteria.scoring === "Ratio" &&
    (changedPopulationName === "numeratorExclusion" ||
      changedPopulationName === "denominatorExclusion")
  ) {
    const linkedPopulationName =
      changedPopulationName === "numeratorExclusion"
        ? "numerator"
        : "denominator";
    if (expectedValue) {
      // Remove Observation
      const linkedPopulationId =
        targetPopulationCriteria.populationValues.filter(
          (target) => target.name === linkedPopulationName
        )[0].id;
      if (linkedPopulationId) {
        targetPopulationCriteria.populationValues =
          targetPopulationCriteria.populationValues.filter(
            (population) => population.criteriaReference !== linkedPopulationId
          );
      }
    } else {
      // Add Observation
      const criteriaReferenceID =
        targetPopulationCriteria.populationValues.filter(
          (population) => population.name === linkedPopulationName
        )[0].id;

      const changedPopulationObservations = measureGroups.filter(
        (group) => group.id === changedGroupId
      )[0].measureObservations;

      if (changedPopulationObservations && criteriaReferenceID) {
        const measureObservationId = changedPopulationObservations.filter(
          (observation) => observation.criteriaReference === criteriaReferenceID
        )[0].id;

        const numeratorMeasureObservationIndex =
          targetPopulationCriteria.populationValues.findIndex((prop) => {
            return prop.name === "measureObservation";
          });

        //always adding denominator obseravtion before numerator observation
        if (
          changedPopulationName === "denominatorExclusion" &&
          numeratorMeasureObservationIndex > -1
        ) {
          const denominatorMeasureObservation = {
            name: PopulationType.MEASURE_OBSERVATION,
            expected: false,
            id: measureObservationId,
            criteriaReference: criteriaReferenceID,
          };
          targetPopulationCriteria.populationValues.splice(
            numeratorMeasureObservationIndex,
            0,
            denominatorMeasureObservation
          );
        } else {
          targetPopulationCriteria.populationValues.push({
            name: PopulationType.MEASURE_OBSERVATION,
            expected: false,
            id: measureObservationId,
            criteriaReference: criteriaReferenceID,
          });
        }
      }
    }
  }
};

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
