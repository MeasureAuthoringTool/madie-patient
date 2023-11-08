import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import EditTestCaseBreadCrumbs from "../EditTestCaseBreadCrumbs";

import tw, { styled } from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "styled-components/macro";
import {
  Group,
  TestCase,
  GroupPopulation,
  HapiOperationOutcome,
  PopulationExpectedValue,
  MeasureErrorType,
} from "@madie/madie-models";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";
import Editor from "../../editor/Editor";
import { TestCaseValidator } from "../../../validators/TestCaseValidator";
import { MadieError, sanitizeUserInput } from "../../../util/Utils";
import TestCaseSeries from "../../createTestCase/TestCaseSeries";
import * as _ from "lodash";
import { Ace } from "ace-builds";
import {
  FHIR_POPULATION_CODES,
  mapExistingTestCasePopulations,
  getPopulationTypesForScoring,
  triggerPopChanges,
} from "../../../util/PopulationsMap";
import calculationService, {
  PopulationEpisodeResult,
} from "../../../api/CalculationService";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
} from "fqm-execution/build/types/Calculator";
import {
  measureStore,
  routeHandlerStore,
  useDocumentTitle,
  checkUserCanEdit,
  useFeatureFlags,
} from "@madie/madie-util";
import useExecutionContext from "../../routes/qiCore/useExecutionContext";
import { MadieEditor } from "@madie/madie-editor";
import CreateTestCaseRightPanelNavTabs from "../../createTestCase/CreateTestCaseRightPanelNavTabs";
import CreateTestCaseLeftPanelNavTabs from "../../createTestCase/CreateTestCaseLeftPanelNavTabs";
import ExpectedActual from "../../createTestCase/RightPanel/ExpectedActual/ExpectedActual";
import "./EditTestCase.scss";
import "allotment/dist/style.css";
import CalculationResults from "./calculationResults/CalculationResults";
import {
  Button,
  TextField,
  MadieAlert,
  MadieSpinner,
  MadieDiscardDialog,
  Toast,
} from "@madie/madie-design-system/dist/react";
import TextArea from "../../createTestCase/TextArea";
import FileUploader from "../../fileUploader/FileUploader";
import { ScanValidationDto } from "../../../api/models/ScanValidationDto";
import { Bundle } from "fhir/r4";
import { Allotment } from "allotment";
import ElementsTab from "./LeftPanel/ElementsTab/ElementsTab";
import { QiCoreResourceProvider } from "../../../util/QiCorePatientProvider";

const TestCaseForm = tw.form`m-3`;
const ValidationErrorsButton = tw.button`
  text-lg
  -translate-y-6
  w-[160px]
  h-[30px]
  origin-bottom-left
  rotate-90
  border-solid
  border-2
  border-gray-500
`;

interface AlertProps {
  status?: "success" | "warning" | "error" | "info" | "meta" | null;
  message?: any;
}

interface navigationParams {
  id: string;
  measureId: string;
}

const styles = {
  success: tw`bg-green-100 text-green-700`,
  warning: tw`bg-yellow-100 text-yellow-700`,
  error: tw`bg-red-100 text-red-700`,
  meta: tw`bg-blue-100 text-black`,
  default: tw`bg-blue-100 text-blue-700`,
};

const Alert = styled.div<AlertProps>(({ status = "default" }) => [
  styles[status],
  tw`rounded-lg p-2 m-2 text-base inline-flex items-center w-11/12`,
]);

const ValidationAlertCard = styled.p<AlertProps>(({ status = "default" }) => [
  tw`text-xs bg-white p-3 rounded-xl mx-3 my-1 break-words`,
  styles[status],
]);

const StyledIcon = styled(FontAwesomeIcon)(
  ({ errorSeverity }: { errorSeverity: string }) => [
    errorSeverity !== "default"
      ? errorSeverity === "error"
        ? tw`text-red-700`
        : tw`text-yellow-700`
      : "",
  ]
);

const testCaseSeriesStyles = {
  border: "1px solid #DDDDDD",
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "3px",
    "& legend": {
      width: 0,
    },
  },
  "& .MuiOutlinedInput-root": {
    padding: 0,
  },
};

