import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import TestCasePopulationList from "../populations/TestCasePopulationList";
import Chip from "@mui/material/Chip";
import TruncateText from "./TruncateText";
import { PopulationValue } from "../../models/TestCase";
import { MeasurePopulation } from "../../models/MeasurePopulation";

const EditButton = tw.button`text-blue-600 hover:text-blue-900`;
const StyledCell = styled.td`
  white-space: pre;
`;

const testCasePopulations: PopulationValue[] = [
  {
    name: MeasurePopulation.INITIAL_POPULATION,
    expected: true,
    actual: true,
  },
  {
    name: MeasurePopulation.DENOMINATOR,
    expected: true,
    actual: true,
  },
  {
    name: MeasurePopulation.NUMERATOR_EXCLUSION,
    expected: true,
    actual: true,
  },
  {
    name: MeasurePopulation.NUMERATOR,
    expected: true,
    actual: true,
  },
];

const TestCase = (props) => {
  const navigate = useNavigate();
  const { testCase, canEdit } = props;
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

        {status === "NA" && <td>{status}</td>}
        {status !== "NA" && (
          <td>
            <Chip label={status} color={statusColor} />
          </td>
        )}
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table
                size="small"
                aria-label="population"
                data-testid={`population-table-${testCase.id}`}
              >
                <TestCasePopulationList populations={testCasePopulations} />
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TestCase;
