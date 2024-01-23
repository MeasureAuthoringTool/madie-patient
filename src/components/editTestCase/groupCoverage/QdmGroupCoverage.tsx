import React, { useEffect, useMemo, useState } from "react";
import GroupCoverageNav from "./groupCoverageNav/GroupCoverageNav";
import { Select } from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import { isEmpty, isNil } from "lodash";
import {
  Population,
  getFirstPopulation,
  getPopulationAbbreviation,
  isPopulation,
} from "../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import parse from "html-react-parser";
import { Group, GroupPopulation } from "@madie/madie-models";
import {
  GroupCoverageResult,
  StatementCoverageResult,
} from "../../../util/cqlCoverageBuilder/CqlCoverageBuilder";
import GroupCoverageResultsSection from "./GroupCoverageResultsSection";

interface Props {
  testCaseGroups: GroupPopulation[];
  measureGroups: Group[];
  groupCoverageResult: GroupCoverageResult;
}

const allDefinitions = [
  { name: "Definitions" },
  { name: "Functions" },
  { name: "Unused" },
];

const populationCriteriaLabel = "Population Criteria";

const getCriteriaLabel = (index, numberOfGroups) => {
  return numberOfGroups > 1
    ? `${populationCriteriaLabel} ${index + 1}`
    : populationCriteriaLabel;
};

const definitionFilterCondition = (statementResult, definitionCategory) => {
  if (definitionCategory === "Definitions") {
    return (
      statementResult.type === undefined && statementResult.relevance !== "NA"
    );
  } else if (definitionCategory === "Functions") {
    return statementResult.type === "FunctionDef";
  }
  // for unused defines
  return (
    statementResult.relevance === "NA" && statementResult.type !== "FunctionDef"
  );
};

const QdmGroupCoverage = ({
  testCaseGroups,
  measureGroups,
  groupCoverageResult,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<Population>(
    getFirstPopulation(testCaseGroups[0])
  );
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  const [selectedDefinitionResults, setSelectedDefinitionResults] = useState<
    Array<StatementCoverageResult>
  >([]);

  const changeCriteria = useMemo(
    () => (criteriaId: string) => {
      const group = testCaseGroups.find((gp) => gp.groupId === criteriaId);
      const population = getFirstPopulation(group);
      setSelectedCriteria(criteriaId);
      setSelectedTab(population);
    },
    [testCaseGroups]
  );

  const changePopulation = useMemo(
    () => (population: Population) => {
      if (!isEmpty(measureGroups) && population.id) {
        setSelectedTab(population);
        const selectedGroup = measureGroups?.find(
          (group) => group.id === selectedCriteria
        );
        const selectedPopulation = selectedGroup?.populations?.find(
          (pop) => pop.id === population.id
        );
        const coverage =
          groupCoverageResult &&
          groupCoverageResult[selectedCriteria]?.find(
            (coverageResult) =>
              coverageResult.name === selectedPopulation.definition
          );
        setSelectedDefinitionResults([coverage]);
      }
    },
    [groupCoverageResult, measureGroups, selectedCriteria]
  );

  useEffect(() => {
    if (!isEmpty(testCaseGroups)) {
      changeCriteria(testCaseGroups[0].groupId);
    }
  }, [changeCriteria, testCaseGroups]);

  useEffect(() => {
    changePopulation(selectedTab);
  }, [selectedTab, selectedCriteria, changePopulation]);

  const populationCriteriaOptions = [
    ...testCaseGroups?.map((gp, index) => {
      return (
        <MenuItem
          key={gp.groupId}
          value={gp.groupId}
          data-testid={`option-${gp.groupId}`}
        >
          {getCriteriaLabel(index, testCaseGroups.length)}
        </MenuItem>
      );
    }),
  ];

  const changeDefinitions = (population) => {
    setSelectedTab(population);
    if (groupCoverageResult) {
      let result: StatementCoverageResult[];
      const statementResults = groupCoverageResult[selectedCriteria];
      if (statementResults) {
        result = statementResults.filter((statementResult) =>
          definitionFilterCondition(statementResult, population.name)
        );
      }
      setSelectedDefinitionResults(result);
    }
  };

  const onHighlightingNavTabClick = (selectedTab) => {
    if (isPopulation(selectedTab.name)) {
      changePopulation(selectedTab);
    } else {
      changeDefinitions(selectedTab);
    }
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

  // coverage html and results
  const getCoverageResult = (coverageResult: StatementCoverageResult) => {
    if (isNil(coverageResult)) {
      return "No results available";
    }

    return [
      parse(`<pre><code>${coverageResult.html}</code></pre>`),
      <GroupCoverageResultsSection results={coverageResult.result} />,
    ];
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
            return getCriteriaLabel(index, testCaseGroups.length);
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
            allDefinitions={allDefinitions}
            selectedHighlightingTab={selectedTab}
            onClick={onHighlightingNavTabClick}
          />
        </div>
        <div
          tw="flex-auto pl-3"
          style={{ overflowX: "scroll" }}
          id={"cql-highlighting"}
          data-testid={"cql-highlighting"}
        >
          {selectedDefinitionResults &&
            selectedDefinitionResults.map((definitionResults) =>
              getCoverageResult(definitionResults)
            )}
        </div>
      </div>
    </>
  );
};
export default QdmGroupCoverage;
