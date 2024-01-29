import React, { useEffect, useRef, useState } from "react";
import {
  CqlDefinitionExpression,
  mapCoverageCql,
} from "../../../../util/GroupCoverageHelpers";
import "twin.macro";
import "styled-components/macro";
import { isEmpty } from "lodash";
import CoverageTabList from "./CoverageTabs/CoverageTabList";
import useCqlParsingService from "../../../../api/useCqlParsingService";
import { CqlDefinitionCallstack } from "../../../editTestCase/groupCoverage/QiCoreGroupCoverage";
import QdmGroupCoverage from "../../../editTestCase/groupCoverage/QdmGroupCoverage";
import { StatementCoverageResult } from "../../../../util/cqlCoverageBuilder/CqlCoverageBuilder";
import parse from "html-react-parser";

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
      // const allTestCaseGroups = testCases.map((tc) => tc.groupPopulations);
      // we want all groupPopulations on each testCase
      setTestCaseGroups(allTestCaseGroups);
    }
  }, [testCases]);
  console.log("testCaseGroups", testCaseGroups);
  console.log("testcases", testCases);
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
      {/* {!isEmpty(testCaseGroups) && callstackMap && (
        <QdmGroupCoverage
          testCaseGroups={testCaseGroups}
          measureGroups={measureGroups}
          groupCoverageResult={groupCoverageResult}
          cqlDefinitionCallstack={callstackMap}
        />
      )} */}

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
      {/* {showGroupCoverageResults && ( */}
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
      >
        <pre>{/* <code>{results.trim()} </code> */}</pre>
      </div>
      {/* )} */}
    </div>
  );
};

export default TestCaseCoverage;
