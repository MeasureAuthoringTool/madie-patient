import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCaseList, { TestCaseListProps } from "../testCaseList/TestCaseList";
import { useDocumentTitle } from "@madie/madie-util";

const TestCaseLanding = (props: TestCaseListProps) => {
  useDocumentTitle("MADiE Edit Measure Test Cases");
  return (
    <div>
      <section>
        <TestCaseList setError={props.setError} />
      </section>
    </div>
  );
};

export default TestCaseLanding;
