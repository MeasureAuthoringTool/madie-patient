import React, { useState } from "react";
import "twin.macro";
import "styled-components/macro";
import TestCasePopulationList from "./TestCasePopulationList";
import * as _ from "lodash";
import { useFormikContext } from "formik";
import { measureStore } from "@madie/madie-util";

const GroupPopulations = ({
  disableExpected = false,
  // Execution run determines weather we display one of 3 views.
  executionRun = false,
  groupPopulations = [],
  onChange,
  errors,
}) => {
  const formik: any = useFormikContext();
  const [measure, setMeasure] = useState<any>(measureStore.state);
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
                onChange={(updatedPopulationValues, updatedPopulationValue) => {
                  debugger;
                  const clonedGroupPopulations = _.cloneDeep(groupPopulations);
                  const groupPopulation = _.find(clonedGroupPopulations, {
                    groupId: gp.groupId,
                  });
                  groupPopulation.populationValues = [
                    ...updatedPopulationValues,
                  ];
                  if (onChange) {
                    onChange(
                      clonedGroupPopulations,
                      groupPopulation.groupId,
                      updatedPopulationValue
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
                      onStratificationChange={(updatedStratification) => {
                        // This will only update if the stratification expected/actual value changes
                        // Doesn't deal with populationValues of Stratification
                        const clonedGroupPopulations =
                          _.cloneDeep(groupPopulations);
                        const groupPopulation = clonedGroupPopulations.find(
                          (clonedGp) => clonedGp.groupId === gp.groupId
                        );
                        groupPopulation.stratificationValues[stratIndex] = {
                          ...updatedStratification,
                        };
                        formik.setFieldValue(
                          "groupPopulations",
                          clonedGroupPopulations
                        );
                      }}
                      // onChange={(populations, updatedPopulationValue) => {
                      //   const clonedGroupPopulations =
                      //     _.cloneDeep(groupPopulations);
                      //   const groupPopulation = clonedGroupPopulations.find(
                      //     (clonedGp) => clonedGp.groupId === gp.groupId
                      //   );
                      //   const changedPopulationName: PopulationType =
                      //     updatedPopulationValue.name as PopulationType;
                      //   addRemoveObservationsForPopulationCritieria(
                      //     groupPopulation.stratificationValues,
                      //     changedPopulationName,
                      //     gp.groupId,
                      //     measure?.groups
                      //   );
                      //   const updatedStrat =
                      //     groupPopulation.stratificationValues[stratIndex];
                      //   updatedStrat.populationValues = [...populations];
                      //   if (onChange) {
                      //     onChange(
                      //       clonedGroupPopulations,
                      //       groupPopulation.groupId,
                      //       updatedPopulationValue
                      //     );
                      //   }
                      // }}
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
