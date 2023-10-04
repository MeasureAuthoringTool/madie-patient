import React from "react";
import "styled-components/macro";
import { DisplayStratificationValue } from "@madie/madie-models";
import ExpectActualInput from "../populations/ExpectActualInput";

export interface TestCaseStratificationProps {
  strataCode: string;
  executionRun: boolean;
  stratification: DisplayStratificationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  onStratificationChange: (stratification: DisplayStratificationValue) => void;
  QDM?: boolean;
}

const TestCaseStratification = ({
  strataCode,
  executionRun,
  stratification,
  populationBasis,
  disableExpected = false,
  onStratificationChange,
  QDM,
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
        <td role="cell">{QDM ? strataCode : "Stratification"}</td>
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
            data-testid={`test-population-${stratification.name}-expected`}
            displayType="expected"
          />
        </td>
        <td role="cell">
          {executionRun ? (
            <ExpectActualInput
              id={`${stratification.name}-actual-cb`}
              expectedValue={stratification.actual}
              onChange={(expectedValue) =>
                onStratificationChange({
                  ...stratification,
                  actual: expectedValue,
                })
              }
              stratificationBasis={populationBasis}
              disabled={true}
              data-testid={`test-stratification-${stratification.name}-actual`}
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
    </React.Fragment>
  );
};

export default TestCaseStratification;
