import React, { useEffect, useState } from "react";
import _ from "lodash";
import CoverageTab from "./CoverageTab";

import { MappedCql } from "../../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
interface Props {
  groupPopulations: any;
  mappedCql: MappedCql;
}

const CoverageTabList = ({ groupPopulations, mappedCql }: Props) => {
  return (
    <div data-testid="coverage-tab-list">
      {mappedCql &&
        groupPopulations.map((pop, i) => {
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
