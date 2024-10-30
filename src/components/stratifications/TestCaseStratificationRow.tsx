import React from "react";
import _ from "lodash";
import "styled-components/macro";
import { DisplayStratificationValue } from "@madie/madie-models";
import ExpectActualInput from "../populations/ExpectActualInput";

export interface TestCaseStratificationRowProps {
  strataCode: string;
  isTestCaseExecuted: boolean;
  setIsTestCaseExecuted: (isTestCaseExecuted: boolean) => void;
  stratification: DisplayStratificationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  stratId?: string;
  onStratificationChange: (
    stratification: DisplayStratificationValue,
    stratId: string
  ) => void;
  associations?: string[];
}

const TestCaseStratificationRow = ({
  strataCode,
  isTestCaseExecuted,
  setIsTestCaseExecuted,
  stratification,
  populationBasis,
  disableExpected = false,
  onStratificationChange,
  stratId,
}: TestCaseStratificationRowProps) => {
  const hrName = _.startCase(stratification.name);
  return (
    <tr
      tw="border-b"
      key={strataCode}
      data-testid={`strat-row-population-id-${stratification.name}`}
      role="row"
    >
      <td>&nbsp;</td>
      <td role="cell">{`${strataCode} ${hrName}`}</td>
      <td role="cell">
        <ExpectActualInput
          id={`${stratification.name}-expected-cb`}
          expectedValue={stratification.expected}
          disabled={disableExpected}
          onChange={(expectedValue) => {
            setIsTestCaseExecuted(false);
            onStratificationChange(
              {
                ...stratification,
                expected: expectedValue,
              },
              stratId
            );
          }}
          populationBasis={populationBasis}
          data-testid={`${strataCode}-${stratification.name}-expected`}
          displayType="expected"
        />
      </td>
      <td role="cell">
        {isTestCaseExecuted ? (
          <ExpectActualInput
            id={`${stratification.name}-actual-cb`}
            expectedValue={stratification.actual}
            onChange={(expectedValue) => {
              setIsTestCaseExecuted(false);
              onStratificationChange(
                {
                  ...stratification,
                  actual: expectedValue,
                },
                stratId
              );
            }}
            populationBasis={populationBasis}
            disabled={true}
            data-testid={`${strataCode}-${stratification.name}-actual`}
            displayType="actual"
          />
        ) : (
          <pre
            data-testid={`test-stratification-${stratification.name}-actual`}
          >
            {" "}
            -
          </pre>
        )}
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  );
};

export default TestCaseStratificationRow;
