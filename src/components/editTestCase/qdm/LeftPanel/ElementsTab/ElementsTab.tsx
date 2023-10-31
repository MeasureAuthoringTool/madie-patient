import React, { useEffect, useRef } from "react";
import DemographicsSection from "./Demographics/DemographicsSection";
import ElementsSection from "./Elements/ElementsSection";
import {
  PatientActionType,
  useQdmPatient,
} from "../../../../../util/QdmPatientContext";
import { useFormikContext } from "formik";
import * as _ from "lodash";
import { QDMPatient } from "cqm-models";

const ElementsTab = (props: {
  canEdit: boolean;
  handleTestCaseErrors: Function;
}) => {
  const { canEdit, handleTestCaseErrors } = props;
  const { state, dispatch } = useQdmPatient();
  const formik: any = useFormikContext();
  const lastJsonRef = useRef(null);

  useEffect(() => {
    if (
      !_.isEmpty(formik.values.json) &&
      (_.isNil(lastJsonRef.current) ||
        formik.values.json !== lastJsonRef.current)
    ) {
      lastJsonRef.current = formik.values.json;
      const patient = new QDMPatient(JSON.parse(formik.values.json));
      dispatch({
        type: PatientActionType.LOAD_PATIENT,
        payload: patient,
      });
    }
  }, [dispatch, formik.values.json]);

  useEffect(() => {
    const patientStr = JSON.stringify(state?.patient);
    if (state.patient && formik.values && patientStr !== formik?.values?.json) {
      lastJsonRef.current = patientStr;
      formik.setFieldValue("json", patientStr);
    }
  }, [state]);

  return (
    <>
      <DemographicsSection canEdit={canEdit} />
      <ElementsSection handleTestCaseErrors={handleTestCaseErrors} />
    </>
  );
};
export default ElementsTab;
