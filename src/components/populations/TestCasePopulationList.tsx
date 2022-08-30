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

export interface TestCasePopulationListProps {
  i: number;
  scoring: string;
  populations: DisplayPopulationValue[];
  disableExpected?: boolean;
  executionRun?: boolean;
  onChange?: (
    populations: DisplayPopulationValue[],
    type: "actual" | "expected"
  ) => void;
  setChangedPopulation?: (string: string) => void;
}
const StyledIcon = styled(FontAwesomeIcon)(
  ({ errors }: { errors: boolean }) => [
    errors ? tw`text-red-700 mr-1.5` : tw`text-green-700 mr-1.5`,
  ]
);

// Test case population table. We need to know if the execution has been
const TestCasePopulationList = ({
  scoring,
  i,
  populations,
  disableExpected = true,
  executionRun = false,
  onChange,
  setChangedPopulation,
}: TestCasePopulationListProps) => {
  const handleChange = (population: DisplayPopulationValue) => {
    const newPopulations = [...populations];
    const newPop = newPopulations.find((pop) => pop.name === population.name);
    const type =
      newPop.actual !== population.actual
        ? "actual"
        : newPop.expected !== population.expected
        ? "expected"
        : null;
    newPop.actual = population.actual;
    newPop.expected = population.expected;
    if (onChange) {
      onChange(newPopulations, type);
    }
  };
  // we need to do an all check here for pass / no pass
  const view = (() => {
    if (!executionRun) {
      return "initial";
    }
    for (let i = 0; i < populations.length; i++) {
      const population = populations[i];
      const { expected, actual } = population;
      if (expected !== actual) {
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
          <span data-testid={`measure-group-${i + 1}`} className={captionClass}>
            Measure Group {`${i + 1}`}
          </span>
          <span
            className="sub-caption"
            data-testid={`scoring-unit-${i + 1}`}
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
          {populations?.map((population) => (
            <TestCasePopulation
              population={population}
              key={population.name}
              disableExpected={disableExpected}
              onChange={handleChange}
              setChangedPopulation={setChangedPopulation}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCasePopulationList;
