import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import ErrorIcon from "@mui/icons-material/Error";
import { Box, useTheme } from "@mui/material";
import * as _ from "lodash";

interface TestCaseProps {
  executionStatus: string;
}

export const TestCaseStatus = (props: TestCaseProps) => {
  const { executionStatus } = props;
  const theme = useTheme();
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
  return <Box style={{ display: "flex", alignItems: "center" }}>{content}</Box>;
};

type TCRow = {
  status: any;
  group: string;
  title: string;
  description: string;
  action: any;
};
interface TestCaseActionButton {
  testCase: TCRow;
}
export const TestCaseActionButton = (props) => {
  const { testCase, handleOpen } = props;
  return (
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
  );
};
