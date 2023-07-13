import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLandingQdm from "../../testCaseLanding/qdm/TestCaseLanding";
import EditTestCase from "../../editTestCase/qdm/EditTestCase";
import NotFound from "../../notfound/NotFound";
import StatusHandler from "../../statusHandler/StatusHandler";
import { Measure } from "@madie/madie-models";
import { measureStore } from "@madie/madie-util";
import { CqmMeasure, ValueSet } from "cqm-models";
import useCqmConversionService from "../../../api/CqmModelConversionService";
import useTerminologyServiceApi from "../../../api/useTerminologyServiceApi";
import { QdmExecutionContextProvider } from "./QdmExecutionContext";

const TestCaseRoutes = () => {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [executionContextReady, setExecutionContextReady] =
    useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>();
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

      if (!errors?.length) {
        cqmService.current
          .convertToCqmMeasure(measure)
          .then((convertedMeasure) => {
            setCqmMeasure(convertedMeasure);
          })
          .catch((err) => {
            setErrors((prevState) => [
              ...prevState,
              "An error occurred, please try again. If the error persists, please contact the help desk",
            ]);
          });
      }
    }
  }, [measure]);

  useEffect(() => {
    if (cqmMeasure) {
      // currently the value of cqmMeasure.vakue_sets will be always empty array
      // value_sets implementation will be done in MAT-5918
      setValueSets([]);
    }
  }, [cqmMeasure]);

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
