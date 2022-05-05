import React from "react";
import tw from "twin.macro";
import "styled-components/macro";
import TestCasePopulation from "./TestCasePopulation";
import { PopulationValue } from "../../models/TestCase";
const TH = tw.th`p-1 border-b text-right text-xs uppercase border`;

export interface TestCasePopulationListProps {
  populations: PopulationValue[];
  disableExpected?: boolean;
  disableActual?: boolean;
  onChange?: (populations: PopulationValue[]) => void;
  setChangedPopulation?: (string: string) => void;
}

const TestCasePopulationList = ({
  populations,
  disableExpected = true,
  disableActual = true,
  onChange,
  setChangedPopulation,
}: TestCasePopulationListProps) => {
  const handleChange = (population: PopulationValue) => {
    const newPopulations = [...populations];
    const newPop = newPopulations.find((pop) => pop.name === population.name);
    newPop.actual = population.actual;
    newPop.expected = population.expected;
    if (onChange) {
      onChange(newPopulations);
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
