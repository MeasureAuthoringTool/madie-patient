import React, { useEffect, useRef, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import { Group, TestCase, MeasureErrorType } from "@madie/madie-models";
import { useParams } from "react-router-dom";
import calculationService from "../../../api/CalculationService";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
} from "fqm-execution/build/types/Calculator";
import { checkUserCanEdit, measureStore } from "@madie/madie-util";
import useExecutionContext from "../../routes/qiCore/useExecutionContext";
import CreateCodeCoverageNavTabs from "./CreateCodeCoverageNavTabs";
import CodeCoverageHighlighting from "../common/CodeCoverageHighlighting";
import CreateNewTestCaseDialog from "../../createTestCase/CreateNewTestCaseDialog";
import { MadieSpinner, Toast } from "@madie/madie-design-system/dist/react";
import TestCaseListSideBarNav from "../common/TestCaseListSideBarNav";
import Typography from "@mui/material/Typography";
import TestCaseImportDialog from "../common/import/TestCaseImportDialog";
import {
  TestCasesPassingDetailsProps,
  TestCaseListProps,
} from "../common/interfaces";
import TestCaseTable from "../common/TestCaseTable";
import UseTestCases from "../common/Hooks/UseTestCases";
import UseToast from "../common/Hooks/UseToast";
import getModelFamily from "../../../util/measureModelHelpers";
import FileSaver from "file-saver";
import moment from "moment";

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

const TestCaseList = (props: TestCaseListProps) => {
  const { setErrors } = props;
  const { measureId } = useParams<{ measureId: string }>();
  const {
    testCases,
    setTestCases,
    testCaseService,
    loadingState,
    setLoadingState,
    retrieveTestCases,
  } = UseTestCases({
    measureId,
    setErrors,
  });
  const {
    toastOpen,
    setToastOpen,
    toastMessage,
    setToastMessage,
    toastType,
    setToastType,
    onToastClose,
  } = UseToast();

  const [executionResults, setExecutionResults] = useState<{
    [key: string]: DetailedPopulationGroupResult[];
  }>({});

  const calculation = useRef(calculationService());
  const { updateMeasure } = measureStore;
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
  const [importDialogState, setImportDialogState] = useState<any>({
    open: false,
  });
  const abortController = useRef(null);
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (testCases?.length != measure?.testCases?.length) {
      const newMeasure = { ...measure, testCases };
      updateMeasure(newMeasure);
    }
  }, [testCases]);

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
        measure?.measureSet?.owner,
        measure?.measureSet?.acls,
        measure?.measureMetaData?.draft
      )
    );
  }, [measure]);

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

  const exportTestCase = async (selectedTestCase: TestCase) => {
    try {
      abortController.current = new AbortController();
      const { ecqmTitle, model, version } = measure ?? {};
      const exportData = await testCaseService?.current.exportTestCase(
        measure?.id,
        selectedTestCase.id,
        abortController.current.signal
      );
      FileSaver.saveAs(
        exportData,
        `${ecqmTitle}-v${version}-${getModelFamily(model)}-TestCases.zip`
      );
      setToastOpen(true);
      setToastType("success");
      setToastMessage("Test case exported successfully");
    } catch (err) {
      setToastOpen(true);
      setToastType("danger");
      setToastMessage(
        `Unable to export test case ${selectedTestCase?.title}. Please try again and contact the Help Desk if the problem persists.`
      );
    }
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
      const start = Date.now();
      let end;
      try {
        const calculationOutput: CalculationOutput<any> =
          await calculation.current.calculateTestCases(
            measure,
            validTestCases,
            measureBundle,
            valueSets
          );
        if (calculationOutput) {
          end = Date.now();
        }
        const startMoment = moment(start);
        const endMoment = moment(end);
        const diff = endMoment.diff(startMoment);
        const diffDuration = moment.duration(diff);
        console.debug("Minutes:", diffDuration.minutes());
        console.debug("Seconds:", diffDuration.seconds());
        console.debug("Milliseconds:", diffDuration.milliseconds());
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
                      <TestCaseTable
                        testCases={testCases}
                        canEdit={canEdit}
                        executionResults={executionResults}
                        deleteTestCase={deleteTestCase}
                        exportTestCase={exportTestCase}
                      />
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
