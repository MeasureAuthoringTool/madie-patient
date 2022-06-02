import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
  const [valueSetErrors, setValueSetErrors] = useState<string[]>();
  const [bundleErrors, setBundleErrors] = useState<string[]>();

  const terminologyService = useRef(useTerminologyServiceApi());
  const measureService = useRef(useMeasureServiceApi());

  useEffect(() => {
    if (measure && !measure.cqlErrors && measure.elmJson) {
      measureService.current
        .fetchMeasureBundle(measure?.id)
        .then((bundle: Bundle) => {
          setMeasureBundle(bundle);
        })
        .catch((err) => {
          setBundleErrors(err.message);
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
          setValueSetErrors(err.message);
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
