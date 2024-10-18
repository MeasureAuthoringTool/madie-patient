import React, { useEffect, useRef, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import {
  Group,
  TestCase,
  MeasureErrorType,
  TestCaseImportRequest,
  TestCaseImportOutcome,
} from "@madie/madie-models";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import calculationService from "../../../api/CalculationService";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
} from "fqm-execution/build/types/Calculator";
import { ObjectID } from "bson";
import {
  checkUserCanEdit,
  measureStore,
  useFeatureFlags,
} from "@madie/madie-util";
import useExecutionContext from "../../routes/qiCore/useExecutionContext";
import CreateCodeCoverageNavTabs from "./CreateCodeCoverageNavTabs";
import CodeCoverageHighlighting from "../common/CodeCoverageHighlighting";
import CreateNewTestCaseDialog from "../../createTestCase/CreateNewTestCaseDialog";
import {
  MadieDeleteDialog,
  MadieSpinner,
  Pagination,
  Toast,
} from "@madie/madie-design-system/dist/react";
import Typography from "@mui/material/Typography";
import TestCaseImportFromBonnieDialog from "../common/import/TestCaseImportFromBonnieDialog";
import {
  TestCasesPassingDetailsProps,
  TestCaseListProps,
} from "../common/interfaces";
import TestCaseTable from "../common/TestCaseTable/TestCaseTable";
import UseTestCases from "../common/Hooks/UseTestCases";
import UseToast from "../common/Hooks/UseToast";
import getModelFamily from "../../../util/measureModelHelpers";
import FileSaver from "file-saver";
import TestCaseImportDialog from "../common/import/TestCaseImportDialog";
import ActionCenter from "../common/ActionCenter/ActionCenter";

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
  const { setErrors, setWarnings } = props;
  const { measureId, criteriaId } = useParams<{
    measureId: string;
    criteriaId: string;
  }>();
  const {
    testCases,
    setTestCases,
    testCaseService,
    loadingState,
    setLoadingState,
    retrieveTestCases,
    testCasePage,
    sorting,
    setSorting,
  } = UseTestCases({
    measureId,
    setErrors,
  });

  const {
    totalItems,
    visibleItems,
    offset,
    limit,
    count,
    page,
    currentSlice,
    handlePageChange,
    handleLimitChange,
    canGoNext,
    canGoPrev,
  } = testCasePage;

  const {
    toastOpen,
    setToastOpen,
    toastMessage,
    setToastMessage,
    toastType,
    setToastType,
    onToastClose,
  } = UseToast();
  let navigate = useNavigate();
  const { search } = useLocation();
  const values = queryString.parse(search);
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
  const [importFromBonnieDialogState, setImportFromBonnieDialogState] =
    useState<any>({
      open: false,
    });
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);
  const [openDeleteAllTestCasesDialog, setOpenDeleteAllTestCasesDialog] =
    useState<boolean>(false);
  const abortController = useRef(null);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const featureFlags = useFeatureFlags();

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
    if (criteriaId && measure?.groups?.length) {
      const selectedPopCriteria = measure.groups?.find(
        (g) => g.id === criteriaId
      );
      setSelectedPopCriteria(selectedPopCriteria);
    }
    if (!criteriaId && !_.isEmpty(measure?.groups)) {
      setSelectedPopCriteria(measure.groups[0]);
      const newPath = `/measures/${measureId}/edit/test-cases/list-page/${measure.groups[0].id}`;
      // we want to replace the current path to allow the back button to work as intended.
      navigate(newPath, { replace: true });
    }
  }, [criteriaId, measure?.groups]);

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

  const deleteAllTestCases = () => {
    const currentTestCaseIds = _.map(measure.testCases, "id");
    testCaseService.current
      .deleteTestCases(measureId, currentTestCaseIds)
      .then(() => {
        retrieveTestCases();
        setOpenDeleteAllTestCasesDialog(false);
        setToastOpen(true);
        setToastType("success");
        setToastMessage("Test cases successfully deleted");
      })
      .catch((err) => {
        setOpenDeleteAllTestCasesDialog(false);
        setErrors((prevState) => [...prevState, err?.response?.data?.message]);
      });
  };

  const exportTestCase = async (
    selectedTestCase: TestCase,
    bundleType: string
  ) => {
    try {
      abortController.current = new AbortController();
      const { ecqmTitle, model, version } = measure ?? {};
      const exportData = await testCaseService?.current.exportTestCases(
        measure?.id,
        bundleType,
        [selectedTestCase.id],
        abortController.current.signal
      );
      FileSaver.saveAs(
        exportData.data,
        `${ecqmTitle}-v${version}-${getModelFamily(model)}-TestCases.zip`
      );
      setToastOpen(true);
      setToastType("success");
      setToastMessage("Test case exported successfully");
    } catch (err) {
      if (err?.response?.status == 404) {
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          "Test Case(s) are empty or contain errors. Please update your Test Case(s) and export again."
        );
      } else {
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          `Unable to export test cases for ${measure?.measureName}. Please try again and contact the Help Desk if the problem persists.`
        );
      }
    }
  };

  const exportTestCases = async (bundleType: string) => {
    try {
      abortController.current = new AbortController();
      const { ecqmTitle, model, version } = measure ?? {};
      const testCaseIds: string[] = [];
      measure?.testCases?.forEach((testCase) => {
        testCaseIds.push(testCase.id);
      });
      const exportData = await testCaseService?.current.exportTestCases(
        measure?.id,
        bundleType,
        testCaseIds,
        abortController.current.signal
      );
      FileSaver.saveAs(
        exportData.data,
        `${ecqmTitle}-v${version}-${getModelFamily(model)}-TestCases.zip`
      );
      if (exportData.status == 206) {
        setToastOpen(true);
        setToastType("warning");
        setToastMessage(
          "Test Case Export has successfully been generated. Some Test Cases were invalid and could not be exported."
        );
      } else {
        setToastOpen(true);
        setToastType("success");
        setToastMessage("Test cases exported successfully");
      }
    } catch (err) {
      if (err?.response?.status == 404) {
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          "Test Case(s) are empty or contain errors. Please update your Test Case(s) and export again."
        );
      } else {
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          `Unable to export test cases for ${measure?.measureName}. Please try again and contact the Help Desk if the problem persists.`
        );
      }
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
    // request all test cases ->
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
  const onTestCaseImportFromBonnie = async (testCases: TestCase[]) => {
    setImportFromBonnieDialogState({
      ...importFromBonnieDialogState,
      open: false,
    });
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
  const onTestCaseImport = async (
    testCaseImportRequest: TestCaseImportRequest[]
  ) => {
    setWarnings(null);
    setOpenImportDialog(false);
    setLoadingState(() => ({
      loading: true,
      message: "Importing Test Cases...",
    }));
    try {
      const response = await testCaseService.current.importTestCases(
        measureId,
        testCaseImportRequest
      );
      const testCaseImportOutcome: TestCaseImportOutcome[] = response.data;
      const failedImports = testCaseImportOutcome.filter((outcome) => {
        if (outcome.message) return outcome;
      });
      if (failedImports && failedImports.length > 0) {
        setWarnings(testCaseImportOutcome);
      } else {
        const successfulImports =
          testCaseImportOutcome.length - failedImports.length;
        setToastOpen(true);
        setToastType("success");
        setToastMessage(
          `(${successfulImports}) Test cases imported successfully`
        );
      }
    } catch (error) {
      setErrors((prevState) => [...prevState, IMPORT_ERROR]);
    } finally {
      setLoadingState({ loading: false, message: "" });
      const newPath = `/measures/${measureId}/edit/test-cases/list-page/${
        measure.groups[0].id
      }?filter=${values.filter ? values.filter : ""}&search=${
        values.search ? values.search : ""
      }&page=1&limit=${values.limit ? values.limit : 10}`;
      navigate(newPath);
      retrieveTestCases();
    }
  };

  const onTestCaseShiftDates = (testCase: TestCase, shifted: number) => {
    testCaseService.current
      .shiftQiCoreTestCaseDates(measureId, testCase.id, shifted)
      .then(() => {
        setToastOpen(true);
        setToastType("success");
        setToastMessage(
          `Test Case Shift Dates for ${testCase.series} - ${testCase.title} successful.`
        );
      })
      .catch((err) => {
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          `Unable to shift test Case dates with ID ${testCase.id}. Please try again. If the issue continues, please contact helpdesk.`
        );
      });
  };

  const handleQiCloneTestCase = async (testCase: TestCase) => {
    const clonedTestCase = testCase;
    clonedTestCase.title =
      clonedTestCase.title + "-" + new ObjectID().toString();
    try {
      await testCaseService.current.createTestCase(clonedTestCase, measureId);
      setToastOpen(true);
      setToastType("success");
      setToastMessage("Test case cloned successfully");
      retrieveTestCases();
    } catch (error) {
      setToastOpen(true);
      setToastMessage(
        `An error occurred while cloning the test case: ${error.message}`
      );
    }
  };

  return (
    <div>
      {!loadingState.loading && (
        <>
          <Toast
            toastKey="test-case-list-toast"
            toastType={toastType}
            testId={
              toastType === "danger"
                ? `test-case-list-error`
                : `test-case-list-success`
            }
            open={toastOpen}
            message={toastMessage}
            onClose={onToastClose}
            autoHideDuration={6000}
            closeButtonProps={{
              "data-testid": "close-error-button",
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
                onImportTestCasesFromBonnie={() => {
                  setErrors((prevState) => [
                    ...prevState?.filter((e) => e !== IMPORT_ERROR),
                  ]);
                  setImportFromBonnieDialogState({
                    ...importFromBonnieDialogState,
                    open: true,
                  });
                }}
                onImportTestCases={() => {
                  setErrors((prevState) => [
                    ...prevState?.filter((e) => e !== IMPORT_ERROR),
                  ]);
                  setOpenImportDialog(true);
                }}
                testCasePassFailStats={testCasePassFailStats}
                coveragePercentage={coveragePercentage}
                validTestCases={testCases?.filter((tc) => tc.validResource)}
                exportTestCases={exportTestCases}
                onDeleteAllTestCases={() =>
                  setOpenDeleteAllTestCasesDialog(true)
                }
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
                            position: "absolute",
                            zIndex: "-1",
                            overflow: "hidden",
                          }}
                          data-testid="sr-div"
                        >
                          <span
                            style={{
                              fontSize: "1%",
                            }}
                          >
                            {readerString}
                          </span>
                        </div>
                      )}
                      {featureFlags.TestCaseListSearch && <ActionCenter />}
                      <TestCaseTable
                        sorting={sorting}
                        setSorting={setSorting}
                        // test cases doesn't know how to sort by category
                        testCases={currentSlice}
                        canEdit={canEdit}
                        deleteTestCase={deleteTestCase}
                        exportTestCase={exportTestCase}
                        measure={measure}
                        onTestCaseShiftDates={onTestCaseShiftDates}
                        handleQiCloneTestCase={handleQiCloneTestCase}
                      />
                      {currentSlice?.length > 0 && (
                        <Pagination
                          totalItems={totalItems}
                          visibleItems={visibleItems}
                          limitOptions={[10, 25, 50]}
                          offset={offset}
                          handlePageChange={handlePageChange}
                          handleLimitChange={handleLimitChange}
                          page={page}
                          limit={limit}
                          count={count}
                          shape="rounded"
                          hideNextButton={!canGoNext}
                          hidePrevButton={!canGoPrev}
                        />
                      )}
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
      <MadieDeleteDialog
        open={openDeleteAllTestCasesDialog}
        onContinue={() => {
          deleteAllTestCases();
        }}
        onClose={() => {
          setOpenDeleteAllTestCasesDialog(false);
        }}
        dialogTitle="Delete All Test Cases"
        name="All Test Cases"
      />
      {openImportDialog && (
        <TestCaseImportDialog
          dialogOpen={openImportDialog}
          onImport={onTestCaseImport}
          handleClose={() => setOpenImportDialog(false)}
        />
      )}
      <TestCaseImportFromBonnieDialog
        openDialog={importFromBonnieDialogState.open}
        onImport={onTestCaseImportFromBonnie}
        handleClose={() =>
          setImportFromBonnieDialogState({
            ...importFromBonnieDialogState,
            open: false,
          })
        }
      />
    </div>
  );
};

export default TestCaseList;
