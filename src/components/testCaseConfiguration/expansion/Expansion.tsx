import React, { useEffect, useState } from "react";
import {
  Button,
  RadioButton,
  MadieDiscardDialog,
  Toast,
  Select,
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
import { MenuItem, Typography } from "@mui/material";
import * as Yup from "yup";

const Expansion = () => {
  const [measure, setMeasure] = useState<Measure>(measureStore.state);
  const measureServiceApi = useMeasureServiceApi();
  const { updateMeasure } = measureStore;

  const { updateRouteHandlerState } = routeHandlerStore;

  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("");

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

  const onToastClose = () => {
    setToastType("danger");
    setToastMessage("");
    setToastOpen(false);
  };
  const handleToast = (type: string, message: string, open: boolean) => {
    setToastType(type);
    setToastMessage(message);
    setToastOpen(open);
  };

  // Todo MAT-6736 will fetch the actual values from VSAC
  const manifestOptions = [
    {
      label: "ecqm-update-4q2017-eh",
      value: "https://cts.nlm.nih.gov/fhir/Library/ecqm-update-4q2017-eh",
    },
    {
      label: "mu2-update-2012-10-25",
      value: "https://cts.nlm.nih.gov/fhir/Library/mu2-update-2012-10-25",
    },
    {
      label: "mu2-update-2012-12-21",
      value: "https://cts.nlm.nih.gov/fhir/Library/mu2-update-2012-12-21",
    },
  ];

  const formik = useFormik({
    initialValues: {
      isManifestExpansion:
        !!measure?.testCaseConfiguration?.manifestExpansion?.id,
      manifestExpansionId:
        measure?.testCaseConfiguration?.manifestExpansion?.id || "",
    },
    validationSchema: Yup.object().shape({
      manifestExpansionId: Yup.string().when("isManifestExpansion", {
        is: true,
        then: Yup.string().required("Manifest Expansion is required"),
      }),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  const handleSubmit = async (values) => {
    debugger;
    console.log("this is called", values);
    let updatedMeasure: Measure;
    if (values?.isManifestExpansion) {
      const selectedManifest = manifestOptions.find(
        (manifestOption) => manifestOption.label === values.manifestExpansionId
      );
      updatedMeasure = {
        ...measure,
        testCaseConfiguration: {
          ...measure.testCaseConfiguration,
          manifestExpansion: {
            fullUrl: selectedManifest.value,
            id: selectedManifest.label,
          },
        },
      };
    } else {
      updatedMeasure = {
        ...measure,
        testCaseConfiguration: {
          ...measure.testCaseConfiguration,
          manifestExpansion: null,
        },
      };
    }
    measureServiceApi
      .updateMeasure(updatedMeasure)
      .then(() => {
        handleToast("success", "Expansion details Updated Successfully", true);
        // updating measure will propagate update state site wide.
        updateMeasure(updatedMeasure);
      })
      // update to alert
      .catch((err) => {
        handleToast(
          "danger",
          "Error updating Expansion details: " +
            err?.response?.data?.message?.toString(),
          true
        );
      });
  };

  useEffect(() => {
    updateRouteHandlerState({
      canTravel: !formik.dirty,
      pendingRoute: "",
    });
  }, [formik.dirty]);

  return (
    <form
      id="manifest-expansion-form"
      data-testid={`manifest-expansion-form`}
      className="test-case-config-form"
      onSubmit={formik.handleSubmit}
    >
      <div className="form-title">
        <h2>Expansion</h2>
        <Typography>
          <span>*</span>
          Indicates required field
        </Typography>
      </div>
      <div className="form-elements">
        <div className="radio-button-group">
          <RadioButton
            row
            id="manifest-expansion"
            label="Choose Type"
            required
            options={[
              { label: "Latest", value: false },
              { label: "Manifest", value: true },
            ]}
            disabled={!canEdit}
            value={formik.values.isManifestExpansion}
            onChange={(e) =>
              formik.setFieldValue(
                "isManifestExpansion",
                e.target.value === "true"
              )
            }
          />
        </div>
        {formik.values.isManifestExpansion === true && (
          <div className="select">
            <Select
              required
              label="Manifest"
              id="manifest-select"
              data-testid="manifest-select"
              inputProps={{ "data-testid": "manifest-select-input" }}
              name="manifest"
              {...formik.getFieldProps("manifestExpansionId")}
              SelectDisplayProps={{
                "aria-required": "true",
              }}
              disabled={!canEdit}
              error={
                formik.touched.manifestExpansionId &&
                Boolean(formik.errors.manifestExpansionId)
              }
              helperText={
                formik.touched.manifestExpansionId &&
                formik.errors.manifestExpansionId
              }
              size="small"
              options={manifestOptions.map((manifestOption) => {
                return (
                  <MenuItem
                    key={manifestOption.label}
                    value={manifestOption.label}
                    data-testid={`manifest-option-${manifestOption.label}`}
                  >
                    {manifestOption.label}
                  </MenuItem>
                );
              })}
            />
          </div>
        )}
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          disabled={!formik.dirty || !canEdit}
          data-testid="manifest-expansion-discard-changes-button"
          onClick={() => setDiscardDialogOpen(true)}
          className="cancel-button"
        >
          Discard Changes
        </Button>
        <Button
          variant="cyan"
          disabled={!(formik.isValid && formik.dirty) || !canEdit}
          data-testid="manifest-expansion-save-button"
          type="submit"
          className="save-button"
        >
          Save
        </Button>
      </div>
      <Toast
        toastKey="manifest-expansion-toast"
        aria-live="polite"
        toastType={toastType}
        testId={
          toastType === "danger"
            ? "manifest-expansion-generic-error-text"
            : "manifest-expansion-success-text"
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
export default Expansion;
