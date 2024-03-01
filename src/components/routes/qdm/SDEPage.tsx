import React, { useEffect, useState } from "react";
import {
  Button,
  RadioButton,
  MadieDiscardDialog,
  Toast,
} from "@madie/madie-design-system/dist/react";
import { useFormik, useFormikContext } from "formik";
import { Measure } from "@madie/madie-models";
import {
  measureStore,
  checkUserCanEdit,
  routeHandlerStore,
} from "@madie/madie-util";
import useMeasureServiceApi from "../../../api/useMeasureServiceApi";
import "./SDEPage.scss";

interface SDEForm {
  sdeIncluded: string;
}

const SDEPage = () => {
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
    initialValues: {
      sdeIncluded: measure?.testCaseConfiguration?.sdeIncluded || false,
    },
    enableReinitialize: true,
    onSubmit: async () => await handleSubmit(),
  });
  const { resetForm } = formik;

  useEffect(() => {
    updateRouteHandlerState({
      canTravel: !formik.dirty,
      pendingRoute: "",
    });
  }, [formik.dirty]);

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

  const onCancel = () => {
    setDiscardDialogOpen(true);
  };

  const handleSubmit = async () => {
    const newMeasure: Measure = {
      ...measure,
      testCaseConfiguration: {
        sdeIncluded: formik.values.sdeIncluded,
      },
    };

    measureServiceApi
      .updateMeasure(newMeasure)
      .then(() => {
        handleToast(
          "success",
          "Test Case Configuration Updated Successfully",
          true
        );
        // updating measure will propagate update state site wide.
        updateMeasure(newMeasure);
      })
      // update to alert
      .catch((err) => {
        handleToast(
          "danger",
          "Error updating Test Case Configuration: " +
            err?.response?.data?.message?.toString(),
          true
        );
      });
  };

  return (
    <form
      id="sde-form"
      onSubmit={handleSubmit}
      data-testid={`sde-form`}
      style={{ minHeight: 539 }}
    >
      <div className="content">
        <div className="subTitle">
          <h2>SDE</h2>
        </div>
        <div className="sde-page" data-testId="sde-page">
          <RadioButton
            row
            id="sde-option"
            dataTestId="sde-option"
            label="Include Supplemental Data"
            required
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            value={formik.values.sdeIncluded}
            onChange={(e) => {
              const nextSdeIncluded = e.target.value;
              formik.setFieldValue("sdeIncluded", nextSdeIncluded);
            }}
            disabled={!canEdit}
          />
        </div>
        {canEdit && (
          <div
            className="form-actions"
            style={{ display: "flex", float: "right", paddingRight: 16 }}
          >
            <Button
              variant="outline"
              disabled={!formik.dirty}
              data-testid="cancel-button"
              onClick={onCancel}
              style={{ marginTop: 20, float: "right", marginRight: 32 }}
            >
              Discard Changes
            </Button>
            <Button
              disabled={!(formik.isValid && formik.dirty)}
              type="submit"
              variant="cyan"
              data-testid={`sde-save`}
              style={{ marginTop: 20, float: "right" }}
            >
              Save
            </Button>
          </div>
        )}
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
      </div>
    </form>
  );
};
export default SDEPage;
