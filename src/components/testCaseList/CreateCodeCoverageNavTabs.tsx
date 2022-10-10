import React from "react";
import { Tabs, Tab } from "@mui/material";
import { Button } from "@madie/madie-design-system/dist/react";
import AddIcon from "@mui/icons-material/Add";
import * as _ from "lodash";
import { Measure } from "@madie/madie-models";
export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  executeAllTestCases: boolean;
  canEdit: boolean;
  measure: Measure;
  createNewTestCase: (value: string) => void;
  executeTestCases: (value: string) => void;
}

const defaultStyle = {
  padding: "0px 10px",
  height: "90px",
  minHeight: "90px",
  textTransform: "none",
  marginRight: "36px",
};

export default function CreateCodeCoverageNavTabs(props: NavTabProps) {
  const {
    activeTab,
    setActiveTab,
    executeAllTestCases,
    canEdit,
    createNewTestCase,
    measure,
    executeTestCases,
  } = props;

  const executionResultsDisplayTemplate = (label) => {
    const term = executeAllTestCases
      ? [0, 50, 100][Math.floor(Math.random() * 3)]
      : "-";
    return (
      <div>
        <div style={{ fontSize: "28px" }}>
          {executeAllTestCases ? term + "%" : "-"}{" "}
        </div>
        <div style={{ fontSize: "16px" }}>
          {label} {executeAllTestCases && label !== "Coverage" && "(1/2)"}
        </div>
      </div>
    );
  };

  return (
    <Tabs
      value={activeTab}
      onChange={(e, v) => {
        setActiveTab(v);
      }}
      sx={{
        width: "96.5%",
        fontWeight: 500,
        height: "95px",
        minHeight: "95px",
        padding: 0,
        fontSize: "39px",
        fontFamily: "Rubik, sans serif",
        color: "#333333",
        borderBottom: "solid 1px #DDDDDD",
        "& .MuiTabs-indicator": {
          height: "4px",
          backgroundColor: "#209FA6",
        },
        "& .Mui-selected": {
          fontWeight: 600,
          fontHeight: "35px",
          color: "#515151 !important",
        },
      }}
    >
      <Tab
        sx={defaultStyle}
        label={executionResultsDisplayTemplate("Passing")}
        data-testid="testCasesList-tab"
        value="testCasesList"
      />
      <Tab
        sx={defaultStyle}
        label={executionResultsDisplayTemplate("Coverage")}
        data-testid="coverage-tab"
        value="coverage"
      />
      <div style={{ margin: "6px 0 0 auto", display: "flex" }}>
        <div>
          {canEdit && (
            <Button
              disabled={false}
              onClick={createNewTestCase}
              data-testid="create-new-test-case-button"
            >
              <AddIcon style={{ margin: "0 5px 0 -2px" }} fontSize="small" />
              New Test Case
            </Button>
          )}
        </div>
        <div style={{ margin: "0 6px 0 26px" }}>
          {canEdit && (
            <Button
              style={{ backgroundColor: "#048087" }}
              disabled={
                !!measure?.cqlErrors ||
                _.isNil(measure?.groups) ||
                measure?.groups.length === 0
              }
              onClick={executeTestCases}
              data-testid="execute-test-cases-button"
            >
              Execute Test Cases
            </Button>
          )}
        </div>
      </div>
    </Tabs>
  );
}
