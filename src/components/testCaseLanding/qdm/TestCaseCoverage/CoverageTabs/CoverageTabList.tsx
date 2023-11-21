import React, { useEffect, useState } from "react";
import _, { isEmpty } from "lodash";
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
    <>
      <div tw="border-b pb-2">{}</div>

      {mappedCql &&
        groupPopulations.map((pop) => {
          return (
            <CoverageTab
              population={pop.name}
              populationText={mappedCql[pop.name]}
            />
          );
        })}
      <div tw="flex mt-5" key={"1"}>
        <div tw="flex-none w-1/5"></div>
        <div></div>
      </div>
    </>
  );
};

export default CoverageTabList;
