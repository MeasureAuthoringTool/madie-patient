import React from "react";
import CoverageTab from "./CoverageTab";

import {
  CoverageMappedCql,
  MappedCql,
} from "../../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
interface Props {
  populationCriteria: any;
  mappedCql: CoverageMappedCql;
  calculationOutput: any;
}

const CoverageTabList = ({
  populationCriteria,
  mappedCql,
  calculationOutput,
}: Props) => {
  const allDefinitions = ["Used", "Functions", "Unused"];

  const test = (definitionType) => {
    if (
      mappedCql &&
      mappedCql.functions &&
      mappedCql.definitions &&
      calculationOutput
    ) {
      if (definitionType === "Functions") {
        return mappedCql.functions;
      }
      if (definitionType === "Unused") {
        const uniqueUsedDefinitionNames = [
          ...new Set(
            Object.values(calculationOutput).flatMap((record) =>
              Object.values(record).flatMap((subRecord) =>
                Object.values(subRecord.statement_results).flatMap(
                  (innerRecord) =>
                    Object.keys(innerRecord).filter(
                      (key) => innerRecord[key].relevance === "NA"
                    )
                )
              )
            )
          ),
        ];

        const result = uniqueUsedDefinitionNames.reduce((acc, key) => {
          if (mappedCql.definitions[key]) {
            acc[key] = mappedCql.definitions[key];
          }
          return acc;
        }, {});

        return result;
      }
      if (definitionType === "Used") {
        const uniqueUsedDefinitionNames = [
          ...new Set(
            Object.values(calculationOutput).flatMap((record) =>
              Object.values(record).flatMap((subRecord) =>
                Object.values(subRecord.statement_results).flatMap(
                  (innerRecord) =>
                    Object.keys(innerRecord).filter(
                      (key) => innerRecord[key].relevance !== "NA"
                    )
                )
              )
            )
          ),
        ];

        const result = uniqueUsedDefinitionNames.reduce((acc, key) => {
          if (mappedCql.definitions[key]) {
            acc[key] = mappedCql.definitions[key];
          }
          return acc;
        }, {});

        return result;
      }
    }
    return null;
  };

  return (
    <div data-testid="coverage-tab-list">
      {mappedCql &&
        populationCriteria.length &&
        populationCriteria.map((pop, i) => {
          return (
            <CoverageTab
              key={i}
              population={pop.name}
              populationText={mappedCql.populationDefinitions[pop.name]}
            />
          );
        })}

      {allDefinitions.map((pop, i) => {
        return (
          <CoverageTab key={i} population={pop} populationText={test(pop)} />
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
