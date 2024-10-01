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

export function mergeCalcResults(calcResults1, calcResults2) {
  if (_.isNil(calcResults2)) {
    return calcResults1;
  }
  if (_.isNil(calcResults1)) {
    return calcResults2;
  }

  // TODO: Improve performance here
  return calcResults1.map((cr1) => {
    const cr2 = calcResults2.find(
      (tcr) =>
        tcr.library_name === cr1.library_name && tcr.localId === cr1.localId
    );
    if (cr1.final === "TRUE") {
      return cr1;
    } else if (cr2?.final === "TRUE") {
      return cr2;
    } else if (cr1.final === "FALSE") {
      return cr1;
    } else if (cr2?.final === "FALSE") {
      return cr2;
    } else {
      return cr1;
    }
  });
}

/**
 * Returns the coverage results for each cql definition that is being used in measure groups.
 * Definition is considered to be used iff it is used in one of the populations either directly or indirectly.
 * Builds highlighting for single test case.
 * @param groupResults - calculation results for each measure group.
 * @param cqmMeasure - measure
 */

export function updateAllGroupResults(calculationOutput) {
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
        let newClauseResults = [];
        if (groupResult?.clause_results) {
          newClauseResults = Object.values(
            groupResult?.clause_results
          )?.flatMap(Object.values);
        }

        updatedGroupResults[existingGroupIndex].clauseResults =
          mergeCalcResults(
            [...updatedGroupResults[existingGroupIndex].clauseResults],
            [...newClauseResults]
          );
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
  for (const populationSet of cqmMeasure.population_sets) {
    const { groupId, clauseResults, statementResults } =
      updatedGroupResults?.find(
        (updatedGroupResult) => updatedGroupResult.groupId === populationSet.id
      );

    // collect stratification definitions if population group has stratification
    const stratification = populationSet.stratifications?.reduce(
      (stratification, currentStrata) => {
        stratification[currentStrata.statement.statement_name] =
          currentStrata.stratification_id;
        return stratification;
      },
      {}
    );

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
      let clauseResultCopy = clauseResults;
      // cqm-execution converts stratification into separate group(stratified group)
      // e.g. if measure has one group with one stratification,
      // then results returned by cqm-execution would contain 2 groups. "Group 1" & "Group 1 stratification 1".
      // Following "if" block combines the stratification definition results from
      // its stratified group i.e. "Group 1 stratification 1" into measure group i.e. "Group 1"
      if (stratification && stratification[statement.statement_name]) {
        const { statementResults, clauseResults } = updatedGroupResults?.find(
          (updatedGroupResult) =>
            updatedGroupResult.groupId ===
            stratification[statement.statement_name]
        );
        statement = statementResults?.find(
          (result) =>
            result.statement_name === statement.statement_name &&
            result.library_name === statement.library_name
        );
        clauseResultCopy = clauseResults;
      }

      // build the coverage html
      const coverageHtml = passFailCoverage({
        libraryName: statement.library_name,
        statementName: statement.statement_name,
        clauseResults: clauseResultCopy,
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
