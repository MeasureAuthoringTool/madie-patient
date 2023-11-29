import React from "react";
import CoverageTab from "./CoverageTab";

import { MappedCql } from "../../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
interface Props {
  populationCriteria: any;
  mappedCql: MappedCql;
}

const CoverageTabList = ({ populationCriteria, mappedCql }: Props) => {
  return (
    <div data-testid="coverage-tab-list">
      {mappedCql &&
        populationCriteria.length &&
        populationCriteria.map((pop, i) => {
          return (
            <CoverageTab
              key={i}
              population={pop.name}
              populationText={mappedCql[pop.name]}
            />
          );
        })}
      <div tw="flex mt-5" key={"1"}>
        <div tw="flex-none w-1/5"></div>
        <div></div>
      </div>
    </div>
  );
};

export default CoverageTabList;
