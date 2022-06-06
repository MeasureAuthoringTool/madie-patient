import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import parse from "html-react-parser";
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
} from "@madie/madie-models";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import Editor from "../editor/Editor";
import { TestCaseValidator } from "../../validators/TestCaseValidator";
import { sanitizeUserInput } from "../../util/Utils.js";
import TestCaseSeries from "./TestCaseSeries";
import * as _ from "lodash";
import { Ace } from "ace-builds";
import {
  FHIR_POPULATION_CODES,
  getPopulationsForScoring,
  triggerPopChanges,
} from "../../util/PopulationsMap";
import GroupPopulations from "../populations/GroupPopulations";
import calculationService from "../../api/CalculationService";
import {
  DetailedPopulationGroupResult,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import useOktaTokens from "../../hooks/useOktaTokens";
import useExecutionContext from "../routes/useExecutionContext";

const FormControl = tw.div`mb-3`;
const FormErrors = tw.div`h-6`;
const TestCaseForm = tw.form`m-3`;
const FormActions = tw.div`flex flex-row gap-2`;

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

const ValidationErrorCard = tw.p`
text-xs bg-white p-3 bg-red-100 rounded-xl mx-3 my-1 break-words
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

const INITIAL_VALUES = {
  title: "",
  description: "",
  series: "",
  groupPopulations: [],
} as TestCase;

const CreateTestCase = () => {
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
  const [changedPopulation, setChangedPopulation] = useState<string>("");
  const [pendingGroupPopulations, setPendingGroupPopulations] =
    useState<any>(null);
  const [populationGroupResult, setPopulationGroupResult] =
    useState<DetailedPopulationGroupResult>();
  const [calculationErrors, setCalculationErrors] = useState<string>();
  const [createButtonDisabled, setCreateButtonDisabled] =
    useState<boolean>(false);

  const { measureState, bundleState, valueSetsState } = useExecutionContext();
  const [measure] = measureState;
  const [measureBundle] = bundleState;
  const [valueSets] = valueSetsState;

  const [canEdit, setCanEdit] = useState<boolean>(
    userName === measure?.createdBy
  );

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES },
    validationSchema: TestCaseValidator,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  const mapMeasureGroup = (group: Group): GroupPopulation => {
    return {
      groupId: group.id,
      scoring: group.scoring,
      populationValues: getPopulationsForScoring(group)?.map((population) => ({
        name: population,
        expected: false,
        actual: false,
      })),
    };
  };

  const mapMeasureGroups = useCallback(
    (measureGroups: Group[]): GroupPopulation[] => {
      return measureGroups.map(mapMeasureGroup);
    },
    []
  );

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
            setCanEdit(userName === tc.createdBy);
            const nextTc = _.cloneDeep(tc);
            if (measure && measure.groups) {
              nextTc.groupPopulations = measure.groups.map((group) => {
                const existingGroupPop = tc.groupPopulations?.find(
                  (gp) => gp.groupId === group.id
                );
                return _.isNil(existingGroupPop)
                  ? mapMeasureGroup(group)
                  : existingGroupPop;
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
      setCanEdit(measure.createdBy === userName);
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
      const checkEditorValJsonId = checkEditorValJsonIdOne(editorVal);
      const savedTestCase = await testCaseService.current.createTestCase(
        testCase,
        measureId
      );
      setCreateButtonDisabled(true);
      setEditorVal(savedTestCase.json);

      handleTestCaseResponse(savedTestCase, "create", checkEditorValJsonId);
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
      const checkEditorValJsonId = checkEditorValJsonIdOne(editorVal);
      const checkPreviousIdValue = checkPreviousIdValueOne(
        updatedTestCase.json,
        editorVal
      );

      resetForm({
        values: { ...testCase },
      });
      setTestCase(updatedTestCase);
      setEditorVal(updatedTestCase.json);

      handleTestCaseResponse(
        updatedTestCase,
        "update",
        checkEditorValJsonId,
        checkPreviousIdValue
      );
    } catch (error) {
      setAlert(() => ({
        status: "error",
        message: "An error occurred while updating the test case.",
      }));
    }
  };

  const checkEditorValJsonIdOne = (editorVal) => {
    try {
      return editorVal ? JSON.parse(editorVal).hasOwnProperty("id") : null;
    } catch (e) {
      return false;
    }
  };

  const checkPreviousIdValueOne = (updatedTestCase, editorVal) => {
    try {
      JSON.parse(updatedTestCase?.json)?.id !== JSON.parse(editorVal)?.id
        ? false
        : true;
    } catch (e) {
      return null;
    }
  };

  const calculate = async () => {
    if (measure && measure.cqlErrors) {
      setCalculationErrors(
        "Cannot execute test case while errors exist in the measure CQL!"
      );
      return;
    }
    let modifiedTestCase = { ...testCase };
    if (isModified()) {
      modifiedTestCase.json = editorVal;
    }

    try {
      const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] =
        await calculation.current.calculateTestCases(
          measure,
          [modifiedTestCase],
          measureBundle,
          valueSets
        );
      setCalculationErrors("");
      // grab first group results because we only have one group for now
      setPopulationGroupResult(executionResults[0].detailedResults[0]);
    } catch (error) {
      setCalculationErrors(error.message);
    }
  };

  function handleTestCaseResponse(
    testCase: TestCase,
    action: "create" | "update",
    editorValJsonId?: boolean,
    checkPreviousIdValue?: boolean
  ) {
    const editorValJsonIdMessage = editorValJsonId
      ? "Bundle IDs are auto generated on save. MADiE has over written the ID provided"
      : editorValJsonId !== null
      ? "Bundle ID has been auto generated"
      : "";

    if (testCase && testCase.id) {
      if (hasValidHapiOutcome(testCase)) {
        setAlert({
          status: checkPreviousIdValue
            ? "success"
            : editorValJsonId
            ? "warning"
            : "success",
          message: `Test case ${action}d successfully! ${
            !checkPreviousIdValue ? editorValJsonIdMessage : ""
          }`,
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
    } else {
      setAlert(() => ({
        status: "error",
        message: `An error occurred - ${action} did not return the expected successful result.`,
      }));
    }
  }

  function hasValidHapiOutcome(testCase: TestCase) {
    return (
      _.isNil(testCase.hapiOperationOutcome) ||
      testCase.hapiOperationOutcome.code === 200 ||
      testCase.hapiOperationOutcome.code === 201
    );
  }

  function handleHapiOutcome(outcome: HapiOperationOutcome) {
    if (_.isNil(outcome) || outcome.code === 200 || outcome.code === 201) {
      setValidationErrors(() => []);
      return;
    }
    if (
      (outcome.code === 400 ||
        outcome.code === 409 ||
        outcome.code === 412 ||
        outcome.code === 422) &&
      outcome.outcomeResponse &&
      outcome.outcomeResponse.issue
    ) {
      setValidationErrors(() =>
        outcome.outcomeResponse.issue.map((issue, index) => ({
          ...issue,
          key: index,
        }))
      );
    } else {
      const error =
        outcome.outcomeResponse?.text ||
        outcome.message ||
        `HAPI FHIR returned error code ${outcome.code} but no discernible error message`;
      setValidationErrors([{ key: 0, diagnostics: error }]);
    }
  }

  function navigateToTestCases() {
    navigate("..");
  }

  function formikErrorHandler(name: string, isError: boolean) {
    if (formik.touched[name] && formik.errors[name]) {
      return (
        <HelperText
          data-testid={`${name}-helper-text`}
          text={formik.errors[name]?.toString()}
          isError={isError}
        />
      );
    }
  }

  function isModified() {
    return (
      formik.isValid &&
      (formik.dirty ||
        editorVal !== testCase?.json ||
        !_.isEqual(testCase?.groupPopulations, formik.values.groupPopulations))
    );
  }

  function resizeEditor() {
    // hack to force Ace to resize as it doesn't seem to be responsive
    setTimeout(() => {
      editor?.resize(true);
    }, 500);
  }

  useEffect(() => {
    if (changedPopulation !== "" && pendingGroupPopulations) {
      validatePopulationDependencies(
        pendingGroupPopulations as GroupPopulation[],
        changedPopulation
      );
    }
  }, [changedPopulation, pendingGroupPopulations]);

  const validatePopulationDependencies = (
    groupPopulations: GroupPopulation[],
    changedPopulation: String
  ) => {
    const output = triggerPopChanges(groupPopulations, changedPopulation);
    formik.setFieldValue("groupPopulations", output as GroupPopulation[]);
    setPendingGroupPopulations(null);
  };

  const mapGroups = (
    groupPopulation: GroupPopulation,
    results: DetailedPopulationGroupResult
  ): DisplayGroupPopulation[] => {
    if (_.isNil(groupPopulation)) {
      return null;
    }
    return [
      {
        ...groupPopulation,
        populationValues: groupPopulation?.populationValues?.map(
          (populationValue) => {
            return {
              ...populationValue,
              actual: !!results?.populationResults?.find(
                (popResult) =>
                  FHIR_POPULATION_CODES[popResult.populationType] ===
                  populationValue.name
              )?.result,
            };
          }
        ),
      },
    ];
  };

  return (
    <>
      <div tw="flex flex-wrap w-screen">
        <div tw="flex-none w-3/12">
          <div tw="ml-2">
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
            <TestCaseForm
              data-testid="create-test-case-form"
              onSubmit={formik.handleSubmit}
            >
              {/*
              TODO Replace with re-usable form component
               label, input, and error => single input control component
              */}
              <FormControl>
                <Label text="Test Case Title" />
                {canEdit && (
                  <TestCaseTitle
                    type="text"
                    id="testCaseTitle"
                    data-testid="create-test-case-title"
                    {...formik.getFieldProps("title")}
                    // border radius classes don't take to tw.input
                    style={{ borderRadius: ".375rem" }}
                  />
                )}
                {canEdit && (
                  <FormErrors>{formikErrorHandler("title", true)}</FormErrors>
                )}
                {!canEdit && formik.values.title}
                <Label text="Test Case Description" />
                {canEdit && (
                  <TestCaseDescription
                    id="testCaseDescription"
                    data-testid="create-test-case-description"
                    {...formik.getFieldProps("description")}
                  />
                )}
                {canEdit && (
                  <FormErrors>
                    {formikErrorHandler("description", true)}
                  </FormErrors>
                )}
                {!canEdit && formik.values.description}
              </FormControl>
              <FormControl>
                <Label text="Test Case Series" />
                {canEdit && (
                  <TestCaseSeries
                    value={formik.values.series}
                    onChange={(nextValue) =>
                      formik.setFieldValue("series", nextValue)
                    }
                    seriesOptions={seriesState.series}
                    sx={{ width: "100%" }}
                  />
                )}
                {canEdit && (
                  <HelperText text={"Start typing to add a new series"} />
                )}
                {!canEdit && formik.values.series}
              </FormControl>
              <FormControl
                tw="flex flex-col"
                data-testid="create-test-case-populations"
              >
                <span tw="text-lg">Population Values</span>
                <GroupPopulations
                  disableActual={true}
                  disableExpected={!canEdit}
                  groupPopulations={mapGroups(
                    formik.values.groupPopulations[0],
                    populationGroupResult
                  )}
                  onChange={(groupPopulations) => {
                    setPendingGroupPopulations(groupPopulations);
                  }}
                  setChangedPopulation={setChangedPopulation}
                />
              </FormControl>

              <FormActions>
                {canEdit && (
                  <Button
                    buttonTitle={
                      testCase ? "Update Test Case" : "Create Test Case"
                    }
                    type="submit"
                    data-testid="create-test-case-button"
                    disabled={!isModified() || createButtonDisabled}
                  />
                )}
                <Button
                  buttonTitle="Run Test"
                  type="button"
                  variant="secondary"
                  onClick={calculate}
                  disabled={
                    !!measure?.cqlErrors ||
                    _.isNil(measure?.groups) ||
                    measure?.groups.length === 0 ||
                    validationErrors?.length > 0 ||
                    isEmptyTestCaseJsonString(formik.values.json)
                  }
                  data-testid="run-test-case-button"
                />
                {canEdit && (
                  <Button
                    buttonTitle="Cancel"
                    type="button"
                    variant="white"
                    onClick={navigateToTestCases}
                    data-testid="create-test-case-cancel-button"
                  />
                )}
              </FormActions>
            </TestCaseForm>
          </div>
        </div>
        <div tw="flex-auto w-3/12">
          <Editor
            onChange={(val: string) => setEditorVal(val)}
            value={editorVal}
            setEditor={setEditor}
            readOnly={!canEdit}
          />
        </div>
        {(populationGroupResult || calculationErrors) && (
          <div tw="flex-auto w-3/12 p-2">
            {calculationErrors && (
              <Alert
                status="error"
                role="alert"
                aria-label="Calculation Errors"
                data-testid="calculation-error-alert"
              >
                {calculationErrors}
              </Alert>
            )}
            {!calculationErrors && (
              <div tw="text-sm" data-testid="calculation-results">
                {parse(populationGroupResult.html)}
              </div>
            )}
          </div>
        )}
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
                    <ValidationErrorCard key={error.key}>
                      {error.diagnostics}
                    </ValidationErrorCard>
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
      </div>
    </>
  );
};

export default CreateTestCase;
