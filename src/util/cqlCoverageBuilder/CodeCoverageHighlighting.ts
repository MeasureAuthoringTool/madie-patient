import * as Handlebars from "handlebars";
import * as _ from "lodash";
import {
  clauseCoveredStylePass,
  clauseNotCoveredStyleFail,
  clauseNotApplicableStyle,
  clauseHighlightedStyle,
  clauseTemplate,
  definitionTemplate,
} from "./templates/highlightingTemplates";
import { objToCSS } from "./CqlCoverageBuilder";

export const passFailCoverage = Handlebars.compile(definitionTemplate);
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
      return objToCSS(clauseCoveredStylePass);
    } else if (clauseResult.final === "FALSE") {
      return objToCSS(clauseNotCoveredStyleFail);
    } else {
      return objToCSS(clauseNotApplicableStyle);
    }
  }
  return "";
});

export const codeCoverageHighlighting = Handlebars.compile(definitionTemplate);
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
      return objToCSS(clauseHighlightedStyle);
    } else if (clauseResult.final === "FALSE") {
      return objToCSS(clauseNotApplicableStyle);
    } else {
      return objToCSS(clauseNotApplicableStyle);
    }
  }
  return "";
});
