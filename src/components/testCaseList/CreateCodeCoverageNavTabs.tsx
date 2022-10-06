import React from "react";
import { Tabs, Tab } from "@mui/material";
import { Button } from "@madie/madie-design-system/dist/react";
import AddIcon from "@mui/icons-material/Add";
import * as _ from "lodash";
import { Measure } from "@madie/madie-models";
export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  click: boolean;
  canEdit: boolean;
  measure: Measure;
  createNewTestCase: (value: string) => void;
  executeTestCases: (value: string) => void;
}

const defaultStyle = {
  padding: "0px 10px",
  height: "45px",
  minHeight: "45px",
  textTransform: "none",
};

export default function CreateCodeCoverageNavTabs(props: NavTabProps) {
  const {
    activeTab,
    setActiveTab,
    click,
    canEdit,
    createNewTestCase,
    measure,
    executeTestCases,
  } = props;

  const testing = (label, click) => {
    const term = click ? [0, 50, 100][Math.floor(Math.random() * 3)] : "-";
    return (
      <div>
        <div>{click ? term + "%" : "-"} </div>
        {label} {click && label !== "Coverage" && "(" + +term / 100 + ")"}
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
        width: "97%",
        fontWeight: 500,
        height: "55px",
        minHeight: "75px",
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
        label={testing("Passing", click)}
        data-testid="testCasesList-tab"
        value="testCasesList"
      />
      <Tab
        sx={defaultStyle}
        label={testing("Coverage", click)}
        data-testid="coverage-tab"
        value="coverage"
      />
      <div style={{ marginLeft: "auto", display: "flex" }}>
        <div style={{ marginRight: "6px" }}>
          {canEdit && (
            <Button
              disabled={false}
              onClick={createNewTestCase}
              data-testid="create-new-test-case-button"
            >
              <AddIcon
                style={{ marginRight: "5px", marginLeft: "-2px" }}
                fontSize="small"
              />
              New Test Case
            </Button>
          )}
        </div>
        <div style={{ marginLeft: "16px", marginRight: "6px" }}>
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
