import React from "react";
import "twin.macro";
import "styled-components/macro";
import parse from "html-react-parser";
import { Alert } from "@madie/madie-design-system/dist/react";

function CodeCoverageHighlighting({ coverageHTML }) {
  return (
    <div tw="text-sm p-5" data-testid="code-coverage-highlighting">
      {coverageHTML && parse(coverageHTML)}
    </div>
  );
}

export default CodeCoverageHighlighting;
