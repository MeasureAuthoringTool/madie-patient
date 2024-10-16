import React, { useState } from "react";
import {
  Button,
  Tabs,
  Tab,
  Popover,
} from "@madie/madie-design-system/dist/react";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as _ from "lodash";
import { Measure, MeasureErrorType, TestCase } from "@madie/madie-models";
import useExecutionContext from "../../routes/qiCore/useExecutionContext";
import { TestCasesPassingDetailsProps } from "../common/interfaces";
import { useFeatureFlags } from "@madie/madie-util";
import "twin.macro";
import "styled-components/macro";
import RunTestButton from "../common/runTestsButton/RunTestsButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  executeAllTestCases: boolean;
  canEdit: boolean;
  measure: Measure;
  createNewTestCase: (value: string) => void;
  executeTestCases: () => void;
  onImportTestCasesFromBonnie?: () => void;
  onImportTestCases?: () => void;
  testCasePassFailStats: TestCasesPassingDetailsProps;
  coveragePercentage: number;
  validTestCases: TestCase[];
  exportTestCases: (bundleType: string) => void;
  onDeleteAllTestCases: () => void;
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
  const { executionContextReady, contextFailure } = useExecutionContext();
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
    onDeleteAllTestCases,
  } = props;
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOptionsOpen(true);
  };
  const handleClose = () => {
    setOptionsOpen(false);
    setAnchorEl(null);
  };

  const hasErrors =
    measure?.cqlErrors ||
    measure?.errors?.includes(
      MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES
    ) ||
    _.isNil(measure?.groups) ||
    measure?.groups.length === 0 ||
    _.isEmpty(validTestCases) ||
    contextFailure;

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
          variant="danger-primary"
          disabled={!canEdit || measure?.testCases?.length === 0}
          onClick={onDeleteAllTestCases}
          data-testid="delete-all-test-cases-button"
        >
          <KeyboardArrowRightIcon
            style={{ margin: "0 5px 0 -2px" }}
            fontSize="small"
          />
          Delete All
        </Button>
        <Button
          variant="outline"
          onClick={onImportTestCases}
          disabled={!canEdit}
          data-testid="import-test-cases-button"
        >
          <FileUploadIcon style={{ margin: "0 5px 0 -2px" }} fontSize="small" />
          Import from MADiE
        </Button>
        {featureFlags?.qiCoreBonnieTestCases && (
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
        <RunTestButton
          hasErrors={hasErrors}
          isExecutionContextReady={executionContextReady}
          onRunTests={executeTestCases}
        />
        <Button
          variant={"outline"}
          className="export-bundle-button"
          onClick={handleOpen}
          data-testid="export-test-cases-button"
        >
          <div className="export-action">Export Test Cases</div>
          <div className="export-chevron-container">
            <ExpandMoreIcon />
          </div>
        </Button>

        <Popover
          optionsOpen={optionsOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          canEdit={canEdit}
          additionalSelectOptionProps={[
            {
              label: "Transaction Bundle",
              dataTestId: `export-transaction-bundle`,
              toImplementFunction: () => {
                exportTestCases("TRANSACTION");
              },
            },
            {
              label: "Collection Bundle",
              dataTestId: `export-collection-bundle`,
              toImplementFunction: () => {
                exportTestCases("COLLECTION");
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
