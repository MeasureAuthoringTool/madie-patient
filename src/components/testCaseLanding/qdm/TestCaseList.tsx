import React, { useEffect, useRef, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import {
  Group,
  MeasureErrorType,
  TestCase,
  TestCaseImportOutcome,
  TestCaseImportRequest,
} from "@madie/madie-models";
import { useParams } from "react-router-dom";
import calculationService from "../../../api/CalculationService";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { checkUserCanEdit, measureStore } from "@madie/madie-util";
import CreateCodeCoverageNavTabs from "./CreateCodeCoverageNavTabs";
import CreateNewTestCaseDialog from "../../createTestCase/CreateNewTestCaseDialog";
import {
  MadieDeleteDialog,
  MadieSpinner,
  Toast,
} from "@madie/madie-design-system/dist/react";
import TestCaseListSideBarNav from "../common/TestCaseListSideBarNav";
import Typography from "@mui/material/Typography";
import {
  TestCasesPassingDetailsProps,
  TestCaseListProps,
} from "../common/interfaces";
import TestCaseTable from "../common/TestCaseTable";
import UseTestCases from "../common/Hooks/UseTestCases";
import UseToast from "../common/Hooks/UseToast";
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";
import qdmCalculationService, {
  CqmExecutionResultsByPatient,
} from "../../../api/QdmCalculationService";
import TestCaseImportFromBonnieDialogQDM from "../common/import/TestCaseImportFromBonnieDialogQDM";
import TestCaseCoverage from "./TestCaseCoverage/TestCaseCoverage";
import CodeCoverageHighlighting from "../common/CodeCoverageHighlighting";
import { QDMPatient, DataElement } from "cqm-models";
import { cloneTestCase } from "../../../util/QdmTestCaseHelper";

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
    coverageHtml?.[groupId]?.match(coverageHeaderRegex)[1]
  );
  return isNaN(coverageValue) ? 0 : coverageValue;
};

const TestCaseList = (props: TestCaseListProps) => {
  const { errors, setErrors, setWarnings } = props;
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
  const { updateMeasure } = measureStore;
  const calculation = useRef(calculationService());
  const qdmCalculation = useRef(qdmCalculationService());
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("passing");
  const [calculationOutput, setCalculationOutput] =
    useState<CqmExecutionResultsByPatient>();
  const [executeAllTestCases, setExecuteAllTestCases] =
    useState<boolean>(false);
  const [coverageHTML, setCoverageHTML] = useState<Record<string, string>>();
  const [coveragePercentage, setCoveragePercentage] = useState<number>(0);
  const [openDeleteAllTestCasesDialog, setOpenDeleteAllTestCasesDialog] =
    useState<boolean>(false);
  const [testCasePassFailStats, setTestCasePassFailStats] =
    useState<TestCasesPassingDetailsProps>({
      passPercentage: undefined,
      passFailRatio: "",
    });
  const { measureState, cqmMeasureState, executing, setExecuting } =
    useQdmExecutionContext();
  const [measure] = measureState;
  const [cqmMeasure] = cqmMeasureState;
  const [selectedPopCriteria, setSelectedPopCriteria] = useState<Group>();
  const [importDialogState, setImportDialogState] = useState<any>({
    open: false,
  });

  const [createOpen, setCreateOpen] = useState<boolean>(false);

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
    if (testCases?.length != measure?.testCases?.length) {
      const newMeasure = { ...measure, testCases };
      updateMeasure(newMeasure);
    }
  }, [testCases]);

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
    if (validTestCases && calculationOutput) {
      const executionResults: CqmExecutionResultsByPatient = calculationOutput;

      validTestCases.forEach((testCase) => {
        const patient: QDMPatient = JSON.parse(testCase.json);
        const patientResults = executionResults[patient._id];

        const processedTC = qdmCalculation.current.processTestCaseResults(
          testCase,
          [selectedPopCriteria],
          measure,
          patientResults
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

  const handleCloneTestCase = async (testCase: TestCase) => {
    const clonedTestCase = cloneTestCase(testCase);
    await testCaseService.current.createTestCase(clonedTestCase, measureId);
    retrieveTestCases();
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
    if (validTestCases && validTestCases.length > 0 && cqmMeasure) {
      setExecuting(true);
      try {
        // calculation service needs to be changed: currently it is using QI Core calaculation service
        const patients = validTestCases.map((tc) => JSON.parse(tc.json));
        const calculationOutput: CqmExecutionResultsByPatient =
          await qdmCalculation.current.calculateQdmTestCases(
            cqmMeasure,
            patients
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
  const executionResultLength = calculationOutput
    ? Object.keys(calculationOutput).length
    : 0;

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

  const onTestCaseImport = async (testCases: TestCaseImportRequest[]) => {
    setWarnings(null);
    setImportDialogState({ ...importDialogState, open: false });
    setLoadingState(() => ({
      loading: true,
      message: "Importing Test Cases...",
    }));

    try {
      testCases = testCases?.map((testCase) => {
        if (testCase?.json) {
          const json = JSON.parse(testCase.json);
          if (json.qdmPatient) {
            json.qdmPatient = new QDMPatient(json.qdmPatient);
            testCase.json = JSON.stringify(json);
          }
        }
        return testCase;
      });

      const res = await testCaseService.current.importTestCasesQDM(
        measureId,
        testCases
      );
      const testCaseImportOutcome: TestCaseImportOutcome[] = res.data;
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
                selectedPopCriteria={selectedPopCriteria}
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

                      <TestCaseTable
                        testCases={testCases}
                        canEdit={canEdit}
                        executionResults={executionResults}
                        deleteTestCase={deleteTestCase}
                        exportTestCase={null}
                        onCloneTestCase={handleCloneTestCase}
                        measure={measure}
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
            {activeTab === "coverage" && (
              <div tw="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div tw="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <TestCaseCoverage
                    data-testid="test-case-coverage"
                    populationCriteria={selectedPopCriteria}
                    measureCql={measure.cql}
                    calculationOutput={calculationOutput}
                  />
                </div>
              </div>
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
      <TestCaseImportFromBonnieDialogQDM
        openDialog={importDialogState.open}
        onImport={onTestCaseImport}
        handleClose={() =>
          setImportDialogState({ ...importDialogState, open: false })
        }
      />
    </div>
  );
};

export default TestCaseList;
