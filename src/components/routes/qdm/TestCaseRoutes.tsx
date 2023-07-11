import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLandingQdm from "../../testCaseLanding/qdm/TestCaseLanding";
import EditTestCase from "../../editTestCase/qdm/EditTestCase";
import NotFound from "../../notfound/NotFound";
import StatusHandler from "../../statusHandler/StatusHandler";
import { Measure } from "@madie/madie-models";
import { measureStore } from "@madie/madie-util";
import { Bundle, ValueSet } from "fhir/r4";
import { CqmMeasure } from "cqm-models";
import useCqmConversionService from "../../../api/CqmModelConversionService";
import useTerminologyServiceApi from "../../../api/useTerminologyServiceApi";
import { QdmExecutionContextProvider } from "./QdmExecutionContext";

const TestCaseRoutes = () => {
  const [errors, setErrors] = useState<Array<string>>([]);

  // Following states are initialized just to provide them as props to contextProvider
  // we may need a new context provider for QDM
  const [executionContextReady, setExecutionContextReady] =
    useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>();
  const [measureBundle, setMeasureBundle] = useState<Bundle>();
  const [valueSets, setValueSets] = useState<ValueSet[]>();
  const [cqmMeasure, setCqmMeasure] = useState<CqmMeasure>();

  const cqmService = useRef(useCqmConversionService());
  const terminologyService = useRef(useTerminologyServiceApi());

  const [measure, setMeasure] = useState<Measure>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (measure) {
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

      //check for: convert madie measure to CQM measure and throw the error if there
      if (!errors?.length) {
        cqmService.current
          .convertToCqmMeasure(measure)
          .then((convertedMeasure) => {
            setCqmMeasure(convertedMeasure);
          });
      }
    }
  }, [measure]);

  useEffect(() => {
    if (cqmMeasure) {
      terminologyService.current
        .getQdmValueSetsExpansion(cqmMeasure)
        .then((vs: ValueSet[]) => {
          setValueSets(vs);
        })
        .catch((err) => {
          setErrors((prevState) => [...prevState, err.message]);
        });
    }
  }, [cqmMeasure]);

  // Setup a context provider which holds measure state, cqmMeasure and valueSets similar to QiCore/TestCaseRoutes
  return (
    <QdmExecutionContextProvider
      value={{
        measureState: [measure, setMeasure],
        cqmMeasureState: [cqmMeasure, setCqmMeasure],
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
          <Route path=":id" element={<EditTestCase />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QdmExecutionContextProvider>
  );
};

export default TestCaseRoutes;
