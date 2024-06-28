import React, { useEffect, useCallback, useRef, useState } from "react";
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
import SDEPage from "../../testCaseConfiguration/sde/SDEPage";
import Expansion from "../../testCaseConfiguration/expansion/Expansion";
import TestCaseData from "../../testCaseConfiguration/testCaseData/TestCaseData";

const TestCaseRoutes = () => {
  const [cqmMeasureErrors, setCqmMeasureErrors] = useState<Array<string>>([]);
  const [importWarnings, setImportWarnings] = useState<TestCaseImportOutcome[]>(
    []
  );
  const [importErrors, setImportErrors] = useState<Array<string>>([]);
  const featureFlags = useFeatureFlags();
  const [executionContextReady, setExecutionContextReady] =
    useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>();
  const [contextFailure, setContextFailure] = useState<boolean>();
  const [cqmMeasure, setCqmMeasure] = useState<CqmMeasure>();

  const cqmService = useRef(useCqmConversionService());
  const terminologyService = useRef(useTerminologyServiceApi());

  const prevMeasureRef = useRef(null);
  const [measure, setMeasure] = useState<Measure>(measureStore.state);

  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const cqmMeasureConvertAbortController = useRef<AbortController>(
    new AbortController()
  );
  const getValueSetAbortController = useRef<AbortController>(
    new AbortController()
  );
  // arbitraty number that's just supposed to increment on abort calls
  // sole purpose is only to spin off the useEffect that typically listens for measure changes
  const [aborted, setAborted] = useState(0);
  // instantiating both at once is not the play here.
  // we instantiate only once on load. We abort individually, instantiate individually through the useEffect
  const onAbort = useCallback(async () => {
    // TODO: gracefully fail when we abort so that the cqmMeasure begins a rebuild
    if (!cqmMeasureConvertAbortController.current.signal.aborted) {
      cqmMeasureConvertAbortController.current.abort();
    }
    if (!getValueSetAbortController.current.signal.aborted) {
      getValueSetAbortController.current.abort();
    }
  }, [
    cqmMeasureConvertAbortController.current,
    getValueSetAbortController.current,
  ]);
  const handleAbort = () => {
    setAborted(aborted + 1);
  };
  useEffect(() => {
    // only run updates if measure has changed, ignoring test cases
    if (
      _.isNil(prevMeasureRef.current) ||
      !_.isEqual(
        {
          ...measure,
          testCases: null,
        },
        { ...prevMeasureRef.current, testCases: null }
      )
    ) {
      prevMeasureRef.current = measure;
      setContextFailure(null);
      setCqmMeasure(null);
      setExecutionContextReady(false);
      // cut the lines on previous calls to prevent overlapping state updates
      // getValueSetAbortController.current.abort(); // this abort triggers a catch block that stops the rest of this.
      const localErrors: Array<string> = [];
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
          onAbort();
          cqmMeasureConvertAbortController.current = new AbortController();
          cqmService.current
            .convertToCqmMeasure(
              measure,
              cqmMeasureConvertAbortController.current
            )
            .then((convertedMeasure: any) => {
              if (convertedMeasure) {
                getValueSetAbortController.current = new AbortController();
                getQdmValueSets(convertedMeasure);
              }
            })
            .catch((err) => {
              if (err.name === "CanceledError") {
                handleAbort();
                return;
                // not doing anything else after this, we're looping back in
              }
              // Added a console log because anytime this fails, we get an error banner with no other information
              console.error(
                "An error occurred while converting to CQM measure: ",
                err
              );
              setContextFailure(true);
              setCqmMeasureErrors((prevState) => [
                ...prevState,
                "An error occurred, please try again. If the error persists, please contact the help desk",
              ]);
            });
        }
        setCqmMeasureErrors((prevState) => [...prevState, ...localErrors]);
      }
    }
  }, [measure, aborted]);
  //given a converted measure, append valuesets to it using the service
  const getQdmValueSets = async (convertedMeasure: CqmMeasure) => {
    try {
      const drcValueSets: ValueSet[] =
        terminologyService.current.getValueSetsForDRCs(convertedMeasure);
      const vs = await terminologyService.current.getQdmValueSetsExpansion(
        convertedMeasure,
        measure.testCaseConfiguration?.manifestExpansion,
        featureFlags.manifestExpansion,
        getValueSetAbortController.current.signal
      );
      const newCqmMeasure = {
        ...convertedMeasure,
        value_sets: [...vs, ...drcValueSets],
      };
      setCqmMeasure(newCqmMeasure);
      setExecutionContextReady(
        !!newCqmMeasure && !_.isEmpty(newCqmMeasure?.value_sets) && !!measure
      );
      if (cqmMeasureErrors) {
        setCqmMeasureErrors(
          cqmMeasureErrors.filter((err) => {
            !err.includes("VSAC");
          })
        );
      }
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        handleAbort();
      } else {
        setContextFailure(true);
        setCqmMeasureErrors((prevState) => [...prevState, e.message]);
      }
    }
  };

  return (
    <QdmExecutionContextProvider
      value={{
        measureState: [measure, setMeasure],
        cqmMeasureState: [cqmMeasure, setCqmMeasure],
        executionContextReady,
        setExecutionContextReady,
        executing,
        setExecuting,
        contextFailure,
      }}
    >
      {cqmMeasureErrors && cqmMeasureErrors.length > 0 && (
        <StatusHandler
          error={true}
          errorMessages={cqmMeasureErrors}
          testDataId="execution_context_loading_errors"
        />
      )}
      {importErrors && importErrors.length > 0 && (
        <StatusHandler
          error={true}
          errorMessages={importErrors}
          testDataId="import-error-messages"
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
              element={<TestCaseLandingWrapper qdm children={<SDEPage />} />}
            />
          )}
          {featureFlags?.manifestExpansion && (
            <Route
              path="/measures/:measureId/edit/test-cases/list-page/expansion"
              element={<TestCaseLandingWrapper qdm children={<Expansion />} />}
            />
          )}
          {featureFlags?.ShiftTestCasesDates && (
            <Route
              path="/measures/:measureId/edit/test-cases/list-page/test-case-data"
              element={
                <TestCaseLandingWrapper qdm children={<TestCaseData />} />
              }
            />
          )}
          <Route
            index
            element={
              <TestCaseLandingWrapper
                qdm
                children={
                  <TestCaseLandingQdm
                    errors={cqmMeasureErrors}
                    setErrors={setCqmMeasureErrors}
                    setWarnings={setImportWarnings}
                    setImportErrors={setImportErrors}
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
                    errors={cqmMeasureErrors}
                    setErrors={setCqmMeasureErrors}
                    setWarnings={setImportWarnings}
                    setImportErrors={setImportErrors}
                  />
                }
              />
            }
          />
        </Route>

        <Route
          path="/measures/:measureId/edit/test-cases"
          element={<RedirectToList />}
        />

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
