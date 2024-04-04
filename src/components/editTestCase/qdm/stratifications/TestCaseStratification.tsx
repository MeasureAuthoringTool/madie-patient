import React from "react";
import "styled-components/macro";
import { DisplayStratificationValue } from "@madie/madie-models";
import ExpectActualInput from "../populations/ExpectActualInput";

export interface TestCaseStratificationProps {
  strataCode: string;
  stratification: DisplayStratificationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  onStratificationChange: (stratification: DisplayStratificationValue) => void;
  QDM?: boolean;
  index?: number;
  isTestCaseExecuted?: boolean;
}

const TestCaseStratification = ({
  strataCode,
  stratification,
  populationBasis,
  disableExpected = false,
  onStratificationChange,
  index,
  QDM = false,
  isTestCaseExecuted = false,
}: TestCaseStratificationProps) => {
  return (
    <React.Fragment key={`fragment-key-${strataCode}`}>
      <tr
        tw="border-b"
        key={strataCode}
        data-testid={`test-row-population-id-${stratification.name}`}
        role="row"
      >
        <td>&nbsp;</td>
        <td role="cell">{QDM ? "Stratification" : strataCode}</td>
        <td role="cell">
          <ExpectActualInput
            id={`${stratification.name}-expected-cb`}
            expectedValue={stratification.expected}
            onChange={(expectedValue) =>
              onStratificationChange({
                ...stratification,
                expected: expectedValue,
              })
            }
            populationBasis={populationBasis}
            disabled={disableExpected}
            data-testid={
              QDM
                ? `test-population-${stratification.name}-expected-${index}`
                : `test-population-${stratification.name}-expected`
            }
            displayType="expected"
          />
        </td>
        <td role="cell">
          {isTestCaseExecuted ? (
            <ExpectActualInput
              id={`${stratification.name}-actual-cb`}
              expectedValue={stratification.actual}
              onChange={() => {}}
              populationBasis={populationBasis}
              disabled={true}
              data-testid={
                QDM
                  ? `test-stratification-${stratification.name}-actual-${index}`
                  : `test-stratification-${stratification.name}-actual`
              }
              displayType="actual"
            />
          ) : (
            <pre
              data-testid={
                QDM
                  ? `test-stratification-${stratification.name}-actual-${index}`
                  : `test-stratification-${stratification.name}-actual`
              }
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
    </React.Fragment>
  );
};

export default TestCaseStratification;
