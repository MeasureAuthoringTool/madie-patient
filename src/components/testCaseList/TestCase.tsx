import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import TruncateText from "./TruncateText";
import {
  TestCase as TestCaseModel,
} from "@madie/madie-models";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import GroupPopulations from "../populations/GroupPopulations";
const EditButton = tw.button`text-blue-600 hover:text-blue-900`;
const StyledCell = styled.td`
  white-space: pre;
`;

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
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const status = testCase.executionStatus;
  const statusColor = getStatusColor(testCase.executionStatus);
  // only one group for now
  const groupPops = [testCase?.groupPopulations?.[0]].filter((tc) => !!tc);
  const executionRun = executionResult && executionResult[0] ? true : false;
  // Test how the screen will handle multiple values for the future.
  // if (groupPopulations.length) {
  //   groupPopulations = groupPopulations.concat(groupPopulations)
  //   groupPopulations = groupPopulations.concat(groupPopulations)
  //   groupPopulations = groupPopulations.concat(groupPopulations)
  // }

  return (
    <React.Fragment key={`fragment-key-${testCase.id}`}>
      <tr
        key={`test-case-row-${testCase.id}`}
        data-testid={`test-case-row-${testCase.id}`}
      >
        <td>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            data-testid={`open-button-${testCase.id}`}
            key={testCase.id}
          >
            {open ? (
              <FontAwesomeIcon
                icon={faArrowUp}
                data-testid={`arrow-up-icon-${testCase.id}`}
              />
            ) : (
              <FontAwesomeIcon
                icon={faArrowRight}
                data-testid={`arrow-right-icon-${testCase.id}`}
              />
            )}
          </IconButton>
        </td>

        <StyledCell data-testid={`test-case-title-${testCase.id}`}>
          <TruncateText
            text={testCase.title}
            maxLength={60}
            name="title"
            dataTestId={`test-case-title-${testCase.id}`}
          />
        </StyledCell>
        <StyledCell data-testid={`test-case-series-${testCase.id}`}>
          <TruncateText
            text={testCase.series}
            maxLength={60}
            name="series"
            dataTestId={`test-case-series-${testCase.id}`}
          />
        </StyledCell>

        <td>
          <Chip label={status} color={statusColor} />
        </td>
        {canEdit && (
          <td>
            <EditButton
              onClick={() => {
                navigate(`./${testCase.id}`);
              }}
              data-testid={`edit-test-case-${testCase.id}`}
            >
              Edit
            </EditButton>
          </td>
        )}
        {!canEdit && (
          <td>
            <EditButton
              onClick={() => {
                navigate(`./${testCase.id}`);
              }}
              data-testid={`view-test-case-${testCase.id}`}
            >
              View
            </EditButton>
          </td>
        )}
      </tr>

      <TableRow
        key={`test-case-population-row-${testCase.id}`}
        data-testid={`test-case-population-row-${testCase.id}`}
      >
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, borderBottom: "none" }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div
              id="test-case-population-lower-tab"
              aria-label="population"
              data-testid={`population-table-${testCase.id}`}
            >
              <GroupPopulations
                groupPopulations={groupPops}
                executionRun={executionRun}
              />
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TestCase;
