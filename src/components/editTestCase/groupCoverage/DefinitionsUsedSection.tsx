import React from "react";
import parse from "html-react-parser";

const DefinitionsUsedSection = ({
  results,
  cqlDefinitionCallstack,
  groupCoverageResult,
}) => {
  const generateCallstackText = (): string => {
    if (cqlDefinitionCallstack && groupCoverageResult) {
      let text = "";
      cqlDefinitionCallstack[results[0].name]?.forEach((calledDefinition) => {
        // Get Highlighted HTML from execution results
        text += groupCoverageResult.filter(
          (result) => result.name === calledDefinition.name
        )[0].html;
        const test = new Set(getCallstack(calledDefinition.id));
        test.forEach((name) => {
          text += groupCoverageResult.filter(
            (result) => result.name === name
          )[0].html;
        });
      });

      return text;
    }
  };

  const getCallstack = (defId: string): string[] => {
    let calledDefinitions: string[] = [];
    cqlDefinitionCallstack[defId]?.forEach((calledDefinition) => {
      calledDefinitions.push(calledDefinition.name);
      if (cqlDefinitionCallstack[calledDefinition.id]) {
        calledDefinitions = calledDefinitions.concat(
          getCallstack(calledDefinition.id)
        );
      }
    });
    return calledDefinitions;
  };
  return (
    <>
      <div
        style={{
          fontFamily: "Rubik",
          fontSize: "14px",
          fontWeight: "500",
          color: "#0073C8",
        }}
      >
        Definition(s) Used
      </div>
      <div
        style={{
          fontFamily: "Rubik",
          fontSize: "12px",
          fontWeight: "500",
          whiteSpace: "pre-wrap",
        }}
      >
        {parse(generateCallstackText())}
      </div>
    </>
  );
};

export default DefinitionsUsedSection;
