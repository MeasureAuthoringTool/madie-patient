import React from "react";

 function CodeCoverageHighlighting({
  testCaseHTML
 }:
 {testCaseHTML:string}
 ) {
  return <div data-testid="code-coverage-highlighting">Work in Progress{console.log(testCaseHTML)}</div>;
}

export default CodeCoverageHighlighting;