import React from "react";
import parse from "html-react-parser";
import "twin.macro";
import "styled-components/macro";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import { GroupPopulation } from "@madie/madie-models";
import { useFeatureFlags } from "@madie/madie-util";
import GroupCoverage from "../../editTestCase/groupCoverage/GroupCoverage";

type ErrorProps = {
  status?: "success" | "warning" | "error" | "info" | "meta";
  message?: string;
};

type CalculationResultType = {
  calculationResults: DetailedPopulationGroupResult[];
  calculationErrors: ErrorProps;
  groupPopulations: GroupPopulation[];
};

const CalculationResults = ({
  calculationResults,
  calculationErrors,
  groupPopulations,
}: CalculationResultType) => {
  // template for group name coming from execution engine
  const originalGroupName = (name) => {
    return `<h2>Population Group: ${name}</h2>`;
  };
  const featureFlags = useFeatureFlags();
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
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      {!calculationResults && !calculationErrors && (
        <MadieAlert
          type="info"
          content="To see the logic highlights, click 'Run Test'"
          canClose={false}
          alertProps={{
            "data-testid": "calculation-info-alert",
          }}
        />
      )}
      {calculationErrors && (
        <MadieAlert
          type={calculationErrors.status}
          content={calculationErrors.message}
          canClose={false}
          alertProps={{
            "data-testid": "calculation-error-alert",
          }}
        />
      )}
      {featureFlags.highlightingTabs && groupPopulations && (
        <GroupCoverage
          groupPopulations={groupPopulations}
          calculationResults={calculationResults}
        />
      )}
      {!featureFlags.highlightingTabs && coverageHtmls && (
        <div tw="text-sm" data-testid="calculation-results">
          {coverageHtmls.map((coverageHtml) => parse(coverageHtml))}
        </div>
      )}
    </div>
  );
};

export default CalculationResults;
