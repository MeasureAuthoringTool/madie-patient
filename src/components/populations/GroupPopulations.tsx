import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCasePopulationList from "./TestCasePopulationList";
import { GroupPopulation } from "../../models/TestCase";
import * as _ from "lodash";

export interface PopulationsProps {
  disableExpected?: boolean;
  disableActual?: boolean;
  groupPopulations: GroupPopulation[];
  onChange?: (groupPopulations: GroupPopulation[]) => void;
}

const GroupPopulations = ({
  disableExpected = false,
  disableActual = false,
  groupPopulations = [],
  onChange,
}: PopulationsProps) => (
  <>
    {groupPopulations && groupPopulations.length > 0 ? (
      groupPopulations.map((gp, i) => (
        <div tw="my-2" key={gp.groupId}>
          <span tw="text-base">
            Group {`${i + 1} (${gp.scoring})`} Population Values
          </span>
          <TestCasePopulationList
            disableExpected={disableExpected}
            disableActual={disableActual}
            populations={gp.populationValues}
            onChange={(populations) => {
              const nextPopulations = _.cloneDeep(groupPopulations);
              const groupPopulation = nextPopulations.find(
                (np) => np.groupId === gp.groupId
              );
              if (groupPopulation) {
                groupPopulation.populationValues = populations;
              }
              onChange(nextPopulations);
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
