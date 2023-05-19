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
  // to do, hook up alert/error if needed
  // setErrors: Function;
  // setAlert: Function;
}
const DetailsSection = (props: DetailsSectionProps) => {
  const { measureId, id } = useParams();
  const { canEdit } = props;
  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });

  const formik: any = useFormikContext();
  const testCaseService = useRef(useTestCaseServiceApi());

  console.log("formik.values", formik);

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

  return (
    <ElementSection
      title={formik?.initialValues?.title}
      children={
        <div data-testId="qdm-details-section" id="qdm-details-section">
          <TextField
            label="Title"
            {...formik.getFieldProps("title")}
            required
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
            onChange={formik.handleChange}
            value={formik.values.description}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            // helperText={formikErrorHandler("description")} // todo
          />
          <div>
            <InputLabel
              htmlFor={"test-case-series"}
              style={{ marginBottom: 8, height: 16 }}
              sx={InputLabelStyle}
            >
              Groups
            </InputLabel>
            <TestCaseSeries
              disabled={!canEdit}
              value={formik.values.series}
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
