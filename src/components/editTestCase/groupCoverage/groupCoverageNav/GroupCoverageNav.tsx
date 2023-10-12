import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import { PopulationType } from "@madie/madie-models";

export interface Population {
  abbreviation: string;
  id: string;
  criteriaReference?: string;
  name: PopulationType;
}

export interface AllDefinitionsTabs {
  name: string;
}

interface Props {
  id: string;
  populations: Array<Population>;
  allDefinitions: Array<AllDefinitionsTabs>;
  selectedHighlightingTab: Population;
  onClick: Function;
}

const GroupCoverageNav = ({
  id,
  populations,
  allDefinitions,
  selectedHighlightingTab,
  onClick,
}: Props) => {
  return (
    <>
      <Tabs
        type="C"
        size="standard"
        orientation="vertical"
        value={selectedHighlightingTab.id}
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
      <Tabs
        type="C"
        size="standard"
        orientation="vertical"
        value={selectedHighlightingTab.name}
        data-testid={`group-coverage-nav-${name}`}
      >
        {allDefinitions &&
          allDefinitions.map((population) => (
            <Tab
              type="C"
              label={population.name}
              key={population.name}
              value={population.name}
              orientation="vertical"
              onClick={() => {
                onClick(population);
              }}
            />
          ))}
      </Tabs>
    </>
  );
};

export default GroupCoverageNav;
