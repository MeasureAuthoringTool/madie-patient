import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import TestCase from "../../models/TestCase";
import { useParams } from "react-router-dom";
import { Button } from "@madie/madie-components";
import TestCaseComponent from "./TestCase";
import TestCasePopulationList from "./TestCasePopulationList";

const TH = tw.th`p-3 border-b text-left text-sm font-bold uppercase`;
const ErrorAlert = tw.div`bg-red-100 text-red-700 rounded-lg m-1 p-3`;

const TestCaseList = () => {
  const [testCases, setTestCases] = useState<TestCase[]>();
  const [error, setError] = useState("");
  const { measureId } = useParams<{ measureId: string }>();
  const testCaseService = useTestCaseServiceApi();

  const [isExecuteButtonClicked, setisExecuteButtonClicked] = useState(false);
  const [activeItem, setActiveItem] = React.useState(null);
  //MAT-3911: only for mock up purpose
  let lastTestCase = null;

  useEffect(() => {
    if (!testCases) {
      testCaseService
        .getTestCasesByMeasureId(measureId)
        .then((testCaseList: TestCase[]) => {
          //MAT-3911: only for mock up purpose
          const listItems = testCaseList.map((testCase) => {
            testCase.executionStatus = "NA";
            lastTestCase = testCase;
          });
          setTestCases(testCaseList);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [measureId, testCaseService, testCases]);

  //MAT-3911: the following is pure mockup data, need to be replaced by real data
  const executeTestCasesHandler = () => {
    if (testCases) {
      let count = 0;
      testCases.map((testCase) => {
        if (count === 0) {
          testCase.executionStatus = "pass";
        } else {
          testCase.executionStatus = "fail";
        }
        count = count + 1;
      });
    }
    setisExecuteButtonClicked(true);
  };

  return (
    <div>
      <div tw="flex flex-col">
        <div tw="py-2">
          <Button
            buttonTitle="Execute Test Cases"
            disabled={false}
            onClick={executeTestCasesHandler}
          />
        </div>

        {error && (
          <ErrorAlert data-testid="display-tests-error" role="alert">
            {error}
          </ErrorAlert>
        )}
        <div tw="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div tw="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <table tw="min-w-full" data-testid="test-case-tbl">
              <thead>
                <tr>
                  <TH scope="col"></TH>
                  <TH scope="col">Title</TH>
                  <TH scope="col">Series</TH>
                  <TH scope="col">Status</TH>
                  <TH scope="col" />
                </tr>
              </thead>
              <tbody>
                {testCases?.map((testCase) => (
                  <TestCaseComponent
                    testCase={testCase}
                    children={null}
                    setActiveItem={setActiveItem}
                    activeItem={activeItem}
                    index={testCase.id}
                    isExecuteButtonClicked={isExecuteButtonClicked}
                  />
                ))}
              </tbody>
            </table>

            {activeItem !== null && <TestCasePopulationList />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseList;
