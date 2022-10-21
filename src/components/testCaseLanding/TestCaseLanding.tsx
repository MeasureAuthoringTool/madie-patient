import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCaseList from "../testCaseList/TestCaseList";
import { useDocumentTitle } from "@madie/madie-util";

const TestCaseLanding = () => {
  useDocumentTitle("MADiE Edit Measure Test Cases");
  return (
    <div tw="m-2">
      <section>
        <TestCaseList />
      </section>
    </div>
  );
};

export default TestCaseLanding;
