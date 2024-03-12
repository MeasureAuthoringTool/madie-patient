import React, { useEffect, useRef, useState } from "react";
import QdmGroupCoverage from "../../../groupCoverage/QdmGroupCoverage";
import { isEmpty } from "lodash";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import "twin.macro";
import "styled-components/macro";
import { CqlDefinitionCallstack } from "../../../groupCoverage/QiCoreGroupCoverage";
import useCqlParsingService from "../../../../../api/useCqlParsingService";

const CalculationResults = ({
  groupCoverageResult,
  testCaseGroups,
  measureGroups,
  calculationErrors,
  measureCql,
  includeSDE,
}) => {
  const cqlParsingService = useRef(useCqlParsingService());
  const [callstackMap, setCallstackMap] = useState<CqlDefinitionCallstack>();

  useEffect(() => {
    cqlParsingService.current
      .getDefinitionCallstacks(measureCql)
      .then((callstack: CqlDefinitionCallstack) => {
        setCallstackMap(callstack);
        return callstack;
      })
      .catch((error) => {
        console.error(error);
      });
  }, [measureCql]);

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
          cqlDefinitionCallstack={callstackMap}
          includeSDE={includeSDE}
        />
      )}
    </div>
  );
};

export default CalculationResults;
