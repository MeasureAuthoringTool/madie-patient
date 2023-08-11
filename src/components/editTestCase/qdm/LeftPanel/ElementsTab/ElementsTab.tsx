import React, { useEffect } from "react";
import DemographicsSection from "./Demographics/DemographicsSection";
import ElementsSection from "./Elements/ElementsSection";
import {
  PatientActionType,
  useQdmPatient,
} from "../../../../../util/QdmPatientContext";
import { useFormikContext } from "formik";
import * as _ from "lodash";
import { QDMPatient } from "cqm-models";

const ElementsTab = ({ canEdit }) => {
  const { state, dispatch } = useQdmPatient();
  const formik: any = useFormikContext();

  useEffect(() => {
    if (!_.isEmpty(formik.values?.title) && _.isNil(state.patient)) {
      const patient = formik.values.json
        ? JSON.parse(formik.values.json)
        : new QDMPatient();
      dispatch({
        action: PatientActionType.LOAD_PATIENT,
        payload: patient,
      });
    }
  }, [formik.values?.json, formik.values?.title]);

  return (
    <>
      <DemographicsSection canEdit={canEdit} />
      <ElementsSection />
    </>
  );
};
export default ElementsTab;
