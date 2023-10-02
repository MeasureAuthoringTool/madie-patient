import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";

export interface Population {
  name: string;
  abbreviation: string;
}

interface Props {
  id: string;
  populations: Array<Population>;
  selectedPopulation: Population;
  onClick: Function;
}

const GroupCoverageNav = ({
  id,
  populations,
  selectedPopulation,
  onClick,
}: Props) => {
  return (
    <Tabs
      type="C"
      size="standard"
      orientation="vertical"
      value={`${selectedPopulation.abbreviation}_${id}`}
      data-testid={`group-coverage-nav-${id}`}
    >
      {populations &&
        populations.map((population) => (
          <Tab
            type="C"
            label={population.abbreviation}
            key={`${population.abbreviation}_${id}`}
            value={`${population.abbreviation}_${id}`}
            orientation="vertical"
            onClick={() => {
              onClick(population);
            }}
          />
        ))}
    </Tabs>
  );
};

export default GroupCoverageNav;
