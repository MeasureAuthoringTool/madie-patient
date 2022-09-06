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
import Chip from "@mui/material/Chip";
import TruncateText from "./TruncateText";
import {
  DisplayGroupPopulation,
  GroupPopulation,
  TestCase as TestCaseModel,
} from "@madie/madie-models";
import {
  DetailedPopulationGroupResult,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import * as _ from "lodash";
import { FHIR_POPULATION_CODES } from "../../util/PopulationsMap";
import GroupPopulations from "../populations/GroupPopulations";
const EditButton = tw.button`text-blue-600 hover:text-blue-900`;
const StyledCell = styled.td`
  white-space: pre;
`;

const mapGroups = (
  groupPopulation: GroupPopulation,
  results: DetailedPopulationGroupResult
): DisplayGroupPopulation[] => {
  if (_.isNil(groupPopulation)) {
    return null;
  }
  return [
    {
      ...groupPopulation,
      populationValues: groupPopulation?.populationValues?.map(
        (populationValue) => {
          return {
            ...populationValue,
            actual: !!results?.populationResults?.find(
              (popResult) =>
                FHIR_POPULATION_CODES[popResult.populationType] ===
                populationValue.name
            )?.result,
          };
        }
      ),
    },
  ];
};

const TestCase = ({
  testCase,
  canEdit,
  executionResult,
}: {
  testCase: TestCaseModel;
  canEdit: boolean;
  executionResult: ExecutionResult<DetailedPopulationGroupResult>;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const status = testCase.executionStatus;
  const statusColor = testCase.executionStatus === "pass" ? "success" : "error";
  // only one group for now
  const groupPopulations = mapGroups(
    testCase?.groupPopulations?.[0],
    executionResult?.[0]
  );
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
                groupPopulations={groupPopulations}
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
