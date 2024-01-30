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
import { isPopulation } from "../../../../../util/GroupCoverageHelpers";
import DefinitionsUsedSection from "../../../../editTestCase/groupCoverage/DefinitionsUsedSection";
import { isNil } from "lodash";
import "twin.macro";
import "styled-components/macro";

const CoverageTab = ({
  definition,
  definitionResults,
  cqlDefinitionCallstack,
  groupCoverageResult,
}: Props) => {
  const getCoverageResult = (coverageResult: StatementCoverageResult) => {
    if (isNil(coverageResult)) {
      return "No results available";
    }

    return [
      parse(`<pre><code>${coverageResult.html}</code></pre>`),
      isPopulation(definition) && cqlDefinitionCallstack && (
        <DefinitionsUsedSection
          result={definitionResults[0]}
          cqlDefinitionCallstack={cqlDefinitionCallstack}
          groupCoverageResult={groupCoverageResult}
        />
      ),
    ];
  };
  return definition !== "Functions" &&
    definition !== "Used" &&
    definition !== "Unused" ? (
    <div
      style={{ maxWidth: "1300px" }}
      data-testid={`${definition}-population`}
    >
      <Accordion title={definition} isOpen={false}>
        <pre data-testId={`${definition}-population-text`}>
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
        {definitionResults ? (
          <div data-testId={`${definition}-definition-text`}>
            {definitionResults.map((results) => getCoverageResult(results))}
          </div>
        ) : (
          "No Results Available"
        )}
      </Accordion>
    </div>
  );
};

export default CoverageTab;
