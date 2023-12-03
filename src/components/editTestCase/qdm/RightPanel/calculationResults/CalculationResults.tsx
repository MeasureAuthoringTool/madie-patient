import React, { useEffect, useRef, useState } from "react";
import QdmGroupCoverage from "../../../groupCoverage/QdmGroupCoverage";
import { isEmpty } from "lodash";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import {
  CqlDefinitionExpression,
  mapCql,
} from "../../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import useCqlParsingService from "../../../../../api/useCqlParsingService";

const CalculationResults = ({
  calculationResults,
  testCaseGroups,
  measureCql,
  measureGroups,
  calculationErrors,
}) => {
  const cqlParsingService = useRef(useCqlParsingService());
  const [allDefinitions, setAllDefinitions] =
    useState<CqlDefinitionExpression[]>();

  useEffect(() => {
    if (measureCql) {
      cqlParsingService.current
        .getAllDefinitionsAndFunctions(measureCql)
        .then((allDefinitionsAndFunctions: CqlDefinitionExpression[]) => {
          setAllDefinitions(allDefinitionsAndFunctions);
        });
    }
  }, [measureCql]);

  return (
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      {!calculationResults && isEmpty(calculationErrors) && (
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
          cqlPopulationDefinitions={mapCql(
            measureCql,
            measureGroups,
            allDefinitions
          )}
          measureGroups={measureGroups}
          calculationResults={calculationResults}
        />
      )}
    </div>
  );
};

export default CalculationResults;
