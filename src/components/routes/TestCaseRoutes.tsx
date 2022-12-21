import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLanding from "../testCaseLanding/TestCaseLanding";
import EditTestCase from "../editTestCase/EditTestCase";
import NotFound from "../notfound/NotFound";
import { measureStore } from "@madie/madie-util";
import { Bundle, ValueSet } from "fhir/r4";
import useTerminologyServiceApi from "../../api/useTerminologyServiceApi";
import { ExecutionContextProvider } from "./ExecutionContext";
import useMeasureServiceApi from "../../api/useMeasureServiceApi";
import * as _ from "lodash";
import StatusHandler from "../statusHandler/StatusHandler";

const TestCaseRoutes = () => {
  const [measureBundle, setMeasureBundle] = useState<Bundle>();
  const [valueSets, setValueSets] = useState<ValueSet[]>();
  const [errors, setErrors] = useState<Array<string>>([]);
  const [executionContextReady, setExecutionContextReady] = useState<boolean>();
  const [executing, setExecuting] = useState<boolean>();
  const [lastMeasure, setLastMeasure] = useState<any>();

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
      const compareTo = _.cloneDeep(measure);
      compareTo.testCases = null;
      if (measureBundle && lastMeasure && _.isEqual(lastMeasure, compareTo)) {
        return;
      }
      setLastMeasure(compareTo);
      setErrors(null);
      if (measure.cqlErrors || !measure.elmJson) {
        errors.push(
          "An error exists with the measure CQL, please review the CQL Editor tab."
        );
      }
      if (!measure.groups) {
        errors.push(
          "There are no groups associated with this measure. Please review the Groups tab."
        );
      }
      setErrors(errors);
      if (!errors) {
        measureService.current
          .fetchMeasureBundle(measure)
          .then((bundle: Bundle) => {
            setMeasureBundle(bundle);
          })
          .catch((err) => {
            errors.push(err.message);
            setErrors(errors);
          });
      }
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
          errors.push(err.message);
          setErrors(errors);
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
      {errors && errors.length > 0 && (
        <StatusHandler
          error={true}
          errorMessages={errors}
          testDataId="execution_context_loading_errors"
        ></StatusHandler>
      )}
      <Routes>
        <Route path="/measures/:measureId/edit/test-cases">
          <Route
            index
            element={<TestCaseLanding errors={errors} setErrors={setErrors} />}
          />
          <Route path="edit" element={<EditTestCase />} />
          <Route path=":id" element={<EditTestCase />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ExecutionContextProvider>
  );
};

export default TestCaseRoutes;
