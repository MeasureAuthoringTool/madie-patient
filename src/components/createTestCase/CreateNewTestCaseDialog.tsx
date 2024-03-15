import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TestCase, Measure } from "@madie/madie-models";
import { TestCaseValidator } from "../../validators/TestCaseValidator";
import {
  MadieDialog,
  TextField,
  Toast,
  TextArea,
} from "@madie/madie-design-system/dist/react";
import { Box } from "@mui/system";
import { InputLabel, Typography } from "@mui/material";
import { useFormik } from "formik";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import * as _ from "lodash";
import TestCaseSeries from "./TestCaseSeries";
import { sanitizeUserInput } from "../../util/Utils";
import { defaultTestCaseJson } from "../../util/QdmTestCaseHelper";

interface Toast {
  toastOpen: boolean;
  toastType: string;
  toastMessage: string;
}

interface navigationParams {
  id: string;
  measureId: string;
}

const testCaseSeriesStyles = {
  width: "50%",
  // remove weird line break from legend
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8c8c8c",
    borderRadius: "3px",
    "& legend": {
      width: 0,
    },
  },
  "& .MuiOutlinedInput-root": {
    padding: 0,
    "&&": {
      borderRadius: "3px",
    },
  },
  // input base selector
  "& .MuiInputBase-input": {
    resize: "vertical",
    minHeight: "23px",
    fontFamily: "Rubik",
    fontSize: 14,
    borderRadius: "3px",
    padding: "9px 14px",
    "&::placeholder": {
      opacity: 1,
      color: "#717171",
      fontFamily: "Rubik",
      paddingLeft: "5px",
    },
  },
};

interface createNewTestCaseDialogProps {
  open: boolean;
  onClose: (boolean) => void;
  measure?: Measure;
}

const CreateNewTestCaseDialog = ({
  open,
  onClose,
  measure,
}: createNewTestCaseDialogProps) => {
  const [toast, setToast] = useState<Toast>({
    toastOpen: false,
    toastType: "danger",
    toastMessage: "",
  });
  const { toastOpen, toastType, toastMessage } = toast;
  const testCaseService = useRef(useTestCaseServiceApi());
  const { id, measureId } = useParams<
    keyof navigationParams
  >() as navigationParams;

  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });

  // style utilities
  const row = {
    display: "flex",
    flexDirection: "row",
  };
  const spaced = {
    marginTop: "23px",
  };
  const formRow = Object.assign({}, row, spaced);

  const INITIAL_VALUES = {
    title: "",
    description: "",
    series: "",
  } as TestCase;

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES },
    validationSchema: TestCaseValidator,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });

  useEffect(() => {
    if (!seriesState.loaded) {
      testCaseService.current
        .getTestCaseSeriesForMeasure(measureId)
        .then((existingSeries) =>
          setSeriesState({ loaded: true, series: existingSeries })
        )
        .catch((error) => {
          console.error(error.message);
          setToast({
            toastOpen: true,
            toastType: "danger",
            toastMessage: error.message,
          });
        });
    }
  }, [id, measureId, testCaseService, seriesState.loaded]);

  const handleSubmit = async (testCase: TestCase) => {
    setToast({
      toastOpen: false,
      toastType: "danger",
      toastMessage: "",
    });
    testCase.title = sanitizeUserInput(testCase.title);
    testCase.description = sanitizeUserInput(testCase.description);
    testCase.series = sanitizeUserInput(testCase.series);

    if (measure?.model?.includes("QDM")) {
      testCase = defaultTestCaseJson(testCase);
    }

    await createTestCase(testCase);
  };

  const createTestCase = async (testCase: TestCase) => {
    try {
      const savedTestCase = await testCaseService.current.createTestCase(
        testCase,
        measureId
      );
      handleTestCaseResponse(savedTestCase);
    } catch (error) {
      setToast({
        toastOpen: true,
        toastType: "danger",
        toastMessage:
          "An error occurred while creating the test case: " + error.message,
      });
    }
  };

  async function handleTestCaseResponse(testCase: TestCase) {
    if (testCase && testCase.id) {
      formik.resetForm();
      setToast({
        toastOpen: false,
        toastType: "danger",
        toastMessage: "",
      });

      const event = new Event("createTestCase");
      window.dispatchEvent(event);

      onClose(true);
    }
  }

  function formikErrorHandler(name: string) {
    if (formik.touched[name] && formik.errors[name]) {
      return `${formik.errors[name]}`;
    }
  }

  return (
    <div data-testid="create-test-case-dialog">
      <MadieDialog
        form
        title="Create Test Case"
        dialogProps={{
          onClose,
          open,
          onSubmit: formik.handleSubmit,
        }}
        cancelButtonProps={{
          variant: "secondary",
          cancelText: "Cancel",
          "data-testid": "create-test-case-cancel-button",
        }}
        continueButtonProps={{
          variant: "cyan",
          type: "submit",
          "data-testid": "create-test-case-save-button",
          disabled: !(formik.isValid && formik.dirty),
          continueText: "Save",
        }}
      >
        <>
          <Toast
            toastKey="test-case-create-toast"
            toastType={toastType}
            testId={
              toastType === "danger"
                ? "server-error-alerts"
                : "test-case-create-success-text"
            }
            open={toastOpen}
            message={toastMessage}
            onClose={() => {
              setToast({
                toastOpen: false,
                toastType: "danger",
                toastMessage: "",
              });
            }}
            closeButtonProps={{
              "data-testid": "close-error-button",
            }}
            autoHideDuration={6000}
          />
          <div
            style={{
              marginBottom: -15,
              marginTop: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              style={{ fontSize: 14, fontWeight: 300, fontFamily: "Rubik" }}
            >
              <span
                style={{
                  color: "rgb(174, 28, 28)",
                  marginRight: 3,
                  fontWeight: 400,
                }}
              >
                *
              </span>
              Indicates required field
            </Typography>
          </div>
          <Box sx={formRow}>
            <TextField
              placeholder="Enter Title"
              required
              label="Title"
              id="create-test-case-title"
              inputProps={{
                "data-testid": "create-test-case-title-input",
                "aria-describedby": "create-test-case-title-helper-text",
                "aria-required": true,
                required: true,
              }}
              helperText={formikErrorHandler("title")}
              data-testid="create-test-case-title"
              size="small"
              error={formik.touched.title && Boolean(formik.errors.title)}
              {...formik.getFieldProps("title")}
            />
          </Box>

          <Box sx={formRow}>
            <TextArea
              label="Description"
              required={false}
              name="create-test-case-description"
              id="create-test-case-description"
              inputProps={{
                "data-testid": "create-test-case-description-input",
              }}
              onChange={formik.handleChange}
              value={formik.values.description}
              placeholder="Enter Description"
              data-testid="create-test-case-description"
              {...formik.getFieldProps("description")}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={formikErrorHandler("description")}
            />
          </Box>

          <InputLabel
            style={{
              marginTop: "23px",
              textTransform: "capitalize",
              fontFamily: "Rubik",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgb(51, 51, 51)",
            }}
            htmlFor="test-case-series"
          >
            Test Case Group
          </InputLabel>

          <TestCaseSeries
            value={formik.values.series}
            onChange={(nextValue) => formik.setFieldValue("series", nextValue)}
            seriesOptions={seriesState.series}
            sx={testCaseSeriesStyles}
          />
        </>
      </MadieDialog>
    </div>
  );
};

export default CreateNewTestCaseDialog;
