import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLanding from "../../testCaseLanding/qiCore/TestCaseLanding";
import EditTestCase from "../../editTestCase/qiCore/EditTestCase";
import NotFound from "../../notfound/NotFound";
import { measureStore } from "@madie/madie-util";
import { Bundle, ValueSet } from "fhir/r4";
import useTerminologyServiceApi from "../../../api/useTerminologyServiceApi";
import { ExecutionContextProvider } from "./ExecutionContext";
import useMeasureServiceApi from "../../../api/useMeasureServiceApi";
import * as _ from "lodash";
import StatusHandler from "../../statusHandler/StatusHandler";
import {
  Measure,
  MeasureErrorType,
  TestCaseImportOutcome,
} from "@madie/madie-models";

export const CQL_RETURN_TYPES_MISMATCH_ERROR =
  "One or more Population Criteria has a mismatch with CQL return types. Test Cases cannot be executed until this is resolved.";

const TestCaseRoutes = () => {
  const [measureBundle, setMeasureBundle] = useState<Bundle>();
  const [valueSets, setValueSets] = useState<ValueSet[]>();
  const [errors, setErrors] = useState<Array<string>>([]);
  const [importWarnings, setImportWarnings] = useState<TestCaseImportOutcome[]>(
    []
  );
  const [executionContextReady, setExecutionContextReady] = useState<boolean>();
  const [executing, setExecuting] = useState<boolean>();
  const [lastMeasure, setLastMeasure] = useState<any>();

  const terminologyService = useRef(useTerminologyServiceApi());
  const measureService = useRef(useMeasureServiceApi());

  const [measure, setMeasure] = useState<Measure>();
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
      setErrors(() => []);
      if (measure.cqlErrors || !measure.elmJson) {
        setErrors((prevState) => [
          ...prevState,
          "An error exists with the measure CQL, please review the CQL Editor tab.",
        ]);
      }
      if (!measure?.groups?.length) {
        setErrors((prevState) => [
          ...prevState,
          "No Population Criteria is associated with this measure. Please review the Population Criteria tab.",
        ]);
      }
      if (!errors?.length) {
        measureService.current
          .fetchMeasureBundle(measure)
          .then((bundle: Bundle) => {
            setMeasureBundle(bundle);
          })
          .catch((err) => {
            setErrors((prevState) => [...prevState, err.message]);
          });
      }
      setErrors((prevState) => {
        if (
          measure?.errors?.includes(
            MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES
          )
        ) {
          return [...prevState, CQL_RETURN_TYPES_MISMATCH_ERROR];
        }
        return [
          ...prevState.filter((s) => s !== CQL_RETURN_TYPES_MISMATCH_ERROR),
        ];
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
          setErrors((prevState) => [...prevState, err.message]);
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
        />
      )}
      {importWarnings && importWarnings.length > 0 && (
        <StatusHandler importWarnings={importWarnings} />
      )}
      <Routes>
        <Route path="/measures/:measureId/edit/test-cases">
          <Route
            index
            element={
              <TestCaseLanding
                errors={errors}
                setErrors={setErrors}
                setWarnings={setImportWarnings}
              />
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
