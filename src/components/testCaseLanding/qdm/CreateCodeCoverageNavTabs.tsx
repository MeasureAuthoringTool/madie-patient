import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab } from "@madie/madie-design-system/dist/react";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as _ from "lodash";
import {
  Measure,
  MeasureErrorType,
  TestCase,
  Group,
  MeasureObservation,
  Stratification,
} from "@madie/madie-models";
import { TestCasesPassingDetailsProps } from "../common/interfaces";
import { useFeatureFlags } from "@madie/madie-util";
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";
import RunTestButton from "../common/runTestsButton/RunTestsButton";
import { disableRunTestButtonText } from "../../../util/Utils";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  executeAllTestCases: boolean;
  canEdit: boolean;
  measure: Measure;
  createNewTestCase: (value: string) => void;
  executeTestCases: () => void;
  onImportTestCases?: () => void;
  testCasePassFailStats: TestCasesPassingDetailsProps;
  coveragePercentage: number;
  validTestCases: TestCase[];
  selectedPopCriteria: Group;
  onDeleteAllTestCases?: () => void;
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
  const { executionContextReady, contextFailure } = useQdmExecutionContext();

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
    selectedPopCriteria,
    onDeleteAllTestCases,
  } = props;

  const featureFlags = useFeatureFlags();
  const [shouldDisableRunTestsButton, setShouldDisableRunTestsButton] =
    useState(false);
  useEffect(() => {
    if (featureFlags?.disableRunTestCaseWithObservStrat) {
      const groups: Group[] = measure?.groups;
      groups?.forEach((group) => {
        const measureObservations: MeasureObservation[] =
          group?.measureObservations;
        const measureStratifications: Stratification[] = group?.stratifications;
        if (
          (measureObservations && measureObservations.length > 0) ||
          (measureStratifications && measureStratifications.length > 0)
        ) {
          setShouldDisableRunTestsButton(true);
        }
      });
    } else {
      setShouldDisableRunTestsButton(false);
    }
  }, [
    measure,
    measure?.groups,
    featureFlags?.disableRunTestCaseWithObservStrat,
  ]);

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
    <>
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
          <Button
              variant="danger-primary"
              disabled={!canEdit || measure?.testCases?.length === 0}
              onClick={() => onDeleteAllTestCases ? onDeleteAllTestCases() : null}
              data-testid="delete-all-test-cases-button"
          >
            <KeyboardArrowRightIcon
                style={{ margin: "0 5px 0 -2px" }}
                fontSize="small"
            />
            Delete All
          </Button>
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
          <RunTestButton
            hasErrors={hasErrors}
            isExecutionContextReady={executionContextReady}
            onRunTests={executeTestCases}
            shouldDisableRunTestsButton={shouldDisableRunTestsButton}
          />
        </div>
      </div>
      {shouldDisableRunTestsButton && (
        <div style={{ textAlign: "right", color: "#717171", fontSize: "9px" }}>
          {disableRunTestButtonText}
        </div>
      )}
    </>
  );
}