/*
For population values...
If testCase is present, then take the population groups off the testCase
If no testCase is present, then show the populations for the measure groups
coming from the loaded measure
 */

export function isEmptyTestCaseJsonString(
  jsonString: string | undefined | null
) {
  try {
    return (
      _.isNil(jsonString) ||
      _.isEmpty(jsonString.trim()) ||
      _.isEmpty(JSON.parse(jsonString))
    );
  } catch (error) {
    return true;
  }
}

export function findEpisodeActualValue(
  populationEpisodeResults: PopulationEpisodeResult[],
  populationValue: PopulationExpectedValue,
  populationDefinition: string
): number {
  const groupEpisodeResult = populationEpisodeResults?.find(
    (popEpResult) =>
      FHIR_POPULATION_CODES[popEpResult.populationType] ===
        populationValue.name && populationDefinition === popEpResult.define
  );
  return _.isNil(groupEpisodeResult) ? 0 : groupEpisodeResult.value;
}

const INITIAL_VALUES = {
  title: "",
  description: "",
  series: "",
  groupPopulations: [],
} as TestCase;

export interface EditTestCaseProps {
  errors: Array<string>;
  setErrors: (value: Array<string>) => void;
}

const EditTestCase = (props: EditTestCaseProps) => {
  useDocumentTitle("MADiE Edit Measure Edit Test Case");
  const navigate = useNavigate();
  const featureFlags = useFeatureFlags();
  const { id, measureId } = useParams<
    keyof navigationParams
  >() as navigationParams;
  // Avoid infinite dependency render. May require additional error handling for timeouts.
  const testCaseService = useRef(useTestCaseServiceApi());
  const calculation = useRef(calculationService());
  const [alert, setAlert] = useState<AlertProps>(null);
  const { errors, setErrors } = props;
  if (!errors) {
    setErrors([]);
  }

  // Toast utilities
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastMessage("");
    setToastOpen(false);
  };

  const showToast = (
    message: string,
    toastType: "success" | "danger" | "warning"
  ) => {
    setToastOpen(true);
    setToastType(toastType);
    setToastMessage(message);
  };

  const [testCase, setTestCase] = useState<TestCase>(null);
  const [editorVal, setEditorVal]: [string, Dispatch<SetStateAction<string>>] =
    useState("Loading...");
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });
  const [editor, setEditor] = useState<Ace.Editor>(null);
  function resizeEditor() {
    // hack to force Ace to resize as it doesn't seem to be responsive
    setTimeout(() => {
      editor?.resize(true);
    }, 500);
  }
  // we need this to fire on initial load because it doesn't know about allotment's client width
  useEffect(() => {
    if (editor) {
      resizeEditor();
    }
  }, [editor]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [populationGroupResults, setPopulationGroupResults] =
    useState<DetailedPopulationGroupResult[]>();
  const [calculationErrors, setCalculationErrors] = useState<AlertProps>();
  const [rightPanelActiveTab, setRightPanelActiveTab] =
    useState<string>("measurecql");
  const [leftPanelActiveTab, setLeftPanelActiveTab] =
    useState<string>("elements");
  const [groupPopulations, setGroupPopulations] = useState<GroupPopulation[]>(
    []
  );

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
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const { updateMeasure } = measureStore;
  const load = useRef(0);
  const canEdit = checkUserCanEdit(
    measure?.measureSet?.owner,
    measure?.measureSet?.acls,
    measure?.measureMetaData?.draft
  );

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES },
    validationSchema: TestCaseValidator,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  //needs to be added to feature flag config once the feature flags are moved to Util
  const testCaseAlertToast = false;

  useEffect(() => {
    if (_.isNil(populationGroupResults) || _.isEmpty(populationGroupResults)) {
      setGroupPopulations(_.cloneDeep(formik.values.groupPopulations));
    } else {
      setGroupPopulations(
        _.cloneDeep(
          calculation.current.processTestCaseResults(
            formik.values,
            measure.groups,
            populationGroupResults
          )?.groupPopulations
        )
      );
    }
  }, [formik.values.groupPopulations, populationGroupResults]);

  const mapMeasureGroup = (group: Group): GroupPopulation => {
    const calculateEpisodes = group.populationBasis === "boolean";
    return {
      groupId: group.id,
      scoring: group.scoring,
      populationBasis: group.populationBasis,
      stratificationValues: group.stratifications
        ?.filter((stratification) => stratification.cqlDefinition)
        ?.map((stratification, index) => ({
          name: `Strata-${index + 1} ${_.startCase(
            stratification.association
          )}`,
          expected: calculateEpisodes ? false : null,
          actual: calculateEpisodes ? false : null,
          id: stratification.id,
          criteriaReference: "",
        })),
      populationValues: getPopulationTypesForScoring(group)?.map(
        (population: PopulationExpectedValue) => ({
          name: population.name,
          expected: calculateEpisodes ? false : null,
          actual: calculateEpisodes ? false : null,
          id: population.id,
          criteriaReference: population.criteriaReference,
        })
      ),
    };
  };

  const mapMeasureGroups = useCallback(
    (measureGroups: Group[]): GroupPopulation[] => {
      return measureGroups.map(mapMeasureGroup);
    },
    []
  );

  const { updateRouteHandlerState } = routeHandlerStore;
  useEffect(() => {
    updateRouteHandlerState({
      canTravel: !formik.dirty && !isJsonModified(),
      pendingRoute: "",
    });
  }, [formik.dirty, editorVal, testCase?.json]);

  const standardizeJson = (testCase) => {
    try {
      if (JSON.parse(testCase.json)) {
        return JSON.stringify(JSON.parse(testCase.json), null, 2);
      }
    } catch (e) {
      return testCase?.json;
    }
  };

  const loadTestCase = () => {
    testCaseService.current
      .getTestCase(id, measureId)
      .then((tc: TestCase) => {
        const nextTc = _.cloneDeep(tc);
        nextTc.json = standardizeJson(nextTc);
        setTestCase(nextTc);
        setEditorVal(nextTc.json ? nextTc.json : "");
        if (measure && measure.groups) {
          nextTc.groupPopulations = measure.groups.map((group) => {
            const existingGroupPop = tc.groupPopulations?.find(
              (gp) => gp.groupId === group.id
            );
            return _.isNil(existingGroupPop)
              ? mapMeasureGroup(group)
              : {
                  ...mapExistingTestCasePopulations(existingGroupPop, group),
                  populationBasis: group?.populationBasis,
                };
          });
        } else {
          nextTc.groupPopulations = [];
        }
        resetForm({ values: _.cloneDeep(nextTc) });
        handleHapiOutcome(nextTc?.hapiOperationOutcome);
      })
      .catch((error) => {
        if (error.toString().includes("404")) {
          navigate("/404");
        }
      });
  };

  useEffect(() => {
    if (!seriesState.loaded) {
      testCaseService.current
        .getTestCaseSeriesForMeasure(measureId)
        .then((existingSeries) =>
          setSeriesState({ loaded: true, series: existingSeries })
        )
        .catch((error) => {
          setAlert(() => ({
            status: "error",
            message: error.message,
          }));
          setErrors([...errors, error.message]);
        });
    }

    if (id && _.isNil(testCase) && measure && load.current === 0) {
      load.current = +1;
      loadTestCase();
    }
  }, [
    id,
    measureId,
    testCaseService,
    setTestCase,
    resetForm,
    measure,
    mapMeasureGroups,
    seriesState.loaded,
  ]);

  const handleSubmit = async (testCase: TestCase) => {
    setAlert(null);
    testCase.title = sanitizeUserInput(testCase.title);
    testCase.description = sanitizeUserInput(testCase.description);
    testCase.series = sanitizeUserInput(testCase.series);

    if (id) {
      return await updateTestCase(testCase);
    }
    await createTestCase(testCase);
  };

  const createTestCase = async (testCase: TestCase) => {
    try {
      testCase.json = editorVal || null;
      const savedTestCase = await testCaseService.current.createTestCase(
        testCase,
        measureId
      );
      setEditorVal(savedTestCase.json);

      handleTestCaseResponse(savedTestCase, "create");
    } catch (error) {
      setAlert(() => ({
        status: "error",
        message: "An error occurred while creating the test case.",
      }));
      setErrors([...errors, "An error occurred while creating the test case."]);
    }
  };

  const updateTestCase = async (testCase: TestCase) => {
    try {
      if (editorVal !== testCase.json) {
        testCase.json = editorVal;
      }
      setValidationErrors(() => []);
      const updatedTestCase = await testCaseService.current.updateTestCase(
        testCase,
        measureId
      );

      const updatedTc = _.cloneDeep(updatedTestCase);
      updatedTc.json = standardizeJson(updatedTc);
      resetForm({
        values: _.cloneDeep(updatedTc),
      });
      setTestCase(_.cloneDeep(updatedTc));
      setEditorVal(updatedTc.json);

      handleTestCaseResponse(updatedTc, "update");
    } catch (error) {
      setAlert(() => {
        if (error instanceof MadieError) {
          return {
            status: "error",
            message: error.message,
          };
        }
        return {
          status: "error",
          message: "An error occurred while updating the test case.",
        };
      });
      setErrors([...errors, "An error occurred while updating the test case."]);
    }
  };

  const calculate = async (e) => {
    e.preventDefault();
    setExecuting(true);
    setErrors([]);
    setPopulationGroupResults(() => undefined);
    if (measure && measure.cqlErrors) {
      setCalculationErrors({
        status: "warning",
        message:
          "Cannot execute test case while errors exist in the measure CQL.",
      });
      return;
    }
    setValidationErrors(() => []);
    let modifiedTestCase = { ...testCase };
    if (isJsonModified()) {
      modifiedTestCase.json = editorVal;
      try {
        // Validate test case JSON prior to execution
        const validationResult =
          await testCaseService.current.validateTestCaseBundle(
            JSON.parse(editorVal)
          );
        const errors = handleHapiOutcome(validationResult);
        if (!_.isNil(errors) && errors.length > 0 && hasErrorSeverity(errors)) {
          setCalculationErrors({
            status: "warning",
            message:
              "Test case execution was aborted due to errors with the test case JSON.",
          });
          return;
        }
      } catch (error) {
        setCalculationErrors({
          status: "error",
          message:
            "Test case execution was aborted because JSON could not be validated. If this error persists, please contact the help desk.",
        });
        return;
      } finally {
        setExecuting(false);
      }
    }

    try {
      const calculationOutput: CalculationOutput<any> =
        await calculation.current.calculateTestCases(
          measure,
          [modifiedTestCase],
          measureBundle,
          valueSets
        );

      const executionResults = calculationOutput.results;
      const validationResult =
        await testCaseService.current.validateTestCaseBundle(
          JSON.parse(editorVal)
        );
      handleHapiOutcome(validationResult);
      setCalculationErrors(undefined);
      setPopulationGroupResults(
        executionResults[0].detailedResults as DetailedPopulationGroupResult[]
      );
    } catch (error) {
      setCalculationErrors({
        status: "error",
        message: error.message,
      });
      setErrors([...errors, error.message]);
    } finally {
      setExecuting(false);
    }
  };

  const discardChanges = () => {
    //To DO: need to optimize it as it is calling the backend
    loadTestCase();
    setDiscardDialogOpen(false);
  };

  function handleTestCaseResponse(
    testCase: TestCase,
    action: "create" | "update"
  ) {
    if (testCase && testCase.id) {
      const validationErrors =
        testCase?.hapiOperationOutcome?.outcomeResponse?.issue;
      if (hasValidHapiOutcome(testCase)) {
        setAlert({
          status: "success",
          message: `Test case ${action}d successfully!`,
        });
      } else {
        const valErrors = validationErrors.map((error) => (
          <li>{error.diagnostics}</li>
        ));
        setAlert({
          status: `${severityOfValidationErrors(validationErrors)}`,
          message: testCaseAlertToast ? (
            <div>
              <h3>
                Changes {action}d successfully but the following{" "}
                {severityOfValidationErrors(validationErrors)}(s) were found
              </h3>
              <ul>{valErrors}</ul>
            </div>
          ) : (
            `Test case updated successfully with ${severityOfValidationErrors(
              validationErrors
            )}s in JSON`
          ),
        });
        handleHapiOutcome(testCase.hapiOperationOutcome);
      }
      updateMeasureStore(action, testCase);
    } else {
      setAlert(() => ({
        status: "error",
        message: `An error occurred - ${action} did not return the expected successful result.`,
      }));
      setErrors([
        ...errors,
        `An error occurred - ${action} did not return the expected successful result.`,
      ]);
    }
  }

  // we need to update measure store with created/updated test case to avoid stale state,
  // otherwise we'll lose testcase updates
  function updateMeasureStore(action: string, testCase: TestCase) {
    const measureCopy = Object.assign({}, measure);
    if (action === "update") {
      // for update action, find and remove stale test case from measure
      measureCopy.testCases = measureCopy.testCases?.filter(
        (tc) => tc.id !== testCase.id
      );
    }
    // add updated test to measure
    if (measureCopy.testCases) {
      measureCopy.testCases.push(testCase);
    } else {
      measureCopy.testCases = [testCase];
    }
    // update measure store
    updateMeasure(measureCopy);
  }

  function isHapiOutcomeIssueCodeInformational(outcome: HapiOperationOutcome) {
    return (
      outcome?.outcomeResponse?.issue.filter(
        (issue) => /^information/.exec(issue.severity) === null
      ).length <= 0
    );
  }

  // TODO: What's the diff between this function and "handleHapiOutcome"?
  // do we need both?
  function hasValidHapiOutcome(testCase: TestCase) {
    return (
      // Consider valid if no hapi outcome. Most likely the editor is empty.
      _.isNil(testCase.hapiOperationOutcome) ||
      ((testCase.hapiOperationOutcome.code === 200 ||
        testCase.hapiOperationOutcome.code === 201) &&
        isHapiOutcomeIssueCodeInformational(testCase?.hapiOperationOutcome))
    );
  }

  function handleHapiOutcome(outcome: HapiOperationOutcome) {
    if (
      _.isNil(outcome) ||
      (outcome.successful !== false &&
        (outcome.code === 200 || outcome.code === 201) &&
        isHapiOutcomeIssueCodeInformational(outcome))
    ) {
      setValidationErrors(() => []);
      return [];
    }
    if (
      outcome.outcomeResponse?.issue?.length > 0 &&
      !isHapiOutcomeIssueCodeInformational(outcome)
    ) {
      const ves = outcome.outcomeResponse.issue.map((issue, index) => ({
        ...issue,
        key: index,
      }));
      setValidationErrors(() => ves);
      return ves;
    } else {
      const error =
        outcome.outcomeResponse?.text ||
        outcome.message ||
        `HAPI FHIR returned error code ${outcome.code} but no discernible error message`;
      const ves = [{ key: 0, diagnostics: error }];
      setValidationErrors(ves);
      return ves;
    }
  }

  function formikErrorHandler(name: string) {
    if (formik.touched[name] && formik.errors[name]) {
      return `${formik.errors[name]}`;
    }
  }

  function isModified() {
    if (testCase) {
      if (
        _.isNil(testCase?.json) &&
        !_.isNil(editorVal) &&
        _.isEmpty(editorVal.trim()) &&
        !formik.dirty
      ) {
        return false;
      } else {
        return (
          formik.isValid &&
          (formik.dirty ||
            editorVal !== testCase?.json ||
            !_.isEqual(
              _.cloneDeep(testCase?.groupPopulations),
              _.cloneDeep(formik.values.groupPopulations)
            ))
        );
      }
    } else {
      return formik.isValid && formik.dirty;
    }
  }

  function isJsonModified() {
    return testCase && (!_.isNil(testCase?.json) || !_.isEmpty(editorVal))
      ? editorVal !== testCase?.json
      : !isEmptyTestCaseJsonString(editorVal);
  }

  const hasErrorSeverity = (validationErrors) => {
    return (
      validationErrors.filter(
        (validationError) => validationError.severity === "error"
      ).length > 0
    );
  };

  const severityOfValidationErrors = (validationErrors) => {
    const errorsWithNoSeverity = validationErrors?.filter(
      (validationError) => !validationError.hasOwnProperty("severity")
    ).length;
    const nonInformationalErrors = validationErrors?.filter(
      (validationError) =>
        /^information/.exec(validationError.severity) === null
    ).length;
    if (nonInformationalErrors > 0) {
      if (hasErrorSeverity(validationErrors) || errorsWithNoSeverity > 0) {
        return "error";
      }
      return "warning";
    }
    if (_.isNil(nonInformationalErrors)) {
      return "error";
    }
    return "info";
  };

  const readTestFileCb = (testCaseBundle: Bundle, errorMessage: string) => {
    if (errorMessage) {
      showToast(errorMessage, "danger");
    } else {
      setEditorVal(JSON.stringify(testCaseBundle, null, "\t"));
      showToast(
        "Test Case JSON copied into editor. QI-Core Defaults have been added. Please review and save your Test Case.",
        "success"
      );
    }
  };
  const updateTestCaseJson = (file) => {
    testCaseService.current
      .scanImportFile(file)
      .then((response: ScanValidationDto) => {
        if (response.valid) {
          testCaseService.current.readTestCaseFile(file, readTestFileCb);
        } else {
          showToast(response.error.defaultMessage, "danger");
        }
      })
      .catch((errors) => {
        showToast(
          "An error occurred while importing the test case, please try again. If the error persists, please contact the help desk.",
          "danger"
        );
      });
  };

  const allotmentRef = useRef(null);

  return (
    <TestCaseForm
      data-testid="create-test-case-form"
      id="edit-test-case-qi-core"
      onSubmit={formik.handleSubmit}
    >
      <EditTestCaseBreadCrumbs testCase={testCase} measureId={measureId} />
      <div className="allotment-wrapper">
        <Allotment
          minSize={10}
          ref={allotmentRef}
          defaultSizes={[200, 200, 10]}
          vertical={false}
          onDragEnd={resizeEditor}
        >
          <Allotment.Pane>
            {featureFlags?.qiCoreElementsTab ? (
              <div className="nav-panel">
                <div className="tab-container">
                  <CreateTestCaseLeftPanelNavTabs
                    leftPanelActiveTab={leftPanelActiveTab}
                    setLeftPanelActiveTab={setLeftPanelActiveTab}
                  />
                </div>

                <QiCoreResourceProvider>
                  {leftPanelActiveTab === "elements" && (
                    <div className="panel-content">
                      <div data-testid="elements-content">
                        <ElementsTab
                          canEdit={canEdit}
                          setEditorVal={setEditorVal}
                          editorVal={editorVal}
                        />
                      </div>
                    </div>
                  )}
                  {leftPanelActiveTab === "json" && (
                    <Editor
                      onChange={(val: string) => setEditorVal(val)}
                      value={editorVal}
                      setEditor={setEditor}
                      readOnly={!canEdit || _.isNil(testCase)}
                      height="100%"
                    />
                  )}
                </QiCoreResourceProvider>
              </div>
            ) : (
              <div className="left-panel">
                <Editor
                  onChange={(val: string) => setEditorVal(val)}
                  value={editorVal}
                  setEditor={setEditor}
                  readOnly={!canEdit || _.isNil(testCase)}
                  height="100%"
                />
              </div>
            )}
          </Allotment.Pane>

          <Allotment.Pane>
            <div className="right-panel">
              <CreateTestCaseRightPanelNavTabs
                rightPanelActiveTab={rightPanelActiveTab}
                setRightPanelActiveTab={setRightPanelActiveTab}
              />
              {rightPanelActiveTab === "measurecql" &&
                (!measure?.cqlErrors ? (
                  <div
                    data-testid="test-case-cql-editor"
                    id="test-case-cql-editor"
                    style={{ height: "calc(100% - 24px)" }}
                  >
                    <MadieEditor
                      value={measure?.cql}
                      height="100%"
                      readOnly={true}
                      validationsEnabled={false}
                    />
                  </div>
                ) : (
                  <div data-testid="test-case-cql-has-errors-message">
                    An error exists with the measure CQL, please review the CQL
                    Editor tab
                  </div>
                ))}
              {rightPanelActiveTab === "highlighting" && (
                <div className="panel-content" style={{ marginRight: "15px" }}>
                  {executing ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <MadieSpinner style={{ height: 50, width: 50 }} />
                    </div>
                  ) : (
                    <CalculationResults
                      calculationResults={populationGroupResults}
                      calculationErrors={calculationErrors}
                      groupPopulations={groupPopulations}
                    />
                  )}
                </div>
              )}
              {rightPanelActiveTab === "expectoractual" && (
                <div className="panel-content">
                  <ExpectedActual
                    canEdit={canEdit}
                    groupPopulations={groupPopulations}
                    executionRun={!_.isNil(populationGroupResults)}
                    errors={formik.errors.groupPopulations}
                    onChange={(
                      groupPopulations,
                      changedGroupId,
                      changedPopulation
                    ) => {
                      const stratOutput = triggerPopChanges(
                        groupPopulations,
                        changedGroupId,
                        changedPopulation,
                        measure?.groups
                      );
                      formik.setFieldValue(
                        "groupPopulations",
                        stratOutput as GroupPopulation[]
                      );
                    }}
                    onStratificationChange={(
                      groupPopulations,
                      changedGroupId,
                      changedStratification
                    ) => {
                      const stratOutput = triggerPopChanges(
                        groupPopulations,
                        changedGroupId,
                        changedStratification,
                        measure?.groups
                      );
                      formik.setFieldValue(
                        "groupPopulations",
                        stratOutput as GroupPopulation[]
                      );
                    }}
                  />
                </div>
              )}
              {/*
            Independent views should be their own components when possible
            This will allow for independent unit testing and help render performance.
           */}

              {rightPanelActiveTab === "details" && (
                <div className="panel-content">
                  {alert &&
                    (testCaseAlertToast ? (
                      <MadieAlert
                        type={alert?.status}
                        content={alert?.message}
                        alertProps={{
                          "data-testid": "create-test-case-alert",
                        }}
                        closeButtonProps={{
                          "data-testid": "close-create-test-case-alert",
                        }}
                      />
                    ) : (
                      <Alert
                        status={alert?.status}
                        role="alert"
                        aria-label="Create Alert"
                        data-testid="create-test-case-alert"
                      >
                        {alert?.message}
                        <button
                          data-testid="close-create-test-case-alert"
                          type="button"
                          tw="box-content h-4 p-1 ml-3 mb-1.5"
                          data-bs-dismiss="alert"
                          aria-label="Close Alert"
                          onClick={() => setAlert(null)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </Alert>
                    ))}

                  {/* TODO Replace with re-usable form component
               label, input, and error => single input control component */}

                  <div tw="flex flex-col flex-wrap p-5 w-9/12">
                    <TextField
                      placeholder="Test Case Title"
                      required
                      disabled={!canEdit}
                      label="Title"
                      id="test-case-title"
                      inputProps={{
                        "data-testid": "test-case-title",
                        "aria-describedby": "title-helper-text",
                        "aria-required": true,
                        required: true,
                      }}
                      helperText={formikErrorHandler("title")}
                      size="small"
                      error={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                      {...formik.getFieldProps("title")}
                    />
                    <div tw="mt-4">
                      <TextArea
                        placeholder="Test Case Description"
                        id="test-case-description"
                        data-testid="edit-test-case-description"
                        disabled={!canEdit}
                        {...formik.getFieldProps("description")}
                        label="Description"
                        required={false}
                        inputProps={{
                          "data-testid": "test-case-description",
                          "aria-describedby": "description-helper-text",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        error={
                          formik.touched.description &&
                          Boolean(formik.errors.description)
                        }
                        helperText={formikErrorHandler("description")}
                      />
                    </div>

                    <div
                      tw="-mt-5"
                      style={{
                        marginTop: 10,
                      }}
                    >
                      <label
                        htmlFor="test-case-series"
                        tw="text-gray-980"
                        style={{
                          fontFamily: "Rubik",
                          fontSize: "14px",
                          textTransform: "capitalize",
                        }}
                      >
                        Group
                      </label>
                      <TestCaseSeries
                        disabled={!canEdit}
                        value={formik.values.series}
                        onChange={(nextValue) =>
                          formik.setFieldValue("series", nextValue)
                        }
                        seriesOptions={seriesState.series}
                        sx={testCaseSeriesStyles}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="validation-panel">
              {showValidationErrors ? (
                <aside
                  tw="w-full h-full flex flex-col"
                  data-testid="open-json-validation-errors-aside"
                >
                  <button
                    data-testid="hide-json-validation-errors-button"
                    onClick={() => {
                      setShowValidationErrors((prevState) => {
                        allotmentRef.current.resize([200, 200, 10]);
                        return !prevState;
                      });
                    }}
                  >
                    <StyledIcon
                      icon={faExclamationCircle}
                      errorSeverity={severityOfValidationErrors(
                        validationErrors
                      )}
                    />
                    Validation Errors
                  </button>

                  <div
                    tw="h-full flex flex-col overflow-y-scroll"
                    data-testid="json-validation-errors-list"
                    className="validation-content"
                  >
                    {validationErrors && validationErrors.length > 0 ? (
                      validationErrors
                        .filter(
                          (error) =>
                            /^information/.exec(error?.severity) === null
                        )
                        .map((error) => {
                          return (
                            <ValidationAlertCard
                              key={error.key}
                              status={
                                error.diagnostics.includes("Meta.profile")
                                  ? "meta"
                                  : error.severity
                                  ? error.severity
                                  : "error"
                              }
                            >
                              {error.diagnostics.includes("Meta.profile")
                                ? "Meta.profile: "
                                : error.severity
                                ? error.severity.charAt(0).toUpperCase() +
                                  error.severity.slice(1) +
                                  ": "
                                : ""}
                              {error.diagnostics}
                            </ValidationAlertCard>
                          );
                        })
                    ) : (
                      <span>Nothing to see here!</span>
                    )}
                  </div>
                </aside>
              ) : (
                <aside
                  tw="h-full w-full"
                  data-testid="closed-json-validation-errors-aside"
                >
                  <ValidationErrorsButton
                    data-testid="show-json-validation-errors-button"
                    onClick={() =>
                      setShowValidationErrors((prevState) => {
                        allotmentRef.current.resize([200, 200, 50]);
                        resizeEditor();
                        return !prevState;
                      })
                    }
                  >
                    <StyledIcon
                      icon={faExclamationCircle}
                      errorSeverity={severityOfValidationErrors(
                        validationErrors
                      )}
                    />
                    Validation Errors
                  </ValidationErrorsButton>
                </aside>
              )}
            </div>
          </Allotment.Pane>
        </Allotment>

        <div tw="bg-gray-75 w-full sticky bottom-0 left-0 z-40">
          <div tw="flex items-center">
            <div tw="w-1/2 flex items-center px-2">
              {canEdit && <FileUploader onFileImport={updateTestCaseJson} />}
            </div>
            <div
              tw="w-1/2 flex justify-end items-center px-10 py-6"
              style={{ alignItems: "end" }}
            >
              <Button
                tw="m-2"
                variant="outline"
                onClick={() => setDiscardDialogOpen(true)}
                data-testid="edit-test-case-discard-button"
                disabled={!isModified()}
              >
                Discard Changes
              </Button>
              <Button
                tw="m-2"
                type="button"
                onClick={calculate}
                disabled={
                  !!measure?.cqlErrors ||
                  measure?.errors?.includes(
                    MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES
                  ) ||
                  _.isNil(measure?.groups) ||
                  measure?.groups.length === 0 ||
                  (!isJsonModified() && hasErrorSeverity(validationErrors)) ||
                  isEmptyTestCaseJsonString(editorVal) ||
                  !executionContextReady ||
                  executing
                }
                /*
                  if new test case
                    enable run button if json modified, regardless of errors
                 */
                data-testid="run-test-case-button"
              >
                Run Test Case
              </Button>
              {canEdit && (
                <Button
                  tw="m-2"
                  variant="cyan"
                  type="submit"
                  data-testid="edit-test-case-save-button"
                  disabled={!isModified()}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <MadieDiscardDialog
        open={discardDialogOpen}
        onClose={() => setDiscardDialogOpen(false)}
        onContinue={discardChanges}
      />
      <Toast
        toastKey="edit-action-toast"
        aria-live="polite"
        toastType={toastType}
        testId={toastType === "danger" ? "error-toast" : "success-toast"}
        closeButtonProps={{
          "data-testid": "close-toast-button",
        }}
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={10000}
      />
    </TestCaseForm>
  );
};

export default EditTestCase;
