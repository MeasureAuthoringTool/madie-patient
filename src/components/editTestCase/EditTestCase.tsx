import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, HelperText, Label } from "@madie/madie-components";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
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
  DisplayGroupPopulation,
  HapiOperationOutcome,
  Population,
  PopulationExpectedValue,
} from "@madie/madie-models";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import Editor from "../editor/Editor";
import { TestCaseValidator } from "../../validators/TestCaseValidator";
import { sanitizeUserInput } from "../../util/Utils.js";
import TestCaseSeries from "../createTestCase/TestCaseSeries";
import * as _ from "lodash";
import { Ace } from "ace-builds";
import {
  FHIR_POPULATION_CODES,
  getPopulationTypesForScoring,
  triggerPopChanges,
} from "../../util/PopulationsMap";
import calculationService, {
  GroupPopulationEpisodeResultMap,
  GroupStatementResultMap,
  PopulationEpisodeResult,
} from "../../api/CalculationService";
import {
  DetailedPopulationGroupResult,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import {
  measureStore,
  routeHandlerStore,
  useOktaTokens,
} from "@madie/madie-util";
import useExecutionContext from "../routes/useExecutionContext";
import { MadieEditor } from "@madie/madie-editor";
import CreateTestCaseNavTabs from "../createTestCase/CreateTestCaseNavTabs";
import ExpectedActual from "../createTestCase/RightPanel/ExpectedActual/ExpectedActual";
import "./EditTestCase.scss";
import CalculationResults from "../createTestCase/calculationResults/CalculationResults";

const FormControl = tw.div`mb-3`;
const FormErrors = tw.div`h-6`;
const TestCaseForm = tw.form`m-3`;

const TestCaseDescription = tw.textarea`
  min-w-full
  resize
  h-24
  rounded-md
  sm:text-sm
`;
const TestCaseTitle = tw.input`
  min-w-full
  rounded
  sm:text-sm
`;

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
  status?: "success" | "warning" | "error" | null;
  message?: string;
}

interface navigationParams {
  id: string;
  measureId: string;
}

