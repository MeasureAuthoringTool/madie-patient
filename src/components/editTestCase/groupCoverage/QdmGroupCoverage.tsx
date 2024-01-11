import React, { useEffect, useState } from "react";
import GroupCoverageNav from "./groupCoverageNav/GroupCoverageNav";
import { Select } from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import _, { isEmpty } from "lodash";
import {
  getFirstPopulation,
  getPopulationAbbreviation,
  isPopulation,
  MappedCql,
  Population,
  QDMCqlDefinition,
} from "../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import parse from "html-react-parser";
import { Group, GroupPopulation } from "@madie/madie-models";

interface Props {
  testCaseGroups: GroupPopulation[];
  cqlPopulationDefinitions: MappedCql;
  measureGroups: Group[];
  calculationResults;
}

type PopulationDefinition = Record<string, string>;

const allDefinitions = [
  { name: "Definitions" },
  { name: "Functions" },
  { name: "Unused" },
];

const populationCriteriaLabel = "Population Criteria";

const QdmGroupCoverage = ({
  testCaseGroups,
  cqlPopulationDefinitions,
  measureGroups,
  calculationResults,
}: Props) => {
  const [selectedHighlightingTab, setSelectedHighlightingTab] =
    useState<Population>(getFirstPopulation(testCaseGroups[0]));
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  const [populationDefinition, setPopulationDefinition] = useState<
    PopulationDefinition | {}
  >();
  const [
    selectedPopulationDefinitionText,
    setSelectedPopulationDefinitionText,
  ] = useState<string>();
  const [
    selectedPopulationCalculationResult,
    setSelectedPopulationCalculationResult,
  ] = useState<string>();
  const [selectedAllDefinitions, setSelectedAllDefinitions] =
    useState<QDMCqlDefinition>();

  useEffect(() => {
    if (!isEmpty(testCaseGroups)) {
      changeCriteria(testCaseGroups[0].groupId);
    }
  }, [testCaseGroups]);

  useEffect(() => {
    changePopulation(selectedHighlightingTab);
  }, [populationDefinition]);

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
      );
      const popDef =
        populationDefinition &&
        Object.entries(populationDefinition).find(
          ([key]) => key === _.camelCase(selectedPopulationDefinition?.name)
        );
      setSelectedPopulationDefinitionText(
        popDef?.[1] ? popDef[1] : undefined
      );
    }
  };

  const getDefinitionCategoryFilteringCondition = (
    statementResults,
    definitionName,
    definitionCategory
  ) => {
    if (definitionCategory === "Definitions") {
      return statementResults[definitionName]?.relevance !== "NA";
    }
    if (definitionCategory === "Unused") {
      return statementResults[definitionName]?.relevance === "NA";
    }
  };

  const filterBasedOnDefinitionCategories = (
    statementResults,
    definitionCategory
  ) => {
    return Object.keys(statementResults)
      .filter((definitionName) =>
        getDefinitionCategoryFilteringCondition(
          statementResults,
          definitionName,
          definitionCategory
        )
      )
      .reduce((result, definitionName) => {
        result[definitionName] = statementResults[definitionName];
        return result;
      }, {});
  };

  const filterDefinitions = (
    cqlPopulationDefinitions,
    calculationResults,
    definitionCategory
  ): QDMPopulationDefinition => {
    const statementResults =
      calculationResults[Object.keys(calculationResults)[0]][selectedCriteria];

    if (Object.keys(popCriteriaResults?.statement_results)) {
      const filteredDefinitions = 
        Object.keys(
          popCriteriaResults?.statement_results
        )
        .map((cqlLibrary) =>
            filterBasedOnDefinitionCategories(
              popCriteriaResults?.statement_results[cqlLibrary],
              definitionCategory
            )
        )
        .reduce((result, statementResult) => {
          Object.assign(result, statementResult);
          return result;
        }, {});

      let defs: QDMCqlDefinition = Object.keys(
        cqlPopulationDefinitions[selectedCriteria]?.definitions
      )
        .filter((definitionName) => filteredDefinitions[definitionName])
        .reduce<QDMCqlDefinition>((result, definitionName) => {
          result[definitionName] =
            cqlPopulationDefinitions[selectedCriteria]?.definitions[
              definitionName
            ];
          return result;
        }, {} as QDMCqlDefinition);
        return defs;
    }
  };

  const changeDefinitions = (population) => {
    setSelectedHighlightingTab(population);
    let resultDefinitions: QDMCqlDefinition;

    if (cqlPopulationDefinitions && calculationResults) {
      if (population.name === "Functions") {
        if (cqlPopulationDefinitions[selectedCriteria]?.functions) {
          resultDefinitions =
            cqlPopulationDefinitions[selectedCriteria].functions;
        }
      }
      if (population.name === "Definitions") {
        resultDefinitions = filterDefinitions(
          cqlPopulationDefinitions,
          calculationResults,
          population.name
        );
      }
      if (population.name === "Unused") {
        resultDefinitions = filterDefinitions(
          cqlPopulationDefinitions,
          calculationResults,
          population.name
        );
      }
      setSelectedAllDefinitions(resultDefinitions);
    }
  };

  const onHighlightingNavTabClick = (selectedTab) => {
    if (isPopulation(selectedTab.name)) {
      setSelectedAllDefinitions(null);
      changePopulation(selectedTab);
    } else {
      setSelectedPopulationDefinitionText(null);
      changeDefinitions(selectedTab);
    }
  };

  const getPopulationDefinitions = (groupId: string) => {
    if (cqlPopulationDefinitions) {
      const selectedGroup = cqlPopulationDefinitions[groupId];
      if (selectedGroup) {
        return selectedGroup.populationDefinitions;
      }
    }
    return [];
  };

  const changeCriteria = (criteriaId: string) => {
    setSelectedCriteria(criteriaId);
    setSelectedAllDefinitions(null);
    const populationDefinitions = getPopulationDefinitions(criteriaId);
    setPopulationDefinition(populationDefinitions);
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
      <div
        tw="flex mt-5"
        key={selectedCriteria}
        style={{ paddingBottom: "7px" }}
      >
        <div tw="flex-none w-1/5">
          <GroupCoverageNav
            id={selectedCriteria}
            populations={getRelevantPopulations()}
            // used for definitions, functions and unused
            allDefinitions={allDefinitions}
            selectedHighlightingTab={selectedHighlightingTab}
            onClick={onHighlightingNavTabClick}
          />
        </div>

        {!selectedAllDefinitions ? (
          <div
            tw="flex-auto p-3"
            style={{ overflowX: "scroll" }}
            id={`${selectedHighlightingTab.abbreviation}-highlighting`}
            data-testid={`${selectedHighlightingTab.abbreviation}-highlighting`}
          >
            {selectedPopulationDefinitionResults
                  `<pre><code>${selectedPopulationDefinitionResults}</code></pre>`
            {selectedPopulationDefinitionText
                    `<pre><code>${selectedPopulationDefinitionText}</code></pre>`
              : "No results available"}
          </div>
        ) : (
          <div>
            {calculationResults &&
            Object.keys(selectedAllDefinitions).length > 0 ? (
              Object.keys(selectedAllDefinitions)
                .sort()
                .filter(
                  (definition: any) =>
                    selectedAllDefinitions[definition].definitionLogic
                )
                .map((definition: any, index) => {
                  return (
                    <div
                      key={index}
                      tw="flex-auto p-3"
                      id={`${selectedHighlightingTab.name}-highlighting`}
                      data-testid={`${_.camelCase(
                        selectedHighlightingTab.name
                      )}-highlighting`}
                      style={{ borderBottomWidth: "4px" }}
                    >
                      {parse(
                        `<pre><code>${selectedAllDefinitions[definition]?.definitionLogic}</code></pre>`
                      )}
                    </div>
                  );
                })
            ) : (
              <div tw="flex-auto p-3">No results available</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default QdmGroupCoverage;
