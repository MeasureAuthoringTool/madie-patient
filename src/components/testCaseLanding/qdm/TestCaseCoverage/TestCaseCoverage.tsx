import React from "react";
// import QdmGroupCoverage from "../../../groupCoverage/QdmGroupCoverage";
import { isEmpty } from "lodash";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import { mapCql, mapCoverageCql } from "../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import CoverageTabList from "./CoverageTabs/CoverageTabList";

const TestCaseCoverage = ({
  calculationResults,
  groupPopulations,
  measureCql,
  measureGroups,
  calculationErrors,
}) => {
  return (
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      <CoverageTabList
        groupPopulations={groupPopulations.populations.filter(
          (pop) => pop.definition
        )}
        mappedCql={mapCoverageCql(measureCql, groupPopulations)}
      />
    </div>
  );
};

export default TestCaseCoverage;
