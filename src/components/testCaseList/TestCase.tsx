import React from "react";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@madie/madie-components";

const TH = tw.th`p-3 border-b text-left text-sm font-bold uppercase`;
const TD = tw.td`p-3 whitespace-nowrap text-sm font-medium text-gray-900`;
const EditButton = tw.button`text-blue-600 hover:text-blue-900`;

const TestCase = (props) => {
  const navigate = useNavigate();
  const expanded = props.activeItem === props.index;
  const cls = expanded ? "item-active" : "";
  const testCase = props.testCase;
  const isExecuteButtonClicked = props.isExecuteButtonClicked;

  const toggleExpandedHandler = (index) => {
    props.setActiveItem(index);
  };

  return (
    <tr
      tw="border-b"
      key={props.testCase.id}
      data-testid={`test-case-row-${props.testCase.id}`}
    >
      {!expanded && (
        <FontAwesomeIcon
          icon={faArrowRight}
          color="grey"
          onClick={() => toggleExpandedHandler(props.index)}
        />
      )}
      {expanded && (
        <FontAwesomeIcon
          icon={faArrowUp}
          color="grey"
          onClick={() => toggleExpandedHandler(null)}
        />
      )}

      <TD>{testCase.title}</TD>
      <TD>{testCase.series}</TD>
      {isExecuteButtonClicked && testCase.executionStatus === "pass" && (
        <TD>
          <Button
            buttonTitle={testCase.executionStatus}
            buttonSize="xs"
            shape="round"
            variant="secondary"
          />
        </TD>
      )}
      {isExecuteButtonClicked && testCase.executionStatus === "fail" && (
        <TD>
          <Button
            buttonTitle={testCase.executionStatus}
            buttonSize="xs"
            shape="round"
            variant="white"
          />
        </TD>
      )}
      {!isExecuteButtonClicked && <TD>{testCase.executionStatus}</TD>}
      <TD>
        <EditButton
          onClick={() => {
            navigate(`./${testCase.id}`);
          }}
          data-testid={`edit-test-case-${testCase.id}`}
        >
          Edit
        </EditButton>
      </TD>
    </tr>
  );
};

export default TestCase;
