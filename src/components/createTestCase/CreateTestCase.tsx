import React, {
  Dispatch,
  SetStateAction,
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
import TestCase, { HapiOperationOutcome } from "../../models/TestCase";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import Editor from "../editor/Editor";
import { TestCaseValidator } from "../../models/TestCaseValidator";
import { sanitizeUserInput } from "../../util/Utils.js";
import TestCaseSeries from "./TestCaseSeries";
import * as _ from "lodash";
import { Ace } from "ace-builds";
import { getPopulationsForScoring } from "../../util/PopulationsMap";
import Measure from "../../models/Measure";
import useMeasureServiceApi from "../../api/useMeasureServiceApi";
import GroupPopulations from "../populations/GroupPopulations";
import { Calculator } from "fqm-execution";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { TextField } from "@mui/material";
import { format } from "date-fns";
import useCalculation from "../../api/useCalculation";

const FormControl = tw.div`mb-3`;
const FormErrors = tw.div`h-6`;
const TestCaseForm = tw.form`m-3`;
const FormActions = tw.div`flex flex-row gap-2`;

const TestCaseDescription = tw.textarea`
  w-96
  resize
  h-24
  rounded-md
  sm:text-sm
`;
const TestCaseTitle = tw.input`
  w-96
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
  tw`rounded-lg py-5 px-6 m-3 text-base inline-flex items-center w-auto min-w-96`,
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

const INITIAL_VALUES = {
  title: "",
  description: "",
  series: "",
  groupPopulations: [],
  measurementPeriod: {},
} as TestCase;

const CreateTestCase = () => {
  const navigate = useNavigate();
  const { id, measureId } = useParams<
    keyof navigationParams
  >() as navigationParams;
  // Avoid infinite dependency render. May require additional error handling for timeouts.
  const testCaseService = useRef(useTestCaseServiceApi());
  const measureService = useRef(useMeasureServiceApi());
  const calculation = useRef(useCalculation());
  const [alert, setAlert] = useState<AlertProps>(null);
  const [testCase, setTestCase] = useState<TestCase>(null);
  const [editorVal, setEditorVal]: [string, Dispatch<SetStateAction<string>>] =
    useState("");
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });
  const [measure, setMeasure] = useState<Measure>(null);
  const [measureGroups, setMeasureGroups] = useState(null);
  const [editor, setEditor] = useState<Ace.Editor>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [measurementPeriodStart, setMeasurementPeriodStart] = useState<Date>(
    new Date(2019, 0, 1)
  );
  const [measurementPeriodEnd, setMeasurementPeriodEnd] = useState<Date>(
    new Date(2019, 11, 31)
  );
  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES },
    validationSchema: TestCaseValidator,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  const mapMeasureGroups = (measureGroups) => {
    return measureGroups.map((mg) => {
      return {
        group: mg.groupName,
        scoring: mg.scoring,
        populationValues: getPopulationsForScoring(mg.scoring)?.map(
          (population) => ({
            name: population,
            expected: false,
            actual: false,
          })
        ),
      };
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
          console.error(
            "An error occurred while loading the series options",
            error
          );
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
            const nextTc = _.cloneDeep(tc);
            if (_.isNil(tc.groupPopulations) && measureGroups) {
              nextTc.groupPopulations = mapMeasureGroups(measureGroups);
            } else if (_.isNil(tc.groupPopulations)) {
              nextTc.groupPopulations = [];
            }
            resetForm({ values: nextTc });
            handleHapiOutcome(tc?.hapiOperationOutcome);
          })
          .catch((error) => {
            console.error(
              "error retrieving and updating local state for test case",
              error
            );
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
    } else if (measureGroups) {
      resetForm({
        values: {
          ...INITIAL_VALUES,
          groupPopulations: mapMeasureGroups(measureGroups),
        },
      });
    }
  }, [
    id,
    measureId,
    testCaseService,
    setTestCase,
    resetForm,
    measureGroups,
    seriesState.loaded,
  ]);

  useEffect(() => {
    if (measureId) {
      measureService.current
        .fetchMeasure(measureId)
        .then((measure) => {
          setMeasure(measure);
          // TODO: replace this with the groups off the measure once those are being persisted
          setMeasureGroups([
            {
              groupName: "Group One",
              scoring: measure.measureScoring,
            },
          ]);
        })
        .catch((error) => {
          console.error(
            `Failed to load measure groups. An error occurred while loading measure with ID [${measureId}]`,
            error
          );
          setAlert(() => ({
            status: "error",
            message:
              "Failed to load measure groups. An error occurred while loading the measure.",
          }));
        });
    } else {
      console.warn("MeasureID not defined");
    }
  }, [measureId]);

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
      handleTestCaseResponse(savedTestCase, "create");
    } catch (error) {
      console.error("An error occurred while creating the test case", error);
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
      handleTestCaseResponse(updatedTestCase, "update");
    } catch (error) {
      console.error("An error occurred while updating the test case", error);
      setAlert(() => ({
        status: "error",
        message: "An error occurred while updating the test case.",
      }));
    }
  };

  const calculate = (): void => {
    let tempTestCase = { ...testCase };
    if (isModified()) {
      tempTestCase.json = editorVal;
    }
    calculation.current
      .calculateSingleTestCase(measure, tempTestCase, {
        start: measurementPeriodStart,
        end: measurementPeriodEnd,
      })
      .then((result) => {
        /* eslint no-console:off */
        console.dir(result);
      });
  };

  function handleTestCaseResponse(
    testCase: TestCase,
    action: "create" | "update"
  ) {
    if (testCase && testCase.id) {
      if (hasValidHapiOutcome(testCase)) {
        setAlert({
          status: "success",
          message: `Test case ${action}d successfully! Redirecting back to Test Cases...`,
        });
        setTimeout(() => navigateToTestCases(), 3000);
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

  return (
    <>
      <div tw="flex flex-wrap w-screen">
        <div tw="flex-none max-w-xl">
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
                  tw="box-content w-4 h-4 p-1 ml-3 mb-1.5 border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:opacity-75 hover:no-underline"
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
              <FormControl>
                <Label text="Test Case Title" />
                <TestCaseTitle
                  type="text"
                  id="testCaseTitle"
                  data-testid="create-test-case-title"
                  {...formik.getFieldProps("title")}
                  // border radius classes don't take to tw.input
                  style={{ borderRadius: ".375rem" }}
                />
                <FormErrors>{formikErrorHandler("title", true)}</FormErrors>
                <Label text="Test Case Description" />
                <TestCaseDescription
                  id="testCaseDescription"
                  data-testid="create-test-case-description"
                  {...formik.getFieldProps("description")}
                />
                <FormErrors>
                  {formikErrorHandler("description", true)}
                </FormErrors>
              </FormControl>
              <FormControl>
                <Label text="Test Case Series" />
                <TestCaseSeries
                  value={formik.values.series}
                  onChange={(nextValue) =>
                    formik.setFieldValue("series", nextValue)
                  }
                  seriesOptions={seriesState.series}
                  sx={{ width: "100%" }}
                />
                <HelperText text={"Start typing to add a new series"} />
              </FormControl>
              <FormControl
                tw="flex flex-col"
                data-testid="create-test-case-populations"
              >
                <span tw="text-lg">Population Values</span>
                <GroupPopulations
                  disableActual={true}
                  groupPopulations={formik.values.groupPopulations}
                  onChange={(groupPopulations) => {
                    formik.setFieldValue("groupPopulations", groupPopulations);
                  }}
                />
              </FormControl>
              <span tw="text-lg">Measurement Period</span>
              <FormControl data-testid="create-test-case-measurement-period-start">
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DesktopDatePicker
                    label="Start"
                    inputFormat="MM/dd/yyyy"
                    value={
                      /*formik.values.measurementPeriod.start*/
                      /* TODO use formik's initial value */
                      /* throwing error, undefined trying to read "start" */
                      measurementPeriodStart
                    }
                    onChange={(startDate) => {
                      formik.setFieldValue(
                        "measurementPeriod.start",
                        startDate
                      );
                      setMeasurementPeriodStart(startDate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl data-testid="create-test-case-measurement-period-end">
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DesktopDatePicker
                    label="End"
                    inputFormat="MM/dd/yyyy"
                    value={
                      /*formik.values.measurementPeriod.end*/
                      /* TODO use formik's initial value */
                      /* throwing error, undefined trying to read "end" */
                      measurementPeriodEnd
                    }
                    onChange={(endDate) => {
                      formik.setFieldValue("measurementPeriod.end", endDate);
                      setMeasurementPeriodEnd(endDate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormActions>
                <Button
                  buttonTitle={
                    testCase ? "Update Test Case" : "Create Test Case"
                  }
                  type="submit"
                  data-testid="create-test-case-button"
                  disabled={!isModified()}
                />
                <Button
                  buttonTitle="Run Test"
                  type="button"
                  variant="secondary"
                  onClick={calculate}
                  data-testid="create-test-case-run-test-button"
                />
                <Button
                  buttonTitle="Cancel"
                  type="button"
                  variant="white"
                  onClick={navigateToTestCases}
                  data-testid="create-test-case-cancel-button"
                />
              </FormActions>
            </TestCaseForm>
          </div>
        </div>
        <div tw="flex-grow">
          <Editor
            onChange={(val: string) => setEditorVal(val)}
            value={editorVal}
            setEditor={setEditor}
          />
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
