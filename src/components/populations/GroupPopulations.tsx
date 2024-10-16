import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCasePopulationList from "./TestCasePopulationList";
import {
  DisplayGroupPopulation,
  GroupPopulation,
  DisplayPopulationValue,
  DisplayStratificationValue,
} from "@madie/madie-models";
import * as _ from "lodash";

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
  onStratificationChange?: (
    groupPopulations: GroupPopulation[],
    changedGroupId: string,
    changedStratification: DisplayStratificationValue
  ) => void;
  groupsStratificationAssociationMap?: any;
  errors?: any[];
}

const GroupPopulations = ({
  disableExpected = false,
  groupsStratificationAssociationMap,
  // Execution run determines weather we display one of 3 views.
  executionRun = false,
  groupPopulations = [],
  onChange,
  onStratificationChange,
  errors,
}: PopulationsProps) => (
  <>
    {groupPopulations && groupPopulations.length > 0 ? (
      groupPopulations.map((gp, i) => {
        return (
          <div key={gp.groupId}>
            <TestCasePopulationList
              content={`Measure Group ${i + 1}`}
              i={i}
              scoring={gp.scoring}
              errors={errors?.[i]}
              disableExpected={disableExpected}
              executionRun={executionRun}
              populations={gp.populationValues}
              populationBasis={gp?.populationBasis}
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
            {/* strat */}
            {gp?.stratificationValues?.length > 0 && (
              <TestCasePopulationList
                i={i}
                content={`Measure Group ${i + 1}: Stratifications`}
                stratifications={gp.stratificationValues}
                groupsStratificationAssociationMap={
                  groupsStratificationAssociationMap
                }
                scoring={gp.scoring}
                disableExpected={disableExpected}
                executionRun={executionRun}
                populations={null}
                populationBasis={gp.populationBasis}
                onStratificationChange={(
                  stratifications,
                  type,
                  changedStratification
                ) => {
                  const nextPopulations = _.cloneDeep(groupPopulations);
                  const groupPopulation = nextPopulations.find(
                    (np) => np.groupId === gp.groupId
                  );
                  if (groupPopulation) {
                    groupPopulation.stratificationValues = stratifications;
                  }
                  if (onStratificationChange) {
                    onStratificationChange(
                      nextPopulations,
                      groupPopulation.groupId,
                      changedStratification
                    );
                  }
                }}
              />
            )}
          </div>
        );
      })
    ) : (
      <span tw="text-sm">
        No data for current scoring. Please make sure at least one measure group
        has been created.
      </span>
    )}
  </>
);

export default GroupPopulations;
