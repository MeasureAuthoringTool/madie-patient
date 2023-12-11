import React, { useEffect, useRef, useState } from "react";
import {
  CqlDefinitionExpression,
  mapCoverageCql,
} from "../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import CoverageTabList from "./CoverageTabs/CoverageTabList";
import useCqlParsingService from "../../../../api/useCqlParsingService";

const TestCaseCoverage = ({
  populationCriteria,
  measureCql,
  calculationOutput,
}) => {
  const cqlParsingService = useRef(useCqlParsingService());
  const [allDefinitions, setAllDefinitions] =
    useState<CqlDefinitionExpression[]>();

  useEffect(() => {
    if (measureCql) {
      cqlParsingService.current
        .getAllDefinitionsAndFunctions(measureCql)
        .then((allDefinitionsAndFunctions: CqlDefinitionExpression[]) => {
          console.log(allDefinitionsAndFunctions);
          setAllDefinitions(allDefinitionsAndFunctions);
        });
    }
  }, [measureCql]);

  return (
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      <CoverageTabList
        data-testid="coverage-tab-list"
        populationCriteria={
          populationCriteria?.populations.filter((pop) => pop.definition) || {}
        }
        mappedCql={mapCoverageCql(
          measureCql,
          populationCriteria,
          allDefinitions
        )}
        calculationOutput={calculationOutput}
      />
    </div>
  );
};

export default TestCaseCoverage;
