import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CancelIcon from "@mui/icons-material/Cancel";
import Popover from "@mui/material/Popover";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import TruncateText from "./TruncateText";
import { TestCase as TestCaseModel } from "@madie/madie-models";
import {
  MadieDeleteDialog,
  Toast,
} from "@madie/madie-design-system/dist/react";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { Box, useTheme } from "@mui/material";
import * as _ from "lodash";
import "./TestCase.scss";

const TestCase = ({
  testCase,
  canEdit,
  executionResult,
  deleteTestCase,
}: {
  testCase: TestCaseModel;
  canEdit: boolean;
  executionResult: DetailedPopulationGroupResult[];
  deleteTestCase;
}) => {
  const viewOrEdit = canEdit ? "edit" : "view";
  const theme = useTheme();
  const navigate = useNavigate();
  const status = testCase.executionStatus;
  const [deleteDialogModalOpen, setDeleteDialogModalOpen] =
    useState<boolean>(false);

  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastType("danger");
    setToastMessage("");
    setToastOpen(false);
  };

  // Popover utilities
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseModel>(null);
  const handleOpen = (
    selected: TestCaseModel,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedTestCase(selected);
    setAnchorEl(event.currentTarget);
    setOptionsOpen(true);
  };
  const handleClose = () => {
    setOptionsOpen(false);
    setSelectedTestCase(null);
    setAnchorEl(null);
  };

  const exportTestCase = async () => {
    try {
      const textFile = new Blob([JSON.stringify("")], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(textFile);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ADD.zip`);
      document.body.appendChild(link);
      link.click();
      setToastOpen(true);
      setToastType("success");
      setToastMessage("Test case exported successfully");
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    }
  };

  const TestCaseStatus = (executionStatus: string) => {
    let content;
    if (executionStatus === "Invalid") {
      content = (
        <>
          <ErrorIcon sx={{ color: theme.palette.secondary.main }} />
          <span style={{ width: 10 }} />
          Invalid
        </>
      );
    } else if (executionStatus === "NA" || _.isNil(executionStatus)) {
      content = (
        <>
          <DoNotDisturbOnIcon sx={{ color: theme.palette.grey[500] }} />
          <span style={{ width: 10 }} />
          <i>N/A</i>
        </>
      );
    } else if (executionStatus === "pass") {
      content = (
        <>
          <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
          <span style={{ width: 10 }} />
          Pass
        </>
      );
    } else {
      content = (
        <>
          <CancelIcon sx={{ color: theme.palette.error.main }} />
          <span style={{ width: 10 }} />
          Fail
        </>
      );
    }

    return (
      <Box style={{ display: "flex", alignItems: "center" }}>{content}</Box>
    );
  };

  return (
    <React.Fragment key={`fragment-key-${testCase.id}`}>
      <tr
        key={`test-case-row-${testCase.id}`}
        data-testid={`test-case-row-${testCase.id}`}
        style={{ borderBottom: "solid 1px #DDD !important" }}
        className="tcl-tr"
      >
        <td style={{ width: 140 }}>{TestCaseStatus(status)}</td>
        <td data-testid={`test-case-series-${testCase.id}`}>
          <TruncateText
            text={testCase.series}
            maxLength={120}
            name="series"
            dataTestId={`test-case-series-${testCase.id}`}
          />
        </td>
        <td data-testid={`test-case-title-${testCase.id}`}>
          <TruncateText
            text={testCase.title}
            maxLength={60}
            name="title"
            dataTestId={`test-case-title-${testCase.id}`}
          />
        </td>
        <td data-testid={`test-case-description-${testCase.id}`}>
          <TruncateText
            text={testCase.description}
            maxLength={120}
            name="description"
            dataTestId={`test-case-description-${testCase.id}`}
          />
        </td>

        <td style={{ width: 160 }}>
          <button
            className="action-button"
            onClick={(e) => {
              handleOpen(testCase, e);
            }}
            tw="text-blue-600 hover:text-blue-900"
            data-testid={`select-action-${testCase.id}`}
            aria-label={`select-action-${testCase.title}`}
          >
            <div className="action">Select</div>
            <div className="chevron-container">
              <ExpandMoreIcon />
            </div>
          </button>
        </td>
      </tr>

      <Popover
        open={optionsOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          ".MuiPopover-paper": {
            boxShadow: "none",
            overflow: "visible",
            ".popover-content": {
              border: "solid 1px #979797",
              position: "relative",
              marginTop: "16px",
              marginLeft: "-70px",
              borderRadius: "6px",
              background: "#F7F7F7",
              width: "115px",
              "&::before": {
                borderWidth: "thin",
                position: "absolute",
                top: "-8px",
                left: "calc(50% - 8px)",
                height: "16px",
                width: "16px",
                background: "#F7F7F7",
                borderColor: "#979797 transparent transparent #979797",
                content: '""',
                transform: "rotate(45deg)",
              },
              ".btn-container": {
                display: "flex",
                flexDirection: "column",
                padding: "10px 0",
                button: {
                  zIndex: 2,
                  fontSize: 14,
                  padding: "0px 12px",
                  textAlign: "left",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            },
          },
        }}
      >
        <div className="popover-content" data-testid="popover-content">
          <div className="btn-container">
            <button
              id={`view-edit-test-case-${testCase.id}`}
              aria-label={`${viewOrEdit}-test-case-${testCase.title}`}
              data-testid={`view-edit-test-case-${testCase.id}`}
              onClick={() => {
                navigate(`./${testCase.id}`);
                setOptionsOpen(false);
              }}
            >
              {viewOrEdit}
            </button>
            <button
              id={`export-test-case-${testCase.id}`}
              aria-label={`export-test-case-${testCase.title}`}
              data-testid={`export-test-case-${testCase.id}`}
              onClick={() => {
                exportTestCase();
                setOptionsOpen(false);
              }}
            >
              export
            </button>
            {canEdit && (
              <button
                id={`delete-test-case-btn-${testCase.id}`}
                aria-label={`delete-test-case-${testCase.title}`}
                data-testid={`delete-test-case-btn-${testCase.id}`}
                onClick={() => {
                  setDeleteDialogModalOpen(true);
                  setOptionsOpen(false);
                }}
              >
                delete
              </button>
            )}
          </div>
        </div>
      </Popover>

      <Toast
        toastKey="test-case-action-toast"
        aria-live="polite"
        toastType={toastType}
        testId={toastType === "danger" ? "error-toast" : "success-toast"}
        closeButtonProps={{
          "data-testid": "close-toast-button",
        }}
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={6000}
      />

      <MadieDeleteDialog
        open={deleteDialogModalOpen}
        onContinue={() => {
          deleteTestCase(selectedTestCase.id);
        }}
        onClose={() => {
          setDeleteDialogModalOpen(false);
        }}
        dialogTitle={`Delete Test Case`}
        name={selectedTestCase?.title}
      />
    </React.Fragment>
  );
};

export default TestCase;
