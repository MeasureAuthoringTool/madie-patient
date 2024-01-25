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
export function buildHighlightingForGroups(
  groupResults,
  cqmMeasure
): GroupCoverageResult {
  if (_.isNil(groupResults) || _.isNil(cqmMeasure)) {
    return {};
  }

  // restructure the group results into an array
  const updatedGroupResults = updateGroupResults(groupResults);
  // get the measure and included libraries
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
