import React from "react";
import { TestCase } from "@madie/madie-models";
import { NavLink } from "react-router-dom";
import "./EditTestCaseBreadCrumbs.scss";

export interface EditTestCaseBreadCrumbsProps {
  measureId: string;
  testCase: TestCase;
}
const EditTestCaseBreadCrumbs = (props: EditTestCaseBreadCrumbsProps) => {
  const { testCase, measureId } = props;

  let testCaseString = "";
  if (testCase) {
    testCaseString = testCase?.series
      ? `${testCase.series} - ${testCase.title}`
      : `${testCase.title}`;
  }
  return (
    <div id="edit-test-case-bread-crumbs">
      <NavLink
        data-testid="qdm-test-cases"
        to={`/measures/${measureId}/edit/test-cases`}
        className={({ isActive }) => (isActive ? "madie-link" : "madie-link")}
      >
        Test Cases
      </NavLink>
      <div className="spacer">/</div>
      <NavLink
        data-testid="qdm-test-cases-testcase"
        to={`/measures/${measureId}/edit/test-cases/${testCase?.id}`}
        className={({ isActive, isPending }) =>
          isActive ? "madie-link active" : "madie-link"
        }
      >
        {testCaseString}
      </NavLink>
    </div>
  );
};

export default EditTestCaseBreadCrumbs;
