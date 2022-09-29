import {
  DisplayPopulationValue,
  GroupPopulation,
  PopulationExpectedValue,
  PopulationType,
} from "@madie/madie-models";
import _ from "lodash";

export function triggerStratChanges(
  groupPopulations: GroupPopulation[],
  changedGroupId: string,
  changedStratification: DisplayPopulationValue,
  measureGroups
) {
  let returnPops: GroupPopulation[] = [...groupPopulations];

  const targetPopulation = returnPops.find(
    (groupPop) => groupPop.groupId === changedGroupId
  );

  if (_.isNil(targetPopulation)) {
    return groupPopulations;
  }
  const changedPopulationName = changedStratification?.name;
  const expectedValue = targetPopulation.populationValues.filter(
    (population) => population.name === changedPopulationName
  )[0]?.expected;
  let stratMap = {};
  let popMap = {};
  targetPopulation.stratificationValues?.forEach(
    (value: PopulationExpectedValue) => {
      stratMap[value.name] = value;
      if (
        !_.isUndefined(changedStratification) &&
        value.name === changedStratification.name
      ) {
        if (stratMap[value.name].expected != true) {
          stratMap[value.name].expected = false;
        }
      }
    }
  );

  targetPopulation.populationValues.forEach(
    (value: PopulationExpectedValue) => {
      popMap[value.name] = value;
    }
  );
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
            (population) => population.criteriaReference !== linkedPopulationId
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
          (observation) => observation.criteriaReference === criteriaReferenceID
        )[0].id;

        const numeratorMeasureObservationIndex =
          targetPopulation.populationValues.findIndex((prop) => {
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
          targetPopulation.populationValues.splice(
            numeratorMeasureObservationIndex,
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
}else{

  if (
    targetPopulation.scoring === "Continuous Variable" ||
    targetPopulation.scoring === "Ratio"
  ) {
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
            id:
              `Observation` +
              (targetPopulation.populationValues.length -
                (measurePopulation - measurePopulationEx)),
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
    } else if (
      changedPopulationName === "numeratorExclusion" ||
      changedPopulationName === "numerator" ||
      changedPopulationName === "denominatorExclusion" ||
      changedPopulationName === "denominator"
    ) {
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
      const numLen = num >= numEx ? num - numEx : 0;
      const denomLen = denom >= denomEx ? denom - denomEx : 0;

      const newLen = headLength + denomLen + numLen;

      if (
        (changedPopulationName === "numerator" && numExIn > -1) ||
        changedPopulationName === "numeratorExclusion"
      ) {
        if (newLen > targetPopulation.populationValues.length) {
          //ratio insert
          while (targetPopulation.populationValues.length < newLen) {
            targetPopulation.populationValues.push({
              name: PopulationType.MEASURE_OBSERVATION,
              expected: 0,
              id:
                "numeratorObservation" +
                (targetPopulation.populationValues.length - denomLen),
              criteriaReference: null,
            });
          }
        } else if (newLen < targetPopulation.populationValues.length) {
          while (targetPopulation.populationValues.length > newLen) {
            targetPopulation.populationValues.pop();
          }
        }
      } else {
        if (newLen > targetPopulation.populationValues.length) {
          let insertPoint = targetPopulation.populationValues.length - numLen;
          while (targetPopulation.populationValues.length < newLen) {
            targetPopulation.populationValues.splice(insertPoint, 0, {
              name: PopulationType.MEASURE_OBSERVATION,
              expected: 0,
              id:
                "denominatorObservation" +
                (targetPopulation.populationValues.length - numLen),
              criteriaReference: null,
            });
            insertPoint++;
          }
        } else if (newLen < targetPopulation.populationValues.length) {
          let delPoint =
            targetPopulation.populationValues.length - numLen - 1;
          while (targetPopulation.populationValues.length > newLen) {
            targetPopulation.populationValues.splice(delPoint, 1);
            delPoint--;
          }
        }
      }
    }
  }
}


  if (targetPopulation.scoring === "Proportion") {
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
