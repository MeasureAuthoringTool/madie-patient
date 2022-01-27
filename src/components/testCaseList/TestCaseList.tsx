import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import TestCase from "../../models/TestCase";
import { useNavigate, useParams } from "react-router-dom";
const TH = tw.th`p-3 border-b text-left text-sm font-bold uppercase`;
const TD = tw.td`p-3 whitespace-nowrap text-sm font-medium text-gray-900`;
const Button = tw.button`text-blue-600 hover:text-blue-900`;
const ErrorAlert = tw.div`bg-red-100 text-red-700 rounded-lg m-1 p-3`;

const TestCaseList = () => {
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState<TestCase[]>();
  const [error, setError] = useState("");
  const { measureId } = useParams<{ measureId: string }>();
  const testCaseService = useTestCaseServiceApi();

  useEffect(() => {
    if (!testCases) {
      testCaseService
        .getTestCasesByMeasureId(measureId)
        .then((testCaseList: TestCase[]) => {
          setTestCases(testCaseList);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [measureId, testCaseService, testCases]);

  return (
    <div>
      <div tw="flex flex-col">
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
                  <TH scope="col">Description</TH>
                  <TH scope="col">Status</TH>
                  <TH scope="col" />
                </tr>
              </thead>
              <tbody>
                {testCases?.map((testCase) => (
                  <tr tw="border-b" key={testCase.id}>
                    <TD>{testCase.description}</TD>
                    <TD>NA</TD>
                    <TD>
                      <Button
                        onClick={() => {
                          navigate(`./${testCase.id}`);
                        }}
                        data-testid={`edit-test-case-${testCase.id}`}
                      >
                        Edit
                      </Button>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseList;
