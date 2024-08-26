import React, { useEffect, useRef } from "react";
import {
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../util/QiCorePatientProvider";
import _ from "lodash";
import Builder from "./builder/Builder";

const ElementsTab = ({ canEdit, setEditorVal, editorVal, testCase }) => {
  const { state, dispatch } = useQiCoreResource();
  const lastJsonRef = useRef(null);

  const standardizeJson = (editorVal) => {
    try {
      return JSON.parse(editorVal);
    } catch (e) {
      return editorVal;
    }
  };
  useEffect(() => {
    if (
      !_.isEmpty(editorVal) &&
      editorVal !== "Loading..." &&
      (_.isNil(lastJsonRef.current) || editorVal !== lastJsonRef.current)
    ) {
      lastJsonRef.current = editorVal;
      const resource = standardizeJson(editorVal);
      dispatch({
        type: ResourceActionType.LOAD_RESOURCE,
        payload: resource,
      });
    }
  }, [dispatch, editorVal]);

  useEffect(() => {
    const patientStr =
      state?.resource !== editorVal
        ? JSON.stringify(state?.resource, null, 2)
        : state?.resource;
    if (state.resource && editorVal && patientStr !== editorVal) {
      lastJsonRef.current = patientStr;
      setEditorVal(patientStr);
    }
  }, [state]);

  return <Builder testCase={testCase} />;
};

export default ElementsTab;
