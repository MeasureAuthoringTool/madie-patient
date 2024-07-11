import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  MadieDiscardDialog,
  Toast,
  NumberInput,
} from "@madie/madie-design-system/dist/react";
import { useFormik } from "formik";
import {
  measureStore,
  checkUserCanEdit,
  routeHandlerStore,
} from "@madie/madie-util";
import "../testCaseConfiguration.scss";
import { Typography } from "@mui/material";
import _ from "lodash";
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";

const TestCaseData = () => {
  const [measure, setMeasure] = useState<any>(measureStore.state);
  const { updateRouteHandlerState } = routeHandlerStore;
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const testCaseService = useRef(useTestCaseServiceApi());

  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const canEdit = checkUserCanEdit(
    measure?.measureSet?.owner,
    measure?.measureSet?.acls,
    measure?.measureMetaData?.draft
  );

  const formik = useFormik({
    initialValues: { shiftTestCaseDates: "" },
    validationSchema: Yup.object().shape({
      shiftTestCaseDates: Yup.string().required(
        "Must be a valid number of years"
      ),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  useEffect(() => {
    updateRouteHandlerState({
      canTravel: !formik.dirty,
      pendingRoute: "",
    });
  }, [formik.dirty, updateRouteHandlerState]);

  const onToastClose = () => {
    setToastType("danger");
    setToastMessage("");
    setToastOpen(false);
  };
  const handleToast = (type, message, open) => {
    setToastType(type);
    setToastMessage(message);
    setToastOpen(open);
  };

  const handleSubmit = async (values) => {
    testCaseService.current
      .shiftAllTestCaseDates(
        measure.id,
        parseInt(formik.values.shiftTestCaseDates)
      )
      .then(() => {
        setToastOpen(true);
        setToastType("success");
        setToastMessage(
          `Test Case Shift Dates for measure: ${measure.id} successful.`
        );
      })
      .catch((err) => {
        setToastOpen(true);
        setToastType("danger");
        setToastMessage(
          `Unable to shift test Case dates for measure: ${measure.id}. Please try again. If the issue continues, please contact helpdesk.`
        );
      });
  };

  return (
    <form
      id="test-case-data-form"
      data-testid={`test-case-data-form`}
      className="test-case-config-form"
      onSubmit={formik.handleSubmit}
    >
      <div className="form-title">
        <h2>Test Case Data</h2>
        <Typography>
          <span>*</span>
          Indicates required field
        </Typography>
      </div>
      <span className="helper-info-text">
        Shift dates on this test case by the number of years being changed.
        Entering a negative number will shift the test cases years backwards.
        Feb 29 in Leap Years - Feb 28 in non Leap Years
      </span>
      <div className="form-elements">
        <NumberInput
          className="input-field"
          label="Shift Test Case Dates"
          id="shift-test-case-dates"
          placeholder="# of Years"
          disabled={!canEdit || _.isEmpty(measure?.testCases)}
          {...formik.getFieldProps("shiftTestCaseDates")}
          error={
            formik.touched.shiftTestCaseDates &&
            Boolean(formik.errors.shiftTestCaseDates)
          }
          helperText={
            formik.touched.shiftTestCaseDates &&
            formik.errors.shiftTestCaseDates
          }
          title={_.isEmpty(measure?.testCases) && "No Test Cases Available"}
        />
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          disabled={!formik.dirty || !canEdit}
          data-testid="cancel-button"
          onClick={() => setDiscardDialogOpen(true)}
          className="cancel-button"
        >
          Discard Changes
        </Button>
        <Tooltip
          title={_.isEmpty(measure?.testCases) && "No Test Cases Available"}
        >
          <span>
            <Button
              variant="cyan"
              disabled={!(formik.isValid && formik.dirty) || !canEdit}
              data-testid={`test-case-data-save`}
              type="submit"
              className="save-button"
            >
              Save
            </Button>
          </span>
        </Tooltip>
      </div>
      <Toast
        toastKey="shift-all-test-case-dates-toast"
        aria-live="polite"
        toastType={toastType}
        testId={
          toastType === "danger"
            ? "shift-all-test-case-dates-generic-error-text"
            : "shift-all-test-case-dates-success-text"
        }
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={10000}
        closeButtonProps={{
          "data-testid": "close-error-button",
        }}
      />
      <MadieDiscardDialog
        open={discardDialogOpen}
        onContinue={() => {
          resetForm();
          setDiscardDialogOpen(false);
        }}
        onClose={() => {
          setDiscardDialogOpen(false);
        }}
      />
    </form>
  );
};
export default TestCaseData;
