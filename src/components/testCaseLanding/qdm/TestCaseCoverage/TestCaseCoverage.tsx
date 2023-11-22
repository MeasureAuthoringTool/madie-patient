import React from "react";
import { mapCoverageCql } from "../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import CoverageTabList from "./CoverageTabs/CoverageTabList";

const TestCaseCoverage = ({ groupPopulations, measureCql }) => {
  return (
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      <CoverageTabList
        data-testid="coverage-tab-list"
        groupPopulations={groupPopulations.populations.filter(
          (pop) => pop.definition
        )}
        mappedCql={mapCoverageCql(measureCql, groupPopulations)}
      />
    </div>
  );
};

export default TestCaseCoverage;
