import React from "react";
import "twin.macro";
import "styled-components/macro";
import CoverageTab from "./CoverageTab";
import {
  CoverageMappedCql,
  getPopulationAbbreviation,
} from "../../../../../util/GroupCoverageHelpers";
import { CqmExecutionResultsByPatient } from "../../../../../api/QdmCalculationService";
interface Props {
  populationCriteria: any;
  mappedCql: CoverageMappedCql;
  calculationOutput: CqmExecutionResultsByPatient;
}

const allDefinitions = ["Used", "Functions", "Unused"];

const CoverageTabList = ({
  populationCriteria,
  mappedCql,
  calculationOutput,
}: Props) => {
  const getDefintionCategoryFilteringCondition = (
    definitionType,
    statementResult,
    definitionName
  ) => {
    if (definitionType === "Used") {
      return statementResult[definitionName].relevance !== "NA";
    }
    if (definitionType === "Unused") {
      return statementResult[definitionName].relevance === "NA";
    }
  };

  const filterBasedOnDefinitionCategories = (definitionType) => {
    const definitionNames = [
      ...new Set(
        Object.values(calculationOutput).flatMap((testCases) =>
          Object.values(testCases).flatMap((testCaseCalculationResult) =>
            Object.values(testCaseCalculationResult.statement_results).flatMap(
              (statementResult) =>
                Object.keys(statementResult).filter((definitionName) =>
                  getDefintionCategoryFilteringCondition(
                    definitionType,
                    statementResult,
                    definitionName
                  )
                )
            )
          )
        )
      ),
    ];

    return definitionNames.reduce((acc, definitionName) => {
      if (mappedCql.definitions[definitionName]) {
        acc[definitionName] = mappedCql.definitions[definitionName];
      }
      return acc;
    }, {});
  };

  const getDefinitionResults = (definitionType) => {
    if (
      mappedCql &&
      mappedCql.functions &&
      mappedCql.definitions &&
      calculationOutput
    ) {
      if (definitionType === "Functions") {
        return mappedCql.functions;
      }
      if (definitionType === "Unused") {
        return filterBasedOnDefinitionCategories(definitionType);
      }
      if (definitionType === "Used") {
        return filterBasedOnDefinitionCategories(definitionType);
      }
    }
    return null;
  };

  return (
    <div data-testid="coverage-tab-list">
      {mappedCql &&
        populationCriteria.length &&
        populationCriteria.map((pop, i) => {
          return (
            <CoverageTab
              key={i}
              population={getPopulationAbbreviation(
                populationCriteria,
                pop.name,
                i
              )}
              populationText={mappedCql.populationDefinitions[pop.name]}
            />
          );
        })}

      {allDefinitions.map((definition, i) => {
        return (
          <CoverageTab
            key={i}
            population={definition}
            populationText={getDefinitionResults(definition)}
          />
        );
      })}
      <div tw="flex mt-5" key={"1"}>
        <div tw="flex-none w-1/5"></div>
        <div></div>
      </div>
    </div>
  );
};

export default CoverageTabList;
