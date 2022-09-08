import React from "react";
import "styled-components/macro";
import { DisplayPopulationValue, getPopulationCode } from "@madie/madie-models";
import StyledCheckbox from "./StyledCheckBox";
import { TextField } from "@madie/madie-design-system/dist/react";

export interface TestCasePopulationProps {
  executionRun: boolean;
  population: DisplayPopulationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  onChange: (population: DisplayPopulationValue) => void;
  setChangedPopulation?: (string: string) => void;
}

const TestCasePopulation = ({
  executionRun,
  population,
  populationBasis,
  disableExpected = false,
  onChange,
  setChangedPopulation,
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
          {/* {populationBasis==="Boolean"? */}
          <StyledCheckbox
            id={`${population.name}-expected-cb`}
            name={population.name}
            checked={population.expected}
            onChange={(checked) =>
              onChange({ ...population, expected: checked })
            }
            setChangedPopulation={setChangedPopulation}
            populationBasis={populationBasis}
            disabled={disableExpected}
            data-testid={`test-population-${population.name}-expected`}
            displayType="expected"
          />
          {/* <TextField  onChange={(e) =>{
            console.log(e.target.name)
            onChange({ ...population, expected: e.target.value})
          }
          }size="small"/>} */}
        </td>
        <td role="cell">
          {executionRun ? (
            <StyledCheckbox
              id={`${population.name}-actual-cb`}
              checked={population.actual}
              onChange={(checked) =>
                onChange({ ...population, actual: checked })
              }
              setChangedPopulation={setChangedPopulation}
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
