import React, { useEffect, useState } from "react";
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

const TestCaseData = () => {
  const [measure, setMeasure] = useState<any>(measureStore.state);
  const { updateRouteHandlerState } = routeHandlerStore;
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");

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

  const handleSubmit = async (values) => {};

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
      <div className="form-elements">
        <NumberInput
          label="Shift Test Case Dates"
          id="shift-test-case-dates"
          disabled={!canEdit || _.isEmpty(measure?.testCases)}
          value={formik.values.shiftTestCaseDates}
          onChange={(e) => {
            formik.setFieldValue("shiftTestCaseDates", e.target.value);
          }}
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
        <Button
          variant="cyan"
          disabled={!(formik.isValid && formik.dirty) || !canEdit}
          data-testid={`test-case-data-save`}
          type="submit"
          className="save-button"
        >
          Save
        </Button>
      </div>
      <Toast
        toastKey="sde-toast"
        aria-live="polite"
        toastType={toastType}
        testId={
          toastType === "danger"
            ? "edit-sde-generic-error-text"
            : "edit-sde-success-text"
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
