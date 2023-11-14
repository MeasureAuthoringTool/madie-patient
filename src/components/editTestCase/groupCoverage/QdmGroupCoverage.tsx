import React, { useEffect, useState } from "react";
import GroupCoverageNav from "./groupCoverageNav/GroupCoverageNav";
import { Select } from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import { isEmpty } from "lodash";
import {
  Population,
  getFirstPopulation,
  getPopulationAbbreviation,
} from "../../../util/GroupCoverageHelpers";

const populationCriteriaLabel = "Population Criteria";

const QdmGroupCoverage = ({ groupPopulations, mappedCql }) => {
  const [selectedHighlightingTab, setSelectedHighlightingTab] =
    useState<Population>(getFirstPopulation(groupPopulations[0]));
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  const [populationResults, setPopulationResults] = useState({});
  const [
    selectedPopulationDefinitionResults,
    setSelectedPopulationDefinitionResults,
  ] = useState(null);

  useEffect(() => {
    if (!isEmpty(groupPopulations)) {
      changeCriteria(groupPopulations[0].groupId);
    }
  }, [groupPopulations]);

  useEffect(() => {
    changePopulation(selectedHighlightingTab);
  }, [populationResults]);

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

  const changePopulation = (population: Population) => {
    setSelectedHighlightingTab(population);
    const result =
      populationResults &&
      Object.values(populationResults).find(
        (result: any) => result.name === population.name
      );
    if (result) {
      setSelectedPopulationDefinitionResults(result);
    }
  };

  const onHighlightingNavTabClick = (selectedTab) => {
    changePopulation(selectedTab);
  };

  const getPopulationResults = (groupId: string) => {
    if (mappedCql) {
      const selectedGroupParsedResults = mappedCql[groupId];
      if (selectedGroupParsedResults) {
        const relevantPopulations =
          selectedGroupParsedResults.populationDefinitions;
        return relevantPopulations;
      }
    }
    return [];
  };

  const changeCriteria = (criteriaId: string) => {
    setSelectedCriteria(criteriaId);
    const populationResults = getPopulationResults(criteriaId);
    setPopulationResults(populationResults);
    const group = groupPopulations.find((gp) => gp.groupId === criteriaId);
    setSelectedHighlightingTab(getFirstPopulation(group));
  };

  const getRelevantPopulations = () => {
    const selectedGroup = groupPopulations.find(
      (gp) => gp.groupId === selectedCriteria
    );
    return selectedGroup?.populationValues
      .filter((population) => {
        return !population.name.includes("Observation");
      })
      .map((population, index) => {
        return {
          id: population.id,
          criteriaReference: population.criteriaReference,
          name: population.name,
          abbreviation: getPopulationAbbreviation(
            selectedGroup.populationValues,
            population.name,
            index
          ),
        };
      });
  };

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
            allDefinitions={[]}
            selectedHighlightingTab={selectedHighlightingTab}
            onClick={onHighlightingNavTabClick}
          />
        </div>
        <div
          tw="flex-auto p-3"
          id={`${selectedHighlightingTab.abbreviation}-highlighting`}
          data-testid={`${selectedHighlightingTab.abbreviation}-highlighting`}
        >
          {selectedPopulationDefinitionResults
            ? selectedPopulationDefinitionResults.text
            : "No results available"}
        </div>
      </div>
    </>
  );
};

export default QdmGroupCoverage;
