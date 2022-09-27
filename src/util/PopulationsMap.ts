import { faHourglassEnd } from "@fortawesome/free-solid-svg-icons";
import {
  PopulationType,
  GroupPopulation,
  Group,
  PopulationExpectedValue,
  DisplayPopulationValue,
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
  changedGroupId: string,
  changedPopulation: DisplayPopulationValue,
  measureGroups
) {
  let returnPops: GroupPopulation[] = [...groupPopulations];
  const targetPopulation = returnPops.find(
    (groupPop) => groupPop.groupId === changedGroupId
  );

  if (_.isNil(targetPopulation)) {
    return groupPopulations;
  }

  const changedPopulationName = changedPopulation?.name;
  console.log(changedPopulation);
  const expectedValue = targetPopulation.populationValues.filter(
    (population) => population.name === changedPopulationName
  )[0]?.expected;
  let myMap = {};
  //aaaa
  if (targetPopulation.populationBasis === "Boolean") {
    if (
      targetPopulation.scoring === "Continuous Variable" ||
      targetPopulation.scoring === "Ratio"
    ) {
      //removing observations
      if (
        changedPopulationName === "measurePopulationExclusion" &&
        expectedValue === true
      ) {
        targetPopulation.populationValues =
          targetPopulation.populationValues.filter(
            (population) => population.name !== "measureObservation"
          );
      }

      if (
        (changedPopulationName === "numeratorExclusion" ||
          changedPopulationName === "denominatorExclusion") &&
        expectedValue === true
      ) {
        const linkedPopulationName =
          changedPopulationName === "numeratorExclusion"
            ? "numerator"
            : "denominator";
        const linkedPopulationId = targetPopulation.populationValues.filter(
          (target) => target.name === linkedPopulationName
        )[0].id;
        if (linkedPopulationId) {
          targetPopulation.populationValues =
            targetPopulation.populationValues.filter(
              (population) =>
                population.criteriaReference !== linkedPopulationId
            );
        }
      }

      //adding the observation(after removal)
      if (
        changedPopulationName === "measurePopulationExclusion" &&
        expectedValue === false
      ) {
        const measureObservationId = measureGroups.filter(
          (group) => group.id === changedGroupId
        )[0].measureObservations[0].id;
        targetPopulation.populationValues.push({
          name: PopulationType.MEASURE_OBSERVATION,
          expected: false,
          id: measureObservationId,
          criteriaReference: undefined,
        });
      }

      if (
        (changedPopulationName === "numeratorExclusion" ||
          changedPopulationName === "denominatorExclusion") &&
        expectedValue === false
      ) {
        const linkedPopulationName =
          changedPopulationName === "numeratorExclusion"
            ? "numerator"
            : "denominator";
        const criteriaReferenceID = targetPopulation.populationValues.filter(
          (population) => population.name === linkedPopulationName
        )[0].id;

        const changedPopulationObservations = measureGroups.filter(
          (group) => group.id === changedGroupId
        )[0].measureObservations;

        if (changedPopulationObservations && criteriaReferenceID) {
          const measureObservationId = changedPopulationObservations.filter(
            (observation) =>
              observation.criteriaReference === criteriaReferenceID
          )[0].id;

          const numeratorMeasureObservationid =
            targetPopulation.populationValues.findIndex((prop) => {
              return prop.name === "measureObservation";
            });

          //always adding denominator obseravtion before numerator observation
          if (
            changedPopulationName === "denominatorExclusion" &&
            numeratorMeasureObservationid > -1
          ) {
            const denominatorMeasureObservation = {
              name: PopulationType.MEASURE_OBSERVATION,
              expected: false,
              id: measureObservationId,
              criteriaReference: criteriaReferenceID,
            };
            targetPopulation.populationValues.splice(
              numeratorMeasureObservationid,
              0,
              denominatorMeasureObservation
            );
          } else {
            targetPopulation.populationValues.push({
              name: PopulationType.MEASURE_OBSERVATION,
              expected: false,
              id: measureObservationId,
              criteriaReference: criteriaReferenceID,
            });
          }
        }
      }
    }
    //bbbbbb
  } else {
    //aaaaa
    if (
      targetPopulation.scoring === "Continuous Variable" ||
      targetPopulation.scoring === "Ratio"
    ) {
      console.log(targetPopulation.populationValues);
      if (
        changedPopulationName === "measurePopulationExclusion" ||
        changedPopulationName === "measurePopulation"
      ) {
        const measurePopulation = Number(
            targetPopulation.populationValues[1].expected
          ),
          measurePopulationEx = Number(
            targetPopulation.populationValues[2].expected
          );

        if (
          targetPopulation.populationValues.length <
          3 + measurePopulation - measurePopulationEx
        ) {
          const measureObservationId = measureGroups.filter(
            (group) => group.id === changedGroupId
          )[0].measureObservations[0].id;
          while (
            targetPopulation.populationValues.length <
            3 + measurePopulation - measurePopulationEx
          ) {
            targetPopulation.populationValues.push({
              name: PopulationType.MEASURE_OBSERVATION,
              expected: 0,
              id: measureObservationId,
              criteriaReference: undefined,
            });
          }
        } else if (
          targetPopulation.populationValues.length >
          3 + measurePopulation - measurePopulationEx
        ) {
          if (measurePopulation - measurePopulationEx > 0) {
            while (
              targetPopulation.populationValues.length >
              3 + measurePopulation - measurePopulationEx
            ) {
              targetPopulation.populationValues.pop();
            }
          }
        }
      }
      //bbbb
      else {
        const numExIn = targetPopulation.populationValues.findIndex((prop) => {
          return prop.name === "numeratorExclusion";
        });
        const numIn = targetPopulation.populationValues.findIndex((prop) => {
          return prop.name === "numerator";
        });
        const denomExIn = targetPopulation.populationValues.findIndex(
          (prop) => {
            return prop.name === "denominatorExclusion";
          }
        );
        const denomIn = targetPopulation.populationValues.findIndex((prop) => {
          return prop.name === "denominator";
        });
        const num = Number(targetPopulation.populationValues[numIn].expected),
          numEx = Number(targetPopulation.populationValues[numExIn].expected),
          denom = Number(targetPopulation.populationValues[denomIn].expected),
          denomEx = Number(
            targetPopulation.populationValues[denomExIn].expected
          );
        const headLength =
          3 + (numExIn > -1 ? 1 : 0) + (denomExIn > -1 ? 1 : 0);
        const newLen = headLength + denom - denomEx + num - numEx;

        if (
          (changedPopulationName === "numerator" && numExIn > -1) ||
          changedPopulationName === "numeratorExclusion"
        ) {
          if (newLen > targetPopulation.populationValues.length) {
            //ratio insert
            while (targetPopulation.populationValues.length < newLen) {
              console.log(targetPopulation.populationValues);
              targetPopulation.populationValues.push({
                name: PopulationType.MEASURE_OBSERVATION,
                expected: 0,
                id: null,
                criteriaReference: null,
              });
            }
          } else if (newLen < targetPopulation.populationValues.length) {
            while (targetPopulation.populationValues.length > newLen) {
              targetPopulation.populationValues.pop();
            }
          }
        }
      }
    }
    console.log(targetPopulation.populationValues);
  }
  //iterate through
  targetPopulation.populationValues.forEach(
    (value: PopulationExpectedValue) => {
      myMap[value.name] = value;
    }
  );

  if (targetPopulation.scoring === "Proportion") {
    //denominator
    if (changedPopulationName === "denominator") {
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
    if (changedPopulationName === "numerator") {
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
    if (changedPopulationName === "denominatorExclusion") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
        myMap[PopulationType.DENOMINATOR].expected = true;
      }
    }
    //Denom Exception
    if (changedPopulationName === "denominatorException") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
        myMap[PopulationType.DENOMINATOR].expected = true;
      }
    }

    //Numer Exclusion
    if (changedPopulationName === "numeratorExclusion") {
      if (expectedValue === true) {
        myMap[PopulationType.INITIAL_POPULATION].expected = true;
        myMap[PopulationType.DENOMINATOR].expected = true;
        myMap[PopulationType.NUMERATOR].expected = true;
      }
    }

    //initialPopulation
    if (
      changedPopulationName === "initialPopulation" &&
      expectedValue === false
    ) {
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

  return returnPops;
}
