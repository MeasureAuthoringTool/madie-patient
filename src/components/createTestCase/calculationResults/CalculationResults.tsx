import React from "react";
import parse from "html-react-parser";
import "twin.macro";
import "styled-components/macro";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { Alert } from "@madie/madie-design-system/dist/react";

type ErrorProps = {
  status?: "success" | "warning" | "error";
  message?: string;
};

type CalculationResultType = {
  calculationResults: DetailedPopulationGroupResult[];
  calculationErrors: ErrorProps;
};

const CalculationResults = ({
  calculationResults,
  calculationErrors,
}: CalculationResultType) => {
  // template for group name coming from execution engine
  const originalGroupName = (name) => {
    return `<h2>Population Group: ${name}</h2>`;
  };

  // We wanted to have our own group name. This is the template for group name
  const updatedGroupName = (name) => {
    return `<br/><h4>Population Criteria ${name}</h4>`;
  };

  const coverageHtmls = calculationResults?.map((result, index) =>
    result.html.replace(
      originalGroupName(result.groupId),
      updatedGroupName(index + 1)
    )
  );

  return (
    <div tw="p-5">
      {!calculationResults && !calculationErrors && (
        <Alert
          data-testid="calculation-info-alert"
          description="To see the logic highlights, click 'Run Test'"
        />
      )}
      {calculationErrors && (
        <Alert
          variant={calculationErrors.status}
          data-testid="calculation-error-alert"
          description={calculationErrors.message}
        />
      )}
      {coverageHtmls && (
        <div tw="text-sm" data-testid="calculation-results">
          {coverageHtmls.map((coverageHtml) => parse(coverageHtml))}
        </div>
      )}
    </div>
  );
};

export default CalculationResults;
