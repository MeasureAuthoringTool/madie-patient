import React from "react";
import QdmGroupCoverage from "../../../groupCoverage/QdmGroupCoverage";
import { isEmpty } from "lodash";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import "twin.macro";
import "styled-components/macro";

const CalculationResults = ({
  groupCoverageResult,
  testCaseGroups,
  measureGroups,
  calculationErrors,
}) => {
  return (
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      {!groupCoverageResult && isEmpty(calculationErrors) && (
        <MadieAlert
          type="info"
          content="To see the logic highlights, click 'Run Test'"
          canClose={false}
          alertProps={{
            "data-testid": "calculation-info-alert",
          }}
        />
      )}
      {!isEmpty(testCaseGroups) && (
        <QdmGroupCoverage
          testCaseGroups={testCaseGroups}
          measureGroups={measureGroups}
          groupCoverageResult={groupCoverageResult}
        />
      )}
    </div>
  );
};

export default CalculationResults;
