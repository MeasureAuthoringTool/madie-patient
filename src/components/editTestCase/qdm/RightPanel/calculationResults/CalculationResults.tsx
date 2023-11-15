import React from "react";
import QdmGroupCoverage from "../../../groupCoverage/QdmGroupCoverage";
import { isEmpty } from "lodash";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import { mapCql } from "../../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";

const CalculationResults = ({
  calculationResults,
  groupPopulations,
  measureCql,
  errors,
}) => {
  return (
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      {!calculationResults && !errors && (
        <MadieAlert
          type="info"
          content="To see the logic highlights, click 'Run Test'"
          canClose={false}
          alertProps={{
            "data-testid": "calculation-info-alert",
          }}
        />
      )}
      {!isEmpty(groupPopulations) && (
        <QdmGroupCoverage
          groupPopulations={groupPopulations}
          mappedCql={mapCql(measureCql, groupPopulations)}
        />
      )}
    </div>
  );
};

export default CalculationResults;
