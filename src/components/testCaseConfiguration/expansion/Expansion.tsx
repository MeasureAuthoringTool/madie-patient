import React, { useEffect, useState } from "react";
import {
  Button,
  RadioButton,
  MadieDiscardDialog,
  Toast,
  Select,
} from "@madie/madie-design-system/dist/react";
import { useFormik } from "formik";
import { ManifestExpansion, Measure } from "@madie/madie-models";
import {
  measureStore,
  checkUserCanEdit,
  routeHandlerStore,
} from "@madie/madie-util";
import "../testCaseConfiguration.scss";
import useMeasureServiceApi from "../../../api/useMeasureServiceApi";
import { MenuItem, Typography } from "@mui/material";
import * as Yup from "yup";
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";
import useTerminologyServiceApi from "../../../api/useTerminologyServiceApi";

const Expansion = () => {
  const { setExecutionContextReady } = useQdmExecutionContext();
  const [measure, setMeasure] = useState<Measure>(measureStore.state);
  const [manifestOptions, setManifestOptions] = useState<ManifestExpansion[]>(
    []
  );
  const measureServiceApi = useMeasureServiceApi();
  const terminologyServiceApi = useTerminologyServiceApi();
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
    let updatedMeasure: Measure;
    if (values?.isManifestExpansion) {
      const selectedManifest = manifestOptions.find(
        (manifestOption) => manifestOption.id === values.manifestExpansionId
      );
      updatedMeasure = {
        ...measure,
        testCaseConfiguration: {
          ...measure.testCaseConfiguration,
          manifestExpansion: {
            fullUrl: selectedManifest.fullUrl,
            id: selectedManifest.id,
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

  // Fetch the list of manifests available in VSAC
  // List is fetched only when manifest option is selected,
  // The result is cached at service level in the backend
  useEffect(() => {
    if (formik.values.isManifestExpansion === true) {
      terminologyServiceApi
        .getManifestList()
        .then((response) => {
          setManifestOptions(response.data);
        })
        .catch((error) => {
          handleToast(
            "danger",
            "Error fetching Manifest options : " +
              error?.response?.data?.message?.toString(),
            true
          );
        });
    }

    if (
      formik.values.isManifestExpansion ===
      formik.initialValues.isManifestExpansion
    ) {
      resetForm();
    }
  }, [formik.values.isManifestExpansion]);

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
              options={manifestOptions?.map((manifestOption) => {
                return (
                  <MenuItem
                    key={manifestOption.id}
                    value={manifestOption.id}
                    data-testid={`manifest-option-${manifestOption.id}`}
                  >
                    {manifestOption.id}
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
