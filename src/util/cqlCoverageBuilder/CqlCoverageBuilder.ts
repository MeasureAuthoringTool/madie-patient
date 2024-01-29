import * as Handlebars from "handlebars";
import * as _ from "lodash";
import {
  clauseCoveredStyle,
  clauseNotCoveredStyle,
  clauseNotApplicableStyle,
  clauseTemplate,
  definitionTemplate,
} from "./templates/highlightingTemplates";

const main = Handlebars.compile(definitionTemplate);
Handlebars.registerPartial("clause", clauseTemplate);
Handlebars.registerHelper("concat", (s) => s.join(""));
Handlebars.registerHelper("highlightClause", (localId, context) => {
  const libraryName = context.data.root.libraryName;
  const clauseResults = context.data.root.clauseResults;
  const clauseResult = clauseResults.find(
    (result) =>
      result.library_name === libraryName && result.localId === localId
  );
  if (clauseResult) {
    if (clauseResult.final === "TRUE") {
      return objToCSS(clauseCoveredStyle);
    } else if (clauseResult.final === "FALSE") {
      return objToCSS(clauseNotCoveredStyle);
    } else {
      return objToCSS(clauseNotApplicableStyle);
    }
  }
  return "";
});

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
      // if the groupid already lives in updateGroupResults, we just want to append those values
      if (existingGroupIndex > -1) {
        const newClauseResults = Object.values(groupResult.clause_results)
          ?.flatMap(Object.values)
          .concat();

        const newStatementResults = Object.values(
          groupResult.statement_results
        )?.flatMap(Object.values);

        updatedGroupResults[existingGroupIndex].statementResults = [
          ...updatedGroupResults[existingGroupIndex].statementResults,
          ...newStatementResults,
        ];
        
        // clause results are only relevant
        updatedGroupResults[existingGroupIndex].clauseResults = [
          ...updatedGroupResults[existingGroupIndex].clauseResults,
          ...newClauseResults,
        ];
      } else {
        updatedGroupResults.push({
          groupId: groupId,
          clauseResults: Object.values(groupResult.clause_results)?.flatMap(
            Object.values
          ),
          statementResults: Object.values(
            groupResult.statement_results
          )?.flatMap(Object.values),
        });
      }
    }
    // filter the unique clauses
    updatedGroupResults.forEach((groupResult) => {
      const allRelevantClauses = groupResult.clauseResults.filter((c) =>
        groupResult.statementResults.some(
          (s) =>
            s.statement_name === c.statement_name &&
            s.library_name === c.library_name &&
            !s.isFunction
        )
      );
      console.log('allRelevantClauses', allRelevantClauses)

      const allUniqueClauses = _.uniqWith(
        allRelevantClauses,
        (c1, c2) =>
        // @ts-ignore
          c1.library_name === c2.library_name && c1.localId === c2.localId
      );
      console.log('allUniqueClauses', allUniqueClauses)
      groupResult.clause_results = allUniqueClauses;
    });
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
      const coverageHtml = main({
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

/* calcResult = {[patientid]: {
  [populationSetId]: values
}}

*/
// const transformResults

// same thing as buildHighlightingForGroups with some additional changes.
export function buildHighlightingForAllGroups(
  calculationOutput, //calculation result
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
      const coverageHtml = main({
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

// we want to also do the same thing for individual definitions
