import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import tw from "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import { Group, TestCase, MeasureErrorType } from "@madie/madie-models";
import { useParams } from "react-router-dom";
import TestCaseComponent from "./TestCase";
import calculationService from "../../api/CalculationService";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
} from "fqm-execution/build/types/Calculator";
import { checkUserCanEdit } from "@madie/madie-util";
import useExecutionContext from "../routes/useExecutionContext";
import CreateCodeCoverageNavTabs from "./CreateCodeCoverageNavTabs";
import CodeCoverageHighlighting from "./CodeCoverageHighlighting";
import CreateNewTestCaseDialog from "../createTestCase/CreateNewTestCaseDialog";
import { MadieSpinner, Toast } from "@madie/madie-design-system/dist/react";
import TestCaseListSideBarNav from "./TestCaseListSideBarNav";
import Typography from "@mui/material/Typography";
import TestCaseImportDialog from "./import/TestCaseImportDialog";

const TH = tw.th`p-3 border-b text-left text-sm font-bold capitalize`;

export const IMPORT_ERROR =
  "An error occurred while importing your test cases. Please try again, or reach out to the Help Desk.";

export const coverageHeaderRegex =
  /<h2> .* Clause Coverage: (\d*\.\d+|\d*|NaN)%<\/h2>/i;

export const removeHtmlCoverageHeader = (
  coverageHtml: Record<string, string>
): Record<string, string> => {
  const groupCoverage: Record<string, string> = {};
  for (const groupId in coverageHtml) {
    groupCoverage[groupId] = coverageHtml[groupId]?.replace(
      coverageHeaderRegex,
      ""
    );
  }
  return groupCoverage;
};

export const getCoverageValueFromHtml = (
  coverageHtml: Record<string, string>,
  groupId: string
): number => {
  const coverageValue = parseInt(
    coverageHtml[groupId]?.match(coverageHeaderRegex)[1]
  );
  return isNaN(coverageValue) ? 0 : coverageValue;
};

export interface TestCasesPassingDetailsProps {
  passPercentage: number;
  passFailRatio: string;
}

export interface TestCaseListProps {
  errors: Array<string>;
  setErrors: Dispatch<SetStateAction<Array<string>>>;
}

