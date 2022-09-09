import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCasePopulationList from "./TestCasePopulationList";
import { DisplayGroupPopulation, GroupPopulation } from "@madie/madie-models";
import * as _ from "lodash";
import { DisplayPopulationValue } from "@madie/madie-models/dist/TestCase";

export interface PopulationsProps {
  disableExpected?: boolean;
  // we dont need disable actual as it's always disabled.
  executionRun?: boolean;
  groupPopulations: DisplayGroupPopulation[];
  onChange?: (
    groupPopulations: GroupPopulation[],
    changedGroupId: string,
    changedPopulation: DisplayPopulationValue
  ) => void;
}

const GroupPopulations = ({
  disableExpected = false,
  // Execution run determines weather we display one of 3 views.
  executionRun = false,
  groupPopulations = [],
  onChange,
}: PopulationsProps) => (
  <>
    {groupPopulations && groupPopulations.length > 0 ? (
      groupPopulations.map((gp, i) => (
        <div key={gp.groupId} style={{ marginTop: 16 }}>
          <TestCasePopulationList
            i={i}
            scoring={gp.scoring}
            disableExpected={disableExpected}
            executionRun={executionRun}
            populations={gp.populationValues}
            onChange={(populations, type, changedPopulation) => {
              const nextPopulations = _.cloneDeep(groupPopulations);
              const groupPopulation = nextPopulations.find(
                (np) => np.groupId === gp.groupId
              );
              if (groupPopulation) {
                groupPopulation.populationValues = populations;
              }
              if (onChange) {
                onChange(
                  nextPopulations,
                  groupPopulation.groupId,
                  changedPopulation
                );
              }
            }}
          />
        </div>
      ))
    ) : (
      <span tw="text-sm">
        No populations for current scoring. Please make sure at least one
        measure group has been created.
      </span>
    )}
  </>
);

export default GroupPopulations;
