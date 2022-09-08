import React from "react";
import parse from "html-react-parser";
import { styled } from "twin.macro";
import "styled-components/macro";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
const Alert = styled.div`rounded-lg p-2 m-2 text-base inline-flex items-center bg-red-100 text-red-700`;

type CalculationResultType = {
  calculationResults: DetailedPopulationGroupResult[];
  calculationErrors: string;
};

const CalculationResults = ({
  calculationResults,
  calculationErrors,
}: CalculationResultType) => {
  return (
    <div tw="p-5">
      {calculationErrors && (
        <Alert
          role="alert"
          aria-label="Calculation Errors"
          data-testid="calculation-error-alert"
        >
          {calculationErrors}
        </Alert>
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
