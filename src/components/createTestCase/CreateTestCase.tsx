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
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "styled-components/macro";
import TestCase from "../../models/TestCase";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import Editor from "../editor/Editor";
import { TestCaseValidator } from "../../models/TestCaseValidator";
import { sanitizeUserInput } from "../../util/Utils.js";
import TestCaseSeries from "./TestCaseSeries";

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

interface AlertProps {
  status?: "success" | "warning" | "error" | null;
  message?: string;
}

interface navigationParams {
  id: string;
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

const CreateTestCase = () => {
  const navigate = useNavigate();
  const { id } = useParams<keyof navigationParams>() as navigationParams;
  const { measureId } = useParams<{ measureId: string }>();
  // Avoid infinite dependency render. May require additional error handling for timeouts.
  const testCaseService = useRef(useTestCaseServiceApi());
  const [alert, setAlert] = useState<AlertProps>(null);
  const [testCase, setTestCase] = useState<TestCase>(null);
  const [editorVal, setEditorVal]: [string, Dispatch<SetStateAction<string>>] =
    useState("");
  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      series: "",
    } as TestCase,
    validationSchema: TestCaseValidator,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });
  const { resetForm } = formik;

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
            setTestCase(tc);
            setEditorVal(tc.json);
            resetForm({ values: tc });
          })
          .catch((error) => {
            console.error(
              "error retrieving and updating local state for test case",
              error
            );
          });
      };
      updateTestCase();
      return () => {
        setTestCase(null);
        resetForm();
      };
    }
  }, [
    id,
    measureId,
    testCaseService,
    setTestCase,
    resetForm,
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
      if (savedTestCase && savedTestCase.id) {
        setAlert({
          status: "success",
          message:
            "Test case saved successfully! Redirecting back to Test Cases...",
        });
        setTimeout(() => navigateToTestCases(), 3000);
      } else {
        setAlert(() => ({
          status: "error",
          message:
            "An error occurred - create did not return the expected successful result.",
        }));
      }
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
      if (updatedTestCase) {
        setAlert({
          status: "success",
          message:
            "Test case updated successfully! Redirecting back to Test Cases...",
        });
        setTimeout(() => navigateToTestCases(), 3000);
      } else {
        setAlert(() => ({
          status: "error",
          message:
            "An error occurred - update did not return the expected successful result.",
        }));
      }
    } catch (error) {
      console.error("An error occurred while updating the test case", error);
      setAlert(() => ({
        status: "error",
        message: "An error occurred while updating the test case.",
      }));
    }
  };

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
    return formik.isValid && (formik.dirty || editorVal !== testCase?.json);
  }

  return (
    <>
      <div tw="flex flex-wrap ">
        <div tw="flex-none ">
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
          />
        </div>
      </div>
    </>
  );
};

export default CreateTestCase;