const styles = {
  success: tw`bg-green-100 text-green-700`,
  warning: tw`bg-yellow-100 text-yellow-700`,
  error: tw`bg-red-100 text-red-700`,
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

const StyledIcon = styled(FontAwesomeIcon)(({ errors }: { errors: number }) => [
  errors > 0 ? tw`text-red-700` : "",
]);

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

const EditTestCase = () => {
  const navigate = useNavigate();
  const { id, measureId } = useParams<
    keyof navigationParams
  >() as navigationParams;
  // Avoid infinite dependency render. May require additional error handling for timeouts.
  const testCaseService = useRef(useTestCaseServiceApi());
  const calculation = useRef(calculationService());
  const [alert, setAlert] = useState<AlertProps>(null);
  const [testCase, setTestCase] = useState<TestCase>(null);
  const [editorVal, setEditorVal]: [string, Dispatch<SetStateAction<string>>] =
    useState("");
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });
  const { getUserName } = useOktaTokens();
  const userName = getUserName();
  const [editor, setEditor] = useState<Ace.Editor>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [populationGroupResults, setPopulationGroupResults] =
    useState<DetailedPopulationGroupResult[]>();
  const [groupStatementResults, setGroupStatementResults] = useState<any>();
  const [groupEpisodeResults, setGroupEpisodeResults] =
    useState<GroupPopulationEpisodeResultMap>();
  const [calculationErrors, setCalculationErrors] = useState<AlertProps>();
  const [createButtonDisabled, setCreateButtonDisabled] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("measurecql");

  const { measureState, bundleState, valueSetsState } = useExecutionContext();
  const [measure] = measureState;
  const [measureBundle] = bundleState;
  const [valueSets] = valueSetsState;
  const { updateMeasure } = measureStore;

  const [canEdit, setCanEdit] = useState<boolean>(
    measure?.createdBy === userName ||
      measure?.acls?.some(
        (acl) =>
          acl.userId === userName && acl.roles.indexOf("SHARED_WITH") >= 0
      )
  );

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES },
    validationSchema: TestCaseValidator,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  const mapMeasureGroup = (group: Group): GroupPopulation => {
    const calculateEpisodes = group.populationBasis === "Boolean";
    return {
      groupId: group.id,
      scoring: group.scoring,
      populationBasis: group.populationBasis,
      stratificationValues: group.stratifications?.map(
        (stratification, index) => ({
          name: `Strata-${index + 1} ${_.startCase(
            stratification.association
          )}`,
          expected: calculateEpisodes ? false : null,
          actual: calculateEpisodes ? false : null,
          id: stratification.id,
          criteriaReference: "",
        })
      ),
      populationValues: getPopulationTypesForScoring(group)?.map(
        (population) => ({
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
      canTravel: !formik.dirty,
      pendingRoute: "",
    });
  }, [formik.dirty]);

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
        });
    }
    if (id) {
      const updateTestCase = () => {
        testCaseService.current
          .getTestCase(id, measureId)
          .then((tc: TestCase) => {
            setTestCase(_.cloneDeep(tc));
            setEditorVal(tc.json);
            setCanEdit(
              measure?.createdBy === userName ||
                measure?.acls?.some(
                  (acl) =>
                    acl.userId === userName &&
                    acl.roles.indexOf("SHARED_WITH") >= 0
                )
            );
            const nextTc = _.cloneDeep(tc);
            if (measure && measure.groups) {
              nextTc.groupPopulations = measure.groups.map((group) => {
                const existingGroupPop = tc.groupPopulations?.find(
                  (gp) => gp.groupId === group.id
                );
                return _.isNil(existingGroupPop)
                  ? mapMeasureGroup(group)
                  : {
                      ...existingGroupPop,
                      populationBasis: group?.populationBasis,
                    };
              });
            } else {
              nextTc.groupPopulations = [];
            }
            resetForm({ values: nextTc });
            handleHapiOutcome(tc?.hapiOperationOutcome);
          })
          .catch((error) => {
            if (error.toString().includes("404")) {
              navigate("/404");
            }
          });
      };
      updateTestCase();
      return () => {
        setTestCase(null);
        resetForm();
      };
    } else if (measure && measure.groups) {
      setCanEdit(
        measure?.createdBy === userName ||
          measure?.acls?.some(
            (acl) =>
              acl.userId === userName && acl.roles.indexOf("SHARED_WITH") >= 0
          )
      );
      resetForm({
        values: {
          ...INITIAL_VALUES,
          groupPopulations: mapMeasureGroups(measure.groups),
        },
      });
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
      setCreateButtonDisabled(true);
      setEditorVal(savedTestCase.json);

      handleTestCaseResponse(savedTestCase, "create");
    } catch (error) {
      setAlert(() => ({
        status: "error",
        message: "An error occurred while creating the test case.",
      }));
    }
  };

  const updateTestCase = async (testCase: TestCase) => {
    try {
      if (editorVal !== testCase.json) {
        testCase.json = editorVal;
      }
      const updatedTestCase = await testCaseService.current.updateTestCase(
        testCase,
        measureId
      );

      resetForm({
        values: { ...testCase },
      });
      setTestCase(updatedTestCase);
      setEditorVal(updatedTestCase.json);

      handleTestCaseResponse(updatedTestCase, "update");
    } catch (error) {
      setAlert(() => ({
        status: "error",
        message: "An error occurred while updating the test case.",
      }));
    }
  };

  const calculate = async (e) => {
    e.preventDefault();
    setPopulationGroupResults(() => undefined);
    setGroupStatementResults(() => undefined);
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
        if (!_.isNil(errors) && errors.length > 0) {
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
      }
    }

    try {
      const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] =
        await calculation.current.calculateTestCases(
          measure,
          [modifiedTestCase],
          measureBundle,
          valueSets
        );
      const output = calculation.current.processRawResults(executionResults);
      const episodeResults =
        calculation.current.processEpisodeResults(executionResults);
      setCalculationErrors(undefined);
      setGroupStatementResults(output?.[testCase.id]);
      setGroupEpisodeResults(episodeResults?.[testCase.id]);
      setPopulationGroupResults(executionResults[0].detailedResults);
    } catch (error) {
      setCalculationErrors({
        status: "error",
        message: error.message,
      });
    }
  };

  function handleTestCaseResponse(
    testCase: TestCase,
    action: "create" | "update"
  ) {
    if (testCase && testCase.id) {
      if (hasValidHapiOutcome(testCase)) {
        setAlert({
          status: "success",
          message: `Test case ${action}d successfully!`,
        });
      } else {
        setAlert({
          status: "warning",
          message: `An error occurred with the Test Case JSON while ${
            action === "create" ? "creating" : "updating"
          } the test case`,
        });
        handleHapiOutcome(testCase.hapiOperationOutcome);
      }
      updateMeasureStore(action, testCase);
    } else {
      setAlert(() => ({
        status: "error",
        message: `An error occurred - ${action} did not return the expected successful result.`,
      }));
    }
  }

  // we need to update measure store with created/updated test case to avoid stale state,
  // otherwise we'll lose testcase updates
  function updateMeasureStore(action: string, testCase: TestCase) {
    const measureCopy = Object.assign({}, measure);
    if (action === "update") {
      // for update action, find original test from measure
      const index = measureCopy.testCases.findIndex(
        (tc) => tc.id === testCase.id
      );
      // remove stale test case
      measureCopy.testCases.splice(index, 1);
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

  function hasValidHapiOutcome(testCase: TestCase) {
    return (
      _.isNil(testCase.hapiOperationOutcome) ||
      testCase.hapiOperationOutcome.code === 200 ||
      testCase.hapiOperationOutcome.code === 201
    );
  }

  function handleHapiOutcome(outcome: HapiOperationOutcome) {
    if (
      _.isNil(outcome) ||
      (outcome.successful !== false &&
        (outcome.code === 200 || outcome.code === 201))
    ) {
      setValidationErrors(() => []);
      return [];
    }
    if (outcome.outcomeResponse?.issue?.length > 0) {
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

  function navigateToTestCases() {
    navigate("..");
  }

  function formikErrorHandler(name: string, isError: boolean) {
    if (formik.touched[name] && formik.errors[name]) {
      return (
        <HelperText
          id={`${name}-helper-text`}
          data-testid={`${name}-helper-text`}
          text={formik.errors[name]?.toString()}
          isError={isError}
        />
      );
    }
  }

  function isModified() {
    if (testCase) {
      return (
        formik.isValid &&
        (formik.dirty ||
          editorVal !== testCase?.json ||
          !_.isEqual(
            testCase?.groupPopulations,
            formik.values.groupPopulations
          ))
      );
    } else {
      return formik.isValid && formik.dirty;
    }
  }

  function isJsonModified() {
    return testCase
      ? editorVal !== testCase?.json
      : !isEmptyTestCaseJsonString(editorVal);
  }

  function resizeEditor() {
    // hack to force Ace to resize as it doesn't seem to be responsive
    setTimeout(() => {
      editor?.resize(true);
    }, 500);
  }

  function findMeasureGroupPopulation(
    measureGroup: Group,
    populationValue: PopulationExpectedValue
  ): Population {
    return measureGroup?.populations?.find(
      (population) =>
        (!_.isNil(populationValue.id) &&
          population.id === populationValue.id) ||
        (_.isNil(populationValue.id) &&
          populationValue.name === population.name)
    );
  }

  const mapGroupPopulations = (
    groupPopulations: GroupPopulation[],
    populationGroupResults: DetailedPopulationGroupResult[],
    groupStatementResults: GroupStatementResultMap,
    groupEpisodeResults: GroupPopulationEpisodeResultMap
  ): DisplayGroupPopulation[] => {
    if (_.isNil(groupPopulations)) {
      return null;
    }
    const gp = groupPopulations.map((groupPopulation) => {
      const results = populationGroupResults?.find(
        (groupResult) => groupResult.groupId === groupPopulation.groupId
      );
      const measureGroup = measure?.groups?.find(
        (group) => group.id === groupPopulation.groupId
      );
      return {
        ...groupPopulation,
        stratificationValues: groupPopulation?.stratificationValues?.map(
          (stratValue) => {
            const strataDefinition = measureGroup.stratifications.find(
              (stratification) => stratification.id === stratValue.id
            )?.cqlDefinition;
            const actualResult =
              groupPopulation.populationBasis === "Boolean"
                ? groupStatementResults?.[groupPopulation.groupId]?.[
                    strataDefinition
                  ] > 0
                : groupStatementResults?.[groupPopulation.groupId]?.[
                    strataDefinition
                  ];

            return {
              ...stratValue,
              actual: actualResult,
            };
          }
        ),
        populationValues: groupPopulation?.populationValues?.map(
          (populationValue) => {
            // try to look up population on group to find the define
            const measureGroupPopulation: Population =
              findMeasureGroupPopulation(measureGroup, populationValue);
            const episodeActualValue = findEpisodeActualValue(
              groupEpisodeResults?.[measureGroup.id],
              populationValue,
              measureGroupPopulation?.definition
            );

            const actualResult =
              groupPopulation.populationBasis === "Boolean"
                ? results?.populationResults?.find(
                    (popResult) =>
                      FHIR_POPULATION_CODES[popResult.populationType] ===
                      populationValue.name
                  )?.result
                : episodeActualValue;
            return {
              ...populationValue,
              actual: actualResult,
            };
          }
        ),
      };
    });
    return gp;
  };

  return (
    <TestCaseForm
      data-testid="create-test-case-form"
      onSubmit={formik.handleSubmit}
    >
      <div tw="flex flex-wrap shadow-lg mx-8 my-6 rounded-md border border-slate bg-white">
        <div
          tw="flex-none sm:w-full md:w-6/12 lg:w-6/12"
          style={{ marginTop: 44 }}
        >
          <Editor
            onChange={(val: string) => setEditorVal(val)}
            value={editorVal}
            setEditor={setEditor}
            readOnly={!canEdit}
          />
        </div>
        {/* pseudo divider */}
        <div style={{ width: "17px", background: "#DDDDDD" }}></div>
        <div tw="flex-auto sm:w-full md:w-1/12 lg:w-3/12">
          <CreateTestCaseNavTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === "measurecql" &&
            (!measure?.cqlErrors ? (
              <div data-testid="test-case-cql-editor">
                <MadieEditor
                  value={measure?.cql}
                  height="calc(100vh - 135px)"
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
          {activeTab === "highlighting" && (
            <CalculationResults
              calculationResults={populationGroupResults}
              calculationErrors={calculationErrors}
            />
          )}
          {activeTab === "expectoractual" && (
            <ExpectedActual
              canEdit={canEdit}
              groupPopulations={mapGroupPopulations(
                formik.values.groupPopulations,
                populationGroupResults,
                groupStatementResults,
                groupEpisodeResults
              )}
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
            />
          )}
          {/*
            Independent views should be their own components when possible
            This will allow for independent unit testing and help render performance.
           */}

          {activeTab === "details" && (
            <>
              {alert && (
                <Alert
                  status={alert.status}
                  role="alert"
                  aria-label="Create Alert"
                  data-testid="create-test-case-alert"
                >
                  {alert.message}
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
              )}
              {/* TODO Replace with re-usable form component
               label, input, and error => single input control component */}

              <FormControl>
                <label htmlFor="test-case-title">Test Case Title</label>
                {canEdit && (
                  <>
                    <TestCaseTitle
                      type="text"
                      id="test-case-title"
                      aria-describedby="title-helper-text"
                      data-testid="create-test-case-title"
                      {...formik.getFieldProps("title")}
                      // border radius classes don't take to tw.input
                      style={{ borderRadius: ".375rem" }}
                    />
                    <FormErrors>{formikErrorHandler("title", true)}</FormErrors>
                  </>
                )}
                {!canEdit && formik.values.title}

                <label htmlFor="test-case-description">
                  Test Case Description
                </label>
                {canEdit && (
                  <>
                    <TestCaseDescription
                      id="test-case-description"
                      data-testid="create-test-case-description"
                      aria-describedby="description-helper-text"
                      {...formik.getFieldProps("description")}
                    />
                    <FormErrors>
                      {formikErrorHandler("description", true)}
                    </FormErrors>
                  </>
                )}
                {!canEdit && formik.values.description}

                <label htmlFor="test-case-series">Test Case Series</label>
                {canEdit && (
                  <>
                    <TestCaseSeries
                      value={formik.values.series}
                      onChange={(nextValue) =>
                        formik.setFieldValue("series", nextValue)
                      }
                      seriesOptions={seriesState.series}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "3px",
                          "& legend": {
                            width: 0,
                          },
                        },
                      }}
                    />
                    <HelperText text={"Start typing to add a new series"} />
                  </>
                )}
                {!canEdit && formik.values.series}
              </FormControl>
            </>
          )}
        </div>
        {showValidationErrors ? (
          <aside
            tw="w-80 h-[500px] flex flex-col"
            data-testid="open-json-validation-errors-aside"
          >
            <button
              tw="w-full text-lg text-center"
              data-testid="hide-json-validation-errors-button"
              onClick={() => {
                setShowValidationErrors((prevState) => {
                  resizeEditor();
                  return !prevState;
                });
              }}
            >
              <StyledIcon
                icon={faExclamationCircle}
                errors={validationErrors.length}
              />
              Validation Errors
            </button>

            <div
              tw="h-full flex flex-col overflow-y-scroll"
              data-testid="json-validation-errors-list"
            >
              {validationErrors && validationErrors.length > 0 ? (
                validationErrors.map((error) => {
                  return (
                    <ValidationAlertCard
                      key={error.key}
                      status={error.severity}
                    >
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
            tw="w-10 h-[500px] overflow-x-hidden"
            data-testid="closed-json-validation-errors-aside"
          >
            <ValidationErrorsButton
              data-testid="show-json-validation-errors-button"
              onClick={() =>
                setShowValidationErrors((prevState) => {
                  resizeEditor();
                  return !prevState;
                })
              }
            >
              <StyledIcon
                icon={faExclamationCircle}
                errors={validationErrors.length}
              />
              Validation Errors
            </ValidationErrorsButton>
          </aside>
        )}

        <div tw="h-24 bg-gray-75 w-full sticky bottom-0 left-0 z-10">
          <div tw="flex items-center">
            <div tw="w-1/2 flex justify-end items-center px-10 py-6">
              <Button
                buttonTitle="Run Test"
                type="button"
                variant="secondary"
                onClick={calculate}
                disabled={
                  !!measure?.cqlErrors ||
                  _.isNil(measure?.groups) ||
                  measure?.groups.length === 0 ||
                  (!isJsonModified() && validationErrors?.length > 0) ||
                  isEmptyTestCaseJsonString(editorVal)
                }
                /*
                  if new test case
                    enable run button if json modified, regardless of errors
                 */
                data-testid="run-test-case-button"
              />
            </div>
            {canEdit && (
              <div
                tw="w-1/2 flex justify-end items-center px-10 py-6"
                style={{ alignItems: "end" }}
              >
                <Button
                  tw="m-2"
                  buttonTitle="Discard Changes"
                  type="button"
                  variant="white"
                  onClick={navigateToTestCases}
                  data-testid="edit-test-case-discard-button"
                />
                <Button
                  tw="m-2"
                  buttonTitle="Save"
                  type="submit"
                  data-testid="edit-test-case-save-button"
                  disabled={!isModified() || createButtonDisabled}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </TestCaseForm>
  );
};

export default EditTestCase;
