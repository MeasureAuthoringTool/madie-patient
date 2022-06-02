import React from "react";
import tw from "twin.macro";
import "styled-components/macro";
import TestCasePopulation from "./TestCasePopulation";
import { DisplayPopulationValue } from "@madie/madie-models";
const TH = tw.th`p-1 border-b text-right text-xs uppercase border`;

export interface TestCasePopulationListProps {
  populations: DisplayPopulationValue[];
  disableExpected?: boolean;
  disableActual?: boolean;
  onChange?: (
    populations: DisplayPopulationValue[],
    type: "actual" | "expected"
  ) => void;
  setChangedPopulation?: (string: string) => void;
}

const TestCasePopulationList = ({
  populations,
  disableExpected = true,
  disableActual = true,
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

  return (
    <table
      data-testid="test-case-population-list-tbl"
      tw="border border-solid rounded-lg border-collapse"
    >
      <thead tw="bg-gray-100 border rounded">
        <tr tw="border rounded">
          <TH scope="col"></TH>
          <TH scope="col">Population</TH>
          <TH scope="col">Expected</TH>
          <TH scope="col">Actual</TH>
        </tr>
      </thead>
      <tbody tw="border rounded">
        {populations?.map((population) => (
          <TestCasePopulation
            population={population}
            key={population.name}
            disableExpected={disableExpected}
            disableActual={disableActual}
            onChange={handleChange}
            setChangedPopulation={setChangedPopulation}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TestCasePopulationList;
