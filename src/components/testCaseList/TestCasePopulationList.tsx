import React from "react";
import tw from "twin.macro";
import TestCasePopulation from "./TestCasePopulation";
const TH = tw.th`p-1 border-b text-right text-xs uppercase`;

const testCasePopulations = [
  {
    id: "k1",
    title: "IPP",
    expected: true,
    actual: true,
  },
  {
    id: "k2",
    title: "DENOM",
    expected: true,
    actual: true,
  },
  {
    id: "k3",
    title: "DENEX",
    expected: true,
    actual: true,
  },
  {
    id: "k4",
    title: "NUMBER",
    expected: true,
    actual: true,
  },
];

const TestCasePopulationList = () => {
  return (
    <table data-testid="test-case-population-list-tbl">
      <thead>
        <tr>
          <TH scope="col"></TH>
          <TH scope="col">Population</TH>
          <TH scope="col">Expected</TH>
          <TH scope="col">Actual</TH>
        </tr>
      </thead>
      <tbody>
        {testCasePopulations?.map((population) => (
          <TestCasePopulation population={population} key={population.id} />
        ))}
      </tbody>
    </table>
  );
};

export default TestCasePopulationList;
