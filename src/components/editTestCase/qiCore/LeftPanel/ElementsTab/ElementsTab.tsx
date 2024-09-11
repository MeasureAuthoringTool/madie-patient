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

  useEffect(() => {
    if (
      !_.isEmpty(editorVal) &&
      editorVal !== "Loading..." &&
      (_.isNil(lastJsonRef.current) || editorVal !== lastJsonRef.current)
    ) {
      lastJsonRef.current = editorVal;
      const bundle = JSON.parse(editorVal);
      dispatch({
        type: ResourceActionType.LOAD_BUNDLE,
        payload: bundle,
      });
    }
  }, [dispatch, editorVal]);

  useEffect(() => {
    const bundleStr = JSON.stringify(state?.bundle, null, 2);
    if (state.bundle && !_.isEmpty(bundleStr) && bundleStr !== editorVal) {
      lastJsonRef.current = bundleStr;
      setEditorVal(bundleStr);
    }
  }, [state]);

  return (
    <>
      <Builder testCase={testCase} canEdit={canEdit} />
    </>
  );
};

export default ElementsTab;
