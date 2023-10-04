import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import parse from "html-react-parser";
import { isEmpty } from "lodash";
import { GroupPopulation } from "@madie/madie-models";
import { Select } from "@madie/madie-design-system/dist/react";
import GroupCoverageNav, {
  Population,
} from "./groupCoverageNav/GroupCoverageNav";
import {
  DetailedPopulationGroupResult,
  StatementResult,
} from "fqm-execution/build/types/Calculator";
import { MenuItem } from "@mui/material";
import { FHIR_POPULATION_CODES } from "../../../util/PopulationsMap";

interface PopulationResult extends StatementResult {
  populationName: string;
}

interface Props {
  groupPopulations: GroupPopulation[];
  calculationResults: DetailedPopulationGroupResult[];
}
const populationCriteriaLabel = "Population Criteria";
const abbreviatedPopulations = {
  initialPopulation: "IP",
  denominator: "DENOM",
  denominatorExclusion: "DENEX",
  numerator: "NUMER",
  numeratorExclusion: "NUMEX",
  denominatorException: "DENEXCEP",
  measurePopulation: "MSRPOPL",
};

const getFirstPopulation = (group) => {
  return {
    abbreviation: "IP",
    criteriaReference: group.populationValues[0].criteriaReference,
    name: group.populationValues[0].name,
    id: group.populationValues[0].id,
  };
};

const GroupCoverage = ({ groupPopulations, calculationResults }: Props) => {
  // selected group/criteria
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  // selected population of a selected group
  const [selectedPopulation, setSelectedPopulation] = useState<Population>(
    getFirstPopulation(groupPopulations[0])
  );

  // calculation results for selected group/criteria
  const [populationResults, setPopulationResults] =
    useState<Array<PopulationResult>>();
  // coverage html for selected population of a selected group/criteria
  const [coverageHtml, setCoverageHtml] = useState<string>("");

  useEffect(() => {
    if (!isEmpty(groupPopulations)) {
      changeCriteria(groupPopulations[0].groupId);
    }
  }, [groupPopulations]);

  useEffect(() => {
    changePopulation(selectedPopulation);
  }, [populationResults]);

  const getRelevantPopulations = () => {
    const selectedGroup = groupPopulations.find(
      (gp) => gp.groupId === selectedCriteria
    );
    return selectedGroup?.populationValues
      .filter((population) => {
        return !population.name.includes("Observation");
      })
      .map((population) => {
        return {
          id: population.id,
          criteriaReference: population.criteriaReference,
          name: population.name,
          abbreviation: abbreviatedPopulations[population.name],
        };
      });
  };

  const getPopulationResults = (groupId: string): Array<PopulationResult> => {
    const groupCalculations = calculationResults?.find(
      (result) => result.groupId === groupId
    );
    if (groupCalculations) {
      const relevantPopulations = groupCalculations.populationRelevance;
      const statementResults = groupCalculations.statementResults;
      return relevantPopulations.map((population) => {
        const populationResult = statementResults.find(
          (statementResult) =>
            statementResult.statementName === population.criteriaExpression
        );
        return {
          ...populationResult,
          populationName: FHIR_POPULATION_CODES[population.populationType],
        };
      });
    }
    return [];
  };

  const changeCriteria = (criteriaId: string) => {
    setSelectedCriteria(criteriaId);
    const populationResults = getPopulationResults(criteriaId);
    setPopulationResults(populationResults);
    const group = groupPopulations.find((gp) => gp.groupId === criteriaId);
    setSelectedPopulation(getFirstPopulation(group));
  };

  const changePopulation = (population: Population) => {
    setSelectedPopulation(population);
    const result = populationResults?.find(
      // TODO: Handle 2 IP scenario
      (result) => result.populationName === population.name
    );
    setCoverageHtml(
      result ? result.statementLevelHTML : "No results available"
    );
  };

  const getCriteriaLabel = (index) => {
    return groupPopulations.length > 1
      ? `${populationCriteriaLabel} ${index + 1}`
      : populationCriteriaLabel;
  };

  const populationCriteriaOptions = [
    ...groupPopulations?.map((gp, index) => {
      return (
        <MenuItem
          key={gp.groupId}
          value={gp.groupId}
          data-testid={`option-${gp.groupId}`}
        >
          {getCriteriaLabel(index)}
        </MenuItem>
      );
    }),
  ];
  return (
    <>
      <div tw="border-b pb-2">
        <Select
          id={"population-criterion-selector"}
          tw="w-1/4"
          sx={{
            height: "32px",
            borderColor: "transparent",
            "& .Mui-focused": {
              borderColor: "transparent",
            },
            "& .Mui-icon": {
              fontSize: "3px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
              "& legend": {
                width: 0,
              },
            },
            "& .MuiInputBase-input": {
              fontFamily: "Rubik",
              fontSize: 16,
              fontWeight: 400,
              color: "#515151",
              borderColor: "transparent",
              borderRadius: "3px",
              padding: "9px 14px",
              "&::placeholder": {
                opacity: 0.6,
              },
            },
            "& .MuiSelect-icon": {
              color: "#515151",
              fontSize: "large",
            },
          }}
          inputProps={{
            "data-testid": "population-criterion-input",
          }}
          data-testid={"population-criterion-selector"}
          SelectDisplayProps={{
            "aria-required": "true",
          }}
          options={populationCriteriaOptions}
          defaultOptions={selectedCriteria}
          value={selectedCriteria}
          renderValue={(value) => {
            const index = groupPopulations.findIndex(
              (gp) => gp.groupId === value
            );
            return getCriteriaLabel(index);
          }}
          onChange={(e) => changeCriteria(e.target.value)}
        />
      </div>
      <div tw="flex mt-5" key={selectedCriteria}>
        <div tw="flex-none w-1/5">
          <GroupCoverageNav
            id={selectedCriteria}
            populations={getRelevantPopulations()}
            selectedPopulation={selectedPopulation}
            onClick={changePopulation}
          />
        </div>
        <div
          tw="flex-auto p-3"
          id={`${selectedPopulation.abbreviation}-highlighting`}
          data-testid={`${selectedPopulation.abbreviation}-highlighting`}
        >
          {parse(coverageHtml)}
        </div>
      </div>
    </>
  );
};

export default GroupCoverage;
