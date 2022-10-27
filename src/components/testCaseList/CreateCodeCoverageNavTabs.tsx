import React from "react";
import { Tabs, Tab } from "@mui/material";
import { Button } from "@madie/madie-design-system/dist/react";
import AddIcon from "@mui/icons-material/Add";
import * as _ from "lodash";
import { Measure } from "@madie/madie-models";
import { TestCasesPassingDetailsProps } from "./TestCaseList";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  executeAllTestCases: boolean;
  canEdit: boolean;
  measure: Measure;
  createNewTestCase: (value: string) => void;
  executeTestCases: (value: string) => void;
  testCasePassFailStats: TestCasesPassingDetailsProps;
}

const defaultStyle = {
  padding: "0px 10px",
  height: "90px",
  minHeight: "90px",
  textTransform: "none",
  marginRight: "36px",
  "&:focus": {
    outline: "9px auto -webkit-focus-ring-color",
    outlineOffset: "-1px",
  },
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
    testCasePassFailStats,
  } = props;

  const executionResultsDisplayTemplate = (label) => {
    const codeCoverage = executeAllTestCases
      ? [0, 50, 100][Math.floor(Math.random() * 3)]
      : "-";
    const displayPercentage =
      label !== "Coverage"
        ? testCasePassFailStats.passPercentage
        : codeCoverage;
    return (
      <div>
        <div style={{ fontSize: "29px", fontWeight: "600" }}>
          {executeAllTestCases ? displayPercentage + "%" : "-"}{" "}
        </div>
        <div style={{ fontSize: "19px" }}>
          {label}{" "}
          {executeAllTestCases &&
            label !== "Coverage" &&
            `(${testCasePassFailStats.passFailRatio})`}
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
        fontWeight: 450,
        height: "95px",
        minHeight: "95px",
        padding: 0,
        fontSize: "39px",
        fontFamily: "Rubik, sans serif",
        color: "#515151",
        borderBottom: "solid 1px #DDDDDD",
        "& .MuiTabs-indicator": {
          height: "5px",
          backgroundColor: "#209FA6",
        },
        "& .Mui-selected": {
          fontWeight: 480,
          fontHeight: "35px",
          color: "#242424 !important",
        },
      }}
    >
      <Tab
        tabIndex={0}
        aria-label="Passing tab panel"
        sx={defaultStyle}
        label={executionResultsDisplayTemplate("Passing")}
        data-testid="passing-tab"
        value="passing"
      />
      <Tab
        tabIndex={0}
        aria-label="Coverage tab panel"
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
