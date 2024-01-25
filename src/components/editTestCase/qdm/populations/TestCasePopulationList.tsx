import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import "styled-components/macro";
import _ from "lodash";
import TestCasePopulation from "./TestCasePopulation";
import TestCaseStratification from "../stratifications/TestCaseStratification";
import {
  DisplayPopulationValue,
  DisplayStratificationValue,
  StratificationExpectedValue,
  PopulationType,
} from "@madie/madie-models";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  determineGroupResult,
  determineGroupResultStratification,
} from "./TestCasePopulationListUtil";

export interface TestCasePopulationListProps {
  content: string;
  groupIndex?: number;
  scoring: string;
  populations: DisplayPopulationValue[];
  stratification?: StratificationExpectedValue;
  populationBasis: string;
  disableExpected?: boolean;
  isTestCaseExecuted?: boolean;
  onChange?: (
    populations: DisplayPopulationValue[],
    changedPopulation: DisplayPopulationValue
  ) => void;
  onStratificationChange?: (stratification: DisplayStratificationValue) => void;
  errors?: any;
}
const StyledIcon = styled(FontAwesomeIcon)(
  ({ errors }: { errors: boolean }) => [
    errors ? tw`text-red-700 mr-1.5` : tw`text-green-700 mr-1.5`,
  ]
);

// Test case population table. We need to know if the execution has been
const TestCasePopulationList = ({
  content,
  scoring,
  populations,
  stratification,
  populationBasis,
  disableExpected = true,
  isTestCaseExecuted = false,
  onChange,
  onStratificationChange,
  errors,
  groupIndex,
}: TestCasePopulationListProps) => {
  let measureObservations = [];
  let numeratorObservations = [];
  let denominatorObservations = [];
  let initialPopulations = [];
  let contentId = content?.toLocaleLowerCase().replace(/(\W)+/g, "-");

  const getPopulationCount = (
    populations: DisplayPopulationValue[],
    type: PopulationType
  ): number => {
    return populations.filter((res) => res.name === type).length;
  };
  const getObservationCount = (
    observationCount: number,
    observation: PopulationType,
    observations: Array<PopulationType>
  ) => {
    if (observationCount > 1) {
      observations.push(observation);
      return observations.length;
    } else {
      return 0;
    }
  };

  const measureObservationsCount = (population: DisplayPopulationValue) => {
    let count = 0;
    if (population.name === PopulationType.MEASURE_POPULATION_OBSERVATION) {
      count = getPopulationCount(populations, population.name);
      return getObservationCount(count, population.name, measureObservations);
    } else if (population.name === PopulationType.DENOMINATOR_OBSERVATION) {
      count = getPopulationCount(populations, population.name);
      return getObservationCount(
        count,
        population.name,
        denominatorObservations
      );
    } else if (population.name === PopulationType.NUMERATOR_OBSERVATION) {
      count = getPopulationCount(populations, population.name);
      return getObservationCount(count, population.name, numeratorObservations);
    } else {
      return 0;
    }
  };

  // Update the appropriate populationValue inside the array of populationValues
  const handlePopulationValueChange = (
    updatedPopulationValue: DisplayPopulationValue
  ) => {
    // if our population is part of a strat, we will be updating populationValue of a start instead.
    if (stratification) {
      const updatedStratification = { ...stratification };
      const populationValue = _.find(updatedStratification.populationValues, {
        id: updatedPopulationValue.id,
      });
      populationValue.expected = updatedPopulationValue.expected;
      populationValue.actual = updatedPopulationValue.actual;
      onChange(updatedStratification?.populationValues, updatedPopulationValue);
    } else {
      const clonedPopulationValues = _.cloneDeep(populations);
      const populationValue = _.find(clonedPopulationValues, {
        id: updatedPopulationValue.id,
      });
      if (populationValue) {
        populationValue.expected = updatedPopulationValue.expected;
        populationValue.actual = updatedPopulationValue.actual;
      }
      if (onChange) {
        onChange(clonedPopulationValues, updatedPopulationValue);
      }
    }
  };

  const getIppCount = (population: DisplayPopulationValue) => {
    if (scoring === "Ratio") {
      const initialPopulationsCount = populations.filter(
        (pop) => pop.name === "initialPopulation"
      ).length;
      if (initialPopulationsCount > 1) {
        if (population.name === "initialPopulation") {
          initialPopulations.push(population.name);
          return initialPopulations.length;
        }
      }
    }
    return 0;
  };

  // Determines the result of each PopulationCriteria
  // If stratification fails, then we skip verifying populations as the PC is failed
  // if stratification pass, then we determine its populations result
  // If the PC is not stratified, then we determine the PC results only based on its populations.
  const [view, setView] = useState<string>();
  useEffect(() => {
    let localView = "pass";
    if (stratification) {
      localView = determineGroupResultStratification(
        populationBasis,
        stratification,
        isTestCaseExecuted
      );
    }
    if (populations?.length > 0 && localView === "pass") {
      setView(
        determineGroupResult(populationBasis, populations, isTestCaseExecuted)
      );
    } else {
      setView(localView);
    }
  }, [isTestCaseExecuted, populationBasis, populations, stratification]);

  /*
    we have three separate views
    - not run
    - run and all pass
    - run and not all pass
  */
  const captionClass = classNames("caption", {
    pass: view === "pass",
    fail: view === "fail",
  });

  const getPatientBasisLabel = (): string => {
    return populationBasis === "true" ? "Patient Basis" : "Episode of Care";
  };

  return (
    <div>
      <table
        data-testid="test-case-population-list-tbl"
        className="population-table"
      >
        <caption>
          {isTestCaseExecuted && (
            <StyledIcon
              icon={view === "pass" ? faCheckCircle : faTimesCircle}
              data-testid={`test-population-icon-${scoring}`}
              errors={view === "fail"}
            />
          )}
          <span data-testid={contentId} className={captionClass}>
            {content}
          </span>
          <span
            className="sub-caption"
            data-testid={`${contentId}-scoring-unit-${groupIndex + 1}`}
          >{` - ${scoring} | ${getPatientBasisLabel()}`}</span>
        </caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Population</th>
            <th scope="col">Expected</th>
            <th scope="col">Actual</th>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {stratification && (
            <TestCaseStratification
              index={groupIndex}
              QDM={true}
              strataCode={stratification?.name}
              stratification={stratification}
              populationBasis={populationBasis}
              key={stratification?.id}
              disableExpected={disableExpected}
              onStratificationChange={(updatedStratification) =>
                onStratificationChange(updatedStratification)
              }
            />
          )}
          {populations?.map((population, j) => (
            <TestCasePopulation
              i={j}
              strat={!_.isEmpty(stratification)}
              population={population}
              populationBasis={populationBasis}
              key={population.id}
              disableExpected={disableExpected}
              onChange={handlePopulationValueChange}
              measureObservationsCount={
                scoring === "Ratio" || scoring === "Continuous Variable"
                  ? measureObservationsCount(population)
                  : 0
              }
              initialPopulationCount={getIppCount(population)}
              error={errors?.populationValues?.[j]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCasePopulationList;
