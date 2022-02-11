import React, { useState } from "react";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import TestCasePopulationList from "./TestCasePopulationList";
import Chip from "@mui/material/Chip";

const EditButton = tw.button`text-blue-600 hover:text-blue-900`;

const TestCase = (props) => {
  const navigate = useNavigate();
  const testCase = props.testCase;
  const [open, setOpen] = React.useState(false);
  const status = testCase.executionStatus;
  const statusColor = testCase.executionStatus === "pass" ? "success" : "error";

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
        <td>{testCase.title}</td>
        <td align="left">{testCase.series}</td>
        {status === "NA" && <td align="left">{status}</td>}
        {status !== "NA" && (
          <td align="left">
            <Chip label={status} color={statusColor} />
          </td>
        )}

        <td align="left">
          <EditButton
            onClick={() => {
              navigate(`./${testCase.id}`);
            }}
            data-testid={`edit-test-case-${testCase.id}`}
          >
            Edit
          </EditButton>
        </td>
      </tr>

      <TableRow
        key={`test-case-population-row-${testCase.id}`}
        data-testid={`test-case-population-row-${testCase.id}`}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table
                size="small"
                aria-label="population"
                data-testid={`population-table-${testCase.id}`}
              >
                <TestCasePopulationList />
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TestCase;
