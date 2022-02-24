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
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

const EditButton = tw.button`text-blue-600 hover:text-blue-900`;

const TestCase = (props) => {
  const navigate = useNavigate();
  const testCase = props.testCase;
  const [open, setOpen] = React.useState(false);
  const status = testCase.executionStatus;
  const statusColor = testCase.executionStatus === "pass" ? "success" : "error";

  let titleLength = 0;
  let titleNeedTruncate = false;
  let displayTitle = testCase.title;
  if (testCase.title != null && testCase.title.trim() !== "") {
    titleLength = testCase.title.length;
    titleNeedTruncate = titleLength > 60 ? true : false;
    displayTitle =
      titleLength < 60 ? displayTitle : displayTitle.substring(0, 59);
  }

  let seriesLength = 0;
  let seriesNeedTruncate = false;
  let displaySeries = testCase.series;
  if (testCase.series != null && testCase.series.trim() !== "") {
    seriesLength = testCase.series.length;
    seriesNeedTruncate = seriesLength > 60 ? true : false;
    displaySeries =
      seriesLength < 60 ? displaySeries : displaySeries.substring(0, 59);
  }

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

        {!titleNeedTruncate && <td>{testCase.title}</td>}
        {titleNeedTruncate && (
          <td>
            <Tooltip title={testCase.title} placement="right">
              <Button
                data-testid={`test-case-title-${testCase.id}`}
                name="title"
              >
                {displayTitle}
              </Button>
            </Tooltip>
          </td>
        )}

        {!seriesNeedTruncate && <td>{testCase.series}</td>}
        {seriesNeedTruncate && (
          <td>
            <Tooltip title={testCase.series} placement="right">
              <Button
                data-testid={`test-case-series-${testCase.id}`}
                name="series"
              >
                {displaySeries}
              </Button>
            </Tooltip>
          </td>
        )}

        {status === "NA" && <td>{status}</td>}
        {status !== "NA" && (
          <td>
            <Chip label={status} color={statusColor} />
          </td>
        )}

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
