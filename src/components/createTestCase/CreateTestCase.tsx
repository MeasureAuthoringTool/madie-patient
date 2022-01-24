import React, { useState } from "react";
import { Button, HelperText, Label } from "@madie/madie-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import tw, { styled } from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "styled-components/macro";
import * as Yup from "yup";
import TestCase from "../../models/TestCase";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import Editor from "../editor/Editor";

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

interface AlertProps {
  status?: "success" | "warning" | "error" | null;
  message?: string;
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
  const location = useLocation();
  const navigate = useNavigate();
  const testCaseService = useTestCaseServiceApi();
  const [alert, setAlert] = useState<AlertProps>(null);
  const { measureId } = useParams<{ measureId: string }>();
  const formik = useFormik({
    initialValues: {
      description: "",
    } as TestCase,
    validationSchema: Yup.object().shape({
      description: Yup.string(),
    }),
    onSubmit: async (values: TestCase) => await createTestCase(values),
  });

  const createTestCase = async (testCase: TestCase) => {
    setAlert(null);
    try {
      const savedTestCase = await testCaseService.createTestCase(
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

  function navigateToTestCases() {
    const url = location.pathname.slice(0, location.pathname.length - 7);
    navigate(url);
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

  return (
    <>
      <div tw="flex flex-wrap sm:flex-row-reverse items-stretch h-screen">
        <div tw="w-full md:w-1/2 xl:w-3/5 bg-cover flex">
          <Editor />
        </div>
        <div tw="w-full flex-1 p-4 overflow-y-scroll">
          {/* Original content of this tsx output */}
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
              <FormActions>
                <Button
                  buttonTitle="Create Test Case"
                  type="submit"
                  data-testid="create-test-case-button"
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
          {/* End of Original content of this tsx output */}
        </div>
      </div>
    </>
  );
};

export default CreateTestCase;
