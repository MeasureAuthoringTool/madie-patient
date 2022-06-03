import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Alert } from "@mui/material";
import TestCaseLanding from "../testCaseLanding/TestCaseLanding";
import CreateTestCase from "../createTestCase/CreateTestCase";
import NotFound from "../notfound/NotFound";
import { Measure } from "@madie/madie-models";
import { Bundle, ValueSet } from "fhir/r4";
import useTerminologyServiceApi from "../../api/useTerminologyServiceApi";
import { ExecutionContextProvider } from "./ExecutionContext";
import useMeasureServiceApi from "../../api/useMeasureServiceApi";

const TestCaseRoutes = () => {
  const [measure, setMeasure] = useState<Measure>();
  const [measureBundle, setMeasureBundle] = useState<Bundle>();
  const [valueSets, setValueSets] = useState<ValueSet[]>();
  const [errors, setErrors] = useState<string>();

  const terminologyService = useRef(useTerminologyServiceApi());
  const measureService = useRef(useMeasureServiceApi());

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

  return (
    <ExecutionContextProvider
      value={{
        measureState: [measure, setMeasure],
        bundleState: [measureBundle, setMeasureBundle],
        valueSetsState: [valueSets, setValueSets],
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
          <Route path="create" element={<CreateTestCase />} />
          <Route path=":id" element={<CreateTestCase />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ExecutionContextProvider>
  );
};

export default TestCaseRoutes;
