import React, { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  Tab,
  Popover,
} from "@madie/madie-design-system/dist/react";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classNames from "classnames";
import "./CreateCodeCoverageNavTabs.scss";

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
  coveragePercentage: string;
  validTestCases: TestCase[];
  selectedPopCriteria: Group;
  onDeleteAllTestCases: () => void;
  onExportQRDA: () => void;
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
  const exportMessage = "Test cases must be executed prior to exporting.";
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
    onExportQRDA,
  } = props;
  const [activeTip, setActiveTip] = useState<boolean>(false);
  const toolTipClass = classNames("madie-tooltip", {
    // hide the tooltip if all testcases have been run
    hidden: !activeTip || executeAllTestCases,
  });
  const featureFlags = useFeatureFlags();
  const [shouldDisableRunTestsButton, setShouldDisableRunTestsButton] =
    useState(false);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
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
  }, [measure, measure?.groups]);

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

  const handleOpen = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setOptionsOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOptionsOpen(false);
    setAnchorEl(null);
  };

  // we only want these attributes surrounding the button if it's disabled.
  const focusTrapAttributes = !executeAllTestCases
    ? {
        role: "button",
        tabIndex: 0,
        onFocus: () => setActiveTip(true),
        onBlur: () => {
          setActiveTip(false);
        },
        onMouseEnter: () => {
          setActiveTip(true);
        },
        onMouseLeave: () => {
          setActiveTip(false);
        },
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            setActiveTip(false);
          }
        },
      }
    : {};
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
        <div style={{ margin: "6px 0 0 auto", display: "flex", gap: "10px" }}>
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
            shouldDisableRunTestsButton={shouldDisableRunTestsButton}
          />

          {/* disabled elements do not fire events. we wrap a listener around it to bypass */}

          {/* render focus trap only when needed */}
          {featureFlags?.testCaseExport && (
            <div
              {...focusTrapAttributes}
              id="export-button-focus-trap"
              data-testid="export-button-focus-trap"
            >
              <Button
                onClick={(e) => {
                  handleOpen(e);
                }}
                disabled={!executeAllTestCases}
                id="show-export-test-cases-button"
                aria-describedby="show-export-test-cases-button-tooltip"
                data-testid="show-export-test-cases-button"
                tabIndex={0}
              >
                Export Test Cases
                <div
                  role="tooltip"
                  id="show-export-test-cases-button-tooltip"
                  data-testid="show-export-test-case-button-tooltip"
                  aria-live="polite"
                  className={toolTipClass}
                >
                  <p>{exportMessage}</p>
                </div>
                <ExpandMoreIcon
                  style={{ margin: "0 5px 0 5px" }}
                  fontSize="small"
                />
              </Button>
            </div>
          )}
          <Popover
            optionsOpen={optionsOpen}
            anchorEl={anchorEl}
            handleClose={handleClose}
            canEdit={canEdit}
            editViewSelectOptionProps={{
              label: "QRDA",
              toImplementFunction: onExportQRDA,
              dataTestId: `export-qrda-${measure?.id}`,
            }}
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
