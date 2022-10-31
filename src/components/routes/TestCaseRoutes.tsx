import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Alert } from "@mui/material";
import TestCaseLanding from "../testCaseLanding/TestCaseLanding";
import EditTestCase from "../editTestCase/EditTestCase";
import NotFound from "../notfound/NotFound";
import { measureStore } from "@madie/madie-util";
import { Bundle, ValueSet } from "fhir/r4";
import useTerminologyServiceApi from "../../api/useTerminologyServiceApi";
import { ExecutionContextProvider } from "./ExecutionContext";
import useMeasureServiceApi from "../../api/useMeasureServiceApi";

const TestCaseRoutes = () => {
  const [measureBundle, setMeasureBundle] = useState<Bundle>();
  const [valueSets, setValueSets] = useState<ValueSet[]>();
  const [errors, setErrors] = useState<string>();
  const [executionContextReady, setExecutionContextReady] = useState<boolean>();
  const [executing, setExecuting] = useState<boolean>();

  const terminologyService = useRef(useTerminologyServiceApi());
  const measureService = useRef(useMeasureServiceApi());

  const [measure, setMeasure] = useState<any>();
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (measure) {
      setErrors(null);
      measureService.current
        .fetchMeasureBundle(measure)
        .then((bundle: Bundle) => {
          setMeasureBundle(bundle);
        })
        .catch((err) => {
          setErrors(err.message);
        });
    }
  }, [measure]);

  useEffect(() => {
    if (measureBundle) {
      terminologyService.current
        .getValueSetsExpansion(measureBundle)
        .then((vs: ValueSet[]) => {
          setValueSets(vs);
        })
        .catch((err) => {
          setErrors(err.message);
        });
    }
  }, [measureBundle]);

  useEffect(() => {
    setExecutionContextReady(!!measureBundle && !!valueSets && !!measure);
  }, [measureBundle, measure, valueSets]);

  return (
    <ExecutionContextProvider
      value={{
        measureState: [measure, setMeasure],
        bundleState: [measureBundle, setMeasureBundle],
        valueSetsState: [valueSets, setValueSets],
        executionContextReady,
        executing,
        setExecuting,
      }}
    >
      {errors && (
        <Alert data-testid="execution_context_loading_errors" severity="error">
          {errors}
        </Alert>
      )}
      <Routes>
        <Route path="/measures/:measureId/edit/test-cases">
          <Route index element={<TestCaseLanding />} />
          <Route path="edit" element={<EditTestCase />} />
          <Route path=":id" element={<EditTestCase />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ExecutionContextProvider>
  );
};

export default TestCaseRoutes;
