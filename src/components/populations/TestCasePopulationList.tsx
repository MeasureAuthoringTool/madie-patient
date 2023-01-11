import React from "react";
import tw, { styled } from "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import TestCasePopulation from "./TestCasePopulation";
import { DisplayPopulationValue, PopulationType } from "@madie/madie-models";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export interface TestCasePopulationListProps {
  content: string;
  i: number;
  scoring: string;
  populations: DisplayPopulationValue[];
  populationBasis: string;
  disableExpected?: boolean;
  executionRun?: boolean;
  onChange?: (
    populations: DisplayPopulationValue[],
    type: "actual" | "expected",
    changedPopulation: DisplayPopulationValue
  ) => void;
  errors?: any;
}
const StyledIcon = styled(FontAwesomeIcon)(
  ({ errors }: { errors: boolean }) => [
    errors ? tw`text-red-700 mr-1.5` : tw`text-green-700 mr-1.5`,
  ]
);

export const determineGroupResult = (
  populationBasis: string,
  populations: DisplayPopulationValue[],
  executionRun?: boolean
) => {
  if (!executionRun) {
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

// Test case population table. We need to know if the execution has been
const TestCasePopulationList = ({
  content,
  scoring,
  i,
  populations,
  populationBasis,
  disableExpected = true,
  executionRun = false,
  onChange,
  errors,
}: TestCasePopulationListProps) => {
  let measureObservations = [];
  let numeratorObservations = [];
  let denominatorObservations = [];
  let initialPopulations = [];
  let contentId = content?.toLocaleLowerCase().replace(/(\W)+/g, "-");

  const getPopulationCount = (populations, type: PopulationType): number => {
    return populations.filter((res) => res.name === type).length;
  };

  const getObservationCount = (
    observationCount: number,
    observation: PopulationType,
    observations: Array<PopulationType>
  ) => {
    if (observationCount > 1) {
      observations.push(observation);
      return observations.length;
    } else {
      observations = [];
      return 0;
    }
  };

  const measureObservationsCount = (population) => {
    let count = 0;
    if (population.name === PopulationType.MEASURE_POPULATION_OBSERVATION) {
      count = getPopulationCount(populations, population.name);
      return getObservationCount(count, population.name, measureObservations);
    } else if (population.name === PopulationType.DENOMINATOR_OBSERVATION) {
      count = getPopulationCount(populations, population.name);
      return getObservationCount(
        count,
        population.name,
        denominatorObservations
      );
    } else if (population.name === PopulationType.NUMERATOR_OBSERVATION) {
      count = getPopulationCount(populations, population.name);
      return getObservationCount(count, population.name, numeratorObservations);
    } else {
      return 0;
    }
  };
  const handleChange = (population: DisplayPopulationValue) => {
    // testing(populations)
    const newPopulations = [...populations];
    const newPop = newPopulations.find((pop) => pop.id === population.id);
    const type =
      newPop.actual !== population.actual
        ? "actual"
        : newPop.expected !== population.expected
        ? "expected"
        : null;
    newPop.actual = population.actual;
    newPop.expected = population.expected;
    if (onChange) {
      onChange(newPopulations, type, population);
    }
  };

  const getIppCount = (population: DisplayPopulationValue) => {
    if (scoring === "Ratio") {
      const initialPopulationsCount = populations.filter(
        (pop) => pop.name === "initialPopulation"
      ).length;
      if (initialPopulationsCount > 1) {
        if (population.name === "initialPopulation") {
          initialPopulations.push(population.name);
          return initialPopulations.length;
        }
      }
    }
    return 0;
  };

  // we need to do an all check here for pass / no pass
  const view = determineGroupResult(populationBasis, populations, executionRun);

  /*
    we have three separate views
    - not run
    - run and all pass
    - run and not all pass
  */
  const captionClass = classNames("caption", {
    pass: view === "pass",
    fail: view === "fail",
  });

  return (
    <div>
      <table
        data-testid="test-case-population-list-tbl"
        className="population-table"
      >
        <caption>
          {executionRun && (
            <StyledIcon
              icon={view === "pass" ? faCheckCircle : faTimesCircle}
              data-testid={`test-population-icon-${scoring}`}
              errors={view === "fail"}
            />
          )}
          <span data-testid={contentId} className={captionClass}>
            {content}
          </span>
          <span
            className="sub-caption"
            data-testid={`${contentId}-scoring-unit-${i + 1}`}
          >{` - ${scoring} | ${populationBasis}`}</span>
        </caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Population</th>
            <th scope="col">Expected</th>
            <th scope="col">Actual</th>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {populations?.map((population, j) => (
            <TestCasePopulation
              executionRun={executionRun}
              population={population}
              populationBasis={populationBasis}
              key={population.id}
              disableExpected={disableExpected}
              onChange={handleChange}
              measureObservationsCount={
                scoring === "Ratio" || scoring === "Continuous Variable"
                  ? measureObservationsCount(population)
                  : 0
              }
              initialPopulationCount={getIppCount(population)}
              error={errors?.populationValues?.[j]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCasePopulationList;
