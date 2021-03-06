import React from "react";
import tw, { styled } from "twin.macro";
import "styled-components/macro";
import { DisplayPopulationValue, getPopulationCode } from "@madie/madie-models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const TD = tw.td`p-1 text-xs text-gray-600`;
const StyledIcon = styled(FontAwesomeIcon)(
  ({ errors }: { errors: boolean }) => [
    errors ? tw`text-red-700` : tw`text-green-700`,
  ]
);

const StyledInput = tw.input`
  rounded!
  h-4
  w-4
  text-primary-500
  focus:ring-primary-500
  border-gray-200!
  checked:border-primary-500!
  disabled:border-gray-100!
  disabled:bg-gray-100!
`;

const StyledCheckbox = ({
  checked,
  onChange,
  setChangedPopulation,
  ...props
}) => {
  return (
    <StyledInput
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        if (setChangedPopulation) {
          setChangedPopulation(props.name);
        }
        onChange(!!e.target.checked);
      }}
      {...props}
    />
  );
};

export interface TestCasePopulationProps {
  population: DisplayPopulationValue;
  showExpected?: boolean;
  showActual?: boolean;
  disableExpected?: boolean;
  disableActual?: boolean;
  onChange: (population: DisplayPopulationValue) => void;
  setChangedPopulation?: (string: string) => void;
}

const TestCasePopulation = ({
  population,
  disableExpected = false,
  disableActual = false,
  onChange,
  setChangedPopulation,
}: TestCasePopulationProps) => {
  return (
    <React.Fragment key={`fragment-key-${population.name}`}>
      <tr
        tw="border-b"
        key={population.name}
        data-testid={`test-row-population-id-${population.name}`}
      >
        <TD>
          <StyledIcon
            icon={
              population.expected === population.actual
                ? faCheckCircle
                : faTimesCircle
            }
            data-testid={`test-population-icon-${population.name}`}
            errors={population.expected !== population.actual}
          />
        </TD>
        <TD>{getPopulationCode(population.name)}</TD>
        <TD>
          <StyledCheckbox
            id={`${population.name}-expected-cb`}
            name={population.name}
            checked={population.expected}
            onChange={(checked) =>
              onChange({ ...population, expected: checked })
            }
            setChangedPopulation={setChangedPopulation}
            disabled={disableExpected}
            data-testid={`test-population-${population.name}-expected`}
          />
        </TD>
        <TD>
          <StyledCheckbox
            id={`${population.name}-actual-cb`}
            checked={population.actual}
            onChange={(checked) => onChange({ ...population, actual: checked })}
            setChangedPopulation={setChangedPopulation}
            disabled={disableActual}
            data-testid={`test-population-${population.name}-actual`}
          />
        </TD>
      </tr>
    </React.Fragment>
  );
};

export default TestCasePopulation;
