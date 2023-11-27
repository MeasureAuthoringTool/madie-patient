import React from "react";
import tw from "twin.macro";
import "styled-components/macro";
import { Measure, TestCase } from "@madie/madie-models";
import TestCaseComponent from "../common/TestCase";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";

interface TestCaseTableProps {
  testCases: TestCase[];
  canEdit: boolean;
  executionResults: {
    [key: string]: DetailedPopulationGroupResult[];
  };
  deleteTestCase: Function;
  exportTestCase: Function;
  measure: Measure;
}

const TestCaseTable = (props: TestCaseTableProps) => {
  const {
    testCases,
    canEdit,
    executionResults,
    deleteTestCase,
    exportTestCase,
    measure,
  } = props;
  const TH = tw.th`p-3 text-left text-sm font-bold capitalize`;

  return (
    <table
      tw="min-w-full"
      data-testid="test-case-tbl"
      className="tcl-table"
      style={{
        borderTop: "solid 1px #8c8c8c",
        borderSpacing: "0 2em !important",
      }}
    >
      <thead tw="bg-slate">
        <tr>
          <TH scope="col">Status</TH>
          <TH scope="col">Group</TH>
          <TH scope="col">Title</TH>
          <TH scope="col">Description</TH>
          <TH scope="col">Action</TH>
        </tr>
      </thead>
      <tbody className="table-body" style={{ padding: 20 }}>
        {testCases?.map((testCase) => {
          return (
            <TestCaseComponent
              testCase={testCase}
              key={testCase.id}
              canEdit={canEdit}
              executionResult={executionResults[testCase.id]}
              deleteTestCase={deleteTestCase}
              exportTestCase={exportTestCase}
              measure={measure}
              // we assume all results have been run here
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default TestCaseTable;
