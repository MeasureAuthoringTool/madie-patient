import { useCallback, useState, useEffect, useRef } from "react";
import useTestCaseServiceApi from "../../../../api/useTestCaseServiceApi";
import { TestCase } from "@madie/madie-models";
import { QDMPatient } from "cqm-models";

function UseFetchTestCases({ measureId, setErrors }) {
  const testCaseService = useRef(useTestCaseServiceApi());
  const [testCases, setTestCases] = useState<TestCase[]>(null);
  const [loadingState, setLoadingState] = useState<any>({
    loading: true,
    message: "",
  });

  // We need testCase.json to be a QDMPatient object for execution
  const retrieveTestCases = useCallback(() => {
    setLoadingState(() => ({
      loading: true,
      message: "Loading Test Cases...",
    }));
    testCaseService.current
      .getTestCasesByMeasureId(measureId)
      .then((testCaseList: TestCase[]) => {
        testCaseList.forEach((testCase: any) => {
          testCase.executionStatus = testCase.validResource ? "NA" : "Invalid";
          if (testCase.json) {
            testCase.json = JSON.stringify(
              new QDMPatient(JSON.parse(testCase.json))
            );
          }
        });
        setTestCases(testCaseList);
      })
      .catch((err) => {
        setErrors((prevState) => [...prevState, err.message]);
      })
      .finally(() => {
        setLoadingState({ loading: false, message: "" });
      });
  }, [measureId, testCaseService, setErrors]);

  useEffect(() => {
    retrieveTestCases();
  }, [retrieveTestCases]);

  return {
    testCaseService,
    testCases,
    setTestCases,
    loadingState,
    setLoadingState,
    retrieveTestCases,
  };
}
export default UseFetchTestCases;
