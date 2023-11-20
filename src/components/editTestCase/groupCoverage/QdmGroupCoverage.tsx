import React, { useEffect, useState } from "react";
import GroupCoverageNav from "./groupCoverageNav/GroupCoverageNav";
import { Select } from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import _, { isEmpty } from "lodash";
import {
  MappedCql,
  Population,
  SelectedPopulationResult,
  getFirstPopulation,
  getPopulationAbbreviation,
} from "../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import parse from "html-react-parser";
import { Group, GroupPopulation } from "@madie/madie-models";

interface Props {
  testCaseGroups: GroupPopulation[];
  cqlPopulationDefinitions: MappedCql;
  measureGroups: Group[];
}

type PopulationResult = Record<string, SelectedPopulationResult>;

const populationCriteriaLabel = "Population Criteria";

const QdmGroupCoverage = ({
  testCaseGroups,
  cqlPopulationDefinitions,
  measureGroups,
}: Props) => {
  const [selectedHighlightingTab, setSelectedHighlightingTab] =
    useState<Population>(getFirstPopulation(testCaseGroups[0]));
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  const [populationResults, setPopulationResults] = useState<
    PopulationResult | {}
  >();
  const [
    selectedPopulationDefinitionResults,
    setSelectedPopulationDefinitionResults,
  ] = useState<SelectedPopulationResult>();

  useEffect(() => {
    if (!isEmpty(testCaseGroups)) {
      changeCriteria(testCaseGroups[0].groupId);
    }
  }, [testCaseGroups]);

  useEffect(() => {
    changePopulation(selectedHighlightingTab);
  }, [populationResults]);

  const getCriteriaLabel = (index) => {
    return testCaseGroups.length > 1
      ? `${populationCriteriaLabel} ${index + 1}`
      : populationCriteriaLabel;
  };

  const populationCriteriaOptions = [
    ...testCaseGroups?.map((gp, index) => {
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
    if (!isEmpty(measureGroups)) {
      setSelectedHighlightingTab(population);
      const selectedGroup = measureGroups?.find(
        (group) => group.id === selectedCriteria
      );
      const selectedPopulationDefinition = selectedGroup?.populations?.find(
        (pop) => pop.id === population.id
      )?.definition;
      const result =
        populationResults &&
        Object.entries(populationResults).find(
          ([key]) => key === _.camelCase(selectedPopulationDefinition)
        );
      setSelectedPopulationDefinitionResults(
        result?.[1].text ? result[1] : undefined
      );
    }
  };

  const onHighlightingNavTabClick = (selectedTab) => {
    changePopulation(selectedTab);
  };

  const getPopulationResults = (groupId: string) => {
    if (cqlPopulationDefinitions) {
      const selectedGroupParsedResults = cqlPopulationDefinitions[groupId];
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
    const group = testCaseGroups.find((gp) => gp.groupId === criteriaId);
    setSelectedHighlightingTab(getFirstPopulation(group));
  };

  const getRelevantPopulations = () => {
    const selectedGroup = testCaseGroups.find(
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
            const index = testCaseGroups.findIndex(
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
            // used for definitions, functions and unused
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
            ? parse(
                `<pre><code>${selectedPopulationDefinitionResults?.text}</code></pre>`
              )
            : "No results available"}
        </div>
      </div>
    </>
  );
};

export default QdmGroupCoverage;
