import React from "react";
import tw from "twin.macro";
import { Checkbox } from "@madie/madie-components";

const TD = tw.td`p-1 text-xs text-gray-600`;

const TestCasePopulation = (props) => {
  const expected = props.population.expected;
  const actual = props.population.actual;

  return (
    <tr
      tw="border-b"
      key={props.population.id}
      data-testid={`test-row-population-id-${props.population.id}`}
    >
      <TD>
        <Checkbox
          id={props.population.id}
          label=""
          checked={true}
          color="green"
          data-testid={`test-population-checkbox-${props.population.id}`}
        />
      </TD>
      <TD>{props.population.title}</TD>
      <TD>{expected && <Checkbox id={props.population.id} label="" />}</TD>
      <TD>
        {actual && <Checkbox id={props.population.id} label="" color="grey" />}
      </TD>
    </tr>
  );
};

export default TestCasePopulation;
