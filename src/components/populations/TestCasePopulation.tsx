import React from "react";
import "styled-components/macro";
import { DisplayPopulationValue, getPopulationCode } from "@madie/madie-models";
import ExpectActualInput from "./ExpectActualInput";
import { HelperText } from "@madie/madie-components";

export interface TestCasePopulationProps {
  executionRun: boolean;
  population: DisplayPopulationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  onChange: (population: DisplayPopulationValue) => void;
  error: any;
}

const TestCasePopulation = ({
  executionRun,
  population,
  populationBasis,
  disableExpected = false,
  onChange,
  error,
}: TestCasePopulationProps) => {
  return (
    <React.Fragment key={`fragment-key-${population.name}`}>
      <tr
        tw="border-b"
        key={population.name}
        data-testid={`test-row-population-id-${population.name}`}
        role="row"
      >
        <td>&nbsp;</td>
        <td role="cell">
          {getPopulationCode(population.name).toLocaleLowerCase()}
        </td>
        <td role="cell">
          <ExpectActualInput
            id={`${population.name}-expected-cb`}
            name={population.name}
            expectedValue={population.expected}
            onChange={(expectedValue) =>
              onChange({ ...population, expected: expectedValue })
            }
            populationBasis={populationBasis}
            disabled={disableExpected}
            data-testid={`test-population-${population.name}-expected`}
            displayType="expected"
          />
        </td>
        <td role="cell">
          {executionRun ? (
            <ExpectActualInput
              id={`${population.name}-actual-cb`}
              expectedValue={population.actual}
              onChange={(expectedValue) =>
                onChange({ ...population, actual: expectedValue })
              }
              populationBasis={populationBasis}
              disabled={true}
              data-testid={`test-population-${population.name}-actual`}
              displayType="actual"
            />
          ) : (
            <pre data-testid={`test-population-${population.name}-actual`}>
              {" "}
              -
            </pre>
          )}
        </td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      {error?.expected && (
        <tr tw="border-b">
          <td>&nbsp;</td>
          <td colSpan={5}>
            <span
              data-testid={`${population.name}-error-helper-text`}
              role="alert"
              className="qpp-error-message"
              style={{ textTransform: "none" }}
            >
              {error?.expected}
            </span>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default TestCasePopulation;
