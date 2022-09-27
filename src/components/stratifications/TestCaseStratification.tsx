import React from "react";
import "styled-components/macro";
import { DisplayPopulationValue } from "@madie/madie-models";
import ExpectActualInput from "../populations/ExpectActualInput";

export interface TestCaseStratificationProps {
  strataCode: string;
  executionRun: boolean;
  stratification: DisplayPopulationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  onChange: (stratification: DisplayPopulationValue) => void;
}

const TestCaseStratification = ({
  strataCode,
  executionRun,
  stratification,
  populationBasis,
  disableExpected = false,
  onChange,
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
        <td role="cell">{strataCode}</td>
        <td role="cell">
          <ExpectActualInput
            id={`${stratification.name}-expected-cb`}
            expectedValue={stratification.expected}
            onChange={(expectedValue) =>
              onChange({ ...stratification, expected: expectedValue })
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
                onChange({ ...stratification, actual: expectedValue })
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
