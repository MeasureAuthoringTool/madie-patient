import React, { useCallback, useEffect, useRef, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import { uniqWith } from "lodash";
import {
  Group,
  GroupedStratificationDto,
  MeasureErrorType,
  PopulationDto,
  TestCase,
  TestCaseExcelExportDto,
  TestCaseImportOutcome,
  TestCaseImportRequest,
} from "@madie/madie-models";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import calculationService from "../../../api/CalculationService";
import {
  checkUserCanEdit,
  measureStore,
  useFeatureFlags,
} from "@madie/madie-util";
import CreateCodeCoverageNavTabs from "./CreateCodeCoverageNavTabs";
import CreateNewTestCaseDialog from "../../createTestCase/CreateNewTestCaseDialog";
import {
  MadieDeleteDialog,
  MadieSpinner,
  Pagination,
  Toast,
} from "@madie/madie-design-system/dist/react";
import Typography from "@mui/material/Typography";
import {
  TestCaseListProps,
  TestCasesPassingDetailsProps,
} from "../common/interfaces";
import TestCaseTable from "../common/TestCaseTable/TestCaseTable";
import UseTestCases from "../common/Hooks/UseTestCases";
import UseToast from "../common/Hooks/UseToast";
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";
import qdmCalculationService, {
  CqmExecutionResultsByPatient,
} from "../../../api/QdmCalculationService";
import TestCaseImportFromBonnieDialogQDM from "../common/import/TestCaseImportFromBonnieDialogQDM";
import TestCaseCoverage from "./TestCaseCoverage/TestCaseCoverage";
import { QDMPatient } from "cqm-models";
import { cloneTestCase } from "../../../util/QdmTestCaseHelper";
import {
  buildHighlightingForAllGroups,
  GroupCoverageResult,
} from "../../../util/cqlCoverageBuilder/CqlCoverageBuilder";
import { checkSpecialCharactersForExport } from "../../../util/checkSpecialCharacters";
import {
  createExcelExportDtosForAllTestCases,
  populatePopulationDtos,
  populateStratificationDtos,
} from "../../../util/TestCaseExcelExportUtil";
import { CqlDefinitionCallstack } from "../../editTestCase/groupCoverage/QiCoreGroupCoverage";
import useExcelExportService from "../../../api/useExcelExportService";
import FileSaver from "file-saver";
import { AxiosError, AxiosResponse } from "axios";
import ExportModal from "./ExportModal";
import {
  QrdaTestCaseDTO,
  QrdaGroupExportDTO,
} from "../../../api/useTestCaseServiceApi";

import useQdmCqlParsingService from "../../../api/cqlElmTranslationService/useQdmCqlParsingService";
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
    coverageHtml?.[groupId]?.match(coverageHeaderRegex)[1]
  );
  return isNaN(coverageValue) ? 0 : coverageValue;
};

