import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { Button, Tabs, Tab } from "@madie/madie-design-system/dist/react";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as _ from "lodash";
import { Measure, MeasureErrorType, TestCase } from "@madie/madie-models";
import useExecutionContext from "../../routes/qiCore/useExecutionContext";
import { TestCasesPassingDetailsProps } from "../common/interfaces";
import { useFeatureFlags } from "@madie/madie-util";
import "twin.macro";
import "styled-components/macro";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  executeAllTestCases: boolean;
  canEdit: boolean;
  measure: Measure;
  createNewTestCase: (value: string) => void;
  executeTestCases: (value: string) => void;
  onImportTestCasesFromBonnie?: () => void;
  onImportTestCases?: () => void;
  testCasePassFailStats: TestCasesPassingDetailsProps;
  coveragePercentage: number;
  validTestCases: TestCase[];
  exportTestCases: () => void;
}

const defaultStyle = {
  padding: "0px 10px",
  height: "80px",
  minHeight: "80px",
  textTransform: "none",
  marginRight: "36px",
  "&:focus": {
    outline: "9px auto -webkit-focus-ring-color",
    outlineOffset: "-1px",
  },
};

export default function CreateCodeCoverageNavTabs(props: NavTabProps) {
  const { executionContextReady, executing } = useExecutionContext();

  const {
    activeTab,
    setActiveTab,
    executeAllTestCases,
    canEdit,
    createNewTestCase,
    measure,
    executeTestCases,
    onImportTestCasesFromBonnie,
    onImportTestCases,
    testCasePassFailStats,
    coveragePercentage,
    validTestCases,
    exportTestCases,
  } = props;

  const featureFlags = useFeatureFlags();
  const executionResultsDisplayTemplate = (label) => {
    const codeCoverage = executeAllTestCases ? coveragePercentage : "-";
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
    <div tw="flex justify-between items-center">
      <Tabs
        value={activeTab}
        onChange={(e, v) => {
          setActiveTab(v);
        }}
        type="B"
        orientation="horizontal"
      >
        <Tab
          type="B"
          tabIndex={0}
          aria-label="Passing tab panel"
          sx={defaultStyle}
          label={executionResultsDisplayTemplate("Passing")}
          data-testid="passing-tab"
          value="passing"
        />
        <Tab
          type="B"
          tabIndex={0}
          aria-label="Coverage tab panel"
          sx={defaultStyle}
          label={executionResultsDisplayTemplate("Coverage")}
          data-testid="coverage-tab"
          value="coverage"
        />
      </Tabs>
      <div tw="flex flex-wrap space-x-4 justify-end h-10">
        <Button
          variant="outline"
          onClick={() => {
            if (onImportTestCases) {
              onImportTestCases();
            }
          }}
          disabled={!canEdit}
          data-testid="import-test-cases-button"
        >
          <FileUploadIcon style={{ margin: "0 5px 0 -2px" }} fontSize="small" />
          Import Test Cases
        </Button>
        {featureFlags?.importTestCases && (
          <Button
            onClick={() => {
              if (onImportTestCasesFromBonnie) {
                onImportTestCasesFromBonnie();
              }
            }}
            disabled={!canEdit}
            data-testid="import-test-cases-from-bonnie-button"
          >
            <FileUploadIcon
              style={{ margin: "0 5px 0 -2px" }}
              fontSize="small"
            />
            Import From Bonnie
          </Button>
        )}
        <Button
          disabled={!canEdit}
          onClick={createNewTestCase}
          data-testid="create-new-test-case-button"
        >
          <AddIcon style={{ margin: "0 5px 0 -2px" }} fontSize="small" />
          New Test Case
        </Button>
        <Box sx={{ position: "relative" }}>
          <Button
            variant="cyan"
            disabled={
              !!measure?.cqlErrors ||
              measure?.errors?.includes(
                MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES
              ) ||
              _.isNil(measure?.groups) ||
              measure?.groups.length === 0 ||
              !executionContextReady ||
              executing ||
              _.isEmpty(validTestCases)
            }
            onClick={executeTestCases}
            data-testid="execute-test-cases-button"
          >
            Run Test Cases
          </Button>
          {executing && (
            <CircularProgress
              size={24}
              sx={{
                color: "#209FA6",
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-5px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
        <Button
          disabled={!canEdit}
          onClick={exportTestCases}
          data-testid="export-test-cases-button"
        >
          Export Test Cases
        </Button>
      </div>
    </div>
  );
}
