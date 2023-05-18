import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLandingQdm from "../../testCaseLanding/TestCaseLandingQdm";
import EditTestCase from "../../editTestCase/qdm/EditTestCase";
import NotFound from "../../notfound/NotFound";
import StatusHandler from "../../statusHandler/StatusHandler";
import { Measure } from "@madie/madie-models";
import { measureStore } from "@madie/madie-util";
import { ExecutionContextProvider } from "../qiCore/ExecutionContext";
import { Bundle, ValueSet } from "fhir/r4";

const TestCaseRoutes = () => {
  const [errors, setErrors] = useState<Array<string>>([]);

  // Following states are initialized just to provide them as props to contextProvider
  // we may need a new context provider for QDM
  const [executionContextReady, setExecutionContextReady] =
    useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>();
  const [measureBundle, setMeasureBundle] = useState<Bundle>();
  const [valueSets, setValueSets] = useState<ValueSet[]>();

  const [measure, setMeasure] = useState<Measure>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Setup a context provider which holds measure state, cqmMeasure and valueSets similar to QiCore/TestCaseRoutes
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
      {errors && errors.length > 0 && (
        <StatusHandler
          error={true}
          errorMessages={errors}
          testDataId="execution_context_loading_errors"
        />
      )}
      <Routes>
        <Route path="/measures/:measureId/edit/test-cases">
          <Route
            index
            element={
              <TestCaseLandingQdm errors={errors} setErrors={setErrors} />
            }
          />
          <Route
            path=":id"
            element={<EditTestCase errors={errors} setErrors={setErrors} />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ExecutionContextProvider>
  );
};

export default TestCaseRoutes;
