import React from "react";
import "twin.macro";
import "styled-components/macro";
import TestCaseList from "./TestCaseList";
import { TestCaseListProps } from "../common/interfaces";
import { useDocumentTitle, useFeatureFlags } from "@madie/madie-util";

const TestCaseLandingQdm = (props: TestCaseListProps) => {
  useDocumentTitle("MADiE Edit Measure Test Cases");
  const featureFlags = useFeatureFlags();

  return (
    <div>
      <section>
        {featureFlags.qdmTestCases ? (
          <TestCaseList
            errors={props.errors}
            setErrors={props.setErrors}
            setWarnings={props.setWarnings}
          />
        ) : (
          <div data-testid="coming-soon">"QDM Test Cases are Coming Soon!"</div>
        )}
      </section>
    </div>
  );
};

export default TestCaseLandingQdm;
