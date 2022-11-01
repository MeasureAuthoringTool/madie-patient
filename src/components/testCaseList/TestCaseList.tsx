import React, { useEffect, useRef, useState, useCallback } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import { TestCase } from "@madie/madie-models";
import { useParams } from "react-router-dom";
import TestCaseComponent from "./TestCase";
import calculationService from "../../api/CalculationService";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import { getFhirMeasurePopulationCode } from "../../util/PopulationsMap";
import { useOktaTokens } from "@madie/madie-util";
import useExecutionContext from "../routes/useExecutionContext";
import CreateCodeCoverageNavTabs from "./CreateCodeCoverageNavTabs";
import CodeCoverageHighlighting from "./CodeCoverageHighlighting";
import CreateNewTestCaseDialog from "../createTestCase/CreateNewTestCaseDialog";
import { MadieSpinner } from "@madie/madie-design-system/dist/react";

const TH = tw.th`p-3 border-b text-left text-sm font-bold uppercase`;
const ErrorAlert = tw.div`bg-red-100 text-red-700 rounded-lg m-1 p-3`;

export interface TestCasesPassingDetailsProps {
  passPercentage: number;
  passFailRatio: string;
}

const TestCaseList = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(null);
  const [executionResults, setExecutionResults] = useState<{
    [key: string]: DetailedPopulationGroupResult[];
  }>({});
  const [error, setError] = useState("");
  const { measureId } = useParams<{ measureId: string }>();
  const testCaseService = useRef(useTestCaseServiceApi());
  const calculation = useRef(calculationService());
  const { getUserName } = useOktaTokens();
  const userName = getUserName();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("passing");
  const [executeAllTestCases, setExecuteAllTestCases] =
    useState<boolean>(false);
  const [coverageHTML, setCoverageHTML] = useState<string>("");
  const [coveragePercentage, setCoveragePercentage] = useState<number>(0);
  const [testCasePassFailStats, setTestCasePassFailStats] =
    useState<TestCasesPassingDetailsProps>({
      passPercentage: undefined,
      passFailRatio: "",
    });
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const {
    measureState,
    bundleState,
    valueSetsState,
    executionContextReady,
    executing,
    setExecuting,
  } = useExecutionContext();
  const [measure] = measureState;
  const [measureBundle] = bundleState;
  const [valueSets] = valueSetsState;

  const [createOpen, setCreateOpen] = useState<boolean>(false);

  useEffect(() => {
    setCanEdit(
      measure?.createdBy === userName ||
        measure?.acls?.some(
          (acl) =>
            acl.userId === userName && acl.roles.indexOf("SHARED_WITH") >= 0
        )
    );
  }, [measure, userName]);

  const retrieveTestCases = useCallback(() => {
    testCaseService.current
      .getTestCasesByMeasureId(measureId)
      .then((testCaseList: TestCase[]) => {
        testCaseList.forEach((testCase: any) => {
          testCase.executionStatus = testCase.validResource ? "NA" : "Invalid";
        });
        setTestCases(testCaseList);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setInitialLoad(false);
      });
  }, [measureId, testCaseService]);

  useEffect(() => {
    retrieveTestCases();
  }, [measureId, testCaseService]);

  useEffect(() => {
    const createTestCaseListener = () => {
      retrieveTestCases();
    };
    window.addEventListener("createTestCase", createTestCaseListener, false);
    return () => {
      window.removeEventListener(
        "createTestCase",
        createTestCaseListener,
        false
      );
    };
  }, []);

  const createNewTestCase = () => {
    setCreateOpen(true);
    setExecuteAllTestCases(false);
  };

  const handleClose = () => {
    setCreateOpen(false);
  };

  const executeTestCases = async () => {
    if (measure && measure.cqlErrors) {
      setError(
        "Cannot execute test cases while errors exist in the measure CQL!"
      );
      return null;
    }
    const validTestCases = testCases?.filter((tc) => tc.validResource);

    if (validTestCases && validTestCases.length > 0 && measureBundle) {
      setExecuting(true);
      try {
        const calculationOutput: CalculationOutput<any> =
          await calculation.current.calculateTestCases(
            measure,
            validTestCases,
            measureBundle,
            valueSets
          );
        const regex = /<h2> Clause Coverage: [0-9]*\.[0-9]+%<\/h2>/i;
        const executionResults = calculationOutput.results,
          executionHTML = calculationOutput.coverageHTML.replace(regex, "");
        setCoverageHTML(executionHTML);
        const nextExecutionResults = {};
        validTestCases.forEach((testCase, i) => {
          const detailedResults = executionResults.find(
            (result) => result.patientId === testCase.id
          )?.detailedResults;
          nextExecutionResults[testCase.id] = detailedResults;

          const processedTC = calculationService().processTestCaseResults(
            testCase,
            measure.groups,
            detailedResults,
            false
          );
          testCase.groupPopulations = processedTC.groupPopulations;
          testCase.executionStatus = processedTC.executionStatus;
        });
        setExecuteAllTestCases(true);
        const { passPercentage, passFailRatio } =
          calculation.current.getPassingPercentageForTestCases(testCases);
        setTestCasePassFailStats({
          passPercentage: passPercentage,
          passFailRatio: passFailRatio,
        });
        setTestCases([...testCases]);
        setExecutionResults(nextExecutionResults);
        // execution results for all groups for all test cases
        const populationGroupResults: DetailedPopulationGroupResult[] =
          Object.values(
            nextExecutionResults
          ).flat() as DetailedPopulationGroupResult[];

        const coveragePercentage =
          calculation.current.getCoveragePercentageForGroup(
            measure.groups[0].id,
            populationGroupResults
          );
        setCoveragePercentage(coveragePercentage);
      } catch (error) {
        setError(error.message);
      }
      setExecuting(false);
    } else if (_.isNil(validTestCases) || _.isEmpty(validTestCases)) {
      setError("No valid test cases to execute!");
    }
  };

  return (
    <div tw="mx-6 my-6 shadow-lg rounded-md border border-slate bg-white">
      {!initialLoad && (
        <div tw="flex-auto">
          <div tw="pl-12" data-testid="code-coverage-tabs">
            <CreateCodeCoverageNavTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              executeAllTestCases={executeAllTestCases}
              canEdit={canEdit}
              measure={measure}
              createNewTestCase={createNewTestCase}
              executeTestCases={executeTestCases}
              testCasePassFailStats={testCasePassFailStats}
              coveragePercentage={coveragePercentage}
            />
          </div>
          <CreateNewTestCaseDialog open={createOpen} onClose={handleClose} />
          {error && (
            <ErrorAlert data-testid="display-tests-error" role="alert">
              {error}
            </ErrorAlert>
          )}

          {activeTab === "passing" && (
            <div tw="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div tw="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                {!executing && (
                  <table tw="min-w-full" data-testid="test-case-tbl">
                    <thead>
                      <tr>
                        <TH scope="col" />
                        <TH scope="col">Title</TH>
                        <TH scope="col">Series</TH>
                        <TH scope="col">Status</TH>
                        <TH scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {testCases?.map((testCase) => {
                        return (
                          <TestCaseComponent
                            testCase={testCase}
                            key={testCase.id}
                            canEdit={canEdit}
                            executionResult={executionResults[testCase.id]}
                            // we assume all results have been run here
                          />
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {executing && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <MadieSpinner style={{ height: 50, width: 50 }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "coverage" && (
            <CodeCoverageHighlighting coverageHTML={coverageHTML} />
          )}
        </div>
      )}
      {initialLoad && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MadieSpinner style={{ height: 50, width: 50 }} />
        </div>
      )}
    </div>
  );
};

export default TestCaseList;
