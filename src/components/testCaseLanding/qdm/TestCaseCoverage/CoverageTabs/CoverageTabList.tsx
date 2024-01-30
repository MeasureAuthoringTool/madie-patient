import React, { useState, useEffect } from "react";
import "twin.macro";
import "styled-components/macro";
import CoverageTab from "./CoverageTab";
import { startCase } from "lodash";
import { getPopulationAbbreviation } from "../../../../../util/GroupCoverageHelpers";
import { CqmExecutionResultsByPatient } from "../../../../../api/QdmCalculationService";
interface Props {
  calculationOutput: CqmExecutionResultsByPatient;
  testCases: any;
  testCaseGroups: any;
  cqlDefinitionCallstack: any;
  groupCoverageResult: any;
  populationCriteria: any;
  measureGroups: any;
}

const allDefinitions = ["Used", "Functions", "Unused"];

const CoverageTabList = ({
  measureGroups,
  groupCoverageResult,
  populationCriteria,
  cqlDefinitionCallstack,
  testCaseGroups,
}: Props) => {
  const [relevantPops, setRelevantPops] = useState([]);
  useEffect(() => {
    if (testCaseGroups && populationCriteria.id) {
      const selectedGroup = testCaseGroups.find(
        (gp) => gp.groupId === populationCriteria.id
      );
      const results = selectedGroup?.populationValues
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
      setRelevantPops(results);
    }
  }, [testCaseGroups, populationCriteria.id, getPopulationAbbreviation]);

  const getStatementResultsInCategory = (statementResults, definition) => {
    if (statementResults) {
      if (definition === "Used") {
        return statementResults.filter((s) => s.relevance !== "NA");
      }
      if (definition === "Unused") {
        return statementResults.filter((s) => s.relevance === "NA");
      }
      if (definition === "Functions") {
        return statementResults.filter((s) => s.type === "FunctionDef");
      }
    }
    return [];
  };

  return (
    <div data-testid="coverage-tab-list">
      {relevantPops &&
        relevantPops.map((pop, i) => {
          const selectedGroup = measureGroups?.find(
            (group) => group.id === populationCriteria.id
          );
          const selectedPopulation = selectedGroup?.populations?.find(
            (s) => s.id === pop.id
          );
          // get all clauses that match with definition (e.i Initial Population)
          const coverage =
            groupCoverageResult &&
            groupCoverageResult[populationCriteria.id]?.find(
              (coverageResult) =>
                coverageResult.name === selectedPopulation?.definition
            );

          return (
            <CoverageTab
              key={i}
              cqlDefinitionCallstack={cqlDefinitionCallstack}
              definition={startCase(pop.name.split(/(?=[A-Z])/).join(" "))}
              groupCoverageResult={groupCoverageResult}
              definitionResults={[coverage]}
            />
          );
        })}

      {/* 
        everything besides initial population.  
        allDefinitions are not cql definitions. 
        const allDefinitions = ["Used", "Functions", "Unused"];
      */}
      {allDefinitions.map((definition, i) => {
        return (
          <CoverageTab
            key={i}
            cqlDefinitionCallstack={cqlDefinitionCallstack}
            definition={definition}
            groupCoverageResult={groupCoverageResult}
            definitionResults={getStatementResultsInCategory(
              groupCoverageResult[populationCriteria.id],
              definition
            )}
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
