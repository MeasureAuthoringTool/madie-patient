import React from "react";
import tw, { styled } from "twin.macro";
import "styled-components/macro";
import TestCasePopulation from "./TestCasePopulation";
import { DisplayPopulationValue } from "@madie/madie-models";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";

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
  content = _.isNil(content) ? "Measure Group" : content;
  let contentId = content?.toLocaleLowerCase().replace(" ", "-");
  const measureObservationsCount = (population) => {
    const ratioMeasureObservations = populations.filter(
      (res) => res.name === "measureObservation"
    ).length;
    if (ratioMeasureObservations > 1) {
      if (population.name === "measureObservation") {
        measureObservations.push(population.name);
        return measureObservations.length;
      }
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
  // we need to do an all check here for pass / no pass
  const view = (() => {
    if (!executionRun) {
      return "initial";
    }
    for (let i = 0; i < populations?.length; i++) {
      const population = populations[i];
      const { expected, actual } = population;
      if (expected != actual) {
        return "fail";
      }
    }
    return "pass";
  })();
  /*
    we have three seperate views
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
          <span data-testid={`${contentId}-${i + 1}`} className={captionClass}>
            {content} {`${i + 1}`}
          </span>
          <span
            className="sub-caption"
            data-testid={`${contentId}-scoring-unit-${i + 1}`}
          >{` - (${scoring})`}</span>
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
              key={population.name}
              disableExpected={disableExpected}
              onChange={handleChange}
              measureObservationsCount={
                scoring === "Ratio" || scoring === "Continuous Variable"
                  ? measureObservationsCount(population)
                  : 0
              }
              error={errors?.populationValues?.[j]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCasePopulationList;
