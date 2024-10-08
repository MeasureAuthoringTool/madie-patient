import React from "react";
interface Props {
  definition: string;
  definitionResults: any;
  cqlDefinitionCallstack: any;
  groupCoverageResult: any;
}
import { Accordion } from "@madie/madie-design-system/dist/react";
import parse from "html-react-parser";
import { StatementCoverageResult } from "../../../../../util/cqlCoverageBuilder/CqlCoverageBuilder";
import _, { isNil } from "lodash";
import "twin.macro";
import "styled-components/macro";

const CoverageTab = ({ definition, definitionResults }: Props) => {
  const getCoverageResult = (coverageResult: StatementCoverageResult) => {
    if (isNil(coverageResult)) {
      return "No results available";
    }

    return [parse(`<pre><code>${coverageResult.html}</code></pre>`)];
  };
  return definition !== "Functions" &&
    definition !== "Definitions" &&
    definition !== "Unused" ? (
    <div
      style={{ maxWidth: "1300px" }}
      data-testid={`${definition}-population`}
    >
      <Accordion title={definition} isOpen={false}>
        <pre data-testid={`${definition}-population-text`}>
          {definitionResults.map((results) => getCoverageResult(results))}
        </pre>
      </Accordion>
    </div>
  ) : (
    <div
      style={{ maxWidth: "1300px" }}
      data-testid={`${definition}-definition`}
    >
      <Accordion title={definition} isOpen={false}>
        {!_.isEmpty(definitionResults) ? (
          <div data-testid={`${definition}-definition-text`}>
            {definitionResults.map((results) => getCoverageResult(results))}
          </div>
        ) : (
          <pre>No results available</pre>
        )}
      </Accordion>
    </div>
  );
};

export default CoverageTab;
