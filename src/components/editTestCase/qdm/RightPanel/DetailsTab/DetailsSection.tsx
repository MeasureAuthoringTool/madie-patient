import React, { useEffect, useState, useRef } from "react";
import ElementSection from "../../LeftPanel/ElementsTab/ElementSection";
import { useFormikContext } from "formik";
import { TextField, InputLabel } from "@madie/madie-design-system/dist/react";
import TextArea from "../../../../createTestCase/TextArea";
import TestCaseSeries from "../../../../createTestCase/TestCaseSeries";
import { useParams } from "react-router-dom";
import useTestCaseServiceApi from "../../../../../api/useTestCaseServiceApi";

import "./DetailsSection.scss";
import { InputLabelStyle, seriesStyles } from "./DetailsSectionStyles";

interface DetailsSectionProps {
  canEdit: Boolean;
  measureName: string;
  // to do, hook up alert/error if needed
  // setErrors: Function;
  // setAlert: Function;
}
const DetailsSection = (props: DetailsSectionProps) => {
  const { measureId, id } = useParams();
  const { canEdit, measureName } = props;
  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });

  const formik: any = useFormikContext();
  const testCaseService = useRef(useTestCaseServiceApi());

  useEffect(() => {
    if (!seriesState.loaded) {
      testCaseService.current
        .getTestCaseSeriesForMeasure(measureId)
        .then((existingSeries) =>
          setSeriesState({ loaded: true, series: existingSeries })
        )
        .catch((error) => {
          // to do: handle error. Probably copy our QI-core pattern. pass setError/SetAlert down
          //   setAlert(() => ({
          //     status: "error",
          //     message: error.message,
          //   }));
          //   setErrors([...errors, error.message]);
        });
    }
  }, [id, measureId, testCaseService, seriesState.loaded]);
  function formikErrorHandler(name: string) {
    if (formik.touched[name] && formik.errors[name]) {
      return `${formik.errors[name]}`;
    }
  }
  return (
    <ElementSection
      title={measureName}
      children={
        <div data-testId="qdm-details-section" id="qdm-details-section">
          <TextField
            label="Title"
            placeholder="Test Case Title"
            required
            disabled={!canEdit}
            id="test-case-title"
            inputProps={{
              "data-testid": "test-case-title",
              "aria-describedby": "title-helper-text",
            }}
            helperText={formikErrorHandler("title")}
            size="small"
            error={formik.touched.title && Boolean(formik.errors.title)}
            {...formik.getFieldProps("title")}
          />
          <TextArea
            placeholder="Test Case Description"
            id="test-case-description"
            data-testid="edit-test-case-description"
            disabled={!canEdit}
            {...formik.getFieldProps("description")}
            label="Description"
            required={false}
            inputProps={{
              "data-testid": "test-case-description",
              "aria-describedby": "description-helper-text",
            }}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formikErrorHandler("description")}
          />
          <div>
            <InputLabel
              htmlFor={"test-case-series"}
              style={{ marginBottom: 8, height: 16 }}
              sx={InputLabelStyle}
              disabled={!canEdit}
            >
              Groups
            </InputLabel>
            <TestCaseSeries
              disabled={!canEdit}
              value={formik?.values?.series || ""} // this additional check is needed since formik is blank and undefined breaks update
              onChange={(nextValue) =>
                formik.setFieldValue("series", nextValue)
              }
              seriesOptions={seriesState.series}
              sx={seriesStyles}
            />
          </div>
        </div>
      }
    />
  );
};

export default DetailsSection;
