import React from "react";
import { NavLink } from "react-router-dom";
import "./EditTestCaseBreadCrumbs.scss";

export interface EditTestCaseBreadCrumbsProps {
  testCaseTitle: string;
  testCaseId: string;
  measureId: string;
}
const EditTestCaseBreadCrumbs = (props: EditTestCaseBreadCrumbsProps) => {
  const { testCaseTitle, testCaseId, measureId } = props;
  return (
    <div id="edit-test-case-bread-crumbs">
      <NavLink
        data-testid="qdm-test-cases"
        to={`/measures/${measureId}/edit/test-cases`}
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "madie-link active" : "madie-link"
        }
      >
        Test Cases
      </NavLink>
      <div className="spacer">/</div>
      <NavLink
        data-testid="qdm-test-cases-testcase"
        to={`/measures/${measureId}/edit/test-cases/${testCaseId}`}
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "madie-link active" : "madie-link"
        }
      >
        {testCaseTitle || "testCaseTitle"}
      </NavLink>
    </div>
  );
};

export default EditTestCaseBreadCrumbs;
