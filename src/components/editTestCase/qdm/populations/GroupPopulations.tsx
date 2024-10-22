import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import TestCasePopulationList from "./TestCasePopulationList";
import _ from "lodash";
import { useFormikContext } from "formik";
import { addRemoveObservationsForPopulationCriteria } from "../../../../util/PopulationsMap";
import {
  DisplayPopulationValue,
  PopulationType,
  StratificationExpectedValue,
} from "@madie/madie-models";
import { measureStore } from "@madie/madie-util";
import { GroupPopulation } from "@madie/madie-models/dist/TestCase";

interface GroupPopulationsProps {
  disableExpected: boolean;
  testCaseResults: GroupPopulation[];
  isTestCaseExecuted: boolean;
  groupPopulations: GroupPopulation[];
  onChange?: (
    groupPopulations: GroupPopulation[],
    changedGroupId: string,
    changedPopulation: DisplayPopulationValue
  ) => void;
  errors: any;
}

// isTestCaseExecuted determines weather we display one of 3 views.
const GroupPopulations = ({
  disableExpected = false,
  isTestCaseExecuted = false,
  testCaseResults,
  groupPopulations = [],
  onChange,
  errors,
}: GroupPopulationsProps) => {
  const formik: any = useFormikContext();
  const [measure, setMeasure] = useState<any>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <>
      {groupPopulations && groupPopulations.length > 0 ? (
        groupPopulations.map((gp: GroupPopulation, groupIndex: number) => {
          return (
            <div key={gp.groupId} style={{ marginTop: 16 }}>
              <TestCasePopulationList
                content={`Measure Group ${groupIndex + 1}`}
                groupIndex={groupIndex}
                scoring={gp.scoring}
                errors={errors?.[groupIndex]}
                disableExpected={disableExpected}
                isTestCaseExecuted={isTestCaseExecuted}
                populations={gp.populationValues}
                populationResults={
                  testCaseResults
                    ? testCaseResults.find((pop) => pop.groupId === gp.groupId)
                        ?.populationValues
                    : []
                }
                populationBasis={gp?.populationBasis}
                onChange={(
                  updatedPopulationValues: DisplayPopulationValue[],
                  updatedPopulationValue: DisplayPopulationValue
                ) => {
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
                gp.stratificationValues.map(
                  (strat: StratificationExpectedValue, stratIndex: number) => {
                    return (
                      <TestCasePopulationList
                        groupIndex={groupIndex}
                        content={`Measure Group ${
                          groupIndex + 1
                        }: Stratification ${stratIndex + 1}`}
                        scoring={gp.scoring}
                        disableExpected={disableExpected}
                        isTestCaseExecuted={isTestCaseExecuted}
                        populations={strat.populationValues}
                        populationResults={
                          testCaseResults
                            ? testCaseResults.find(
                                (pop) => pop.groupId === gp.groupId
                              )?.stratificationValues[stratIndex]
                                ?.populationValues
                            : []
                        }
                        stratification={strat}
                        stratResult={
                          testCaseResults
                            ? testCaseResults.find(
                                (pop) => pop.groupId === gp.groupId
                              )?.stratificationValues[stratIndex]
                            : []
                        }
                        populationBasis={gp.populationBasis}
                        onStratificationChange={(updatedStratification) => {
                          // onStratificationChange will only update if the stratification expected/actual value changes
                          // Doesn't deal with populationValues of Stratification
                          const clonedGroupPopulations =
                            _.cloneDeep(groupPopulations);
                          const groupPopulation = _.find(
                            clonedGroupPopulations,
                            {
                              groupId: gp.groupId,
                            }
                          );
                          groupPopulation.stratificationValues[stratIndex] = {
                            ...updatedStratification,
                          };
                          formik.setFieldValue(
                            "groupPopulations",
                            clonedGroupPopulations
                          );
                        }}
                        onChange={(
                          updatedPopulationValues: DisplayPopulationValue[],
                          updatedPopulationValue: DisplayPopulationValue
                        ) => {
                          // Updating the populationValues of this particular stratification
                          // Also updates number of observations as needed
                          const clonedGroupPopulations =
                            _.cloneDeep(groupPopulations);
                          const groupPopulation = _.find(
                            clonedGroupPopulations,
                            {
                              groupId: gp.groupId,
                            }
                          );
                          groupPopulation.stratificationValues[
                            stratIndex
                          ].populationValues = [...updatedPopulationValues];
                          const changedPopulationName: PopulationType =
                            updatedPopulationValue.name as PopulationType;
                          groupPopulation.stratificationValues[
                            stratIndex
                          ].populationValues =
                            addRemoveObservationsForPopulationCriteria(
                              updatedPopulationValues,
                              changedPopulationName,
                              gp.groupId,
                              measure?.groups
                            );
                          formik.setFieldValue(
                            "groupPopulations",
                            clonedGroupPopulations
                          );
                        }}
                      />
                    );
                  }
                )}
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
