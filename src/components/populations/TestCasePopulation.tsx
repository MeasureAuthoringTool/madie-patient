import React from "react";
import "styled-components/macro";
import { DisplayPopulationValue, getPopulationCode } from "@madie/madie-models";
import ExpectActualInput from "./ExpectActualInput";

export interface TestCasePopulationProps {
  executionRun: boolean;
  population: DisplayPopulationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  onChange: (population: DisplayPopulationValue) => void;
  measureObservationsCount: number;
}

const TestCasePopulation = ({
  executionRun,
  population,
  populationBasis,
  disableExpected = false,
  onChange,
  measureObservationsCount,
}: TestCasePopulationProps) => {
  const populationNameTemplate = (prop) => {
    if (prop === "measureObservation") {
      return (
        getPopulationCode(population.name).toLocaleLowerCase() +
        (measureObservationsCount > 0 ? measureObservationsCount : "")
      );
    } else {
      return getPopulationCode(population.name).toLocaleLowerCase();
    }
  };
  return (
    <React.Fragment key={`fragment-key-${population.name}`}>
      <tr
        tw="border-b"
        key={population.name}
        data-testid={`test-row-population-id-${population.name}`}
        role="row"
      >
        <td>&nbsp;</td>
        <td role="cell">{populationNameTemplate(population.name)}</td>
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
    </React.Fragment>
  );
};

export default TestCasePopulation;
