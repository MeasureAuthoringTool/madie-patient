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
import { MappedCalculationResults } from "../qiCore/calculationResults/CalculationResults";
import { Relevance } from "fqm-execution/build/types/Enums";

interface Props {
  groupPopulations: GroupPopulation[];
  mappedCalculationResults: MappedCalculationResults;
}

interface Statement {
  isFunction: boolean;
  relevance: Relevance;
  statementLevelHTML?: string | undefined;
}

interface PopulationStatement extends Statement {
  populationName: string;
}

type PopulationResult = Record<string, PopulationStatement>;
type SelectedFunction = Record<string, Statement>;

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

const otherCqlStatements = [
  { name: "Definitions" },
  { name: "Functions" },
  { name: "Unused" },
];

const getFirstPopulation = (group) => {
  return {
    abbreviation: "IP",
    criteriaReference: group.populationValues[0].criteriaReference,
    name: group.populationValues[0].name,
    id: group.populationValues[0].id,
  };
};

const GroupCoverage = ({
  groupPopulations,
  mappedCalculationResults,
}: Props) => {
  // selected group/criteria
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  // selected population of a selected group
  const [selectedPopulation, setSelectedPopulation] = useState<Population>(
    getFirstPopulation(groupPopulations[0])
  );
  const [selectedFunctions, setSelectedFunctions] =
    useState<SelectedFunction>();

  // calculation results for selected group/criteria
  const [populationResults, setPopulationResults] = useState<
    PopulationResult | {}
  >();
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

  const getPopulationResults = (groupId: string) => {
    if (mappedCalculationResults) {
      const selectedGroupCalculationResults = mappedCalculationResults[groupId];
      if (selectedGroupCalculationResults) {
        const relevant1Populations =
          selectedGroupCalculationResults.populationRelevance;
        const statement1Results =
          selectedGroupCalculationResults.statementResults;
        const matchingResults = Object.keys(statement1Results)
          .filter((key) => relevant1Populations[key])
          .reduce((output, key) => {
            output[key] = {
              ...statement1Results[key],
              populationName:
                FHIR_POPULATION_CODES[relevant1Populations[key].populationType],
            };
            return output;
          }, {});

        return matchingResults;
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
    setSelectedPopulation(getFirstPopulation(group));
  };

  const changePopulation = (population: Population) => {
    setSelectedPopulation(population);
    setSelectedFunctions(undefined);
    const result =
      populationResults &&
      Object.values(populationResults).find(
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

  const changeDefinitions = (population) => {
    setSelectedPopulation(population);

    if (mappedCalculationResults) {
      const statementResults =
        mappedCalculationResults[selectedCriteria]["statementResults"];
      let filteredFunctions;

      if (population.name === "Functions") {
        filteredFunctions = filterTestObject(
          statementResults,
          (value) => value?.isFunction && value.relevance !== Relevance.NA
        );
      } else if (population.name === "Definitions") {
        filteredFunctions = filterTestObject(
          statementResults,
          (value) => !value?.isFunction && value.relevance === Relevance.TRUE
        );
      } else if (population.name === "Unused") {
        filteredFunctions = filterTestObject(
          statementResults,
          (value) =>
            value?.isFunction === false && value?.relevance !== Relevance.TRUE
        );
      }
      setSelectedFunctions(filteredFunctions);
    }
  };

  const filterTestObject = (obj, filterFn) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => filterFn(value))
    );
  };

  const isPopulation = (name: string) => {
    return name !== "Functions" && name !== "Definitions" && name !== "Unused";
  };

  const onCovergaNavTabClick = (data) => {
    if (isPopulation(data.name)) {
      changePopulation(data);
    } else {
      changeDefinitions(data);
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
            otherCqlStatements={otherCqlStatements}
            selectedPopulation={selectedPopulation}
            onClick={onCovergaNavTabClick}
          />
        </div>

        {!selectedFunctions && (
          <div
            tw="flex-auto p-3"
            id={`${selectedPopulation.abbreviation}-highlighting`}
            data-testid={`${selectedPopulation.abbreviation}-highlighting`}
          >
            {parse(coverageHtml)}
          </div>
        )}

        <div>
          {selectedFunctions &&
            Object.values(selectedFunctions)
              .map((record) => record.statementLevelHTML)
              .filter(Boolean)
              .map((html) => <div tw="flex-auto p-3">{parse(html)}</div>)}
        </div>
      </div>
    </>
  );
};

export default GroupCoverage;
