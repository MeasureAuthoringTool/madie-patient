import React, { useState, useEffect } from "react";
import parse from "html-react-parser";

const DefinitionsUsedSection = ({
  result,
  cqlDefinitionCallstack,
  groupCoverageResult,
}) => {
  const [callStackHtml, setCallStackHtml] = useState<string>(null);

  useEffect(() => {
    let html = "";
    const generateCallstackHtml = (name) => {
      if (cqlDefinitionCallstack && groupCoverageResult) {
        cqlDefinitionCallstack[name]?.forEach((calledDefinition) => {
          // Get Highlighted HTML from execution results
          html += groupCoverageResult.find(
            (result) => result.name === calledDefinition.name
          ).html;
          generateCallstackHtml(calledDefinition.id);
        });
      }
    };

    if (cqlDefinitionCallstack && groupCoverageResult) {
      generateCallstackHtml(result.name);
      setCallStackHtml(html);
    }
  }, [cqlDefinitionCallstack, groupCoverageResult, result]);

  return (
    <>
      {callStackHtml && (
        <>
          <div
            data-testid={"definitions-used-section"}
            style={{
              fontWeight: "500",
              color: "#0073C8",
            }}
          >
            Definition(s) Used
          </div>
          <div>{parse(callStackHtml)}</div>
        </>
      )}
    </>
  );
};

export default DefinitionsUsedSection;
