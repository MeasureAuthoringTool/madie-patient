import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLandingQdm from "../../testCaseLanding/qdm/TestCaseLanding";
import EditTestCase from "../../editTestCase/qdm/EditTestCase";
import NotFound from "../../notfound/NotFound";
import StatusHandler from "../../statusHandler/StatusHandler";
import { Measure, TestCaseImportOutcome } from "@madie/madie-models";
import { measureStore, useFeatureFlags } from "@madie/madie-util";
import { CqmMeasure, ValueSet } from "cqm-models";
import useCqmConversionService from "../../../api/CqmModelConversionService";
import useTerminologyServiceApi from "../../../api/useTerminologyServiceApi";
import { QdmExecutionContextProvider } from "./QdmExecutionContext";
import TestCaseLandingWrapper from "../../testCaseLanding/common/TestCaseLandingWrapper";
import RedirectToList from "../RedirectToList";
import _ from "lodash";

const TestCaseRoutes = () => {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [importWarnings, setImportWarnings] = useState<TestCaseImportOutcome[]>(
    []
  );
  const featureFlags = useFeatureFlags();
  const [executionContextReady, setExecutionContextReady] =
    useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>();
  const [contextFailure, setContextFailure] = useState<boolean>();
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
    const localErrors: Array<string> = [...errors];
    if (measure) {
      if (measure.cqlErrors || !measure.elmJson) {
        localErrors.push(
          "An error exists with the measure CQL, please review the CQL Editor tab."
        );
      }
      if (!measure?.groups?.length) {
        localErrors.push(
          "No Population Criteria is associated with this measure. Please review the Population Criteria tab."
        );
      }

      if (!localErrors.length) {
        cqmService.current
          .convertToCqmMeasure(measure)
          .then((convertedMeasure) => {
            if (convertedMeasure) {
              getQdmValueSets(convertedMeasure);
            }
          })
          .catch((err) => {
            setContextFailure(true);
            localErrors.push(
              "An error occurred, please try again. If the error persists, please contact the help desk"
            );
          });
      }
      setErrors(localErrors);
    }
  }, [measure]);

  const getQdmValueSets = (convertedMeasure) => {
    const drcValueSets: ValueSet[] =
      terminologyService.current.getValueSetsForDRCs(convertedMeasure);

    terminologyService.current
      .getQdmValueSetsExpansion(convertedMeasure)
      .then((vs: ValueSet[]) => {
        setCqmMeasure({
          ...convertedMeasure,
          value_sets: [...vs, ...drcValueSets],
        });
      })
      .catch((err) => {
        setContextFailure(true);
        setErrors((prevState) => [...prevState, err.message]);
      });
  };

  useEffect(() => {
    setExecutionContextReady(
      !!cqmMeasure && !_.isEmpty(cqmMeasure?.value_sets) && !!measure
    );
  }, [cqmMeasure, measure]);
  return (
    <QdmExecutionContextProvider
      value={{
        measureState: [measure, setMeasure],
        cqmMeasureState: [cqmMeasure, setCqmMeasure],
        executionContextReady,
        executing,
        setExecuting,
        contextFailure,
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
        <StatusHandler
          importWarnings={importWarnings}
          testDataId="import-warning-messages"
        />
      )}
      <Routes>
        <Route path="/measures/:measureId/edit/test-cases/list-page">
          {featureFlags?.includeSDEValues && (
            <Route
              path="/measures/:measureId/edit/test-cases/list-page/sde"
              element={<TestCaseLandingWrapper children={<div />} />}
            />
          )}
          <Route
            index
            element={
              <TestCaseLandingWrapper
                qdm
                children={
                  <TestCaseLandingQdm
                    errors={errors}
                    setErrors={setErrors}
                    setWarnings={setImportWarnings}
                  />
                }
              />
            }
          />
          <Route
            path=":criteriaId"
            element={
              <TestCaseLandingWrapper
                qdm
                children={
                  <TestCaseLandingQdm
                    errors={errors}
                    setErrors={setErrors}
                    setWarnings={setImportWarnings}
                  />
                }
              />
            }
          />
        </Route>

        <Route
          path="/measures/:measureId/edit/test-cases"
          element={<RedirectToList />}
        ></Route>

        <Route path="/measures/:measureId/edit/test-cases/:id">
          <Route index element={<EditTestCase />} />
          <Route path=":id" index element={<EditTestCase />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </QdmExecutionContextProvider>
  );
};

export default TestCaseRoutes;
