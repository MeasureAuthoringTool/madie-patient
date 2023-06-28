import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCaseList from "./TestCaseList";
import { TestCaseListProps } from "../common/interfaces";
import { useDocumentTitle, useFeatureFlags } from "@madie/madie-util";

const TestCaseLandingQdm = (props: TestCaseListProps) => {
  useDocumentTitle("MADiE Edit Measure Test Cases");
  const featureFlags = useFeatureFlags();
  // todo Can we extract TestCaseList (table) display and isolate it, such that irrespective of model, we can reuse the table ?
  // run Test Cases button and display of results could be specific to model,
  // so they can be in landing component and not in test case list component.
  // If TestCaseList is not refactored, then the other alternate is to create TestCaseListQdm and copy most of the components.// I don't like this.

  return (
    <div>
      <section>
        <TestCaseList errors={props.errors} setErrors={props.setErrors} />
      </section>
    </div>
  );
};

export default TestCaseLandingQdm;
