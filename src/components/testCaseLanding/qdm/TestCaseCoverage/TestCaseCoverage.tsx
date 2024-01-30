import React, { useEffect, useRef, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import CoverageTabList from "./CoverageTabs/CoverageTabList";
import useCqlParsingService from "../../../../api/useCqlParsingService";
import { CqlDefinitionCallstack } from "../../../editTestCase/groupCoverage/QiCoreGroupCoverage";

const TestCaseCoverage = ({
  populationCriteria,
  measureCql,
  groupCoverageResult,
  calculationOutput,
  measureGroups,
  testCases,
}) => {
  const cqlParsingService = useRef(useCqlParsingService());
  const [callstackMap, setCallstackMap] = useState<CqlDefinitionCallstack>();
  const [testCaseGroups, setTestCaseGroups] = useState([]); //tc.map((tc) => tc.groupPopulations)

  useEffect(() => {
    if (testCases) {
      let allTestCaseGroups = [];
      testCases.forEach((testCase) => {
        testCase.groupPopulations.forEach((pop) => {
          if (!allTestCaseGroups.find((group) => group.groupId === pop.groupId))
            allTestCaseGroups.push(pop);
        });
      });
      setTestCaseGroups(allTestCaseGroups);
    }
  }, [testCases]);
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
      <CoverageTabList
        data-testid="coverage-tab-list"
        testCases={testCases}
        testCaseGroups={testCaseGroups}
        measureGroups={measureGroups}
        cqlDefinitionCallstack={callstackMap}
        groupCoverageResult={groupCoverageResult}
        populationCriteria={populationCriteria}
        calculationOutput={calculationOutput}
      />
      <div
        style={{
          padding: "0px 10px",
          marginTop: "20px",
          width: "auto",
          border: "1px solid #EDEDED",
          backgroundColor: "#EDEDED",
          fontFamily: "sans-serif",
          borderRadius: "1px",
          color: "black",
        }}
        data-testId="results-section"
        id="results"
      ></div>
    </div>
  );
};

export default TestCaseCoverage;
