import React from "react";
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
      groupPopulations.map((gp) => (
        <div tw="my-2" key={gp.group}>
          <span tw="text-base">{gp.group} Population Values</span>
          <TestCasePopulationList
            disableExpected={disableExpected}
            disableActual={disableActual}
            populations={gp.populationValues}
            onChange={(populations) => {
              const nextPopulations = _.cloneDeep(groupPopulations);
              const groupPopulation = nextPopulations.find(
                (np) => np.group === gp.group
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
      <span tw="text-sm">No populations for current scoring</span>
    )}
  </>
);

export default GroupPopulations;
