import {
  DisplayPopulationValue,
  StratificationExpectedValue,
} from "@madie/madie-models";
import _ from "lodash";

// Determines if expected and actual values of all populations matches
export const determineGroupResult = (
  populationBasis: string,
  populations: DisplayPopulationValue[],
  isTestCaseExecuted?: boolean
) => {
  if (!isTestCaseExecuted) {
    return "initial";
  }
  for (let i = 0; i < populations?.length; i++) {
    const population = populations[i];
    const { expected, actual } = population;
    if (populationBasis === "boolean" && expected != actual) {
      return "fail";
    } else if (populationBasis !== "boolean") {
      const expectedNum =
        _.isNil(expected) ||
        (typeof expected === "string" && _.isEmpty(expected))
          ? 0
          : expected;
      const actualNum =
        _.isNil(actual) || (typeof actual === "string" && _.isEmpty(actual))
          ? 0
          : actual;
      if (expectedNum != actualNum) {
        return "fail";
      }
    }
  }
  return "pass";
};

// Determines if stratification expected and actual value matches along with all its populations
export const determineGroupResultStratification = (
  populationBasis: string,
  stratification: StratificationExpectedValue,
  isTestCaseExecuted?: boolean
) => {
  if (!isTestCaseExecuted) {
    return "initial";
  }
  const { expected, actual } = stratification;
  if (populationBasis === "boolean" && expected != actual) {
    return "fail";
  } else if (populationBasis !== "boolean") {
    const expectedNum =
      _.isNil(expected) || (typeof expected === "string" && _.isEmpty(expected))
        ? 0
        : expected;
    const actualNum =
      _.isNil(actual) || (typeof actual === "string" && _.isEmpty(actual))
        ? 0
        : actual;
    if (expectedNum != actualNum) {
      return "fail";
    }
  }
  return determineGroupResult(
    populationBasis,
    stratification?.populationValues,
    isTestCaseExecuted
  );
};
