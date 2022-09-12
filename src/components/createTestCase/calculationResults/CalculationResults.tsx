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
      {calculationResults && (
        <div tw="text-sm" data-testid="calculation-results">
          {calculationResults.map((calculationResult) =>
            parse(calculationResult.html)
          )}
        </div>
      )}
    </div>
  );
};

export default CalculationResults;
