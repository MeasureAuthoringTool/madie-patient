import * as _ from "lodash";
import { codeCoverageHighlighting } from "./CodeCoverageHighlighting";
import { passFailCoverage } from "./CodeCoverageHighlightingPassFail";

export interface StatementCoverageResult {
  type: string;
  html: string;
  relevance: string;
  name: string;
  result: string;
}

export interface GroupCoverageResult {
  [string: string]: Array<StatementCoverageResult>;
}

export function objToCSS(obj: { [key: string]: string }): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

function updateGroupResults(groupResults) {
  const updatedGroupResults = [];
  for (const groupId in groupResults) {
    const groupResult = groupResults[groupId];
    updatedGroupResults.push({
      groupId: groupId,
      clauseResults: Object.values(groupResult.clause_results)?.flatMap(
        Object.values
      ),
      statementResults: Object.values(groupResult.statement_results)?.flatMap(
        Object.values
      ),
    });
  }
  return updatedGroupResults;
}

/**
 * Returns the coverage results for each cql definition that is being used in measure groups.
 * Definition is considered to be used iff it is used in one of the populations either directly or indirectly.
 * Builds highlighting for single test case.
 * @param groupResults - calculation results for each measure group.
 * @param cqmMeasure - measure
 */

function updateAllGroupResults(calculationOutput) {
  const updatedGroupResults = [];

  for (let patientId in calculationOutput) {
    const patientResult = calculationOutput[patientId];
    for (const groupId in patientResult) {
      const groupResult = patientResult[groupId];
      const existingGroupIndex = updatedGroupResults.findIndex(
        (group) => group.groupId === groupId
      );
      const newStatementResults = Object.values(
        groupResult?.statement_results
      )?.flatMap(Object.values);

      // we want only a single reference to each groupId. We will concat all the clauseResults associated with each one.
      if (existingGroupIndex > -1) {
        const newClauseResults = Object.values(
          groupResult?.clause_results
        )?.flatMap(Object.values);

        updatedGroupResults[existingGroupIndex].clauseResults = [
          ...updatedGroupResults[existingGroupIndex].clauseResults,
          ...newClauseResults,
        ];
      } else {
        let newClauseResults = [];
        if (groupResult?.clause_results) {
          newClauseResults = Object.values(
            groupResult?.clause_results
          )?.flatMap(Object.values);
        }
        updatedGroupResults.push({
          groupId: groupId,
          clauseResults: newClauseResults,
          statementResults: newStatementResults, // we only need a single copy of statement result
        });
      }
    }
  }
  return updatedGroupResults;
}

export function buildHighlightingForGroups(
  groupResults,
  cqmMeasure
): GroupCoverageResult {
  if (_.isNil(groupResults) || _.isNil(cqmMeasure)) {
    return {};
  }

  // restructure the group results into an array
  const updatedGroupResults = updateGroupResults(groupResults);
  const measureLibraryMap = cqmMeasure.cql_libraries?.reduce(
    (libraryMap, cqlLibrary) => {
      libraryMap[`${cqlLibrary.library_name}`] = cqlLibrary.elm.library;
      return libraryMap;
    },
    {}
  );

  const coverageResults = {} as GroupCoverageResult;
  for (const groupResult of updatedGroupResults) {
    const { groupId, clauseResults, statementResults } = groupResult;
    coverageResults[groupId] = statementResults.reduce((result, statement) => {
      // matching cql library
      const library = measureLibraryMap[statement.library_name];
      if (!library) {
        throw new Error(`Unsupported libray: ${statement.library_name}`);
      }
      // find matching statement from library
      const statementDef = library.statements.def.find(
        (e) => e.name === statement.statement_name
      );
      if (!statementDef) {
        throw new Error(
          `Definition ${statement.name} not found in library ${statement.library_name}`
        );
      }
      // ignore statement without annotations e.g. context Patient
      if (_.isNil(statementDef.annotation)) {
        return result;
      }

      // build the coverage html
      const coverageHtml = passFailCoverage({
        libraryName: statement.library_name,
        statementName: statement.statement_name,
        clauseResults: clauseResults,
        ...statementDef.annotation[0].s,
      });
      result.push({
        type: statementDef.type,
        html: coverageHtml,
        relevance: statement.relevance,
        name: statement.statement_name,
        result: statement.pretty,
      });
      return result;
    }, []);
  }
  return coverageResults;
}

export function buildHighlightingForAllGroups(
  calculationOutput,
  cqmMeasure
): any {
  if (_.isNil(calculationOutput) || _.isNil(cqmMeasure)) {
    return {};
  }

  const measureLibraryMap = cqmMeasure.cql_libraries?.reduce(
    (libraryMap, cqlLibrary) => {
      libraryMap[`${cqlLibrary.library_name}`] = cqlLibrary.elm.library;
      return libraryMap;
    },
    {}
  );
  // restructure the group results into an array
  const allUpdatedGroupResults = updateAllGroupResults(calculationOutput);
  // get the measure and included libraries

  const coverageResults = {} as GroupCoverageResult;
  for (const groupResult of allUpdatedGroupResults) {
    const { groupId, clauseResults, statementResults } = groupResult;
    coverageResults[groupId] = statementResults.reduce((result, statement) => {
      // matching cql library
      const library = measureLibraryMap[statement.library_name];
      if (!library) {
        throw new Error(`Unsupported libray: ${statement.library_name}`);
      }
      // find matching statement from library
      const statementDef = library.statements.def.find(
        (e) => e.name === statement.statement_name
      );
      if (!statementDef) {
        throw new Error(
          `Definition ${statement.name} not found in library ${statement.library_name}`
        );
      }
      // ignore statement without annotations e.g. context Patient
      if (_.isNil(statementDef.annotation)) {
        return result;
      }

      // build the coverage html
      const coverageHtml = codeCoverageHighlighting({
        libraryName: statement.library_name,
        statementName: statement.statement_name,
        clauseResults: clauseResults,
        ...statementDef.annotation[0].s,
      });
      result.push({
        type: statementDef.type,
        html: coverageHtml,
        relevance: statement.relevance,
        name: statement.statement_name,
        result: statement.pretty,
      });
      return result;
    }, []);
  }
  return coverageResults;
}
