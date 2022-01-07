import React, { useState } from "react";
import { Button, HelperText, Label } from "@madie/madie-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import tw from "twin.macro";
import * as Yup from "yup";
import TestCase from "../../models/TestCase";

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

const CreateTestCase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase>();

  const formik = useFormik({
    initialValues: {
      description: "",
    } as TestCase,
    validationSchema: Yup.object().shape({
      description: Yup.string().required("Patient description is required"),
    }),
    onSubmit: async (values: TestCase) => {
      await createPatient(values);
    },
  });

  const createPatient = async (testCase: TestCase) => {
    // eslint-disable-next-line no-console
    console.log("create testCase: ", testCase);
    setTestCase(testCase);
  };

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
    <div tw="ml-2">
      <TestCaseForm
        data-testid="create-test-case-form"
        onSubmit={formik.handleSubmit}
      >
        <FormControl>
          <Label text="Test Case Description" />
          <TestCaseDescription
            data-testid="create-test-case-description"
            {...formik.getFieldProps("description")}
          />
          <FormErrors>{formikErrorHandler("description", true)}</FormErrors>
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
            onClick={() => {
              const url = location.pathname.slice(
                0,
                location.pathname.length - 7
              );
              navigate(url);
            }}
            data-testid="create-test-case-cancel-button"
          />
        </FormActions>
        <div>
          {testCase ? <span>create: {JSON.stringify(testCase)}</span> : null}
        </div>
      </TestCaseForm>
    </div>
  );
};

export default CreateTestCase;
