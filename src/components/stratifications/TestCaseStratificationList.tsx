import React from "react";
import tw, { styled } from "twin.macro";
import "styled-components/macro";
import TestCasePopulation from "../populations/TestCasePopulation";
import { DisplayPopulationValue } from "@madie/madie-models";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export interface TestCaseStratificationListProps {
  i: number;
  scoring: string;
  stratifications: DisplayPopulationValue[];
  populationBasis: string;
  disableExpected?: boolean;
  executionRun?: boolean;
  onChange?: (
    stratifications: DisplayPopulationValue[],
    type: "actual" | "expected",
    changedStratification: DisplayPopulationValue
  ) => void;
}
const StyledIcon = styled(FontAwesomeIcon)(
  ({ errors }: { errors: boolean }) => [
    errors ? tw`text-red-700 mr-1.5` : tw`text-green-700 mr-1.5`,
  ]
);

// Test case stratification table. We need to know if the execution has been
const TestCaseStratificationList = ({
  scoring,
  i,
  stratifications,
  populationBasis,
  disableExpected = true,
  executionRun = false,
  onChange,
}: TestCaseStratificationListProps) => {
  const handleChange = (stratification: DisplayPopulationValue) => {
    const newStratifications = [...stratifications];
    const newStrat = newStratifications.find(
      (strat) => strat.name === stratification.name
    );
    const type =
      newStrat.actual !== stratification.actual
        ? "actual"
        : newStrat.expected !== stratification.expected
        ? "expected"
        : null;
    newStrat.actual = stratification.actual;
    newStrat.expected = stratification.expected;
    if (onChange) {
      onChange(newStratifications, type, stratification);
    }
  };
  // we need to do an all check here for pass / no pass
  const view = (() => {
    if (!executionRun) {
      return "initial";
    }
    for (let i = 0; i < stratifications.length; i++) {
      const stratification = stratifications[i];
      const { expected, actual } = stratification;
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

  const outputBody = () => {
    let i = 1;
    return stratifications?.map((stratification) => (
      <TestCasePopulation
        executionRun={executionRun}
        population={stratification}
        populationBasis={populationBasis}
        key={"strata-" + i}
        disableExpected={disableExpected}
        onChange={handleChange}
      />
    ));
  };

  return (
    <div>
      <table
        data-testid="test-case-stratification-list-tbl"
        className="population-table"
      >
        <caption>
          {executionRun && (
            <StyledIcon
              icon={view === "pass" ? faCheckCircle : faTimesCircle}
              data-testid={`test-stratification-icon-${scoring}`}
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
            <th scope="col">Stratification</th>
            <th scope="col">Expected</th>
            <th scope="col">Actual</th>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>{outputBody()}</tbody>
      </table>
    </div>
  );
};

export default TestCaseStratificationList;
