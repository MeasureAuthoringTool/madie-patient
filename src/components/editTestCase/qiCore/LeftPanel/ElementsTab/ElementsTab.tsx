import React, { useEffect, useRef } from "react";
import DemographicsSection from "./Demographics/DemographicsSection";
import ElementsSection from "./Elements/ElementsSection";
import { useFormikContext } from "formik";
import {
  QiCoreResourceProvider,
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../util/QiCorePatientProvider";
import _ from "lodash";
import { useQdmPatient } from "../../../../../util/QdmPatientContext";

const ElementsTab = ({ canEdit, setEditorVal, editorVal }) => {
  const { state, dispatch } = useQiCoreResource();
  const lastJsonRef = useRef(null);

  useEffect(() => {
    if (
      !_.isEmpty(editorVal) &&
      editorVal !== "Loading..." &&
      (_.isNil(lastJsonRef.current) || editorVal !== lastJsonRef.current)
    ) {
      lastJsonRef.current = editorVal;
      const resource = JSON.parse(editorVal);
      dispatch({
        type: ResourceActionType.LOAD_RESOURCE,
        payload: resource,
      });
    }
  }, [dispatch, editorVal]);

  useEffect(() => {
    const patientStr = JSON.stringify(state?.resource, null, 2);
    if (state.resource && editorVal && patientStr !== editorVal) {
      lastJsonRef.current = patientStr;
      setEditorVal(patientStr);
    }
  }, [state]);

  return (
    <>
      <DemographicsSection
        canEdit={canEdit}
        // setEditorVal={setEditorVal}
        // editorVal={editorVal}
      />
      <ElementsSection canEdit={canEdit} />
    </>
  );
};

export default ElementsTab;
