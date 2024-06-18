import React, { useEffect, useState } from "react";
import {
  Button,
  RadioButton,
  MadieDiscardDialog,
  Toast,
} from "@madie/madie-design-system/dist/react";
import { useFormik } from "formik";
import { Measure } from "@madie/madie-models";
import {
  measureStore,
  checkUserCanEdit,
  routeHandlerStore,
} from "@madie/madie-util";
import "../testCaseConfiguration.scss";
import useMeasureServiceApi from "../../../api/useMeasureServiceApi";
import { Typography } from "@mui/material";
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";

const TestCaseData = () => {
  const { setExecutionContextReady } = useQdmExecutionContext();
  const [measure, setMeasure] = useState<any>(measureStore.state);
  const measureServiceApi = useMeasureServiceApi();
  const { updateMeasure } = measureStore;
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
    initialValues: { shiftTestCaseDates: null },
    onSubmit: async () => await handleSubmit(),
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

  const handleSubmit = async () => {
    // const newMeasure: Measure = {
    //   ...measure,
    //   testCaseConfiguration: {
    //     ...measure.testCaseConfiguration,
    //     sdeIncluded: formik.values.sdeIncluded,
    //   },
    // };
    //
    // measureServiceApi
    //   .updateMeasure(newMeasure)
    //   .then(() => {
    //     handleToast(
    //       "success",
    //       "Test Case Configuration Updated Successfully",
    //       true
    //     );
    //     // To disable Run test case button, until cqmMeasure is rebuilt
    //     setExecutionContextReady(false);
    //     // updating measure will propagate update state site wide.
    //     updateMeasure(newMeasure);
    //   })
    //   // update to alert
    //   .catch((err) => {
    //     handleToast(
    //       "danger",
    //       "Error updating Test Case Configuration: " +
    //         err?.response?.data?.message?.toString(),
    //       true
    //     );
    //   });
  };

  const [value, setValue] = React.useState(null);

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
      <div className="form-elements" data-testId="test-case-data-page">
        <div></div>
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
          data-testid={`sde-save`}
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
