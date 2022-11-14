import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import TruncateText from "./TruncateText";
import { TestCase as TestCaseModel } from "@madie/madie-models";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { Box, useTheme } from "@mui/material";
import * as _ from "lodash";

import "./TestCase.css";

export function getStatusColor(executionStatus: string) {
  if (executionStatus === "Invalid") {
    return "secondary";
  } else if (executionStatus === "NA") {
    return "default";
  } else if (executionStatus === "pass") {
    return "success";
  } else {
    return "error";
  }
}

const TestCase = ({
  testCase,
  canEdit,
  executionResult,
}: {
  testCase: TestCaseModel;
  canEdit: boolean;
  executionResult: DetailedPopulationGroupResult[];
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const status = testCase.executionStatus;
  // only one group for now
  const groupPops = [testCase?.groupPopulations?.[0]].filter((tc) => !!tc);
  const executionRun = executionResult && executionResult[0] ? true : false;
  // Test how the screen will handle multiple values for the future.
  // if (groupPopulations.length) {
  //   groupPopulations = groupPopulations.concat(groupPopulations)
  //   groupPopulations = groupPopulations.concat(groupPopulations)
  //   groupPopulations = groupPopulations.concat(groupPopulations)
  // }

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
          <i>Pending</i>
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
      <Box style={{ display: "flex", alignItems: "center" }} color="error">
        {content}
      </Box>
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
            name="title"
            dataTestId={`test-case-series-${testCase.id}`}
          />
        </td>
        <td data-testid={`test-case-title-${testCase.id}`}>
          <TruncateText
            text={testCase.title}
            maxLength={60}
            name="series"
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
              navigate(`./${testCase.id}`);
            }}
            tw="text-blue-600 hover:text-blue-900"
            data-testid={`view-edit-test-case-${testCase.id}`}
          >
            <div className="action">View/Edit</div>
            <div className="chevron-container">
              <ExpandMoreIcon />
            </div>
          </button>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default TestCase;
