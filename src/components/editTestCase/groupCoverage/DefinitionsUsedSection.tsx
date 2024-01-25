import React, { useState, useEffect } from "react";
import parse from "html-react-parser";

const DefinitionsUsedSection = ({
  result,
  cqlDefinitionCallstack,
  groupCoverageResult,
}) => {
  const [callStackText, setCallStackText] = useState<string>(null);

  useEffect(() => {
    let text = "";
    const generateCallstackText = (name) => {
      if (cqlDefinitionCallstack && groupCoverageResult) {
        cqlDefinitionCallstack[name]?.forEach((calledDefinition) => {
          // Get Highlighted HTML from execution results
          text += groupCoverageResult.find(
            (result) => result.name === calledDefinition.name
          ).html;
          generateCallstackText(calledDefinition.id);
        });
      }
    };

    if (cqlDefinitionCallstack && groupCoverageResult) {
      generateCallstackText(result.name);
      setCallStackText(text);
    }
  }, [cqlDefinitionCallstack, groupCoverageResult, result]);

  return (
    <>
      {callStackText && (
        <>
          <div
            data-testid={"definitions-used-section"}
            style={{
              fontFamily: "Rubik",
              fontSize: "14px",
              fontWeight: "500",
              color: "#0073C8",
            }}
          >
            Definition(s) Used
          </div>
          <div>{parse(callStackText)}</div>
        </>
      )}
    </>
  );
};

export default DefinitionsUsedSection;