const TestCaseList = (props: TestCaseListProps) => {
  let navigate = useNavigate();
  const { search } = useLocation();
  const values = queryString.parse(search);
  const { setErrors, setImportErrors, setWarnings } = props;
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
  // UseTestCases handles all the pagination and navigation independent of where we're at
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
  const excelExportService = useRef(useExcelExportService());
  const { updateMeasure } = measureStore;
  const calculation = useRef(calculationService());
  const qdmCalculation = useRef(qdmCalculationService());
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("passing");
  const [calculationOutput, setCalculationOutput] =
    useState<CqmExecutionResultsByPatient>();
  const [executeAllTestCases, setExecuteAllTestCases] =
    useState<boolean>(false);
  const [coveragePercentage, setCoveragePercentage] = useState<string>("-");
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
  const [exportExecuting, setExportExecuting] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const featureFlags = useFeatureFlags();
  const qdmCqlParsingService = useRef(useQdmCqlParsingService());

  // const [callstackMap, setCallstackMap] = useState<CqlDefinitionCallstack>();
  // callStackMap is used for generating Excel Export
  useEffect(() => {}, [measure?.cql]);

  const [groupCoverageResult, setGroupCoverageResult] = useState([]);
  useState<GroupCoverageResult>();
  const [createOpen, setCreateOpen] = useState<boolean>(false);
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
    if (!criteriaId && measure?.groups) {
      setSelectedPopCriteria(measure.groups[0]);
      const newPath = `/measures/${measureId}/edit/test-cases/list-page/${measure.groups[0]?.id}`;
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
    if (!_.isNil(measureId) && testCaseService) {
      retrieveTestCases();
    }
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
      // calculation output only contains valid testcases already.
      const highlightingForAllGroups = buildHighlightingForAllGroups(
        calculationOutput,
        cqmMeasure
      );
      setGroupCoverageResult(highlightingForAllGroups);
      validTestCases.forEach((testCase) => {
        const patient: QDMPatient = JSON.parse(testCase.json);
        const patientResults = executionResults[patient._id];
        const testCaseWithResults =
          qdmCalculation.current.processTestCaseResults(
            testCase,
            [selectedPopCriteria],
            measure,
            patientResults
          );
        testCase.groupPopulations = testCaseWithResults.groupPopulations;
        testCase.executionStatus = testCaseWithResults.executionStatus;
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
    setCoveragePercentage(clauseCoverageProcessor());
  }, [calculationOutput, selectedPopCriteria]);

  const clauseCoverageProcessor = (measureGroup?: Group): string => {
    //generates populations' coverage %
    if (!calculationOutput) {
      return;
    }
    const group = measureGroup ?? selectedPopCriteria;
    if (!group) {
      return;
    }
    let allClauses = [];
    let relevantStatements;
    const patientIDs = Object.keys(calculationOutput);
    patientIDs.forEach((patientID) => {
      let newClauseResults = [];
      const clauseResults =
        calculationOutput[patientID][group.id]?.clause_results;
      if (clauseResults) {
        newClauseResults = Object.values(
          calculationOutput[patientID][group.id]?.clause_results
        )?.flatMap(Object.values);
      }
      // we only need one copy of relevantStatements from the first group to match against
      if (!relevantStatements) {
        const statementResults =
          calculationOutput[patientID][group.id]?.statement_results;
        if (statementResults) {
          relevantStatements = Object.values(
            calculationOutput[patientID][group.id]?.statement_results
          )?.flatMap(Object.values);
        }
      }
      allClauses = [...allClauses, ...newClauseResults];
    });
    // get a list of used statements
    relevantStatements = relevantStatements.filter((s) => s.relevance !== "NA");
    const allRelevantClauses = allClauses
      .filter((c) =>
        relevantStatements.some(
          (s) =>
            s.statementName === c.statementName &&
            s.libraryName === c.libraryName
        )
      )
      .filter((result) => result.final !== "NA");
    // get a list of all unique used clauses
    const allUniqueClauses = uniqWith(
      allRelevantClauses,
      (c1, c2) => c1.libraryName === c2.libraryName && c1.localId === c2.localId
    ).sort((a, b) => a.localId - b.localId);
    // get a list of all unique covered clauses
    const coveredClauses = uniqWith(
      allRelevantClauses.filter((clause) => clause.final === "TRUE"),
      (c1, c2) => c1.libraryName === c2.libraryName && c1.localId === c2.localId
    );
    // set onto window for any environment debug purposes
    if (localStorage.getItem("madieDebug") || (window as any).madieDebug) {
      // eslint-disable-next-line no-console
      console.log("coveredClauses: ", _.cloneDeep(coveredClauses));
      // eslint-disable-next-line no-console
      console.log("allUniqueClauses: ", _.cloneDeep(allUniqueClauses));
      // eslint-disable-next-line no-console
      console.log(
        "uncoveredClauses: ",
        _.cloneDeep(
          _.pullAllBy(_.cloneDeep(allUniqueClauses), coveredClauses, "localId")
        )
      );
    }
    return Math.floor(
      (coveredClauses.length / allUniqueClauses.length) * 100
    ).toString();
  };
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
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          `Unable to Delete test Case with ID ${testCaseId}. Please try again. If the issue continues, please contact helpdesk.`
        );
      });
  };

  const handleCloneTestCase = async (testCase: TestCase) => {
    try {
      const clonedTestCase = cloneTestCase(testCase);
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

  const handleClose = () => {
    setCreateOpen(false);
  };

  const executeTestCases = useCallback(async () => {
    if (measure && measure.cqlErrors) {
      console.error(
        "executeTestCases: Cannot execute test cases while errors exist in the measure CQL! "
      );
      setToastOpen(true);
      setToastType("danger");
      setToastMessage(
        "Cannot execute test cases while errors exist in the measure CQL!"
      );
      return null;
    }

    const validTestCases = testCases?.filter((tc) => tc.validResource);

    if (validTestCases && validTestCases.length > 0 && cqmMeasure) {
      setExecuting(true);
      try {
        // calculation service needs to be changed: currently it is using QI Core calculation service
        const patients = validTestCases.map((tc) => JSON.parse(tc.json));
        const calculationOutput: CqmExecutionResultsByPatient =
          await qdmCalculation.current.calculateQdmTestCases(
            cqmMeasure,
            patients
          );
        setCalculationOutput(calculationOutput);
      } catch (error) {
        console.error("calculateTestCases: error.message = ", error);
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          "Error while executing test cases. Message: " + error.message
        );
      }
      setExecuting(false);
    } else if (_.isNil(validTestCases) || _.isEmpty(validTestCases)) {
      console.error("calculateTestCases: No valid test cases to execute");
      setToastOpen(true);
      setToastType("danger");
      setToastMessage("No valid test cases to execute");
    }
  }, [
    measure,
    testCases,
    cqmMeasure,
    qdmCalculation,
    setExecuting,
    setCalculationOutput,
    setToastOpen,
    setToastType,
    setToastMessage,
  ]);

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
      .catch(() => {
        setOpenDeleteAllTestCasesDialog(false);
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          "Unable to Delete All test Cases. Please try again. If the issue continues, please contact helpdesk."
        );
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
    } catch (error) {
      setToastOpen(true);
      setToastType("danger");
      setToastMessage(IMPORT_ERROR);
    } finally {
      setLoadingState({ loading: false, message: "" });
      const newPath = `/measures/${measureId}/edit/test-cases/list-page/${
        measure.groups[0].id
      }?filter=${values.filter ? values.filter : ""}&search=${
        values.search ? values.search : ""
      }&page=1&limit=${values.limit ? values.limit : 10}`;
      navigate(newPath);
      // always trigger refresh
      retrieveTestCases();
    }
  };

  const exportExcel = async () => {
    if (measure?.cql) {
      setExportExecuting(true);
      setOptionsOpen(false);
      qdmCqlParsingService.current
        .getDefinitionCallstacks(measure.cql)
        .then((callstack: CqlDefinitionCallstack) => {
          const testCaseDtos: TestCaseExcelExportDto[] =
            createExcelExportDtosForAllTestCases(
              measure,
              cqmMeasure,
              calculationOutput,
              callstack
            );
          excelExportService.current
            .generateExcel(testCaseDtos)
            .then((response: AxiosResponse) => {
              const excelData: Blob = response.data;
              var exportBlob = new Blob([excelData], {
                type: "application/vnd.ms-excel",
              });
              const url = window.URL.createObjectURL(exportBlob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `${measure.ecqmTitle}-v${measure.version}-QDM-TestCases.xlsx`
              );
              document.body.appendChild(link);
              link.click();
              setToastOpen(true);
              setToastType("success");
              setToastMessage("Excel exported successfully");
              document.body.removeChild(link);
              setExportExecuting(false);
            })
            .catch((error: AxiosError) => {
              setToastOpen(true);
              setToastType("danger");
              setToastMessage(
                error?.message +
                  ". Please try again. If the issue continues, please contact helpdesk."
              );
              setExportExecuting(false);
            });
        })
        .catch((error) => {
          console.error(
            "Error while Parsing CQL for callStack: err.message = " +
              error.message
          );
          setToastOpen(true);
          setToastType("danger");
          setToastMessage(
            "Error while Parsing CQL for callStack, Please try again. If the issue continues, please contact helpdesk."
          );
          setExportExecuting(false);
        });
    }
  };

  const exportQRDA = async () => {
    const failedTCs = checkSpecialCharactersForExport(testCases);
    if (failedTCs.length) {
      setErrors((prevState) => [...prevState, ...failedTCs]);
      return;
    }
    setExportExecuting(true);
    setOptionsOpen(false);
    const localMeasure = _.cloneDeep(measure);
    const executionResults: CqmExecutionResultsByPatient = calculationOutput;
    const groupExportDTOs: QrdaGroupExportDTO[] = [];
    let groupNumber = 1;
    try {
      // process calculation results for every population criteria
      localMeasure.groups?.forEach((group) => {
        const testCaseDTOs: QrdaTestCaseDTO[] = [];
        localMeasure.testCases.forEach((testCase) => {
          const patient: QDMPatient = JSON.parse(testCase.json);
          const patientResults = executionResults[patient._id];
          const testCaseWithResults =
            qdmCalculation.current.processTestCaseResults(
              testCase,
              [group],
              localMeasure,
              patientResults
            );
          testCase.groupPopulations = testCaseWithResults.groupPopulations;
          testCase.executionStatus = testCaseWithResults.executionStatus;

          const groupPopulation = testCase.groupPopulations?.find(
            (groupPopulation) => {
              return groupPopulation.groupId === group.id;
            }
          );

          let stratNumber = 1;
          const populationDtos: PopulationDto[] =
            populatePopulationDtos(groupPopulation);
          const groupedStratDtos: GroupedStratificationDto[] =
            populateStratificationDtos(
              groupPopulation,
              groupNumber,
              stratNumber,
              testCase.id
            );
          testCaseDTOs.push({
            testCaseId: testCase.id,
            lastName: testCase.series,
            firstName: testCase.title,
            populations: populationDtos,
            stratifications: groupedStratDtos,
          });
        });
        groupExportDTOs.push({
          groupId: group.id,
          groupNumber: groupNumber.toString(),
          coverage: clauseCoverageProcessor(
            localMeasure.groups.find((g) => g.id === group.id)
          ),
          testCaseDTOs,
        });
        groupNumber++;
      });
      const exportData = await testCaseService.current.exportQRDA(measureId, {
        measure: localMeasure,
        groupDTOs: groupExportDTOs,
      });
      FileSaver.saveAs(
        exportData,
        `${localMeasure.ecqmTitle}-v${localMeasure.version}-QDM-TestCases.zip`
      );
      setToastOpen(true);
      setToastType("success");
      setToastMessage("QRDA exported successfully");
    } catch (err) {
      setToastOpen(true);
      setToastType("danger");
      setToastMessage(
        "Unable to Export QRDA. Please try again. If the issue continues, please contact helpdesk."
      );
    }
    setExportExecuting(false);
  };

  const onTestCaseShiftDates = (testCase: TestCase, shifted: number) => {
    testCaseService.current
      .shiftQdmTestCaseDates(testCase, measureId, shifted)
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
                onImportTestCases={() => {
                  setImportErrors((prevState) => [
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
                onExportQRDA={exportQRDA}
                onExportExcel={exportExcel}
                exportExecuting={exportExecuting}
                optionsOpen={optionsOpen}
                setOptionsOpen={setOptionsOpen}
              />
            </div>
            <CreateNewTestCaseDialog
              open={createOpen}
              onClose={handleClose}
              measure={measure}
            />
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
                        testCases={currentSlice}
                        canEdit={canEdit}
                        deleteTestCase={deleteTestCase}
                        exportTestCase={null}
                        onCloneTestCase={handleCloneTestCase}
                        measure={measure}
                        onTestCaseShiftDates={onTestCaseShiftDates}
                      />
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
                    measureGroups={measure.groups}
                    testCases={testCases}
                    measureCql={measure.cql}
                    groupCoverageResult={groupCoverageResult}
                    data-testid="test-case-coverage"
                    populationCriteria={selectedPopCriteria}
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
          <MadieSpinner
            style={{ height: 50, width: 50 }}
            data-testid="testcase-list-loading-spinner"
          />
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

      {exportExecuting && <ExportModal openModal={true}></ExportModal>}
    </div>
  );
};

export default TestCaseList;
