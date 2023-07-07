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
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  executeAllTestCases: boolean;
  canEdit: boolean;
  measure: Measure;
  createNewTestCase: (value: string) => void;
  executeTestCases: (value: string) => void;
  onImportTestCases?: () => void;
  testCasePassFailStats: TestCasesPassingDetailsProps;
  coveragePercentage: number;
  validTestCases: TestCase[];
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
    onImportTestCases,
    testCasePassFailStats,
    coveragePercentage,
    validTestCases,
  } = props;
  const { executionContextReady, executing } = props.measure.model.includes(
    "QDM"
  )
    ? useQdmExecutionContext()
    : useExecutionContext();
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        alignItems: "center",
      }}
    >
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
      <div style={{ margin: "6px 0 0 auto", display: "flex" }}>
        {featureFlags?.importTestCases && (
          <div>
            <Button
              onClick={() => {
                if (onImportTestCases) {
                  onImportTestCases();
                }
              }}
              disabled={!canEdit}
              data-testid="show-import-test-cases-button"
            >
              <FileUploadIcon
                style={{ margin: "0 5px 0 -2px" }}
                fontSize="small"
              />
              Import Test Cases
            </Button>
          </div>
        )}
        <div style={{ margin: "0 6px 0 26px" }}>
          <Button
            disabled={!canEdit}
            onClick={createNewTestCase}
            data-testid="create-new-test-case-button"
          >
            <AddIcon style={{ margin: "0 5px 0 -2px" }} fontSize="small" />
            New Test Case
          </Button>
        </div>
        <div style={{ margin: "0 6px 0 26px" }}>
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
        </div>
      </div>
    </div>
  );
}
