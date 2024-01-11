import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCasePopulationList from "./TestCasePopulationList";
import * as _ from "lodash";
import { useFormikContext } from "formik";

// export interface PopulationsProps {
// disableExpected?: boolean;
// we dont need disable actual as it's always disabled.
// executionRun?: boolean;
// groupPopulations: DisplayGroupPopulation[];
// onChange?: (
//   groupPopulations: GroupPopulation[],
//   changedGroupId: string,
//   changedPopulation: DisplayPopulationValue
// ) => void;
// onStratificationChange?: (
//   groupPopulations: GroupPopulation[],
//   changedGroupId: string,
//   changedStratification: DisplayStratificationValue
// ) => void;

// errors?: any[];
// }

const GroupPopulations = ({
  disableExpected = false,
  // Execution run determines weather we display one of 3 views.
  executionRun = false,
  groupPopulations = [],
  onChange,
  errors,
}) => {
  const formik: any = useFormikContext();
  return (
    <>
      {groupPopulations && groupPopulations.length > 0 ? (
        groupPopulations.map((gp, i) => {
          return (
            <div key={gp.groupId} style={{ marginTop: 16 }}>
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
              {gp?.stratificationValues?.length > 0 &&
                gp.stratificationValues.map((strat, stratIndex) => {
                  return (
                    <TestCasePopulationList
                      strat
                      i={i}
                      content={`Measure Group ${i + 1}: Stratification ${
                        stratIndex + 1
                      }`}
                      scoring={gp.scoring}
                      disableExpected={disableExpected}
                      executionRun={executionRun}
                      populations={strat.populationValues}
                      stratifications={[strat]}
                      populationBasis={gp.populationBasis}
                      // Could expect only changedStrat
                      onStratificationChange={(
                        changedStrat,
                        type // unused
                      ) => {
                        // given a strat and gp, we find the strat and update it completely.
                        const nextPopulations = _.cloneDeep(groupPopulations);
                        const groupPopulation = nextPopulations.find(
                          (np) => np.groupId === gp.groupId
                        );
                        // slice strat values
                        const newStratificationValues = [
                          ...groupPopulation.stratificationValues,
                        ];
                        // find index
                        const targetStratIndex =
                          newStratificationValues.findIndex(
                            (strat) => strat.id === changedStrat.id
                          );
                        // update el
                        newStratificationValues[targetStratIndex] =
                          changedStrat;

                        if (groupPopulation) {
                          groupPopulation.stratificationValues =
                            newStratificationValues;
                        }

                        formik.setFieldValue(
                          "groupPopulations",
                          nextPopulations
                        );
                        // onChange(nextPopulations, groupPopulation.groupId, )
                      }}
                      onChange={(populations, type, changedPopulation) => {
                        // refactor
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
                  );
                })}
            </div>
          );
        })
      ) : (
        <span tw="text-sm">
          No data for current scoring. Please make sure at least one measure
          group has been created.
        </span>
      )}
    </>
  );
};

export default GroupPopulations;
