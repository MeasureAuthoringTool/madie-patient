import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import { PopulationType } from "@madie/madie-models";

export interface Population {
  abbreviation: string;
  id: string;
  criteriaReference?: string;
  name: PopulationType;
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
      value={selectedPopulation.id}
      data-testid={`group-coverage-nav-${id}`}
    >
      {populations &&
        populations.map((population) => (
          <Tab
            type="C"
            label={population.abbreviation}
            key={population.abbreviation}
            value={population.id}
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