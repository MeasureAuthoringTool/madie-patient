import React from "react";
import "twin.macro";
import "styled-components/macro";
import parse from "html-react-parser";

function CodeCoverageHighlighting({ coverageHTML }) {
  return (
    <div tw="text-sm p-5" data-testid="code-coverage-highlighting">
      {parse(coverageHTML)}
    </div>
  );
}

export default CodeCoverageHighlighting;
