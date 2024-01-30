import * as Handlebars from "handlebars";
import {
  clauseNotApplicableStyle,
  clauseHighlightedStyle,
  highlightTemplate,
  definitionTemplate,
} from "./templates/coverageHighlightingTemplate";
import { objToCSS } from "./CqlCoverageBuilder";

Handlebars.registerPartial("highlightClause", highlightTemplate);
Handlebars.registerHelper("add", (s) => s.join(""));
Handlebars.registerHelper("colorClause", (localId, context) => {
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

export const codeCoverageHighlighting = Handlebars.compile(definitionTemplate);
