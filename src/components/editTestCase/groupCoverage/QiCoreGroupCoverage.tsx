import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import parse from "html-react-parser";
import _, { isEmpty } from "lodash";
import { GroupPopulation, PopulationType } from "@madie/madie-models";
import { Select } from "@madie/madie-design-system/dist/react";
import GroupCoverageNav, {
  Population,
} from "./groupCoverageNav/GroupCoverageNav";
import { MenuItem } from "@mui/material";
import { FHIR_POPULATION_CODES } from "../../../util/PopulationsMap";
import { MappedCalculationResults } from "../qiCore/calculationResults/CalculationResults";
import { Relevance } from "fqm-execution/build/types/Enums";
import GroupCoverageResultsSection from "./GroupCoverageResultsSection";
import {
  getFirstPopulation,
  getPopulationAbbreviation,
} from "../../../util/GroupCoverageHelpers";

interface Props {
  groupPopulations: GroupPopulation[];
  mappedCalculationResults: MappedCalculationResults;
}

interface Statement {
  isFunction: boolean;
  relevance: Relevance;
  statementLevelHTML?: string | undefined;
  pretty?: string;
}

interface PopulationStatement extends Statement {
  populationName: PopulationType;
  id: string;
}

type PopulationResult = Record<string, PopulationStatement>;
type AllDefinitions = Record<string, Statement>;

const populationCriteriaLabel = "Population Criteria";

const allDefinitions = [
  { name: "Definitions" },
  { name: "Functions" },
  { name: "Unused" },
];

const QiCoreGroupCoverage = ({
  groupPopulations,
  mappedCalculationResults,
}: Props) => {
  // selected group/criteria
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  // selected population of a selected group
  const [selectedHighlightingTab, setSelectedHighlightingTab] =
    useState<Population>(getFirstPopulation(groupPopulations[0]));
  const [selectedAllDefinitions, setSelectedAllDefinitions] =
    useState<AllDefinitions>();
  const [
    selectedPopulationDefinitionResults,
    setSelectedPopulationDefinitionResults,
  ] = useState<Statement>();
  // calculation results for selected group/criteria
  const [populationResults, setPopulationResults] = useState<
    PopulationResult | {}
  >();

  useEffect(() => {
    if (!isEmpty(groupPopulations)) {
      changeCriteria(groupPopulations[0].groupId);
    }
  }, [groupPopulations]);

  useEffect(() => {
    changePopulation(selectedHighlightingTab);
  }, [populationResults]);

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

  const getPopulationResults = (groupId: string) => {
    if (mappedCalculationResults) {
      const selectedGroupCalculationResults = mappedCalculationResults[groupId];
      if (selectedGroupCalculationResults) {
        const relevantPopulations =
          selectedGroupCalculationResults.populationRelevance;
        const statementResults =
          selectedGroupCalculationResults.statementResults;
        return Object.keys(statementResults)
          .filter((key) => relevantPopulations[key])
          .reduce((output, key) => {
            output[key] = {
              ...statementResults[key],
              populationName:
                FHIR_POPULATION_CODES[relevantPopulations[key].populationType],
              id: relevantPopulations[key].populationId,
            };
            return output;
          }, {});
      }
    }
    return [];
  };

  const changeCriteria = (criteriaId: string) => {
    setSelectedCriteria(criteriaId);
    const populationResults: PopulationResult | {} =
      getPopulationResults(criteriaId);
    setPopulationResults(populationResults);
    const group = groupPopulations.find((gp) => gp.groupId === criteriaId);
    setSelectedHighlightingTab(getFirstPopulation(group));
  };

  const changePopulation = (population: Population) => {
    setSelectedHighlightingTab(population);
    setSelectedAllDefinitions(undefined);
    const result =
      populationResults &&
      Object.values(populationResults).find(
        (result) => result.id === population.id
      );
    setSelectedPopulationDefinitionResults(result);
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

  const changeDefinitions = (population) => {
    setSelectedHighlightingTab(population);

    if (mappedCalculationResults) {
      const statementResults =
        mappedCalculationResults[selectedCriteria]["statementResults"];
      let filteredDefinitions;

      if (population.name === "Functions") {
        filteredDefinitions = filterDefinitions(
          statementResults,
          (value) => value?.isFunction && value.relevance !== Relevance.NA
        );
      } else if (population.name === "Definitions") {
        filteredDefinitions = filterDefinitions(
          statementResults,
          (value) => !value?.isFunction && value.relevance !== Relevance.NA
        );
      } else if (population.name === "Unused") {
        const unusedDefinitions: any = filterDefinitions(
          statementResults,
          (value) =>
            value?.isFunction === false && value.relevance === Relevance.NA
        );

        filteredDefinitions = Object.keys(unusedDefinitions).reduce(
          (result, statementName) => {
            if (statementName !== "Patient") {
              result[statementName] = {
                ...unusedDefinitions[statementName],
                //currently we don’t have tools for CQl unused definitions
                statementLevelHTML: `<code><span>define &quot;${statementName}&quot;: </span><span>&quot;unavailable&quot;</span></code>`,
              };
            }
            return result;
          },
          {}
        );
      }
      setSelectedAllDefinitions(filteredDefinitions);
    }
  };

  const filterDefinitions = (statementResults, filterFn) => {
    return Object.fromEntries(
      Object.entries(statementResults).filter(([key, value]) => filterFn(value))
    );
  };

  const isPopulation = (name: string) => {
    return name !== "Functions" && name !== "Definitions" && name !== "Unused";
  };

  const onHighlightingNavTabClick = (selectedTab) => {
    if (isPopulation(selectedTab.name)) {
      changePopulation(selectedTab);
    } else {
      changeDefinitions(selectedTab);
    }
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
            allDefinitions={allDefinitions}
            selectedHighlightingTab={selectedHighlightingTab}
            onClick={onHighlightingNavTabClick}
          />
        </div>

        {!selectedAllDefinitions ? (
          <div
          style={{overflowX:"scroll", paddingBottom:"5px"}}
            tw="flex-auto p-3"
            id={`${selectedHighlightingTab.abbreviation}-highlighting`}
            data-testid={`${selectedHighlightingTab.abbreviation}-highlighting`}
          >
            {selectedPopulationDefinitionResults ? (
              <div style={{overflowX:"scroll"}}>
                {parse(selectedPopulationDefinitionResults?.statementLevelHTML)}
                <GroupCoverageResultsSection
                  results={selectedPopulationDefinitionResults.pretty}
                />
              </div>
            ) : (
              "No results available"
            )}
          </div>
        ) : (
          <div>
            {Object.values(selectedAllDefinitions)
              .filter((record) => !!record.statementLevelHTML)
              .map((record, index) => {
                return (
                  <div
                    style={{overflowX:"scroll", paddingBottom:"5px"}}
                    key={index}
                    tw="flex-auto p-3"
                    id={`${selectedHighlightingTab.name}-highlighting`}
                    data-testid={`${_.camelCase(
                      selectedHighlightingTab.name
                    )}-highlighting`}
                  >
                    {parse(record.statementLevelHTML)}
                    {!record.isFunction && (
                      <GroupCoverageResultsSection results={record.pretty} />
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default QiCoreGroupCoverage;