const TestCaseList = (props: TestCaseListProps) => {
  const [testCases, setTestCases] = useState<TestCase[]>(null);
  const [executionResults, setExecutionResults] = useState<{
    [key: string]: DetailedPopulationGroupResult[];
  }>({});

  const { setErrors } = props;
  const { measureId } = useParams<{ measureId: string }>();
  const testCaseService = useRef(useTestCaseServiceApi());
  const calculation = useRef(calculationService());
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("passing");
  const [calculationOutput, setCalculationOutput] =
    useState<CalculationOutput<any>>();
  const [executeAllTestCases, setExecuteAllTestCases] =
    useState<boolean>(false);
  const [coverageHTML, setCoverageHTML] = useState<Record<string, string>>();
  const [coveragePercentage, setCoveragePercentage] = useState<number>(0);
  const [testCasePassFailStats, setTestCasePassFailStats] =
    useState<TestCasesPassingDetailsProps>({
      passPercentage: undefined,
      passFailRatio: "",
    });
  const { measureState, bundleState, valueSetsState, executing, setExecuting } =
    useExecutionContext();
  const [measure] = measureState;
  const [measureBundle] = bundleState;
  const [valueSets] = valueSetsState;
  const [selectedPopCriteria, setSelectedPopCriteria] = useState<Group>();
  const [loadingState, setLoadingState] = useState<any>({
    loading: true,
    message: "",
  });
  const [importDialogState, setImportDialogState] = useState<any>({
    open: false,
  });

  const [createOpen, setCreateOpen] = useState<boolean>(false);

  // toast utilities
  // toast is only used for success messages
  // creating and updating PC
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastType("danger");
    setToastMessage("");
    setToastOpen(false);
  };
  const handleToast = (type, message, open) => {
    setToastType(type);
    setToastMessage(message);
    setToastOpen(open);
  };

  useEffect(() => {
    if (
      !_.isNil(measure?.groups) &&
      measure.groups.length > 0 &&
      (_.isNil(selectedPopCriteria) ||
        _.isNil(measure.groups?.find((g) => g.id === selectedPopCriteria.id)))
    ) {
      setSelectedPopCriteria(measure.groups[0]);
      if (
        measure?.errors?.length > 0 &&
        (measure.errors.includes(
          MeasureErrorType.MISMATCH_CQL_SUPPLEMENTAL_DATA
        ) ||
          measure.errors.includes(
            MeasureErrorType.MISMATCH_CQL_RISK_ADJUSTMENT
          ))
      ) {
        setToastOpen(true);
        setToastMessage(
          "Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved."
        );
      }
    }
  }, [measure]);

  useEffect(() => {
    setCanEdit(
      checkUserCanEdit(
        measure?.createdBy,
        measure?.acls,
        measure?.measureMetaData?.draft
      )
    );
  }, [measure]);

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
        });
        setTestCases(testCaseList);
      })
      .catch((err) => {
        setErrors((prevState) => [...prevState, err.message]);
      })
      .finally(() => {
        setLoadingState({ loading: false, message: "" });
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

  useEffect(() => {
    const validTestCases = testCases?.filter((tc) => tc.validResource);
    if (validTestCases && calculationOutput?.results) {
      // Pull Clause Coverage from coverage HTML
      setCoveragePercentage(
        getCoverageValueFromHtml(
          calculationOutput["groupClauseCoverageHTML"],
          selectedPopCriteria.id
        )
      );
      setCoverageHTML(
        removeHtmlCoverageHeader(calculationOutput["groupClauseCoverageHTML"])
      );
      const executionResults = calculationOutput.results;
      const nextExecutionResults = {};
      validTestCases.forEach((testCase, i) => {
        const detailedResults = executionResults.find(
          (result) => result.patientId === testCase.id
        )?.detailedResults;
        nextExecutionResults[testCase.id] = detailedResults;

        const processedTC = calculationService().processTestCaseResults(
          testCase,
          [selectedPopCriteria],
          detailedResults as DetailedPopulationGroupResult[]
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
    }
  }, [calculationOutput, selectedPopCriteria]);

  const createNewTestCase = () => {
    setCreateOpen(true);
    setExecuteAllTestCases(false);
  };

  const deleteTestCase = (testCaseId) => {
    testCaseService.current
      .deleteTestCaseByTestCaseId(measureId, testCaseId)
      .then(() => {
        retrieveTestCases();
      })
      .catch((err) => {
        console.error(
          "deleteTestCaseByTestCaseId: err.message = " + err.message
        );
        setErrors((prevState) => [...prevState, err.message]);
      });
  };

  const handleClose = () => {
    setCreateOpen(false);
  };

  const executeTestCases = async () => {
    if (measure && measure.cqlErrors) {
      console.error(
        "executeTestCases: Cannot execute test cases while errors exist in the measure CQL! "
      );
      setErrors((prevState) => [
        ...prevState,
        "Cannot execute test cases while errors exist in the measure CQL!",
      ]);
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
        setCalculationOutput(calculationOutput);
      } catch (error) {
        console.error("calculateTestCases: error.message = " + error.message);
        setErrors((prevState) => [...prevState, error.message]);
      }
      setExecuting(false);
    } else if (_.isNil(validTestCases) || _.isEmpty(validTestCases)) {
      console.error("calculateTestCases: No valid test cases to execute");
      setErrors((prevState) => [
        ...prevState,
        "calculateTestCases: No valid test cases to execute",
      ]);
    }
  };
  // Test case 2 "test case name" has a status of "status".
  const generateSRString = (testCaseList) => {
    let string = "";
    if (testCases) {
      testCaseList.forEach((testCase, i) => {
        string += `test case ${i + 1} ${testCase.title} has a status of ${
          testCase.executionStatus
        }. `;
      });
    }
    return string;
  };
  const readerString = generateSRString(testCases);
  const executionResultLength = Object.keys(executionResults).length;

  const onTestCaseImport = async (testCases: TestCase[]) => {
    setImportDialogState({ ...importDialogState, open: false });
    setLoadingState(() => ({
      loading: true,
      message: "Importing Test Cases...",
    }));

    try {
      await testCaseService.current.createTestCases(measureId, testCases);
      retrieveTestCases();
    } catch (error) {
      setErrors((prevState) => [...prevState, IMPORT_ERROR]);
    } finally {
      setLoadingState({ loading: false, message: "" });
    }
  };

  return (
    <div
      tw="grid lg:grid-cols-6 gap-4 mx-8 my-6 shadow-lg rounded-md border border-slate bg-white"
      style={{ marginTop: 16 }}
    >
      {!loadingState.loading && (
        <>
          <Toast
            toastKey="population-criteria-toast"
            toastType={toastType}
            testId={
              toastType === "danger"
                ? `population-criteria-error`
                : `population-criteria-success`
            }
            open={toastOpen}
            message={toastMessage}
            onClose={onToastClose}
            autoHideDuration={6000}
            closeButtonProps={{
              "data-testid": "close-error-button",
            }}
          />
          <TestCaseListSideBarNav
            allPopulationCriteria={measure?.groups}
            selectedPopulationCriteria={selectedPopCriteria}
            onChange={(populationCriteria) => {
              setSelectedPopCriteria(populationCriteria);
            }}
          />
          <div tw="lg:col-span-5 pl-2 pr-2">
            <div data-testid="code-coverage-tabs">
              <CreateCodeCoverageNavTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                executeAllTestCases={executeAllTestCases}
                canEdit={canEdit}
                measure={measure}
                createNewTestCase={createNewTestCase}
                executeTestCases={executeTestCases}
                onImportTestCases={() => {
                  setErrors((prevState) => [
                    ...prevState?.filter((e) => e !== IMPORT_ERROR),
                  ]);
                  setImportDialogState({ ...importDialogState, open: true });
                }}
                testCasePassFailStats={testCasePassFailStats}
                coveragePercentage={coveragePercentage}
                validTestCases={testCases?.filter((tc) => tc.validResource)}
              />
            </div>
            <CreateNewTestCaseDialog open={createOpen} onClose={handleClose} />
            {activeTab === "passing" && (
              <div tw="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div tw="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  {!executing && (
                    <>
                      {executionResultLength > 0 && (
                        <div
                          role="alert"
                          style={{
                            width: "1px",
                            position: "absolute",
                            zIndex: "-1",
                            overflow: "hidden",
                          }}
                          data-testid="sr-div"
                        >
                          <span>{readerString}</span>
                        </div>
                      )}
                      <table
                        tw="min-w-full"
                        data-testid="test-case-tbl"
                        className="tcl-table"
                        style={{
                          borderTop: "solid 1px #DDD",
                          borderSpacing: "0 2em !important",
                        }}
                      >
                        <thead tw="bg-slate">
                          <tr>
                            <TH scope="col">Status</TH>
                            <TH scope="col">Group</TH>
                            <TH scope="col">Title</TH>
                            <TH scope="col">Description</TH>
                            <TH scope="col">Action</TH>
                          </tr>
                        </thead>
                        <tbody className="table-body" style={{ padding: 20 }}>
                          {testCases?.map((testCase) => {
                            return (
                              <TestCaseComponent
                                testCase={testCase}
                                key={testCase.id}
                                canEdit={canEdit}
                                executionResult={executionResults[testCase.id]}
                                deleteTestCase={deleteTestCase}
                                // we assume all results have been run here
                              />
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}
                  {executing && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <MadieSpinner style={{ height: 50, width: 50 }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "coverage" && coverageHTML && (
              <CodeCoverageHighlighting
                coverageHTML={coverageHTML[selectedPopCriteria.id]}
              />
            )}
          </div>
        </>
      )}
      {loadingState.loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MadieSpinner style={{ height: 50, width: 50 }} />
          <Typography color="inherit">{loadingState.message}</Typography>
        </div>
      )}
      <TestCaseImportDialog
        open={importDialogState.open}
        onImport={onTestCaseImport}
        handleClose={() =>
          setImportDialogState({ ...importDialogState, open: false })
        }
      />
    </div>
  );
};

export default TestCaseList;
