import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCaseList from "./TestCaseList";
import { TestCaseListProps } from "../common/interfaces";
import { useDocumentTitle } from "@madie/madie-util";

const TestCaseLanding = (props: TestCaseListProps) => {
  useDocumentTitle("MADiE Edit Measure Test Cases");
  return (
    <div>
      <section>
        <TestCaseList
          errors={props.errors}
          setErrors={props.setErrors}
          setWarnings={props.setWarnings}
        />
      </section>
    </div>
  );
};

export default TestCaseLanding;
